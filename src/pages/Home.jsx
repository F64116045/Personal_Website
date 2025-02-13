// src/pages/Home.js
import React from "react";
import './Home.css';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>

      <main>
        <section class ="welcome">
          <h2>歡迎來到我的網站！</h2>
        </section>

        <section class ="text">
          <h2>關於我</h2>
          <p>我是黃朔</p>
          <p>目前就讀於國立成功大學測量及空間資訊學系，雙主修資訊工程學系。</p>
          <p>在大學期間發現自己對於CS領域有興趣</p>
          <p>目前正積極學習人工智慧、機器學習等方面的知識</p>
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
