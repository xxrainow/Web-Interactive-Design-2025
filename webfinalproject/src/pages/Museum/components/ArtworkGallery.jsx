// src/pages/Museum/components/ArtworkGallery.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import throttle from 'lodash/throttle';
import './ArtworkGallery.css';

const ArtworkGallery = ({ artworks, onExit, onClue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentArt = artworks[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === artworks.length - 1;

  const paginate = useCallback(
    (newDirection) => {
      if (newDirection === 1 && !isLast) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else if (newDirection === -1 && !isFirst) {
        setDirection(-1);
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [isFirst, isLast]
  );

  useEffect(() => {
    const handleWheel = throttle((e) => {
      if (e.deltaY > 0) paginate(1);
      else paginate(-1);
    }, 1200);

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [paginate]);

  const contentVariants = {
    enter: (dir) => ({ y: dir > 0 ? '20%' : '-20%', opacity: 0 }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
    exit: (dir) => ({
      y: dir > 0 ? '-20%' : '20%',
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    }),
  };

  if (!currentArt) return null;

  return (
    <div className="gallery-container">
      {/* ★ 1. 배경 블러 이미지 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentArt.id + '-bg'} // ID가 바뀌면 애니메이션 실행
          className="gallery-background"
          style={{ backgroundImage: `url(${currentArt.image})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* 배경을 어둡게 눌러주는 막 */}
      <div className="gallery-overlay" />

      {/* --- 레이아웃 (이전 요청사항 유지) --- */}

      {/* 왼쪽 라인 + 굵은 선 + 인덱스 */}
      <div className="guide-line left">
        <div className="bold-line-overlay"></div>
        <span className="art-index-number">
          {(currentIndex + 1).toString().padStart(2, '0')}
        </span>
      </div>

      <div className="guide-line right">
        <button className="exit-btn" onClick={onExit}>
          {/* size와 strokeWidth로 크기와 굵기 조절 가능 */}
          <X size={24} color="white" strokeWidth={1.5} />
        </button>
      </div>

      {/* 우측 상단 단서 버튼 */}
      <div className="top-right-controls">
        <button className="clue-btn" onClick={onClue}>
          단서
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="gallery-content">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentArt.id}
            className="artwork-inner"
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="text-section">
              <h2 className="art-title">{currentArt.title}</h2>
              <p className="art-artist">
                {currentArt.artist || 'Artist Unknown'}
              </p>
            </div>
            <div className="image-section">
              <img src={currentArt.image} alt={currentArt.title} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 네비게이션 화살표 */}
      <div className="gallery-nav">
        <button
          className="nav-arrow up"
          onClick={() => paginate(-1)}
          disabled={isFirst}
          style={{ opacity: isFirst ? 0 : 1 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <button
          className="nav-arrow down"
          onClick={() => paginate(1)}
          disabled={isLast}
          style={{ opacity: isLast ? 0 : 1 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArtworkGallery;
