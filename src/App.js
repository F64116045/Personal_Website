import logo from './logo.svg';
import './App.css';
import bimg from './img/bimg.webp';


import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Chatroom from "./pages/Chatroom";

function App() {
  return (
    <div>
        <header>
          <h1 className="head">Huang Shou's Personal Website</h1>
          <hr></hr>
        </header>

        <body>
            

            <Router>
            <nav className="navbar">
              <Link to="/" className="nav-button">首頁</Link>
              <Link to="/projects" className="nav-button">專案</Link>
              <Link to="/chat" className="nav-button">傳訊息</Link>
            </nav>
            <hr></hr>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/chat" element={<Chatroom />} />
            </Routes>
          </Router>

        </body>
    </div>
  );
}

export default App;


