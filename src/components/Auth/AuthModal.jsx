import React from 'react';
import { X } from 'lucide-react';
import { AuthPage } from './AuthPage';

export const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon close-auth-modal" onClick={onClose}>
          <X size={20} />
        </button>
        <AuthPage onClose={onClose} />
      </div>

      <style>{`
        .auth-modal-box {
          max-width: 480px;
          padding: 12px;
          position: relative;
        }

        .close-auth-modal {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};
