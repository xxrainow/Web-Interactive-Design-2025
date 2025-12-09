// src/pages/Story/FailPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './ResultPages.css'; // 성공/실패 페이지 공통 스타일

import backgroundImage from '../../assets/images/resultpageBG.png';

const FailPage = ({ selectedArtName, selectedArtImage, onRetry }) => {
  return (
    <div className="result-fail-container">
      {/* --- 1. 배경 이미지 레이어 (블러 적용 대상) --- */}
      <motion.div
        className="result-background-layer blur-bg" // blur-bg 클래스 추가
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
        // 배경 등장 애니메이션
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="result-overlay" />

      <motion.div className="result-content-wrapper">
        <h1 className="result-title">TRY AGAIN...</h1>
        <p className="result-subtitle">
          단서 5가지를 모두 만족하는 그림을 다시 찾아보세요
        </p>

        <div className="card-layout fail-layout">
          {/* 선택한(틀린) 작품 사진 */}
          <div className="polaroid-card">
            <div className="polaroid-inner">
              {/* 이미지가 없다면 기본 placeholder 처리 가능 */}
              <img src={selectedArtImage} alt={selectedArtName} />
            </div>
          </div>

          {/* 실패 메시지 편지 */}
          <div className="letter-card">
            <div className="letter-content">
              <span className="letter-to">To. Z</span>
              <p>
                훌륭한 명작이지만,
                <br />
                제가 찾던 그림은 아닙니다.
                <br />
                다른 작품을 더 살펴봐 주십시오.
              </p>
              <span className="letter-from">From. L</span>
            </div>
          </div>
        </div>

        <button className="retry-button" onClick={onRetry}>
          돌아가기
        </button>
      </motion.div>
    </div>
  );
};

export default FailPage;
