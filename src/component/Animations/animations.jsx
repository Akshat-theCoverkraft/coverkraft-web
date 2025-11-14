// animations.js
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ============================================
// ANIMATION VARIANTS
// ============================================

export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const zoomIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const rotateIn = {
  hidden: { opacity: 0, rotate: -180, scale: 0 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

// ============================================
// STAGGER CONTAINERS
// ============================================

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// ============================================
// HOVER ANIMATIONS
// ============================================

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3 }
};

export const hoverScaleLarge = {
  scale: 1.1,
  transition: { duration: 0.3 }
};

export const hoverLift = {
  y: -10,
  transition: { duration: 0.3 }
};

export const hoverRotate = {
  rotate: 360,
  scale: 1.2,
  transition: { duration: 0.5 }
};

export const hoverGlow = (color = "rgba(90, 158, 30, 0.5)") => ({
  boxShadow: `0 10px 40px ${color}`,
  transition: { duration: 0.3 }
});

// ============================================
// TAP ANIMATIONS
// ============================================

export const tapScale = {
  scale: 0.95
};

export const tapScaleSmall = {
  scale: 0.98
};

// ============================================
// COMPONENTS
// ============================================

/**
 * AnimatedSection - A reusable component for scroll-triggered animations
 * @param {ReactNode} children - The content to animate
 * @param {Object} variant - The animation variant to use (default: fadeInUp)
 * @param {Number} delay - Additional delay before animation starts (default: 0)
 * @param {String} margin - Viewport margin for triggering animation (default: "-100px")
 * @param {Boolean} once - Whether animation should only happen once (default: true)
 */
export const AnimatedSection = ({
  children,
  variant = fadeInUp,
  delay = 0,
  margin = "-100px",
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variant}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggeredContainer - A container that staggers its children animations
 * @param {ReactNode} children - The content to animate
 * @param {Object} variant - The stagger variant to use (default: staggerContainer)
 * @param {String} margin - Viewport margin for triggering animation (default: "-100px")
 * @param {Boolean} once - Whether animation should only happen once (default: true)
 */
export const StaggeredContainer = ({
  children,
  variant = staggerContainer,
  margin = "-100px",
  once = true
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variant}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeInWhenVisible - Simple fade in animation when element becomes visible
 * @param {ReactNode} children - The content to animate
 * @param {Number} delay - Delay before animation starts (default: 0)
 * @param {Number} duration - Animation duration (default: 0.6)
 */
export const FadeInWhenVisible = ({
  children,
  delay = 0,
  duration = 0.6
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleInWhenVisible - Scale in animation when element becomes visible
 * @param {ReactNode} children - The content to animate
 * @param {Number} delay - Delay before animation starts (default: 0)
 */
export const ScaleInWhenVisible = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// PRESET ANIMATION CONFIGS
// ============================================

export const cardHoverAnimation = {
  whileHover: {
    y: -10,
    boxShadow: "0 15px 50px rgba(90, 158, 30, 0.3)",
    borderColor: "#5A9E1E",
    transition: { duration: 0.3 }
  }
};

export const buttonHoverAnimation = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.3 }
  },
  whileTap: {
    scale: 0.95
  }
};

export const iconRotateHover = {
  whileHover: {
    rotate: 360,
    scale: 1.2,
    transition: { duration: 0.5 }
  }
};

export const chipHoverAnimation = {
  whileHover: {
    scale: 1.05,
    y: -5,
    transition: { duration: 0.3 }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates a custom stagger container with custom timing
 * @param {Number} staggerChildren - Delay between each child (default: 0.1)
 * @param {Number} delayChildren - Initial delay before first child (default: 0.2)
 */
export const createStaggerContainer = (
  staggerChildren = 0.1,
  delayChildren = 0.2
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

/**
 * Creates a custom fade in animation with custom values
 * @param {Number} yOffset - Y offset for animation (default: 60)
 * @param {Number} duration - Animation duration (default: 0.6)
 */
export const createFadeInUp = (yOffset = 60, duration = 0.6) => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: [0.22, 1, 0.36, 1] }
  }
});

/**
 * Creates a custom slide animation
 * @param {Number} xOffset - X offset for animation (default: 60)
 * @param {Number} duration - Animation duration (default: 0.6)
 * @param {String} direction - Direction of slide: 'left' or 'right' (default: 'left')
 */
export const createSlideIn = (
  xOffset = 60,
  duration = 0.6,
  direction = "left"
) => ({
  hidden: { opacity: 0, x: direction === "left" ? -xOffset : xOffset },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, ease: [0.22, 1, 0.36, 1] }
  }
});

export default {
  // Variants
  fadeInUp,
  fadeInDown,
  fadeInScale,
  fadeIn,
  slideInLeft,
  slideInRight,
  zoomIn,
  rotateIn,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  
  // Hover/Tap
  hoverScale,
  hoverScaleLarge,
  hoverLift,
  hoverRotate,
  hoverGlow,
  tapScale,
  tapScaleSmall,
  
  // Components
  AnimatedSection,
  StaggeredContainer,
  FadeInWhenVisible,
  ScaleInWhenVisible,
  
  // Presets
  cardHoverAnimation,
  buttonHoverAnimation,
  iconRotateHover,
  chipHoverAnimation,
  
  // Utilities
  createStaggerContainer,
  createFadeInUp,
  createSlideIn
};