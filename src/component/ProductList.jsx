import React from "react";
import { CATEGORIES, PRODUCTS } from "../data/insuranceData";
import ProductCard from "./ProductCard";
import "../styles/InsurancePortal.css";

const TABS = [
  { key: "car",    label: "🚗 Car Insurance" },
  { key: "bike",   label: "🏍️ Two-Wheeler" },
  { key: "health", label: "❤️ Health Insurance" },
  { key: "travel", label: "✈️ Travel Insurance" },
];

function ProductList({ activeCat, onChangeCategory, onViewDetail, onBack }) {
  const cat = CATEGORIES[activeCat];
  const products = PRODUCTS[activeCat];

  return (
    <div className="ck-section">
      <button className="ck-back-btn" onClick={onBack}>
        ← Back to Home
      </button>

      <div className="ck-list-header">
        <h2>{cat.title}</h2>
        <p>{cat.sub}</p>
      </div>

      {/* Category Tabs */}
      <div className="ck-cat-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`ck-tab-btn${activeCat === tab.key ? " active" : ""}`}
            onClick={() => onChangeCategory(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="ck-prod-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
