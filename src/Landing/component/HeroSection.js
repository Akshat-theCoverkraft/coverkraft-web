import React, { useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Shield, FolderOpen } from "lucide-react";
const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

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
    <div ref={ref} className="relative bg-black overflow-hidden font-sans min-h-screen">
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

      {/* Hero Content */}
      <div className="relative mx-auto px-[5%] py-12 mt-20">
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

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1
                className="text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #8bc34a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Let's Secure the<br/>
                <span className="relative inline-block">
                  Next Era of Trust
                  <div
                    className="absolute bottom-1 left-0 w-full h-4 rounded-md -z-10"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,195,74,0.3), rgba(85,139,47,0.3))",
                      animation: "expandWidth 1s ease-out 1s both",
                    }}
                  />
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-[#c0c0c0] mb-10 leading-relaxed max-w-[90%]"
            >
              Comprehensive insurance solutions designed for modern families. Protect what matters most with customizable policies, instant claims, and 24/7 expert support at your fingertips.
            </motion.p>

            {/* Stats */}
            {/* <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex gap-12 mb-8"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-4xl lg:text-5xl font-bold text-[#8bc34a] mb-1">{stat.value}</div>
                  <div className="text-[#b0b0b0] text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div> */}

            {/* Policy Vault Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 mb-12 shadow-[0_0_40px_-12px_rgba(139,195,74,0.3)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-[#8bc34a]/20 rounded-2xl text-[#8bc34a]">
                  <FolderOpen className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Get Your Policy Vault</h3>
                  <p className="text-gray-400 text-sm">A place to save your entire family's policies</p>
                </div>
              </div>

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

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(139,195,74,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVault}
                className="px-10 py-4 rounded-full font-bold text-lg bg-gradient-to-br from-[#8bc34a] to-[#558b2f] text-white shadow-lg"
              >
               Policy Vault
              </motion.button>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT */}
             <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative z-10"
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-full max-w-[650px] mx-auto">
              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 w-[110%] h-[110%] rounded-[30px] -z-10"
                style={{
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(139,195,74,0.3), transparent 70%)',
                  animation: 'glowPulse 3s ease-in-out infinite'
                }}
              />

              {/* Main Image/SVG */}
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  rotateY: 5,
                  boxShadow: '0 40px 100px rgba(139,195,74,0.3)'
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full rounded-[30px] shadow-2xl border-2 border-[rgba(139,195,74,0.2)] overflow-hidden"
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="650" height="500" viewBox="0 0 650 500" className="w-full"> */}
               <img
    src="landingimage.jpg"  // ⭐ Put your image path here
    alt="Family"
    className="w-full h-[500px] object-cover"
  />
              </motion.div>

              {/* Floating Cards */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 1, duration: 0.5 }}
  className="absolute top-[10%] right-[-5%] px-7 py-5 rounded-2xl z-20"
  style={{
    background: "#141414",
    boxShadow:
      "8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(50,50,50,0.15), inset 0 0 0 1px rgba(255,255,255,0.03)",
    animation: "float 4s ease-in-out infinite"
  }}
>
  <div className="w-11 h-11 rounded-xl mb-3 flex items-center justify-center"
    style={{
      background: "#141414",
      boxShadow:
        "inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(50,50,50,0.1)"
    }}
  >
    <span className="text-xl">📘</span>
  </div>
  <div className="text-xl font-bold text-[#8bc34a] mb-1">Insurance Insights</div>
  <div className="text-xs text-white/40">Clear & simplified guidance</div>
</motion.div>


<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 1.5, duration: 0.5 }}
  className="absolute bottom-[10%] right-0 backdrop-blur-xl px-8 py-6 rounded-2xl border border-white/10 z-20 overflow-hidden"
  style={{
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
    animation: "float 4s ease-in-out infinite 1.5s"
  }}
>
  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8bc34a]/30 to-transparent" />
  <div className="text-3xl mb-2">🧭</div>
  <div className="text-xl font-bold text-[#8bc34a] mb-1">Expert Guidance</div>
  <div className="text-sm text-white/50">Personalised support</div>
</motion.div>


<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={isInView ? { opacity: 1, x: 0 } : {}}
  transition={{ delay: 0.75, duration: 0.5 }}
  className="absolute top-[50%] left-[-8%] -translate-y-1/2 p-[1px] rounded-2xl z-20"
  style={{
    background:
      "linear-gradient(145deg, rgba(139,195,74,0.6), rgba(139,195,74,0.1), rgba(255,255,255,0.1))",
    animation: "float 4s ease-in-out infinite 0.75s"
  }}
>
  <div className="backdrop-blur-xl px-8 py-6 rounded-2xl bg-[#0a0a0a]/80">
    <div className="text-3xl mb-2">🤝</div>
    <div className="text-xl font-bold text-[#8bc34a] mb-1">Claim Assistance</div>
    <div className="text-sm text-white/40">Fast, smooth, stress-free</div>
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

      {/* Animations */}
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
