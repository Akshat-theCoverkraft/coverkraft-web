import React from "react";
import { CATEGORIES, PRODUCTS } from "../data/insuranceData";
import "../styles/InsurancePortal.css";

function InsuranceHome({ onSelectCategory }) {
  return (
    <div className="ck-section">
      <div className="ck-home-header">
        <h2>What would you like to insure?</h2>
        <p>Browse by category to compare plans and get the best coverage for your needs</p>
      </div>
      <div className="ck-cats-grid">
        {Object.values(CATEGORIES).map((cat) => (
          <div
            key={cat.key}
            className="ck-cat-block"
            onClick={() => onSelectCategory(cat.key)}
          >
            <div className="ck-cat-icon">{cat.icon}</div>
            <h3>{cat.label}</h3>
            <p>{cat.sub}</p>
            <div className="ck-cat-count">
              {PRODUCTS[cat.key].length} Plans → Explore
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsuranceHome;
