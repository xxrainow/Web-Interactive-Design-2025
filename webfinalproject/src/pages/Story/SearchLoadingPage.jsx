// src/pages/Story/SearchLoadingPage.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SearchLoadingPage.css';

const SearchLoadingPage = ({ onComplete }) => {
  // 화면이 뜨면 3초 뒤에 onComplete(다음 단계로 이동) 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 3000ms = 3초

    return () => clearTimeout(timer); // 혹시 사용자가 나가면 타이머 취소
  }, [onComplete]);

  return (
    <div className="search-loading-container">
      <div className="loading-overlay"></div>

      <motion.div
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }} // 깜빡이는 효과
      >
        파리의 미술관 정보를 불러오는 중...
      </motion.div>
    </div>
  );
};

export default SearchLoadingPage;
