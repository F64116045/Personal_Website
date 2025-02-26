import logo from './logo.svg';
import './App.css';
import bimg from './img/BC.webp';
import ParticleBackground from './pages/ParticlesBackground';

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Chatroom from "./pages/Chatroom";
import Course from "./pages/Course";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const pagesWithScroll = ["/course", "/", "/chat", "/projects"]; // ✅ 確保是小寫
    if (pagesWithScroll.includes(location.pathname.toLowerCase())) {
      document.body.style.overflowY = "auto"; // 允許滾動
    } else {
      document.body.style.overflowY = "hidden"; // 移除滾輪
    }

    return () => {
      document.body.style.overflowY = "hidden"; // 清理效果
    };
  }, [location]);

  return (
    <div className="app-container" >
      <div className="menu-container">
        <div className="head-container">
          <h1 className="header">
            <h1 className="head"></h1>
            Huang Shuo's Personal Website
          </h1>
        </div>

        <nav className="navbar">
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/projects" className="nav-button">Projects</Link>
          <Link to="/course" className="nav-button">Course</Link>
          <Link to="/chat" className="nav-button">Messages</Link>
        </nav>
      </div>
      <hr></hr>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/course" element={<Course />} />
            <Route path="/chat" element={<Chatroom />} />
          </Routes>
        </div>
      
    </div>
  );
}

export default App;
