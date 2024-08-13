// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import YieldFarming from './pages/YieldFarming';
import Staking from './pages/Staking';
import Education from './pages/Education';
import RiskAssessment from './pages/RiskAssessment';
import { useAuth0 } from '@auth0/auth0-react';
import LoginModal from './components/LoginModal';
import Profile from './pages/Profile';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setModalOpen(true);
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {isAuthenticated ? <Component /> : null}
      <LoginModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar /> {/* Add NavBar component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<ProtectedRoute component={Portfolio} />} />
          <Route path="/yield-farming" element={<ProtectedRoute component={YieldFarming} />} />
          <Route path="/staking" element={<ProtectedRoute component={Staking} />} />
          <Route path="/education" element={<Education />} />
          <Route path="/risk-assessment" element={<ProtectedRoute component={RiskAssessment} />} />
          <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
