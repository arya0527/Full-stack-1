import React, { useState } from 'react'; // === ADDED 'useState' ===
import { Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // === ADDED 'useNavigate', 'useSearchParams' ===
import HomePage from './pages/Homepage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailPage from './pages/ItemDetailPage';
import SearchPage from './pages/SearchPage.jsx'; // === ADDED ===
import LightRays from './components/LightRays.jsx';
import PillNav from './components/PillNav.jsx';
import ClickSpark from './components/ClickSpark.jsx';

import './components/Search.css'; // === ADDED: Import your CSS to style the form ===

import logo from './assets/logo.png';
const logoUrl = logo;

// === ADDED: A new component for your search form ===
// This form uses your Search.css styles and navigates to your SearchPage.jsx
function SearchForm() {
  // Get 'q' from URL to pre-fill the input (optional but good)
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to your search page with the query
      navigate(`/search?q=${query.trim()}`);
    }
  };

  return (
    // We add some padding so it's not stuck to the nav
    <div style={{ padding: '0 20px 20px 20px', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

function MainLayout({ children }) {
  const location = useLocation();

  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background Light Rays */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 0,
        }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ff0d00"
          raysSpeed={1.5}
          lightSpread={2}
          rayLength={2.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PillNav
          logo={logoUrl}
          logoAlt="Company Logo"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search', href: '/search' },
            { label: 'All', href: '/browse' },
          ]}
          activeHref="/"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#120b0bff"
          pillColor="#ffffffff"
          hoveredPillTextColor="#7c0101ff"
          pillTextColor="#000000"
        />

        {/* === ADDED: The search form is now part of the MainLayout === */}
        <SearchForm />

        {/* ClickSpark wraps the interactive area so clicks anywhere show sparks */}
        <ClickSpark
          sparkColor="#fbfbf9ff"
          sparkSize={12}
          sparkRadius={24}
          sparkCount={10}
          duration={500}
          easing="ease-out"
          extraScale={1.0}
        >
          <main>
            {children}
          </main>
        </ClickSpark>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      {/* Browse (wrapped in MainLayout) */}
      <Route
        path="/browse"
        element={
          <MainLayout>
            <BrowsePage />
          </MainLayout>
        }
      />

      {/* Item Details (also wrapped) */}
      <Route
        path="/item/:itemId"
        element={
          <MainLayout>
            <ItemDetailPage />
          </MainLayout>
        }
      />

      {/* === ADDED: The Route for your SearchPage === */}
      {/* It's wrapped in MainLayout so it gets the nav, search bar, and background */}
      <Route
        path="/search"
        element={
          <MainLayout>
            <SearchPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
