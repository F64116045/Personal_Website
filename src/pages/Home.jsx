// src/pages/Home.js
import React from "react";
import './Home.css';
import githubIcon from '../img/Github.png';
import gmailIcon from '../img/Email.png';
import Discord from '../img/Discord.webp';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>

      <main>
        <div className="welcome">
          <p className="welcome-content1"><span>  Welcome to my personal website!  Stay tuned for updates! </span>  </p>
          <p className="welcome-content2"><span> Welcome to my personal website!  Stay tuned for updates! </span> </p>
          <p className="welcome-content3"><span> Welcome to my personal website!  Stay tuned for updates! </span>  </p>   
        </div>


        <section className="iconContainer">
          <a href="https://github.com/F64116045" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="GitHub" className="icon"/>
          </a>
          <a href="https://github.com/F64116045" target="_blank" rel="noopener noreferrer">
            <img src={gmailIcon} alt="Mail" className="icon"/>
          </a>
          <a href="https://github.com/F64116045" target="_blank" rel="noopener noreferrer">
            <img src={Discord} alt="Discord" className="icon"/>
          </a>
        </section>

        <div class="greeting-container">
          <div class="greeting">Currently debugging life… </div>
        </div>

        <section class ="text">
          <h2>關於我</h2>
          <p>我是黃朔</p>
          <p>目前就讀於國立成功大學 測量及空間資訊學系 / 資訊工程學系 (雙主修)。</p>
          <p>在大學期間發現自己對於CS領域有興趣</p>
          <p>目前正積極學習軟體工程相關知識</p>
        </section>


        <section class ="contact">
          <h3>聯繫我</h3>
          <p>如果你有興趣與我合作或進一步了解我的工作，請隨時聯繫我。</p>
        </section>
      </main>

      <footer>
        <p>© 2025 Huang Shou</p>
      </footer>
    </div>
  );
};

export default Home;
