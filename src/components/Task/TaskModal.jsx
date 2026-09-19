import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bell, Repeat, Tag, AlertCircle, Save } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getTodayISO, getCurrentTimeISO } from '../../utils/dateUtils';

export const TaskModal = ({ isOpen, onClose, onSave, taskToEdit = null }) => {
  const { categories, settings } = useSettings();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('College');
  const [priority, setPriority] = useState('high');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [dueTime, setDueTime] = useState(getCurrentTimeISO());
  const [reminderTime, setReminderTime] = useState(settings.defaultReminderTime || '15_min');
  const [repeatType, setRepeatType] = useState('none');
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'College');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.due_date || getTodayISO());
      setDueTime(taskToEdit.due_time || getCurrentTimeISO());
      setReminderTime(taskToEdit.reminder_time || '15_min');
      setRepeatType(taskToEdit.repeat_type || 'none');
      setAlarmEnabled(taskToEdit.alarm_enabled ?? true);
      setNotificationEnabled(taskToEdit.notification_enabled ?? true);
    } else {
      setTitle('');
      setDescription('');
      setCategory(categories[0]?.name || 'College');
      setPriority('high');
      setDueDate(getTodayISO());
      setDueTime(getCurrentTimeISO());
      setReminderTime(settings.defaultReminderTime || '15_min');
      setRepeatType('none');
      setAlarmEnabled(true);
      setNotificationEnabled(true);
    }
    setErrorMsg('');
  }, [taskToEdit, isOpen, categories, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a task title');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      due_date: dueDate,
      due_time: dueTime,
      reminder_time: reminderTime,
      repeat_type: repeatType,
      alarm_enabled: alarmEnabled,
      notification_enabled: notificationEnabled
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-handle"></div>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Complete Java Assignment"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Add details, instructions, or sub-notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Priority</label>
              <div className="priority-selector">
                <button
                  type="button"
                  className={`priority-opt high ${priority === 'high' ? 'active' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  🔴 High
                </button>
                <button
                  type="button"
                  className={`priority-opt medium ${priority === 'medium' ? 'active' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  🟡 Med
                </button>
                <button
                  type="button"
                  className={`priority-opt low ${priority === 'low' ? 'active' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  🟢 Low
                </button>
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Due Time</label>
              <input
                type="time"
                className="form-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Set Reminder</label>
              <select
                className="form-select"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              >
                <option value="at_time">At task time</option>
                <option value="5_min">5 minutes before</option>
                <option value="10_min">10 minutes before</option>
                <option value="15_min">15 minutes before</option>
                <option value="30_min">30 minutes before</option>
                <option value="1_hour">1 hour before</option>
                <option value="1_day">1 day before</option>
                <option value="none">No reminder</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Repeat Option</label>
              <select
                className="form-select"
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Every day</option>
                <option value="weekly">Every week</option>
                <option value="monthly">Every month</option>
              </select>
            </div>
          </div>

          <div className="toggle-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={alarmEnabled}
                onChange={(e) => setAlarmEnabled(e.target.checked)}
              />
              <span>Play Alarm Sound when due</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
              />
              <span>Send Push Notification</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              <Save size={16} />
              <span>{taskToEdit ? 'Save Changes' : 'Save Task'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--priority-high-bg);
          color: var(--priority-high);
          border: 1px solid var(--priority-high-border);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (min-width: 520px) {
          .form-row {
            flex-direction: row;
            gap: 14px;
          }
        }

        .flex-1 {
          flex: 1;
        }

        .priority-selector {
          display: flex;
          gap: 6px;
        }

        .priority-opt {
          flex: 1;
          padding: 12px 6px;
          min-height: 44px;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .priority-opt.high.active {
          background: var(--priority-high-bg);
          color: var(--priority-high);
          border-color: var(--priority-high);
        }

        .priority-opt.medium.active {
          background: var(--priority-medium-bg);
          color: var(--priority-medium);
          border-color: var(--priority-medium);
        }

        .priority-opt.low.active {
          background: var(--priority-low-bg);
          color: var(--priority-low);
          border-color: var(--priority-low);
        }

        .toggle-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
          margin-bottom: 24px;
          padding: 14px;
          background: var(--bg-glass);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-primary);
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};
