import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import xmark from "../../Images/xmark.png";
import plus from "../../Images/plus2.png";
import { THEME_COLOR } from "../../constants";
import API_URL from "../../ServiceModule/Service";
import { Typography } from "@mui/material";

// 🔒 Fallback FAQs (shown if API fails or returns empty)
const placeholderFAQs = [
  {
    _id: "fallback1",
    question: "How can I get a quote?",
    answer: "Visit our Get a Quote page or call 1-800-123-4567.",
  },
  {
    _id: "fallback2",
    question: "What does home protection cover?",
    answer:
      "Damage to your home, personal belongings, liability, and temporary living expenses.",
  },
  {
    _id: "fallback3",
    question: "What is covered under my auto policy?",
    answer:
      "Liability, collision, comprehensive, medical payments, and uninsured motorist coverage.",
  },
];

// Styled Components
const StyledAccordion = styled(Accordion)({
  margin: "0",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
  color: THEME_COLOR.COLOR,
  transition: "all 0.3s ease",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
});

export default function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}faq/all`);
        const data = await res.json();
        console.log("📦 FAQ Response:", data);

        if (data?.data && Array.isArray(data.data)) {
          // Only include FAQs with status 'active'
          const activeFaqs = data.data.filter(faq => faq.status === "active");
          if (activeFaqs.length > 0) {
            setFaqList(activeFaqs);
          } else {
            console.warn("⚠️ No active FAQs found. Showing placeholder.");
            setFaqList(placeholderFAQs);
          }
        } else {
          console.warn("⚠️ No FAQs found. Showing placeholder.");
          setFaqList(placeholderFAQs);
        }
      } catch (err) {
        console.error("🔥 FAQ Fetch Error:", err);
        setFaqList(placeholderFAQs);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (panelId) => {
    setExpanded(expanded === panelId ? null : panelId);
  };

  return (
    <div id="faq" style={{ backgroundColor: THEME_COLOR.BACKGROUND, padding: "20px 30px" }}>
      <div className="text-center p-3">
        <Typography variant="h3" sx={{ color: '#FF9906', fontWeight: 700, mb: 1, textAlign: 'center', fontSize: { xs: '24px', sm: '28px', md: '30px' } }}>
            FAQs
       </Typography>     
      <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700, mb: 4, textAlign: 'center', fontSize: { xs: '26px', sm: '30px', md: '32px' } }}>
            Frequently Asked Questions
      </Typography>

      </div>

      <div style={{ padding: "20px 0" }}>
        <div
          style={{
            width: isMobile ? "90%" : "95%",
            margin: "0 auto",
            padding: "10px",
          }}
        >
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading FAQs...</p>
          ) : faqList.length === 0 ? (
            <p style={{ textAlign: "center" }}>No FAQs available at the moment.</p>
          ) : (
            faqList.map((item, index) => (
              <StyledAccordion
                key={item._id || index}
                expanded={expanded === item._id}
                onChange={() => handleChange(item._id)}
                className="p-3"
                style={{
                  borderTopLeftRadius: index === 0 ? "20px" : "0px",
                  borderTopRightRadius: index === 0 ? "20px" : "0px",
                  borderBottomLeftRadius:
                    index === faqList.length - 1 ? "20px" : "0px",
                  borderBottomRightRadius:
                    index === faqList.length - 1 ? "20px" : "0px",
                }}
              >
                <StyledAccordionSummary
                  expandIcon={
                    <img
                      src={expanded === item._id ? xmark : plus}
                      alt={expanded === item._id ? "collapse" : "expand"}
                      style={{ width: 35, height: 35 }}
                    />
                  }
                  aria-controls={`${item._id}-content`}
                  id={`${item._id}-header`}
                  className="fw-bold"
                  style={{ fontSize: "1.6rem" }}
                >
                  <span className="mr-3 fw-bold" style={{ fontSize: "3rem" }}>{`0${index + 1}`}</span>
                  {item.question}
                </StyledAccordionSummary>
                <AccordionDetails style={{ fontSize: "1.5rem" }}>{item.answer}</AccordionDetails>
              </StyledAccordion>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
