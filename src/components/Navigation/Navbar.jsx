import React from 'react';
import {
  Home,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  Settings as SettingsIcon,
  Plus,
  LogOut,
  Bell,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { notificationService } from '../../services/notificationService';

export const Navbar = ({ activeTab, setActiveTab, onOpenAddModal, onOpenAuthModal }) => {
  const { currentUser, logout } = useAuth();
  const { settings, updateSettings } = useSettings();

  const handleRequestNotif = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      alert('Notifications enabled successfully!');
    } else {
      alert('Notification permission was not granted or blocked by browser settings.');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'priority', label: 'Priority', icon: AlertCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const notifState = notificationService.getPermissionState();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div className="brand-info">
            <h2 className="brand-name">SmartTask</h2>
            <span className="brand-subtitle">Priority & Reminders</span>
          </div>
        </div>

        <div className="user-profile-card">
          <div className="avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser?.name || 'Guest User'}</span>
            <span className="user-email">{currentUser?.email || 'guest@smarttask.app'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* Prominent Theme Mode Switcher */}
          <div className="theme-switch-segment">
            <button
              className={`theme-segment-btn ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'dark' })}
            >
              <Moon size={15} />
              <span>Dark Mode</span>
            </button>
            <button
              className={`theme-segment-btn ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'light' })}
            >
              <Sun size={15} />
              <span>Light Mode</span>
            </button>
          </div>

          {notifState !== 'granted' && (
            <button className="notif-prompt-btn" onClick={handleRequestNotif}>
              <Bell size={16} />
              <span>Enable Notifications</span>
            </button>
          )}

          <div className="footer-actions">
            {currentUser?.id === 'default_user' ? (
              <button className="auth-btn flex-1" onClick={onOpenAuthModal}>
                Log In / Register
              </button>
            ) : (
              <button className="auth-btn logout flex-1" onClick={logout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <div className="brand-logo sm">
            <Sparkles size={18} color="#ffffff" />
          </div>
          <h2>SmartTask</h2>
        </div>
        
        <div className="mobile-header-right">
          <div className="theme-switch-segment sm">
            <button
              className={`theme-segment-btn sm ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'dark' })}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
            <button
              className={`theme-segment-btn sm ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'light' })}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
          </div>

          <button
            className="mobile-avatar-btn"
            onClick={currentUser?.id === 'default_user' ? onOpenAuthModal : () => setActiveTab('settings')}
            title={currentUser?.name || 'Account Settings'}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="icon-wrapper">
                <Icon size={20} />
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Action Button for Quick Task Creation */}
      <button
        className="fab-button"
        onClick={onOpenAddModal}
        title="Add New Task"
        aria-label="Add Task"
      >
        <Plus size={28} />
      </button>

      <style>{`
        /* Desktop Sidebar Styles */
        .desktop-sidebar {
          display: none;
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          flex-direction: column;
          padding: 24px 16px;
          z-index: 100;
        }

        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: flex;
          }
          .mobile-header, .mobile-bottom-nav {
            display: none !important;
          }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 0 8px;
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-primary), #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .brand-logo.sm {
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .user-profile-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: #ffffff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-avatar-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary), #818cf8);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-link.active {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover));
          color: #ffffff;
          box-shadow: var(--shadow-glow);
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        /* Segmented Theme Switcher Control */
        .theme-switch-segment {
          display: flex;
          background: var(--bg-primary);
          padding: 4px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          gap: 4px;
        }

        .theme-switch-segment.sm {
          padding: 2px;
        }

        .theme-segment-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .theme-segment-btn.sm {
          padding: 4px 8px;
        }

        .theme-segment-btn.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }

        .notif-prompt-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          background: var(--priority-medium-bg);
          color: var(--priority-medium);
          border: 1px solid var(--priority-medium-border);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .flex-1 {
          flex: 1;
        }

        .auth-btn {
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .auth-btn.logout {
          color: var(--priority-high);
          background: var(--priority-high-bg);
          border-color: var(--priority-high-border);
        }

        /* Mobile Header */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: max(10px, env(safe-area-inset-top, 10px)) 16px 10px 16px;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .mobile-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-brand h2 {
          font-size: 1.15rem;
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          height: calc(64px + env(safe-area-inset-bottom, 0px));
          padding-bottom: max(4px, env(safe-area-inset-bottom, 4px));
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-color);
          z-index: 90;
          justify-content: space-around;
          align-items: center;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          height: 100%;
          transition: all var(--transition-fast);
        }

        .bottom-nav-item .icon-wrapper {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .bottom-nav-item.active {
          color: var(--accent-primary);
          font-weight: 800;
        }

        .bottom-nav-item.active .icon-wrapper {
          background: rgba(99, 102, 241, 0.16);
          color: var(--accent-primary);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};
