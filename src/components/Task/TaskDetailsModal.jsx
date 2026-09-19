import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Bell,
  Repeat,
  Tag,
  CheckCircle2,
  Trash2,
  Edit3,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { formatDisplayDate, formatDisplayTime } from '../../utils/dateUtils';
import { useTasks } from '../../context/TaskContext';

export const TaskDetailsModal = ({ task, isOpen, onClose, onEdit }) => {
  const { toggleCompleteTask, deleteTask, snoozeAlarm } = useTasks();
  const [showSnoozeOpts, setShowSnoozeOpts] = useState(false);

  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'Completed';
  const isOverdue = task.status === 'Overdue';

  const handleSnooze = (minutes) => {
    // Manually trigger snooze for this task
    snoozeAlarm(minutes);
    setShowSnoozeOpts(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content task-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <div className="header-meta">
            <span className={`badge-priority ${task.priority}`}>
              {task.priority === 'high' ? '🔴 High Priority' : task.priority === 'medium' ? '🟡 Medium Priority' : '🟢 Low Priority'}
            </span>
            <span className={`status-pill ${task.status.toLowerCase()}`}>
              {task.status}
            </span>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <h2 className="details-title">{task.title}</h2>

        {task.description && (
          <div className="details-description">
            <FileText size={16} className="desc-icon" />
            <p>{task.description}</p>
          </div>
        )}

        <div className="details-grid">
          <div className="details-item">
            <Tag size={16} className="item-icon" />
            <div>
              <span className="item-label">Category</span>
              <span className="item-value">{task.category}</span>
            </div>
          </div>

          <div className="details-item">
            <Calendar size={16} className="item-icon" />
            <div>
              <span className="item-label">Due Date</span>
              <span className="item-value">{formatDisplayDate(task.due_date)}</span>
            </div>
          </div>

          <div className="details-item">
            <Clock size={16} className="item-icon" />
            <div>
              <span className="item-label">Due Time</span>
              <span className="item-value">{formatDisplayTime(task.due_time)}</span>
            </div>
          </div>

          <div className="details-item">
            <Bell size={16} className="item-icon" />
            <div>
              <span className="item-label">Reminder</span>
              <span className="item-value">{task.reminder_time ? task.reminder_time.replace('_', ' ') : 'None'}</span>
            </div>
          </div>

          <div className="details-item">
            <Repeat size={16} className="item-icon" />
            <div>
              <span className="item-label">Repeat Schedule</span>
              <span className="item-value">{task.repeat_type || 'Does not repeat'}</span>
            </div>
          </div>

          <div className="details-item">
            <Clock size={16} className="item-icon" />
            <div>
              <span className="item-label">Created Date</span>
              <span className="item-value">{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {showSnoozeOpts && (
          <div className="snooze-options-panel">
            <span className="snooze-title">Snooze Reminder For:</span>
            <div className="snooze-buttons">
              <button className="btn btn-secondary sm" onClick={() => handleSnooze(5)}>5 Mins</button>
              <button className="btn btn-secondary sm" onClick={() => handleSnooze(10)}>10 Mins</button>
              <button className="btn btn-secondary sm" onClick={() => handleSnooze(30)}>30 Mins</button>
              <button className="btn btn-secondary sm" onClick={() => handleSnooze(60)}>1 Hour</button>
            </div>
          </div>
        )}

        <div className="details-actions">
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteTask(task.task_id);
              onClose();
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <div className="right-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSnoozeOpts(!showSnoozeOpts)}
            >
              <Clock size={16} />
              <span>Snooze</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </button>

            <button
              className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => {
                toggleCompleteTask(task.task_id);
                onClose();
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isCompleted ? 'Mark Pending' : 'Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .details-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-pill {
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pill.pending { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .status-pill.in-progress { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
        .status-pill.completed { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-pill.overdue { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .details-title {
          font-size: 1.4rem;
          margin-bottom: 16px;
          word-break: break-word;
        }

        .details-description {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .desc-icon {
          color: var(--accent-primary);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .details-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-secondary);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .item-icon {
          color: var(--text-muted);
        }

        .item-label {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }

        .item-value {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .snooze-options-panel {
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          padding: 12px;
          margin-bottom: 20px;
        }

        .snooze-title {
          font-size: 0.8rem;
          font-weight: 700;
          display: block;
          margin-bottom: 8px;
        }

        .snooze-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn.sm {
          padding: 6px 10px;
          font-size: 0.8rem;
        }

        .details-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          padding-top: 18px;
        }

        .right-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
