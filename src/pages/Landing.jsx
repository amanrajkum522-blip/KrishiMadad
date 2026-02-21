// Landing.jsx
// KrishiMadad — Complete Landing Page
// All styles are included in this single file via a <style> tag injected into the document.
// Uses: react-router-dom (useNavigate), no external CSS file needed.
//
// HOW TO USE:
//   1. Drop this file into src/pages/Landing.jsx
//   2. Make sure react-router-dom is installed: npm install react-router-dom
//   3. Import it in App.jsx: import Landing from './pages/Landing'
//   4. Add <Route path="/" element={<Landing />} /> in your Routes

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Reset & Base ── */
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --earth:      #1E3A0F;
    --earth-mid:  #2D5016;
    --earth-light:#4A7C28;
    --paddy:      #7AB317;
    --harvest:    #D4920C;
    --harvest-lt: #F5C842;
    --soil:       #6B3E1A;
    --cream:      #FAF6EC;
    --cream-dk:   #F0E8D4;
    --fog:        #EDE5D0;
    --white:      #FFFFFF;
    --text:       #1A1A0A;
    --muted:      #7A7060;
    --card-bg:    rgba(255,252,240,0.85);
    --border:     rgba(45,80,22,0.14);
    --shadow-sm:  0 2px 12px rgba(30,58,15,0.08);
    --shadow-md:  0 8px 32px rgba(30,58,15,0.12);
    --shadow-lg:  0 20px 60px rgba(30,58,15,0.18);
    --radius-sm:  10px;
    --radius-md:  18px;
    --radius-lg:  28px;
    --radius-xl:  40px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text);
    line-height: 1.65;
    overflow-x: hidden;
  }

  /* ── Keyframes ── */
  @keyframes km-fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes km-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes km-slideRight {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes km-float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes km-grain {
    0%, 100% { transform: translate(0, 0); }
    10%      { transform: translate(-2%, -3%); }
    30%      { transform: translate(2%, 1%); }
    50%      { transform: translate(-1%, 3%); }
    70%      { transform: translate(3%, -1%); }
    90%      { transform: translate(-3%, 2%); }
  }
  @keyframes km-pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(212,146,12,0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(212,146,12,0); }
  }
  @keyframes km-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes km-dash-spin {
    from { stroke-dashoffset: 200; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes km-scroll-bounce {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50%       { transform: translateY(6px); opacity: 0.5; }
  }

  /* ── Utility ── */
  .km-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }

  /* ══════════════════════════════════════════
     NAV
  ══════════════════════════════════════════ */
  .km-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 68px;
    background: rgba(250, 246, 236, 0.88);
    backdrop-filter: blur(16px) saturate(1.4);
    border-bottom: 1px solid var(--border);
    transition: background 0.3s, box-shadow 0.3s;
  }
  .km-nav.km-nav--scrolled {
    background: rgba(250, 246, 236, 0.97);
    box-shadow: var(--shadow-sm);
  }
  .km-nav__logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700;
    color: var(--earth); cursor: pointer; text-decoration: none;
    user-select: none;
  }
  .km-nav__logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--earth-light), var(--paddy));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .km-nav__links {
    display: flex; align-items: center; gap: 10px;
  }
  .km-nav__link {
    padding: 8px 20px; border-radius: 100px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; border: none;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.01em;
    text-decoration: none; display: inline-block;
  }
  .km-nav__link--outline {
    background: transparent; color: var(--earth);
    border: 1.5px solid rgba(45,80,22,0.3);
  }
  .km-nav__link--outline:hover {
    background: var(--earth); color: var(--white);
    border-color: var(--earth);
  }
  .km-nav__link--fill {
    background: var(--harvest); color: var(--white);
    border: 1.5px solid transparent;
    animation: km-pulse-glow 3s infinite;
  }
  .km-nav__link--fill:hover {
    background: #B87D08; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(212,146,12,0.35);
  }

  /* ══════════════════════════════════════════
     HERO
  ══════════════════════════════════════════ */
  .km-hero {
    min-height: 100vh;
    background: linear-gradient(160deg, #0D2206 0%, #1A3A0C 30%, #264F14 65%, #3B6E20 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 100px 24px 60px;
  }

  /* Grain texture overlay */
  .km-hero::before {
    content: ''; position: absolute; inset: -50%; width: 200%; height: 200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    animation: km-grain 8s steps(10) infinite;
    pointer-events: none; opacity: 0.5;
  }

  /* Radial glow spots */
  .km-hero__glow {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(80px); opacity: 0.25;
  }
  .km-hero__glow--1 {
    width: 500px; height: 500px; top: -100px; right: -100px;
    background: radial-gradient(circle, #7AB317, transparent);
  }
  .km-hero__glow--2 {
    width: 400px; height: 400px; bottom: -80px; left: -80px;
    background: radial-gradient(circle, #D4920C, transparent);
  }
  .km-hero__glow--3 {
    width: 300px; height: 300px; top: 40%; left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, #4A7C28, transparent);
    opacity: 0.15;
  }

  /* Decorative crop rows SVG at bottom */
  .km-hero__crops {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 120px; overflow: hidden;
  }
  .km-hero__crops svg { width: 100%; height: 100%; }

  .km-hero__content {
    position: relative; z-index: 1;
    text-align: center; max-width: 820px;
    animation: km-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
  }

  .km-hero__tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(122,179,23,0.18); border: 1px solid rgba(122,179,23,0.4);
    color: #A8D85A; padding: 7px 18px; border-radius: 100px;
    font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
    margin-bottom: 28px;
    animation: km-fadeUp 0.8s 0.1s both;
  }
  .km-hero__tag-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #A8D85A;
    box-shadow: 0 0 0 3px rgba(168,216,90,0.3);
    animation: km-pulse-glow 2s infinite;
  }

  .km-hero__title {
    font-family: 'Lora', serif;
    font-size: clamp(38px, 6.5vw, 76px);
    line-height: 1.08; color: #FFFDF5;
    font-weight: 700; margin-bottom: 22px;
    animation: km-fadeUp 0.85s 0.18s both;
  }
  .km-hero__title-accent {
    color: var(--harvest-lt);
    font-style: italic;
    position: relative; display: inline-block;
  }
  .km-hero__title-accent::after {
    content: '';
    position: absolute; left: 0; bottom: -4px; width: 100%; height: 3px;
    background: linear-gradient(90deg, var(--harvest), var(--harvest-lt), transparent);
    border-radius: 2px;
  }

  .km-hero__subtitle {
    font-size: clamp(15px, 1.8vw, 18px);
    color: rgba(255,255,255,0.68);
    max-width: 560px; margin: 0 auto 40px;
    line-height: 1.75;
    animation: km-fadeUp 0.85s 0.26s both;
  }

  .km-hero__btns {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    animation: km-fadeUp 0.85s 0.34s both;
  }

  .km-btn {
    padding: 16px 36px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.25s;
    display: inline-flex; align-items: center; gap: 8px;
    letter-spacing: 0.01em; position: relative; overflow: hidden;
  }
  .km-btn::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0); transition: background 0.2s;
  }
  .km-btn:hover::before { background: rgba(255,255,255,0.08); }

  .km-btn--farmer {
    background: linear-gradient(135deg, var(--paddy), var(--earth-light));
    color: var(--white);
  }
  .km-btn--farmer:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 34px rgba(122,179,23,0.45);
  }
  .km-btn--vendor {
    background: rgba(255,255,255,0.1);
    color: var(--white);
    border: 1.5px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(8px);
  }
  .km-btn--vendor:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.6);
  }

  .km-hero__scroll {
    position: absolute; bottom: 130px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 0.1em;
    font-weight: 600; text-transform: uppercase;
    animation: km-fadeIn 1.2s 0.8s both;
  }
  .km-hero__scroll-arrow {
    width: 20px; height: 20px;
    animation: km-scroll-bounce 1.5s infinite;
  }

  /* ── Hero Stats ── */
  .km-hero__stats {
    position: relative; z-index: 1;
    display: flex; gap: 0; margin-top: 64px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: var(--radius-lg); overflow: hidden;
    backdrop-filter: blur(12px);
    animation: km-fadeUp 0.85s 0.45s both;
    max-width: 700px; width: 100%;
  }
  .km-hero__stat {
    flex: 1; padding: 24px 16px; text-align: center;
    position: relative;
  }
  .km-hero__stat:not(:last-child)::after {
    content: ''; position: absolute; right: 0; top: 20%; bottom: 20%;
    width: 1px; background: rgba(255,255,255,0.12);
  }
  .km-hero__stat-num {
    font-family: 'Lora', serif; font-size: 28px; font-weight: 700;
    color: var(--harvest-lt); display: block; line-height: 1;
    margin-bottom: 6px;
  }
  .km-hero__stat-label {
    font-size: 11px; color: rgba(255,255,255,0.5);
    text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
  }

  /* ══════════════════════════════════════════
     TRUST STRIP
  ══════════════════════════════════════════ */
  .km-trust {
    background: var(--earth); padding: 18px 40px;
    display: flex; align-items: center; justify-content: center;
    gap: 48px; flex-wrap: wrap; overflow: hidden;
  }
  .km-trust__item {
    display: flex; align-items: center; gap: 10px;
    color: rgba(255,255,255,0.65); font-size: 13px; font-weight: 500;
    white-space: nowrap;
  }
  .km-trust__item span:first-child { font-size: 18px; }
  .km-trust__divider {
    width: 1px; height: 24px; background: rgba(255,255,255,0.15);
  }

  /* ══════════════════════════════════════════
     SECTIONS SHARED
  ══════════════════════════════════════════ */
  .km-section {
    padding: 90px 24px;
  }
  .km-section--alt { background: var(--white); }
  .km-section--dark {
    background: linear-gradient(160deg, #0D2206, #1E3A0F);
    color: var(--white);
  }

  .km-section__header {
    text-align: center; max-width: 600px;
    margin: 0 auto 56px;
  }
  .km-section__eyebrow {
    display: inline-block;
    font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--earth-light);
    margin-bottom: 12px;
  }
  .km-section--dark .km-section__eyebrow { color: var(--paddy); }

  .km-section__title {
    font-family: 'Lora', serif; font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 700; color: var(--earth); line-height: 1.2;
    margin-bottom: 14px;
  }
  .km-section--dark .km-section__title { color: var(--white); }

  .km-section__desc {
    font-size: 16px; color: var(--muted); line-height: 1.75;
  }
  .km-section--dark .km-section__desc { color: rgba(255,255,255,0.6); }

  .km-container { max-width: 1080px; margin: 0 auto; }

  /* ══════════════════════════════════════════
     FEATURES GRID
  ══════════════════════════════════════════ */
  .km-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 20px;
  }
  .km-feature-card {
    background: var(--cream);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md); padding: 32px 28px;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor: default; position: relative; overflow: hidden;
  }
  .km-feature-card::before {
    content: ''; position: absolute; inset: 0; opacity: 0;
    background: linear-gradient(135deg, rgba(122,179,23,0.06), rgba(212,146,12,0.04));
    transition: opacity 0.3s;
  }
  .km-feature-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-md);
    border-color: rgba(122,179,23,0.35);
  }
  .km-feature-card:hover::before { opacity: 1; }

  .km-feature-card__icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; margin-bottom: 20px;
    background: linear-gradient(135deg, rgba(122,179,23,0.15), rgba(74,124,40,0.1));
    border: 1px solid rgba(122,179,23,0.2);
  }
  .km-feature-card__title {
    font-family: 'Lora', serif; font-size: 18px; font-weight: 600;
    color: var(--earth); margin-bottom: 10px;
  }
  .km-feature-card__desc {
    font-size: 14px; color: var(--muted); line-height: 1.7;
  }

  /* ══════════════════════════════════════════
     HOW IT WORKS
  ══════════════════════════════════════════ */
  .km-how {
    display: grid; grid-template-columns: 1fr 1fr; gap: 56px;
    max-width: 900px; margin: 0 auto;
  }
  .km-how__col { }
  .km-how__col-title {
    font-family: 'Lora', serif; font-size: 20px; font-weight: 700;
    color: var(--earth); margin-bottom: 28px;
    display: flex; align-items: center; gap: 12px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--fog);
  }
  .km-how__col-title-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .km-how__col--farmer .km-how__col-title-icon { background: rgba(122,179,23,0.15); }
  .km-how__col--vendor .km-how__col-title-icon { background: rgba(58,124,165,0.12); }

  .km-how__step {
    display: flex; gap: 16px; margin-bottom: 24px; align-items: flex-start;
  }
  .km-how__step-num {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; margin-top: 2px;
  }
  .km-how__col--farmer .km-how__step-num {
    background: rgba(122,179,23,0.15); color: var(--earth-light);
  }
  .km-how__col--vendor .km-how__step-num {
    background: rgba(58,124,165,0.12); color: #2E6B94;
  }
  .km-how__step-title {
    font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px;
  }
  .km-how__step-desc {
    font-size: 13px; color: var(--muted); line-height: 1.65;
  }

  /* ══════════════════════════════════════════
     CROP TICKER / LIVE PRICES STRIP
  ══════════════════════════════════════════ */
  .km-ticker {
    background: var(--earth); overflow: hidden; padding: 14px 0;
    position: relative;
  }
  .km-ticker__label {
    position: absolute; left: 0; top: 0; bottom: 0; z-index: 2;
    background: var(--harvest); padding: 0 24px;
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    color: white; text-transform: uppercase; white-space: nowrap;
  }
  .km-ticker__track {
    display: flex; gap: 0; white-space: nowrap;
    animation: km-ticker-scroll 25s linear infinite;
    padding-left: 160px;
  }
  @keyframes km-ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .km-ticker__item {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 0 36px; color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 500;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .km-ticker__crop { font-weight: 600; color: #fff; }
  .km-ticker__price { color: var(--harvest-lt); font-weight: 700; }
  .km-ticker__change { font-size: 12px; }
  .km-ticker__change--up { color: #6EE87D; }
  .km-ticker__change--dn { color: #FF8080; }

  /* ══════════════════════════════════════════
     TESTIMONIALS
  ══════════════════════════════════════════ */
  .km-testimonials {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  .km-testimonial {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-md); padding: 28px;
    transition: all 0.3s;
  }
  .km-testimonial:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-4px);
  }
  .km-testimonial__quote {
    font-family: 'Lora', serif; font-size: 15px; color: rgba(255,255,255,0.85);
    line-height: 1.75; margin-bottom: 20px; font-style: italic;
  }
  .km-testimonial__stars {
    color: var(--harvest-lt); font-size: 14px; margin-bottom: 16px; letter-spacing: 2px;
  }
  .km-testimonial__author {
    display: flex; align-items: center; gap: 12px;
  }
  .km-testimonial__avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .km-testimonial__name {
    font-size: 14px; font-weight: 600; color: white;
  }
  .km-testimonial__detail {
    font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px;
  }

  /* ══════════════════════════════════════════
     CTA SECTION
  ══════════════════════════════════════════ */
  .km-cta {
    padding: 80px 24px;
    background: linear-gradient(135deg, var(--cream-dk), var(--fog));
    text-align: center; position: relative; overflow: hidden;
  }
  .km-cta::before {
    content: '';
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(122,179,23,0.1), transparent 70%);
    pointer-events: none;
  }
  .km-cta__content { position: relative; z-index: 1; }
  .km-cta__title {
    font-family: 'Lora', serif; font-size: clamp(28px, 4vw, 46px);
    font-weight: 700; color: var(--earth);
    margin-bottom: 14px; line-height: 1.2;
  }
  .km-cta__desc {
    font-size: 16px; color: var(--muted);
    margin-bottom: 38px; max-width: 480px; margin-left: auto; margin-right: auto;
  }
  .km-cta__btns {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .km-btn--cta-farmer {
    background: linear-gradient(135deg, var(--earth), var(--earth-mid));
    color: var(--white);
    box-shadow: 0 8px 28px rgba(30,58,15,0.3);
  }
  .km-btn--cta-farmer:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 40px rgba(30,58,15,0.4);
  }
  .km-btn--cta-vendor {
    background: transparent; color: var(--earth);
    border: 2px solid rgba(45,80,22,0.35);
  }
  .km-btn--cta-vendor:hover {
    background: var(--earth); color: var(--white);
    border-color: var(--earth); transform: translateY(-3px);
  }
  .km-cta__note {
    font-size: 13px; color: var(--muted);
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }

  /* ══════════════════════════════════════════
     FOOTER
  ══════════════════════════════════════════ */
  .km-footer {
    background: var(--text); padding: 48px 40px 28px;
  }
  .km-footer__top {
    display: flex; gap: 48px; margin-bottom: 40px;
    flex-wrap: wrap; max-width: 1080px; margin-left: auto; margin-right: auto;
  }
  .km-footer__brand { flex: 2; min-width: 220px; }
  .km-footer__brand-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Lora', serif; font-size: 20px; color: white; margin-bottom: 12px;
  }
  .km-footer__brand-desc {
    font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 280px;
  }
  .km-footer__col { flex: 1; min-width: 140px; }
  .km-footer__col-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
    margin-bottom: 16px;
  }
  .km-footer__links { list-style: none; }
  .km-footer__links li { margin-bottom: 10px; }
  .km-footer__links a {
    font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none;
    transition: color 0.2s; cursor: pointer;
  }
  .km-footer__links a:hover { color: rgba(255,255,255,0.9); }
  .km-footer__bottom {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding-top: 24px; text-align: center;
    font-size: 12px; color: rgba(255,255,255,0.25);
    max-width: 1080px; margin: 0 auto;
  }

  /* ══════════════════════════════════════════
     SCROLL-REVEAL ANIMATIONS
  ══════════════════════════════════════════ */
  .km-reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1),
                transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .km-reveal.km-revealed {
    opacity: 1; transform: translateY(0);
  }
  .km-reveal--delay-1 { transition-delay: 0.08s; }
  .km-reveal--delay-2 { transition-delay: 0.16s; }
  .km-reveal--delay-3 { transition-delay: 0.24s; }
  .km-reveal--delay-4 { transition-delay: 0.32s; }

  /* ══════════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════════ */
  @media (max-width: 768px) {
    .km-nav { padding: 0 20px; }
    .km-nav__link { padding: 7px 14px; font-size: 13px; }
    .km-hero { padding: 90px 20px 60px; }
    .km-hero__stats { flex-direction: column; gap: 0; }
    .km-hero__stat:not(:last-child)::after { right: 20%; left: 20%; top: auto; bottom: 0; width: auto; height: 1px; }
    .km-how { grid-template-columns: 1fr; gap: 36px; }
    .km-trust { gap: 20px; padding: 16px 20px; }
    .km-trust__divider { display: none; }
    .km-footer__top { flex-direction: column; gap: 32px; }
    .km-section { padding: 64px 20px; }
    .km-cta { padding: 64px 20px; }
  }
  @media (max-width: 480px) {
    .km-hero__btns { flex-direction: column; align-items: stretch; }
    .km-btn { justify-content: center; }
    .km-cta__btns { flex-direction: column; align-items: stretch; max-width: 300px; margin-left: auto; margin-right: auto; }
  }
`;

// ─── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '📍',
    title: 'Map-Based Discovery',
    desc: 'Find buyers and sellers near you on an interactive map. Filter by district, crop type, and best price per quintal.',
  },
  {
    icon: '💰',
    title: 'Live Vendor Bidding',
    desc: 'Vendors post competitive prices daily. See real bids in your area and pick the one that works best for your harvest.',
  },
  {
    icon: '📞',
    title: 'Direct Negotiation',
    desc: 'Share your phone number directly with the vendor. No middlemen — negotiate freely and agree on your terms.',
  },
  {
    icon: '🚛',
    title: 'Doorstep Pickup',
    desc: 'Once agreed, vendors send their vehicle to your farm. You don\'t need to transport your harvest anywhere.',
  },
  {
    icon: '🌾',
    title: 'All Crops Supported',
    desc: 'Paddy, Wheat, Sugarcane, Soybean, Maize, Mustard and more — list any agricultural produce on the platform.',
  },
  {
    icon: '🔒',
    title: 'Safe & Transparent',
    desc: 'Every bid shows vendor name, location, quantity needed and vehicle availability — no hidden surprises.',
  },
];

const FARMER_STEPS = [
  { title: 'Register & Login', desc: 'Enter your details, village, and what crop you\'re ready to sell.' },
  { title: 'Browse Vendor Bids', desc: 'See all active bids from vendors in your area sorted by best price.' },
  { title: 'Share Your Number', desc: 'Interested in a bid? Send your contact to the vendor in one tap.' },
  { title: 'Get Paid at Your Farm', desc: 'Vendor dispatches their vehicle, collects produce, payment done.' },
];

const VENDOR_STEPS = [
  { title: 'Register & Verify', desc: 'Set up your business profile with location and crop preferences.' },
  { title: 'Post a Bid', desc: 'Specify crop type, quantity needed, and your offered price per quintal.' },
  { title: 'Receive Farmer Requests', desc: 'Farmers interested in your post share their contact with you.' },
  { title: 'Dispatch & Buy', desc: 'Agree on terms, send your vehicle, and complete the transaction.' },
];

const TICKER_ITEMS = [
  { crop: 'Paddy (Basmati 1121)', price: '₹2,150/qtl', change: '+₹80', up: true },
  { crop: 'Wheat (HD-2967)',       price: '₹2,400/qtl', change: '+₹120', up: true },
  { crop: 'Sugarcane',            price: '₹380/qtl',  change: '-₹10',  up: false },
  { crop: 'Soybean (JS-9305)',    price: '₹4,800/qtl', change: '+₹200', up: true },
  { crop: 'Maize',                price: '₹1,900/qtl', change: '+₹50',  up: true },
  { crop: 'Mustard (RH-749)',     price: '₹5,600/qtl', change: '-₹40',  up: false },
];

const TESTIMONIALS = [
  {
    quote: 'Earlier I had to go to the mandi and bargain for hours. Now vendors come to my field at the price I want. My income increased by almost 20%.',
    stars: '★★★★★',
    name: 'Ramesh Kumar',
    detail: 'Paddy Farmer, Lucknow UP',
    avatarBg: '#2D5016',
    avatarText: 'R',
  },
  {
    quote: 'Posting bids and getting fresh produce from reliable farmers is now very easy. I can source from 5 farmers in a single day without leaving my godown.',
    stars: '★★★★★',
    name: 'Sharma Traders',
    detail: 'Grain Vendor, Kanpur UP',
    avatarBg: '#3A7CA5',
    avatarText: 'S',
  },
  {
    quote: 'The app is very simple to use. My son helped me register and now I can see all the bids on my phone. No need to depend on middlemen anymore.',
    stars: '★★★★☆',
    name: 'Suresh Patel',
    detail: 'Wheat Farmer, Sitapur UP',
    avatarBg: '#8B4513',
    avatarText: 'S',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const navRef   = useRef(null);

  // ── Inject CSS once ──
  useEffect(() => {
    const id = 'km-landing-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = CSS;
      document.head.appendChild(el);
    }
    return () => {
      // leave styles in DOM — avoids flash on fast navigation back
    };
  }, []);

  // ── Sticky nav shadow on scroll ──
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('km-nav--scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Scroll-reveal using IntersectionObserver ──
  useEffect(() => {
    const els = document.querySelectorAll('.km-reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('km-revealed'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('km-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Helpers ──
  const goRegister = () => navigate('/register');
  const goLogin    = () => navigate('/login');

  return (
    <>
      {/* ════ NAV ════ */}
      <nav className="km-nav" ref={navRef} role="navigation" aria-label="Main navigation">
        <div className="km-nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} role="button" tabIndex={0}>
          <div className="km-nav__logo-icon" aria-hidden="true">🌾</div>
          KrishiMadad
        </div>
        <div className="km-nav__links">
          <button className="km-nav__link km-nav__link--outline" onClick={goLogin}>
            Login
          </button>
          <button className="km-nav__link km-nav__link--fill" onClick={goRegister}>
            Register Free
          </button>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section className="km-hero" aria-label="Hero">
        {/* Glow blobs */}
        <div className="km-hero__glow km-hero__glow--1" aria-hidden="true" />
        <div className="km-hero__glow km-hero__glow--2" aria-hidden="true" />
        <div className="km-hero__glow km-hero__glow--3" aria-hidden="true" />

        <div className="km-hero__content">
          <div className="km-hero__tag" aria-label="Platform status">
            <span className="km-hero__tag-dot" aria-hidden="true" />
            🌱 Live — 280+ Districts Covered
          </div>

          <h1 className="km-hero__title">
            Your Harvest,{' '}
            <span className="km-hero__title-accent">Your Price</span>,<br />
            Your Market
          </h1>

          <p className="km-hero__subtitle">
            KrishiMadad connects farmers directly with vendors. Browse live bids,
            share your contact, and let buyers come to your field — no middlemen, no mandi hassle.
          </p>

          <div className="km-hero__btns">
            <button
              className="km-btn km-btn--farmer"
              onClick={goRegister}
              aria-label="Register as a farmer"
            >
              🌾 I'm a Farmer
            </button>
            <button
              className="km-btn km-btn--vendor"
              onClick={goRegister}
              aria-label="Register as a vendor"
            >
              🏪 I'm a Vendor
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="km-hero__stats" role="region" aria-label="Platform statistics">
          {[
            { num: '12,400+', label: 'Farmers Registered' },
            { num: '3,800+',  label: 'Active Vendors' },
            { num: '₹48Cr+',  label: 'Trade Volume' },
            { num: '280+',    label: 'Districts' },
          ].map(s => (
            <div className="km-hero__stat" key={s.label}>
              <span className="km-hero__stat-num">{s.num}</span>
              <span className="km-hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="km-hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <svg className="km-hero__scroll-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Decorative crop row at bottom */}
        <div className="km-hero__crops" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 Q120,20 240,80 Q360,140 480,80 Q600,20 720,80 Q840,140 960,80 Q1080,20 1200,80 Q1320,140 1440,80 L1440,120 L0,120 Z"
              fill="rgba(250,246,236,0.08)" />
            <path d="M0,90 Q180,30 360,90 Q540,150 720,90 Q900,30 1080,90 Q1260,150 1440,90 L1440,120 L0,120 Z"
              fill="rgba(250,246,236,0.05)" />
          </svg>
        </div>
      </section>

      {/* ════ TRUST STRIP ════ */}
      <div className="km-trust" role="region" aria-label="Trust indicators">
        {[
          { icon: '✅', text: 'No Registration Fee' },
          null,
          { icon: '🔒', text: 'Secure & Private' },
          null,
          { icon: '📱', text: 'Works on Any Phone' },
          null,
          { icon: '🌐', text: 'Hindi & English Support' },
          null,
          { icon: '🚀', text: 'Set Up in 2 Minutes' },
        ].map((item, i) =>
          item === null
            ? <div key={i} className="km-trust__divider" aria-hidden="true" />
            : <div key={i} className="km-trust__item"><span>{item.icon}</span><span>{item.text}</span></div>
        )}
      </div>

      {/* ════ LIVE PRICES TICKER ════ */}
      <div className="km-ticker" aria-label="Live crop prices">
        <div className="km-ticker__label" aria-hidden="true">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6EE87D', display: 'inline-block', animation: 'km-pulse-glow 1.5s infinite' }} />
          Live Rates
        </div>
        {/* Duplicate items for seamless loop */}
        <div className="km-ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="km-ticker__item">
              <span className="km-ticker__crop">{item.crop}</span>
              <span className="km-ticker__price">{item.price}</span>
              <span className={`km-ticker__change km-ticker__change--${item.up ? 'up' : 'dn'}`}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ════ FEATURES ════ */}
      <section className="km-section km-section--alt" aria-labelledby="features-title">
        <div className="km-container">
          <div className="km-section__header">
            <span className="km-section__eyebrow km-reveal">Why KrishiMadad</span>
            <h2 className="km-section__title km-reveal km-reveal--delay-1" id="features-title">
              Everything You Need to<br />Sell Smarter
            </h2>
            <p className="km-section__desc km-reveal km-reveal--delay-2">
              Built specifically for Indian farmers and agri-vendors — simple, fast, and free.
            </p>
          </div>
          <div className="km-features">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`km-feature-card km-reveal km-reveal--delay-${(i % 4) + 1}`}
              >
                <div className="km-feature-card__icon" aria-hidden="true">{f.icon}</div>
                <div className="km-feature-card__title">{f.title}</div>
                <p className="km-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section className="km-section" aria-labelledby="how-title">
        <div className="km-container">
          <div className="km-section__header">
            <span className="km-section__eyebrow km-reveal">Simple Process</span>
            <h2 className="km-section__title km-reveal km-reveal--delay-1" id="how-title">
              How It Works
            </h2>
            <p className="km-section__desc km-reveal km-reveal--delay-2">
              Four easy steps — whether you're a farmer or a vendor
            </p>
          </div>

          <div className="km-how">
            {/* Farmer column */}
            <div className="km-how__col km-how__col--farmer km-reveal">
              <div className="km-how__col-title">
                <div className="km-how__col-title-icon">🌾</div>
                For Farmers
              </div>
              {FARMER_STEPS.map((step, i) => (
                <div key={step.title} className="km-how__step">
                  <div className="km-how__step-num">{i + 1}</div>
                  <div>
                    <div className="km-how__step-title">{step.title}</div>
                    <div className="km-how__step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
              <button
                className="km-btn km-btn--farmer"
                style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
                onClick={goRegister}
              >
                Start as Farmer →
              </button>
            </div>

            {/* Vendor column */}
            <div className="km-how__col km-how__col--vendor km-reveal km-reveal--delay-2">
              <div className="km-how__col-title">
                <div className="km-how__col-title-icon">🏪</div>
                For Vendors
              </div>
              {VENDOR_STEPS.map((step, i) => (
                <div key={step.title} className="km-how__step">
                  <div className="km-how__step-num">{i + 1}</div>
                  <div>
                    <div className="km-how__step-title">{step.title}</div>
                    <div className="km-how__step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
              <button
                className="km-btn km-btn--vendor"
                style={{
                  marginTop: 24, width: '100%', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #3A7CA5, #2E6B94)',
                  color: 'white', border: 'none',
                }}
                onClick={goRegister}
              >
                Start as Vendor →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section className="km-section km-section--dark" aria-labelledby="testimonials-title">
        <div className="km-container">
          <div className="km-section__header">
            <span className="km-section__eyebrow km-reveal">Real Stories</span>
            <h2 className="km-section__title km-reveal km-reveal--delay-1" id="testimonials-title">
              Farmers & Vendors Love It
            </h2>
            <p className="km-section__desc km-reveal km-reveal--delay-2">
              Thousands of successful trades happen on KrishiMadad every month
            </p>
          </div>
          <div className="km-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`km-testimonial km-reveal km-reveal--delay-${i + 1}`}>
                <div className="km-testimonial__stars" aria-label={`${t.stars.replace(/★/g, '').replace(/☆/g, '')} out of 5 stars`}>{t.stars}</div>
                <blockquote className="km-testimonial__quote">"{t.quote}"</blockquote>
                <div className="km-testimonial__author">
                  <div
                    className="km-testimonial__avatar"
                    style={{ background: t.avatarBg }}
                    aria-hidden="true"
                  >
                    {t.avatarText}
                  </div>
                  <div>
                    <div className="km-testimonial__name">{t.name}</div>
                    <div className="km-testimonial__detail">{t.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="km-cta" aria-labelledby="cta-title">
        <div className="km-cta__content">
          <span className="km-section__eyebrow km-reveal" style={{ display: 'block', marginBottom: 12 }}>
            Join 12,000+ Farmers Today
          </span>
          <h2 className="km-cta__title km-reveal km-reveal--delay-1" id="cta-title">
            Ready to Sell Smarter?
          </h2>
          <p className="km-cta__desc km-reveal km-reveal--delay-2">
            Registration is free. Takes under 2 minutes. Start seeing bids from vendors near you today.
          </p>
          <div className="km-cta__btns km-reveal km-reveal--delay-3">
            <button className="km-btn km-btn--cta-farmer" onClick={goRegister}>
              🌾 Register as Farmer
            </button>
            <button className="km-btn km-btn--cta-vendor" onClick={goRegister}>
              🏪 Register as Vendor
            </button>
          </div>
          <p className="km-cta__note km-reveal km-reveal--delay-4">
            <span>🔒</span> Your number is only shared when you choose to. Always private.
          </p>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="km-footer" role="contentinfo">
        <div className="km-footer__top">
          <div className="km-footer__brand">
            <div className="km-footer__brand-logo">
              <span style={{ fontSize: 22 }}>🌾</span> KrishiMadad
            </div>
            <p className="km-footer__brand-desc">
              Empowering Indian farmers with transparent, direct access to buyers.
              No middlemen. Better prices. Doorstep collection.
            </p>
          </div>

          <div className="km-footer__col">
            <div className="km-footer__col-title">Platform</div>
            <ul className="km-footer__links">
              <li><a onClick={goRegister}>For Farmers</a></li>
              <li><a onClick={goRegister}>For Vendors</a></li>
              <li><a onClick={goLogin}>Login</a></li>
              <li><a onClick={goRegister}>Sign Up Free</a></li>
            </ul>
          </div>

          <div className="km-footer__col">
            <div className="km-footer__col-title">Crops</div>
            <ul className="km-footer__links">
              {['Paddy', 'Wheat', 'Sugarcane', 'Soybean', 'Maize', 'Mustard'].map(c => (
                <li key={c}><a>{c}</a></li>
              ))}
            </ul>
          </div>

          <div className="km-footer__col">
            <div className="km-footer__col-title">Support</div>
            <ul className="km-footer__links">
              <li><a>Help Center</a></li>
              <li><a>Contact Us</a></li>
              <li><a>Privacy Policy</a></li>
              <li><a>Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <div className="km-footer__bottom">
          © {new Date().getFullYear()} KrishiMadad. Made with ❤️ for Indian Farmers. All rights reserved.
        </div>
      </footer>
    </>
  );
}