import { useEffect, useState , useRef} from 'react';
import ReactDOM from 'react-dom';  // 引入 ReactDOM.createPortal
import { supabase } from '../supabase';
import ReactMarkdown from 'react-markdown';
import './Projects.css';
import '../component/LoadingScreen'
import LoadingScreen from '../component/LoadingScreen';
import { TOC,  useActiveHeader, getRenderedHeadings } from './MarkdownTOC';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import 'katex/dist/katex.min.css';

function ProjectModal({ selectedProject, closeModal }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [headings, setHeadings] = useState([]);
  const markdownRef = useRef(null);

  const Detail = typeof selectedProject?.Project_Detail === 'string'
    ? selectedProject.Project_Detail
    : '';


  useEffect(() => {
    if (!selectedProject) return;
    setShouldRender(false);
    const timer = setTimeout(() => setShouldRender(true), 200);
    return () => clearTimeout(timer);
  }, [selectedProject]);


  useEffect(() => {
    if (!shouldRender) return;
    const timer = setTimeout(() => {
      const result = getRenderedHeadings();
      setHeadings(result);
    }, 100);
    return () => clearTimeout(timer);
  }, [shouldRender, Detail]);

  const activeId = useActiveHeader(headings);

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

        <div className="project-modal-layout">
          {shouldRender ? (
            <>
              <div className="toc">
                <TOC headings={headings} activeId={activeId} />
              </div>

              <div className="markdown-content rich-text markdown-body" ref={markdownRef}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeSlug, rehypeKatex]}
                >
                  {Detail || '無詳細資料'}
                </ReactMarkdown>

                {selectedProject.Project_Link && (
                  <p>
                    <a href={selectedProject.Project_Link} target="_blank" rel="noopener noreferrer">
                      {selectedProject.Project_Link}
                    </a>
                  </p>
                )}
              </div>
            </>
          ) : (
            <LoadingScreen />
          )}
        </div>
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
        <LoadingScreen/>
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

      {modalVisible && selectedProject && (
        <ProjectModal selectedProject={selectedProject} closeModal={closeModal} />
      )}
    </div>
  );
}

export default Projects;
