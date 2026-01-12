import React, { useState } from 'react';
import './App.css';
function App() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [displayData, setDisplayData] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisplayData(formData);
  };
  return (
    <div className="main-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>User Form</h2>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email ID" onChange={handleChange} required />
        <button type="submit">Submit Details</button>
      </form>
      {displayData && (
        <div className="result-card">
          <h3>Submitted Info:</h3>
          <p><strong>Name:</strong> {displayData.name}</p>
          <p><strong>Phone:</strong> {displayData.phone}</p>
          <p><strong>Email:</strong> {displayData.email}</p>
        </div>
      )}
    </div>
  );
}
export default App;