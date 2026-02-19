import React, {
  useRef, useEffect, useState, useCallback, useReducer
} from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// ─── Logo video ───────────────────────────────────────────────────────────────
function PlaceholderDiv() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <video
        autoPlay loop muted playsInline preload="auto"
        className="w-full h-full object-contain"
        style={{ transform: 'translateZ(0)' }}
      >
        <source src="Coverkraft-logo-transparent.webm" type="video/webm" />
      </video>
    </div>
  );
}

// ─── Feature item ─────────────────────────────────────────────────────────────
function Feature({ heading, body, dir = 'left', delay = 0, visible }) {
  const fromX = dir === 'right' ? 40 : -40;
  return (
    <motion.div
      className={dir === 'right' ? 'text-right' : 'text-left'}
      initial={{ opacity: 0, x: fromX }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: fromX }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      <h3 style={{
        fontSize: 'clamp(20px, 2.4vw, 30px)',
        fontFamily: 'Gotham, sans-serif',
        color: '#F6A544',
        fontWeight: 700,
        lineHeight: 1.25,
        marginBottom: '10px',
      }}>{heading}</h3>
      <p style={{
        fontSize: 'clamp(13px, 1.25vw, 17px)',
        fontFamily: 'Gotham, sans-serif',
        color: 'rgba(255,255,255,0.78)',
        lineHeight: 1.65,
      }}>{body}</p>
    </motion.div>
  );
}

// ─── Scroll dot ───────────────────────────────────────────────────────────────
function ScrollDot({ flip = false, onClick, visible }) {
  return (
    <motion.div
      animate={{ opacity: visible ? 0.55 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        zIndex: 20,
        transform: flip ? 'rotate(180deg)' : undefined,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <motion.div
        animate={{ y: flip ? [0, -8, 0] : [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 24, height: 40,
          border: '2px solid rgba(255,255,255,0.28)',
          borderRadius: 12,
          display: 'flex', justifyContent: 'center', paddingTop: 7,
        }}
      >
        <div style={{ width: 5, height: 10, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3 }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1400
  );
  const [isMounted, setIsMounted] = useState(false);

  // ── State: which section (0 = Hero, 1 = Features), and whether we've
  //    "exited" the hero zone so the rest of the page can scroll normally.
  const [pageState, dispatch] = useReducer((s, a) => {
    switch (a.type) {
      case 'SECTION':      return { ...s, activeSection: a.v };
      case 'EXIT':         return { ...s, exited: a.v };
      case 'RESET':        return { activeSection: 0, exited: false };
      default:             return s;
    }
  }, { activeSection: 0, exited: false });

  const { activeSection, exited } = pageState;

  const activeSectionRef  = useRef(0);
  const exitedRef         = useRef(false);
  const isAnimatingRef    = useRef(false);
  const wheelAccumRef     = useRef(0);  // accumulate wheel delta to avoid hair-trigger
  const wheelRafRef       = useRef(null);
  const WHEEL_THRESHOLD   = 30;         // px before we commit to a section change

  // Logo motion
  const logoProgress = useMotionValue(0);
  const maxShift     = Math.min(screenWidth * 0.22, 400);
  const baseLogoSize = Math.min(screenWidth * 0.38, 560);
  const logoX        = useTransform(logoProgress, [0, 1], [0, -maxShift]);

  // ── Mount / unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (wheelRafRef.current) cancelAnimationFrame(wheelRafRef.current);
    };
  }, []);

  // ── Resize ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setScreenWidth(window.innerWidth);
        setIsDesktop(window.innerWidth >= 1024);
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ── Sync ref + animate logo ──────────────────────────────────────────────
  useEffect(() => {
    activeSectionRef.current = activeSection;
    animate(logoProgress, activeSection, { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] });
  }, [activeSection]);

  // ── goToSection ──────────────────────────────────────────────────────────
  const goToSection = useCallback((index) => {
    if (isAnimatingRef.current) return;
    if (index === activeSectionRef.current) return;
    if (index < 0 || index > 1) return;
    isAnimatingRef.current = true;
    activeSectionRef.current = index;
    dispatch({ type: 'SECTION', v: index });
    setTimeout(() => { isAnimatingRef.current = false; }, 750);
  }, []);

  // ── exitHero: unlock normal page scroll after Section 2 ─────────────────
  const exitHero = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    dispatch({ type: 'EXIT', v: true });
    // Scroll the page past the fixed hero so the next section enters view
    // We use a tiny scroll push — the spacer height handles the rest.
    requestAnimationFrame(() => {
      window.scrollTo({ top: window.innerHeight + 10, behavior: 'instant' });
    });
  }, []);

  // ── returnHero: re-lock when user scrolls back to top ───────────────────
  useEffect(() => {
    if (!isDesktop) return;

    const onScroll = () => {
      if (!exitedRef.current) return;
      // If user scrolls back near top, re-enter hero
      if (window.scrollY < 20) {
        exitedRef.current = false;
        activeSectionRef.current = 0;
        animate(logoProgress, 0, { duration: 0 });
        dispatch({ type: 'RESET' });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktop]);

  // ── Wheel / Touch / Keyboard (only active when NOT exited) ───────────────
  useEffect(() => {
    if (!isDesktop) return;
    let touchStartY = 0;

    const onWheel = (e) => {
      // If we've exited the hero zone, let normal scroll happen
      if (exitedRef.current) return;

      const down = e.deltaY > 0;
      const up   = e.deltaY < 0;

      // Always prevent default while in hero so page doesn't scroll underneath
      e.preventDefault();

      if (isAnimatingRef.current) return;

      // Accumulate delta to avoid accidental section skips on trackpads
      wheelAccumRef.current += e.deltaY;

      if (wheelRafRef.current) return;
      wheelRafRef.current = requestAnimationFrame(() => {
        wheelRafRef.current = null;
        const accum = wheelAccumRef.current;
        wheelAccumRef.current = 0;

        if (Math.abs(accum) < WHEEL_THRESHOLD) return;

        if (accum > 0) {
          // Scrolling down
          if (activeSectionRef.current === 0) {
            // S1 → S2
            goToSection(1);
          } else if (activeSectionRef.current === 1) {
            // S2 → exit hero, let page scroll to 3rd screen
            exitHero();
          }
        } else {
          // Scrolling up
          if (activeSectionRef.current === 1) {
            goToSection(0);
          }
          // S1 scrolling up → nothing above, do nothing
        }
      });
    };

    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      if (exitedRef.current) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 44) return;
      if (isAnimatingRef.current) return;

      if (delta > 0) {
        // swipe up = scroll down
        if (activeSectionRef.current === 0) goToSection(1);
        else exitHero();
      } else {
        if (activeSectionRef.current === 1) goToSection(0);
      }
    };

    const onKeyDown = (e) => {
      if (exitedRef.current) return;
      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        if (activeSectionRef.current === 0) goToSection(1);
        else exitHero();
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (activeSectionRef.current === 0) return;
        e.preventDefault();
        goToSection(0);
      }
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    window.addEventListener('keydown',    onKeyDown);
    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('keydown',    onKeyDown);
      if (wheelRafRef.current) {
        cancelAnimationFrame(wheelRafRef.current);
        wheelRafRef.current = null;
      }
    };
  }, [isDesktop, goToSection, exitHero]);

  const onS1 = activeSection === 0;
  const onS2 = activeSection === 1;

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (!isDesktop) {
    return (
      <div style={{ background: '#000' }}>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}
          >
            <h1 style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 800, lineHeight: 0.95, marginBottom: '24px' }}>
              {['All Your Policies.', 'One Secure Vault.'].map((line, i) => (
                <motion.span key={line}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 + i * 0.1 }}
                  style={{ display: 'block', fontSize: 'clamp(30px, 7vw, 60px)', marginBottom: '4px', backgroundImage: 'linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >{line}</motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px, 4vw, 19px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '36px' }}
            >Access, manage, share, renew, and get claim assistance for every policy — effortlessly.</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{ backgroundColor: '#F6A544', color: '#fff', fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: 600, padding: '14px 36px', borderRadius: '999px', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '260px' }}
              >Policy Vault</motion.button>
              <div style={{ borderRadius: '999px', padding: '2px', background: 'linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)', width: '100%', maxWidth: '260px' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  style={{ background: '#000', color: '#fff', fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: 500, padding: '13px 36px', borderRadius: '999px', border: 'none', cursor: 'pointer', width: '100%' }}
                >Speak to an Expert</motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>
        <section style={{ padding: '60px 24px 80px' }}>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 7vw, 42px)', textAlign: 'center', marginBottom: '36px', backgroundImage: 'linear-gradient(135deg,#90DB78 0%,#5FD4BE 50%,#3FC8EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >Your Personal Insurance Policy Vault</motion.h2>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '44px' }}
          >
            <div style={{ width: 'clamp(220px, 60vw, 360px)', height: 'clamp(220px, 60vw, 360px)' }}><PlaceholderDiv /></div>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '32px', maxWidth: '680px', margin: '0 auto' }}>
            {[
              { h: 'Centralised Storage',     b: 'All policies in one secure place',           d: 0.05 },
              { h: 'Easy Sharing & Access',   b: 'Share policy details with family instantly', d: 0.1  },
              { h: 'Smart Renewals', b: 'Reminders, renewals & claim assistance',     d: 0.15 },
              { h: 'Reminders',   b: 'Stay updated on policy status & due dates',  d: 0.2  },
            ].map(({ h, b, d }) => (
              <motion.div key={h} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: d }} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 'clamp(18px, 5vw, 26px)', fontFamily: 'Gotham, sans-serif', color: '#F6A544', fontWeight: 700, marginBottom: '8px' }}>{h}</h3>
                <p style={{ fontSize: 'clamp(13px, 3.5vw, 17px)', fontFamily: 'Gotham, sans-serif', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>{b}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  //
  // ARCHITECTURE:
  //
  // While !exited:
  //   - overflow:hidden on body (via useEffect) → no page scroll
  //   - Fixed hero sections handle S1 → S2 via wheel/touch/key
  //   - On S2 scroll-down: exitHero() → removes body lock, scrolls page
  //
  // While exited:
  //   - Fixed sections hidden (visibility:hidden)
  //   - Normal page scroll resumes
  //   - Scrolling back to top → RESET → re-enters hero
  //
  // This guarantees: S1 → S2 → 3rd screen, never skipping.

  return (
    <>
      {/*
        Spacer: height = 100vh so the page "has" scroll room after exit.
        This is what the rest-of-page content sits below.
      */}
      <div style={{ height: '100vh', background: 'transparent', pointerEvents: 'none' }} />

      {isMounted && (
        <>
          {/* ── SECTION 1: Hero ─────────────────────────────────────────── */}
          <section style={{
            position: 'fixed', inset: 0,
            background: '#000',
            overflow: 'hidden',
            zIndex: onS1 ? 10 : 5,
            visibility: exited ? 'hidden' : 'visible',
            pointerEvents: (onS1 && !exited) ? 'auto' : 'none',
            contain: 'layout style',
            willChange: 'opacity',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              alignItems: 'center',
              minHeight: '100vh',
              padding: '0 clamp(32px,5vw,90px)',
              gap: '40px',
            }}>
              <motion.div
                animate={{ opacity: onS1 ? 1 : 0, x: onS1 ? 0 : -50 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                initial={{ opacity: 0, x: -60 }}
              >
                <h1 style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
                  {['All Your Policies.', 'One Secure Vault.'].map((line, i) => (
                    <motion.span key={line}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 + i * 0.1 }}
                      style={{ display: 'block', fontSize: 'clamp(34px, 4.5vw, 76px)', marginBottom: '4px', backgroundImage: 'linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >{line}</motion.span>
                  ))}
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32 }}
                  style={{ fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(15px, 1.3vw, 24px)', color: 'rgba(255,255,255,0.87)', lineHeight: 1.55, marginTop: '28px', marginBottom: '20px' }}
                >Access, manage, share, renew, and get claim<br />assistance for every policy — effortlessly.</motion.p>
                {/* ── USP Chips above buttons ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.38 }}
                  style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}
                >
                  {[
                    { icon: '📘', title: 'All kinds of learning for insurance' },
                    { icon: '💰', title: 'Policy Values' },
                    { icon: '🛡️', title: 'Claims Support' },
                  ].map((usp, i) => (
                    <motion.div
                      key={usp.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.42 + i * 0.1 }}
                      whileHover={{ scale: 1.05, borderColor: 'rgba(95,212,190,0.5)' }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(144,219,120,0.2)',
                        borderRadius: '999px',
                        padding: '10px 20px',
                        backdropFilter: 'blur(10px)',
                        cursor: 'default',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{usp.icon}</span>
                      <span style={{
                        fontFamily: 'Gotham, sans-serif',
                        fontWeight: 600,
                        fontSize: 'clamp(12px, 1vw, 16px)',
                        backgroundImage: 'linear-gradient(90deg,#90DB78,#3FC8EE)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        whiteSpace: 'nowrap',
                      }}>{usp.title}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.42 }}
                  style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}
                >
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                    style={{ backgroundColor: '#F6A544', color: '#fff', fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 600, padding: '16px 44px', borderRadius: '999px', border: 'none', cursor: 'pointer' }}
                  >Policy Vault</motion.button>
                  <div style={{ borderRadius: '999px', padding: '2px', background: 'linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)', display: 'inline-block' }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                      style={{ background: '#000', color: '#fff', fontFamily: 'Gotham, sans-serif', fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 500, padding: '15px 44px', borderRadius: '999px', border: 'none', cursor: 'pointer' }}
                    >Speak to an Expert</motion.button>
                  </div>
                </motion.div>
              </motion.div>
              <div />
            </div>

            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <ScrollDot visible={onS1 && !exited} onClick={() => goToSection(1)} />
            </div>
          </section>

          {/* ── SECTION 2: Features ─────────────────────────────────────── */}
          <section style={{
            position: 'fixed', inset: 0,
            background: '#000',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: onS2 ? 10 : 5,
            visibility: exited ? 'hidden' : 'visible',
            pointerEvents: (onS2 && !exited) ? 'auto' : 'none',
            contain: 'layout style',
            willChange: 'opacity',
          }}>
            <motion.div
              animate={{ opacity: onS2 ? 1 : 0, y: onS2 ? 0 : -30 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.04 }}
              style={{ position: 'absolute', top: '15%', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}
            >
              <h2 style={{
                fontFamily: 'Gotham, sans-serif', fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.15, whiteSpace: 'nowrap',
                backgroundImage: 'linear-gradient(135deg,#90DB78 0%,#5FD4BE 50%,#3FC8EE 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Your Personal Insurance Policy Vault</h2>
            </motion.div>

            <div style={{ position: 'absolute', left: '8%', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '60px', maxWidth: '280px', zIndex: 10 }}>
              <Feature heading={<>Centralised<br />Storage</>}  body={<>All policies in one<br />secure place</>}          dir="left" delay={0.1}  visible={onS2} />
              <Feature heading={<>Easy Sharing &<br />Access</>} body={<>Share policy details<br />with family instantly</>} dir="left" delay={0.18} visible={onS2} />
            </div>

            <div style={{ position: 'absolute', right: '8%', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '60px', maxWidth: '280px', zIndex: 10 }}>
              <Feature heading={<>Smart Renewals</>} body={<>Reminders, renewals &<br />claim assistance</>}    dir="right" delay={0.1}  visible={onS2} />
              <Feature heading={<>Reminders</>}   body={<>Stay updated on policy<br />status & due dates</>} dir="right" delay={0.18} visible={onS2} />
            </div>

            {/* Up arrow */}
            <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <ScrollDot flip visible={onS2 && !exited} onClick={() => goToSection(0)} />
            </div>
            {/* Down arrow (to exit to 3rd screen) */}
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <ScrollDot visible={onS2 && !exited} onClick={exitHero} />
            </div>
          </section>

          {/* ── FLOATING LOGO ─────────────────────────────────────────────── */}
          {!exited && (
            <motion.div
              className="hidden lg:block"
              style={{
                position: 'fixed',
                top: '50%',
                right: '12%',
                zIndex: 100,
                translateY: '-50%',
                x: logoX,
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            >
              <div style={{ width: baseLogoSize, height: baseLogoSize, transform: 'translateZ(0)' }}>
                <PlaceholderDiv />
              </div>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}
