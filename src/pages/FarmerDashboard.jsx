// FarmerDashboard.jsx
// ─────────────────────────────────────────────────────────────────
// Place at: src/pages/FarmerDashboard.jsx
// Requires: react-router-dom, ../theme.js, ../services/api.js, ../context/AuthContext
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { injectTheme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { getAllBids, sendRequest, getFarmerRequests } from '../services/api';

const CROPS = ['All', 'Paddy', 'Wheat', 'Sugarcane', 'Soybean', 'Maize', 'Mustard'];

const CROP_EMOJI = {
  Paddy: '🌾', Wheat: '🌿', Sugarcane: '🎋',
  Soybean: '🫘', Maize: '🌽', Mustard: '🌼', Default: '🌱',
};

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    cls: 'km-badge--pending'   },
  accepted:   { label: 'Accepted',   cls: 'km-badge--accepted'  },
  declined:   { label: 'Declined',   cls: 'km-badge--declined'  },
  dispatched: { label: 'Dispatched', cls: 'km-badge--dispatched' },
};

// ── Reusable Navbar for Farmer ───────────────────────────────────
function FarmerNav({ user, logout }) {
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
        <span className="km-badge km-badge--farmer">🌾 Farmer</span>
        <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 4 }}>{user?.Name}</span>
        <button className="km-btn km-btn--outline km-btn--sm" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

// ── Bid Card ─────────────────────────────────────────────────────
function BidCard({ bid, onOffer, delay = 0 }) {
  const emoji = CROP_EMOJI[bid.Crop] || CROP_EMOJI.Default;
  return (
    <div className="km-bid-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="km-bid-card__stripe" />
      <div className="km-bid-card__body">
        <div className="km-bid-card__top">
          <div>
            <div className="km-bid-card__crop">{emoji} {bid.Crop}</div>
            <div className="km-bid-card__variety">{bid.Variety || '—'}</div>
          </div>
          <div className="km-bid-card__price">₹{Number(bid.Price).toLocaleString('en-IN')}/qtl</div>
        </div>
        <div className="km-bid-card__details">
          <div className="km-bid-card__detail-item">
            <div className="km-bid-card__detail-label">Quantity</div>
            <div className="km-bid-card__detail-val">{bid.Quantity} qtl</div>
          </div>
          <div className="km-bid-card__detail-item">
            <div className="km-bid-card__detail-label">Vehicle</div>
            <div className="km-bid-card__detail-val">{bid.VehicleAvail === 'Yes' ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div className="km-bid-card__detail-item">
            <div className="km-bid-card__detail-label">District</div>
            <div className="km-bid-card__detail-val">📍 {bid.District}</div>
          </div>
          <div className="km-bid-card__detail-item">
            <div className="km-bid-card__detail-label">Moisture</div>
            <div className="km-bid-card__detail-val">{bid.Moisture || 'As per grade'}</div>
          </div>
        </div>
        <div className="km-bid-card__footer">
          <div className="km-bid-card__vendor">
            <div className="km-bid-card__avatar">{(bid.VendorName || 'V')[0]}</div>
            <div>
              <div className="km-bid-card__vendor-name">{bid.VendorName}</div>
              <div className="km-bid-card__vendor-loc">{bid.District}, {bid.State || ''}</div>
            </div>
          </div>
          <button
            className="km-btn km-btn--primary km-btn--sm"
            onClick={() => onOffer(bid)}
          >
            Offer Harvest
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Offer Modal ──────────────────────────────────────────────────
function OfferModal({ bid, farmerPhone, onClose, onSend }) {
  const [phone, setPhone]   = useState(farmerPhone || '');
  const [qty, setQty]       = useState('');
  const [note, setNote]     = useState('');
  const [loading, setLoad]  = useState(false);
  const [done, setDone]     = useState(false);

  const handleSend = async () => {
    if (!phone) return;
    setLoad(true);
    await onSend({ phone, qty, note });
    setDone(true);
    setLoad(false);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="km-modal-overlay" onClick={onClose}>
      <div className="km-modal" onClick={e => e.stopPropagation()}>
        <div className="km-modal__title">Offer Your Harvest 🌾</div>
        <div className="km-modal__sub">
          You're responding to <strong>{bid.VendorName}</strong>'s bid for{' '}
          <strong>{bid.Crop} — {bid.Variety}</strong> at{' '}
          <strong>₹{Number(bid.Price).toLocaleString('en-IN')}/qtl</strong>.
          <br />Share your contact so they can negotiate and arrange pickup.
        </div>

        {!done ? (
          <>
            <div className="km-form-group">
              <label className="km-label">Your Phone Number</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  padding: '12px 14px', background: 'var(--fog)',
                  border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  fontSize: 14, fontWeight: 600, color: 'var(--muted)', whiteSpace: 'nowrap',
                }}>🇮🇳 +91</span>
                <input
                  className="km-input"
                  type="tel" placeholder="10-digit mobile number"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
            <div className="km-form-group">
              <label className="km-label">Quantity Available (Quintals)</label>
              <input className="km-input" type="number" placeholder="e.g. 20"
                value={qty} onChange={e => setQty(e.target.value)} />
            </div>
            <div className="km-form-group">
              <label className="km-label">Message to Vendor — optional</label>
              <textarea className="km-textarea" placeholder="e.g. Grade A quality, ready to sell next week…"
                value={note} onChange={e => setNote(e.target.value)} rows={2} />
            </div>
            <div className="km-modal__btns">
              <button className="km-btn km-btn--ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button
                className="km-btn km-btn--primary"
                style={{ flex: 2 }} onClick={handleSend}
                disabled={!phone || loading}
              >
                {loading ? <><span className="km-btn__spinner" /> Sending…</> : '📞 Share My Number'}
              </button>
            </div>
          </>
        ) : (
          <div className="km-modal__success">
            ✅ Your number has been shared! <strong>{bid.VendorName}</strong> will contact you soon to negotiate.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeleton Loader ──────────────────────────────────────────────
function BidSkeleton() {
  return (
    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
      <div style={{ height: 5, background: 'var(--fog)' }} />
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="km-skeleton" style={{ width: 120, height: 20, marginBottom: 6 }} />
            <div className="km-skeleton" style={{ width: 80, height: 14 }} />
          </div>
          <div className="km-skeleton" style={{ width: 90, height: 32, borderRadius: 100 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[1,2,3,4].map(i => <div key={i} className="km-skeleton" style={{ height: 40 }} />)}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="km-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <div>
              <div className="km-skeleton" style={{ width: 100, height: 14, marginBottom: 5 }} />
              <div className="km-skeleton" style={{ width: 70, height: 11 }} />
            </div>
          </div>
          <div className="km-skeleton" style={{ width: 100, height: 34, borderRadius: 100 }} />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function FarmerDashboard() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab]           = useState('bids');
  const [bids, setBids]         = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [reqLoading, setReqLoad]= useState(true);
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [toast, setToast]       = useState(null);

  useEffect(() => { injectTheme(); }, []);

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.Role !== 'farmer') { navigate('/vendor'); }
  }, [user]);

  // Load bids
  useEffect(() => {
    getAllBids()
      .then(data => setBids(Array.isArray(data) ? data : []))
      .catch(() => setToast({ type: 'error', msg: 'Failed to load bids. Check your connection.' }))
      .finally(() => setLoading(false));
  }, []);

  // Load requests
  useEffect(() => {
    if (!user?.UserID) return;
    getFarmerRequests(user.UserID)
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .finally(() => setReqLoad(false));
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSendOffer = async ({ phone, qty, note }) => {
    try {
      await sendRequest({
        FarmerID: user.UserID,
        BidID: modal.BidID,
        VendorID: modal.VendorID,
        FarmerPhone: phone,
        Quantity: qty,
        Note: note,
        Status: 'pending',
      });
      setRequests(prev => [...prev, {
        ReqID: 'temp_' + Date.now(),
        BidID: modal.BidID,
        FarmerPhone: phone,
        Quantity: qty,
        Status: 'pending',
      }]);
      setToast({ type: 'success', msg: '✅ Request sent! Vendor will call you soon.' });
    } catch {
      setToast({ type: 'error', msg: 'Failed to send. Please try again.' });
    }
  };

  // Filter + search
  const filteredBids = bids.filter(b => {
    const matchesCrop = filter === 'All' || b.Crop === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || [b.Crop, b.Variety, b.VendorName, b.District]
      .some(v => (v || '').toLowerCase().includes(q));
    return matchesCrop && matchesSearch;
  });

  const stats = [
    { icon: '📋', num: bids.length,           label: 'Live Bids Near You' },
    { icon: '🌾', num: [...new Set(bids.map(b => b.Crop))].length, label: 'Crop Types' },
    { icon: '💰', num: bids.length ? `₹${Math.max(...bids.map(b => Number(b.Price) || 0)).toLocaleString('en-IN')}` : '—', label: 'Best Price/qtl' },
    { icon: '📤', num: requests.length,        label: 'My Requests' },
  ];

  const sidebarItems = [
    { id: 'bids',     icon: '📋', label: 'Browse Bids',   count: bids.length },
    { id: 'requests', icon: '📤', label: 'My Requests',    count: requests.length },
    { id: 'profile',  icon: '👤', label: 'My Profile',     count: null },
  ];

  return (
    <>
      <FarmerNav user={user} logout={handleLogout} />

      <div className="km-dash">
        {/* Sidebar */}
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
                <span className="km-sidebar__badge">{item.count}</span>
              )}
            </button>
          ))}

          <div className="km-sidebar__section-label" style={{ marginTop: 12 }}>Quick Info</div>
          <div style={{
            padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-sm)', margin: '0 4px',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Your Location</div>
            <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>
              📍 {user?.District || '—'}, {user?.State || '—'}
            </div>
            {user?.FarmSize && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                🌾 {user.FarmSize} acres
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="km-main">

          {/* ── BIDS TAB ── */}
          {tab === 'bids' && (
            <>
              <div className="km-page-header">
                <div className="km-page-title">Available Vendor Bids</div>
                <div className="km-page-subtitle">Vendors near you are looking to buy these crops</div>
              </div>

              {/* Stats */}
              <div className="km-stats-row">
                {stats.map(s => (
                  <div key={s.label} className="km-stat-card">
                    <div className="km-stat-card__icon">{s.icon}</div>
                    <div className="km-stat-card__num">{s.num}</div>
                    <div className="km-stat-card__label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search + Filter */}
              <div className="km-search-bar">
                <div className="km-search-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="km-search-input"
                    placeholder="Search by crop, vendor, location…"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
                {CROPS.map(c => (
                  <button
                    key={c}
                    className={`km-filter-btn${filter === c ? ' active' : ''}`}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Grid */}
              {loading ? (
                <div className="km-bids-grid">
                  {[1,2,3,4,5,6].map(i => <BidSkeleton key={i} />)}
                </div>
              ) : filteredBids.length === 0 ? (
                <div className="km-empty">
                  <div className="km-empty__icon">🌾</div>
                  <div className="km-empty__title">No bids found</div>
                  <div className="km-empty__desc">
                    {search || filter !== 'All'
                      ? 'Try clearing the filter or search term.'
                      : 'No vendors have posted bids yet. Check back later.'}
                  </div>
                </div>
              ) : (
                <div className="km-bids-grid">
                  {filteredBids.map((bid, i) => (
                    <BidCard
                      key={bid.BidID || i}
                      bid={bid}
                      onOffer={() => setModal(bid)}
                      delay={i * 40}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── REQUESTS TAB ── */}
          {tab === 'requests' && (
            <>
              <div className="km-page-header">
                <div className="km-page-title">My Offer Requests</div>
                <div className="km-page-subtitle">Track bids you've responded to</div>
              </div>

              {reqLoading ? (
                <div className="km-spinner" />
              ) : requests.length === 0 ? (
                <div className="km-empty">
                  <div className="km-empty__icon">📤</div>
                  <div className="km-empty__title">No requests yet</div>
                  <div className="km-empty__desc">
                    Go to "Browse Bids" and tap "Offer Harvest" on a bid you're interested in.
                  </div>
                  <button className="km-btn km-btn--primary" onClick={() => setTab('bids')}>
                    Browse Bids →
                  </button>
                </div>
              ) : (
                <div className="km-requests-list">
                  {requests.map((req, i) => {
                    const cfg = STATUS_CONFIG[req.Status] || STATUS_CONFIG.pending;
                    return (
                      <div key={req.ReqID || i} className="km-request-item" style={{ animationDelay: `${i * 40}ms` }}>
                        <div className="km-request-item__info">
                          <div className="km-request-item__crop">
                            {CROP_EMOJI[req.Crop] || '🌾'} {req.Crop || 'Crop Bid'}
                          </div>
                          <div className="km-request-item__detail">
                            Bid ID: {req.BidID} · Qty offered: {req.Quantity} qtl
                          </div>
                          {req.Status === 'accepted' && req.FarmerPhone && (
                            <div className="km-request-item__contact">
                              📞 Vendor will contact you at +91 {req.FarmerPhone}
                            </div>
                          )}
                          {req.Status === 'dispatched' && (
                            <div className="km-request-item__contact" style={{ background: 'var(--info-lt)', color: 'var(--info)' }}>
                              🚛 Vehicle has been dispatched to your location!
                            </div>
                          )}
                        </div>
                        <div className="km-request-item__right">
                          <span className={`km-badge ${cfg.cls}`}>{cfg.label}</span>
                          {req.Price && (
                            <div className="km-request-item__price">
                              ₹{Number(req.Price).toLocaleString('en-IN')}/qtl
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <>
              <div className="km-page-header">
                <div className="km-page-title">My Profile</div>
                <div className="km-page-subtitle">Your farmer account details</div>
              </div>
              <div className="km-profile-card">
                <div className="km-profile-card__section-title">Personal Information</div>
                <div className="km-form-row">
                  <div className="km-form-group">
                    <label className="km-label">Full Name</label>
                    <input className="km-input" defaultValue={user?.Name || ''} />
                  </div>
                  <div className="km-form-group">
                    <label className="km-label">Mobile Number</label>
                    <input className="km-input" defaultValue={user?.Phone || ''} readOnly
                      style={{ opacity: 0.7 }} />
                  </div>
                </div>
                <div className="km-form-row">
                  <div className="km-form-group">
                    <label className="km-label">State</label>
                    <input className="km-input" defaultValue={user?.State || ''} />
                  </div>
                  <div className="km-form-group">
                    <label className="km-label">District</label>
                    <input className="km-input" defaultValue={user?.District || ''} />
                  </div>
                </div>
                <div className="km-form-group">
                  <label className="km-label">Farm Size (Acres)</label>
                  <input className="km-input" type="number" defaultValue={user?.FarmSize || ''} />
                </div>

                <div style={{ marginTop: 24 }}>
                  <div className="km-profile-card__section-title">Crops I Grow</div>
                  <div className="km-crop-tags">
                    {['Paddy','Wheat','Sugarcane','Soybean','Maize','Mustard','Cotton','Pulses'].map(c => (
                      <button key={c} type="button" className="km-crop-tag">{c}</button>
                    ))}
                  </div>
                </div>

                <button
                  className="km-btn km-btn--primary km-btn--full"
                  style={{ marginTop: 28 }}
                  onClick={() => setToast({ type: 'success', msg: '✅ Profile saved successfully!' })}
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

        </main>
      </div>

      {/* Offer Modal */}
      {modal && (
        <OfferModal
          bid={modal}
          farmerPhone={user?.Phone || ''}
          onClose={() => setModal(null)}
          onSend={handleSendOffer}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`km-toast km-toast--${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}