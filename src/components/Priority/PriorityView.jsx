import React from 'react';
import { AlertCircle, Flame, CheckCircle, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../Task/TaskCard';

export const PriorityView = ({ onClickTaskDetails }) => {
  const { tasks, toggleCompleteTask } = useTasks();

  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'Completed');
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium' && t.status !== 'Completed');
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low' && t.status !== 'Completed');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Priority Management</h1>
        <p className="subheading">Focus on high impact tasks first to maximize productivity.</p>
      </div>

      <div className="priority-columns">
        {/* High Priority Section */}
        <div className="priority-section high">
          <div className="section-header high">
            <div className="header-left">
              <span className="priority-dot high">🔴</span>
              <h2>HIGH PRIORITY</h2>
            </div>
            <span className="count-badge high">{highPriorityTasks.length}</span>
          </div>

          <div className="priority-task-list">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map(task => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onToggleComplete={toggleCompleteTask}
                  onClickDetails={onClickTaskDetails}
                />
              ))
            ) : (
              <div className="empty-priority-box">
                <span>No pending high priority tasks 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* Medium Priority Section */}
        <div className="priority-section medium">
          <div className="section-header medium">
            <div className="header-left">
              <span className="priority-dot medium">🟡</span>
              <h2>MEDIUM PRIORITY</h2>
            </div>
            <span className="count-badge medium">{mediumPriorityTasks.length}</span>
          </div>

          <div className="priority-task-list">
            {mediumPriorityTasks.length > 0 ? (
              mediumPriorityTasks.map(task => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onToggleComplete={toggleCompleteTask}
                  onClickDetails={onClickTaskDetails}
                />
              ))
            ) : (
              <div className="empty-priority-box">
                <span>No pending medium priority tasks</span>
              </div>
            )}
          </div>
        </div>

        {/* Low Priority Section */}
        <div className="priority-section low">
          <div className="section-header low">
            <div className="header-left">
              <span className="priority-dot low">🟢</span>
              <h2>LOW PRIORITY</h2>
            </div>
            <span className="count-badge low">{lowPriorityTasks.length}</span>
          </div>

          <div className="priority-task-list">
            {lowPriorityTasks.length > 0 ? (
              lowPriorityTasks.map(task => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onToggleComplete={toggleCompleteTask}
                  onClickDetails={onClickTaskDetails}
                />
              ))
            ) : (
              <div className="empty-priority-box">
                <span>No pending low priority tasks</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .page-header {
          margin-bottom: 24px;
        }

        .priority-columns {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .priority-section {
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
        }

        .priority-section.high { border-top: 4px solid var(--priority-high); }
        .priority-section.medium { border-top: 4px solid var(--priority-medium); }
        .priority-section.low { border-top: 4px solid var(--priority-low); }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-left h2 {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .count-badge {
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .count-badge.high { background: var(--priority-high-bg); color: var(--priority-high); }
        .count-badge.medium { background: var(--priority-medium-bg); color: var(--priority-medium); }
        .count-badge.low { background: var(--priority-low-bg); color: var(--priority-low); }

        .priority-task-list {
          display: flex;
          flex-direction: column;
        }

        .empty-priority-box {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 600;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
};
