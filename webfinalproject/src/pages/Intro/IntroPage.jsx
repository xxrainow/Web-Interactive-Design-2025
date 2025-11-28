import React from 'react';
import './IntroPage.css';
import { Volume2 } from 'lucide-react'; // 아이콘 라이브러리 예시
import IntroBG from '../../assets/images/IntroBG.png';

const IntroPage = ({ onEnter }) => {
  console.log('IntroBG path:', IntroBG); // 디버깅용

  return (
    <div className="intro-container">
      {/* 배경 이미지 레이어 */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${IntroBG})` }}
      ></div>

      {/* 어두운 오버레이 (텍스트 가독성용) */}
      <div className="overlay"></div>

      {/* 상단 네비게이션 */}
      <header className="navbar">
        <div className="nav-links">
          <span className="nav-item">info</span>
          <span className="nav-item">list</span>
        </div>
        <div className="sound-icon">
          <Volume2 color="white" size={24} />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h1 className="main-title">Find a Piece of Art in Paris</h1>
        <p className="sub-title">파리의 미술작품을 탐험해보세요</p>

        <button className="enter-button" onClick={onEnter}>
          ENTER
        </button>
      </main>
    </div>
  );
};

export default IntroPage;
