import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../Task/TaskCard';
import { getTodayISO, formatDisplayDate } from '../../utils/dateUtils';

export const CalendarView = ({ onOpenAddModalWithDate, onClickTaskDetails }) => {
  const { tasks, toggleCompleteTask } = useTasks();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(getTodayISO());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format ISO date for calendar grid day cell
  const getCellISODate = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Get tasks for selected date
  const selectedDayTasks = tasks.filter(t => t.due_date === selectedDateStr);

  return (
    <div className="page-container">
      <div className="calendar-header-bar">
        <div>
          <h1>Calendar View</h1>
          <p className="subheading">Track deadlines and view tasks by date.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => onOpenAddModalWithDate(selectedDateStr)}
        >
          <Plus size={18} />
          <span>Add Task on {formatDisplayDate(selectedDateStr)}</span>
        </button>
      </div>

      <div className="calendar-main-grid">
        {/* Calendar Month Picker & Grid */}
        <div className="calendar-card glass-card">
          <div className="month-navigation">
            <button className="btn-icon" onClick={handlePrevMonth}>
              <ChevronLeft size={20} />
            </button>
            <h2 className="month-title">{monthNames[month]} {year}</h2>
            <button className="btn-icon" onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="days-of-week">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="calendar-grid">
            {/* Empty offset cells before 1st of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="calendar-cell empty" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = getCellISODate(dayNum);
              const isSelected = selectedDateStr === dateStr;
              const isToday = getTodayISO() === dateStr;

              const dayTasks = tasks.filter(t => t.due_date === dateStr);
              const hasHighPriority = dayTasks.some(t => t.priority === 'high' && t.status !== 'Completed');
              const pendingCount = dayTasks.filter(t => t.status !== 'Completed').length;
              const completedCount = dayTasks.filter(t => t.status === 'Completed').length;

              return (
                <div
                  key={dateStr}
                  className={`calendar-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                >
                  <span className="day-number">{dayNum}</span>

                  <div className="cell-dots">
                    {pendingCount > 0 && (
                      <span className={`dot ${hasHighPriority ? 'high' : 'pending'}`} />
                    )}
                    {completedCount > 0 && (
                      <span className="dot completed" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task list for selected date */}
        <div className="selected-date-tasks-panel glass-card">
          <div className="panel-header">
            <h3>Tasks for {formatDisplayDate(selectedDateStr)}</h3>
            <span className="count-pill">{selectedDayTasks.length} Tasks</span>
          </div>

          <div className="date-tasks-list">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map(task => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onToggleComplete={toggleCompleteTask}
                  onClickDetails={onClickTaskDetails}
                />
              ))
            ) : (
              <div className="empty-calendar-tasks">
                <CalendarIcon size={36} className="icon" />
                <p>No tasks scheduled for this date.</p>
                <button
                  className="btn btn-secondary sm"
                  onClick={() => onOpenAddModalWithDate(selectedDateStr)}
                >
                  + Add Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .calendar-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .calendar-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 992px) {
          .calendar-main-grid {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .month-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .month-title {
          font-size: 1.2rem;
        }

        .days-of-week {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .calendar-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 8px 4px;
          border-radius: var(--radius-sm);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .calendar-cell:hover:not(.empty) {
          background: var(--bg-tertiary);
        }

        .calendar-cell.empty {
          background: transparent;
          border: none;
          cursor: default;
        }

        .calendar-cell.today {
          border-color: var(--accent-primary);
        }

        .calendar-cell.selected {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-glow);
        }

        .day-number {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .cell-dots {
          display: flex;
          gap: 3px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot.high { background: var(--priority-high); }
        .dot.pending { background: var(--status-pending); }
        .dot.completed { background: var(--status-completed); }

        .selected-date-tasks-panel {
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .count-pill {
          background: var(--bg-tertiary);
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .empty-calendar-tasks {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 16px;
          color: var(--text-muted);
          gap: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
