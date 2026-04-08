import React from "react";
import { useParams } from "react-router-dom";
import InsuranceCategoryPage from "./InsuranceCategoryPage";
import ProductDetail from "./ProductDetail";

// ─── CATEGORY SLUGS ───────────────────────────────────────────
// These are the 4 "View All" landing pages
const CATEGORY_SLUGS = new Set(["car", "bike", "health", "travel"]);

// ─── SMART ROUTER ─────────────────────────────────────────────
// Single route: <Route path="/products/:slug" element={<ProductsRouter />} />
// Also add:     <Route path="/products"        element={<InsuranceCategoryPage defaultCategory="car" />} />
//
// How it works:
//   /products/car              → InsuranceCategoryPage (tab: car)
//   /products/bike             → InsuranceCategoryPage (tab: bike)
//   /products/health           → InsuranceCategoryPage (tab: health)
//   /products/travel           → InsuranceCategoryPage (tab: travel)
//   /products/car-third-party  → ProductDetail
//   /products/bike-comprehensive → ProductDetail
//   ... all other slugs        → ProductDetail

export default function ProductsRouter() {
  const { slug } = useParams();

  if (CATEGORY_SLUGS.has(slug)) {
    // e.g. /products/car  →  show category listing with that tab active
    return <InsuranceCategoryPage defaultCategory={slug} />;
  }

  // e.g. /products/car-third-party  →  show product detail page
  return <ProductDetail />;
}
