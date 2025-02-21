import logo from './logo.svg';
import './App.css';
import bimg from './img/bimg.webp';
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
    const pagesWithScroll = ["/course", "/"]; // ✅ 確保是小寫
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
    <div className="app-container">
      <header>
        <h1 className="head">Huang Shuo's Personal Website</h1>
      </header>

      <nav className="navbar">
        <Link to="/" className="nav-button">首頁</Link>
        <Link to="/projects" className="nav-button">專案</Link>
        <Link to="/course" className="nav-button">修課</Link>
        <Link to="/chat" className="nav-button">傳訊息</Link>
      </nav>

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
