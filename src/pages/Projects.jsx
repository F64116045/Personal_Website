import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';  // 引入 ReactDOM.createPortal
import { supabase } from '../supabase';
import ReactMarkdown from 'react-markdown';
import './Projects.css';

function ProjectModal({ selectedProject, closeModal }) {
  if (!selectedProject) return null;

  return ReactDOM.createPortal(
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
        <div className="rich-text markdown-body">
          <ReactMarkdown>{selectedProject.Project_Detail || '無詳細資料'}</ReactMarkdown>
        </div>
        {selectedProject.Project_Link && (
          <p>
            {' '}
            <a href={selectedProject.Project_Link} target="_blank" rel="noopener noreferrer">
              {selectedProject.Project_Link}
            </a>
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('Project').select('*');
      if (error) {
        console.error('取得專案清單失敗：', error);
      } else {
        setProjects(data);
      }
      setLoading(false);
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

  if (loading) {
    return (
      <div className="projects-container">
        <p>資料載入中...</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      {projects.map((project) => (
        <div key={project.id} className="project" onClick={() => showModal(project)}>
          <div className="project-header">{project.Project_name}</div>
          <div className="project-intro">點擊查看詳情</div>
        </div>
      ))}

      {/* 使用 Portal 呈現 Modal */}
      {modalVisible && selectedProject && (
        <ProjectModal selectedProject={selectedProject} closeModal={closeModal} />
      )}
    </div>
  );
}

export default Projects;
