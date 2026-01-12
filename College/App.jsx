// src/Components/ProductCard.jsx
import React from "react";
import "../App.css"; // to use shared styles

function ProductCard({ name, price, stock }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Price: {price}</p>
      <p>Status: {stock}</p>
    </div>
  );
}

export default ProductCard;
