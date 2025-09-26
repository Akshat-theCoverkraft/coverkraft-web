import React, { useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";
import { THEME_COLOR } from "../constants";
import Footer from "../Landing/component/Footer";
import Navbar from "../component/Navbar";

const leaders = [
  {
    name: "Vivek Lalan",
    title: "Founder and Principal Officer",
    desc: `Vivek brings to the table an illustrious career spanning over 20+ years, with extensive expertise in both the banking and insurance sectors. He is an MBA, specializing in Marketing and Human Resources. His professional journey has seen him contribute significantly to esteemed organizations such as ICICI Bank, HDFC ERGO, Reliance General Insurance, Bajaj Allianz General Insurance, and the UPL Group.

Throughout his tenure, Vivek has played pivotal roles in orchestrating national-level teams and spearheading initiatives of global significance. A true maestro in his field, Vivek's forte lies in crafting and executing robust business strategies while championing operational excellence. He holds a firm belief that harnessing the power of technology has the potential to revolutionize the comprehension and accessibility of insurance within India.

`,
    img: "/images/leadership/VK.jpeg",
  },
  {
    name: "Prasad Kulkarni",
    title: "Executive Director",
    desc: `Mr. Prasad B. Kulkarni is a results-driven insurance professional with over 22 years of experience in claims management, underwriting, and crop insurance, specializing in the Motor and Crop segments. Known for a strategic approach to operational excellence, Mr. Kulkarni consistently achieves organizational goals while enhancing customer satisfaction and optimizing efficiency across all facets of insurance operations. Prasad has worked with Generali Central GIC (erstwhile Future Generali GIC Ltd), HDFC ERGO and ICICI Lombard in various capacities focusing on motor claims, underwriting and crop insurance.

Mr. Kulkarni holds a Diploma in Automobile Engineering from Bharatesh Polytechnic, Belgaum, Karnataka (1992 - 1995). His certifications include the Licentiate Examination from the Insurance Institute of India, Claims Management Training from the National Insurance Academy, Comprehensive Technical Program (General Insurance) from the National Insurance Academy, Six Sigma Green Belt, and a Leadership Development Program from the Indian Institute of Management, Bangalore.

Fluent in English, Kannada, Marathi, and Hindi, Mr. Kulkarni possesses a strong ability to drive strategic initiatives, foster a culture of continuous improvement, and lead teams toward achieving operational excellence. He is committed to delivering superior customer experiences and contributing to the growth and success of the organization.`,
    img: "/images/leadership/PK.jpeg",
  },
  {
    name: "Satyendra Mishra",
    title: "Founder",
    desc: `Satyendra boasts an impressive track record of 18+ years within the insurance industry, having collaborated with renowned insurers such as ICICI Lombard, HDFC ERGO, and Future Generali. Throughout his career trajectory, he has helmed diverse roles, accumulating a wealth of knowledge in sales and claims management. Satyendra's forte lies in adeptly steering teams and fostering strong government relations, underscoring his multifaceted expertise.

He is skilled in building and maintaining government relationships, conducting thorough market analysis, and providing critical market intelligence to ensure smooth operations and strategic growth in the insurance sector.`,
    img: "/images/leadership/U.jpeg",
  },
  {
    name: "Umesh Soni",
    title: "Founder",
    desc: `Umesh Soni, a Mechanical Engineer by academic training, boasts over 18 years of rich and diverse professional experience across multiple sectors. Commencing his journey at Mahindra & Mahindra FES, he later transitioned into the dynamic landscape of the insurance sector in 2007. Within this domain, Umesh has honed his expertise extensively, particularly in the rural insurance sector, collaborating with esteemed organizations such as HDFC ERGO GIC, ICICI Lombard, and Eicher Tractors.

His areas of specialization encompass a broad spectrum, including sales support, marketing, and compliance, underscoring his comprehensive skill set and strategic prowess. 

`,
    img: "/images/leadership/SM.jpeg",
  },
];

const LeadershipTab = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".leader-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <Navbar />
      <section
        ref={sectionRef}
        className="py-20 px-6"
        style={{
          background: "linear-gradient(180deg, #171718 0%, #000 100%)",
          minHeight: "100vh",
          paddingBottom: "100px",
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1
            style={{
              color: "#8BC642",
              fontWeight: 800,
              fontSize: "4.5rem",
              textShadow: "1px 1px 5px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            Our Leadership
          </h1>
          <p
            style={{
              color: THEME_COLOR.SECONDARY_TEXT,
              fontSize: "1.9rem",
              lineHeight: 1.2,
              maxWidth: "800px",
              margin: "0 auto",
              opacity: 0.9,
              whiteSpace: "pre-line",
            }}
          >
            Meet the visionary leaders who drive our mission forward with decades of combined experience
            in insurance, technology, and business innovation.
            Together, they shape the future of insurance solutions.
          </p>
        </div>

        {/* Leadership Cards */}
        <Grid container spacing={6} justifyContent="center" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {leaders.map((leader, index) => (
            <Grid item xs={12} lg={6} key={index}>
              <motion.div
                className="leader-card"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                    borderRadius: "20px",
                    border: "2px solid rgba(139,198,66,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                    minHeight: "300px",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                  }}
                  className="leadership-card-hover"
                >
                  {/* Left Side - Image */}
                  <div
                    style={{
                      flex: "0 0 220px",
                      height: "100%",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <motion.img
                      src={leader.img}
                      alt={leader.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center top",
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                  {/* Right Side - Content */}
                  <div
                    style={{
                      flex: 1,
                      padding: "30px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <motion.h2
                      style={{
                        color: "#8BC642",
                        fontWeight: 700,
                        fontSize: "2.2rem",
                        marginBottom: "8px",
                        lineHeight: 1.2,
                      }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {leader.name}
                    </motion.h2>
                    <h4
                      style={{
                        color: "#8BC642",
                        fontWeight: 600,
                        fontSize: "1.3rem",
                        marginBottom: "20px",
                        opacity: 0.8,
                        lineHeight: 1.3,
                        fontStyle: "italic",
                        underline: "1px solid rgba(139,198,66,0.6)",
                      }}
                    >
                      {leader.title}
                    </h4>
                    <motion.p
                      style={{
                        color: THEME_COLOR.SECONDARY_TEXT,
                        fontSize: "1.3rem",
                        lineHeight: 1.6,
                        margin: 0,
                        textAlign: "justify",
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                      }}
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {leader.desc}
                    </motion.p>
                  </div>
                </div>

                {/* Hover Effect Styles */}
                <style jsx>{`
                  .leadership-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 40px rgba(139, 198, 66, 0.25);
                    border-color: rgba(139, 198, 66, 0.6);
                  }
                  .leadership-card-hover p::-webkit-scrollbar {
                    width: 6px;
                  }
                  .leadership-card-hover p::-webkit-scrollbar-thumb {
                    background: rgba(139, 198, 66, 0.6);
                    border-radius: 10px;
                  }
                  @media (max-width: 768px) {
                    .leadership-card-hover {
                      flex-direction: column !important;
                      text-align: center;
                    }
                    .leadership-card-hover > div:first-child {
                      flex: 0 0 200px !important;
                      width: 100% !important;
                      height: 200px !important;
                    }
                    .leadership-card-hover > div:last-child {
                      padding: 20px !important;
                    }
                  }
                `}</style>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </section>
      <Footer />
    </>
  );
};

export default LeadershipTab;