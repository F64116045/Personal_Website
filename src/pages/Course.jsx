import './Course.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:1337/api/courses')
      .then(res => {
        setCourses(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API 錯誤：', err);
        setLoading(false);
      });
  }, []);

  
  useEffect(() => {
  if (selectedCourse) {
      // 滾動到視窗置中
      const modal = document.querySelector('.modal-content');
      modal?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 鎖定背景滾動
      document.body.style.overflow = 'hidden';
    } else {
      // 回復背景滾動
      document.body.style.overflow = '';
    }

    // 清理：元件卸載時確保復原
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
          const { id, Course_name, Course_grade, Course_Desc } = course;

          return (
            <div className="class" key={id} onClick={() => setSelectedCourse(course)}>
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
