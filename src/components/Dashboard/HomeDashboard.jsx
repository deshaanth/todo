import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Plus,
  SlidersHorizontal,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useSettings } from '../../context/SettingsContext';
import { TaskCard } from '../Task/TaskCard';
import { FocusNow } from './FocusNow';
import { getTodayISO } from '../../utils/dateUtils';

export const HomeDashboard = ({ onOpenAddModal, onClickTaskDetails }) => {
  const {
    tasks,
    filteredTasks,
    toggleCompleteTask,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter
  } = useTasks();

  const { categories, settings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('all'); // all, overdue, today, upcoming, completed

  const todayStr = getTodayISO();

  // Metrics summary
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const overdueCount = tasks.filter(t => t.status === 'Overdue').length;

  // Filter tasks into sections
  const overdueTasks = filteredTasks.filter(t => t.status === 'Overdue');
  const todayTasks = filteredTasks.filter(t => t.due_date === todayStr && t.status !== 'Completed' && t.status !== 'Overdue');
  const upcomingTasks = filteredTasks.filter(t => t.due_date > todayStr && t.status !== 'Completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  const getSectionTasks = () => {
    switch (activeSection) {
      case 'overdue': return overdueTasks;
      case 'today': return todayTasks;
      case 'upcoming': return upcomingTasks;
      case 'completed': return completedTasks;
      case 'all':
      default:
        return filteredTasks;
    }
  };

  const currentDisplayTasks = getSectionTasks();

  return (
    <div className="page-container">
      {/* Top Welcome & Add Header */}
      <div className="dashboard-header">
        <div>
          <h1>Task Dashboard</h1>
          <p className="subheading">Manage your daily priorities and stay focused.</p>
        </div>
        <div className="header-actions">
          {/* Quick Theme Switcher Pill */}
          <div className="header-theme-toggle">
            <button
              className={`theme-pill-btn ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'dark' })}
              title="Dark Mode"
            >
              <Moon size={14} />
              <span>Dark</span>
            </button>
            <button
              className={`theme-pill-btn ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'light' })}
              title="Light Mode"
            >
              <Sun size={14} />
              <span>Light</span>
            </button>
          </div>

          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Banner */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">
            <ListTodo size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{totalCount}</span>
            <span className="metric-label">Total Tasks</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon completed">
            <CheckCircle2 size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{completedCount}</span>
            <span className="metric-label">Completed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending">
            <Clock size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{pendingCount}</span>
            <span className="metric-label">Pending</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon overdue">
            <AlertTriangle size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{overdueCount}</span>
            <span className="metric-label">Overdue</span>
          </div>
        </div>
      </div>

      {/* Smart Priority "Focus Now" Section */}
      <FocusNow onClickTask={onClickTaskDetails} />

      {/* Search Bar & Filter Controls */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-icon sm" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <select
            className="form-select sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          <select
            className="form-select sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id || cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        <button
          className={`tab-btn ${activeSection === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSection('all')}
        >
          All Tasks ({filteredTasks.length})
        </button>
        <button
          className={`tab-btn overdue ${activeSection === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveSection('overdue')}
        >
          Overdue ({overdueTasks.length})
        </button>
        <button
          className={`tab-btn ${activeSection === 'today' ? 'active' : ''}`}
          onClick={() => setActiveSection('today')}
        >
          Due Today ({todayTasks.length})
        </button>
        <button
          className={`tab-btn ${activeSection === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveSection('upcoming')}
        >
          Upcoming ({upcomingTasks.length})
        </button>
        <button
          className={`tab-btn ${activeSection === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveSection('completed')}
        >
          Completed ({completedTasks.length})
        </button>
      </div>

      {/* Task Cards List */}
      <div className="task-list">
        {currentDisplayTasks.length > 0 ? (
          currentDisplayTasks.map(task => (
            <TaskCard
              key={task.task_id}
              task={task}
              onToggleComplete={toggleCompleteTask}
              onClickDetails={onClickTaskDetails}
            />
          ))
        ) : (
          <div className="empty-tasks-placeholder">
            <ListTodo size={48} className="empty-icon" />
            <h3>No Tasks Found</h3>
            <p>
              {searchQuery || priorityFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try clearing your filters or search query.'
                : 'Click "+ New Task" to create your first item.'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-theme-toggle {
          display: none;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 3px;
          border-radius: var(--radius-sm);
          gap: 3px;
        }

        @media (min-width: 768px) {
          .header-theme-toggle {
            display: flex;
          }
        }

        .theme-pill-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .theme-pill-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .subheading {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .metrics-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-bottom: 24px;
          }
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
        }

        @media (min-width: 768px) {
          .metric-card {
            gap: 14px;
            padding: 18px 20px;
          }
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-md);
        }

        .metric-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .metric-icon {
            width: 46px;
            height: 46px;
            border-radius: 14px;
          }
        }

        .metric-icon.total { background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25)); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
        .metric-icon.completed { background: linear-gradient(135deg, rgba(52, 211, 153, 0.25), rgba(16, 185, 129, 0.25)); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); }
        .metric-icon.pending { background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(59, 130, 246, 0.25)); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
        .metric-icon.overdue { background: linear-gradient(135deg, rgba(255, 92, 92, 0.25), rgba(239, 68, 68, 0.25)); color: #ff5c5c; border: 1px solid rgba(255, 92, 92, 0.3); }

        .metric-data {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        @media (min-width: 768px) {
          .metric-value {
            font-size: 1.55rem;
          }
        }

        .metric-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }


        .search-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .search-filter-bar {
            flex-direction: row;
            align-items: center;
          }
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          width: 100%;
          font-size: 0.9rem;
        }

        .filter-dropdowns {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        @media (min-width: 768px) {
          .filter-dropdowns {
            width: auto;
            flex-shrink: 0;
          }
        }

        .filter-dropdowns select {
          flex: 1;
          min-width: 140px;
        }

        @media (min-width: 768px) {
          .filter-dropdowns select {
            flex: initial;
            width: 160px;
          }
        }

        .form-select.sm {
          padding: 10px 12px;
          font-size: 0.85rem;
        }

        .section-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
          margin-bottom: 16px;
          scrollbar-width: none;
        }

        .section-tabs::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .tab-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
        }

        .tab-btn.overdue.active {
          background: var(--priority-high);
          border-color: var(--priority-high);
        }

        .task-list {
          display: flex;
          flex-direction: column;
        }

        .empty-tasks-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background: var(--bg-glass);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          text-align: center;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .empty-tasks-placeholder h3 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .empty-tasks-placeholder p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
