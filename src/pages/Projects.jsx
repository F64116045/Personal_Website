import { useEffect, useState } from 'react';
import axios from 'axios';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const renderRichText = (content) => {
    if (!Array.isArray(content)) return '';
    return content.map((block) => {
      switch (block.type) {
        case 'heading': {
          const level = block.level || block.attrs?.level || 1;
          const text = block.children?.map(formatText).join('') || '';
          return `<h${level}>${text}</h${level}>`;
        }
        case 'paragraph': {
          const text = block.children?.map(formatText).join('') || '';
          return `<p>${text}</p>`;
        }
        case 'bullet_list':
        case 'ordered_list': {
          const items = block.children?.map(item => {
            const inner = item.children?.[0]?.children?.map(formatText).join('');
            return `<li>${inner}</li>`;
          }).join('');
          return block.type === 'bullet_list' ? `<ul>${items}</ul>` : `<ol>${items}</ol>`;
        }
        
        default:
          return '';
      }
    }).join('');
  };

  const formatText = (c) => {
    let text = c.text || '';
    if (c.bold) text = `<strong>${text}</strong>`;
    if (c.italic) text = `<em>${text}</em>`;
    if (c.underline) text = `<u>${text}</u>`;
    if (c.strike) text = `<s>${text}</s>`;
    return text;
  };

  useEffect(() => {
    axios.get('http://localhost:1337/api/projects?populate=Project_img')
      .then(res => {
        setProjects(res.data.data);
      })
      .catch(err => {
        console.error('取得專案清單失敗：', err);
      });
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
          <div className="project-header">{project.Project_Name}</div>
          <div className="project-intro">
            點擊查看詳情
          </div>
        </div>
      ))}

      {modalVisible && selectedProject && (
        <div className="project-modal">
          <div
            className="project-modal-content"
            style={{
              '--bg-image-url': `url(http://localhost:1337${selectedProject.Project_img?.[0]?.url || ''})`
            }}
          >
            <span className="close-button" onClick={closeModal}>X</span>
            <h1>{selectedProject.Project_Name}</h1>
            <hr />
            {selectedProject.Project_Link && (
              <p>
                🔗 <a href={selectedProject.Project_Link} target="_blank" rel="noopener noreferrer">
                  {selectedProject.Project_Link}
                </a>
              </p>
            )}
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{
                __html: renderRichText(selectedProject.Project_Detail)
              }}
            />
          </div>

        </div>
      )}
    </div>
  );
}

export default Projects;
