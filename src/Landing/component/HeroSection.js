import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// Simple placeholder component instead of 3D model
function PlaceholderDiv({ gifUrl }) {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img 
        src={gifUrl || "/Coverkraft-logo-Final.gif"} 
        alt="Animation"
        className="w-full h-full object-contain"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(true);

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Scroll-based animations - ONLY FOR LANDSCAPE
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
    restSpeed: 0.001
  });

  // Transforms for LANDSCAPE mode only - Updated for center movement
  const logoScale = useSpring(
    useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1.2]),
    { stiffness: 60, damping: 20 }
  );
  
  // Move from right side to center horizontally
  const logoX = useSpring(
    useTransform(smoothProgress, [0, 0.5, 1], [0, -350, -350]),
    { stiffness: 60, damping: 20 }
  );
  
  // Move from top to center vertically
  const logoY = useSpring(
    useTransform(smoothProgress, [0, 0.5, 1], [0, 10, 10]),
    { stiffness: 60, damping: 20 }
  );
  
  // Faster fade-out that starts earlier and completes before scroll end
  const logoOpacity = useSpring(
    useTransform(smoothProgress, [0, 0.4, 0.5, 0.75, 0.85], [1, 1, 1, 0.5, 0]),
    { stiffness: 100, damping: 30 }
  );
  
  const logoBackground = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']
  );
  
  const logoPointerEvents = useTransform(scrollYProgress, (value) => {
    return value > 0.75 ? 'none' : 'auto';
  });
  
  const textOpacity = useSpring(
    useTransform(smoothProgress, [0, 0.3, 0.5], [1, 0.5, 0]),
    { stiffness: 60, damping: 20 }
  );
  
  const scrollIndicatorOpacity = useSpring(
    useTransform(smoothProgress, [0, 0.2], [1, 0]),
    { stiffness: 60, damping: 20 }
  );

  // PORTRAIT MODE - Different Layout
  if (!isLandscape) {
    return (
      <div className="relative bg-black min-h-screen">
        {/* PORTRAIT: Section 1 - Text Only */}
        <section className="relative overflow-hidden bg-black min-h-screen flex items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="text-center max-w-2xl"
          >
            <motion.h1
              className="font-extrabold leading-[0.95] tracking-tight mb-8"
              style={{ fontFamily: "Gotham, sans-serif" }}
            >
              <span
                className="block bg-clip-text text-transparent mb-2"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #90DB78 0%, #5FD4BE 40%, #3FC8EE 100%)",
                  fontSize: "clamp(32px, 6vw + 0.5rem, 72px)",
                }}
              >
                All Your Policies.
              </span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #90DB78 0%, #5FD4BE 40%, #3FC8EE 100%)",
                  fontSize: "clamp(32px, 6vw + 0.5rem, 72px)",
                }}
              >
                One Secure Vault.
              </span>
            </motion.h1>

            <motion.p
              className="text-white/90 leading-[1.6] mb-10"
              style={{
                fontFamily: "Gotham, sans-serif",
                fontSize: "clamp(16px, 4vw, 22px)",
                fontWeight: "400",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Access, manage, share, renew, and get claim
              assistance for every policy — effortlessly.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto"
                style={{
                  backgroundColor: "#F6A544",
                  color: "white",
                  fontFamily: "Gotham, sans-serif",
                  fontSize: "clamp(14px, 3.5vw, 18px)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Policy Vault
              </motion.button>

              <div className="inline-block rounded-full p-[2px] bg-gradient-to-r from-[#90DB78] via-[#5FD4BE] to-[#3FC8EE] w-full sm:w-auto">
                <motion.button
                  className="px-8 py-3 rounded-full text-white bg-black transition-all duration-300 font-medium w-full"
                  style={{
                    fontFamily: "Gotham, sans-serif",
                    fontSize: "clamp(14px, 3.5vw, 18px)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Speak to an Expert
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* PORTRAIT: Section 2 - Logo + Features (No Scrolling Logo) */}
        <section className="relative bg-black min-h-screen py-20 px-6">
          <div className="max-w-6xl mx-auto">
            
            {/* GIF - Increased Size and Centered */}
            <motion.div
              className="flex justify-center items-center mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px]">
                <PlaceholderDiv />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="font-extrabold leading-tight text-center mb-12"
              style={{
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontFamily: 'Gotham, sans-serif',
                background: 'linear-gradient(135deg, #90DB78 0%, #5FD4BE 50%, #3FC8EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your Personal Insurance Policy Vault
            </motion.h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontSize: 'clamp(22px, 5vw, 30px)',
                    fontFamily: 'Gotham, sans-serif',
                    color: '#F6A544',
                  }}
                >
                  Centralised Storage
                </h3>
                <p
                  className="text-white/90"
                  style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontFamily: 'Gotham, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  All policies in one secure place
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontSize: 'clamp(22px, 5vw, 30px)',
                    fontFamily: 'Gotham, sans-serif',
                    color: '#F6A544',
                  }}
                >
                  Easy Sharing & Access
                </h3>
                <p
                  className="text-white/90"
                  style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontFamily: 'Gotham, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  Share policy details with family instantly
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="text-center sm:col-span-2 lg:col-span-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontSize: 'clamp(22px, 5vw, 30px)',
                    fontFamily: 'Gotham, sans-serif',
                    color: '#F6A544',
                  }}
                >
                  Smart Renewals & Claims
                </h3>
                <p
                  className="text-white/90"
                  style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontFamily: 'Gotham, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  Reminders, renewals & claim assistance
                </p>
              </motion.div>

            </div>
          </div>
        </section>
      </div>
    );
  }

  // LANDSCAPE MODE - Original Scrolling Animation
  return (
    <div ref={containerRef} className="relative">
      {/* SECTION 1: Hero */}
      <section className="relative overflow-hidden bg-black min-h-screen">
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center min-h-screen px-6 sm:px-12 lg:px-16 xl:px-20 py-12">
          
          {/* LEFT - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2 
            }}
            style={{ opacity: textOpacity }}
          >
            <motion.h1
              className="font-extrabold leading-[0.95] tracking-tight"
              style={{ fontFamily: "Gotham, sans-serif" }}
            >
              <motion.span
                className="block bg-clip-text text-transparent mb-1"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #90DB78 0%, #5FD4BE 40%, #3FC8EE 100%)",
                  fontSize: "clamp(40px, 5vw + 1rem, 110px)",
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.3
                }}
              >
                All Your Policies.
              </motion.span>
              <motion.span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #90DB78 0%, #5FD4BE 40%, #3FC8EE 100%)",
                  fontSize: "clamp(40px, 5vw + 1rem, 110px)",
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.5
                }}
              >
                One Secure Vault.
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-8 text-white/90 leading-[1.5]"
              style={{
                fontFamily: "Gotham, sans-serif",
                fontSize: "clamp(16px, 1.2vw + 0.5rem, 28px)",
                fontWeight: "400",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.7
              }}
            >
              Access, manage, share, renew, and get claim
              <br />
              assistance for every policy — effortlessly.
            </motion.p>

            <motion.div 
              className="mt-12 flex flex-wrap gap-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.9
              }}
            >
              <motion.button
                className="px-10 py-4 rounded-full font-semibold transition-all duration-300"
                style={{
                  backgroundColor: "#F6A544",
                  color: "white",
                  fontFamily: "Gotham, sans-serif",
                  fontSize: "clamp(16px, 1.5vw, 18px)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
              >
                Policy Vault
              </motion.button>

              <div className="inline-block rounded-full p-[2px] bg-gradient-to-r from-[#90DB78] via-[#5FD4BE] to-[#3FC8EE]">
                <motion.button
                  className="px-10 py-4 rounded-full text-white bg-black transition-all duration-300 font-medium"
                  style={{
                    fontFamily: "Gotham, sans-serif",
                    fontSize: "clamp(16px, 1.5vw, 18px)",
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  Speak to an Expert
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT - Empty space for alignment */}
          <div className="hidden lg:block"></div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: 1.5,
              duration: 0.5
            }}
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div className="w-1.5 h-3 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Positioned Content Screen - FIXED HEIGHT TO MATCH HERO */}
      <section className="relative bg-black h-screen flex items-center justify-center">

        {/* TITLE - TOP LEFT - Reduced top spacing */}
        <motion.div
          className="absolute z-10"
          style={{
            top: '8%',
            left: '5%',
          }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.1
          }}
        >
          <h2
            className="font-extrabold leading-tight"
            style={{
              fontSize: 'clamp(44px, 5.5vw, 55px)',
              fontFamily: 'Gotham, sans-serif',
              background:
                'linear-gradient(135deg, #90DB78 0%, #5FD4BE 50%, #3FC8EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your Personal<br />
            Insurance Policy<br />
            Vault
          </h2>
        </motion.div>

        {/* LEFT CENTER */}
        <motion.div
          className="absolute z-10"
          style={{
            top: '50%',
            left: '8%',
            transform: 'translateY(-50%)',
            maxWidth: '360px',
          }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2
          }}
        >
          <h3
            className="font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontFamily: 'Gotham, sans-serif',
              color: '#F6A544',
            }}
          >
            Easy Sharing &<br />Access
          </h3>
          <p
            className="text-white/90"
            style={{
              fontSize: 'clamp(16px, 1.6vw, 22px)',
              fontFamily: 'Gotham, sans-serif',
              lineHeight: 1.6,
            }}
          >
            Share policy details<br />with family instantly
          </p>
        </motion.div>

        {/* TOP RIGHT - Reduced top spacing */}
        <motion.div
          className="absolute z-10"
          style={{
            top: '12%',
            right: '8%',
            maxWidth: '360px',
          }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.15
          }}
        >
          <h3
            className="font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontFamily: 'Gotham, sans-serif',
              color: '#F6A544',
            }}
          >
            Centralised<br />Storage
          </h3>
          <p
            className="text-white/90"
            style={{
              fontSize: 'clamp(16px, 1.6vw, 22px)',
              fontFamily: 'Gotham, sans-serif',
              lineHeight: 1.6,
            }}
          >
            All policies in one<br />secure place
          </p>
        </motion.div>

        {/* BOTTOM RIGHT */}
        <motion.div
          className="absolute z-10"
          style={{
            bottom: '15%',
            right: '8%',
            maxWidth: '380px',
          }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.25
          }}
        >
          <h3
            className="font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontFamily: 'Gotham, sans-serif',
              color: '#F6A544',
            }}
          >
            Smart Renewals &<br />Claims
          </h3>
          <p
            className="text-white/90"
            style={{
              fontSize: 'clamp(16px, 1.6vw, 22px)',
              fontFamily: 'Gotham, sans-serif',
              lineHeight: 1.6,
            }}
          >
            Reminders, renewals &<br />claim assistance
          </p>
        </motion.div>

      </section>

      {/* FLOATING LOGO - Scrolls from right to center with faster fade-out */}
      <AnimatePresence>
        <motion.div 
          className="hidden lg:flex justify-center items-center fixed z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            transition: { 
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.3
            }
          }}
          style={{
            scale: logoScale,
            x: logoX,
            y: logoY,
            opacity: logoOpacity,
            pointerEvents: logoPointerEvents,
            top: '25%',
            right: '8%',
            willChange: 'transform, opacity',
          }}
        >
          <motion.div 
            className="relative w-[700px] h-[700px] xl:w-[750px] xl:h-[750px]"
            style={{ backgroundColor: logoBackground }}
          >
            <PlaceholderDiv />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}