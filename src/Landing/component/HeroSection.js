import React, { useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Shield, FolderOpen } from "lucide-react";

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const stats = [
    { value: "50K+", label: "Happy Families" },
    { value: "₹100Cr+", label: "Claims Settled" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const handleVault = () => {
    const isLoggedIn = !!sessionStorage.getItem("token");
    window.location.href = isLoggedIn ? "/vault" : "/login";
  };

  const handleCalculate = () => {
    window.location.href = "/calculate";
  };

  return (
    <div ref={ref} className="relative bg-black overflow-hidden font-sans">

      {/* Background Glow Effects */}
      <div
        className="absolute top-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,195,74,0.15), rgba(85,139,47,0.05), transparent)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,195,74,0.08), transparent)",
          animation: "pulse 8s ease-in-out infinite reverse",
        }}
      />

      <div className="relative mx-auto px-[5%] py-10 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
            className="z-10"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-6 bg-[rgba(139,195,74,0.1)] border border-[rgba(139,195,74,0.3)]"
            >
              <div
                className="w-2 h-2 rounded-full bg-[#8bc34a]"
                style={{ animation: "blink 2s ease-in-out infinite" }}
              />
              <span className="text-[#8bc34a] text-sm">Trusted by 50,000+ Indian Families</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight bg-gradient-to-br from-white to-[#8bc34a] bg-clip-text text-transparent"
            >
              Let's Secure the<br/>
              Next Era of Trust
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-xl text-[#c0c0c0] mb-10 leading-relaxed max-w-[90%]"
            >
              Comprehensive insurance solutions designed for modern families. Protect what matters most with customizable policies and expert support.
            </motion.p>

            {/* POLICY VAULT SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 mb-12 shadow-[0_0_40px_-12px_rgba(139,195,74,0.3)]"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

                {/* LEFT TITLE */}
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#8bc34a]/20 rounded-2xl text-[#8bc34a]">
                    <FolderOpen className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Get Your Policy Vault</h3>
                    <p className="text-gray-400 text-sm">Save all your family's policies in one secure place</p>
                  </div>
                </div>

                {/* RIGHT SINGLE BUTTON */}
                <motion.button
                  whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(139,195,74,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVault}
                  className="px-8 py-3 rounded-full font-bold text-lg bg-gradient-to-br from-[#8bc34a] to-[#558b2f] text-white shadow-lg whitespace-nowrap"
                >
                  Policy Vault
                </motion.button>
              </div>

              {/* FEATURES */}
              <div className="grid gap-3">
                {[
                  "Share policy summaries with your loved ones",
                  "Get timely renewal reminders",
                  "Receive the best renewal suggestions",
                  "One-click renewals",
                  "Manage your family's insurance portfolio",
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                  >
                    <Shield className="w-5 h-5 text-[#8bc34a]" />
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <div className="relative w-full max-w-[650px] mx-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative w-full rounded-[30px] shadow-2xl border-2 border-[rgba(139,195,74,0.2)] overflow-hidden"
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="650" height="500" viewBox="0 0 650 500" className="w-full"> */}
               <img
src={require("../../Images/landingimage.jpg")} // ⭐ Put your image path here
    alt="Family"
    className="w-full h-[500px] object-cover"
  />
              </motion.div>

         {/* Floating Cards - Unified Design for All 3 */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 1, duration: 0.5 }}
  className="floating-card absolute top-[10%] right-[-5%] z-20"
  style={{ animation: "float 4s ease-in-out infinite" }}
>
  <div
    className="p-[1px] rounded-2xl"
    style={{
      background:
        "linear-gradient(145deg, rgba(139,195,74,0.6), rgba(139,195,74,0.1), rgba(255,255,255,0.1))",
    }}
  >
    <div className="backdrop-blur-xl px-8 py-6 rounded-2xl bg-[#0a0a0a]/80">
      <div className="text-3xl mb-2">📘</div>
      <div className="text-xl font-bold text-[#8bc34a] mb-1">Insurance Insights</div>
      <div className="text-sm text-white/40">Clear & simplified guidance</div>
    </div>
  </div>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 1.5, duration: 0.5 }}
  className="floating-card absolute bottom-[10%] right-0 z-20"
  style={{ animation: "float 4s ease-in-out infinite 1.3s" }}
>
  <div
    className="p-[1px] rounded-2xl"
    style={{
      background:
        "linear-gradient(145deg, rgba(139,195,74,0.6), rgba(139,195,74,0.1), rgba(255,255,255,0.1))",
    }}
  >
    <div className="backdrop-blur-xl px-8 py-6 rounded-2xl bg-[#0a0a0a]/80">
      <div className="text-3xl mb-2">🧭</div>
      <div className="text-xl font-bold text-[#8bc34a] mb-1">Expert Guidance</div>
      <div className="text-sm text-white/50">Personalised support</div>
    </div>
  </div>
</motion.div>

<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={isInView ? { opacity: 1, x: 0 } : {}}
  transition={{ delay: 0.75, duration: 0.5 }}
  className="floating-card absolute top-[50%] left-[-8%] -translate-y-1/2 z-20"
  style={{ animation: "float 4s ease-in-out infinite 0.7s" }}
>
  <div
    className="p-[1px] rounded-2xl"
    style={{
      background:
        "linear-gradient(145deg, rgba(139,195,74,0.6), rgba(139,195,74,0.1), rgba(255,255,255,0.1))",
    }}
  >
    <div className="backdrop-blur-xl px-8 py-6 rounded-2xl bg-[#0a0a0a]/80">
      <div className="text-3xl mb-2">🤝</div>
      <div className="text-xl font-bold text-[#8bc34a] mb-1">Claim Assistance</div>
      <div className="text-sm text-white/40">Fast, smooth, stress-free</div>
    </div>
  </div>
</motion.div>

            </div>
          </motion.div>
        </div>
        
        {/* Trust Badges */}
           <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 1, delay: 0.8 }}
  className="mt-16"
>
  <div className="flex flex-wrap justify-center gap-6 lg:gap-10 max-w-5xl mx-auto">
    {[
      { icon: "✓", label: "IRDAI Approved" },
      { icon: "🔒", label: "100% Secure" },
      { icon: "⚡", label: "24/7 Support" },
      { icon: "🌟", label: "4.8/5 Rating" }
    ].map((badge, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.05 }}
        className="group flex flex-col items-center"
      >
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#8bc34a]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Circle */}
          <div className="relative w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 group-hover:border-[#8bc34a]/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {badge.icon}
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="mt-3 text-white text-xs font-semibold text-center group-hover:text-[#8bc34a] transition-colors duration-300">
          {badge.label}
        </p>
      </motion.div>
    ))}
  </div>
</motion.div>

        
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.6;transform:scale(1);}50%{opacity:1;transform:scale(1.15);} }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:.3;} }
        @keyframes expandWidth { from { width:0; } to { width:100%; } }
        @keyframes glowPulse {0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1);}50%{opacity:.8;transform:translate(-50%,-50%) scale(1.05);} }
        @keyframes float {0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-25px) rotate(2deg);} }
      `}</style>

    </div>
  );
};

export default HeroSection;
