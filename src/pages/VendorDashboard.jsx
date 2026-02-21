// VendorDashboard.jsx
// ─────────────────────────────────────────────────────────────────
// Place at: src/pages/VendorDashboard.jsx
// Requires: react-router-dom, ../theme.js, ../services/api.js, ../context/AuthContext
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { injectTheme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { postBid, getVendorRequests, updateStatus } from '../services/api';

const CROPS    = ['Paddy','Wheat','Sugarcane','Soybean','Maize','Mustard','Cotton','Pulses','Vegetables','Other'];
const VARIANTS = {
  Paddy:     ['Basmati 1121','Basmati 1509','PR-106','Sona Masuri','Other'],
  Wheat:     ['HD-2967','PBW-343','HD-3086','DBW-222','Other'],
  Sugarcane: ['CO-238','CO-0238','CoJ-64','Other'],
  Soybean:   ['JS-9305','NRC-37','MACS-450','Other'],
  Maize:     ['Pioneer P3396','DKC-9181','Bio 9681','Other'],
  Mustard:   ['RH-749','Pusa Bold','Varuna','Other'],
};

const STATUS_CONFIG = {
  pending:    { label: 'Pending Review', cls: 'km-badge--pending',    icon: '⏳' },
  accepted:   { label: 'Accepted',       cls: 'km-badge--accepted',   icon: '✅' },
  declined:   { label: 'Declined',       cls: 'km-badge--declined',   icon: '❌' },
  dispatched: { label: 'Dispatched',     cls: 'km-badge--dispatched', icon: '🚛' },
};

function VendorNav({ user, logout }) {
  const navRef = useRef(null);
  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className="km-nav" ref={navRef}>
      <div className="km-nav__logo">
        <div className="km-nav__logo-icon">🌾</div>
        KrishiMadad
      </div>
      <div className="km-nav__right">
        <span className="km-badge km-badge--vendor">🏪 Vendor</span>
        <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 4 }}>{user?.Name}</span>
        <button className="km-btn km-btn--outline km-btn--sm" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

// ── Post Bid Form ─────────────────────────────────────────────────
function PostBidTab({ user, onSuccess }) {
  const EMPTY = {
    Crop: '', Variety: '', Quantity: '', Price: '', PriceMax: '',
    District: '', State: user?.State || '', VehicleAvail: 'Yes',
    Moisture: '', Grade: 'Grade A', Notes: '', ValidUntil: '',
  };
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const set = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.Crop)     e.Crop     = 'Select a crop type';
    if (!form.Quantity) e.Quantity = 'Quantity is required';
    if (!form.Price)    e.Price    = 'Price per quintal is required';
    if (!form.District) e.District = 'District is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await postBid({
        ...form,
        VendorID: user.UserID,
        VendorName: user.BusinessName || user.Name,
      });
      onSuccess('✅ Bid posted! Farmers nearby will see your offer.');
      setForm(EMPTY);
    } catch {
      onSuccess('❌ Failed to post. Try again.', 'error');
    }
    setLoading(false);
  };

  const Field = ({ field, label, children, required }) => (
    <div className="km-form-group">
      <label className="km-label">{label}{required && ' *'}</label>
      {children}
      {errors[field] && <div className="km-field-error">⚠ {errors[field]}</div>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 640 }}>
      <div className="km-page-header">
        <div className="km-page-title">Post a New Bid</div>
        <div className="km-page-subtitle">Let farmers near you know what you're looking to buy</div>
      </div>

      {/* Card 1: Crop */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Crop Details</div>

        <Field field="Crop" label="Crop Type" required>
          <div className="km-crop-tags" style={{ marginTop: 4 }}>
            {CROPS.map(c => (
              <button key={c} type="button"
                className={`km-crop-tag${form.Crop === c ? ' selected' : ''}`}
                onClick={() => { set('Crop', c); set('Variety', ''); }}
              >{c}</button>
            ))}
          </div>
        </Field>

        <div className="km-form-row">
          <Field field="Variety" label="Variety / Grade">
            {VARIANTS[form.Crop] ? (
              <select className="km-select" value={form.Variety} onChange={e => set('Variety', e.target.value)}>
                <option value="">Select variety</option>
                {VARIANTS[form.Crop].map(v => <option key={v}>{v}</option>)}
              </select>
            ) : (
              <input className="km-input" placeholder="e.g. Basmati 1121" value={form.Variety} onChange={e => set('Variety', e.target.value)} />
            )}
          </Field>
          <Field field="Grade" label="Quality Grade">
            <select className="km-select" value={form.Grade} onChange={e => set('Grade', e.target.value)}>
              <option>Grade A (Best)</option>
              <option>Grade B (Good)</option>
              <option>Grade C (Average)</option>
            </select>
          </Field>
        </div>

        <Field field="Moisture" label="Max Moisture Content">
          <input className="km-input" placeholder="e.g. 14% or less" value={form.Moisture} onChange={e => set('Moisture', e.target.value)} />
        </Field>
      </div>

      {/* Card 2: Quantity & Price */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Quantity & Pricing</div>
        <div className="km-form-row">
          <Field field="Quantity" label="Quantity Required (Quintals)" required>
            <input className={`km-input${errors.Quantity ? ' error' : ''}`} type="number"
              placeholder="e.g. 100" value={form.Quantity} onChange={e => set('Quantity', e.target.value)} />
          </Field>
          <Field field="ValidUntil" label="Bid Valid Until">
            <input className="km-input" type="date" value={form.ValidUntil} onChange={e => set('ValidUntil', e.target.value)} />
          </Field>
        </div>
        <div className="km-form-group">
          <label className="km-label">Offered Price Range (₹ per Quintal) *</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input className={`km-input${errors.Price ? ' error' : ''}`} type="number"
              placeholder="Min price" value={form.Price} onChange={e => set('Price', e.target.value)} style={{ flex: 1 }} />
            <span style={{ color: 'var(--muted)', fontSize: 14, whiteSpace: 'nowrap' }}>to</span>
            <input className="km-input" type="number"
              placeholder="Max price" value={form.PriceMax} onChange={e => set('PriceMax', e.target.value)} style={{ flex: 1 }} />
          </div>
          {errors.Price && <div className="km-field-error">⚠ {errors.Price}</div>}
        </div>
      </div>

      {/* Card 3: Location & Logistics */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Location & Logistics</div>
        <div className="km-form-row">
          <Field field="District" label="Your District" required>
            <input className={`km-input${errors.District ? ' error' : ''}`}
              placeholder="e.g. Kanpur" value={form.District} onChange={e => set('District', e.target.value)} />
          </Field>
          <Field field="State" label="State">
            <input className="km-input" placeholder="e.g. Uttar Pradesh"
              value={form.State} onChange={e => set('State', e.target.value)} />
          </Field>
        </div>
        <div className="km-form-row">
          <Field field="VehicleAvail" label="Vehicle for Pickup">
            <select className="km-select" value={form.VehicleAvail} onChange={e => set('VehicleAvail', e.target.value)}>
              <option value="Yes">Yes — We send our vehicle</option>
              <option value="No">No — Farmer must deliver</option>
              <option value="Negotiable">Negotiable</option>
            </select>
          </Field>
          <Field field="Radius" label="Pickup Radius (km)">
            <input className="km-input" type="number" placeholder="e.g. 50"
              value={form.Radius || ''} onChange={e => set('Radius', e.target.value)} />
          </Field>
        </div>
        <Field field="Notes" label="Additional Notes">
          <textarea className="km-textarea" placeholder="Any special requirements, quality specs…"
            value={form.Notes} onChange={e => set('Notes', e.target.value)} rows={2} />
        </Field>
      </div>

      <button className="km-btn km-btn--harvest km-btn--full km-btn--lg" type="submit" disabled={loading}>
        {loading ? <><span className="km-btn__spinner" /> Posting…</> : '🚀 Post Bid Now'}
      </button>
    </form>
  );
}

const cardStyle = {
  background: 'var(--white)', border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-md)', padding: 28, marginBottom: 20,
};
const cardTitleStyle = {
  fontFamily: 'Lora, serif', fontSize: 17, fontWeight: 700,
  color: 'var(--earth)', marginBottom: 20, paddingBottom: 12,
  borderBottom: '1px solid var(--border)',
};

// ── My Bids Tab ───────────────────────────────────────────────────
function MyBidsTab({ bids, loading }) {
  if (loading) return <div className="km-spinner" />;
  if (!bids.length) return (
    <div className="km-empty">
      <div className="km-empty__icon">📋</div>
      <div className="km-empty__title">No active bids</div>
      <div className="km-empty__desc">You haven't posted any bids yet. Go to "Post a Bid" to create your first listing.</div>
    </div>
  );
  return (
    <div className="km-bids-grid">
      {bids.map((bid, i) => (
        <div key={bid.BidID || i} className="km-bid-card" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="km-bid-card__stripe" style={{ background: 'linear-gradient(90deg,var(--sky),var(--info))' }} />
          <div className="km-bid-card__body">
            <div className="km-bid-card__top">
              <div>
                <div className="km-bid-card__crop">🌾 {bid.Crop}</div>
                <div className="km-bid-card__variety">{bid.Variety}</div>
              </div>
              <div className="km-bid-card__price" style={{ background: 'var(--sky)' }}>
                ₹{Number(bid.Price).toLocaleString('en-IN')}/qtl
              </div>
            </div>
            <div className="km-bid-card__details">
              <div className="km-bid-card__detail-item">
                <div className="km-bid-card__detail-label">Quantity</div>
                <div className="km-bid-card__detail-val">{bid.Quantity} qtl</div>
              </div>
              <div className="km-bid-card__detail-item">
                <div className="km-bid-card__detail-label">District</div>
                <div className="km-bid-card__detail-val">📍 {bid.District}</div>
              </div>
              <div className="km-bid-card__detail-item">
                <div className="km-bid-card__detail-label">Vehicle</div>
                <div className="km-bid-card__detail-val">{bid.VehicleAvail === 'Yes' ? '✅ Yes' : '❌ No'}</div>
              </div>
              <div className="km-bid-card__detail-item">
                <div className="km-bid-card__detail-label">Status</div>
                <div className="km-bid-card__detail-val">🟢 Active</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Farmer Requests Tab ───────────────────────────────────────────
function RequestsTab({ requests, loading, onUpdateStatus }) {
  if (loading) return <div className="km-spinner" />;
  if (!requests.length) return (
    <div className="km-empty">
      <div className="km-empty__icon">📩</div>
      <div className="km-empty__title">No farmer requests yet</div>
      <div className="km-empty__desc">When farmers respond to your bids, their contact details will appear here.</div>
    </div>
  );

  return (
    <div className="km-requests-list">
      {requests.map((req, i) => {
        const cfg = STATUS_CONFIG[req.Status] || STATUS_CONFIG.pending;
        return (
          <div key={req.ReqID || i} className="km-request-item" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="km-request-item__info">
              <div className="km-request-item__crop">
                👤 Farmer — {req.Crop || `Bid #${req.BidID}`}
              </div>
              <div className="km-request-item__detail">
                Qty offered: {req.Quantity} qtl
                {req.Note && ` · "${req.Note}"`}
              </div>
              <div className="km-request-item__contact">
                📞 +91 {req.FarmerPhone}
              </div>
            </div>
            <div className="km-request-item__right">
              <span className={`km-badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>

              {req.Status === 'pending' && (
                <div className="km-request-item__actions">
                  <button className="km-btn km-btn--success km-btn--sm"
                    onClick={() => onUpdateStatus(req.ReqID, 'accepted')}>
                    ✅ Accept
                  </button>
                  <button className="km-btn km-btn--danger km-btn--sm"
                    onClick={() => onUpdateStatus(req.ReqID, 'declined')}>
                    ❌ Decline
                  </button>
                </div>
              )}

              {req.Status === 'accepted' && (
                <button className="km-btn km-btn--primary km-btn--sm"
                  onClick={() => onUpdateStatus(req.ReqID, 'dispatched')}>
                  🚛 Mark Dispatched
                </button>
              )}

              {req.Status === 'dispatched' && (
                <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>
                  Vehicle sent to farmer
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function VendorDashboard() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab]           = useState('post');
  const [myBids, setMyBids]     = useState([]);
  const [requests, setRequests] = useState([]);
  const [bidsLoad, setBidsLoad] = useState(false);
  const [reqLoad, setReqLoad]   = useState(true);
  const [toast, setToast]       = useState(null);

  useEffect(() => { injectTheme(); }, []);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.Role !== 'vendor') { navigate('/farmer'); }
  }, [user]);

  useEffect(() => {
    if (!user?.UserID) return;
    getVendorRequests(user.UserID)
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .finally(() => setReqLoad(false));
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleUpdateStatus = async (reqID, status) => {
    try {
      await updateStatus(reqID, status);
      setRequests(prev => prev.map(r => r.ReqID === reqID ? { ...r, Status: status } : r));
      const msgs = {
        accepted:   '✅ Farmer request accepted! Call them to arrange pickup.',
        declined:   'Request declined.',
        dispatched: '🚛 Marked as dispatched! Great job.',
      };
      setToast({ type: status === 'declined' ? 'error' : 'success', msg: msgs[status] });
    } catch {
      setToast({ type: 'error', msg: 'Failed to update. Try again.' });
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const pendingCount = requests.filter(r => r.Status === 'pending').length;

  const sidebarItems = [
    { id: 'post',     icon: '➕', label: 'Post a Bid',        count: null },
    { id: 'mybids',   icon: '📋', label: 'My Active Bids',    count: myBids.length || null },
    { id: 'requests', icon: '📩', label: 'Farmer Requests',   count: requests.length || null, highlight: pendingCount > 0 },
    { id: 'profile',  icon: '👤', label: 'My Profile',        count: null },
  ];

  const stats = [
    { icon: '📋', num: myBids.length,       label: 'Active Bids' },
    { icon: '📩', num: requests.length,      label: 'Total Requests' },
    { icon: '⏳', num: pendingCount,          label: 'Pending Review' },
    { icon: '✅', num: requests.filter(r => r.Status === 'accepted').length, label: 'Accepted' },
  ];

  return (
    <>
      <VendorNav user={user} logout={handleLogout} />

      <div className="km-dash">
        <aside className="km-sidebar">
          <div className="km-sidebar__section-label">Navigation</div>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`km-sidebar__item${tab === item.id ? ' active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span className="km-sidebar__icon">{item.icon}</span>
              {item.label}
              {item.count !== null && item.count > 0 && (
                <span className="km-sidebar__badge" style={item.highlight ? { background: 'var(--harvest)' } : {}}>
                  {item.count}
                </span>
              )}
            </button>
          ))}

          <div className="km-sidebar__section-label" style={{ marginTop: 12 }}>Your Location</div>
          <div style={{
            padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-sm)', margin: '0 4px',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Coverage Area</div>
            <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>
              📍 {user?.District || '—'}, {user?.State || '—'}
            </div>
          </div>
        </aside>

        <main className="km-main">

          {/* ── POST TAB ── */}
          {tab === 'post' && (
            <PostBidTab
              user={user}
              onSuccess={(msg, type = 'success') => setToast({ type, msg })}
            />
          )}

          {/* ── MY BIDS TAB ── */}
          {tab === 'mybids' && (
            <>
              <div className="km-page-header">
                <div className="km-page-title">My Active Bids</div>
                <div className="km-page-subtitle">Manage your current purchase listings</div>
              </div>
              <div className="km-stats-row">
                {stats.map(s => (
                  <div key={s.label} className="km-stat-card">
                    <div className="km-stat-card__icon">{s.icon}</div>
                    <div className="km-stat-card__num">{s.num}</div>
                    <div className="km-stat-card__label">{s.label}</div>
                  </div>
                ))}
              </div>
              <MyBidsTab bids={myBids} loading={bidsLoad} />
            </>
          )}

          {/* ── REQUESTS TAB ── */}
          {tab === 'requests' && (
            <>
              <div className="km-page-header">
                <div className="km-page-title">Farmer Requests</div>
                <div className="km-page-subtitle">Farmers who are interested in your bids — review and accept</div>
              </div>
              {pendingCount > 0 && (
                <div className="km-info-banner km-info-banner--warning" style={{ marginBottom: 20 }}>
                  ⏳ You have <strong>{pendingCount} pending</strong> request{pendingCount > 1 ? 's' : ''} waiting for your response.
                </div>
              )}
              <RequestsTab requests={requests} loading={reqLoad} onUpdateStatus={handleUpdateStatus} />
            </>
          )}

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <>
              <div className="km-page-header">
                <div className="km-page-title">My Profile</div>
                <div className="km-page-subtitle">Your vendor account details</div>
              </div>
              <div className="km-profile-card">
                <div className="km-profile-card__section-title">Business Information</div>
                <div className="km-form-row">
                  <div className="km-form-group">
                    <label className="km-label">Business / Shop Name</label>
                    <input className="km-input" defaultValue={user?.BusinessName || user?.Name || ''} />
                  </div>
                  <div className="km-form-group">
                    <label className="km-label">Owner Name</label>
                    <input className="km-input" defaultValue={user?.Name || ''} />
                  </div>
                </div>
                <div className="km-form-row">
                  <div className="km-form-group">
                    <label className="km-label">Mobile Number</label>
                    <input className="km-input" defaultValue={user?.Phone || ''} readOnly style={{ opacity: 0.7 }} />
                  </div>
                  <div className="km-form-group">
                    <label className="km-label">State</label>
                    <input className="km-input" defaultValue={user?.State || ''} />
                  </div>
                </div>
                <div className="km-form-group">
                  <label className="km-label">District</label>
                  <input className="km-input" defaultValue={user?.District || ''} />
                </div>

                <div style={{ marginTop: 24 }}>
                  <div className="km-profile-card__section-title">Crops I Buy</div>
                  <div className="km-crop-tags">
                    {CROPS.map(c => (
                      <button key={c} type="button" className="km-crop-tag">{c}</button>
                    ))}
                  </div>
                </div>

                <button
                  className="km-btn km-btn--primary km-btn--full"
                  style={{ marginTop: 28 }}
                  onClick={() => setToast({ type: 'success', msg: '✅ Profile saved!' })}
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

        </main>
      </div>

      {toast && (
        <div className={`km-toast km-toast--${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}