// Notification & Vibration Service

export const notificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  getPermissionState: () => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  },

  sendNotification: (task, settings) => {
    if (!settings?.enableNotifications) return;
    
    // Trigger device vibration if enabled
    if (settings?.enableVibration && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 300]);
      } catch (e) {
        console.warn('Vibration error:', e);
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      const priorityLabel = task.priority === 'high' ? '🔴 High Priority Task'
                          : task.priority === 'medium' ? '🟡 Medium Priority Task'
                          : '🟢 Low Priority Task';

      const title = `${priorityLabel}: ${task.title}`;
      const options = {
        body: `Due at ${task.due_time || 'today'}${task.category ? ` • Category: ${task.category}` : ''}\n${task.description || ''}`,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        tag: `task-reminder-${task.task_id}`,
        requireInteraction: true
      };

      try {
        const notif = new Notification(title, options);
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Desktop notification spawn failed:', e);
      }
    }
  }
};
