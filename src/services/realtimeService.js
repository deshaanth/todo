// Real-Time Synchronization Engine (BroadcastChannel, Cross-Tab & Backend Sync)

const CHANNEL_NAME = 'smarttask_realtime_channel_v1';
let channel = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel initialization failed, falling back to storage listener:', e);
  }
}

const listeners = new Set();
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

// Network status listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    realtimeService.notifyListeners({ type: 'NETWORK_CHANGE', isOnline: true });
  });

  window.addEventListener('offline', () => {
    isOnline = false;
    realtimeService.notifyListeners({ type: 'NETWORK_CHANGE', isOnline: false });
  });

  // Cross-tab fallback via localStorage storage event
  window.addEventListener('storage', (e) => {
    if (e.key === 'smarttask_tasks_v1' || e.key === 'smarttask_settings_v1') {
      realtimeService.notifyListeners({
        type: 'STORAGE_CHANGE',
        key: e.key,
        newValue: e.newValue
      });
    }
  });
}

// Receive messages on BroadcastChannel
if (channel) {
  channel.onmessage = (event) => {
    if (event && event.data) {
      realtimeService.notifyListeners(event.data);
    }
  };
}

export const realtimeService = {
  isOnline: () => isOnline,

  subscribe: (callback) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },

  notifyListeners: (eventData) => {
    listeners.forEach(fn => {
      try {
        fn(eventData);
      } catch (err) {
        console.error('Error in realtime listener:', err);
      }
    });
  },

  broadcast: (type, payload = {}) => {
    const eventData = {
      type,
      payload,
      timestamp: Date.now(),
      senderId: window.name || 'tab_' + Math.random().toString(36).substring(2, 6)
    };

    // Emit locally
    realtimeService.notifyListeners(eventData);

    // Broadcast across browser tabs / windows
    if (channel) {
      try {
        channel.postMessage(eventData);
      } catch (e) {
        console.error('BroadcastChannel error:', e);
      }
    }
  },

  // Cloud & Server HTTP sync method
  syncWithBackend: async (tasks) => {
    try {
      const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
        ? import.meta.env.VITE_API_URL 
        : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
          ? window.location.origin
          : 'https://temporary-spry-cedar-98ao9oj.vercel.app';

      const response = await fetch(`${baseUrl}/api/tasks/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      // Graceful silent fallback if standalone backend server is offline or unreachable
      return null;
    }
  }
};
