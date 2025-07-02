// src/pages/Home.js
import React, { useEffect, useState } from "react";
import './Home.css';
import githubIcon from '../img/Github.png';
import gmailIcon from '../img/Email.png';
import Discord from '../img/Discord.webp';
import { Link } from "react-router-dom";
import LoadingScreen from '../component/LoadingScreen'; // ⬅️ 載入你酷炫的 loading 畫面組件

const Home = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return <LoadingScreen />;
  }

  return (
    <div className="home">
      <main>
        <section className="iconContainer">
          <a href="https://github.com/F64116045" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="GitHub" className="icon" />
          </a>
          <a href="mailto:F64116045@gs.ncku.edu.tw" target="_blank" rel="noopener noreferrer">
            <img src={gmailIcon} alt="Mail" className="icon" />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <img src={Discord} alt="Discord" className="icon" />
          </a>
        </section>

        <div className="greeting-container">
          <div className="greeting">Currently debugging life… </div>
        </div>

        <section className="text">
          <h2>關於我</h2>
          <p>你好，我是黃朔</p>
          <div className="School">
            <div>目前就讀於 國立成功大學</div>
            <div className="Major">
              <div>測量及空間資訊學系</div>
              <div>資訊工程學系</div>
            </div>
            <div> (雙主修)</div>
          </div>
          <p>在大學期間發現自己對於CS領域有興趣</p>
          <p>目前正積極學習軟體工程相關知識</p>
        </section>

        <section className="contact">
          <h3>聯繫我</h3>
          <p>F64116045@gs.ncku.edu.tw</p>
        </section>
      </main>

      <footer>
        <p>© 2025 Huang Shou</p>
      </footer>
    </div>
  );
};

export default Home;
