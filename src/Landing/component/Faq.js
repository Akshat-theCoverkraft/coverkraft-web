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
import { headingStyle } from "../../theme/themeStyles";

// Styled Components
const StyledAccordion = styled(Accordion)({
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
  color: THEME_COLOR.COLOR,
  transition: "all 0.3s ease",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
});

export default function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}faq/all`);
        const data = await res.json();
        console.log("FAQ Response:", data);

        if (data?.data && Array.isArray(data.data)) {
          const activeFaqs = data.data.filter(faq => faq.status === "active");
          setFaqList(activeFaqs);
        }
      } catch (err) {
        console.error("FAQ Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (panelId) => {
    setExpanded(expanded === panelId ? null : panelId);
  };

  if (!loading && faqList.length === 0) return null;

  const visibleFaqs = showAll ? faqList : faqList.slice(0, 3);

  return (
    <div
      id="faq"
      style={{
        backgroundColor: THEME_COLOR.BACKGROUND,
        padding: "10px 20px",
        scrollMarginTop: "100px",
      }}
    >
      <div className="p-3" style={{ position: "relative" }}>
        <Typography variant="h3" sx={{ ...headingStyle, textAlign: "center" }}>
          FAQs
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#FFF",
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "26px", sm: "30px", md: "32px" },
          }}
        >
          Frequently Asked Questions
        </Typography>

        {faqList.length > 3 && (
          <Typography
            onClick={() => setShowAll(!showAll)}
            sx={{
              color: "#5A9E1E",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1.2rem",
              textTransform: "uppercase",
              position: "absolute",
              right: "15px",
              top: "15px",
              '&:hover': { textDecoration: "underline" }
            }}
          >
            {showAll ? "See Less" : "See More"}
          </Typography>
        )}
      </div>

      <div style={{ padding: "10px 0" }}>
        <div
          style={{
            width: isMobile ? "90%" : "95%",
            margin: "0 auto",
            padding: "10px",
          }}
        >
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading FAQs...</p>
          ) : (
            visibleFaqs.map((item, index) => {
              const actualIndex = faqList.findIndex(f => f._id === item._id);
              const formattedNumber = (actualIndex + 1).toString().padStart(2, "0");

              return (
                <StyledAccordion
                  key={item._id || index}
                  expanded={expanded === item._id}
                  onChange={() => handleChange(item._id)}
                  className="p-1"
                  style={{
                    borderTopLeftRadius: index === 0 ? "20px" : "0px",
                    borderTopRightRadius: index === 0 ? "20px" : "0px",
                    borderBottomLeftRadius:
                      index === visibleFaqs.length - 1 ? "20px" : "0px",
                    borderBottomRightRadius:
                      index === visibleFaqs.length - 1 ? "20px" : "0px",
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
                    <span
                      className="mr-3 fw-bold"
                      style={{ fontSize: "3rem" }}
                    >
                      {formattedNumber}
                    </span>
                    {item.question}
                  </StyledAccordionSummary>
                  <AccordionDetails style={{ fontSize: "1.5rem" }}>
                    {item.answer}
                  </AccordionDetails>
                </StyledAccordion>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
