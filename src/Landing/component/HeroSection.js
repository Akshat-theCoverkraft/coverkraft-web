import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// ─── Logo video ────────────────────────────────────────────────────────────────
function PlaceholderDiv() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <video
        autoPlay loop muted playsInline preload="auto"
        className="w-full h-full object-contain"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <source src="Coverkraft-logo-transparent.webm" type="video/webm" />
      </video>
    </div>
  );
}

// ─── USP SVG Icons ────────────────────────────────────────────────────────────
// ─── USP Cards — glowing card design matching screenshot ─────────────────────

// // Policy Vault icon: shield with keyhole (large, illustrated)
 const PolicyVaultIllustration = () => (
   <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
     <defs>
      <filter id="glow-pv" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="b"/>
         <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
       </filter>
       <linearGradient id="shield-grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
         <stop stopColor="#FFD070"/><stop offset="1" stopColor="#F6A544"/>
       </linearGradient>
     </defs>
    {/* Back shield (larger, dimmer) */}
    <g filter="url(#glow-pv)" opacity="0.5">
      <path d="M58 10L74 17v18c0 16-10.5 28-16 30.5C52.5 63 42 51 42 35V17L58 10z"
        fill="none" stroke="#F6A544" strokeWidth="2"/>
    </g>
    {/* Front shield */}
     <g filter="url(#glow-pv)">
      <path d="M30 8L8 16v22c0 18 14 32 22 35 8-3 22-17 22-35V16L30 8z"
        fill="rgba(246,165,68,0.18)" stroke="url(#shield-grad)" strokeWidth="2.2"/>
      {/* Keyhole */}
       <circle cx="30" cy="32" r="5" fill="none" stroke="#FFD070" strokeWidth="2"/>
       <path d="M30 37v8" stroke="#FFD070" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M26 45h8" stroke="#FFD070" strokeWidth="2" strokeLinecap="round"/>
     </g>
  </svg>
 );

 // Insurance Learning icon: open book + brain
 const InsuranceLearningIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
       <filter id="glow-il" x="-30%" y="-30%" width="160%" height="160%">
         <feGaussianBlur stdDeviation="3" result="b"/>
         <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
       </filter>
      <linearGradient id="book-grad" x1="0" y1="40" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3FC8EE"/><stop offset="1" stopColor="#5FD4BE"/>
      </linearGradient>
    </defs>
    {/* Open book */}
     <g filter="url(#glow-il)" stroke="url(#book-grad)" strokeLinecap="round" strokeLinejoin="round">
       <path d="M8 22C8 22 20 18 40 18s32 4 32 4V60s-12-4-32-4S8 60 8 60V22z" fill="rgba(63,200,238,0.12)" strokeWidth="2"/>
       <line x1="40" y1="18" x2="40" y2="56" strokeWidth="2"/>
       <path d="M16 30h10M16 36h8M16 42h10" strokeWidth="1.5"/>
       <path d="M50 30h10M52 36h8M50 42h10" strokeWidth="1.5"/>
     </g>
     {/* Brain (right side, overlapping) */}
     <g filter="url(#glow-il)" stroke="#3FC8EE" fill="rgba(63,200,238,0.15)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
       <path d="M52 10c-2 0-4 1-5 3-1.5-1-4-1-5.5 1-3-1-5 1-5 3.5 0 1 .5 2 1 2.5-.5 1-.5 2 0 3-1 1-1 3 0 4-1 2 0 4 2 4.5V34h10V31c2-.5 3-2.5 2-4.5 1-1 1-3 0-4 .5-1 .5-2 0-3 .5-.5 1-1.5 1-2.5 0-2.5-2-4.5-4.5-4.5-.5-.5-1-1.5-1-3z"/>
       <path d="M47 14v18M51 12v20M45 18h8M44 24h9" strokeWidth="1"/>
    </g>
   </svg>
 );

 // 24/7 Claim Support icon: clock + headset
 const ClaimSupportIllustration = () => (
   <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <filter id="glow-cs" x="-30%" y="-30%" width="160%" height="160%">
         <feGaussianBlur stdDeviation="3" result="b"/>
         <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
     </filter>
      <linearGradient id="clock-grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
         <stop stopColor="#7EE8A2"/><stop offset="1" stopColor="#3FC8EE"/>
       </linearGradient>
     </defs>
     {/* Clock face */}
     <g filter="url(#glow-cs)" stroke="url(#clock-grad)" strokeLinecap="round" strokeLinejoin="round">
       <circle cx="30" cy="35" r="22" fill="rgba(90,220,160,0.1)" strokeWidth="2.2"/>
       <line x1="30" y1="20" x2="30" y2="35" strokeWidth="2.5"/>
       <line x1="30" y1="35" x2="42" y2="42" strokeWidth="2.5"/>
      <circle cx="30" cy="35" r="2.5" fill="#7EE8A2" strokeWidth="0"/>
     {/* Hour ticks */}
       <line x1="30" y1="14" x2="30" y2="17" strokeWidth="2"/>
       <line x1="30" y1="53" x2="30" y2="56" strokeWidth="2"/>
       <line x1="9" y1="35" x2="12" y2="35" strokeWidth="2"/>
       <line x1="48" y1="35" x2="51" y2="35" strokeWidth="2"/>
     </g>
     {/* Headset overlapping */}
     <g filter="url(#glow-cs)" stroke="#5FD4BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M44 40c0-10 7-16 14-16s14 6 14 16"/>
      <rect x="42" y="40" width="6" height="10" rx="3" fill="rgba(95,212,190,0.2)" stroke="#5FD4BE" strokeWidth="2"/>
      <rect x="64" y="40" width="6" height="10" rx="3" fill="rgba(95,212,190,0.2)" stroke="#5FD4BE" strokeWidth="2"/>
      <path d="M70 50v3a4 4 0 0 1-4 4h-6" strokeWidth="1.8"/>
     </g>
   </svg>
 );

// // ─── USP Cards — card design matching screenshot ───────────────────────────────
 const USP_CARDS = [
  {
    Illustration: PolicyVaultIllustration,
    title: 'POLICY VAULT.',
    desc: 'Securely store & access all your policies.',
     gradient: 'linear-gradient(135deg, rgba(120,70,10,0.85) 0%, rgba(80,40,5,0.9) 100%)',
     border: 'rgba(246,165,68,0.55)',
     glow: 'rgba(246,165,68,0.25)',
     textColor: '#FFD580',
  },
   {
     Illustration: InsuranceLearningIllustration,
    title: 'INSURANCE LEARNING.',
    desc: 'Master insurance concepts effortlessly.',
     gradient: 'linear-gradient(135deg, rgba(10,55,100,0.88) 0%, rgba(5,35,70,0.92) 100%)',
     border: 'rgba(63,200,238,0.55)',
     glow: 'rgba(63,200,238,0.22)',
     textColor: '#7EE8FF',
   },
   {
     Illustration: ClaimSupportIllustration,
     title: '24/7 CLAIM SUPPORT.',
     desc: 'Instant help anytime, anywhere.',
     gradient: 'linear-gradient(135deg, rgba(10,70,35,0.88) 0%, rgba(5,45,20,0.92) 100%)',
     border: 'rgba(126,232,162,0.5)',
     glow: 'rgba(126,232,162,0.2)',
     textColor: '#7EE8A2',
   },
 ];

 function USPRow() {
   return (
     <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.38 }}
       style={{
         display: 'flex',
         gap: 20,
         marginBottom: 32,
        flexWrap: 'wrap',
      }}
    >
       {USP_CARDS.map(({ Illustration, title, desc, gradient, border, glow, textColor }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.45, delay: 0.42 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
           whileHover={{ y: -3, boxShadow: `0 12px 32px ${glow}, 0 0 0 1px ${border}` }}
         style={{
            flex: '1 1 140px',
           minWidth: 155,
            maxWidth: 185,
            background: gradient,
            border: `1px solid ${border}`,
            borderRadius: 16,
          padding: '14px 14px 12px',
           position: 'relative',
           overflow: 'hidden',
           boxShadow: `0 4px 20px ${glow}`,
           cursor: 'default',
            transition: 'box-shadow 0.25s',
         }}
         >
           {/* Corner glow */}
           <div style={{
             position: 'absolute', top: -20, right: -20,
             width: 80, height: 80, borderRadius: '50%',
             background: glow, filter: 'blur(18px)', pointerEvents: 'none',
          }}/>

           {/* Illustration — positioned bottom-right, partially cropped */}
           <div style={{
           position: 'absolute', bottom: -8, right: -8,
           opacity: 0.7, pointerEvents: 'none',
         }}>
           <Illustration />
         </div>

         {/* Text content */}
         <div style={{ position: 'relative', zIndex: 2 }}>
           <div style={{
             fontFamily: 'Gotham, sans-serif',
             fontWeight: 800,
              fontSize: 'clamp(9px, 0.85vw, 12px)',
               color: textColor,
              lineHeight: 1.25,
             marginBottom: 6,
            letterSpacing: '0.02em',
            }}>{title}</div>
            <div style={{
              fontFamily: 'Gotham, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(9px, 0.75vw, 11px)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.45,
              maxWidth: 110,
            }}>{desc}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
 }


// ─── Feature card ─────────────────────────────────────────────────────────────
function Feature({ heading, body, dir = 'left', delay = 0, visible }) {
  const fromX = dir === 'right' ? 50 : -50;
  return (
    <motion.div
      style={{ textAlign: dir === 'right' ? 'right' : 'left', willChange: 'transform, opacity' }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: fromX }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: visible ? delay : 0 }}
    >
      <h3 style={{
        fontSize: 'clamp(18px, 2vw, 28px)',
        fontFamily: 'Gotham, sans-serif',
        color: '#F6A544',
        fontWeight: 700,
        lineHeight: 1.2,
        marginBottom: 8,
      }}>{heading}</h3>
      <p style={{
        fontSize: 'clamp(12px, 1.1vw, 16px)',
        fontFamily: 'Gotham, sans-serif',
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 1.65,
      }}>{body}</p>
    </motion.div>
  );
}

// ─── Scroll hint ──────────────────────────────────────────────────────────────
function ScrollHint({ visible }) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none' }}
    >
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 22, height: 38,
          border: '2px solid rgba(255,255,255,0.22)',
          borderRadius: 11,
          display: 'flex', justifyContent: 'center', paddingTop: 6,
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 4, height: 8, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}
        />
      </motion.div>
      <motion.span
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontFamily: 'Gotham, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase' }}
      >scroll</motion.span>
    </motion.div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ slide }) {
  return (
    <div style={{
      position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 10, zIndex: 30,
    }}>
      {[0, 1].map(i => (
        <motion.div key={i}
          animate={{
            width:        slide === i ? 7  : 5,
            height:       slide === i ? 22 : 5,
            borderRadius: slide === i ? 4  : 9,
            background:   slide === i
              ? 'linear-gradient(180deg,#90DB78,#3FC8EE)'
              : 'rgba(255,255,255,0.18)',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'transform' }}
        />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
/**
 * SCROLL FLOW (desktop):
 *   Load           → Slide 0 (headline). Wheel intercepted on the hero div.
 *   1st scroll ↓   → Slide 1 (features). Wheel still intercepted.
 *   2nd scroll ↓   → Hero releases. Browser scrolls page to PolicyType naturally.
 *   Scroll ↑ at top → Slide 1 → Slide 0.
 *
 * FIX: No matter how fast/hard user scrolls, slide 1 is ALWAYS shown before
 *      the page scrolls past the hero. We enforce this by:
 *      - Always intercepting (preventDefault) when on slide 0 scrolling down.
 *      - When on slide 1 scrolling down, we also intercept for a short HOLD_MS
 *        window so the user sees slide 1, then release to let the browser scroll.
 */
export default function HeroSection() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [slide, setSlide] = useState(0);   // 0 = headline, 1 = features
  const slideRef   = useRef(0);            // same value, safe inside event handlers
  const busyRef    = useRef(false);        // cooldown — stops momentum scroll double-fire

  // ── NEW: track when slide 1 was first entered so we can hold it long enough ──
  const slide1EnteredAt = useRef(null);    // timestamp (ms) when slide 1 became active
  const HOLD_MS = 900;                     // ms user must see slide 1 before scroll-through

  const wrapperRef = useRef(null);

  const logoProgress = useMotionValue(0);
  const maxShift     = Math.min(screenWidth * 0.22, 400);
  const baseLogoSize = Math.min(screenWidth * 0.36, 520);
  const logoX        = useTransform(logoProgress, [0, 1], [0, -maxShift]);

  // ── Resize ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let raf = null;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setScreenWidth(window.innerWidth);
        setIsDesktop(window.innerWidth >= 1024);
      });
    };
    window.addEventListener('resize', handler, { passive: true });
    return () => { window.removeEventListener('resize', handler); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // ── Animate logo on slide change ──────────────────────────────────────────
  useEffect(() => {
    animate(logoProgress, slide === 1 ? 1 : 0, { duration: 0.55, ease: [0.22, 1, 0.36, 1] });
  }, [slide]);

  // ── goToSlide ─────────────────────────────────────────────────────────────
  const goToSlide = useCallback((n) => {
    if (busyRef.current || slideRef.current === n) return;
    busyRef.current = true;
    slideRef.current = n;
    setSlide(n);
    // Record when we entered slide 1
    if (n === 1) {
      slide1EnteredAt.current = performance.now();
    }
    setTimeout(() => { busyRef.current = false; }, 700);
  }, []);

  // ── Unified event listener (wheel + touch + keyboard) ────────────────────
  useEffect(() => {
    if (!isDesktop) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onWheel = (e) => {
      if (e.deltaY > 0) {
        // ── Scroll DOWN ──────────────────────────────────────────
        if (slideRef.current === 0) {
          // Always intercept: transition to slide 1
          e.preventDefault();
          goToSlide(1);
        } else if (slideRef.current === 1) {
          // Check if user has seen slide 1 long enough
          const elapsed = slide1EnteredAt.current
            ? performance.now() - slide1EnteredAt.current
            : 0;

          if (elapsed < HOLD_MS) {
            // Not yet — intercept and do nothing (they're already on slide 1)
            e.preventDefault();
          }
          // else: elapsed >= HOLD_MS → do NOT preventDefault → browser scrolls naturally
        }
      } else if (e.deltaY < 0) {
        // ── Scroll UP ────────────────────────────────────────────
        if (slideRef.current === 1 && window.scrollY <= 2) {
          e.preventDefault();
          goToSlide(0);
        }
        // Otherwise let browser handle it
      }
    };

    let touchY0 = 0;
    const onTouchStart = (e) => { touchY0 = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      if (busyRef.current) return;
      const dy = touchY0 - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 44) return;
      if (dy > 0 && slideRef.current === 0) goToSlide(1);
      if (dy < 0 && slideRef.current === 1 && window.scrollY <= 2) goToSlide(0);
    };

    const onKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && slideRef.current === 0) {
        e.preventDefault(); goToSlide(1);
      }
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && slideRef.current === 1) {
        const elapsed = slide1EnteredAt.current
          ? performance.now() - slide1EnteredAt.current
          : 0;
        if (elapsed < HOLD_MS) e.preventDefault();
        // else let browser scroll through
      }
      if (['ArrowUp', 'PageUp'].includes(e.key) && slideRef.current === 1 && window.scrollY <= 2) {
        e.preventDefault(); goToSlide(0);
      }
    };

    wrapper.addEventListener('wheel',      onWheel,      { passive: false });
    wrapper.addEventListener('touchstart', onTouchStart, { passive: true  });
    wrapper.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    window.addEventListener( 'keydown',    onKeyDown);

    return () => {
      wrapper.removeEventListener('wheel',      onWheel);
      wrapper.removeEventListener('touchstart', onTouchStart);
      wrapper.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener( 'keydown',    onKeyDown);
    };
  }, [isDesktop, goToSlide]);

  const onS1 = slide === 0;
  const onS2 = slide === 1;

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (!isDesktop) {
    return (
      <div style={{ background: '#000' }}>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', maxWidth: 600, width: '100%' }}
          >
            <h1 style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 800, lineHeight: 0.95, marginBottom: 24 }}>
              {['All Your Policies.', 'One Secure Vault.'].map((line, i) => (
                <motion.span key={line}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.1 }}
                  style={{ display: 'block', fontSize: 'clamp(30px,7vw,58px)', marginBottom: 4, backgroundImage: 'linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >{line}</motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px,4vw,19px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 36 }}
            >Access, manage, share, renew, and get claim assistance for every policy — effortlessly.</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{ backgroundColor: '#F6A544', color: '#fff', fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px,3.5vw,17px)', fontWeight: 600, padding: '14px 36px', borderRadius: 999, border: 'none', cursor: 'pointer', width: '100%', maxWidth: 260 }}
              >Policy Vault</motion.button>
              <div style={{ borderRadius: 999, padding: 2, background: 'linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)', width: '100%', maxWidth: 260 }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  style={{ background: '#000', color: '#fff', fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px,3.5vw,17px)', fontWeight: 500, padding: '13px 36px', borderRadius: 999, border: 'none', cursor: 'pointer', width: '100%' }}
                >Speak to an Expert</motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>
        <section style={{ padding: '60px 24px 80px', background: '#000' }}>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 800, fontSize: 'clamp(24px,7vw,42px)', textAlign: 'center', marginBottom: 36, backgroundImage: 'linear-gradient(135deg,#90DB78 0%,#5FD4BE 50%,#3FC8EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >Your Personal Insurance Policy Vault</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, maxWidth: 680, margin: '0 auto' }}>
            {[
              { h: 'Centralised Storage',   b: 'All policies in one secure place',          d: 0.05 },
              { h: 'Easy Sharing & Access', b: 'Share policy details with family instantly', d: 0.1  },
              { h: 'Smart Renewals',        b: 'Reminders, renewals & claim assistance',     d: 0.15 },
              { h: 'Reminders',             b: 'Stay updated on policy status & due dates',  d: 0.2  },
            ].map(({ h, b, d }) => (
              <motion.div key={h} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: d }} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 'clamp(18px,5vw,26px)', fontFamily: 'Gotham, sans-serif', color: '#F6A544', fontWeight: 700, marginBottom: 8 }}>{h}</h3>
                <p style={{ fontSize: 'clamp(13px,3.5vw,17px)', fontFamily: 'Gotham, sans-serif', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>{b}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      style={{
        height: '100vh',
         background: 'linear-gradient(to bottom, #000000 0%, #111111 60%, #212121 100%)',
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >

      {/* ── SLIDE 0: Headline ─────────────────────────────────────────────── */}
      <motion.div
        aria-hidden={!onS1}
        animate={{ opacity: onS1 ? 1 : 0, x: onS1 ? 0 : -70 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          padding: '0 clamp(32px,5vw,90px)',
          paddingBottom: '8vh',
          gap: 40,
          pointerEvents: onS1 ? 'auto' : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <h1 style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>
            {['All Your Policies.', 'One Secure Vault.'].map((line, i) => (
              <motion.span key={line}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.18 + i * 0.1 }}
                style={{
                  display: 'block',
                  fontSize: 'clamp(34px,4.5vw,74px)',
                  marginBottom: 4,
                  backgroundImage: 'linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >{line}</motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            style={{ fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px,1.2vw,22px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, marginTop: 24, marginBottom: 22 }}
          >
            Access, manage, share, renew, and get claim<br />assistance for every policy — effortlessly.
          </motion.p>

          {/* USP chips */}
         <USPRow />

          {/* CTA buttons */}
          {/* <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: 'flex', gap: 38, flexWrap: 'wrap' }}
          >
            
             <USPRow />
          </motion.div> */}
        </motion.div>

        <div /> {/* logo floats here */}
      </motion.div>

      {/* ── SLIDE 1: Features ─────────────────────────────────────────────── */}
      <motion.div
        aria-hidden={!onS2}
        animate={{ opacity: onS2 ? 1 : 0, y: onS2 ? 0 : 35 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: onS2 ? 'auto' : 'none',
          willChange: 'transform, opacity',
        }}
      >
        {/* Heading */}
        <motion.div
          animate={{ opacity: onS2 ? 1 : 0, y: onS2 ? 0 : -24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          style={{ position: 'absolute', top: '10%', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}
        >
          <h2 style={{
            fontFamily: 'Gotham, sans-serif', fontWeight: 800,
            fontSize: 'clamp(26px,3.6vw,50px)', lineHeight: 1.1,
            backgroundImage: 'linear-gradient(135deg,#90DB78 0%,#5FD4BE 50%,#3FC8EE 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            margin: 0,
          }}>Your Personal Insurance Policy Vault</h2>
        </motion.div>

        {/* Left features */}
        <div style={{ position: 'absolute', left: '8%', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 56, maxWidth: 280, zIndex: 10 }}>
          <Feature heading={<>Centralised<br />Storage</>}  body={<>All policies in one<br />secure place</>}          dir="left"  delay={0.12} visible={onS2} />
          <Feature heading={<>Easy Sharing &<br />Access</>} body={<>Share policy details<br />with family instantly</>} dir="left"  delay={0.24} visible={onS2} />
        </div>

        {/* Right features */}
        <div style={{ position: 'absolute', right: '8%', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 56, maxWidth: 280, zIndex: 10 }}>
          <Feature heading={<>Smart Renewals</>} body={<>Reminders, renewals &<br />claim assistance</>}    dir="right" delay={0.12} visible={onS2} />
          <Feature heading={<>Reminders</>}      body={<>Stay updated on policy<br />status & due dates</>} dir="right" delay={0.24} visible={onS2} />
        </div>
      </motion.div>

      {/* ── FLOATING LOGO ─────────────────────────────────────────────────── */}
      <motion.div
        className="hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        style={{
          position: 'absolute',
          top: '50%', right: '10%',
          translateY: '-50%',
          x: logoX,
          zIndex: 50,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <div style={{ width: baseLogoSize, height: baseLogoSize, transform: 'translateZ(0)' }}>
          <PlaceholderDiv />
        </div>
      </motion.div>

    </div>
  );
}