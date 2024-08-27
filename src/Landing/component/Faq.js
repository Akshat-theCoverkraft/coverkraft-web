import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import xmark from "../../Images/_xmark.png";
import plus from "../../Images/plus.png";
const StyledAccordion = styled(Accordion)({
  margin: "0px 0",
  //   borderRadius: '20px',
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
  },
});

export default function Faq() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (isExpanded) => () => {
    setExpanded(isExpanded ? "panel1" : false);
  };

  return (
    <>
      <div className="text-center p-3" style={{backgroundColor:'#F7FAFE'}}>
        <h3 className=" fw-bold" style={{ color: "#FF9906" }}>
          FAQ
        </h3>
        <h1 className="mt-3 fw-bold">Frequently Asked Questions</h1>
      </div>
      <div style={{ width: "50%", margin: "0 auto", borderRadius: "65px" }}>
        <StyledAccordion
          expanded={expanded === "panel1"}
          onChange={handleChange(expanded !== "panel1")}
        >
          <StyledAccordionSummary
            expandIcon={
              <img
                src={expanded === "panel1" ? xmark : plus}
                alt={expanded === "panel1" ? "collapse" : "expand"}
                style={{ width: "20px", height: "20px" }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <span className="text-secondary mr-5">01</span>How can I get a
            quote?
          </StyledAccordionSummary>
          <AccordionDetails className="text-secondary">
            You can get a quote by visiting our Get a Quote page, calling our
            customer service at 1-800-123-4567, or visiting one of our local
            offices.
          </AccordionDetails>
        </StyledAccordion>

        {/* Repeat for additional Accordions */}
        <StyledAccordion
          expanded={expanded === "panel2"}
          onChange={handleChange(expanded !== "panel2")}
        >
          <StyledAccordionSummary
            expandIcon={
              <img
                src={expanded === "panel2" ? xmark : plus}
                alt={expanded === "panel2" ? "collapse" : "expand"}
                style={{ width: "20px", height: "20px" }}
              />
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <span className="text-secondary mr-5">02</span>What factors affect
            my insurance premium?
          </StyledAccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </StyledAccordion>

        <StyledAccordion
          expanded={expanded === "panel2"}
          onChange={handleChange(expanded !== "panel2")}
        >
          <StyledAccordionSummary
            expandIcon={
              <img
                src={expanded === "panel2" ? xmark : plus}
                alt={expanded === "panel2" ? "collapse" : "expand"}
                style={{ width: "20px", height: "20px" }}
              />
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <span className="text-secondary mr-5">03</span>What is covered under
            my auto insurance policy?
          </StyledAccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </StyledAccordion>

        <StyledAccordion
          expanded={expanded === "panel2"}
          onChange={handleChange(expanded !== "panel2")}
        >
          <StyledAccordionSummary
            expandIcon={
              <img
                src={expanded === "panel2" ? xmark : plus}
                alt={expanded === "panel2" ? "collapse" : "expand"}
                style={{ width: "20px", height: "20px" }}
              />
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <span className="text-secondary mr-5">04</span>What is covered under
            my health insurance plan?
          </StyledAccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </StyledAccordion>

        <StyledAccordion
          expanded={expanded === "panel2"}
          onChange={handleChange(expanded !== "panel2")}
        >
          <StyledAccordionSummary
            expandIcon={
              <img
                src={expanded === "panel2" ? xmark : plus}
                alt={expanded === "panel2" ? "collapse" : "expand"}
                style={{ width: "20px", height: "20px", fontWeight: "bolder" }}
              />
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <span className="text-secondary mr-5">05</span>What does home
            insurance cover?
          </StyledAccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </StyledAccordion>
      </div>
    </>
  );
}
