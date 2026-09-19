// Date Utilities for SmartTask

export const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentTimeISO = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const today = getTodayISO();
  const dateObj = new Date(dateStr + 'T00:00:00');
  
  // Tomorrow check
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';

  return dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDisplayTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(h, 10), parseInt(m, 10));
  return dateObj.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Calculate exact timestamp (in ms) when task is due
export const getTaskDueTimestamp = (dueDateStr, dueTimeStr) => {
  if (!dueDateStr) return 0;
  const timePart = dueTimeStr || '23:59';
  const isoString = `${dueDateStr}T${timePart}:00`;
  return new Date(isoString).getTime();
};

// Calculate exact timestamp (in ms) when reminder should fire
export const getTaskReminderTimestamp = (dueDateStr, dueTimeStr, reminderOption) => {
  const dueMs = getTaskDueTimestamp(dueDateStr, dueTimeStr);
  if (!dueMs) return 0;

  let offsetMinutes = 0;
  switch (reminderOption) {
    case '5_min': offsetMinutes = 5; break;
    case '10_min': offsetMinutes = 10; break;
    case '15_min': offsetMinutes = 15; break;
    case '30_min': offsetMinutes = 30; break;
    case '1_hour': offsetMinutes = 60; break;
    case '1_day': offsetMinutes = 1440; break;
    case 'at_time':
    default:
      offsetMinutes = 0;
      break;
  }

  return dueMs - offsetMinutes * 60 * 1000;
};

// Check if a task is overdue
export const checkIfOverdue = (dueDateStr, dueTimeStr, status) => {
  if (status === 'Completed') return false;
  const dueMs = getTaskDueTimestamp(dueDateStr, dueTimeStr);
  if (!dueMs) return false;
  return dueMs < Date.now();
};

// Check if a task is due within the next 2 hours
export const checkIfNearDeadline = (dueDateStr, dueTimeStr, status) => {
  if (status === 'Completed') return false;
  const dueMs = getTaskDueTimestamp(dueDateStr, dueTimeStr);
  const now = Date.now();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return dueMs > now && (dueMs - now) <= twoHoursMs;
};

// Compute next recurring date string given a date string and repeat option
export const getNextRecurringDate = (currentDateStr, repeatType) => {
  const d = new Date(currentDateStr + 'T00:00:00');
  switch (repeatType) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    default:
      return null;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
