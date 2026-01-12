import React, { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
    <div className="app-container">
      <div className="content">
        <h1>{isDark ? 'Dark Mode' : 'Light Mode'}</h1>
        <button onClick={() => setIsDark(prev => !prev)}>
          Switch Theme
        </button>
      </div>
    </div>
  );
}
export default App;
