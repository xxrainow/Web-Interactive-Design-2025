import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Recent from './pages/Recent';
import Navbar from './components/layout/Navbar';
import './App.css';

// 다른 페이지들의 더미 컴포넌트 (실제로는 별도 파일로 분리하세요)
const Request = () => <div className="page-placeholder">Request Page</div>;
const Map = () => <div className="page-placeholder">Map Page</div>;
const Note = () => <div className="page-placeholder">Note Page</div>;
const Setting = () => <div className="page-placeholder">Setting Page</div>;

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 네비게이션 바 */}
        <Navbar />

        {/* 페이지 라우팅 */}
        <Routes>
          <Route path="/" element={<Recent />} />
          <Route path="/request" element={<Request />} />
          <Route path="/map" element={<Map />} />
          <Route path="/note" element={<Note />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
