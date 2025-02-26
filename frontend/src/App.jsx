import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from "./pages/About";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


const App = () => {
    return (
        <Router>
            <div className="app-container">  {/* Full-page wrapper */}
                <Navbar />
                <div className="content-wrapper"> {/* Pushes footer to bottom */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        
                       
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
