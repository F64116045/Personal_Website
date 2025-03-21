import './Course.css';

function Course() {
  return (
    <div className="Course-container">
      <div className="course-text">修習過的程式設計 / 資訊工程領域 相關課程</div>
      <div>
        <div className="class">計算機概論    <span style={{ color: "rgb(0, 200, 255)" }}>A</span> </div>
        <div className="class">計算機程式設計 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">數位電路導論 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">線性代數 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">程式設計(一) <span style={{ color: "rgb(0, 200, 255)" }}>A-</span></div>
        <div className="class">資料結構 <span style={{ color: "rgb(0, 200, 255)" }}>A-</span></div>
        <div className="class">演算法 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">計算機組織 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">作業系統 <span style={{ color: "rgb(0, 200, 255)" }}>A-</span></div>
        <div className="class">行動裝置程式設計 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">機器學習概論 <span style={{ color: "rgb(0, 200, 255)" }}>A</span></div>
        <div className="class">Linux系統與開源軟體 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">計算理論 <span style={{ color: "rgb(0, 200, 255)" }}>A+</span></div>
        <div className="class">資料庫系統 </div>
        <div className="class">創意行動網路APPs之系統技術與設計研發</div>
      </div>
    </div>
  );
}

export default Course;