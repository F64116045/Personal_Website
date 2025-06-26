import './App.css';

import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Course from "./pages/Course";

function App() {
  return (
    <Router basename="/Personal_Website">
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const pagesWithScroll = ["/course", "/", "/projects"];
    if (pagesWithScroll.includes(location.pathname.toLowerCase())) {
      document.body.style.overflowY = "auto";
    } else {
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.body.style.overflowY = "hidden"; // 清理效果
    };
  }, [location]);

  return (
    <div className="app-container">
      <div className="menu-container">
        <div className="head-container">
          <div className="header">
            <div>Huang Shuo</div>
          </div>
        </div>

        <nav className="navbar">
          <NavLink
            to="/"
            className={({ isActive }) => "nav-button" + (isActive ? " active" : "")}
          >
            首頁
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => "nav-button" + (isActive ? " active" : "")}
          >
            專案
          </NavLink>
          <NavLink
            to="/course"
            className={({ isActive }) => "nav-button" + (isActive ? " active" : "")}
          >
            修課
          </NavLink>
        </nav>
      </div>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/course" element={<Course />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
