import './Course.css';
import { useEffect, useState } from 'react';
import { supabase } from '.././supabase';
import ReactDOM from 'react-dom'; 
import LoadingScreen from '../component/LoadingScreen';

function CourseModal({selectedCourse, setSelectedCourse}){
  if(!selectedCourse) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{selectedCourse.Course_name}</h3>
        <p>{selectedCourse.Course_Desc || '無課程描述'}</p>
        <h4>開課單位 : {selectedCourse.Course_Department || '尚無資料'}</h4>
        <p>
          {selectedCourse.Course_Link ? (
            <a
              href={selectedCourse.Course_Link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              點此查看詳情
            </a>
          ) : (
            '無連結'
          )}
        </p>
        <button onClick={() => setSelectedCourse(null)}>關閉</button>
      </div>
    </div>,
    document.body
  );
}

function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Course')
        .select('*')
        .order('Course_id', { ascending: true });

      if (error) {
        console.error('Supabase 錯誤：', error);
      } else {
        setCourses(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCourse]);


  return (
    <div className="Course-container">
      <div className="course-text">修習過的程式設計 / 資訊工程領域 相關課程</div>
      <div>
        {loading && <LoadingScreen/>}
        {!loading && courses.length === 0 && <p>目前沒有課程資料</p>}
        {!loading && courses.map(course => {
          const { Course_id, Course_name, Course_grade } = course;
          return (
            <div className="class" key={Course_id} onClick={() => setSelectedCourse(course)}>
              {Course_name}
              {Course_grade && (
                <span style={{ color: 'rgb(0, 200, 255)', marginLeft: '0.5em' }}>
                  {Course_grade}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <CourseModal selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
    </div>
  );
}

export default Course;
