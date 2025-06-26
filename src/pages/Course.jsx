import './Course.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="Course-container">
      <div className="course-text">修習過的程式設計 / 資訊工程領域 相關課程</div>
      <div>
        {loading && <p>資料載入中...</p>}
        {!loading && courses.length === 0 && <p>目前沒有課程資料</p>}
        {!loading && courses.map(course => {
          const { id, Course_name, Course_grade, Course_Desc } = course;

          return (
            <div className="class" key={id}>
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
    </div>
  );
}

export default Course;
