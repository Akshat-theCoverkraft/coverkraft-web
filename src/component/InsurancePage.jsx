import React, { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
//  THEME — matches your Navbar exactly (black bg, #8AC642 green)
// ═══════════════════════════════════════════════════════════════
const T = {
  bg: "#000000",
  surface: "#111111",
  card: "#161616",
  cardHov: "#1c1c1c",
  border: "#2a2a2a",
  green: "#8AC642",
  greenDim: "rgba(138,198,66,0.12)",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.48)",
  text: "rgba(255,255,255,0.82)",
  textSub: "rgba(255,255,255,0.52)",
  danger: "#f44336",
  blue: "#00A8E8",
  red: "#E53935",
  teal: "#00C48C",
  orange: "#FF5A1F",
};

// ═══════════════════════════════════════════════════════════════
//  STATIC DATA
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = [
  { key: "car",    icon: "🚗", label: "Car Insurance",        title: "Private Car Insurance Plans",  sub: "Financially protect your vehicle from accidents, theft & natural disasters.", desc: "Third-party, comprehensive & add-on covers", color: T.orange },
  { key: "bike",   icon: "🏍️", label: "Two-Wheeler Insurance", title: "Two-Wheeler Insurance Plans",   sub: "Protect your bike or scooter against accidents, theft & liabilities.",         desc: "Bike & scooter plans with full protection",  color: T.blue },
  { key: "health", icon: "❤️", label: "Health Insurance",      title: "Health Insurance Plans",        sub: "Protect your health and family with comprehensive cashless medical coverage.", desc: "Individual, family floater & COVID plans",    color: T.red },
  { key: "travel", icon: "✈️", label: "Travel Insurance",      title: "Travel Insurance Plans",        sub: "Travel the world without worry — medical, baggage, delays & more covered.",   desc: "International, student, Schengen & domestic", color: T.teal },
];

const PRODUCTS = {
  car: [
    { id: "car-tp",     icon: "🛡️", accent: T.orange, name: "Third-Party Car Insurance",    desc: "Mandatory cover protecting against legal liabilities for third-party injuries, death, and property damage.",     tags: [{ l: "Mandatory by Law", bg: "rgba(255,90,31,0.15)",   c: T.orange }, { l: "Low Premium",   bg: "rgba(0,168,232,0.15)",   c: T.blue }] },
    { id: "car-comp",   icon: "⭐",  accent: T.green,  name: "Comprehensive Car Insurance",  desc: "360° coverage — own damage + third-party. Best for accidents, theft, fire, and natural calamities.",             tags: [{ l: "Most Popular",   bg: "rgba(138,198,66,0.15)",  c: T.green }, { l: "Full Coverage", bg: "rgba(0,196,140,0.15)",   c: T.teal  }] },
    { id: "car-od",     icon: "🔧",  accent: T.blue,   name: "Standalone Own Damage",        desc: "Protect your car against accident damage, disasters & theft. Pair with any active TP policy.",                   tags: [{ l: "Flexible",       bg: "rgba(0,168,232,0.15)",   c: T.blue  }, { l: "Own Damage",    bg: "rgba(0,196,140,0.15)",   c: T.teal  }] },
    { id: "car-addons", icon: "➕",  accent: T.teal,   name: "Car Insurance Add-ons",        desc: "Zero Dep, Engine Protection, RSA, RTI, Consumables Cover & more — enhance your comprehensive policy.",           tags: [{ l: "8 Add-ons",      bg: "rgba(0,196,140,0.15)",   c: T.teal  }, { l: "Enhanced Cover",bg: "rgba(138,198,66,0.15)",  c: T.green }] },
  ],
  bike: [
    { id: "bike-tp",     icon: "⚖️",  accent: T.orange, name: "Third-Party Bike Insurance",   desc: "Legally mandatory policy covering third-party injuries and property damage caused by your two-wheeler.",          tags: [{ l: "Mandatory",    bg: "rgba(255,90,31,0.15)",   c: T.orange }, { l: "Affordable",    bg: "rgba(0,168,232,0.15)", c: T.blue  }] },
    { id: "bike-comp",   icon: "🏆",  accent: T.green,  name: "Comprehensive Bike Insurance", desc: "Complete protection: own damage + third-party liability for accidents, theft, floods, and earthquakes.",         tags: [{ l: "Recommended",  bg: "rgba(138,198,66,0.15)", c: T.green  }, { l: "Full Cover",    bg: "rgba(0,196,140,0.15)", c: T.teal  }] },
    { id: "bike-od",     icon: "🔩",  accent: T.blue,   name: "Standalone Own Damage",        desc: "Cover bike damage from accidents, natural disasters & theft. Requires active TP policy.",                        tags: [{ l: "Flexible",     bg: "rgba(0,168,232,0.15)",  c: T.blue   }, { l: "Own Damage",    bg: "rgba(0,196,140,0.15)", c: T.teal  }] },
    { id: "bike-addons", icon: "🌟",  accent: T.teal,   name: "Bike Add-on Covers",           desc: "Zero Dep, NCB Protection, RSA, Emergency Medical, PA Cover, RTI & Personal Belongings.",                        tags: [{ l: "9 Add-ons",    bg: "rgba(0,196,140,0.15)",  c: T.teal   }, { l: "Extra Cover",   bg: "rgba(138,198,66,0.15)",c: T.green }] },
  ],
  health: [
    { id: "health-indiv",   icon: "👤",     accent: T.red,    name: "Individual Health Insurance", desc: "Dedicated health cover for one person — hospitalisation, daycare, critical illness & tax benefits.",         tags: [{ l: "Tax Benefit 80D", bg: "rgba(0,168,232,0.15)",  c: T.blue  }, { l: "Cashless Claims", bg: "rgba(0,196,140,0.15)", c: T.teal  }] },
    { id: "health-family",  icon: "👨‍👩‍👧", accent: T.orange, name: "Family Health Insurance",     desc: "One floater policy covering your entire family — shared sum insured at one affordable premium.",             tags: [{ l: "Family Floater",  bg: "rgba(255,90,31,0.15)", c: T.orange}, { l: "~20% Savings",    bg: "rgba(0,196,140,0.15)", c: T.teal  }] },
    { id: "health-covid",   icon: "🦠",     accent: T.teal,   name: "COVID-19 Plans",              desc: "IRDAI-approved Corona Kavach (indemnity) and Corona Rakshak (fixed benefit) plans.",                        tags: [{ l: "IRDAI Approved",  bg: "rgba(0,168,232,0.15)",  c: T.blue  }, { l: "Home Quarantine", bg: "rgba(0,196,140,0.15)", c: T.teal  }] },
    { id: "health-claims",  icon: "📋",     accent: T.green,  name: "Claims Settlement Guide",     desc: "Step-by-step cashless and reimbursement claims process with complete document checklist.",                  tags: [{ l: "Cashless",        bg: "rgba(138,198,66,0.15)", c: T.green }, { l: "Reimbursement",   bg: "rgba(0,168,232,0.15)",  c: T.blue  }] },
  ],
  travel: [
    { id: "travel-intl",     icon: "🌍", accent: T.teal,   name: "International Travel", desc: "Full overseas coverage for individuals & families: medical, baggage loss, trip cancellation & more.", tags: [{ l: "Medical Cover",  bg: "rgba(0,168,232,0.15)", c: T.blue  }, { l: "Baggage Loss",  bg: "rgba(0,196,140,0.15)",  c: T.teal   }] },
    { id: "travel-student",  icon: "🎓", accent: T.blue,   name: "Student Travel",       desc: "Tailored for Indian students abroad. Includes mental health, maternity, sponsor protection.",        tags: [{ l: "Study Abroad",   bg: "rgba(255,90,31,0.15)", c: T.orange}, { l: "Sponsor Cover", bg: "rgba(0,196,140,0.15)",  c: T.teal   }] },
    { id: "travel-schengen", icon: "🇪🇺", accent: T.green, name: "Schengen Travel",      desc: "Mandatory for Schengen visa. 100% protection for all 26 European Schengen countries.",             tags: [{ l: "Visa Mandatory", bg: "rgba(0,168,232,0.15)", c: T.blue  }, { l: "Europe",        bg: "rgba(138,198,66,0.15)", c: T.green  }] },
    { id: "travel-domestic", icon: "🇮🇳", accent: T.orange,name: "Domestic Travel",      desc: "Travel safely within India on air, rail, or road. Covers medical emergencies & baggage loss.",    tags: [{ l: "Within India",   bg: "rgba(255,90,31,0.15)", c: T.orange}, { l: "All Modes",     bg: "rgba(0,196,140,0.15)",  c: T.teal   }] },
  ],
};

const DETAILS = {
  "car-tp": {
    icon:"🛡️", accent:T.orange,
    title:"Third-Party Car Insurance",
    sub:"Legally mandatory under Motor Vehicle Act 1988 · Covers third-party liabilities",
    badges:["Mandatory by Law","Low Premium","Instant Issuance"],
    facts:[{l:"Premium Range",v:"From ₹2,094/yr"},{l:"Validity",v:"1 Year"},{l:"TP Cover",v:"Unlimited"},{l:"PA Cover",v:"₹15 Lakh"}],
    overview:"Mandated by the Motor Vehicle Act 1988, third-party car insurance protects you legally and financially if your vehicle causes injury, death, or property damage to a third party. It does not cover damage to your own vehicle.",
    covered:["Unlimited liability for third-party death/injury claims","Third-party property damage up to ₹7.5 Lakh","Legal costs and court fees from covered incidents","Compulsory personal accident cover for owner-driver"],
    excluded:["Damage to your own vehicle","Vehicle theft","Natural calamity damage to own car","No add-on coverage available with this plan"],
    comparison:{cols:["Coverage","Third-Party","Comprehensive"],rows:[["Own car damage",false,true],["Theft of car",false,true],["Choose own IDV",false,true],["Customized add-ons",false,true],["Third-party injury/death",true,true],["TP property damage",true,true],["PA Cover",true,true]]},
    addons:null,steps:null,
  },
  "car-comp": {
    icon:"⭐", accent:T.green,
    title:"Comprehensive Car Insurance",
    sub:"360° protection — own damage + third-party · Most preferred plan",
    badges:["Most Popular","Full Coverage","Add-ons Available"],
    facts:[{l:"Coverage",v:"Own + TP"},{l:"IDV Choice",v:"Flexible"},{l:"Cashless Garages",v:"5,000+"},{l:"NCB Benefit",v:"Up to 50%"}],
    overview:"Comprehensive insurance is the gold standard in car insurance. It covers both your own vehicle damages AND third-party liabilities — giving you complete 360° protection against accidents, theft, fire, natural calamities, and man-made disasters.",
    covered:["Own car damage from accidents, fire, and theft","Natural calamities: floods, earthquakes, storms, cyclones","Man-made disasters: riots, vandalism, sabotage","Third-party injury, death, and property damage","Personal accident cover for driver","Cashless claims at 5,000+ network garages"],
    excluded:["Driving under alcohol or drugs","No valid driving license","Intentional / fraudulent damage","Mechanical / electrical breakdown","War, nuclear perils"],
    comparison:{cols:["Coverage","Third-Party","Comprehensive"],rows:[["Own car damage",false,true],["Theft",false,true],["IDV of your choice",false,true],["Add-on covers",false,true],["Third-party injury/death",true,true],["TP property damage",true,true],["PA Cover",true,true]]},
    addons:[{name:"Zero Depreciation",desc:"Full part replacement cost — no depreciation deducted."},{name:"Engine Protection",desc:"Covers flood/oil damage not in standard plan."},{name:"Return to Invoice",desc:"Recover full purchase price on total loss or theft."},{name:"Tyre Secure",desc:"Repair/replacement + labour for accidental tyre damage."},{name:"Roadside Assistance",desc:"24/7 breakdown & towing anywhere in India."},{name:"Consumables Cover",desc:"Engine oil, lubricants, oil filters reimbursed."},{name:"Key Protection",desc:"OEM key + lock replacement cost covered."},{name:"PA Cover",desc:"Compensation for disability/death. Passenger cover up to ₹1L."}],
    steps:null,
  },
  "car-od": {
    icon:"🔧", accent:T.blue,
    title:"Standalone Own Damage Car Insurance",
    sub:"Protect your car from damage without TP component · Requires active TP policy",
    badges:["Flexible","Own Damage Only","Pair with TP Policy"],
    facts:[{l:"Requirement",v:"Active TP Policy"},{l:"Covers",v:"Own Damage"},{l:"Theft",v:"Included"},{l:"Add-ons",v:"Available"}],
    overview:"A Standalone Own Damage (OD) policy covers your car against damage from accidents, natural and man-made disasters, fire, and theft. It must be paired with a separately purchased third-party insurance policy.",
    covered:["Collision and rollover damage","Fire and explosion","Natural disasters: floods, earthquakes, storms","Man-made disasters: riots, vandalism","Vehicle theft and burglary","Transit damage by rail, road, or water"],
    excluded:["Third-party liabilities (covered separately by TP policy)","Drink and drive incidents","Driving without valid license","Wear and tear / mechanical breakdown","Illegal vehicle use"],
    comparison:null,addons:null,steps:null,
  },
  "car-addons": {
    icon:"➕", accent:T.teal,
    title:"Car Insurance Add-on Covers",
    sub:"Available only with Comprehensive policy · Extra protection at minimal extra premium",
    badges:["8 Add-ons Available","Comprehensive Only","Customize Your Policy"],
    facts:[{l:"Available with",v:"Comprehensive"},{l:"Zero Dep for",v:"Cars < 5 yrs"},{l:"RTI for",v:"Total Loss"},{l:"RSA",v:"24/7 Pan-India"}],
    overview:"Add-ons extend the coverage of your comprehensive car insurance beyond standard inclusions. They allow you to tailor your policy to your specific needs — paying only for what matters most to you.",
    covered:["Zero Depreciation: full part replacement cost, no depreciation cut","Engine Protection: flood/oil damage beyond standard plan","Return to Invoice: recover full purchase price on total loss","Tyre Secure: repair/replacement + labour for tyre damage","Roadside Assistance: 24/7 breakdown & towing anywhere in India","Consumables Cover: engine oil, lubricants, oil filters reimbursed","Key Protection: OEM key + lock replacement cost covered","PA Cover: bodily injury/disability/death, passenger cover up to ₹1L"],
    excluded:["Add-ons cannot be purchased with Third-Party only policies","Zero Dep usually limited to vehicles under 5 years old","Certain add-ons may have sub-limits per insurer"],
    comparison:null,addons:null,steps:null,
  },
  "bike-tp": {
    icon:"⚖️", accent:T.orange,
    title:"Third-Party Bike Insurance",
    sub:"Legally mandatory under Motor Vehicle Act 1988 · Basic liability for two-wheelers",
    badges:["Mandatory","Lowest Premium","Legal Compliance"],
    facts:[{l:"Type",v:"Liability Only"},{l:"TP Liability",v:"Unlimited"},{l:"Premium",v:"Starts ₹482/yr"},{l:"PA Cover",v:"₹15 Lakh"}],
    overview:"All two-wheelers in India must have at least third-party insurance as mandated by the Motor Vehicles Act 1988. Covers legal obligations if your bike causes injury or property damage to another person.",
    covered:["Death or bodily injury to a third party","Unlimited liability for third-party injury claims","Third-party property damage","Legal fees and court costs from covered incidents","Compulsory personal accident cover for owner-driver"],
    excluded:["Own vehicle damage","Theft of two-wheeler","Natural calamity damage to own bike","No add-on coverage available"],
    comparison:null,addons:null,steps:null,
  },
  "bike-comp": {
    icon:"🏆", accent:T.green,
    title:"Comprehensive Bike Insurance",
    sub:"Complete protection for your two-wheeler + rider + third party",
    badges:["Recommended","360° Cover","NCB Benefits"],
    facts:[{l:"Coverage",v:"Own + TP"},{l:"NCB Benefit",v:"Up to 50%"},{l:"Cashless",v:"Network Garages"},{l:"PA Cover",v:"Included"}],
    overview:"The most complete insurance for your two-wheeler. Covers own vehicle damages (accidents, theft, disasters) AND third-party liabilities. Also includes personal accident cover for the rider.",
    covered:["Own bike damage: accident, fire, theft","Natural disasters: floods, earthquakes, cyclones","Man-made disasters: riots, vandalism","Third-party injury, death and property damage","Personal accident cover for owner-driver","Cashless claim settlement at network garages","No Claim Bonus for claim-free years"],
    excluded:["Riding under influence of intoxicants","Racing, reliability trials, speed tests","Driving without valid license","Use outside India geographical borders","War, nuclear perils"],
    comparison:{cols:["Coverage","Third Party","Comprehensive"],rows:[["Own vehicle damage (OD)",false,true],["Theft & natural calamities",false,true],["Add-on covers available",false,true],["Mandatory by law",true,"No"],["Third-party liability",true,true],["Own injury + death cover",false,true]]},
    addons:null,steps:null,
  },
  "bike-od": {
    icon:"🔩", accent:T.blue,
    title:"Standalone Own Damage – Two-Wheeler",
    sub:"Protect your bike from damage · Must have active TP policy",
    badges:["Flexible","Pairs with TP","Theft Covered"],
    facts:[{l:"Requirement",v:"Active TP Policy"},{l:"Covers",v:"Own Damage"},{l:"Theft",v:"Yes"},{l:"Add-ons",v:"Available"}],
    overview:"The Standalone Own Damage Bike Insurance Policy provides financial protection for your two-wheeler against damages from accidents, natural and man-made disasters, and theft. Requires a running third-party policy.",
    covered:["Accident damage to your two-wheeler","Natural disaster damage: floods, earthquakes, storms","Man-made disaster damage: riots, vandalism","Fire and explosion damage","Theft and burglary of the bike"],
    excluded:["Third-party liabilities","Drink and drive incidents","No valid driving license","Racing or speed tests","Private bike used for commercial purposes"],
    comparison:null,addons:null,steps:null,
  },
  "bike-addons": {
    icon:"🌟", accent:T.teal,
    title:"Two-Wheeler Insurance Add-ons",
    sub:"Supercharge your comprehensive bike policy with targeted extra covers",
    badges:["9 Add-ons Available","Comprehensive Only","Flexible Pick"],
    facts:[{l:"Available with",v:"Comprehensive"},{l:"Zero Dep",v:"Full cost"},{l:"RSA",v:"24/7"},{l:"NCB Protect",v:"After Claim"}],
    overview:"Add-ons are supplementary coverage benefits you can add to your comprehensive two-wheeler policy at an extra premium. Choose only the covers you actually need.",
    covered:["Zero Depreciation: full repair cost, no depreciation cut","NCB Protection: keep no-claim bonus even after a claim","Roadside Assistance: 24/7 on-road help, towing, fuel delivery","Accessories Cover: electrical/non-electrical accessories fitted","Consumables Cover: engine oil, lubricants, filters reimbursed","Emergency Medical Expenses: you and pillion rider hospital bills","Return to Invoice: recover original invoice value on total loss","Personal Belongings: helmet stolen or damaged covered","PA Cover: compensation for bodily injury, disability, or death"],
    excluded:["Add-ons only with Comprehensive — not Third-Party","Some add-ons have bike age or model restrictions"],
    comparison:null,addons:null,steps:null,
  },
  "health-indiv": {
    icon:"👤", accent:T.red,
    title:"Individual Health Insurance",
    sub:"Dedicated health cover for a single person — complete medical protection",
    badges:["Tax Benefit 80D","Cashless Claims","COVID Covered"],
    facts:[{l:"Entry Age",v:"18–65 yrs"},{l:"Sum Insured",v:"₹3L–1Cr"},{l:"Pre-Hosp",v:"30 days"},{l:"Post-Hosp",v:"60 days"}],
    overview:"Individual health insurance plans cover a single person against hospitalisation costs, daycare procedures, critical illnesses, and more. Since the cover is for one person only, the full sum insured is available exclusively for them.",
    covered:["Pre and post-hospitalization expenses (30 & 60 days)","Cashless claims at network hospitals nationwide","Doctor fees, room charges, diagnostic tests, medicine costs","Critical illness and daycare procedure coverage","COVID-19 treatment fully covered (IRDAI mandate)","No Claim Bonus — sum insured increases or premium reduces","Tax deduction under Section 80D — up to ₹25,000/year","Pre-existing diseases covered after waiting period (2–4 yrs)"],
    excluded:["Pre-existing illnesses during waiting period","Congenital diseases","Cosmetic surgery and beauty treatments","Dental procedures (most plans)","HIV/AIDS treatment","Injuries from war, riots, or self-harm"],
    comparison:null,addons:null,
    steps:[{title:"Inform Insurer",desc:"Call the toll-free number and fill the pre-authorization form before planned hospitalization (3–4 days prior). Emergency: within 24 hours."},{title:"Admit to Network Hospital",desc:"Go to an insurer network hospital — cashless claims are ONLY available at network hospitals. Show your health card and valid ID."},{title:"Authorization Approval",desc:"Insurer approves the cashless claim. Pay only deductibles, copayments, or non-admissible expenses directly to hospital."},{title:"Discharge & Settlement",desc:"Hospital sends original claim documents to insurer post-discharge. Insurer settles payment to hospital per policy terms."}],
  },
  "health-family": {
    icon:"👨‍👩‍👧", accent:T.orange,
    title:"Family Health Insurance (Floater)",
    sub:"One policy, complete protection for your entire family",
    badges:["Family Floater","~20% Premium Savings","Up to 17 Members"],
    facts:[{l:"Entry Age",v:"18–65 yrs"},{l:"Children",v:"From 91 days"},{l:"Members",v:"Up to 17 relations"},{l:"Renewal",v:"Lifetime"}],
    overview:"A Family Floater plan covers the policyholder, spouse, children, and parents under one policy. The total sum insured is shared — any member who is hospitalized can use the entire sum insured. Typically 20% cheaper than separate individual plans.",
    covered:["All family members under a single policy","Shared sum insured — one member can use full cover if needed","Cumulative Bonus: sum insured grows 10–50% per claim-free year","Addition/deletion of family members at any time","COVID-19 treatment covered as per IRDAI mandate","All standard health benefits: hospitalization, daycare, critical illness","Tax benefits under 80D for policyholder and parents"],
    excluded:["Pre-existing illnesses during waiting period (2–4 years)","Dental procedures (most plans)","Cosmetic and plastic surgery","HIV/AIDS treatment","Injuries from war, riots, or self-harm"],
    comparison:{cols:["Feature","Family Floater","Individual Plan"],rows:[["Who is covered","Entire family","One person only"],["Sum insured","Higher, shared","Lower, individual"],["Premium","~20% lower","Per person"],["Premium basis","Eldest member age","Insured age"],["Multiple claims/year","Shared pool","Full SI available"]]},
    addons:null,
    steps:[{title:"Cashless Claim",desc:"Inform insurer → fill pre-auth form → admit to network hospital → show health card → insurer approves → discharge with final auth letter."},{title:"Reimbursement Claim",desc:"Inform insurer → get treated at any hospital → pay bills yourself → collect originals → submit to insurer → amount credited to bank account."}],
  },
  "health-covid": {
    icon:"🦠", accent:T.teal,
    title:"COVID-19 Health Insurance Plans",
    sub:"IRDAI-approved plans — Corona Kavach & Corona Rakshak",
    badges:["IRDAI Approved","Home Quarantine","No Deductibles"],
    facts:[{l:"Corona Rakshak",v:"Fixed Benefit"},{l:"Corona Kavach",v:"Indemnity"},{l:"Min Hospitalization",v:"3 days (Rakshak)"},{l:"Consumables",v:"Kavach only"}],
    overview:"All existing health insurance policies in India cover COVID-19 hospitalization as per IRDAI guidelines. Two special plans — Corona Rakshak and Corona Kavach — were also introduced for complete COVID protection including home quarantine.",
    covered:["Corona Rakshak: full sum insured paid as lump sum on hospitalization for 3+ days with COVID","Corona Kavach: actual hospitalization costs reimbursed (indemnity basis)","Home quarantine treatment expenses under Kavach","No deductibles or sub-limits under Corona Kavach","Consumables covered under Kavach (unlike standard plans)"],
    excluded:["Corona Rakshak: hospitalization under 3 days not covered","Non-COVID treatments under COVID-specific plans","Consumables not covered under Rakshak"],
    comparison:{cols:["Feature","Corona Rakshak","Corona Kavach"],rows:[["Plan Type","Fixed Benefit","Indemnity"],["Payout","Lump Sum","Actual Expenses"],["Trigger","3+ days hospitalization","Hospitalization/Home quarantine"],["Consumables","Not covered","Covered"],["Deductibles","Nil","Nil"],["Home Quarantine","Not covered","Covered"]]},
    addons:null,steps:null,
  },
  "health-claims": {
    icon:"📋", accent:T.green,
    title:"Health Insurance Claims Guide",
    sub:"Everything you need to know for smooth, timely claim settlement",
    badges:["Step-by-Step","Cashless & Reimbursement","Document Checklist"],
    facts:[{l:"Pre-auth Lead Time",v:"3–4 days"},{l:"Emergency",v:"Within 24 hrs"},{l:"Cashless",v:"Network Hospitals"},{l:"Reimbursement",v:"Any Hospital"}],
    overview:"Knowing your claims process in advance ensures you get the right settlement at the right time. Complete guide for both cashless (at network hospitals) and reimbursement (at any hospital) claim types.",
    covered:["Cashless: 6-step process — inform → pre-auth → admit → approve → discharge → settlement","Reimbursement: 4-step process — inform → treat → pay → submit docs → credited to account","Duly filled claim form + original discharge summary","Original hospital bills with detailed cost break-up","All investigation, lab, and diagnostic reports (original)","Photo identity + health card + KYC documents"],
    excluded:["Consumables and excluded items even in cashless claims","Expenses not covered under policy terms"],
    comparison:null,addons:null,
    steps:[{title:"Inform Insurer Immediately",desc:"Call the toll-free number on your health card. For planned hospitalization, submit pre-auth form 3–4 days in advance. For emergencies, within 24 hours."},{title:"Choose the Right Hospital",desc:"For cashless — go to a network hospital only. For reimbursement — any hospital of your choice, then claim later."},{title:"Show Your Insurance Card",desc:"At admission, present your health insurance card and valid photo ID. The hospital will coordinate with the insurer for cashless authorization."},{title:"Insurer Approves Claim",desc:"The insurer reviews and approves the pre-auth. Any inadmissible items (consumables, deductibles) must be paid by you directly."},{title:"Discharge & Document Collection",desc:"Collect all original bills, discharge summary, reports, and pharmacy bills. For reimbursement, submit to insurer within stipulated period."},{title:"Settlement",desc:"Cashless: insurer pays hospital directly. Reimbursement: approved amount credited to your registered bank account per policy terms."}],
  },
  "travel-intl": {
    icon:"🌍", accent:T.teal,
    title:"International Travel Insurance",
    sub:"Complete overseas protection for individuals and families aged 6 months to 80 years",
    badges:["Medical Cover","Baggage Loss","Trip Cancellation","Flight Delay"],
    facts:[{l:"Age Range",v:"6 months – 80 yrs"},{l:"Medical Limit",v:"Up to $500,000"},{l:"Baggage Loss",v:"Covered"},{l:"Flight Delay",v:"12+ hours"}],
    overview:"Medical expenses abroad can be 5–7× higher than India. International travel insurance protects you from medical emergencies, baggage loss, flight delays, trip cancellations, and more — complete peace of mind anywhere in the world.",
    covered:["Overseas emergency medical expenses (accident + illness)","Medical evacuation and repatriation of mortal remains","Loss, theft, or delay of checked-in baggage","Trip cancellation and interruption reimbursement","Loss of passport and travel documents","Flight delay compensation (beyond 12 hours)","Personal liability and legal costs abroad","Compassionate family visit if hospitalized overseas"],
    excluded:["Cosmetic surgery and beauty treatments","Self-inflicted injuries, alcohol/drug-related incidents","Military, naval, or air force operations","Unproven or experimental treatments","Non-allopathic treatments (homeopathy, ayurveda, unani)"],
    comparison:null,addons:null,
    steps:[{title:"Cashless Abroad",desc:"Call the TPA/Assistance Company number. Request pre-authorization. Hospital sends coverage verification to insurer. Pay deductibles at discharge. Insurer settles with hospital."},{title:"Reimbursement in India",desc:"Inform insurer/TPA about the claim. Submit claim form + supporting documents (bills, passport, boarding pass, police report if applicable). Insurer verifies and credits approved amount."}],
  },
  "travel-student": {
    icon:"🎓", accent:T.blue,
    title:"Student Travel Insurance",
    sub:"Tailored for Indian students going abroad for higher education",
    badges:["Study Abroad","Sponsor Protection","Mental Health Cover"],
    facts:[{l:"Target",v:"Indian Students"},{l:"Sponsor Cover",v:"Included"},{l:"Mental Health",v:"Covered"},{l:"Compassionate Visit",v:"2-way ticket"}],
    overview:"Student travel insurance is a specialized plan for Indian students traveling abroad for higher education. Includes all standard international travel benefits plus additional covers unique to students.",
    covered:["All standard international travel benefits included","Mental health disorder coverage (unique to student plans)","Maternity coverage","Sponsor protection — if sponsor loses ability to fund education","Study interruption coverage — unexpected return to India","Bail bond coverage","Two-way compassionate visit for student or family member","Emergency medical evacuation and repatriation"],
    excluded:["Pre-existing conditions (unless declared and accepted)","Self-harm, substance abuse","Elective/cosmetic procedures","Non-allopathic treatments"],
    comparison:null,addons:null,steps:null,
  },
  "travel-schengen": {
    icon:"🇪🇺", accent:T.green,
    title:"Schengen Travel Insurance",
    sub:"Mandatory for Schengen visa · Valid for all 26 European countries",
    badges:["Visa Mandatory","Europe Coverage","Min €30,000 Cover"],
    facts:[{l:"Countries",v:"26 Schengen"},{l:"Min Medical",v:"€30,000"},{l:"Mandatory",v:"Yes (Visa)"},{l:"Validity",v:"Trip Duration"}],
    overview:"Schengen travel insurance is mandatory for obtaining a Schengen visa. It ensures you have minimum required medical coverage of €30,000 and other protections while visiting any of the 26 Schengen zone countries in Europe.",
    covered:["Emergency medical expenses (minimum €30,000 cover)","Loss of passport and travel documents","Delay in check-in baggage arrival","Loss of check-in baggage","Personal liability cover","Personal accident cover","Accidental death and dismemberment (common carrier)","Valid for all 26 Schengen countries"],
    excluded:["Elective medical procedures","Pre-existing conditions (unless declared)","Self-inflicted injuries","Non-emergency dental (usually sub-limited)"],
    comparison:null,addons:null,steps:null,
  },
  "travel-domestic": {
    icon:"🇮🇳", accent:T.orange,
    title:"Domestic Travel Insurance",
    sub:"Travel safely within India on air, rail, and road",
    badges:["Within India","Air / Rail / Road","Personal Accident"],
    facts:[{l:"Coverage",v:"Within India"},{l:"Transport",v:"Air, Rail, Road"},{l:"Baggage",v:"Covered"},{l:"Medical",v:"Included"}],
    overview:"Domestic travel insurance protects you during travel within India across all modes of transport — air, rail, and road. It covers unforeseen emergencies so you can journey across the country with confidence.",
    covered:["Medical cover for emergencies while traveling within India","Loss of checked-in baggage","Personal accident cover for injuries during travel","Flight delay compensation","Trip cancellation and interruption","Common carrier personal accident and death cover"],
    excluded:["International travel not covered","Pre-existing conditions","Self-inflicted injuries","Travel for illegal purposes"],
    comparison:null,addons:null,
    steps:[{title:"Report Claim",desc:"Contact insurer/TPA immediately after the incident. Collect documentary evidence: bills, boarding pass, FIR (if applicable), baggage receipts."},{title:"Submit Documents",desc:"Fill and submit the claim form with all supporting documents: medical bills, receipts, police report if theft, baggage claim receipts."},{title:"Verification & Settlement",desc:"Insurer reviews and approves. Reimbursement credited to your bank account within the TAT specified in your policy."}],
  },
};

// ═══════════════════════════════════════════════════════════════
//  MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════════
function GreenBtn({ children, onClick, style: extra = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.green : "transparent", color: hov ? "#000" : T.green, border: `1.5px solid ${T.green}`, borderRadius: 20, padding: "9px 22px", fontFamily: "Gotham,'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap", ...extra }}>
      {children}
    </button>
  );
}

function BackBtn({ onClick, label = "← Back" }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "none", border: `1.5px solid ${hov ? T.green : T.border}`, padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: "0.83rem", fontWeight: 600, color: hov ? T.green : T.muted, cursor: "pointer", marginBottom: 14, transition: "all .15s" }}>
      {label}
    </button>
  );
}

function Tag({ l, bg, c }) {
  return <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: bg, color: c, letterSpacing: "0.02em" }}>{l}</span>;
}

// ═══════════════════════════════════════════════════════════════
//  HERO
// ═══════════════════════════════════════════════════════════════
const STATS = [{ num: "50+", label: "Insurer Partners" }, { num: "10L+", label: "Happy Customers" }, { num: "₹500Cr+", label: "Claims Settled" }, { num: "4.8★", label: "Customer Rating" }];

function Hero() {
  return (
    <div style={{ background: "linear-gradient(135deg,#000 0%,#0b1600 55%,#060e00 100%)", padding: "64px 24px 90px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 350, background: "radial-gradient(ellipse,rgba(138,198,66,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 60, background: T.bg, clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(138,198,66,0.1)", color: T.green, padding: "6px 16px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20, border: `1px solid rgba(138,198,66,0.25)` }}>
          🛡️ Trusted Insurance Marketplace
        </div>
        <h1 style={{ fontFamily: "Gotham,'DM Sans',sans-serif", fontSize: "clamp(1.85rem,4.5vw,3rem)", fontWeight: 800, color: T.white, lineHeight: 1.16, marginBottom: 14 }}>
          Insurance Made <span style={{ color: T.green }}>Simple &amp; Smart</span>
        </h1>
        <p style={{ color: T.textSub, fontSize: "1rem", marginBottom: 42, maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
          Compare plans from 50+ insurers. Buy or renew in minutes. Get the best protection at the best price — only at CoverKraft.
        </p>
        <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "Gotham,sans-serif", fontSize: "1.7rem", fontWeight: 800, color: T.green }}>{s.num}</div>
              <div style={{ fontSize: "0.7rem", color: T.muted, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HOME GRID
// ═══════════════════════════════════════════════════════════════
function HomeGrid({ onSelect }) {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
      <div style={{ padding: "48px 0 26px" }}>
        <h2 style={{ fontFamily: "Gotham,sans-serif", fontSize: "1.5rem", fontWeight: 800, color: T.white, marginBottom: 6 }}>What would you like to insure?</h2>
        <p style={{ color: T.muted, fontSize: "0.87rem" }}>Browse by category to compare plans and get the best coverage for your needs</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
        {CATEGORIES.map((cat) => <CatBlock key={cat.key} cat={cat} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

function CatBlock({ cat, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onSelect(cat.key)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.cardHov : T.card, borderRadius: 14, border: `1.5px solid ${hov ? cat.color : T.border}`, padding: 24, cursor: "pointer", transition: "all .2s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? `0 14px 40px rgba(0,0,0,0.55),0 0 0 1px ${cat.color}22` : "0 2px 10px rgba(0,0,0,0.3)" }}>
      <div style={{ width: 36, height: 3, background: cat.color, borderRadius: 2, marginBottom: 18 }} />
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>{cat.icon}</div>
      <h3 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.97rem", fontWeight: 700, color: T.white, marginBottom: 6 }}>{cat.label}</h3>
      <p style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.55, marginBottom: 14 }}>{cat.desc}</p>
      <div style={{ fontSize: "0.77rem", fontWeight: 700, color: cat.color }}>Explore Plans →</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PRODUCT LIST
// ═══════════════════════════════════════════════════════════════
function ProductList({ activeCat, onChangeCat, onViewDetail, onBack }) {
  const cat = CATEGORIES.find((c) => c.key === activeCat);
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 80px" }}>
      <BackBtn onClick={onBack} label="← Back to Home" />
      <div style={{ marginBottom: 6 }}>
        <h2 style={{ fontFamily: "Gotham,sans-serif", fontSize: "1.5rem", fontWeight: 800, color: T.white }}>{cat.title}</h2>
        <p style={{ color: T.muted, fontSize: "0.87rem", marginTop: 4 }}>{cat.sub}</p>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0 28px" }}>
        {CATEGORIES.map((c) => {
          const active = c.key === activeCat;
          return (
            <button key={c.key} onClick={() => onChangeCat(c.key)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 50, border: `1.5px solid ${active ? T.green : T.border}`, background: active ? T.green : "transparent", fontFamily: "inherit", fontSize: "0.84rem", fontWeight: 600, color: active ? "#000" : T.muted, cursor: "pointer", transition: "all .15s" }}>
              {c.icon} {c.label}
            </button>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 }}>
        {PRODUCTS[activeCat].map((p) => <ProductCard key={p.id} product={p} onViewDetail={onViewDetail} />)}
      </div>
    </div>
  );
}

function ProductCard({ product, onViewDetail }) {
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  return (
    <div onClick={() => onViewDetail(product.id)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.cardHov : T.card, borderRadius: 14, border: `1.5px solid ${hov ? product.accent : T.border}`, padding: "22px 22px 18px", cursor: "pointer", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "all .2s", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.6)" : "0 2px 12px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: product.accent, transform: hov ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform .25s" }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: `${product.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.45rem", flexShrink: 0, border: `1px solid ${product.accent}30` }}>{product.icon}</div>
        <div>
          <h3 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.93rem", fontWeight: 700, color: T.white, marginBottom: 5 }}>{product.name}</h3>
          <p style={{ fontSize: "0.77rem", color: T.textSub, lineHeight: 1.55 }}>{product.desc}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {product.tags.map((t) => <Tag key={t.l} {...t} />)}
      </div>
      <button onMouseEnter={() => setBtnHov(true)} onMouseLeave={() => setBtnHov(false)}
        style={{ marginTop: "auto", width: "100%", border: `1.5px solid ${btnHov ? product.accent : T.border}`, background: btnHov ? `${product.accent}18` : "transparent", color: btnHov ? product.accent : T.muted, padding: 10, borderRadius: 9, fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
        View Full Details →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════════
function DCard({ title, accent, children }) {
  return (
    <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, padding: 22, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent }} />
      <h3 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.9rem", fontWeight: 700, color: T.white, marginBottom: 14, paddingLeft: 14 }}>{title}</h3>
      <div style={{ paddingLeft: 14 }}>{children}</div>
    </div>
  );
}

function ListRow({ text, type, last }) {
  const g = type === "green";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: last ? "none" : `1px solid ${T.border}`, fontSize: "0.84rem", color: T.text, lineHeight: 1.6 }}>
      <span style={{ flexShrink: 0, marginTop: 2, fontSize: "0.78rem", color: g ? T.green : T.danger, fontWeight: 800 }}>{g ? "✓" : "✗"}</span>
      {text}
    </div>
  );
}

function CmpTable({ comparison, accent }) {
  const { cols, rows } = comparison;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
        <thead>
          <tr>{cols.map((c, i) => <th key={c} style={{ padding: "10px 14px", background: T.surface, color: i === 0 ? T.muted : T.green, fontWeight: 700, textAlign: "left", borderBottom: `2px solid ${accent}` }}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : T.surface }}>
              {row.map((cell, j) => {
                const s = { padding: "10px 14px", borderBottom: `1px solid ${T.border}` };
                if (j === 0) return <td key={j} style={{ ...s, color: T.muted }}>{cell}</td>;
                if (cell === true)  return <td key={j} style={s}><span style={{ color: T.green,  fontWeight: 800 }}>✓ Yes</span></td>;
                if (cell === false) return <td key={j} style={s}><span style={{ color: T.danger, fontWeight: 800 }}>✗ No</span></td>;
                return <td key={j} style={{ ...s, color: T.text }}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TalkBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => window.open("https://www.thecoverkraft.com","_blank")}
      style={{ width: "100%", background: hov ? T.green : "transparent", color: hov ? "#000" : T.green, border: `1.5px solid ${T.green}`, padding: 10, borderRadius: 9, fontFamily: "inherit", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", transition: "all .2s" }}>
      📞 Talk to an Expert
    </button>
  );
}

function ProductDetail({ productId, onBack }) {
  const d = DETAILS[productId];
  if (!d) return null;
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 80px" }}>
      <BackBtn onClick={onBack} label="← Back to Products" />
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0d1a00,#000)", borderRadius: 16, padding: "30px 34px", marginBottom: 22, border: `1px solid ${d.accent}30`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${d.accent},${d.accent}55)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: 15, background: `${d.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.9rem", flexShrink: 0, border: `1px solid ${d.accent}40` }}>{d.icon}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontFamily: "Gotham,sans-serif", fontSize: "clamp(1.15rem,3vw,1.7rem)", fontWeight: 800, color: T.white, marginBottom: 5 }}>{d.title}</h1>
            <p style={{ color: T.textSub, fontSize: "0.87rem", lineHeight: 1.6 }}>{d.sub}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
              {d.badges.map((b) => <span key={b} style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, background: `${d.accent}18`, color: d.accent, border: `1px solid ${d.accent}30` }}>{b}</span>)}
            </div>
          </div>
        </div>
      </div>
      {/* 2-column */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 18, alignItems: "start" }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DCard title="Overview" accent={d.accent}><p style={{ fontSize: "0.86rem", color: T.text, lineHeight: 1.75 }}>{d.overview}</p></DCard>
          <DCard title="What's Covered ✓" accent={d.accent}>{d.covered.map((x, i) => <ListRow key={i} text={x} type="green" last={i === d.covered.length - 1} />)}</DCard>
          <DCard title="What's NOT Covered ✗" accent={d.accent}>{d.excluded.map((x, i) => <ListRow key={i} text={x} type="red" last={i === d.excluded.length - 1} />)}</DCard>
          {d.comparison && <DCard title="Plan Comparison" accent={d.accent}><CmpTable comparison={d.comparison} accent={d.accent} /></DCard>}
          {d.addons && (
            <DCard title="Available Add-ons" accent={d.accent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {d.addons.map((a) => (
                  <div key={a.name} style={{ background: T.surface, borderRadius: 10, padding: "11px 13px", border: `1px solid ${T.border}` }}>
                    <h4 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.78rem", fontWeight: 700, color: T.green, marginBottom: 4 }}>{a.name}</h4>
                    <p style={{ fontSize: "0.73rem", color: T.textSub, lineHeight: 1.5 }}>{a.desc}</p>
                  </div>
                ))}
              </div>
            </DCard>
          )}
          {d.steps && (
            <DCard title="Claims Process" accent={d.accent}>
              {d.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: i < d.steps.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ flexShrink: 0, width: 27, height: 27, borderRadius: "50%", background: T.green, color: "#000", fontSize: "0.78rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{i + 1}</div>
                  <p style={{ fontSize: "0.84rem", color: T.text, lineHeight: 1.65 }}><strong style={{ color: T.white }}>{step.title}: </strong>{step.desc}</p>
                </div>
              ))}
            </DCard>
          )}
        </div>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg,#0c1900,#182800)", borderRadius: 14, padding: 20, border: `1.5px solid rgba(138,198,66,0.3)` }}>
            <div style={{ color: T.green, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>🛡️ Best Price Guarantee</div>
            <h3 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.97rem", fontWeight: 800, color: T.white, marginBottom: 6 }}>Get Your Best Quote</h3>
            <p style={{ color: T.textSub, fontSize: "0.78rem", marginBottom: 16, lineHeight: 1.55 }}>Compare rates from 20+ insurers. Instant policy issuance. Guaranteed best price.</p>
            <GreenBtn onClick={() => window.open("https://www.thecoverkraft.com","_blank")} style={{ width: "100%", borderRadius: 10, padding: "11px 0", fontSize: "0.86rem", textAlign: "center" }}>
              Buy Now at TheCoverKraft →
            </GreenBtn>
          </div>
          {/* Quick Facts */}
          <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 3, height: 15, background: T.green, borderRadius: 2 }} />
              <h3 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.83rem", fontWeight: 700, color: T.white }}>Quick Facts</h3>
            </div>
            {d.facts.map((f, i) => (
              <div key={f.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < d.facts.length - 1 ? `1px solid ${T.border}` : "none", fontSize: "0.8rem" }}>
                <span style={{ color: T.muted }}>{f.l}</span>
                <span style={{ fontWeight: 700, color: T.green }}>{f.v}</span>
              </div>
            ))}
          </div>
          {/* Expert */}
          <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 3, height: 15, background: T.green, borderRadius: 2 }} />
              <h3 style={{ fontFamily: "Gotham,sans-serif", fontSize: "0.83rem", fontWeight: 700, color: T.white }}>Need Help?</h3>
            </div>
            <p style={{ fontSize: "0.77rem", color: T.textSub, marginBottom: 14, lineHeight: 1.55 }}>Our insurance experts are available 9am–9pm, 7 days a week.</p>
            <TalkBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT — export and use as:
//    <Route path="/products" element={<InsurancePage />} />
// ═══════════════════════════════════════════════════════════════
function InsurancePage() {
  const [view, setView]               = useState("home");
  const [activeCat, setActiveCat]     = useState("car");
  const [activeProductId, setActiveProductId] = useState(null);

  const scroll = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goHome   = useCallback(() => { setView("home");   scroll(); }, []);
  const goList   = useCallback((cat) => { setActiveCat(cat); setView("list");   scroll(); }, []);
  const goDetail = useCallback((id)  => { setActiveProductId(id); setView("detail"); scroll(); }, []);
  const backList = useCallback(() => { setView("list");   scroll(); }, []);

  return (
    <div style={{ fontFamily: "Gotham,'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
      {view === "home" && <><Hero /><HomeGrid onSelect={goList} /></>}
      {view === "list" && <ProductList activeCat={activeCat} onChangeCat={setActiveCat} onViewDetail={goDetail} onBack={goHome} />}
      {view === "detail" && <ProductDetail productId={activeProductId} onBack={backList} />}
    </div>
  );
}

export default InsurancePage;