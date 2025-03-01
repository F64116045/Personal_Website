import logo from './logo.svg';
import './App.css';
import bimg from './img/BC.webp';
import ParticleBackground from './pages/ParticlesBackground';
import home from './img/home.webp';

import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
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
          <div className="header">
             
             <div>Huang   Shuo</div>
          </div>
        </div>

        <nav className="navbar">
            <NavLink to="/" className="nav-button" activeClassName="active">Home</NavLink>
            <NavLink to="/projects" className="nav-button" activeClassName="active">Projects</NavLink>
            <NavLink to="/course" className="nav-button" activeClassName="active">Course</NavLink>
            <NavLink to="/chat" className="nav-button" activeClassName="active">Messages</NavLink>
        </nav>
      </div>

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
