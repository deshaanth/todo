import React from 'react';
import {
  Sparkles,
  Home,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  Settings as SettingsIcon,
  Plus,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useTasks } from '../../context/TaskContext';

export const MobileLayout = ({
  children,
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenAuthModal,
  viewMode,
  setViewMode
}) => {
  const { currentUser } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { isRealtimeSynced } = useTasks();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'priority', label: 'Priority', icon: AlertCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="mobile-app-shell">
      {/* Mobile Top Header */}
      <header className="mobile-top-bar">
        <div className="mobile-brand-group">
          <div className="mobile-logo">
            <Sparkles size={18} color="#ffffff" />
          </div>
          <div className="mobile-brand-title">
            <h2>SmartTask</h2>
            <div className="flex-align gap-1">
              <span className="mobile-badge-mode">Mobile UX</span>
              <span className={`live-sync-pill ${isRealtimeSynced ? 'online' : 'offline'}`}>
                {isRealtimeSynced ? <Wifi size={10} /> : <WifiOff size={10} />}
                <span>{isRealtimeSynced ? 'Live' : 'Offline'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mobile-header-actions">
          {/* Layout Mode Preview Switcher Pill */}
          <button
            className="mobile-mode-toggle"
            onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
            title={`Switch to ${viewMode === 'mobile' ? 'Desktop' : 'Mobile'} UI`}
          >
            {viewMode === 'mobile' ? <Monitor size={14} /> : <Smartphone size={14} />}
          </button>

          {/* Theme Quick Switcher */}
          <button
            className="mobile-theme-btn"
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            title="Toggle theme"
          >
            {settings.theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* User Profile Avatar */}
          <button
            className="mobile-user-avatar"
            onClick={currentUser?.id === 'default_user' ? onOpenAuthModal : () => setActiveTab('settings')}
            title={currentUser?.name || 'User Profile'}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="mobile-view-container">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-dock-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-dock-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="mobile-dock-icon">
                <Icon size={20} />
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Floating Action Button */}
      <button
        className="mobile-fab-btn"
        onClick={onOpenAddModal}
        aria-label="Add new task"
      >
        <Plus size={28} />
      </button>

      <style>{`
        .mobile-app-shell {
          min-height: 100vh;
          width: 100vw;
          max-width: 100vw;
          overflow-x: hidden;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .mobile-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: max(10px, env(safe-area-inset-top, 10px)) 12px 10px 12px;
          background: var(--bg-glass);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .mobile-brand-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-logo {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-primary), #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .mobile-brand-title {
          display: flex;
          flex-direction: column;
        }

        .mobile-brand-title h2 {
          font-size: 1.05rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .flex-align {
          display: flex;
          align-items: center;
        }
        .gap-1 { gap: 4px; }

        .mobile-badge-mode {
          font-size: 0.65rem;
          color: var(--accent-primary);
          font-weight: 700;
        }

        .live-sync-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: var(--radius-full);
        }

        .live-sync-pill.online {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .live-sync-pill.offline {
          background: rgba(255, 92, 92, 0.15);
          color: #ff5c5c;
          border: 1px solid rgba(255, 92, 92, 0.3);
        }

        .mobile-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-mode-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .mobile-theme-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, var(--accent-primary), #818cf8);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }

        .mobile-view-container {
          flex: 1;
          padding: 12px 12px calc(80px + env(safe-area-inset-bottom, 0px)) 12px;
          min-width: 0;
          width: 100%;
        }

        .mobile-dock-nav {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          height: calc(62px + env(safe-area-inset-bottom, 0px));
          padding-bottom: max(4px, env(safe-area-inset-bottom, 4px));
          background: var(--bg-glass);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-top: 1px solid var(--border-color);
          z-index: 100;
          justify-content: space-around;
          align-items: center;
        }

        .mobile-dock-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.68rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          height: 100%;
          transition: all 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-dock-icon {
          padding: 4px 14px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
        }

        .mobile-dock-item.active {
          color: var(--accent-primary);
          font-weight: 800;
        }

        .mobile-dock-item.active .mobile-dock-icon {
          background: rgba(99, 102, 241, 0.16);
          color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .mobile-fab-btn {
          position: fixed;
          bottom: calc(74px + env(safe-area-inset-bottom, 0px));
          right: 16px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: 0 8px 24px var(--accent-glow);
          cursor: pointer;
          z-index: 99;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease;
        }

        .mobile-fab-btn:active {
          transform: scale(0.92);
        }
      `}</style>
    </div>
  );
};

