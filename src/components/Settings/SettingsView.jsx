import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  Vibrate,
  Clock,
  Sun,
  Moon,
  Tag,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Share2,
  LayoutGrid,
  Flame,
  CheckSquare
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { soundService } from '../../services/soundService';
import { notificationService } from '../../services/notificationService';
import { storageService } from '../../services/storageService';

export const SettingsView = () => {
  const { settings, updateSettings, categories, addCategory, deleteCategory } = useSettings();

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [widgetFilter, setWidgetFilter] = useState('urgent'); // urgent, today, all

  useEffect(() => {
    // Check if app is running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredInstallPrompt(null);
    } else {
      alert('To install SmartTask:\n\n• On iOS (Safari): Tap the Share icon & select "Add to Home Screen".\n• On Android (Chrome): Tap the 3 dots menu & select "Install App" or "Add to Home Screen".');
    }
  };

  const handleTestSound = () => {
    soundService.previewSound(settings.alarmSound, settings.alarmVolume);
  };

  const handleTestNotif = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      notificationService.sendNotification({
        task_id: 'test',
        title: 'Test Notification',
        priority: 'high',
        due_time: 'Now',
        category: 'Test',
        description: 'SmartTask notification system is working perfectly!'
      }, settings);
    } else {
      alert('Notification permission not granted.');
    }
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catObj = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      color: newCatColor
    };
    addCategory(catObj);
    setNewCatName('');
  };

  const handleExportData = () => {
    const data = {
      tasks: storageService.getTasks(),
      settings,
      categories
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarttask_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.tasks) storageService.saveTasks(imported.tasks);
        if (imported.settings) updateSettings(imported.settings);
        alert('Data imported successfully! Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>App Settings</h1>
        <p className="subheading">Customize alarms, notifications, widgets, categories and themes.</p>
      </div>

      <div className="settings-grid">
        {/* Mobile App Download & Installation Card */}
        <div className="settings-card glass-card install-app-card">
          <div className="card-header">
            <Smartphone size={22} className="header-icon" />
            <h2>Download & Install Mobile App</h2>
          </div>

          <div className="install-card-body">
            <p className="install-desc">
              Install <strong>SmartTask</strong> directly on your mobile device or desktop. It runs full-screen like a native mobile app, works offline, and <strong>automatically updates</strong> whenever new features are released!
            </p>

            {isAppInstalled ? (
              <div className="installed-badge-box">
                <CheckCircle2 size={20} color="#34d399" />
                <span>SmartTask App is installed on this device!</span>
              </div>
            ) : (
              <div className="install-actions">
                <button className="btn btn-primary" onClick={handleInstallPWA}>
                  <Download size={18} />
                  <span>Install SmartTask App</span>
                </button>
              </div>
            )}

            <div className="install-instructions">
              <span className="inst-title">How to Install on Mobile:</span>
              <ul>
                <li><strong>Android (Chrome/Edge):</strong> Tap the <code>Install App</code> button above, or tap browser <code>⋮ Menu → Add to Home Screen</code>.</li>
                <li><strong>iOS (iPhone Safari):</strong> Tap the <Share2 size={13} inline /> <code>Share</code> button at the bottom of Safari → select <code>Add to Home Screen</code>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Home Screen Widget Card */}
        <div className="settings-card glass-card widget-config-card">
          <div className="card-header">
            <LayoutGrid size={22} className="header-icon" />
            <h2>Mobile Home Screen Widget</h2>
          </div>

          <div className="widget-config-body">
            <p className="install-desc">
              Pin a <strong>SmartTask Home Screen Widget</strong> on your mobile launcher to track deadlines and complete tasks directly from your phone's home screen!
            </p>

            {/* Live Widget Preview Card */}
            <div className="widget-preview-box">
              <div className="preview-top">
                <div className="preview-title-row">
                  <Flame size={16} color="#ff5c5c" />
                  <span className="preview-name">SmartTask Widget (3x2)</span>
                </div>
                <span className="preview-badge">LIVE PREVIEW</span>
              </div>

              <div className="preview-items">
                <div className="preview-item">
                  <CheckSquare size={16} color="#ff5c5c" />
                  <span className="preview-task-text">🔴 Submit Project Report</span>
                  <span className="preview-task-time">7:00 PM</span>
                </div>
                <div className="preview-item">
                  <CheckSquare size={16} color="#fbbf24" />
                  <span className="preview-task-text">🟡 Complete Java Assignment</span>
                  <span className="preview-task-time">8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="widget-guide-text">
              <span className="inst-title">How to Add Widget to Home Screen:</span>
              <ul>
                <li><strong>Android:</strong> Long-press any empty area on your phone's home screen → tap <code>Widgets</code> → scroll to <code>SmartTask</code> → tap <code>Add Widget</code>.</li>
                <li><strong>iOS (iPhone):</strong> Long-press home screen until app icons jiggle → tap the <code>+</code> button in top corner → select <code>SmartTask</code>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alarm & Sound Settings Card */}
        <div className="settings-card glass-card">
          <div className="card-header">
            <Volume2 size={20} className="header-icon" />
            <h2>Alarm & Audio Settings</h2>
          </div>

          <div className="setting-row">
            <div>
              <span className="setting-title">Enable Alarm Sound</span>
              <span className="setting-desc">Play audio ringtone when task reminder is due</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enableAlarm}
                onChange={(e) => updateSettings({ enableAlarm: e.target.checked })}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="form-group margin-top">
            <label className="form-label">Alarm Sound Preset</label>
            <div className="sound-preview-row">
              <select
                className="form-select flex-1"
                value={settings.alarmSound}
                onChange={(e) => updateSettings({ alarmSound: e.target.value })}
              >
                <option value="chime">Melodic Chime Burst (Default)</option>
                <option value="digital">Digital Pulse Beep</option>
                <option value="bell">Gentle Harmonic Bell</option>
                <option value="synth">Modern Synth Alert</option>
              </select>

              <button className="btn btn-secondary" onClick={handleTestSound}>
                <Volume2 size={16} />
                <span>Test Sound</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alarm Volume ({Math.round(settings.alarmVolume * 100)}%)</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.alarmVolume}
              onChange={(e) => updateSettings({ alarmVolume: parseFloat(e.target.value) })}
              className="volume-slider"
            />
          </div>
        </div>

        {/* Notifications & Reminders Card */}
        <div className="settings-card glass-card">
          <div className="card-header">
            <Bell size={20} className="header-icon" />
            <h2>Notifications & Snooze</h2>
          </div>

          <div className="setting-row">
            <div>
              <span className="setting-title">Desktop Notifications</span>
              <span className="setting-desc">Show browser popup notifications for reminders</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="setting-row">
            <div>
              <span className="setting-title">Device Vibration</span>
              <span className="setting-desc">Vibrate mobile or supported devices on reminder</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enableVibration}
                onChange={(e) => updateSettings({ enableVibration: e.target.checked })}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="form-row margin-top">
            <div className="form-group flex-1">
              <label className="form-label">Default Reminder Time</label>
              <select
                className="form-select"
                value={settings.defaultReminderTime}
                onChange={(e) => updateSettings({ defaultReminderTime: e.target.value })}
              >
                <option value="at_time">At task time</option>
                <option value="5_min">5 minutes before</option>
                <option value="10_min">10 minutes before</option>
                <option value="15_min">15 minutes before</option>
                <option value="30_min">30 minutes before</option>
                <option value="1_hour">1 hour before</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Default Snooze Duration</label>
              <select
                className="form-select"
                value={settings.defaultSnoozeDuration}
                onChange={(e) => updateSettings({ defaultSnoozeDuration: e.target.value })}
              >
                <option value="5_min">5 minutes</option>
                <option value="10_min">10 minutes</option>
                <option value="30_min">30 minutes</option>
                <option value="1_hour">1 hour</option>
              </select>
            </div>
          </div>

          <button className="btn btn-secondary sm" onClick={handleTestNotif}>
            <Bell size={14} />
            <span>Test Desktop Notification</span>
          </button>
        </div>

        {/* Theme & Appearance Card */}
        <div className="settings-card glass-card">
          <div className="card-header">
            <Sun size={20} className="header-icon" />
            <h2>Appearance & Theme</h2>
          </div>

          <div className="setting-row">
            <div>
              <span className="setting-title">Theme Mode</span>
              <span className="setting-desc">Switch between dark slate and light clean modes</span>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun size={16} />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Management Card */}
        <div className="settings-card glass-card">
          <div className="card-header">
            <Tag size={20} className="header-icon" />
            <h2>Custom Categories</h2>
          </div>

          <form onSubmit={handleAddCustomCategory} className="add-cat-row">
            <input
              type="text"
              className="form-input flex-1"
              placeholder="New Category Name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <input
              type="color"
              className="color-picker-input"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              title="Category Color"
            />
            <button type="submit" className="btn btn-primary sm">
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div className="categories-list">
            {categories.map(cat => (
              <div key={cat.id || cat.name} className="cat-item-pill">
                <span className="dot" style={{ backgroundColor: cat.color }} />
                <span className="cat-name">{cat.name}</span>
                {cat.id?.startsWith('custom_') && (
                  <button
                    className="btn-icon sm text-danger"
                    onClick={() => deleteCategory(cat.id)}
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Persistence & Backup Card */}
        <div className="settings-card glass-card">
          <div className="card-header">
            <Sparkles size={20} className="header-icon" />
            <h2>Backup & Data Management</h2>
          </div>

          <div className="backup-actions">
            <button className="btn btn-secondary" onClick={handleExportData}>
              <Download size={16} />
              <span>Export Tasks Backup (JSON)</span>
            </button>

            <label className="btn btn-secondary file-upload-btn">
              <Upload size={16} />
              <span>Import Backup JSON</span>
              <input type="file" accept=".json" onChange={handleImportData} hidden />
            </label>
          </div>
        </div>
      </div>

      <style>{`
        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-card {
          display: flex;
          flex-direction: column;
        }

        .install-app-card {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
          border: 1px solid rgba(99, 102, 241, 0.35);
        }

        .widget-config-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .widget-config-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .widget-preview-box {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-md);
        }

        .preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .preview-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .preview-badge {
          background: rgba(99, 102, 241, 0.2);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 800;
        }

        .preview-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .preview-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
        }

        .preview-task-text {
          font-weight: 700;
          color: var(--text-primary);
        }

        .preview-task-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .widget-guide-text {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .widget-guide-text ul {
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .install-card-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .install-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .installed-badge-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(52, 211, 153, 0.15);
          border: 1px solid rgba(52, 211, 153, 0.3);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          color: var(--status-completed);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .install-instructions {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .inst-title {
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          margin-bottom: 6px;
        }

        .install-instructions ul {
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .header-icon {
          color: var(--accent-primary);
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-title {
          font-weight: 700;
          font-size: 0.95rem;
          display: block;
        }

        .setting-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
        }

        .margin-top {
          margin-top: 16px;
        }

        .sound-preview-row {
          display: flex;
          gap: 10px;
        }

        .volume-slider {
          width: 100%;
          accent-color: var(--accent-primary);
          margin-top: 6px;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--bg-tertiary);
          transition: .3s;
          border-radius: 24px;
          border: 1px solid var(--border-color);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-primary);
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        .add-cat-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .color-picker-input {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: transparent;
          cursor: pointer;
        }

        .categories-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cat-item-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .cat-item-pill .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .text-danger {
          color: var(--priority-high);
        }

        .backup-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .file-upload-btn {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
