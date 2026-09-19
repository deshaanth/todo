import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2, Share2, Sparkles } from 'lucide-react';

export const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor native app or standalone display mode
    const isCapacitorNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (isCapacitorNative || window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (isInstalled || isDismissed) return null;

  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      alert('To install SmartTask as a mobile app:\n\n• Tap your browser menu (⋮) -> select "Install App" or "Add to Home Screen".');
    }
  };

  return (
    <>
      <div className="install-banner">
        <div className="banner-left">
          <div className="banner-icon-badge">
            <Smartphone size={18} color="#ffffff" />
          </div>
          <div className="banner-text">
            <h4>Install SmartTask Mobile App</h4>
            <p>Full-screen offline app view</p>
          </div>
        </div>

        <div className="banner-right">
          <button className="btn btn-primary sm install-btn" onClick={handleInstallClick}>
            <Download size={14} />
            <span>Install</span>
          </button>
          <button className="btn-icon dismiss-btn" onClick={() => setIsDismissed(true)} title="Dismiss">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIosGuide && (
        <div className="modal-backdrop" onClick={() => setShowIosGuide(false)}>
          <div className="modal-content ios-guide-card" onClick={(e) => e.stopPropagation()}>
            <div className="ios-guide-header">
              <Sparkles size={24} color="#6366f1" />
              <h2>Install on iPhone / iPad</h2>
              <button className="btn-icon" onClick={() => setShowIosGuide(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="ios-steps">
              <div className="ios-step-item">
                <span className="step-num">1</span>
                <div>
                  <p className="step-text">Tap the <strong>Share <Share2 size={14} inline /></strong> button at the bottom of Safari.</p>
                </div>
              </div>

              <div className="ios-step-item">
                <span className="step-num">2</span>
                <div>
                  <p className="step-text">Scroll down and tap <strong>Add to Home Screen [+]</strong>.</p>
                </div>
              </div>

              <div className="ios-step-item">
                <span className="step-num">3</span>
                <div>
                  <p className="step-text">Tap <strong>Add</strong> in the top right. SmartTask icon will be placed on your home screen!</p>
                </div>
              </div>
            </div>

            <button className="btn btn-primary full-width" onClick={() => setShowIosGuide(false)}>
              Got It!
            </button>
          </div>
        </div>
      )}

      <style>{`
        .install-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.18) 100%);
          border-bottom: 1px solid rgba(99, 102, 241, 0.3);
          padding: 10px 16px;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 85;
          backdrop-filter: blur(12px);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .banner-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .banner-text h4 {
          font-size: 0.88rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .banner-text p {
          font-size: 0.76rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .banner-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .install-btn {
          padding: 6px 12px;
          font-size: 0.82rem;
        }

        .dismiss-btn {
          color: var(--text-muted);
        }

        .ios-guide-card {
          max-width: 420px;
        }

        .ios-guide-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .ios-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .ios-step-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          padding: 12px 14px;
          border-radius: var(--radius-sm);
        }

        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-text {
          font-size: 0.88rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .full-width {
          width: 100%;
        }
      `}</style>
    </>
  );
};
