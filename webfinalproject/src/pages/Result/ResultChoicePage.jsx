import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { museumData } from '../../data/museumData';
import { Search, ArrowLeft, HelpCircle } from 'lucide-react';
import './ResultChoicePage.css';

const ResultChoicePage = ({ onBack, onComplete }) => {
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
    <div className="result-page-container">
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

      {/* --- 상단 네비게이션 --- */}
      <div className="clue-navbar">
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
