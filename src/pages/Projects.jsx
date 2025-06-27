import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import ReactMarkdown from 'react-markdown';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('Project')  // 對應你 Supabase 裡的表格名稱
        .select('*');     // 如果有圖片 URL 欄位也一起選出來

      if (error) {
        console.error('取得專案清單失敗：', error);
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  const showModal = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setModalVisible(false);
  };

  return (
    <div className="projects-container">
      {projects.map((project) => (
        <div key={project.id} className="project" onClick={() => showModal(project)}>
          <div className="project-header">{project.Project_name}</div>
          <div className="project-intro">點擊查看詳情</div>
        </div>
      ))}

      {modalVisible && selectedProject && (
        <div className="project-modal">
          <div
            className="project-modal-content"
            style={{
              '--bg-image-url': `url(${selectedProject.Project_ImgURL || ''})`,
            }}
          >
            <span className="close-button" onClick={closeModal}>X</span>
            <h1>{selectedProject.Project_name}</h1>
            <hr />
            {selectedProject.Project_Link && (
              <p>
                🔗 <a href={selectedProject.Project_Link} target="_blank" rel="noopener noreferrer">
                  {selectedProject.Project_Link}
                </a>
              </p>
            )}
            <div className="rich-text markdown-body">
              <ReactMarkdown>{selectedProject.Project_Detail || '無詳細資料'}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
