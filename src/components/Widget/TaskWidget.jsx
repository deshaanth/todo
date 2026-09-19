import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Minimize2,
  Maximize2,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { checkIfNearDeadline, formatDisplayTime } from '../../utils/dateUtils';

export const TaskWidget = ({ onOpenAddModal, onClickTaskDetails }) => {
  const { tasks, toggleCompleteTask } = useTasks();
  // On mobile screens, start minimized by default so it doesn't block the UI
  const [isMinimized, setIsMinimized] = useState(() => window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Filter urgent & pending tasks for widget view
  const widgetTasks = tasks.filter(task => {
    if (task.status === 'Completed') return false;
    const isOverdue = task.status === 'Overdue';
    const isHighPriority = task.priority === 'high';
    const isNear = checkIfNearDeadline(task.due_date, task.due_time, task.status);
    return isOverdue || isHighPriority || isNear || task.status === 'Pending';
  }).slice(0, 4);

  const urgentCount = widgetTasks.filter(t => t.priority === 'high' || t.status === 'Overdue').length;

  return (
    <div className={`smart-task-widget ${isMinimized ? 'minimized' : ''}`}>
      {/* Minimized Floating Pill View */}
      {isMinimized ? (
        <button
          className="widget-pill-btn"
          onClick={() => setIsMinimized(false)}
          title="Expand Smart Task Widget"
        >
          <div className="pill-pulse-dot" />
          <Flame size={16} color="#ff5c5c" />
          <span className="pill-text">Focus Widget ({widgetTasks.length})</span>
          <Maximize2 size={14} className="pill-icon" />
        </button>
      ) : (
        /* Expanded Mini Widget Card View */
        <div className="widget-card-box">
          <div className="widget-header">
            <div className="widget-brand">
              <div className="widget-logo">
                <Sparkles size={14} color="#ffffff" />
              </div>
              <span className="widget-title">Smart Task Widget</span>
              {urgentCount > 0 && (
                <span className="urgent-badge">{urgentCount} Urgent</span>
              )}
            </div>

            <div className="widget-actions">
              <button
                className="btn-icon sm"
                onClick={() => setIsMinimized(true)}
                title="Minimize Widget"
              >
                <Minimize2 size={14} />
              </button>
              <button
                className="btn-icon sm"
                onClick={() => setIsVisible(false)}
                title="Hide Widget"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="widget-body">
            {widgetTasks.length > 0 ? (
              <div className="widget-task-list">
                {widgetTasks.map(task => (
                  <div key={task.task_id} className="widget-item">
                    <button
                      className="widget-check-btn"
                      onClick={() => toggleCompleteTask(task.task_id)}
                      title="Complete Task"
                    >
                      <Circle size={16} />
                    </button>
                    <span
                      className="widget-item-title"
                      onClick={() => onClickTaskDetails(task)}
                    >
                      {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.title}
                    </span>
                    <span className="widget-item-time">{formatDisplayTime(task.due_time)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="widget-empty">
                <CheckCircle2 size={24} color="#34d399" />
                <span>No pending tasks for today!</span>
              </div>
            )}

            <button className="widget-add-btn" onClick={onOpenAddModal}>
              <Plus size={14} />
              <span>Quick Add Task</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .smart-task-widget {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 95;
          animation: fadeIn 0.3s ease-out;
        }

        @media (max-width: 767px) {
          .smart-task-widget {
            top: auto;
            bottom: calc(76px + env(safe-area-inset-bottom, 0px));
            left: 14px;
            right: auto;
          }
          .widget-card-box {
            max-width: calc(100vw - 28px);
          }
        }

        /* Minimized Pill Style */
        .widget-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          padding: 8px 14px;
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-fast);
        }

        .widget-pill-btn:hover {
          background: var(--bg-glass-hover);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .pill-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff5c5c;
          box-shadow: 0 0 8px #ff5c5c;
        }

        .pill-icon {
          color: var(--text-muted);
        }

        /* Expanded Widget Card Style */
        .widget-card-box {
          width: 320px;
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        @media (max-width: 767px) {
          .widget-card-box {
            width: 100%;
          }
        }

        .widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .widget-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .widget-logo {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .widget-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .urgent-badge {
          background: var(--priority-high-bg);
          color: var(--priority-high);
          border: 1px solid var(--priority-high-border);
          padding: 1px 6px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 800;
        }

        .widget-actions {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .btn-icon.sm {
          padding: 4px;
        }

        .widget-body {
          padding: 10px;
        }

        .widget-task-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 8px;
        }

        .widget-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .widget-item:hover {
          background: var(--bg-tertiary);
        }

        .widget-check-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .widget-check-btn:hover {
          color: var(--status-completed);
        }

        .widget-item-title {
          flex: 1;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        .widget-item-time {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .widget-empty {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          justify-content: center;
        }

        .widget-add-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px;
          border-radius: var(--radius-sm);
          border: 1px dashed var(--accent-primary);
          background: rgba(99, 102, 241, 0.08);
          color: var(--accent-primary);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .widget-add-btn:hover {
          background: rgba(99, 102, 241, 0.18);
        }
      `}</style>
    </div>
  );
};
