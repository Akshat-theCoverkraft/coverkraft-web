import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import xmark from "../../Images/_xmark.png";
import plus from "../../Images/plus.png";
import { THEME_COLOR } from "../../constants";

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

// FAQ Data
const faqList = [
  {
    id: "panel1",
    question: "How can I get a quote?",
    answer:
      "You can get a quote by visiting our Get a Quote page, calling our customer service at 1-800-123-4567, or visiting one of our local offices.",
  },
  {
    id: "panel2",
    question: "What factors affect my insurance premium?",
    answer:
      "Your insurance premium depends on various factors such as age, location, type of coverage, past claims, and more.",
  },
  {
    id: "panel3",
    question: "What is covered under my auto insurance policy?",
    answer:
      "Typically, it includes liability coverage, collision, comprehensive, medical payments, and uninsured motorist coverage.",
  },
  {
    id: "panel4",
    question: "What is covered under my health insurance plan?",
    answer:
      "Health insurance generally covers doctor visits, hospitalization, prescription drugs, preventive care, and more.",
  },
  {
    id: "panel5",
    question: "What does home insurance cover?",
    answer:
      "Home insurance usually covers damage to your home, personal belongings, liability, and temporary living expenses.",
  },
];

export default function Faq() {
  const [expanded, setExpanded] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (panel) => {
    setExpanded(expanded === panel ? null : panel);
  };

  return (
    <div style={{ backgroundColor: THEME_COLOR.BACKGROUND }}>
      <div className="text-center p-3">
        <h3 className="fw-bold" style={{ color: "#FF9906" }}>
          FAQ
        </h3>
        <h1 className="mt-3 fw-bold">Frequently Asked Questions</h1>
      </div>

      <div style={{ padding: "20px 0" }}>
        <div
          style={{
            width: isMobile ? "90%" : "70%",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          {faqList.map((item, index) => (
            <StyledAccordion
              key={item.id}
              expanded={expanded === item.id}
              onChange={() => handleChange(item.id)}
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
                    src={expanded === item.id ? xmark : plus}
                    alt={expanded === item.id ? "collapse" : "expand"}
                    style={{ width: 20, height: 20 }}
                  />
                }
                aria-controls={`${item.id}-content`}
                id={`${item.id}-header`}
                className="fw-bold"
              >
                <span className="mr-3">{`0${index + 1}`}</span>
                {item.question}
              </StyledAccordionSummary>
              <AccordionDetails>{item.answer}</AccordionDetails>
            </StyledAccordion>
          ))}
        </div>
      </div>
    </div>
  );
}
