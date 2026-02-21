// theme.js
// ─────────────────────────────────────────────────────────────────
// Shared CSS design tokens injected by every page component.
// Import and call injectTheme() at the top of each page's useEffect.
//
// Usage:
//   import { injectTheme } from '../theme';
//   useEffect(() => { injectTheme(); }, []);
// ─────────────────────────────────────────────────────────────────

export const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --earth:       #1E3A0F;
    --earth-mid:   #2D5016;
    --earth-light: #4A7C28;
    --paddy:       #7AB317;
    --harvest:     #D4920C;
    --harvest-lt:  #F5C842;
    --soil:        #6B3E1A;
    --sky:         #3A7CA5;
    --cream:       #FAF6EC;
    --cream-dk:    #F0E8D4;
    --fog:         #EDE5D0;
    --white:       #FFFFFF;
    --text:        #1A1A0A;
    --muted:       #7A7060;
    --border:      rgba(45,80,22,0.14);
    --border-focus: #7AB317;
    --shadow-sm:   0 2px 12px rgba(30,58,15,0.08);
    --shadow-md:   0 8px 32px rgba(30,58,15,0.12);
    --shadow-lg:   0 20px 60px rgba(30,58,15,0.18);
    --radius-sm:   10px;
    --radius-md:   18px;
    --radius-lg:   28px;
    --danger:      #DC2626;
    --danger-lt:   #FEE2E2;
    --success:     #16A34A;
    --success-lt:  #DCFCE7;
    --warning:     #D97706;
    --warning-lt:  #FEF3C7;
    --info:        #3A7CA5;
    --info-lt:     #DBEAFE;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text);
    line-height: 1.65;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── Keyframes ── */
  @keyframes km-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes km-fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes km-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes km-pulse-glow {
    0%,100% { box-shadow: 0 0 0 0 rgba(212,146,12,0.4); }
    50%      { box-shadow: 0 0 0 10px rgba(212,146,12,0); }
  }
  @keyframes km-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes km-slide-in {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes km-toast-in {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Shared Navbar ── */
  .km-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 64px;
    background: rgba(250,246,236,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: box-shadow 0.3s;
  }
  .km-nav.scrolled { box-shadow: var(--shadow-sm); }
  .km-nav__logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Lora', serif; font-size: 20px; font-weight: 700;
    color: var(--earth); cursor: pointer; user-select: none; text-decoration: none;
  }
  .km-nav__logo-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: linear-gradient(135deg, var(--earth-light), var(--paddy));
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .km-nav__right { display: flex; align-items: center; gap: 10px; }

  /* ── Shared Button Styles ── */
  .km-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 28px; border-radius: 100px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.22s; letter-spacing: 0.01em;
    text-decoration: none; user-select: none;
  }
  .km-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
  .km-btn--primary {
    background: linear-gradient(135deg, var(--earth), var(--earth-mid));
    color: var(--white); box-shadow: 0 4px 16px rgba(30,58,15,0.25);
  }
  .km-btn--primary:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(30,58,15,0.35);
  }
  .km-btn--harvest {
    background: var(--harvest); color: var(--white);
    animation: km-pulse-glow 3s infinite;
  }
  .km-btn--harvest:hover:not(:disabled) {
    background: #B87D08; transform: translateY(-2px);
  }
  .km-btn--outline {
    background: transparent; color: var(--earth);
    border: 1.5px solid rgba(45,80,22,0.3);
  }
  .km-btn--outline:hover:not(:disabled) { background: var(--earth); color: white; }
  .km-btn--ghost {
    background: transparent; color: var(--muted); border: none;
    box-shadow: none; padding: 8px 16px;
  }
  .km-btn--ghost:hover { color: var(--earth); background: var(--fog); }
  .km-btn--danger {
    background: var(--danger); color: white;
  }
  .km-btn--danger:hover:not(:disabled) { background: #B91C1C; transform: translateY(-2px); }
  .km-btn--success {
    background: var(--success); color: white;
  }
  .km-btn--success:hover:not(:disabled) { background: #15803D; transform: translateY(-2px); }
  .km-btn--sm { padding: 8px 18px; font-size: 13px; }
  .km-btn--lg { padding: 16px 40px; font-size: 16px; }
  .km-btn--full { width: 100%; }

  /* Spinner inside button */
  .km-btn__spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    animation: km-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Shared Form Elements ── */
  .km-form-group { margin-bottom: 18px; }
  .km-form-group:last-of-type { margin-bottom: 0; }
  .km-label {
    display: block; font-size: 13px; font-weight: 600;
    color: var(--soil); margin-bottom: 7px; letter-spacing: 0.01em;
  }
  .km-input, .km-select, .km-textarea {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    background: var(--cream); color: var(--text);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none; appearance: none;
  }
  .km-input:focus, .km-select:focus, .km-textarea:focus {
    border-color: var(--border-focus);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(122,179,23,0.15);
  }
  .km-input::placeholder { color: #B0A898; }
  .km-input.error { border-color: var(--danger); }
  .km-input.error:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.12); }
  .km-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7060' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; cursor: pointer; }
  .km-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  .km-field-error { font-size: 12px; color: var(--danger); margin-top: 5px; display: flex; align-items: center; gap: 4px; }
  .km-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 500px) { .km-form-row { grid-template-columns: 1fr; } }

  /* ── Badge ── */
  .km-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  }
  .km-badge--farmer  { background: rgba(122,179,23,0.15); color: var(--earth-light); }
  .km-badge--vendor  { background: rgba(58,124,165,0.15); color: var(--sky); }
  .km-badge--pending  { background: var(--warning-lt); color: var(--warning); }
  .km-badge--accepted { background: var(--success-lt); color: var(--success); }
  .km-badge--declined { background: var(--danger-lt);  color: var(--danger); }
  .km-badge--dispatched { background: var(--info-lt); color: var(--info); }

  /* ── Toast ── */
  .km-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 500; max-width: 340px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    animation: km-toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .km-toast--success { background: var(--earth); color: white; }
  .km-toast--error   { background: var(--danger); color: white; }
  .km-toast--info    { background: var(--sky);    color: white; }

  /* ── Dashboard Sidebar ── */
  .km-dash {
    display: flex; min-height: 100vh; padding-top: 64px;
  }
  .km-sidebar {
    width: 232px; background: var(--earth);
    position: fixed; top: 64px; left: 0; bottom: 0;
    overflow-y: auto; padding: 20px 12px; z-index: 100;
    display: flex; flex-direction: column; gap: 4px;
  }
  .km-sidebar__section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
    padding: 12px 8px 6px; margin-top: 8px;
  }
  .km-sidebar__item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.18s; user-select: none; border: none;
    background: transparent; font-family: 'DM Sans', sans-serif;
    text-align: left; width: 100%;
  }
  .km-sidebar__item:hover { background: rgba(255,255,255,0.1); color: white; }
  .km-sidebar__item.active { background: var(--harvest); color: white; }
  .km-sidebar__icon { font-size: 17px; width: 22px; text-align: center; flex-shrink: 0; }
  .km-sidebar__badge {
    margin-left: auto; background: rgba(255,255,255,0.15);
    color: white; font-size: 11px; font-weight: 700;
    padding: 2px 8px; border-radius: 100px;
  }
  .km-sidebar__item.active .km-sidebar__badge { background: rgba(255,255,255,0.25); }

  .km-main { margin-left: 232px; flex: 1; padding: 32px; max-width: 100%; }
  @media (max-width: 768px) {
    .km-sidebar { width: 0; overflow: hidden; transition: width 0.3s; }
    .km-sidebar.open { width: 232px; }
    .km-main { margin-left: 0; padding: 20px; }
  }

  /* ── Page Header ── */
  .km-page-header { margin-bottom: 28px; }
  .km-page-title {
    font-family: 'Lora', serif; font-size: 26px; font-weight: 700;
    color: var(--earth); margin-bottom: 4px;
  }
  .km-page-subtitle { font-size: 14px; color: var(--muted); }

  /* ── Stat Cards ── */
  .km-stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px; margin-bottom: 28px;
  }
  .km-stat-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius-md); padding: 20px;
    transition: box-shadow 0.2s;
  }
  .km-stat-card:hover { box-shadow: var(--shadow-sm); }
  .km-stat-card__icon { font-size: 24px; margin-bottom: 10px; }
  .km-stat-card__num {
    font-family: 'Lora', serif; font-size: 26px; font-weight: 700;
    color: var(--earth); line-height: 1;
  }
  .km-stat-card__label { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 500; }

  /* ── Search & Filter Bar ── */
  .km-search-bar {
    display: flex; gap: 10px; margin-bottom: 22px; flex-wrap: wrap; align-items: center;
  }
  .km-search-wrap {
    flex: 1; min-width: 200px; position: relative;
  }
  .km-search-wrap svg {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    pointer-events: none; color: var(--muted);
  }
  .km-search-input {
    width: 100%; padding: 11px 16px 11px 40px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    background: var(--white); outline: none; transition: border-color 0.2s;
  }
  .km-search-input:focus { border-color: var(--border-focus); }
  .km-filter-btn {
    padding: 10px 18px; border: 1.5px solid var(--border); border-radius: 100px;
    background: var(--white); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    color: var(--muted); white-space: nowrap;
  }
  .km-filter-btn:hover { border-color: var(--earth); color: var(--earth); }
  .km-filter-btn.active { background: var(--earth); color: white; border-color: var(--earth); }

  /* ── Bid Card ── */
  .km-bids-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 18px;
  }
  .km-bid-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius-md); overflow: hidden;
    transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1);
    cursor: pointer; animation: km-fadeUp 0.4s both;
  }
  .km-bid-card:hover {
    transform: translateY(-5px); box-shadow: var(--shadow-md);
    border-color: rgba(122,179,23,0.4);
  }
  .km-bid-card__stripe { height: 5px; background: linear-gradient(90deg, var(--paddy), var(--harvest)); }
  .km-bid-card__body { padding: 18px; }
  .km-bid-card__top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .km-bid-card__crop {
    font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: var(--earth);
  }
  .km-bid-card__variety { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .km-bid-card__price {
    background: var(--harvest); color: white; padding: 6px 13px;
    border-radius: 100px; font-size: 14px; font-weight: 700; white-space: nowrap;
  }
  .km-bid-card__details {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;
  }
  .km-bid-card__detail-item { }
  .km-bid-card__detail-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .km-bid-card__detail-val { font-size: 13px; font-weight: 600; color: var(--text); margin-top: 2px; }
  .km-bid-card__footer {
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid var(--border); padding-top: 13px; margin-top: 4px;
  }
  .km-bid-card__vendor { display: flex; align-items: center; gap: 9px; }
  .km-bid-card__avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--earth-light), var(--earth));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 13px; font-weight: 700;
  }
  .km-bid-card__vendor-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .km-bid-card__vendor-loc { font-size: 11px; color: var(--muted); }

  /* ── Request Item ── */
  .km-requests-list { display: flex; flex-direction: column; gap: 12px; }
  .km-request-item {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius-md); padding: 18px 20px;
    display: flex; justify-content: space-between; align-items: center;
    gap: 16px; transition: box-shadow 0.2s; flex-wrap: wrap;
    animation: km-fadeUp 0.4s both;
  }
  .km-request-item:hover { box-shadow: var(--shadow-sm); }
  .km-request-item__info { flex: 1; min-width: 200px; }
  .km-request-item__crop {
    font-family: 'Lora', serif; font-size: 17px; font-weight: 700; color: var(--earth);
  }
  .km-request-item__detail { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .km-request-item__contact {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 8px; background: var(--fog); padding: 5px 12px;
    border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--text);
  }
  .km-request-item__right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .km-request-item__price { font-size: 16px; font-weight: 700; color: var(--earth); }
  .km-request-item__actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

  /* ── Modal ── */
  .km-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    z-index: 500; display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: km-fadeIn 0.2s;
    backdrop-filter: blur(4px);
  }
  .km-modal {
    background: var(--white); border-radius: var(--radius-lg);
    padding: 36px; max-width: 440px; width: 100%;
    box-shadow: var(--shadow-lg);
    animation: km-toast-in 0.3s cubic-bezier(0.34,1.2,0.64,1);
  }
  .km-modal__title {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700;
    color: var(--earth); margin-bottom: 4px;
  }
  .km-modal__sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }
  .km-modal__success {
    background: var(--success-lt); border: 1.5px solid rgba(22,163,74,0.3);
    border-radius: var(--radius-sm); padding: 13px 16px;
    font-size: 14px; color: var(--success); margin-top: 16px;
    display: flex; align-items: center; gap: 8px;
    animation: km-fadeUp 0.3s;
  }
  .km-modal__btns { display: flex; gap: 10px; margin-top: 20px; }

  /* ── Profile Card ── */
  .km-profile-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius-md); padding: 28px; max-width: 520px;
  }
  .km-profile-card__section-title {
    font-family: 'Lora', serif; font-size: 17px; font-weight: 700;
    color: var(--earth); margin-bottom: 18px; padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  /* ── Crop Tag Row ── */
  .km-crop-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .km-crop-tag {
    padding: 6px 16px; border-radius: 100px;
    border: 1.5px solid var(--border); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.18s; background: var(--cream);
    color: var(--text); font-family: 'DM Sans', sans-serif;
  }
  .km-crop-tag.selected { background: var(--earth); color: white; border-color: var(--earth); }
  .km-crop-tag:hover:not(.selected) { border-color: var(--earth); color: var(--earth); }

  /* ── Empty State ── */
  .km-empty {
    text-align: center; padding: 60px 20px; color: var(--muted);
  }
  .km-empty__icon { font-size: 52px; margin-bottom: 16px; opacity: 0.5; }
  .km-empty__title { font-family: 'Lora', serif; font-size: 20px; color: var(--earth); margin-bottom: 8px; }
  .km-empty__desc { font-size: 14px; line-height: 1.7; max-width: 320px; margin: 0 auto 20px; }

  /* ── Skeleton Loader ── */
  .km-skeleton {
    background: linear-gradient(90deg, var(--fog) 25%, var(--cream-dk) 50%, var(--fog) 75%);
    background-size: 400px 100%;
    animation: km-shimmer 1.4s infinite;
    border-radius: var(--radius-sm);
  }

  /* ── Loading Spinner ── */
  .km-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 3px solid var(--fog);
    border-top-color: var(--paddy);
    animation: km-spin 0.8s linear infinite;
    margin: 40px auto;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(45,80,22,0.18); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(45,80,22,0.3); }

  /* ── Auth Pages (Register/Login shared layout) ── */
  .km-auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 80px 20px 40px;
    background: linear-gradient(160deg, var(--cream-dk) 0%, var(--fog) 50%, var(--cream) 100%);
    position: relative; overflow: hidden;
  }
  .km-auth-page::before {
    content: ''; position: absolute; top: -200px; right: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(122,179,23,0.08), transparent 70%);
    pointer-events: none;
  }
  .km-auth-page::after {
    content: ''; position: absolute; bottom: -150px; left: -150px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,146,12,0.07), transparent 70%);
    pointer-events: none;
  }
  .km-auth-card {
    background: var(--white); border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg); width: 100%; max-width: 460px;
    overflow: hidden; position: relative; z-index: 1;
    animation: km-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1);
  }
  .km-auth-tabs { display: flex; border-bottom: 1px solid var(--border); }
  .km-auth-tab {
    flex: 1; padding: 17px; text-align: center;
    font-size: 14px; font-weight: 600; cursor: pointer;
    border: none; background: var(--fog); color: var(--muted);
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    border-bottom: 3px solid transparent;
  }
  .km-auth-tab.active {
    background: var(--white); color: var(--earth);
    border-bottom-color: var(--harvest);
  }
  .km-auth-body { padding: 32px; }
  .km-auth-title {
    font-family: 'Lora', serif; font-size: 26px; font-weight: 700;
    color: var(--earth); margin-bottom: 4px;
  }
  .km-auth-sub { font-size: 14px; color: var(--muted); margin-bottom: 26px; line-height: 1.6; }
  .km-auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 20px 0;
    font-size: 12px; color: var(--muted);
  }
  .km-auth-divider::before, .km-auth-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .km-auth-footer {
    text-align: center; margin-top: 20px; font-size: 13px; color: var(--muted);
  }
  .km-auth-footer a {
    color: var(--earth); font-weight: 600; cursor: pointer; text-decoration: underline;
  }
  .km-auth-back {
    display: flex; align-items: center; gap: 6px; font-size: 13px;
    color: var(--muted); cursor: pointer; margin-bottom: 20px;
    border: none; background: none; font-family: 'DM Sans', sans-serif;
    padding: 0; transition: color 0.2s;
  }
  .km-auth-back:hover { color: var(--earth); }

  /* ── Info Banner inside form ── */
  .km-info-banner {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; border-radius: var(--radius-sm);
    font-size: 13px; margin-bottom: 16px; line-height: 1.6;
  }
  .km-info-banner--success { background: var(--success-lt); color: var(--success); border: 1px solid rgba(22,163,74,0.2); }
  .km-info-banner--warning { background: var(--warning-lt); color: var(--warning); border: 1px solid rgba(217,119,6,0.2); }
  .km-info-banner--info    { background: var(--info-lt);    color: var(--info);    border: 1px solid rgba(58,124,165,0.2); }
`;

export function injectTheme() {
  const id = 'km-theme-styles';
  if (!document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id;
    el.textContent = THEME_CSS;
    document.head.appendChild(el);
  }
}