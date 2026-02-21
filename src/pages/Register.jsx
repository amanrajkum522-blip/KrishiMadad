// // Register.jsx
// // ─────────────────────────────────────────────────────────────────
// // Place at: src/pages/Register.jsx
// // Requires: react-router-dom, ../theme.js, ../services/api.js
// // ─────────────────────────────────────────────────────────────────

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { injectTheme } from '../theme';
// import { registerUser } from '../services/api';

// const STATES = [
//   'Andhra Pradesh','Bihar','Chhattisgarh','Gujarat','Haryana',
//   'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
//   'Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana',
//   'Uttar Pradesh','Uttarakhand','West Bengal',
// ];

// const CROPS = ['Paddy','Wheat','Sugarcane','Soybean','Maize','Mustard','Cotton','Pulses','Vegetables','Other'];

// // Simple field validation
// function validate(form, role) {
//   const errors = {};
//   if (!form.name.trim())       errors.name     = 'Full name is required';
//   if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
//   if (!form.state)             errors.state    = 'Please select your state';
//   if (!form.district.trim())   errors.district = 'District is required';
//   if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
//   if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
//   if (role === 'vendor' && !form.businessName.trim()) errors.businessName = 'Business name is required';
//   return errors;
// }

// export default function Register() {
//   const navigate = useNavigate();
//   const [role, setRole]       = useState('farmer');
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast]     = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [selectedCrops, setSelectedCrops] = useState([]);

//   const [form, setForm] = useState({
//     name: '', phone: '', password: '', confirmPassword: '',
//     state: '', district: '', farmSize: '', businessName: '',
//   });

//   useEffect(() => { injectTheme(); }, []);

//   // Auto-dismiss toast
//   useEffect(() => {
//     if (!toast) return;
//     const t = setTimeout(() => setToast(null), 3500);
//     return () => clearTimeout(t);
//   }, [toast]);

//   const handleChange = (e) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     if (fieldErrors[e.target.name]) {
//       setFieldErrors(prev => ({ ...prev, [e.target.name]: undefined }));
//     }
//   };

//   const toggleCrop = (crop) => {
//     setSelectedCrops(prev =>
//       prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validate(form, role);
//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await registerUser({
//         name: form.name.trim(),
//         phone: form.phone.trim(),
//         password: form.password,
//         state: form.state,
//         district: form.district.trim(),
//         role,
//         farmSize: form.farmSize || '',
//         businessName: role === 'vendor' ? form.businessName.trim() : '',
//         crops: selectedCrops.join(', '),
//       });

//       if (result.success) {
//         setToast({ type: 'success', msg: '🎉 Account created! Please login.' });
//         setTimeout(() => navigate('/login'), 1500);
//       } else {
//         setToast({ type: 'error', msg: result.error || 'Registration failed. Try again.' });
//       }
//     } catch {
//       setToast({ type: 'error', msg: 'Network error. Check your connection.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const Field = ({ name, label, type = 'text', placeholder, children }) => (
//     <div className="km-form-group">
//       <label className="km-label">{label}</label>
//       {children || (
//         <input
//           className={`km-input${fieldErrors[name] ? ' error' : ''}`}
//           name={name} type={type} placeholder={placeholder}
//           value={form[name]} onChange={handleChange} autoComplete="off"
//         />
//       )}
//       {fieldErrors[name] && (
//         <div className="km-field-error">⚠ {fieldErrors[name]}</div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Minimal nav */}
//       <nav className="km-nav">
//         <div className="km-nav__logo" onClick={() => navigate('/')}>
//           <div className="km-nav__logo-icon">🌾</div>
//           KrishiMadad
//         </div>
//         <div className="km-nav__right">
//           <button className="km-btn km-btn--ghost km-btn--sm" onClick={() => navigate('/login')}>
//             Already registered? Login
//           </button>
//         </div>
//       </nav>

//       <div className="km-auth-page">
//         <div className="km-auth-card">
//           {/* Role tabs */}
//           <div className="km-auth-tabs">
//             <button
//               className={`km-auth-tab${role === 'farmer' ? ' active' : ''}`}
//               onClick={() => { setRole('farmer'); setFieldErrors({}); }}
//             >
//               🌾 Farmer
//             </button>
//             <button
//               className={`km-auth-tab${role === 'vendor' ? ' active' : ''}`}
//               onClick={() => { setRole('vendor'); setFieldErrors({}); }}
//             >
//               🏪 Vendor / Buyer
//             </button>
//           </div>

//           <div className="km-auth-body">
//             <button className="km-auth-back" onClick={() => navigate('/')}>
//               ← Back to home
//             </button>

//             <div className="km-auth-title">Create Account</div>
//             <div className="km-auth-sub">
//               {role === 'farmer'
//                 ? 'Register as a farmer to browse vendor bids and sell your harvest directly.'
//                 : 'Register as a vendor to post crop bids and connect with farmers near you.'}
//             </div>

//             <form onSubmit={handleSubmit} noValidate>
//               {/* ── Personal Info ── */}
//               <div className="km-form-row">
//                 <Field name="name" label="Full Name" placeholder="e.g. Ramesh Kumar" />
//                 <Field name="phone" label="Mobile Number" type="tel" placeholder="10-digit number" />
//               </div>

//               {role === 'vendor' && (
//                 <Field name="businessName" label="Business / Shop Name" placeholder="e.g. Sharma Traders" />
//               )}

//               <div className="km-form-row">
//                 <div className="km-form-group">
//                   <label className="km-label">State</label>
//                   <select
//                     className={`km-select${fieldErrors.state ? ' error' : ''}`}
//                     name="state" value={form.state} onChange={handleChange}
//                   >
//                     <option value="">Select State</option>
//                     {STATES.map(s => <option key={s}>{s}</option>)}
//                   </select>
//                   {fieldErrors.state && <div className="km-field-error">⚠ {fieldErrors.state}</div>}
//                 </div>
//                 <Field name="district" label="District" placeholder="e.g. Lucknow" />
//               </div>

//               {role === 'farmer' && (
//                 <Field name="farmSize" label="Farm Size (Acres) — optional" type="number" placeholder="e.g. 5" />
//               )}

//               {/* ── Crops ── */}
//               <div className="km-form-group">
//                 <label className="km-label">
//                   {role === 'farmer' ? 'Crops You Grow' : 'Crops You Buy'} — optional
//                 </label>
//                 <div className="km-crop-tags">
//                   {CROPS.map(c => (
//                     <button
//                       key={c} type="button"
//                       className={`km-crop-tag${selectedCrops.includes(c) ? ' selected' : ''}`}
//                       onClick={() => toggleCrop(c)}
//                     >
//                       {c}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* ── Password ── */}
//               <div className="km-form-row">
//                 <Field name="password" label="Password" type="password" placeholder="Min. 6 characters" />
//                 <Field name="confirmPassword" label="Confirm Password" type="password" placeholder="Re-enter password" />
//               </div>

//               {/* Info */}
//               <div className="km-info-banner km-info-banner--info" style={{ marginTop: 4 }}>
//                 🔒 Your phone number is only shared when you choose to contact a {role === 'farmer' ? 'vendor' : 'farmer'}.
//               </div>

//               <button
//                 className="km-btn km-btn--primary km-btn--full km-btn--lg"
//                 type="submit" disabled={loading}
//                 style={{ marginTop: 8 }}
//               >
//                 {loading ? <><span className="km-btn__spinner" /> Creating Account…</> : 'Create Account →'}
//               </button>
//             </form>

//             <div className="km-auth-footer">
//               Already have an account?{' '}
//               <a onClick={() => navigate('/login')}>Login here</a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Toast */}
//       {toast && (
//         <div className={`km-toast km-toast--${toast.type}`}>
//           {toast.msg}
//         </div>
//       )}
//     </>
//   );
// }


//updated register component 


// src/pages/Register.jsx
// No CSS imports needed — all styles live in src/index.css, loaded once in main.jsx

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const STATES = [
  'Andhra Pradesh','Bihar','Chhattisgarh','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana',
  'Uttar Pradesh','Uttarakhand','West Bengal',
];

const CROPS = [
  'Paddy','Wheat','Sugarcane','Soybean','Maize',
  'Mustard','Cotton','Pulses','Vegetables','Other',
];

function validate(form, role) {
  const errors = {};
  if (!form.name.trim())                        errors.name            = 'Full name is required';
  if (!/^[6-9]\d{9}$/.test(form.phone))        errors.phone           = 'Enter a valid 10-digit mobile number';
  if (!form.state)                              errors.state           = 'Please select your state';
  if (!form.district.trim())                    errors.district        = 'District is required';
  if (form.password.length < 6)                errors.password        = 'Password must be at least 6 characters';
  if (form.password !== form.confirmPassword)   errors.confirmPassword = 'Passwords do not match';
  if (role === 'vendor' && !form.businessName.trim()) errors.businessName = 'Business name is required';
  return errors;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', phone: '', password: '', confirmPassword: '',
    state: '', district: '', farmSize: '', businessName: '',
  });
  const [role, setRole]           = useState('farmer');
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [selectedCrops, setCrops] = useState([]);

  // ── THE CORE FIX ──────────────────────────────────────────────────────────
  //
  // ROOT CAUSE OF FOCUS LOSS:
  //   Every input had:  className={`km-input${fieldErrors.name ? ' error' : ''}`}
  //   When fieldErrors state updated (on every keystroke in the old code),
  //   React saw a different className string → treated it as a changed prop
  //   → unmounted and remounted the input DOM node → cursor jumped out.
  //
  // FIX — two parts:
  //
  //   1. Errors live in a REF (errorsRef), not state.
  //      Mutating a ref never triggers a re-render, so keystrokes only
  //      cause one re-render (from setForm), not two.
  //
  //   2. Error styling uses inline `style` prop (errStyle), not className.
  //      React only updates style properties that actually changed.
  //      An input with a stable className="km-input" is never remounted.
  //      The red border appears/disappears via style without touching className.
  //
  // ─────────────────────────────────────────────────────────────────────────
  const errorsRef = useRef({});
  const [, forceRender] = useState(0);

  const getErr  = (field) => errorsRef.current[field];
  const errStyle = (field) => getErr(field)
    ? { borderColor: 'var(--km-danger)', boxShadow: '0 0 0 3px rgba(220,38,38,0.12)' }
    : {};

  // Single state update per keystroke — no double renders, no focus loss
  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const toggleCrop = useCallback(crop => {
    setCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    errorsRef.current = {};
    forceRender(n => n + 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validate(form, role);
    errorsRef.current = errors;
    forceRender(n => n + 1); // show errors without losing focus (submit, not keystroke)

    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      const result = await registerUser({
        name:         form.name.trim(),
        phone:        form.phone.trim(),
        password:     form.password,
        state:        form.state,
        district:     form.district.trim(),
        role,
        farmSize:     form.farmSize || '',
        businessName: role === 'vendor' ? form.businessName.trim() : '',
        crops:        selectedCrops.join(', '),
      });
      if (result.success) {
        showToast('🎉 Account created! Redirecting to login…');
        setTimeout(() => navigate('/login'), 1600);
      } else {
        showToast(result.error || 'Registration failed. Try again.', 'error');
      }
    } catch {
      showToast('Network error. Check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Error message shown below each field — plain div, not part of input
  const ErrMsg = ({ field }) => {
    const msg = getErr(field);
    return msg ? <div className="km-field-error">⚠ {msg}</div> : null;
  };

  return (
    <>
      <nav className="km-nav">
        <div className="km-nav__logo" onClick={() => navigate('/')}>
          <div className="km-nav__logo-icon">🌾</div>
          KrishiMadad
        </div>
        <div className="km-nav__right">
          <button className="km-btn km-btn--ghost km-btn--sm" onClick={() => navigate('/login')}>
            Already registered? Login
          </button>
        </div>
      </nav>

      <div className="km-auth-page">
        <div className="km-auth-card">

          <div className="km-auth-tabs">
            <button
              className={`km-auth-tab${role === 'farmer' ? ' active' : ''}`}
              onClick={() => handleRoleSwitch('farmer')}
            >
              🌾 Farmer
            </button>
            <button
              className={`km-auth-tab${role === 'vendor' ? ' active' : ''}`}
              onClick={() => handleRoleSwitch('vendor')}
            >
              🏪 Vendor / Buyer
            </button>
          </div>

          <div className="km-auth-body">
            <button className="km-auth-back" onClick={() => navigate('/')}>
              ← Back to home
            </button>

            <div className="km-auth-title">Create Account</div>
            <div className="km-auth-sub">
              {role === 'farmer'
                ? 'Register as a farmer to browse vendor bids and sell your harvest directly.'
                : 'Register as a vendor to post crop bids and connect with farmers near you.'}
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/*
                Conditional fields use display:none — NOT conditional rendering.
                If we used {role === 'vendor' && <div>...input...</div>},
                React would mount/unmount siblings when role changes,
                shifting their tree position and breaking focus on other inputs.
                display:none keeps every node at a fixed tree position always.
              */}

              {/* Vendor-only */}
              <div className="km-form-group" style={{ display: role === 'vendor' ? 'block' : 'none' }}>
                <label className="km-label">Business / Shop Name *</label>
                <input
                  className="km-input"
                  style={errStyle('businessName')}
                  name="businessName"
                  placeholder="e.g. Sharma Traders"
                  value={form.businessName}
                  onChange={handleChange}
                  tabIndex={role === 'vendor' ? 0 : -1}
                  autoComplete="organization"
                />
                <ErrMsg field="businessName" />
              </div>

              <div className="km-form-row">
                <div className="km-form-group">
                  <label className="km-label">Full Name *</label>
                  <input
                    className="km-input"
                    style={errStyle('name')}
                    name="name"
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  <ErrMsg field="name" />
                </div>
                <div className="km-form-group">
                  <label className="km-label">Mobile Number *</label>
                  <input
                    className="km-input"
                    style={errStyle('phone')}
                    name="phone"
                    type="tel"
                    placeholder="10-digit number"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                  <ErrMsg field="phone" />
                </div>
              </div>

              <div className="km-form-row">
                <div className="km-form-group">
                  <label className="km-label">State *</label>
                  <select
                    className="km-select"
                    style={errStyle('state')}
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ErrMsg field="state" />
                </div>
                <div className="km-form-group">
                  <label className="km-label">District *</label>
                  <input
                    className="km-input"
                    style={errStyle('district')}
                    name="district"
                    placeholder="e.g. Lucknow"
                    value={form.district}
                    onChange={handleChange}
                    autoComplete="address-level2"
                  />
                  <ErrMsg field="district" />
                </div>
              </div>

              {/* Farmer-only */}
              <div className="km-form-group" style={{ display: role === 'farmer' ? 'block' : 'none' }}>
                <label className="km-label">Farm Size (Acres) — optional</label>
                <input
                  className="km-input"
                  name="farmSize"
                  type="number"
                  placeholder="e.g. 5"
                  value={form.farmSize}
                  onChange={handleChange}
                  tabIndex={role === 'farmer' ? 0 : -1}
                />
              </div>

              <div className="km-form-group">
                <label className="km-label">
                  {role === 'farmer' ? 'Crops You Grow' : 'Crops You Buy'} — optional
                </label>
                <div className="km-crop-tags">
                  {CROPS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`km-crop-tag${selectedCrops.includes(c) ? ' selected' : ''}`}
                      onClick={() => toggleCrop(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="km-form-row">
                <div className="km-form-group">
                  <label className="km-label">Password *</label>
                  <input
                    className="km-input"
                    style={errStyle('password')}
                    name="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <ErrMsg field="password" />
                </div>
                <div className="km-form-group">
                  <label className="km-label">Confirm Password *</label>
                  <input
                    className="km-input"
                    style={errStyle('confirmPassword')}
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <ErrMsg field="confirmPassword" />
                </div>
              </div>

              <div className="km-info-banner km-info-banner--info" style={{ marginTop: 4, marginBottom: 16 }}>
                🔒 Your number is only shared when you choose to contact a{' '}
                {role === 'farmer' ? 'vendor' : 'farmer'}.
              </div>

              <button
                className="km-btn km-btn--primary km-btn--full km-btn--lg"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? <><span className="km-btn__spinner" /> Creating Account…</>
                  : 'Create Account →'}
              </button>
            </form>

            <div className="km-auth-footer">
              Already have an account?{' '}
              <a onClick={() => navigate('/login')}>Login here</a>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className={`km-toast km-toast--${toast.type}`}>{toast.msg}</div>}
    </>
  );
}