import React from "react";
import "../styles/InsurancePortal.css";

const STATS = [
  { num: "50+",    label: "Insurer Partners" },
  { num: "10L+",   label: "Happy Customers" },
  { num: "₹500Cr+",label: "Claims Settled" },
  { num: "4.8★",   label: "Customer Rating" },
];

function InsuranceHero() {
  return (
    <div className="ck-hero">
      <div className="ck-hero-tag">🛡️ Trusted Insurance Marketplace</div>
      <h1>
        Insurance Made <em>Simple &amp; Smart</em>
      </h1>
      <p>
        Compare plans from 50+ insurers. Buy or renew in minutes. Get the best
        protection at the best price.
      </p>
      <div className="ck-hero-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="hs-num">{s.num}</div>
            <div className="hs-lbl">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsuranceHero;
