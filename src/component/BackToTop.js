import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { FaArrowUp } from "react-icons/fa"; // FontAwesome icon
import { FaArrowUp, FaRocket } from "react-icons/fa";


import "./BackToTop.css";

const BackToTop = () => {
    const [show, setShow] = useState(false);
    const [isFlying, setIsFlying] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        setIsFlying(true);
        const start = window.scrollY || document.documentElement.scrollTop;
        const duration = 400; // faster duration in ms
        const startTime = performance.now();

        function easeInOutExpo(t) {
            return t === 0
                ? 0
                : t === 1
                    ? 1
                    : t < 0.5
                        ? Math.pow(2, 20 * t - 10) / 2
                        : (2 - Math.pow(2, -20 * t + 10)) / 2;
        }

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutExpo(progress);
            const newY = start * (1 - easedProgress);

            window.scrollTo(0, newY);

            if (progress < 1) {
                window.requestAnimationFrame(scrollStep);
            } else {
                setIsFlying(false);
            }
        }

        window.requestAnimationFrame(scrollStep);
    };


    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    onClick={scrollToTop}
                    className="back-to-top-btn"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    aria-label="Back to top"
                >
                    <motion.div
                        animate={isFlying ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.6, repeat: isFlying ? Infinity : 0, ease: "linear" }}
                    >
                        <FaArrowUp/>
                    </motion.div>


                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
