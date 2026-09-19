import React from 'react';
import { CheckCircle2, Trophy, RotateCcw, Trash2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../Task/TaskCard';

export const CompletedView = ({ onClickTaskDetails }) => {
  const { tasks, toggleCompleteTask, deleteTask } = useTasks();

  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to clear all completed tasks?')) {
      completedTasks.forEach(t => deleteTask(t.task_id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Completed Tasks</h1>
          <p className="subheading">Review your finished goals and accomplishments.</p>
        </div>

        {completedTasks.length > 0 && (
          <button className="btn btn-danger" onClick={handleClearCompleted}>
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Completion Banner */}
      <div className="completion-stats-card glass-card">
        <div className="trophy-box">
          <Trophy size={36} color="#10b981" />
        </div>
        <div className="stats-text">
          <h2>Great Job!</h2>
          <p>You have completed <strong>{completedTasks.length}</strong> out of <strong>{totalTasks}</strong> tasks ({completionRate}% completion rate).</p>
        </div>
      </div>

      <div className="completed-task-list">
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <TaskCard
              key={task.task_id}
              task={task}
              onToggleComplete={toggleCompleteTask}
              onClickDetails={onClickTaskDetails}
            />
          ))
        ) : (
          <div className="empty-completed-box glass-card">
            <CheckCircle2 size={42} className="icon" />
            <h3>No Completed Tasks Yet</h3>
            <p>Complete tasks from your home dashboard to see them here.</p>
          </div>
        )}
      </div>

      <style>{`
        .flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .completion-stats-card {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12));
          border-color: rgba(16, 185, 129, 0.3);
        }

        .trophy-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stats-text h2 {
          font-size: 1.25rem;
          color: var(--status-completed);
          margin-bottom: 4px;
        }

        .stats-text p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .empty-completed-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          text-align: center;
          color: var(--text-muted);
          gap: 12px;
        }
      `}</style>
    </div>
  );
};
