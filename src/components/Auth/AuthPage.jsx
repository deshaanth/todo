import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthPage = ({ onClose }) => {
  const {
    login,
    registerWithVerification,
    verifyOTP,
    requestPasswordReset,
    completePasswordReset,
    pendingVerification
  } = useAuth();

  // Screen mode: 'login' | 'register' | 'otp' | 'forgot' | 'new_password'
  const [mode, setMode] = useState('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP inputs state (6 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [resendTimer, setResendTimer] = useState(30);
  const [demoCodeNotice, setDemoCodeNotice] = useState('');

  // Notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend timer countdown
  useEffect(() => {
    let interval = null;
    if (mode === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }
    login(email.trim(), password.trim());
    if (onClose) onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check again.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const generatedCode = registerWithVerification(name.trim(), email.trim(), password.trim());
    setDemoCodeNotice(generatedCode);
    setMode('otp');
    setResendTimer(30);
    setErrorMsg('');
    setSuccessMsg(`Verification code sent to ${email}`);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    const generatedCode = requestPasswordReset(email.trim());
    setDemoCodeNotice(generatedCode);
    setMode('otp');
    setResendTimer(30);
    setErrorMsg('');
    setSuccessMsg(`Password reset code sent to ${email}`);
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    const result = verifyOTP(fullCode);
    if (result.success) {
      if (result.pendingData?.type === 'reset') {
        setMode('new_password');
        setSuccessMsg('Code verified! Enter your new password below.');
      } else {
        setSuccessMsg('Account verified successfully! Welcome to SmartTask.');
        setTimeout(() => {
          if (onClose) onClose();
        }, 1200);
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    completePasswordReset(password.trim());
    setSuccessMsg('Password updated successfully! Logged in.');
    setTimeout(() => {
      if (onClose) onClose();
    }, 1200);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    const newCode = registerWithVerification(name || 'User', email, password);
    setDemoCodeNotice(newCode);
    setResendTimer(30);
    setSuccessMsg('A new verification code has been generated.');
  };

  const quickDemoLogin = (demoEmail) => {
    login(demoEmail, 'password123');
    if (onClose) onClose();
  };

  return (
    <div className="auth-page-container">
      <div className="auth-glass-box">
        {/* Top Header */}
        <div className="auth-top-header">
          <div className="brand-icon">
            <Sparkles size={24} color="#ffffff" />
          </div>
          <h2>SmartTask</h2>
          <span className="auth-sub">Priority & Reminder App</span>
        </div>

        {/* Tab Navigation */}
        {(mode === 'login' || mode === 'register') && (
          <div className="auth-nav-tabs">
            <button
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Log In
            </button>
            <button
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="auth-alert-banner error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="auth-alert-banner success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form-body">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="link-btn"
                onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn btn-primary auth-btn-lg">
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>

            <div className="demo-login-divider">
              <span>or quick login as demo user</span>
            </div>

            <div className="demo-accounts">
              <button
                type="button"
                className="btn btn-secondary sm flex-1"
                onClick={() => quickDemoLogin('alex@smarttask.app')}
              >
                Alex (Student)
              </button>
              <button
                type="button"
                className="btn btn-secondary sm flex-1"
                onClick={() => quickDemoLogin('sarah@smarttask.app')}
              >
                Sarah (Manager)
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn-lg">
              <ShieldCheck size={18} />
              <span>Create Account & Verify</span>
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="auth-form-body">
            <div className="form-intro">
              <KeyRound size={28} className="intro-icon" />
              <h3>Forgot Password?</h3>
              <p>Enter your registered email address to receive a 6-digit verification code.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn-lg">
              <span>Send Verification Code</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="link-btn center"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* 4. OTP VERIFICATION SCREEN */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="auth-form-body">
            <div className="form-intro">
              <ShieldCheck size={32} className="intro-icon success-color" />
              <h3>Enter 6-Digit Code</h3>
              <p>We've sent a 6-digit verification code to <strong>{email}</strong>.</p>
            </div>

            {/* DEMO VERIFICATION CODE BANNER */}
            {demoCodeNotice && (
              <div className="demo-otp-banner">
                <span className="demo-otp-label">🔑 DEMO VERIFICATION CODE:</span>
                <span className="demo-otp-code">{demoCodeNotice}</span>
              </div>
            )}

            <div className="otp-inputs-row">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  maxLength={1}
                  className="otp-digit-box"
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary auth-btn-lg">
              <span>Verify Code & Continue</span>
              <CheckCircle2 size={18} />
            </button>

            <div className="resend-box">
              {resendTimer > 0 ? (
                <span className="resend-text">Resend code in <strong>{resendTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary sm"
                  onClick={handleResendCode}
                >
                  <RotateCcw size={14} />
                  <span>Resend Code</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* 5. NEW PASSWORD FORM (AFTER RESET OTP) */}
        {mode === 'new_password' && (
          <form onSubmit={handleNewPasswordSubmit} className="auth-form-body">
            <div className="form-intro">
              <KeyRound size={28} className="intro-icon" />
              <h3>Set New Password</h3>
              <p>Create a secure password for your account.</p>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn-lg">
              <span>Save & Login</span>
              <CheckCircle2 size={18} />
            </button>
          </form>
        )}
      </div>

      <style>{`
        .auth-page-container {
          width: 100%;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
        }

        .auth-glass-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          width: 100%;
          max-width: 440px;
          box-shadow: var(--shadow-lg);
        }

        .auth-top-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          box-shadow: var(--shadow-glow);
        }

        .auth-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .auth-nav-tabs {
          display: flex;
          background: var(--bg-primary);
          padding: 4px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          padding: 8px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab-btn.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .auth-alert-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .auth-alert-banner.error {
          background: var(--priority-high-bg);
          color: var(--priority-high);
          border: 1px solid var(--priority-high-border);
        }

        .auth-alert-banner.success {
          background: rgba(52, 211, 153, 0.15);
          color: var(--status-completed);
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .input-with-icon .form-input {
          padding-left: 40px;
        }

        .eye-btn {
          position: absolute;
          right: 8px;
        }

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .link-btn {
          background: transparent;
          border: none;
          color: var(--accent-primary);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }

        .link-btn.center {
          display: block;
          margin: 16px auto 0 auto;
        }

        .auth-btn-lg {
          width: 100%;
          padding: 13px;
          font-size: 1rem;
        }

        .demo-login-divider {
          text-align: center;
          margin: 20px 0 12px 0;
          position: relative;
        }

        .demo-login-divider span {
          font-size: 0.76rem;
          color: var(--text-muted);
          background: var(--bg-secondary);
          padding: 0 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .demo-accounts {
          display: flex;
          gap: 10px;
        }

        .form-intro {
          text-align: center;
          margin-bottom: 20px;
        }

        .intro-icon {
          color: var(--accent-primary);
          margin-bottom: 8px;
        }

        .intro-icon.success-color {
          color: var(--status-completed);
        }

        .form-intro h3 {
          font-size: 1.2rem;
          margin-bottom: 4px;
        }

        .form-intro p {
          font-size: 0.86rem;
          color: var(--text-secondary);
        }

        .demo-otp-banner {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
          border: 1px dashed var(--accent-primary);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          text-align: center;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .demo-otp-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .demo-otp-code {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--accent-primary);
        }

        .otp-inputs-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .otp-digit-box {
          width: 46px;
          height: 52px;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 800;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .otp-digit-box:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .resend-box {
          text-align: center;
          margin-top: 16px;
        }

        .resend-text {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
