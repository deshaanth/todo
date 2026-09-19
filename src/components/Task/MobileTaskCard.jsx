import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Bell,
  Repeat,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { formatDisplayDate, formatDisplayTime } from '../../utils/dateUtils';
import { useSettings } from '../../context/SettingsContext';

export const MobileTaskCard = ({ task, onToggleComplete, onClickDetails }) => {
  const { categories } = useSettings();

  const categoryObj = categories.find(
    c => c.name.toLowerCase() === task.category?.toLowerCase()
  ) || {
    name: task.category || 'Other',
    color: '#8b5cf6'
  };

  const isCompleted = task.status === 'Completed';
  const isOverdue = task.status === 'Overdue';

  return (
    <div
      className={`mobile-task-card priority-${task.priority} ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onClick={() => onClickDetails(task)}
    >
      <button
        className={`mobile-check-btn ${isCompleted ? 'checked' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.task_id);
        }}
        aria-label={isCompleted ? 'Mark task pending' : 'Mark task completed'}
      >
        {isCompleted ? (
          <CheckCircle2 size={24} className="check-icon" />
        ) : (
          <Circle size={24} className="circle-icon" />
        )}
      </button>

      <div className="mobile-card-body">
        <div className="mobile-card-top flex-between">
          <h4 className={`mobile-task-title ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h4>
          <span className={`badge-priority sm ${task.priority}`}>
            {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
          </span>
        </div>

        {task.description && (
          <p className="mobile-task-desc">{task.description}</p>
        )}

        <div className="mobile-card-meta">
          <span
            className="mobile-category-pill"
            style={{
              backgroundColor: `${categoryObj.color}22`,
              color: categoryObj.color,
              borderColor: `${categoryObj.color}44`
            }}
          >
            {task.category}
          </span>

          <span className={`mobile-time-badge ${isOverdue ? 'overdue' : ''}`}>
            <Clock size={12} />
            <span>{formatDisplayDate(task.due_date)} {formatDisplayTime(task.due_time)}</span>
          </span>

          {task.reminder_time !== 'none' && (
            <span className="mobile-meta-icon" title={`Reminder: ${task.reminder_time}`}>
              <Bell size={12} />
            </span>
          )}

          {task.repeat_type !== 'none' && (
            <span className="mobile-meta-icon" title={`Repeats: ${task.repeat_type}`}>
              <Repeat size={12} />
            </span>
          )}

          {isOverdue && !isCompleted && (
            <span className="mobile-overdue-tag">
              <AlertTriangle size={11} />
              <span>Overdue</span>
            </span>
          )}
        </div>
      </div>

      <ChevronRight size={18} className="mobile-chevron" />

      <style>{`
        .mobile-task-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-left: 5px solid var(--priority-medium);
          border-radius: var(--radius-md);
          padding: 14px 14px;
          margin-bottom: 10px;
          position: relative;
          touch-action: manipulation;
          transition: transform 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-task-card:active {
          transform: scale(0.985);
          background: var(--bg-tertiary);
        }

        .mobile-task-card.priority-high { border-left-color: var(--priority-high); }
        .mobile-task-card.priority-medium { border-left-color: var(--priority-medium); }
        .mobile-task-card.priority-low { border-left-color: var(--priority-low); }

        .mobile-task-card.completed {
          opacity: 0.55;
          border-left-color: var(--text-muted);
        }

        .mobile-task-card.overdue {
          border-left-color: var(--priority-high);
          background: rgba(255, 92, 92, 0.05);
        }

        .mobile-check-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-check-btn.checked {
          color: var(--status-completed);
        }

        .mobile-card-body {
          flex: 1;
          min-width: 0;
        }

        .mobile-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 3px;
        }

        .mobile-task-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-task-title.line-through {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .mobile-task-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mobile-card-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }

        .mobile-category-pill {
          padding: 2px 7px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          border: 1px solid transparent;
        }

        .mobile-time-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .mobile-time-badge.overdue {
          color: var(--priority-high);
          font-weight: 700;
        }

        .mobile-meta-icon {
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }

        .mobile-overdue-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--priority-high);
          background: var(--priority-high-bg);
          padding: 1px 5px;
          border-radius: 4px;
        }

        .mobile-chevron {
          color: var(--text-muted);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
