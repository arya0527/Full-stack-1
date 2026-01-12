import React from "react";
import ReactDOM from "react-dom/client";
import ProductCard from "./App.jsx";
import "./App.css";

function App() {
  const products = [
    { name: "Wireless Mouse", price: "$25.99", stock: "In Stock" },
    { name: "Keyboard", price: "$45.5", stock: "Out of Stock" },
    { name: "Monitor", price: "$199.99", stock: "In Stock" }
  ];

  return (
    <div className="app-container">
      <h1 className="heading">Products List</h1>
      <div className="product-list">
        {products.map((item, index) => (
          <ProductCard
            key={index}
            name={item.name}
            price={item.price}
            stock={item.stock}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
