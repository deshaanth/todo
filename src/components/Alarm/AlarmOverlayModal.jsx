import React, { useState } from 'react';
import { Bell, Clock, CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatDisplayTime } from '../../utils/dateUtils';

export const AlarmOverlayModal = () => {
  const { activeAlarmTask, dismissAlarm, snoozeAlarm, toggleCompleteTask } = useTasks();
  const [selectedSnooze, setSelectedSnooze] = useState(10);

  if (!activeAlarmTask) return null;

  const priorityColor = activeAlarmTask.priority === 'high' ? '#ef4444'
                      : activeAlarmTask.priority === 'medium' ? '#f59e0b'
                      : '#10b981';

  return (
    <div className="modal-backdrop alarm-backdrop">
      <div className="modal-content alarm-overlay-card alarm-pulse">
        <div className="alarm-top-banner" style={{ backgroundColor: priorityColor }}>
          <div className="alarm-icon-box">
            <Bell size={28} className="ringing-bell" />
          </div>
          <div className="alarm-header-text">
            <span className="alarm-tag">TASK REMINDER DUE</span>
            <span className="alarm-priority">
              {activeAlarmTask.priority === 'high' ? '🔴 HIGH PRIORITY'
               : activeAlarmTask.priority === 'medium' ? '🟡 MEDIUM PRIORITY'
               : '🟢 LOW PRIORITY'}
            </span>
          </div>
        </div>

        <div className="alarm-body">
          <h2 className="alarm-task-title">{activeAlarmTask.title}</h2>
          {activeAlarmTask.description && (
            <p className="alarm-task-desc">{activeAlarmTask.description}</p>
          )}

          <div className="alarm-task-meta">
            <div className="meta-row">
              <Clock size={16} />
              <span>Due at {formatDisplayTime(activeAlarmTask.due_time)}</span>
            </div>
            {activeAlarmTask.category && (
              <div className="meta-row">
                <span className="cat-badge">{activeAlarmTask.category}</span>
              </div>
            )}
          </div>

          <div className="snooze-selector-box">
            <label className="snooze-label">Select Snooze Time:</label>
            <div className="snooze-pills">
              {[5, 10, 30, 60].map(mins => (
                <button
                  key={mins}
                  className={`snooze-pill ${selectedSnooze === mins ? 'active' : ''}`}
                  onClick={() => setSelectedSnooze(mins)}
                >
                  {mins >= 60 ? '1 Hour' : `${mins} Mins`}
                </button>
              ))}
            </div>
          </div>

          <div className="alarm-action-buttons">
            <button
              className="btn btn-secondary flex-1"
              onClick={dismissAlarm}
            >
              <XCircle size={18} />
              <span>Dismiss</span>
            </button>

            <button
              className="btn btn-secondary flex-1 snooze-btn"
              onClick={() => snoozeAlarm(selectedSnooze)}
            >
              <Clock size={18} />
              <span>Snooze</span>
            </button>

            <button
              className="btn btn-primary flex-1 complete-btn"
              onClick={() => {
                toggleCompleteTask(activeAlarmTask.task_id);
                dismissAlarm();
              }}
            >
              <CheckCircle2 size={18} />
              <span>Complete</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .alarm-backdrop {
          z-index: 9999;
          background: rgba(15, 23, 42, 0.85);
        }

        .alarm-overlay-card {
          padding: 0;
          overflow: hidden;
          max-width: 480px;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .alarm-top-banner {
          padding: 20px 24px;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .alarm-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ringing-bell {
          animation: bellShake 0.6s infinite ease-in-out;
        }

        @keyframes bellShake {
          0% { transform: rotate(0); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-15deg); }
          60% { transform: rotate(10deg); }
          80% { transform: rotate(-10deg); }
          100% { transform: rotate(0); }
        }

        .alarm-header-text {
          display: flex;
          flex-direction: column;
        }

        .alarm-tag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          opacity: 0.9;
        }

        .alarm-priority {
          font-size: 1.05rem;
          font-weight: 800;
        }

        .alarm-body {
          padding: 24px;
        }

        .alarm-task-title {
          font-size: 1.4rem;
          margin-bottom: 8px;
        }

        .alarm-task-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .alarm-task-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .cat-badge {
          background: var(--bg-tertiary);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--text-primary);
        }

        .snooze-selector-box {
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          padding: 12px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
        }

        .snooze-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .snooze-pills {
          display: flex;
          gap: 6px;
        }

        .snooze-pill {
          flex: 1;
          padding: 6px 4px;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .snooze-pill.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
        }

        .alarm-action-buttons {
          display: flex;
          gap: 10px;
        }

        .snooze-btn {
          background: var(--priority-medium-bg);
          color: var(--priority-medium);
          border-color: var(--priority-medium-border);
        }

        .complete-btn {
          background: linear-gradient(135deg, var(--status-completed), #059669);
        }
      `}</style>
    </div>
  );
};
