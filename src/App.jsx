import './App.css';

import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Course from "./pages/Course";
import Diary from "./pages/Diary";
import Icon from "./img/Icon.png";

function App() {
  return (
    <Router basename="/Personal_Website">
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-container">
      <div className="menu-container">
        <div className="head-container">
          <div className="header">
            <img src={Icon} className='main-icon'/>
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
            實作/專案經驗
          </NavLink>
          <NavLink
            to="/course"
            className={({ isActive }) => "nav-button" + (isActive ? " active" : "")}
          >
            修課
          </NavLink>
          <NavLink
            to="/diary"
            className={({ isActive }) => "nav-button" + (isActive ? " active" : "")}
          >
            筆記日誌
          </NavLink>
        </nav>
      </div>

      <div className='content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/course" element={<Course />} />
          <Route path="/diary" element={<Diary/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
