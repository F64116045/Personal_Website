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
        .from('Course')
        .select('*')
        .order('Course_id', { ascending: true });
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
        {!loading && courses.map(course => { // 確保每個課程都有唯一的 key
          const {Course_id, Course_name, Course_grade, Course_Desc, Course_Link, Course_Department} = course;
          return (
            <div className="class"  key = {Course_id} onClick={() => setSelectedCourse(course)}>
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
          </div>

        }
      </div>
    </div>
  );
}

export default Course;
