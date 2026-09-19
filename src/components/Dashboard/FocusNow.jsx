import React from 'react';
import { Flame, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { checkIfNearDeadline, formatDisplayTime } from '../../utils/dateUtils';

export const FocusNow = ({ onClickTask }) => {
  const { tasks, toggleCompleteTask } = useTasks();

  // Filter tasks that need immediate focus:
  // Overdue, High Priority pending, or Near Deadline (< 2 hours)
  const focusTasks = tasks.filter(task => {
    if (task.status === 'Completed') return false;
    const isOverdue = task.status === 'Overdue';
    const isHighPriority = task.priority === 'high';
    const isNear = checkIfNearDeadline(task.due_date, task.due_time, task.status);

    return isOverdue || isHighPriority || isNear;
  }).slice(0, 3); // Top 3 most urgent tasks

  if (focusTasks.length === 0) {
    return (
      <div className="focus-now-empty">
        <div className="focus-icon-circle">
          <CheckCircle2 size={20} color="#34d399" />
        </div>
        <div className="empty-text">
          <h3 className="empty-title">All Clear! No urgent tasks</h3>
          <p className="empty-desc">You're all caught up with your high-priority items and deadlines.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-now-card">
      <div className="focus-header">
        <div className="focus-header-title">
          <Flame size={20} className="flame-icon" />
          <h2>FOCUS NOW</h2>
        </div>
        <span className="focus-badge">{focusTasks.length} Urgent</span>
      </div>

      <div className="focus-list">
        {focusTasks.map(task => {
          const isOverdue = task.status === 'Overdue';
          const isNear = checkIfNearDeadline(task.due_date, task.due_time, task.status);

          return (
            <div
              key={task.task_id}
              className={`focus-item ${isOverdue ? 'overdue' : ''}`}
              onClick={() => onClickTask(task)}
            >
              <div className="focus-item-left">
                <span className={`badge-priority ${task.priority}`}>
                  {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                </span>
                <span className="focus-item-title">{task.title}</span>
              </div>

              <div className="focus-item-right">
                {isOverdue ? (
                  <span className="urgent-tag overdue">
                    <AlertTriangle size={13} />
                    <span>Overdue</span>
                  </span>
                ) : isNear ? (
                  <span className="urgent-tag near">
                    <Clock size={13} />
                    <span>Due Soon ({formatDisplayTime(task.due_time)})</span>
                  </span>
                ) : (
                  <span className="urgent-tag due">
                    <Clock size={13} />
                    <span>Due {formatDisplayTime(task.due_time)}</span>
                  </span>
                )}
                <ArrowRight size={16} className="arrow" />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .focus-now-card {
          background: linear-gradient(135deg, rgba(255, 92, 92, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 92, 92, 0.35);
          border-radius: var(--radius-lg);
          padding: 22px;
          margin-bottom: 28px;
          box-shadow: 0 8px 30px rgba(255, 92, 92, 0.12);
        }

        .focus-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .focus-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flame-icon {
          color: var(--priority-high);
          animation: pulse 1.5s infinite alternate;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }

        .focus-header h2 {
          font-size: 1.05rem;
          letter-spacing: 0.05em;
          color: var(--priority-high);
        }

        .focus-badge {
          background: var(--priority-high);
          color: #ffffff;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 800;
        }

        .focus-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .focus-item {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        @media (min-width: 520px) {
          .focus-item {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .focus-item:hover {
          background: var(--bg-glass-hover);
          transform: translateX(4px);
        }

        .focus-item-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          width: 100%;
        }

        .focus-item-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .focus-item-right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
        }

        @media (min-width: 520px) {
          .focus-item-right {
            width: auto;
            justify-content: flex-end;
          }
        }

        .urgent-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .urgent-tag.overdue {
          background: var(--priority-high-bg);
          color: var(--priority-high);
        }

        .urgent-tag.near {
          background: var(--priority-medium-bg);
          color: var(--priority-medium);
        }

        .urgent-tag.due {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        .arrow {
          color: var(--text-muted);
        }

        .focus-now-empty {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%);
          border: 1px solid rgba(52, 211, 153, 0.25);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-bottom: 28px;
        }

        .focus-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(52, 211, 153, 0.18);
          border: 1px solid rgba(52, 211, 153, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .empty-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .empty-title {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .empty-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
};
