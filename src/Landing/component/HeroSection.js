import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import hero from "../../Images/Hero1.png";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { motion, useReducedMotion, useInView, useMotionValue, useTransform } from "framer-motion";

// Section wrapper with padding
const SectionWrapper = styled("div")(({ theme }) => ({
  paddingTop: "2rem",
  paddingBottom: "0rem",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "1rem",
  },
}));

// Typing animation variants (used only for heading)
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Parsing HTML string to animated chars for heading
const parseTextToAnimatedCharacters = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const root = doc.body;

  const processNode = (node, keyPrefix = "") => {
    if (node.nodeType === 3) {
      return [...node.textContent].map((char, i) => (
        <motion.span
          key={`${keyPrefix}-char-${i}`}
          variants={charVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ));
    } else if (node.nodeType === 1) {
      const Tag = node.tagName.toLowerCase();
      const voidTags = ["br", "img", "hr", "input", "meta", "link"];
      if (voidTags.includes(Tag)) {
        return React.createElement(Tag, { key: keyPrefix });
      }
      const children = Array.from(node.childNodes).flatMap((child, i) =>
        processNode(child, `${keyPrefix}-${Tag}-${i}`)
      );
      return React.createElement(Tag, { key: keyPrefix }, children);
    }
    return null;
  };

  return Array.from(root.childNodes).flatMap((node, i) =>
    processNode(node, `node-${i}`)
  );
};

// Motion heading with typing effect
const MotionTypewriter = ({ htmlText }) => {
  const animatedCharacters = parseTextToAnimatedCharacters(htmlText);
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        fontSize: "clamp(1.5rem, 6vw, 3.2rem)",
        fontWeight: 700,
        marginBottom: "1rem",
        lineHeight: 1.3,
        whiteSpace: "pre-wrap",
      }}
    >
      {animatedCharacters}
    </motion.h1>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Reduced motion preference (for accessibility)
  const shouldReduceMotion = useReducedMotion();

  // Intersection observer for scroll-triggered animation
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // For parallax effect on image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // subtle translate range on image movement
  const translateX = useTransform(x, [-50, 50], [-10, 10]);
  const translateY = useTransform(y, [-50, 50], [-10, 10]);

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const posX = event.clientX - bounds.left - bounds.width / 2;
    const posY = event.clientY - bounds.top - bounds.height / 2;
    x.set(posX);
    y.set(posY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Navigation handler
  const handleVault = () => {
    const isLoggedIn = !!sessionStorage.getItem("token");
    navigate(isLoggedIn ? "/vault" : "/login");
  };

  return (
    <SectionWrapper ref={ref}>
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 2, sm: 3, md: 10 },
          flexDirection: { xs: "column-reverse", md: "row" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* TEXT SIDE */}
        <Grid item xs={12} md={7}>
          {/* Animate heading only if not reducing motion */}
          {!shouldReduceMotion ? (
            <MotionTypewriter
              htmlText={t("secureFuture") || "Secure Your <strong>Future</strong><br />With Confidence"}
            />
          ) : (
            // Fallback for reduced motion - simple text
            <h1
              style={{
                fontSize: "clamp(1.5rem, 6vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.3,
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{
                __html: t("secureFuture") || "Secure Your <strong>Future</strong><br />With Confidence",
              }}
            />
          )}

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              color: "#eaeaea",
              fontSize: "clamp(1rem, 4vw, 1.5rem)",
              lineHeight: 1.6,
            }}
          >
            Choose us for tailored coverage, exceptional customer service,
            <br />
            and peace of mind with reliable, comprehensive protection.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Button
              onClick={handleVault}
              sx={{
                marginBottom: "1rem",
                color: "#fff",
                backgroundColor: "#5A9E1E",
                borderRadius: "50px",
                px: 2.5,
                py: 1,
                fontSize: "1.5rem",
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: "1px",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: "#4B8719",
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                },
                "&:focus-visible": {
                  outline: "2px solid #4B8719",
                  outlineOffset: "2px",
                },
              }}
              aria-label={t("policyVault") || "Policy Vault"}
            >
              Policy Vault
            </Button>
          </motion.div>
        </Grid>

        {/* IMAGE SIDE */}
       <Grid
  item
  xs={12}
  md={5}
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible", // <-- Important fix for visibility
    width: "100%",
    maxWidth: "100%",
    position: "relative",
    zIndex: 1,
  }}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  onTouchMove={(e) => {
    const touch = e.touches[0];
    const bounds = e.currentTarget.getBoundingClientRect();
    const posX = touch.clientX - bounds.left - bounds.width / 2;
    const posY = touch.clientY - bounds.top - bounds.height / 2;
    x.set(posX);
    y.set(posY);
  }}
  onTouchEnd={handleMouseLeave}
>
  <motion.img
    initial={{ opacity: 0, scale: 0.95 }}
    animate={isInView ? { opacity: 1, scale: 1 } : {}}
    transition={{ delay: 1, duration: 0.6, ease: "easeIn" }}
    src={hero}
    alt="Family Home"
    loading="lazy"
    draggable={false}
    style={{
      width: "200%",
      maxWidth: "170%",
      height: "500px",
      objectFit: "cover",
      userSelect: "none",
      pointerEvents: "none",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      marginTop: "90px"
    }}
  />
</Grid>

      </Grid>
    </SectionWrapper>
  );
};

export default HeroSection;
