// LocalStorage and Data Seed Service

import { getTodayISO } from '../utils/dateUtils';

const KEYS = {
  TASKS: 'smarttask_tasks_v2',
  SETTINGS: 'smarttask_settings_v1',
  USERS: 'smarttask_users_v1',
  CURRENT_USER: 'smarttask_current_user_v1',
  CATEGORIES: 'smarttask_categories_v1'
};

export const DEFAULT_CATEGORIES = [
  { id: 'college', name: 'College', color: '#6366f1', icon: 'GraduationCap' },
  { id: 'work', name: 'Work', color: '#3b82f6', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal', color: '#ec4899', icon: 'User' },
  { id: 'shopping', name: 'Shopping', color: '#10b981', icon: 'ShoppingCart' },
  { id: 'health', name: 'Health', color: '#f59e0b', icon: 'HeartPulse' },
  { id: 'other', name: 'Other', color: '#8b5cf6', icon: 'Folder' }
];

export const DEFAULT_SETTINGS = {
  enableNotifications: true,
  enableAlarm: true,
  enableVibration: true,
  defaultReminderTime: '15_min',
  alarmSound: 'chime',
  alarmVolume: 0.8,
  defaultSnoozeDuration: '10_min',
  theme: 'dark'
};

const INITIAL_SAMPLE_TASKS = [];

export const storageService = {
  getTasks: (userId = 'default_user') => {
    try {
      const raw = localStorage.getItem(KEYS.TASKS);
      if (!raw) {
        localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_SAMPLE_TASKS));
        return [];
      }
      const tasks = JSON.parse(raw);
      return tasks.filter(t => t.user_id === userId || !t.user_id);
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return [];
    }
  },

  saveTasks: (tasks, userId = 'default_user') => {
    try {
      const raw = localStorage.getItem(KEYS.TASKS);
      let allTasks = raw ? JSON.parse(raw) : [];
      // Replace user's tasks while preserving other users' tasks
      allTasks = allTasks.filter(t => t.user_id !== userId && t.user_id !== undefined);
      allTasks = [...allTasks, ...tasks];
      localStorage.setItem(KEYS.TASKS, JSON.stringify(allTasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  },

  getSettings: () => {
    try {
      const raw = localStorage.getItem(KEYS.SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getCategories: () => {
    try {
      const raw = localStorage.getItem(KEYS.CATEGORIES);
      return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories: (categories) => {
    try {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  },

  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(KEYS.CURRENT_USER);
      return raw ? JSON.parse(raw) : { id: 'default_user', name: 'John Doe', email: 'john@smarttask.app' };
    } catch (e) {
      return { id: 'default_user', name: 'John Doe', email: 'john@smarttask.app' };
    }
  },

  saveCurrentUser: (user) => {
    try {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save current user:', e);
    }
  }
};
