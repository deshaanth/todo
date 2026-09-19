import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { TaskProvider } from './context/TaskContext';
import { MobileLayout } from './components/Navigation/MobileLayout';
import { DesktopLayout } from './components/Navigation/DesktopLayout';
import { InstallBanner } from './components/Navigation/InstallBanner';
import { HomeDashboard } from './components/Dashboard/HomeDashboard';
import { PriorityView } from './components/Priority/PriorityView';
import { CalendarView } from './components/Calendar/CalendarView';
import { CompletedView } from './components/Completed/CompletedView';
import { SettingsView } from './components/Settings/SettingsView';
import { TaskModal } from './components/Task/TaskModal';
import { MobileTaskSheet } from './components/Task/MobileTaskSheet';
import { TaskDetailsModal } from './components/Task/TaskDetailsModal';
import { AlarmOverlayModal } from './components/Alarm/AlarmOverlayModal';
import { AuthModal } from './components/Auth/AuthModal';
import { TaskWidget } from './components/Widget/TaskWidget';
import { useTasks } from './context/TaskContext';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic View Mode state: 'mobile' | 'desktop'
  const [viewMode, setViewMode] = useState(() => {
    const isMobileDevice = window.innerWidth < 1024 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
    return isMobileDevice ? 'mobile' : 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      // Auto adjust if user hasn't forced preview
      if (!sessionStorage.getItem('user_forced_mode')) {
        const isMobile = window.innerWidth < 1024;
        setViewMode(isMobile ? 'mobile' : 'desktop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSetViewMode = (mode) => {
    sessionStorage.setItem('user_forced_mode', 'true');
    setViewMode(mode);
  };

  const { addTask, updateTask } = useTasks();

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenAddModalWithDate = (dateStr) => {
    setTaskToEdit({ due_date: dateStr });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskToEdit && taskToEdit.task_id) {
      updateTask(taskToEdit.task_id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            onOpenAddModal={handleOpenAddModal}
            onClickTaskDetails={(task) => setSelectedTaskDetails(task)}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            onOpenAddModalWithDate={handleOpenAddModalWithDate}
            onClickTaskDetails={(task) => setSelectedTaskDetails(task)}
          />
        );
      case 'priority':
        return (
          <PriorityView
            onClickTaskDetails={(task) => setSelectedTaskDetails(task)}
          />
        );
      case 'completed':
        return (
          <CompletedView
            onClickTaskDetails={(task) => setSelectedTaskDetails(task)}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <HomeDashboard
            onOpenAddModal={handleOpenAddModal}
            onClickTaskDetails={(task) => setSelectedTaskDetails(task)}
          />
        );
    }
  };

  const content = (
    <>
      <InstallBanner />
      {renderActiveView()}
    </>
  );

  return (
    <div className="app-root-shell">
      {viewMode === 'mobile' ? (
        <MobileLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          viewMode={viewMode}
          setViewMode={handleSetViewMode}
        >
          {content}
        </MobileLayout>
      ) : (
        <DesktopLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          viewMode={viewMode}
          setViewMode={handleSetViewMode}
        >
          {content}
        </DesktopLayout>
      )}

      {/* Dockable Floating Widget for Desktop */}
      {viewMode === 'desktop' && (
        <TaskWidget
          onOpenAddModal={handleOpenAddModal}
          onClickTaskDetails={(task) => setSelectedTaskDetails(task)}
        />
      )}

      {/* Task Creation Form: Native Mobile Bottom Sheet on Mobile, Centered Modal on Desktop */}
      {viewMode === 'mobile' ? (
        <MobileTaskSheet
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />
      ) : (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />
      )}

      <TaskDetailsModal
        isOpen={!!selectedTaskDetails}
        task={selectedTaskDetails}
        onClose={() => setSelectedTaskDetails(null)}
        onEdit={handleOpenEditModal}
      />

      <AlarmOverlayModal />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <TaskProvider>
          <MainLayout />
        </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

