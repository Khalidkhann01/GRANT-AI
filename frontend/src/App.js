import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/landing.js'; 
import Dashboard from './pages/Dashboard';
import GrantDetail from './pages/GrantDetail';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Dashboard Routes - No authentication required */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grants/:id" element={<GrantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;