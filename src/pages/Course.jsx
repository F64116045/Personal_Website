import './Course.css';
import { useEffect, useState } from 'react';
import { supabase } from '.././supabase';

function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Course') // ← 替換成你 Supabase 的資料表名稱
        .select('*');
        console.log(data);

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
      const modal = document.querySelector('.modal-content');
      modal?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        {loading && <p>資料載入中...</p>}
        {!loading && courses.length === 0 && <p>目前沒有課程資料</p>}
        {!loading && courses.map(course => {
          const {Course_name, Course_grade, Course_Desc, Course_Link} = course;

          return (
            <div className="class" onClick={() => setSelectedCourse(course)}>
              {Course_name}
              {Course_grade && (
                <span style={{ color: 'rgb(0, 200, 255)', marginLeft: '0.5em' }}>
                  {Course_grade}
                </span>
              )}
            </div>
          );
        })}
        {selectedCourse &&
          <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedCourse.Course_name}</h3>
              <p>{selectedCourse.Course_Desc || '無課程描述'}</p>
              <p>成績: {selectedCourse.Course_grade}</p>
              <button onClick={() => setSelectedCourse(null)}>關閉</button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Course;
