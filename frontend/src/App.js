import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing.js'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GrantDetail from './pages/GrantDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* 1. Landing Page is now the default root entry point */}
        <Route path="/" element={<Landing />} />
        
        {/* 2. Authentication Route */}
        <Route path="/login" element={<Login />} />
        
        {/* 3. Protected Dashboard App Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/grants/:id" element={
          <ProtectedRoute>
            <GrantDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;