// src/pages/Story/SuccessPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './ResultPages.css'; // 성공/실패 페이지 공통 스타일

import backgroundImage from '../../assets/images/resultpageBG.png';

const SuccessPage = ({ selectedArtName, selectedArtImage, onReset }) => {
  return (
    <div className="result-complete-container">
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

      {/* --- 2. 어두운 오버레이 레이어 --- */}
      <div className="result-overlay" />

      {/* --- 3. 실제 콘텐츠 레이어 (블러 영향 안 받음) --- */}
      <motion.div className="result-content-wrapper">
        <h1 className="result-title">COMPLETE!</h1>
        <p className="result-subtitle">
          축하합니다! 의뢰인이 부탁한 작품을 성공적으로 찾으셨습니다
        </p>

        <div className="card-layout success-layout">
          {/* 작품 사진 (폴라로이드 스타일) */}
          <motion.div
            className="polaroid-card image-card"
            initial={{ rotate: -5, x: -20, opacity: 0 }}
            animate={{ rotate: -6, x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="polaroid-inner">
              <img src={selectedArtImage} alt={selectedArtName} />
            </div>
          </motion.div>

          {/* 편지 */}
          <motion.div
            className="letter-card"
            initial={{ rotate: 5, x: 20, opacity: 0 }}
            animate={{ rotate: 6, x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="letter-content">
              <span className="letter-to">To. Z</span>
              <p>
                맞습니다. 제가 찾던 그 그림이네요.
                <br />
                직접 마주하니 알겠습니다.
                <br />
                이 파란색은 슬픔이 아니라, 깊은 평온이었군요.
                <br />
                덕분에 잊고 있던 기억을 온전히 되찾았습니다.
                <br />
                감사합니다.
              </p>
              <span className="letter-from">From. L</span>
            </div>
          </motion.div>
        </div>

        <button className="reset-button" onClick={onReset}>
          처음으로
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
