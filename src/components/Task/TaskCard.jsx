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
import { MobileTaskCard } from './MobileTaskCard';

export const TaskCard = ({ task, onToggleComplete, onClickDetails }) => {
  const { categories } = useSettings();

  const isMobileViewport = typeof window !== 'undefined' && (
    window.innerWidth < 768 ||
    document.body.classList.contains('is-mobile-app')
  );

  if (isMobileViewport) {
    return (
      <MobileTaskCard
        task={task}
        onToggleComplete={onToggleComplete}
        onClickDetails={onClickDetails}
      />
    );
  }

  const categoryObj = categories.find(c => c.name.toLowerCase() === task.category?.toLowerCase()) || {
    name: task.category || 'Other',
    color: '#8b5cf6'
  };

  const isCompleted = task.status === 'Completed';
  const isOverdue = task.status === 'Overdue';

  return (
    <div
      className={`task-card priority-${task.priority} ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onClick={() => onClickDetails(task)}
    >
      <div className="task-card-left">
        <button
          className={`checkbox-btn ${isCompleted ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.task_id);
          }}
          title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
        >
          {isCompleted ? (
            <CheckCircle2 size={22} className="check-icon" />
          ) : (
            <Circle size={22} className="circle-icon" />
          )}
        </button>
      </div>

      <div className="task-card-content">
        <div className="task-header">
          <h3 className={`task-title ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          <span className={`badge-priority ${task.priority}`}>
            {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
          </span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <span
            className="category-pill"
            style={{ backgroundColor: `${categoryObj.color}20`, color: categoryObj.color, borderColor: `${categoryObj.color}40` }}
          >
            {task.category}
          </span>

          <span className={`time-badge ${isOverdue ? 'overdue' : ''}`}>
            <Clock size={13} />
            <span>{formatDisplayDate(task.due_date)} {formatDisplayTime(task.due_time)}</span>
          </span>

          {task.reminder_time !== 'none' && (
            <span className="meta-icon" title={`Reminder: ${task.reminder_time.replace('_', ' ')}`}>
              <Bell size={13} />
            </span>
          )}

          {task.repeat_type !== 'none' && (
            <span className="meta-icon" title={`Repeat: ${task.repeat_type}`}>
              <Repeat size={13} />
            </span>
          )}

          {isOverdue && !isCompleted && (
            <span className="overdue-label">
              <AlertTriangle size={13} />
              <span>Overdue</span>
            </span>
          )}
        </div>
      </div>

      <div className="task-card-right">
        <ChevronRight size={18} className="chevron" />
      </div>

      <style>{`
        .task-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--priority-medium);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
        }

        .task-card.priority-high { border-left-color: var(--priority-high); }
        .task-card.priority-medium { border-left-color: var(--priority-medium); }
        .task-card.priority-low { border-left-color: var(--priority-low); }

        .task-card:hover {
          background: var(--bg-glass-hover);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .task-card.completed {
          opacity: 0.6;
          background: rgba(15, 23, 42, 0.3);
          border-left-color: var(--text-muted);
        }

        .task-card.overdue {
          border-left-color: var(--priority-high);
          box-shadow: inset 0 0 12px rgba(255, 92, 92, 0.08);
        }

        .checkbox-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        .checkbox-btn:hover {
          transform: scale(1.15);
        }

        .checkbox-btn.checked {
          color: var(--status-completed);
        }

        .task-card-content {
          flex: 1;
          min-width: 0;
        }

        .task-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 4px;
        }

        .task-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .task-title.line-through {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-description {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }

        .category-pill {
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          border: 1px solid transparent;
        }

        .time-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .time-badge.overdue {
          color: var(--priority-high);
          font-weight: 700;
        }

        .meta-icon {
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }

        .overdue-label {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--priority-high);
          background: var(--priority-high-bg);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .task-card-right .chevron {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .task-card:hover .chevron {
          transform: translateX(3px);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

