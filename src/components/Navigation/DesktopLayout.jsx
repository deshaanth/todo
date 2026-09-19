import React from 'react';
import { Navbar } from './Navbar';
import { Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const DesktopLayout = ({
  children,
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenAuthModal,
  viewMode,
  setViewMode
}) => {
  const { isRealtimeSynced } = useTasks();

  return (
    <div className="desktop-app-shell">
      {/* Desktop Persistent Sidebar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={onOpenAddModal}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Main Content Area */}
      <main className="desktop-main-content">
        {/* Desktop Header Top Utility Bar */}
        <div className="desktop-top-bar">
          <div className="desktop-top-left flex-align gap-3">
            <span className="desktop-workspace-tag">Desktop Workspace</span>
            <span className={`live-sync-pill ${isRealtimeSynced ? 'online' : 'offline'}`}>
              {isRealtimeSynced ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isRealtimeSynced ? '🟢 Real-Time Synced' : '🔴 Offline Mode'}</span>
            </span>
          </div>

          <div className="desktop-top-right">
            <button
              className="desktop-mode-switcher-btn"
              onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
              title={`Preview ${viewMode === 'desktop' ? 'Mobile' : 'Desktop'} UX`}
            >
              {viewMode === 'desktop' ? <Smartphone size={16} /> : <Monitor size={16} />}
              <span>{viewMode === 'desktop' ? 'Preview Mobile UX' : 'Desktop Workspace'}</span>
            </button>
          </div>
        </div>

        <div className="desktop-view-container">
          {children}
        </div>
      </main>

      <style>{`
        .desktop-app-shell {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          max-width: 100vw;
          overflow-x: hidden;
          background: var(--bg-primary);
        }

        .desktop-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 260px;
          min-width: 0;
          width: calc(100vw - 260px);
        }

        .desktop-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 28px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 80;
        }

        .flex-align {
          display: flex;
          align-items: center;
        }
        .gap-3 { gap: 12px; }

        .desktop-workspace-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .live-sync-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
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

        .desktop-mode-switcher-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .desktop-mode-switcher-btn:hover {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-sm);
        }

        .desktop-view-container {
          flex: 1;
          padding: 24px 28px;
        }
      `}</style>
    </div>
  );
};

