// src/pages/Story/ResultLoadingPage.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './ResultLoadingPage.css';

const ResultLoadingPage = ({ onComplete, selectedArtName }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // 작품 이름이 없을 경우를 대비한 안전장치 및 줄바꿈(\n) 제거
  const safeTitle = selectedArtName
    ? selectedArtName.replace(/\n/g, ' ')
    : '작품';

  return (
    <div className="result-loading-container">
      {/* 배경을 어둡고 흐리게 만들어주는 오버레이 */}
      <div className="result-loading-overlay"></div>

      <motion.div
        className="result-loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        당신은 의뢰인에게 [{safeTitle}]을(를) 가져갔습니다
      </motion.div>
    </div>
  );
};

export default ResultLoadingPage;
