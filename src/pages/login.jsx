// Login.jsx
// ─────────────────────────────────────────────────────────────────
// Place at: src/pages/Login.jsx
// Requires: react-router-dom, ../theme.js, ../services/api.js, ../context/AuthContext
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { injectTheme } from '../theme';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const [role, setRole]         = useState('farmer');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast]       = useState(null);
  const [shake, setShake]       = useState(false);

  useEffect(() => { injectTheme(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setToast({ type: 'error', msg: 'Please enter your phone number and password.' });
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const result = await loginUser(phone.trim(), password);
      if (result.success) {
        // Verify role matches selected tab
        if (result.user.Role !== role) {
          setToast({
            type: 'error',
            msg: `This account is registered as a ${result.user.Role}. Please select the correct tab.`,
          });
          triggerShake();
          setLoading(false);
          return;
        }
        login(result.user);
        setToast({ type: 'success', msg: `Welcome back, ${result.user.Name}! 🌾` });
        setTimeout(() => navigate(role === 'farmer' ? '/farmer' : '/vendor'), 900);
      } else {
        setToast({ type: 'error', msg: 'Wrong phone or password. Please try again.' });
        triggerShake();
      }
    } catch {
      setToast({ type: 'error', msg: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {showPass
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></>
      }
    </svg>
  );

  return (
    <>
      <nav className="km-nav">
        <div className="km-nav__logo" onClick={() => navigate('/')}>
          <div className="km-nav__logo-icon">🌾</div>
          KrishiMadad
        </div>
        <div className="km-nav__right">
          <button className="km-btn km-btn--ghost km-btn--sm" onClick={() => navigate('/register')}>
            New here? Register free
          </button>
        </div>
      </nav>

      <div className="km-auth-page">
        <div className="km-auth-card" style={shake ? { animation: 'km-shake 0.4s' } : {}}>

          <div className="km-auth-tabs">
            <button
              className={`km-auth-tab${role === 'farmer' ? ' active' : ''}`}
              onClick={() => setRole('farmer')}
            >
              🌾 Farmer
            </button>
            <button
              className={`km-auth-tab${role === 'vendor' ? ' active' : ''}`}
              onClick={() => setRole('vendor')}
            >
              🏪 Vendor / Buyer
            </button>
          </div>

          <div className="km-auth-body">
            <button className="km-auth-back" onClick={() => navigate('/')}>
              ← Back to home
            </button>

            <div className="km-auth-title">Welcome Back 👋</div>
            <div className="km-auth-sub">
              {role === 'farmer'
                ? 'Login to see today\'s best bids from vendors near you.'
                : 'Login to manage your bids and view farmer requests.'}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Phone */}
              <div className="km-form-group">
                <label className="km-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 14, color: 'var(--muted)', fontWeight: 600, pointerEvents: 'none',
                  }}>+91</span>
                  <input
                    className="km-input"
                    style={{ paddingLeft: 46 }}
                    type="tel" placeholder="10-digit mobile number"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    maxLength={10} autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="km-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label className="km-label" style={{ marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    style={{ fontSize: 12, color: 'var(--earth)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="km-input"
                    style={{ paddingRight: 46 }}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                      display: 'flex', alignItems: 'center', padding: 0,
                    }}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>

              {/* Demo hint */}
              <div className="km-info-banner km-info-banner--info" style={{ marginBottom: 16 }}>
                💡 Demo: use any phone & password you registered with.
              </div>

              <button
                className="km-btn km-btn--primary km-btn--full km-btn--lg"
                type="submit" disabled={loading}
              >
                {loading
                  ? <><span className="km-btn__spinner" /> Logging in…</>
                  : `Login as ${role === 'farmer' ? 'Farmer' : 'Vendor'} →`}
              </button>
            </form>

            <div className="km-auth-divider">or</div>

            {/* Quick demo logins */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="km-btn km-btn--outline km-btn--sm"
                style={{ flex: 1, borderRadius: 10 }}
                onClick={() => { setRole('farmer'); setPhone('9876543210'); setPassword('demo123'); }}
              >
                🌾 Try Farmer Demo
              </button>
              <button
                className="km-btn km-btn--outline km-btn--sm"
                style={{ flex: 1, borderRadius: 10 }}
                onClick={() => { setRole('vendor'); setPhone('9812345678'); setPassword('demo123'); }}
              >
                🏪 Try Vendor Demo
              </button>
            </div>

            <div className="km-auth-footer">
              Don't have an account?{' '}
              <a onClick={() => navigate('/register')}>Register free</a>
            </div>
          </div>
        </div>
      </div>

      {/* Shake keyframe injected inline for the error shake */}
      <style>{`@keyframes km-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>

      {toast && (
        <div className={`km-toast km-toast--${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}