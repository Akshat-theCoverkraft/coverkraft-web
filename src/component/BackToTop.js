import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [show, setShow] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShow(scrolled > 300);
      setScrollPercent(Math.min(scrolled / height, 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsFlying(true);
    const start = window.scrollY || document.documentElement.scrollTop;
    const duration = 400;
    const startTime = performance.now();

    const easeInOutExpo = (t) =>
      t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;

    const step = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - easeInOutExpo(progress)));

      if (progress < 1) window.requestAnimationFrame(step);
      else setIsFlying(false);
    };

    window.requestAnimationFrame(step);
  };

  // For progress ring (circular stroke)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - scrollPercent);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: 30,
            marginBottom:10,
            right: 30,
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            outline: "none",
          }}
        >
          <svg
            style={{ position: "absolute", top: 0, left: 0 }}
            width={50}
            height={50}
            viewBox="0 0 50 50"
          >
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke="#ccc"
              strokeWidth="3"
              opacity="0.2"
            />
            <motion.circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke="#4caf50"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.2s ease" }}
            />
          </svg>

          <motion.div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: "#4caf50",
            }}
            animate={isFlying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, repeat: isFlying ? Infinity : 0, ease: "linear" }}
          >
            <FaArrowUp size={20} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
