import { useState } from 'react';
import './Projects.css';

// 導入專案的詳細檔案
import MoodleCaptchaSolverDetails from './moodleCaptchaSolverDetails';
import PersonalWebsiteDetails from './personalWebsiteDetails';

function Projects() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // 專案對應檔案的映射
  const projectDetails = {
    moodleCaptchaSolver: MoodleCaptchaSolverDetails,
    personalWebsite: PersonalWebsiteDetails,
    // 在這裡可以繼續添加其他專案的對應檔案
  };

  // 顯示詳細介紹
  const showModal = (projectName) => {
    const ProjectComponent = projectDetails[projectName];  // 根據專案名稱獲取對應的詳細資料組件
    setSelectedProject({
      details: <ProjectComponent />  // 將對應的 JSX 元素設置為 details
    });
    setModalVisible(true);  // 顯示模態框
  };

    // 關閉模態框
    const closeModal = () => {
      setModalVisible(false);
      setSelectedProject(null);
    };

    return (
      <div className="projects-container">
        <div className="project" onClick={() => showModal('moodleCaptchaSolver')}>
          <div>Moodle Captcha Solver</div>
          <div className="project-intro">一個簡單的 Chrome 擴充插件，使用 Tesseract.js 提供的 OCR 技術解決 Moodle 平台上的驗證碼。</div>
        </div>
        <div className="project" onClick={() => showModal('personalWebsite')}>
          <div>個人網站</div>
          <div className="project-intro">為了練習 React 而搭建的網站，附帶即時聊天室功能，使用戶可以快速創建帳號並與我進行互動。</div>
        </div>
        <div className="project" onClick={() => showModal('NCKUAndroidGame')}>
          <div>NCKU Android Game</div>
          <div className="project-intro">使用 Android Studio 開發，以使用者移動為主軸，透過使用者移動讓遊戲中角色觸發一連串事件，最終藉由完成遊戲目標達到運動效果的一個遊戲。</div>
        </div>
        <div className="project" onClick={() => showModal('112-2計算機組織課程Labs')}>
          <div className="project-header">112-2 計算機組織課程 Labs</div>
          <div className="project-intro">1. μRISC-V: An Enhanced RISC-V Processor Design using Spike</div>
          <div className="project-intro">2. Performance Modeling for the μRISC-V Processor</div>
          <div className="project-intro">3. Reducing Memory Access Overhead for the μRISC-V Processor</div>
        </div>
        <div className="project" onClick={() => showModal('113-1作業系統課程Labs')}>
          <div className="project-header">113-1 作業系統課程 Labs</div>
          <div className="project-intro">1. Shared Memory & Message Passing</div>
          <div className="project-intro">2. Shell</div>
          <div className="project-intro">3. Multithreading Program & Linux Kernel Module</div>
          <div className="project-intro">4. Virtual File System (VFS) using extent-based allocation strategy</div>
        </div>

        {/* Modal */}
        {modalVisible && selectedProject && (
          <div className="project-modal">
            <div className="project-modal-content">
              <span className="close-button" onClick={closeModal}> X </span>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.intro}</p>
              {/* 渲染 JSX 內容 */}
              {selectedProject.details}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default Projects;
