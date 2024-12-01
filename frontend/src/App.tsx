import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage'; 
import Create from './pages/Create';
import SessionSelector from './components/session/SessionSelector';
import './App.css';
const App: React.FC = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/create/seller" element={<SessionSelector />} />
                <Route path="/create/session" element={<Create />} />
                 
            </Routes>
        </Router>
    );
};

export default App;

