// ─── Policy Data ──────────────────────────────────────────────────────────────
export const MY_POLICIES = [
  {
    id: "p1",
    policyNumber: "POL-2024-001",
    company: "HDFC ERGO",
    type: "Motor",
    holder: "Rajesh Kumar",
    startDate: "01-Apr-25",
    endDate: "31-Mar-26",
    subType: "Comp.",
    detail: "MH-01-AB-1234",
    model: "Maruti Swift",
  },
  {
    id: "p2",
    policyNumber: "POL-2024-089",
    company: "Star Health",
    type: "Health",
    holder: "Rajesh Kumar",
    startDate: "15-Jun-25",
    endDate: "15-Jun-26",
    subType: "Floater",
    sumInsured: "₹15L",
  },
  {
    id: "p3",
    policyNumber: "POL-2023-445",
    company: "Bajaj Allianz",
    type: "Life",
    holder: "Rajesh Kumar",
    startDate: "01-Jan-24",
    endDate: "01-Jan-28",
    subType: "Term Plus",
    sumAssured: "₹1.5Cr",
  },
];

// ─── Document Center Data ─────────────────────────────────────────────────────
export const DOC_DATA = {
  Motor: [
    {
      icon: "fa-file-pdf",
      title: "Motor Claim Form",
      desc: "Required for all motor accident / damage claims.",
      link: "Download Form",
    },
    {
      icon: "fa-image",
      title: "Accident Photo Checklist",
      desc: "Guide to photographing damage for motor surveys.",
      link: "View Checklist",
    },
    {
      icon: "fa-car-burst",
      title: "Total Loss Declaration",
      desc: "For vehicles declared total loss / CTL.",
      link: "Download Form",
    },
  ],
  Health: [
    {
      icon: "fa-file-medical",
      title: "Health Claim Form",
      desc: "Required for all hospitalization and medical expense claims.",
      link: "Download Form",
    },
    {
      icon: "fa-hospital",
      title: "Network Hospital List",
      desc: "Find cashless hospitals near you for direct settlement.",
      link: "View List",
    },
    {
      icon: "fa-receipt",
      title: "Reimbursement Checklist",
      desc: "Documents needed for out-of-pocket expense reimbursement.",
      link: "View Checklist",
    },
  ],
  Life: [
    {
      icon: "fa-file-contract",
      title: "Death Claim Form",
      desc: "Required for intimating a life insurance death claim.",
      link: "Download Form",
    },
    {
      icon: "fa-coins",
      title: "Maturity Claim Form",
      desc: "For policy maturity and survival benefit claims.",
      link: "Download Form",
    },
    {
      icon: "fa-shield-halved",
      title: "Rider Claim Checklist",
      desc: "Documents required for critical illness or disability rider claims.",
      link: "View Checklist",
    },
  ],
};