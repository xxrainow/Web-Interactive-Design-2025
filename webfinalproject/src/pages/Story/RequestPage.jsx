// src/pages/Story/RequestPage.jsx
import React from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import './RequestPage.css';

const RequestPage = ({ onNext, onBack, isMusicPlaying, toggleMusic }) => {
  return (
    <div className="request-container">
      {/* 상단 네비게이션 */}
      <div className="request-navbar">
        <div className="nav-left">
          <div className="icon-btn" onClick={onBack}>
            <ArrowLeft color="white" size={24} />
          </div>
        </div>

        <div className="nav-right">
          <div className="icon-btn" onClick={toggleMusic}>
            {isMusicPlaying ? (
              <Volume2 color="white" size={24} />
            ) : (
              <VolumeX color="white" size={24} />
            )}
          </div>
        </div>
      </div>
      {/* 중앙 의뢰서 카드 */}
      <div className="request-card">
        {/* 상단 장식 선 */}
        <div className="deco-line top"></div>

        <h1 className="card-title">Request</h1>
        <p className="card-number">001</p>

        <p className="to-whom">To. X</p>

        <div className="card-content">
          <p>꿈에서 본 장면이 잊히지 않습니다.</p>
          <p>차가운 공기, 흔들리는 황금빛, 그리고</p>
          <p>침묵하는 우리.</p>
          <p>
            그것은 <span className="highlight">파랑(Blue)</span>이었지만
          </p>
          <p>슬픔은 아니었고,</p>
          <p>
            <span className="highlight">밤(Night)</span>이었지만
          </p>
          <p>어둠은 아니었습니다.</p>
          <p>그 작품을 찾아주세요.</p>
        </div>

        <p className="from-whom">From. L</p>

        {/* 하단 장식 선 */}
        <div className="deco-line bottom"></div>
      </div>

      {/* 우측 하단 버튼 */}
      <button className="next-button" onClick={onNext}>
        단서 확인하기 &gt;
      </button>
    </div>
  );
};

export default RequestPage;
