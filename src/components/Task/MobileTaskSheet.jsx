import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bell, Repeat, AlertCircle, Save, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getTodayISO, getCurrentTimeISO } from '../../utils/dateUtils';

export const MobileTaskSheet = ({ isOpen, onClose, onSave, taskToEdit = null }) => {
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
    <div className="mobile-sheet-overlay" onClick={onClose}>
      <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Grab Handle Bar */}
        <div className="mobile-sheet-drag-handle" />

        <div className="mobile-sheet-header">
          <div className="flex-align gap-2">
            <Sparkles size={20} color="var(--accent-primary)" />
            <h3>{taskToEdit ? 'Edit Task' : 'Quick Add Task'}</h3>
          </div>
          <button className="mobile-close-btn" onClick={onClose} aria-label="Close task form">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mobile-error-alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mobile-sheet-body">
          {/* Title */}
          <div className="mobile-form-group">
            <label className="mobile-label">Task Title *</label>
            <input
              type="text"
              className="mobile-input text-lg"
              placeholder="What do you need to do?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mobile-form-group">
            <label className="mobile-label">Notes & Details</label>
            <textarea
              className="mobile-textarea"
              placeholder="Add details, link, or sub-tasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Priority Pills */}
          <div className="mobile-form-group">
            <label className="mobile-label">Priority Level</label>
            <div className="mobile-priority-grid">
              <button
                type="button"
                className={`mobile-priority-pill high ${priority === 'high' ? 'active' : ''}`}
                onClick={() => setPriority('high')}
              >
                🔴 High Priority
              </button>
              <button
                type="button"
                className={`mobile-priority-pill medium ${priority === 'medium' ? 'active' : ''}`}
                onClick={() => setPriority('medium')}
              >
                🟡 Medium
              </button>
              <button
                type="button"
                className={`mobile-priority-pill low ${priority === 'low' ? 'active' : ''}`}
                onClick={() => setPriority('low')}
              >
                🟢 Low
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="mobile-form-group">
            <label className="mobile-label">Category Tag</label>
            <select
              className="mobile-select"
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

          {/* Date & Time Row */}
          <div className="mobile-form-row">
            <div className="mobile-form-group flex-1">
              <label className="mobile-label">Due Date</label>
              <input
                type="date"
                className="mobile-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="mobile-form-group flex-1">
              <label className="mobile-label">Due Time</label>
              <input
                type="time"
                className="mobile-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          {/* Reminder & Repeat Row */}
          <div className="mobile-form-row">
            <div className="mobile-form-group flex-1">
              <label className="mobile-label">Reminder Alert</label>
              <select
                className="mobile-select"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              >
                <option value="at_time">At exact time</option>
                <option value="5_min">5 mins before</option>
                <option value="15_min">15 mins before</option>
                <option value="30_min">30 mins before</option>
                <option value="1_hour">1 hour before</option>
                <option value="none">No reminder</option>
              </select>
            </div>

            <div className="mobile-form-group flex-1">
              <label className="mobile-label">Repeat Schedule</label>
              <select
                className="mobile-select"
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
              >
                <option value="none">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="mobile-toggles-card">
            <label className="mobile-toggle-row">
              <span>Play Alarm Sound when due</span>
              <input
                type="checkbox"
                className="mobile-toggle-switch"
                checked={alarmEnabled}
                onChange={(e) => setAlarmEnabled(e.target.checked)}
              />
            </label>
            <label className="mobile-toggle-row">
              <span>Send Push Notification</span>
              <input
                type="checkbox"
                className="mobile-toggle-switch"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
              />
            </label>
          </div>

          {/* Action Footer */}
          <div className="mobile-sheet-actions">
            <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              <Save size={18} />
              <span>{taskToEdit ? 'Save Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .mobile-sheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
          animation: mobileFade 0.2s ease-out;
        }

        .mobile-sheet-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px 24px 0 0;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
          padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px)) 16px;
          animation: mobileSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-sheet-drag-handle {
          width: 40px;
          height: 5px;
          background: var(--border-color);
          border-radius: 99px;
          margin: 4px auto 14px auto;
        }

        .mobile-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .mobile-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--priority-high-bg);
          color: var(--priority-high);
          border: 1px solid var(--priority-high-border);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          margin-bottom: 14px;
        }

        .mobile-sheet-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mobile-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mobile-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .mobile-input, .mobile-select, .mobile-textarea {
          width: 100%;
          padding: 12px 14px;
          min-height: 48px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-input.text-lg {
          font-size: 1.05rem;
          font-weight: 600;
        }

        .mobile-textarea {
          min-height: 72px;
          resize: none;
        }

        .mobile-priority-grid {
          display: flex;
          gap: 8px;
        }

        .mobile-priority-pill {
          flex: 1;
          padding: 10px 4px;
          min-height: 44px;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-muted);
          cursor: pointer;
        }

        .mobile-priority-pill.high.active {
          background: var(--priority-high-bg);
          color: var(--priority-high);
          border-color: var(--priority-high);
        }
        .mobile-priority-pill.medium.active {
          background: var(--priority-medium-bg);
          color: var(--priority-medium);
          border-color: var(--priority-medium);
        }
        .mobile-priority-pill.low.active {
          background: var(--priority-low-bg);
          color: var(--priority-low);
          border-color: var(--priority-low);
        }

        .mobile-form-row {
          display: flex;
          gap: 10px;
        }

        .mobile-toggles-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .mobile-toggle-switch {
          width: 20px;
          height: 20px;
          accent-color: var(--accent-primary);
        }

        .mobile-sheet-actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        @keyframes mobileFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes mobileSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
