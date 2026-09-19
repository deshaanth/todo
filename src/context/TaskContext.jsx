import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { notificationService } from '../services/notificationService';
import { realtimeService } from '../services/realtimeService';
import {
  getTaskReminderTimestamp,
  checkIfOverdue,
  getNextRecurringDate,
  getTodayISO
} from '../utils/dateUtils';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { settings } = useSettings();

  const [tasks, setTasks] = useState([]);
  const [activeAlarmTask, setActiveAlarmTask] = useState(null);
  const [dismissedReminders, setDismissedReminders] = useState({}); // taskId -> timestamp
  const [snoozedReminders, setSnoozedReminders] = useState({}); // taskId -> nextReminderMs
  const [isRealtimeSynced, setIsRealtimeSynced] = useState(true);
  const [nowMs, setNowMs] = useState(Date.now());

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, high, medium, low
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, Work, College, etc.
  const [statusFilter, setStatusFilter] = useState('all'); // all, Pending, In Progress, Overdue, Completed
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

  // Load tasks on user change
  const reloadTasksFromStorage = useCallback(() => {
    if (currentUser?.id) {
      const loaded = storageService.getTasks(currentUser.id);
      setTasks(loaded);
    }
  }, [currentUser]);

  useEffect(() => {
    reloadTasksFromStorage();
  }, [reloadTasksFromStorage]);

  // Persist tasks whenever tasks change locally
  useEffect(() => {
    if (currentUser?.id) {
      storageService.saveTasks(tasks, currentUser.id);
      realtimeService.syncWithBackend(tasks);
    }
  }, [tasks, currentUser]);

  // Real-Time Event Subscription (Cross-tab & network updates)
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((event) => {
      if (event.type === 'NETWORK_CHANGE') {
        setIsRealtimeSynced(event.isOnline);
      } else if (
        event.type === 'TASK_MUTATED' ||
        event.type === 'STORAGE_CHANGE'
      ) {
        reloadTasksFromStorage();
      }
    });

    return () => unsubscribe();
  }, [reloadTasksFromStorage]);

  // Live 1-second ticker for real-time countdown badges & timer updates
  useEffect(() => {
    const ticker = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Check and update overdue status dynamically
  const checkOverdueTasks = useCallback(() => {
    setTasks(prev => {
      let changed = false;
      const updated = prev.map(task => {
        if (task.status !== 'Completed') {
          const isNowOverdue = checkIfOverdue(task.due_date, task.due_time, task.status);
          if (isNowOverdue && task.status !== 'Overdue') {
            changed = true;
            return { ...task, status: 'Overdue' };
          }
        }
        return task;
      });
      return changed ? updated : prev;
    });
  }, []);

  // Background Reminder Check Engine (runs every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      checkOverdueTasks();

      const now = Date.now();
      tasks.forEach(task => {
        if (task.status === 'Completed') return;
        if (activeAlarmTask) return; // Wait if an alarm is already sounding

        // Determine if task reminder has snoozed time override
        let reminderTimeMs = snoozedReminders[task.task_id];
        if (!reminderTimeMs) {
          reminderTimeMs = getTaskReminderTimestamp(
            task.due_date,
            task.due_time,
            task.reminder_time
          );
        }

        // Check if reminder is due right now (within 60 seconds interval window)
        const isDueNow = reminderTimeMs > 0 && Math.abs(now - reminderTimeMs) <= 60000;
        const alreadyDismissed = dismissedReminders[task.task_id] && (now - dismissedReminders[task.task_id] < 120000);

        if (isDueNow && !alreadyDismissed && (task.alarm_enabled || task.notification_enabled)) {
          // Trigger alarm overlay & sound
          setActiveAlarmTask(task);

          if (settings.enableAlarm && task.alarm_enabled) {
            soundService.playAlarm(settings.alarmSound, settings.alarmVolume);
          }

          if (settings.enableNotifications && task.notification_enabled) {
            notificationService.sendNotification(task, settings);
          }
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [tasks, activeAlarmTask, dismissedReminders, snoozedReminders, settings, checkOverdueTasks]);

  // CRUD Operations with Real-Time Event Broadcasts
  const addTask = (taskData) => {
    const newTask = {
      task_id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: currentUser?.id || 'default_user',
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'Other',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || getTodayISO(),
      due_time: taskData.due_time || '18:00',
      reminder_time: taskData.reminder_time || settings.defaultReminderTime || '15_min',
      repeat_type: taskData.repeat_type || 'none',
      status: 'Pending',
      alarm_enabled: taskData.alarm_enabled ?? true,
      notification_enabled: taskData.notification_enabled ?? true,
      created_at: new Date().toISOString(),
      completed_at: null
    };

    setTasks(prev => [newTask, ...prev]);
    realtimeService.broadcast('TASK_MUTATED', { action: 'add', task: newTask });
    return newTask;
  };

  const updateTask = (taskId, updatedFields) => {
    setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, ...updatedFields } : t));
    realtimeService.broadcast('TASK_MUTATED', { action: 'update', taskId, updatedFields });
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.task_id !== taskId));
    if (activeAlarmTask?.task_id === taskId) {
      dismissAlarm();
    }
    realtimeService.broadcast('TASK_MUTATED', { action: 'delete', taskId });
  };

  const toggleCompleteTask = (taskId) => {
    let completedTaskObj = null;

    setTasks(prev => {
      return prev.map(t => {
        if (t.task_id === taskId) {
          const isCompleted = t.status === 'Completed';
          const newStatus = isCompleted ? 'Pending' : 'Completed';
          completedTaskObj = {
            ...t,
            status: newStatus,
            completed_at: isCompleted ? null : new Date().toISOString()
          };
          return completedTaskObj;
        }
        return t;
      });
    });

    if (activeAlarmTask?.task_id === taskId) {
      dismissAlarm();
    }

    realtimeService.broadcast('TASK_MUTATED', { action: 'toggle', taskId });

    // Handle Recurring Task creation on completion
    if (completedTaskObj && completedTaskObj.status === 'Completed' && completedTaskObj.repeat_type !== 'none') {
      const nextDate = getNextRecurringDate(completedTaskObj.due_date, completedTaskObj.repeat_type);
      if (nextDate) {
        addTask({
          title: completedTaskObj.title,
          description: completedTaskObj.description,
          category: completedTaskObj.category,
          priority: completedTaskObj.priority,
          due_date: nextDate,
          due_time: completedTaskObj.due_time,
          reminder_time: completedTaskObj.reminder_time,
          repeat_type: completedTaskObj.repeat_type,
          alarm_enabled: completedTaskObj.alarm_enabled,
          notification_enabled: completedTaskObj.notification_enabled
        });
      }
    }
  };

  const dismissAlarm = () => {
    if (activeAlarmTask) {
      setDismissedReminders(prev => ({
        ...prev,
        [activeAlarmTask.task_id]: Date.now()
      }));
      setActiveAlarmTask(null);
      soundService.stopAlarm();
    }
  };

  const snoozeAlarm = (minutes = 10) => {
    if (activeAlarmTask) {
      const snoozeUntilMs = Date.now() + minutes * 60 * 1000;
      setSnoozedReminders(prev => ({
        ...prev,
        [activeAlarmTask.task_id]: snoozeUntilMs
      }));
      setActiveAlarmTask(null);
      soundService.stopAlarm();
    }
  };

  // Filtered Task Computation
  const filteredTasks = tasks.filter(task => {
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Priority
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Category
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

    // Status
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;

    // Date
    if (dateFilter === 'today') {
      if (task.due_date !== getTodayISO()) return false;
    }

    return true;
  });

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleCompleteTask,
      activeAlarmTask,
      dismissAlarm,
      snoozeAlarm,
      searchQuery,
      setSearchQuery,
      priorityFilter,
      setPriorityFilter,
      categoryFilter,
      setCategoryFilter,
      statusFilter,
      setStatusFilter,
      dateFilter,
      setDateFilter,
      isRealtimeSynced,
      nowMs
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

