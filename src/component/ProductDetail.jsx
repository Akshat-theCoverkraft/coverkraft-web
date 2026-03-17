import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";


// ─── DESIGN TOKENS (ORIGINAL - UNCHANGED) ────────────────────
const C = {
  bg:        "#000000",
  surface:   "#0a0a0a",
  card:      "#101010",
  cardBorder:"#1e1e1e",
  cardHov:   "#161616",
  green:     "#8AC642",
  orange:    "#FF9906",
  danger:    "#FF4444",
  white:     "#ffffff",
  text:      "rgba(255,255,255,0.85)",
  sub:       "rgba(255,255,255,0.50)",
  dim:       "rgba(255,255,255,0.28)",
  gradText:  "linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)",
  gradBorder:"linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)",
  teal:      "#3FC8EE",
  mint:      "#90DB78",
};

// ─── CSS STYLES (ORIGINAL - UNCHANGED) ───────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000 !important; }
  ::-webkit-scrollbar { width: 5px; background: #080808; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#90DB78,#3FC8EE); border-radius: 3px; }

  @keyframes fadeDown  { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(0.82)} to{opacity:1;transform:scale(1)} }
  @keyframes slideR    { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideL    { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }

  @keyframes shieldFloat {
    0%,100% { transform: translateY(0px) rotate(-1.5deg); }
    50%      { transform: translateY(-11px) rotate(1.5deg); }
  }
  @keyframes pulseRing {
    0%   { transform:scale(1);   opacity:0.55; }
    70%  { transform:scale(1.22);opacity:0;    }
    100% { transform:scale(1);   opacity:0;    }
  }
  @keyframes orbit {
    from { transform:rotate(0deg)   translateX(46px) rotate(0deg);   }
    to   { transform:rotate(360deg) translateX(46px) rotate(-360deg);}
  }
  @keyframes glowBreath {
    0%,100%{ opacity:0.45; transform:scale(1);    }
    50%    { opacity:0.95; transform:scale(1.09); }
  }
  @keyframes borderRun {
    0%  { background-position:0%   50%; }
    50% { background-position:100% 50%; }
    100%{ background-position:0%   50%; }
  }
  @keyframes badgePop {
    0%   { transform:scale(0) translateY(8px); opacity:0; }
    68%  { transform:scale(1.1) translateY(-2px); opacity:1; }
    100% { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes countPop {
    0%   { transform:scale(0.5); opacity:0; }
    60%  { transform:scale(1.14);opacity:1; }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes particleUp {
    0%  { opacity:0; transform:translateY(0) translateX(0); }
    10% { opacity:1; }
    90% { opacity:0.5; }
    100%{ opacity:0; transform:translateY(-110px) translateX(var(--dx,18px)); }
  }
  @keyframes twinkle {
    0%,100%{ opacity:0;   transform:scale(0.4); }
    50%    { opacity:0.9; transform:scale(1.3); }
  }
  @keyframes shimmerSweep {
    from{ transform:translateX(-100%); }
    to  { transform:translateX(100%);  }
  }
  @keyframes lineDraw {
    from{ transform:scaleX(0); transform-origin:left; }
    to  { transform:scaleX(1); transform-origin:left; }
  }
  @keyframes dotBlink {
    0%,100%{ opacity:1; }
    50%    { opacity:0.25; }
  }

  .cta-btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }
  .cta-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 12px 36px rgba(95,212,190,0.35) !important;
  }
  .cta-btn:active { transform:scale(0.97) !important; }

  .list-row { transition: padding-left 0.18s ease, background 0.15s ease; }
  .list-row:hover { padding-left: 20px !important; }

  .stat-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .stat-card:hover { transform: translateY(-7px) scale(1.04) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.6) !important; }

  .cmp-row { transition: background 0.14s ease; }
  .cmp-row:hover { background: rgba(144,219,120,0.035) !important; }

  .icon-bounce { transition: transform 0.2s ease; }
  .icon-bounce:hover { transform: scale(1.18) rotate(8deg); }
`;

// ─── ALL PRODUCTS DATA ────────────────────────────────────────
const ALL_PRODUCTS = {

  // ════ CAR ════
  "car-third-party": {
    category: "car",
    icon: "🛡️",
    title: "Third-Party Car Insurance",
    subtitle: "Legally mandatory under Motor Vehicle Act 1988 · Covers third-party liabilities",
    badges: ["Mandatory by Law", "Low Premium", "Instant Issuance"],
    facts: [
      { label: "Premium Range", value: "From ₹2,094/yr" },
      { label: "Validity",      value: "1 Year"          },
      { label: "TP Cover",      value: "Unlimited"       },
      { label: "PA Cover",      value: "₹15 Lakh"        },
    ],
    overview: "Mandated by the Motor Vehicle Act 1988, third-party (TP) car insurance protects you legally and financially if your vehicle causes injury, death, or property damage to a third party. It does not cover damage to your own vehicle.",
    covered: [
      "Unlimited liability for third-party death/injury claims",
      "Third-party property damage up to ₹7.5 Lakh",
      "Legal costs and court fees from covered incidents",
      "Compulsory personal accident cover for owner-driver",
    ],
    excluded: [
      "Damage to your own vehicle",
      "Vehicle theft",
      "Natural calamity damage to own car",
      "No add-on coverage available with this plan",
    ],
    comparison: {
      cols: ["Coverage", "Third-Party", "Comprehensive"],
      rows: [
        ["Own car damage",           false, true ],
        ["Theft of car",             false, true ],
        ["Choose own IDV",           false, true ],
        ["Customized add-ons",       false, true ],
        ["Third-party injury/death", true,  true ],
        ["TP property damage",       true,  true ],
        ["PA Cover",                 true,  true ],
      ],
    },
  },

  "car-comprehensive": {
    category: "car",
    icon: "⭐",
    title: "Comprehensive Car Insurance",
    subtitle: "360° protection — own damage + third-party · Most preferred plan in India",
    badges: ["Most Popular", "Full Coverage", "Add-ons Available"],
    facts: [
      { label: "Coverage",         value: "Own + Third-Party" },
      { label: "IDV",              value: "Flexible Choice"   },
      { label: "Cashless Garages", value: "5,000+"            },
      { label: "NCB Benefit",      value: "Up to 50%"         },
    ],
    overview: "Comprehensive insurance is the gold standard in car insurance. It covers both your own vehicle damages AND third-party liabilities — giving you complete 360° protection against accidents, theft, fire, natural calamities, and man-made disasters.",
    covered: [
      "Own car damage from accidents, fire, and theft",
      "Natural calamities: floods, earthquakes, cyclones",
      "Man-made disasters: riots, vandalism, sabotage",
      "Third-party injury, death, and property damage",
      "Personal accident cover for driver up to ₹15 Lakh",
      "Cashless claims at 5,000+ network garages",
    ],
    excluded: [
      "Driving under alcohol or drugs",
      "No valid driving license at time of incident",
      "Intentional or fraudulent damage",
      "Mechanical or electrical breakdown",
      "War, nuclear perils",
    ],
    comparison: {
      cols: ["Coverage", "Third-Party", "Comprehensive"],
      rows: [
        ["Own car damage",           false, true ],
        ["Theft",                    false, true ],
        ["IDV of your choice",       false, true ],
        ["Add-on covers",            false, true ],
        ["Third-party injury/death", true,  true ],
        ["TP property damage",       true,  true ],
        ["PA Cover",                 true,  true ],
      ],
    },
  },

  "car-own-damage": {
    category: "car",
    icon: "🔧",
    title: "Standalone Own Damage Insurance",
    subtitle: "Protect your car from damage · Requires a separately active TP policy",
    badges: ["Flexible", "Own Damage Only", "Pair with TP Policy"],
    facts: [
      { label: "Requirement", value: "Active TP Policy" },
      { label: "Covers",      value: "Own Damage"       },
      { label: "Theft",       value: "Included"         },
      { label: "Add-ons",     value: "Available"        },
    ],
    overview: "A Standalone Own Damage (OD) policy covers your car against damage from accidents, natural and man-made disasters, fire, and theft. It must be paired with a separately purchased third-party insurance policy as mandated by law.",
    covered: [
      "Collision and rollover damage to your vehicle",
      "Fire, self-ignition, and explosion",
      "Natural disasters: floods, earthquakes, storms",
      "Man-made disasters: riots, vandalism",
      "Vehicle theft and burglary",
      "Transit damage by rail, road, or water",
    ],
    excluded: [
      "Third-party liabilities — covered by separate TP policy",
      "Drink and drive incidents",
      "Driving without valid license",
      "Wear and tear or mechanical breakdown",
      "Illegal vehicle use",
    ],
    comparison: null,
  },

  "car-addons": {
    category: "car",
    icon: "➕",
    title: "Car Insurance Add-on Covers",
    subtitle: "Available only with Comprehensive policy · Extra protection at minimal extra premium",
    badges: ["8 Add-ons", "Comprehensive Only", "Customize Policy"],
    facts: [
      { label: "Available with", value: "Comprehensive"  },
      { label: "Zero Dep for",   value: "Cars < 5 yrs"  },
      { label: "RTI",            value: "On Total Loss"  },
      { label: "RSA",            value: "24/7 Pan-India" },
    ],
    overview: "Add-ons extend the coverage of your comprehensive car insurance beyond standard inclusions. They allow you to tailor your policy to your specific needs — paying only for what matters most to you. Cannot be purchased with a Third-Party only policy.",
    covered: [
      "Zero Depreciation: full part replacement cost, no depreciation deduction",
      "Engine Protection: flood/oil leakage damage beyond standard plan",
      "Return to Invoice: recover full purchase price on total loss",
      "Tyre Secure: repair/replacement + labour for tyre damage",
      "Roadside Assistance: 24/7 breakdown & towing anywhere in India",
      "Consumables Cover: engine oil, lubricants, filters reimbursed",
      "Key Protection: OEM key + lock replacement cost covered",
      "PA Cover for passengers: disability/death cover up to ₹1 Lakh each",
    ],
    excluded: [
      "Cannot be purchased with Third-Party only policies",
      "Zero Depreciation limited to vehicles under 5 years old",
      "Certain add-ons have sub-limits per insurer terms",
    ],
    comparison: null,
  },

  // ════ BIKE ════
  "bike-third-party": {
    category: "bike",
    icon: "⚖️",
    title: "Third-Party Bike Insurance",
    subtitle: "Legally mandatory under Motor Vehicle Act 1988 · Basic liability for two-wheelers",
    badges: ["Mandatory", "Lowest Premium", "Legal Compliance"],
    facts: [
      { label: "Type",        value: "Liability Only" },
      { label: "TP Liability",value: "Unlimited"      },
      { label: "Premium",     value: "From ₹482/yr"   },
      { label: "PA Cover",    value: "₹15 Lakh"       },
    ],
    overview: "All two-wheelers in India must have at least third-party insurance as mandated by the Motor Vehicles Act 1988. It covers your legal obligations if your bike causes injury or property damage to another person or vehicle.",
    covered: [
      "Death or bodily injury caused to a third party",
      "Unlimited liability for third-party injury claims",
      "Third-party property damage up to ₹7.5 Lakh",
      "Legal fees and court costs from covered incidents",
      "Compulsory personal accident cover for owner-driver",
    ],
    excluded: [
      "Own vehicle damage",
      "Theft of two-wheeler",
      "Natural calamity damage to own bike",
      "No add-on coverage available with this plan",
    ],
    comparison: null,
  },

  "bike-comprehensive": {
    category: "bike",
    icon: "🏆",
    title: "Comprehensive Bike Insurance",
    subtitle: "Complete protection for your two-wheeler + rider + third party",
    badges: ["Recommended", "360° Cover", "NCB Benefits"],
    facts: [
      { label: "Coverage",    value: "Own + TP"      },
      { label: "NCB Benefit", value: "Up to 50%"     },
      { label: "Cashless",    value: "Network Garages"},
      { label: "PA Cover",    value: "Included"      },
    ],
    overview: "The most complete insurance for your two-wheeler. Covers own vehicle damages (accidents, theft, natural disasters) AND third-party liabilities. Also includes personal accident cover for the rider.",
    covered: [
      "Own bike damage: accident, fire, theft",
      "Natural disasters: floods, earthquakes, cyclones",
      "Man-made disasters: riots, vandalism",
      "Third-party injury, death, and property damage",
      "Personal accident cover for owner-driver",
      "No Claim Bonus benefits for claim-free years",
    ],
    excluded: [
      "Riding under influence of alcohol or drugs",
      "Racing, reliability trials, or speed tests",
      "Driving without valid license",
      "Use outside India geographical borders",
      "War or nuclear perils",
    ],
    comparison: {
      cols: ["Coverage", "Third Party", "Comprehensive"],
      rows: [
        ["Own vehicle damage",         false, true ],
        ["Theft & natural calamities", false, true ],
        ["Add-on covers",              false, true ],
        ["Third-party liability",      true,  true ],
        ["Own injury/death cover",     false, true ],
        ["PA Cover",                   true,  true ],
      ],
    },
  },

  "bike-own-damage": {
    category: "bike",
    icon: "🔩",
    title: "Standalone Own Damage – Two-Wheeler",
    subtitle: "Protect your bike from damage · Must have an active TP policy",
    badges: ["Flexible", "Pairs with TP", "Theft Covered"],
    facts: [
      { label: "Requirement", value: "Active TP Policy" },
      { label: "Covers",      value: "Own Damage"       },
      { label: "Theft",       value: "Yes"              },
      { label: "Add-ons",     value: "Available"        },
    ],
    overview: "The Standalone Own Damage Bike Insurance Policy provides financial protection for your two-wheeler against damages from accidents, natural and man-made disasters, and theft. A running third-party policy is required by law.",
    covered: [
      "Accident damage to your two-wheeler",
      "Natural disaster damage: floods, earthquakes, storms",
      "Man-made disaster damage: riots, vandalism",
      "Fire and explosion damage",
      "Theft and burglary of the bike",
    ],
    excluded: [
      "Third-party liabilities — requires separate TP policy",
      "Drink and drive incidents",
      "Riding without a valid driving license",
      "Racing or speed tests",
      "Private bike used for commercial purposes",
    ],
    comparison: null,
  },

  "bike-addons": {
    category: "bike",
    icon: "🌟",
    title: "Two-Wheeler Insurance Add-ons",
    subtitle: "Supercharge your comprehensive bike policy with targeted extra covers",
    badges: ["9 Add-ons Available", "Comprehensive Only", "Flexible Pick"],
    facts: [
      { label: "Available with", value: "Comprehensive"  },
      { label: "Zero Dep",       value: "Full cost"      },
      { label: "RSA",            value: "24/7"           },
      { label: "NCB Protect",    value: "After Claim"    },
    ],
    overview: "Add-ons are supplementary coverage benefits you can add to your comprehensive two-wheeler policy at a small extra premium. Choose only the covers you actually need and build a policy that fits your lifestyle.",
    covered: [
      "Zero Depreciation: full repair cost, no depreciation deduction",
      "NCB Protection: keep no-claim bonus even after raising a claim",
      "Roadside Assistance: 24/7 on-road help, towing, and fuel delivery",
      "Accessories Cover: electrical and non-electrical accessories",
      "Emergency Medical Expenses for you and pillion rider",
      "Return to Invoice: recover original invoice value on total loss",
      "Personal Belongings: helmet stolen or damaged covered",
      "PA Cover: bodily injury, disability, or death",
      "Consumables Cover: oil, lubricants, filters reimbursed",
    ],
    excluded: [
      "Add-ons only available with Comprehensive — not Third-Party",
      "Some add-ons have bike age or model restrictions per insurer",
    ],
    comparison: null,
  },

  // ════ HEALTH ════
  "health-individual": {
    category: "health",
    icon: "👤",
    title: "Individual Health Insurance",
    subtitle: "Dedicated health cover for a single person — complete medical protection",
    badges: ["Tax Benefit 80D", "Cashless Claims", "COVID Covered"],
    facts: [
      { label: "Entry Age",   value: "18 – 65 yrs" },
      { label: "Sum Insured", value: "₹3L – ₹1 Cr" },
      { label: "Pre-Hosp",    value: "30 days"      },
      { label: "Post-Hosp",   value: "60 days"      },
    ],
    overview: "Individual health insurance plans cover a single person against hospitalisation costs, daycare procedures, critical illnesses, and more. Since the cover is dedicated to one person, the full sum insured is available exclusively for them.",
    covered: [
      "Pre & post-hospitalisation expenses (30 & 60 days)",
      "Cashless claims at 10,000+ network hospitals nationwide",
      "Doctor fees, room charges, diagnostic tests, medicines",
      "Critical illness and daycare procedure coverage",
      "COVID-19 treatment fully covered (IRDAI mandate)",
      "No Claim Bonus — sum insured increases each claim-free year",
      "Tax deduction under Section 80D — up to ₹25,000 per year",
    ],
    excluded: [
      "Pre-existing illnesses during the waiting period (2–4 years)",
      "Congenital diseases and birth defects",
      "Cosmetic surgery and beauty treatments",
      "Dental procedures (most standard plans)",
      "HIV/AIDS treatment",
      "Injuries from war, riots, or intentional self-harm",
    ],
    comparison: null,
  },

  "health-family": {
    category: "health",
    icon: "👨‍👩‍👧",
    title: "Family Health Insurance (Floater)",
    subtitle: "One policy, complete protection for your entire family",
    badges: ["Family Floater", "~20% Premium Savings", "Up to 17 Members"],
    facts: [
      { label: "Entry Age",  value: "18 – 65 yrs"       },
      { label: "Children",   value: "From 91 days"       },
      { label: "Members",    value: "Up to 17 relations" },
      { label: "Renewal",    value: "Lifetime"           },
    ],
    overview: "A Family Floater plan covers the policyholder, spouse, children, and parents under one policy. The total sum insured is shared among all members — any member who is hospitalised can use the entire sum insured. Typically ~20% cheaper than buying individual plans.",
    covered: [
      "All family members covered under a single policy",
      "Shared sum insured — one member can use the full cover",
      "Cumulative Bonus: sum insured grows 10–50% per claim-free year",
      "Add or remove family members at renewal",
      "COVID-19 treatment covered as per IRDAI mandate",
      "Tax benefits under 80D for policyholder and parents",
    ],
    excluded: [
      "Pre-existing illnesses during waiting period (2–4 years)",
      "Dental procedures (most standard plans)",
      "Cosmetic and plastic surgery",
      "HIV/AIDS treatment",
    ],
    comparison: {
      cols: ["Feature", "Family Floater", "Individual Plan"],
      rows: [
        ["Who is covered",        "Entire family",   "One person only"   ],
        ["Sum insured",           "Higher, shared",  "Lower, individual" ],
        ["Premium",               "~20% lower",      "Per person"        ],
        ["Premium basis",         "Eldest member",   "Insured person age"],
        ["Multiple claims/year",  "Shared pool",     "Full SI available" ],
      ],
    },
  },

  "health-covid": {
    category: "health",
    icon: "🦠",
    title: "COVID-19 Health Insurance Plans",
    subtitle: "IRDAI-approved dedicated plans — Corona Kavach & Corona Rakshak",
    badges: ["IRDAI Approved", "Home Quarantine", "Zero Deductibles"],
    facts: [
      { label: "Corona Rakshak", value: "Fixed Benefit" },
      { label: "Corona Kavach",  value: "Indemnity"     },
      { label: "Min Hosp.",      value: "3 days (Rakshak)"},
      { label: "Consumables",    value: "Kavach only"   },
    ],
    overview: "All existing health insurance policies in India cover COVID-19 hospitalization as per IRDAI guidelines. Two special dedicated plans — Corona Rakshak (fixed benefit) and Corona Kavach (indemnity) — provide complete COVID protection including home quarantine expenses.",
    covered: [
      "Corona Rakshak: lump sum payout on hospitalization for 3+ days",
      "Corona Kavach: actual hospitalization costs reimbursed",
      "Home quarantine treatment expenses (Kavach only)",
      "Zero deductibles or sub-limits under Corona Kavach",
      "Consumables covered under Kavach (PPE kits, gloves, masks)",
    ],
    excluded: [
      "Rakshak does not cover hospitalization under 3 days",
      "Non-COVID treatments under COVID-specific plans",
      "Consumables not covered under Corona Rakshak",
    ],
    comparison: {
      cols: ["Feature", "Corona Rakshak", "Corona Kavach"],
      rows: [
        ["Plan Type",       "Fixed Benefit",           "Indemnity"             ],
        ["Payout",          "Lump Sum",                "Actual Expenses"       ],
        ["Trigger",         "3+ days hosp.",           "Hosp/Home Quarantine"  ],
        ["Consumables",     "Not covered",             "Covered"               ],
        ["Deductibles",     "Nil",                     "Nil"                   ],
        ["Home Quarantine", "Not covered",             "Covered"               ],
      ],
    },
  },

  "health-claims": {
    category: "health",
    icon: "📋",
    title: "Health Insurance Claims Guide",
    subtitle: "Everything you need for smooth, timely claim settlement — cashless & reimbursement",
    badges: ["Step-by-Step Guide", "Cashless Process", "Document Checklist"],
    facts: [
      { label: "Pre-auth Lead",    value: "3–4 days"         },
      { label: "Emergency",        value: "Within 24 hrs"    },
      { label: "Cashless",         value: "Network Hospitals" },
      { label: "Reimbursement",    value: "Any Hospital"     },
    ],
    overview: "Knowing your claims process in advance ensures you get the right settlement at the right time. This guide covers both cashless (network hospitals) and reimbursement (any hospital) claim types with a full document checklist.",
    covered: [
      "Cashless: inform insurer → pre-auth → admit → approve → settle",
      "Reimbursement: treat → pay → submit docs → amount credited",
      "Duly filled claim form and original discharge summary required",
      "Original hospital bills with detailed itemised cost break-up",
      "All investigation, lab, and diagnostic reports",
      "Photo ID + health card + KYC documents",
    ],
    excluded: [
      "Consumables and policy-excluded items not settled even in cashless",
      "Expenses that fall outside the scope of your policy terms",
    ],
    comparison: null,
  },

  // ════ TRAVEL ════
  "travel-international": {
    category: "travel",
    icon: "🌍",
    title: "International Travel Insurance",
    subtitle: "Complete overseas protection — valid for 180+ countries, ages 6 months to 80 years",
    badges: ["Medical Cover", "Baggage Loss", "Trip Cancellation"],
    facts: [
      { label: "Age Range",     value: "6 months – 80 yrs" },
      { label: "Medical Limit", value: "Up to $500,000"    },
      { label: "Countries",     value: "180+"              },
      { label: "Flight Delay",  value: "12+ hours"         },
    ],
    overview: "Medical expenses abroad can be 5–7× higher than India. International travel insurance protects you from medical emergencies, baggage loss, flight delays, trip cancellations, and more — giving you complete peace of mind anywhere in the world.",
    covered: [
      "Overseas emergency medical expenses (accident + illness)",
      "Medical evacuation and repatriation of mortal remains",
      "Loss, theft, or delay of checked-in baggage",
      "Trip cancellation and interruption reimbursement",
      "Loss of passport and important travel documents",
      "Flight delay compensation (beyond 12 hours)",
      "Personal liability and legal costs incurred abroad",
    ],
    excluded: [
      "Cosmetic surgery and elective beauty treatments",
      "Self-inflicted injuries or alcohol/drug-related incidents",
      "Military, naval, or air force operations",
      "Non-allopathic treatments (homeopathy, unani, etc.)",
    ],
    comparison: null,
  },

  "travel-student": {
    category: "travel",
    icon: "🎓",
    title: "Student Travel Insurance",
    subtitle: "Tailored for Indian students going abroad for higher education",
    badges: ["Study Abroad", "Sponsor Protection", "Mental Health Cover"],
    facts: [
      { label: "Target",             value: "Indian Students"  },
      { label: "Sponsor Cover",      value: "Included"         },
      { label: "Mental Health",      value: "Covered"          },
      { label: "Compassionate Visit",value: "2-way ticket"     },
    ],
    overview: "Student travel insurance is a specialized plan for Indian students traveling abroad for higher education. It includes all standard international travel benefits plus additional covers unique to students — mental health, sponsor protection, and study interruption.",
    covered: [
      "All standard international travel benefits included",
      "Mental health disorder coverage (unique to student plans)",
      "Maternity coverage",
      "Sponsor protection — if sponsor loses ability to fund studies",
      "Study interruption coverage for unexpected return to India",
      "Bail bond coverage",
      "Two-way compassionate visit for student or family",
    ],
    excluded: [
      "Pre-existing conditions unless declared and accepted",
      "Self-harm, substance abuse incidents",
      "Elective or cosmetic procedures",
      "Non-allopathic treatments",
    ],
    comparison: null,
  },

  "travel-schengen": {
    category: "travel",
    icon: "🇪🇺",
    title: "Schengen Travel Insurance",
    subtitle: "Mandatory for Schengen visa · Valid across all 26 European Schengen countries",
    badges: ["Visa Mandatory", "26 Countries", "Min €30,000 Cover"],
    facts: [
      { label: "Countries",  value: "26 Schengen"  },
      { label: "Min Medical",value: "€30,000"      },
      { label: "Mandatory",  value: "Yes (Visa)"   },
      { label: "Validity",   value: "Trip Duration" },
    ],
    overview: "Schengen travel insurance is mandatory for obtaining a Schengen visa. It ensures you have the minimum required medical coverage of €30,000 and other protections while visiting any of the 26 Schengen zone countries in Europe.",
    covered: [
      "Emergency medical expenses — minimum €30,000 cover",
      "Loss of passport and important travel documents",
      "Delay in check-in baggage arrival",
      "Loss of checked-in baggage",
      "Personal liability cover",
      "Personal accident cover",
      "Valid for all 26 Schengen countries in Europe",
    ],
    excluded: [
      "Elective or cosmetic medical procedures",
      "Pre-existing conditions unless declared and accepted",
      "Self-inflicted injuries",
      "Non-emergency dental treatment (usually sub-limited)",
    ],
    comparison: null,
  },

  "travel-domestic": {
    category: "travel",
    icon: "🇮🇳",
    title: "Domestic Travel Insurance",
    subtitle: "Travel safely within India — covers air, rail, and road journeys",
    badges: ["Within India", "Air / Rail / Road", "Personal Accident"],
    facts: [
      { label: "Coverage",  value: "Within India"     },
      { label: "Transport", value: "Air, Rail, Road"  },
      { label: "Baggage",   value: "Covered"          },
      { label: "Medical",   value: "Included"         },
    ],
    overview: "Domestic travel insurance protects you during travel within India across all modes — air, rail, and road. It covers unforeseen emergencies so you can journey across the country with complete confidence.",
    covered: [
      "Medical cover for emergencies while traveling within India",
      "Loss of checked-in baggage",
      "Personal accident cover for injuries during transit",
      "Flight delay compensation",
      "Trip cancellation and interruption reimbursement",
      "Common carrier personal accident cover",
    ],
    excluded: [
      "International travel — not covered under this plan",
      "Pre-existing conditions",
      "Self-inflicted injuries",
      "Travel for illegal or unlawful purposes",
    ],
    comparison: null,
  },
};

// ─── SLUG → DATA KEY MAP ──────────────────────────────────────
const SLUG_MAP = {
  "car-third-party":      "car-third-party",
  "car-comprehensive":    "car-comprehensive",
  "car-own-damage":       "car-own-damage",
  "car-addons":           "car-addons",
  "bike-third-party":     "bike-third-party",
  "bike-comprehensive":   "bike-comprehensive",
  "bike-own-damage":      "bike-own-damage",
  "bike-addons":          "bike-addons",
  "health-individual":    "health-individual",
  "health-family":        "health-family",
  "health-covid":         "health-covid",
  "health-claims":        "health-claims",
  "travel-international": "travel-international",
  "travel-student":       "travel-student",
  "travel-schengen":      "travel-schengen",
  "travel-domestic":      "travel-domestic",
};

const CAT_BACK = {
  car:    "/products/car",
  bike:   "/products/bike",
  health: "/products/health",
  travel: "/products/travel",
};

// ─── HELPERS (ORIGINAL - UNCHANGED) ──────────────────────────
const GradientText = ({ children, style = {} }) => (
  <span style={{
    background: C.gradText,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    ...style,
  }}>{children}</span>
);

const GradientLine = ({ style = {} }) => (
  <div style={{
    height: 2,
    background: C.gradBorder,
    borderRadius: 2,
    ...style,
  }} />
);

const useMount = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 30); }, []);
  return mounted;
};

// ─── BADGE (ORIGINAL - UNCHANGED) ────────────────────────────
function Badge({ label, index }) {
  const colors = [
    { bg: "rgba(138,198,66,0.12)",  border: "rgba(138,198,66,0.3)",  text: C.green  },
    { bg: "rgba(63,200,238,0.10)",  border: "rgba(63,200,238,0.3)",  text: "#3FC8EE"},
    { bg: "rgba(255,153,6,0.12)",   border: "rgba(255,153,6,0.3)",   text: C.orange },
  ];
  const c = colors[index % colors.length];
  return (
    <span style={{
      padding: "5px 14px",
      borderRadius: 20,
      fontSize: "0.99rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
    }}>{label}</span>
  );
}

// ─── SECTION CARD (ORIGINAL - UNCHANGED) ─────────────────────
function SectionCard({ children, delay = 0, mounted }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      border: `1px solid ${C.cardBorder}`,
      padding: "28px 30px",
      position: "relative",
      overflow: "hidden",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── SECTION HEADING (ORIGINAL - UNCHANGED) ──────────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        fontSize: "2.3rem",
        fontWeight: 700,
        color: C.white,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <GradientLine style={{ width: 4, height: 18, borderRadius: 2, display: "inline-block" }} />
        {children}
      </h3>
    </div>
  );
}

// ─── LIST ROW (ORIGINAL - UNCHANGED) ─────────────────────────
function ListRow({ text, covered, last }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "11px 10px",
        borderRadius: 8,
        borderBottom: last ? "none" : `1px solid ${C.cardBorder}`,
        background: hov ? (covered ? "rgba(138,198,66,0.04)" : "rgba(255,68,68,0.04)") : "transparent",
        transition: "background 0.15s",
        cursor: "default",
      }}
    >
      <div style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: covered ? "rgba(138,198,66,0.15)" : "rgba(255,68,68,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1,
      }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 900, color: covered ? C.green : C.danger }}>
          {covered ? "✓" : "✗"}
        </span>
      </div>
      <span style={{ fontSize: "1.5rem", color: C.text, lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

// ─── COMPARISON TABLE (ORIGINAL - UNCHANGED) ─────────────────
function ComparisonTable({ comparison }) {
  const { cols, rows } = comparison;
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.cardBorder}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.1rem" }}>
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={col} style={{
                padding: "14px 18px",
                textAlign: "left",
                background: "#0d0d0d",
                borderBottom: `2px solid ${C.cardBorder}`,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                color: i === 0 ? C.sub : "transparent",
                backgroundImage: i === 0 ? "none" : C.gradText,
                WebkitBackgroundClip: i === 0 ? "unset" : "text",
                WebkitTextFillColor: i === 0 ? C.sub : "transparent",
                backgroundClip: i === 0 ? "unset" : "text",
                whiteSpace: "nowrap",
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              {row.map((cell, ci) => {
                const base = { padding: "12px 18px", borderBottom: `1px solid ${C.cardBorder}` };
                if (ci === 0) return (
                  <td key={ci} style={{ ...base, color: C.sub, fontWeight: 500 }}>{cell}</td>
                );
                if (cell === true) return (
                  <td key={ci} style={base}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "rgba(138,198,66,0.1)", border: "1px solid rgba(138,198,66,0.25)",
                      borderRadius: 20, padding: "3px 12px",
                      color: C.green, fontWeight: 700, fontSize: "1.5rem",
                    }}>✓ Yes</span>
                  </td>
                );
                if (cell === false) return (
                  <td key={ci} style={base}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)",
                      borderRadius: 20, padding: "3px 12px",
                      color: C.danger, fontWeight: 700, fontSize: "1.5rem",
                    }}>✗ No</span>
                  </td>
                );
                return <td key={ci} style={{ ...base, color: C.text }}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SPARKLE (ORIGINAL - UNCHANGED) ──────────────────────────
const Sparkle = ({ x, y, delay, color = "#90DB78", size = 7 }) => (
  <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", animation: `twinkle 2.6s ${delay}s ease-in-out infinite` }}>
    <svg width={size} height={size} viewBox="0 0 8 8">
      <path d="M4 0 L4.5 3.5 L8 4 L4.5 4.5 L4 8 L3.5 4.5 L0 4 L3.5 3.5 Z" fill={color} />
    </svg>
  </div>
);

// ─── ANIMATED SHIELD (ORIGINAL - UNCHANGED) ──────────────────
function AnimatedShield({ icon }) {
  return (
    <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `1.5px solid rgba(255,153,6,${0.35 - i * 0.1})`,
          animation: `pulseRing 2.6s ${i * 0.75}s ease-out infinite`,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 9, height: 9, borderRadius: "50%",
          background: C.teal, boxShadow: `0 0 12px ${C.teal}`,
          animation: "orbit 3.2s linear infinite",
        }} />
      </div>
      <div style={{
        position: "absolute", inset: 10, borderRadius: 20,
        background: "linear-gradient(135deg,rgba(255,153,6,0.14),rgba(255,153,6,0.04))",
        border: "1px solid rgba(255,153,6,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem",
        animation: "shieldFloat 4s ease-in-out infinite",
        boxShadow: "0 0 32px rgba(255,153,6,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>
        {icon}
      </div>
      <Sparkle x="-6px"  y="6px"  delay={0}   color={C.mint}   size={7} />
      <Sparkle x="96px"  y="14px" delay={0.9}  color={C.teal}   size={6} />
      <Sparkle x="6px"   y="90px" delay={1.7}  color={C.orange} size={5} />
      <Sparkle x="84px"  y="78px" delay={0.5}  color={C.mint}   size={7} />
    </div>
  );
}

// ─── HERO BANNER (ORIGINAL - UNCHANGED) ──────────────────────
function HeroBanner({ mounted, data }) {
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      background: "linear-gradient(135deg,#0a0f00 0%,#000 50%,#000d1a 100%)",
      border: `1px solid ${C.cardBorder}`,
      padding: "36px 40px",
      marginBottom: 28,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(-16px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.gradBorder }} />
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 300, height: 300,
        background: "radial-gradient(circle,rgba(63,200,238,0.07) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -40, left: 80,
        width: 200, height: 200,
        background: "radial-gradient(circle,rgba(138,198,66,0.05) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", position: "relative" }}>
        <div style={{ animation: "scaleIn 0.6s 0.15s ease both" }}>
          <AnimatedShield icon={data.icon} />
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <h1 style={{
            fontFamily: "'Sora','DM Sans',sans-serif",
            fontSize: "clamp(1.9rem,3.5vw,4.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 8,
            color: C.white,
          }}>
            <GradientText>{data.title}</GradientText>
          </h1>
          <p style={{ color: C.sub, fontSize: "1.9rem", lineHeight: 1.6, marginBottom: 16 }}>
            {data.subtitle}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.badges.map((b, i) => <Badge key={b} label={b} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR CTA (ORIGINAL - UNCHANGED) ──────────────────────
function SidebarCTA({ mounted }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      background: "linear-gradient(135deg,#0d1800,#001a0a)",
      border: "1.5px solid rgba(138,198,66,0.25)",
      padding: "24px 22px",
      marginBottom: 16,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 100ms, transform 0.6s ease 100ms",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.gradBorder }} />
      <div style={{
        fontSize: "0.90rem", fontWeight: 800, letterSpacing: "0.12em",
        textTransform: "uppercase", marginBottom: 10,
        background: C.gradText,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>🛡️ Best Price Guarantee</div>
      <h3 style={{
        fontFamily: "'Sora',sans-serif", fontSize: "1.88rem",
        fontWeight: 800, color: C.white, marginBottom: 6,
      }}>Get Your Best Quote</h3>
      <p style={{ color: C.sub, fontSize: "1.5rem", lineHeight: 1.6, marginBottom: 20 }}>
        Compare rates from 20+ insurers. Instant policy issuance. Best price guaranteed.
      </p>
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => window.open("https://www.thecoverkraft.com", "_blank")}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 10,
          border: "none",
          background: hov
            ? "linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)"
            : "linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)",
          color: "#000",
          fontFamily: "'Sora',sans-serif",
          fontSize: "1rem",
          fontWeight: 800,
          cursor: "pointer",
          transition: "all 0.2s",
          transform: hov ? "scale(1.02)" : "scale(1)",
          boxShadow: hov ? "0 8px 28px rgba(95,212,190,0.3)" : "0 4px 16px rgba(95,212,190,0.15)",
          letterSpacing: "0.01em",
        }}
      >
        Buy Now at TheCoverKraft →
      </button>
    </div>
  );
}

// ─── QUICK FACTS (ORIGINAL - UNCHANGED) ──────────────────────
function QuickFacts({ mounted, facts }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      border: `1px solid ${C.cardBorder}`,
      padding: "22px",
      marginBottom: 16,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <GradientLine style={{ width: 4, height: 16, borderRadius: 2 }} />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.88rem", fontWeight: 700, color: C.white }}>
          Quick Facts
        </h3>
      </div>
      {facts.map((f, i) => (
        <div key={f.label} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0",
          borderBottom: i < facts.length - 1 ? `1px solid ${C.cardBorder}` : "none",
          fontSize: "1.5rem",
        }}>
          <span style={{ color: C.sub }}>{f.label}</span>
          <span style={{
            fontWeight: 700,
            background: C.gradText,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{f.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── NEED HELP (ORIGINAL - UNCHANGED) ────────────────────────
function NeedHelp({ mounted }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      border: `1px solid ${C.cardBorder}`,
      padding: "22px",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <GradientLine style={{ width: 4, height: 16, borderRadius: 2 }} />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.88rem", fontWeight: 700, color: C.white }}>
          Need Help?
        </h3>
      </div>
      <p style={{ color: C.sub, fontSize: "1.5rem", lineHeight: 1.6, marginBottom: 16 }}>
        Our insurance experts are available 9am–9pm, 7 days a week.
      </p>
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => window.open("https://www.thecoverkraft.com", "_blank")}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 9,
          border: `1.5px solid ${hov ? C.orange : "rgba(255,153,6,0.3)"}`,
          background: hov ? "rgba(255,153,6,0.1)" : "transparent",
          color: C.orange,
          fontFamily: "'Sora',sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        📞 Talk to an Expert
      </button>
    </div>
  );
}

// ─── BACK BUTTON (ORIGINAL - UNCHANGED) ──────────────────────
function BackButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "transparent",
        border: `1.5px solid ${hov ? "rgba(95,212,190,0.5)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: 8, padding: "8px 18px",
        fontFamily: "'Sora',sans-serif", fontSize: "1.2rem",
        fontWeight: 700, cursor: "pointer",
        color: hov ? "#5FD4BE" : C.sub,
        marginBottom: 24,
        transition: "all 0.15s",
      }}
    >
      ← Back to Products
    </button>
  );
}

// ─── NOT FOUND ───────────────────────────────────────────────
function NotFound({ navigate }) {
  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: C.text }}>
      <div style={{ fontSize: "4rem" }}>🔍</div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 800 }}>
        <GradientText>Product Not Found</GradientText>
      </h2>
      <p style={{ color: C.sub, fontSize: "0.9rem" }}>The insurance product you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/products")} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#90DB78,#3FC8EE)", color: "#000", fontFamily: "'Sora',sans-serif", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer" }}>
        ← Browse All Products
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
// Route: <Route path="/products/:slug" element={<ProductDetail />} />
export default function ProductDetail() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const mounted   = useMount();

  const dataKey = SLUG_MAP[slug];
  const data    = dataKey ? ALL_PRODUCTS[dataKey] : null;

  // Scroll to top on slug change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [slug]);

  if (!data) return <NotFound navigate={navigate} />;

  const backPath = CAT_BACK[data.category] || "/products";

  return (
    <div style={{
      fontFamily: "'Sora','DM Sans',sans-serif",
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      padding: "32px 24px 80px",
    }}>
      <style>{STYLES}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <Navbar />

        {/* Back button */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          <BackButton onClick={() => navigate(backPath)} />
        </div>

        {/* Hero */}
        <HeroBanner mounted={mounted} data={data} />

        {/* 2-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
          gap: 20,
          alignItems: "start",
        }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Overview */}
            <SectionCard delay={100} mounted={mounted}>
              <SectionHeading>Overview</SectionHeading>
              <p style={{ fontSize: "1.5rem", color: C.text, lineHeight: 1.8 }}>
                {data.overview}
              </p>
            </SectionCard>

            {/* What's Covered */}
            <SectionCard delay={180} mounted={mounted}>
              <SectionHeading>
                What's Covered&nbsp;
                <span style={{ background: C.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>✓</span>
              </SectionHeading>
              {data.covered.map((item, i) => (
                <ListRow key={i} text={item} covered={true} last={i === data.covered.length - 1} />
              ))}
            </SectionCard>

            {/* What's NOT Covered */}
            <SectionCard delay={260} mounted={mounted}>
              <SectionHeading>
                What's NOT Covered&nbsp;
                <span style={{ color: C.danger }}>✗</span>
              </SectionHeading>
              {data.excluded.map((item, i) => (
                <ListRow key={i} text={item} covered={false} last={i === data.excluded.length - 1} />
              ))}
            </SectionCard>

            {/* Plan Comparison — only shown when data has comparison */}
            {data.comparison && (
              <SectionCard delay={340} mounted={mounted}>
                <SectionHeading>Plan Comparison</SectionHeading>
                <ComparisonTable comparison={data.comparison} />
              </SectionCard>
            )}

          </div>

          {/* ── RIGHT COLUMN (SIDEBAR) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <SidebarCTA mounted={mounted} />
            <QuickFacts mounted={mounted} facts={data.facts} />
            <NeedHelp mounted={mounted} />
          </div>

        </div>
      </div>
      
    </div>
  );
}