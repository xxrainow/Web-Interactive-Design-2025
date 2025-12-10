import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { museumData } from '../../data/museumData';
import { Search, ArrowLeft, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import './ResultChoicePage.css';

const ResultChoicePage = ({
  onBack,
  onComplete,
  isMusicPlaying,
  toggleMusic,
}) => {
  const [selectedArt, setSelectedArt] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const museums = Object.values(museumData);

  const handleCardClick = (art) => {
    setSelectedArt(art);
  };

  // '이 사진으로 결정' 버튼 클릭 시 모달 넘기기
  const handleInitialClick = () => {
    if (selectedArt) {
      setShowConfirmModal(true);
    } else {
      // 선택 안 하고 눌렀을 때의 방어 로직 (선택사항)
    }
  };

  // 팝업 - 예
  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    if (selectedArt) {
      // ★ 중요: 객체 전체(art)가 아니라 '제목'과 '이미지주소'를 풀어서 전달해야 함
      // App.js의 handleArtChoice(artName, artImage)가 받게 됨
      onComplete(selectedArt.title, selectedArt.image);
    }
  };

  // 팝업 - 아니오
  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="resultchoice-page-container">
      {/* ★ 모달창 (Portal 사용, AnimatePresence 제거, CSS 클래스 사용) */}
      {showConfirmModal &&
        createPortal(
          <div className="confirm-overlay">
            <motion.div
              className="confirm-box"
              // 켜질 때 뿅! 하고 나타나는 효과만 줍니다 (버그 없음)
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <HelpCircle
                size={40}
                color="#fff"
                style={{ marginBottom: '15px', opacity: 0.8 }}
              />
              <p className="confirm-question">
                정말 이 작품으로 결정하시겠습니까?
              </p>

              <div className="confirm-art-info">
                <span className="confirm-art-title">
                  {selectedArt.title.replace(/\n/g, ' ')}
                </span>
              </div>

              <div className="confirm-buttons">
                <button className="btn-no" onClick={handleCancel}>
                  아니오
                </button>
                <button className="btn-yes" onClick={handleFinalConfirm}>
                  예, 결정합니다
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      {/* ★ [수정됨] 카우스틱스(Caustics) / 액체 유리 효과 필터 */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="glass-refraction-filter">
          {/* turbulence: 
              numOctaves를 1로 낮춰서 '매끈한' 곡선을 만듭니다. (연기 느낌 제거)
              baseFrequency를 0.003으로 낮춰서 '큰' 물결을 만듭니다. 
          */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.003"
            numOctaves="0.1"
            result="warp"
          >
            {/* 천천히, 묵직하게 움직이는 애니메이션 (20초) */}
            <animate
              attributeName="baseFrequency"
              values="0.003; 0.005; 0.003"
              dur="20s"
              repeatCount="indefinite"
            />
          </feTurbulence>

          {/* scale을 60으로 높여서 굴절을 강하게 줍니다 (유리처럼 휘어짐) */}
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="60"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </svg>
      <div className="glass-background-layer" />
      {/* --- 상단 네비게이션 --- */}
      <div className="resultchoice-navbar">
        <div className="nav-left">
          <div
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
          >
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

      <div className="result-content-wrapper">
        <header className="result-header">
          <p className="sub-title">
            단서를 만족하는 단 하나의 작품을 선택해주세요
          </p>
          <h1 className="main-title">CHOOSE A PIECE OF ART IN PARIS</h1>

          {/*<div className="search-bar-container">
            <Search
              className="search-icon"
              size={24}
              color="white"
              strokeWidth={1.5}
            />
            <input type="text" placeholder="MUSEUM" className="search-input" />
            <input type="text" placeholder="ARTIST" className="search-input" />
            <input type="text" placeholder="ARTWORK" className="search-input" />
            <button className="search-button">SEARCH</button>
          </div>
          */}
        </header>

        <div className="gallery-list">
          {museums.map((museum) => (
            <section key={museum.id} className="museum-section">
              <h2 className="museum-title">{museum.name}</h2>
              <div className="art-grid">
                {museum.artworks.map((art) => (
                  <motion.div
                    key={`${museum.id}-${art.id}`}
                    className={`art-card ${
                      selectedArt === art ? 'selected' : ''
                    }`}
                    onClick={() => handleCardClick(art)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="art-image-wrapper">
                      <img src={art.image} alt={art.title} />
                      {selectedArt === art && (
                        <div className="selected-overlay"></div>
                      )}
                    </div>
                    <div className="art-info">
                      <h3
                        className="art-title"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {art.title}
                      </h3>
                      <p className="art-artist">{art.artist}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="result-footer-spacer"></div>
      </div>

      {/* --- 하단 버튼 --- */}
      <div className="result-footer">
        <p className="choice-text">
          YOU CHOOSE
          <span className="choice-highlight">
            {selectedArt
              ? ` '${selectedArt.title.replace(/\n/g, ' ')}'`
              : ' ...'}
          </span>
        </p>
        <button
          className={`confirm-btn ${selectedArt ? 'active' : ''}`}
          onClick={handleInitialClick}
          disabled={!selectedArt}
        >
          이 사진으로 결정
        </button>
      </div>
    </div>
  );
};

export default ResultChoicePage;
