import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import ReactMarkdown from 'react-markdown';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // 取得專案資料
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('Project')
        .select('*');

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
    return <div className="projects-container"><p>資料載入中...</p></div>;
  }

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
