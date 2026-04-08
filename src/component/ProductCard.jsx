import React from "react";
import "../styles/InsurancePortal.css";

function ProductCard({ product, onViewDetail }) {
  return (
    <div className="ck-prod-card" onClick={() => onViewDetail(product.id)}>
      <div className="ck-pc-top">
        <div className={`ck-pc-icon ck-ic-${product.colorClass}`}>
          {product.icon}
        </div>
        <div className="ck-pc-info">
          <h3>{product.name}</h3>
          <p>{product.desc}</p>
        </div>
      </div>

      <div className="ck-pc-tags">
        {product.tags.map((tag) => (
          <span key={tag.label} className={`ck-tag ck-tag-${tag.color}`}>
            {tag.label}
          </span>
        ))}
      </div>

      <button className="ck-pc-cta">
        View Full Details <span>→</span>
      </button>
    </div>
  );
}

export default ProductCard;
