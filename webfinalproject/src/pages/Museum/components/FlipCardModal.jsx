import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import './FlipCardModal.css'; // 모달 전용 CSS 분리 (선택사항)

const FlipCardModal = ({ artwork, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 카드 클릭 시 뒤집기 핸들러
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="card-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 카드 컨테이너 (클릭 이벤트 전파 방지) */}
      <div className="flip-card-container" onClick={(e) => e.stopPropagation()}>
        <motion.div
          className="flip-card-inner"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleCardFlip}
        >
          {/* 1. 앞면 (이미지) */}
          <div className="flip-card-front">
            <img src={artwork.image} alt={artwork.title} />
          </div>

          {/* 2. 뒷면 (설명 텍스트) */}
          <div className="flip-card-back">
            <div className="back-content">
              <p className="description-text">{artwork.desc}</p>
              <div className="selection-prompt">
                이 작품으로 선택하시겠습니까?
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 닫기 버튼 */}
      <button className="modal-close-btn" onClick={onClose}>
        <X size={32} color="white" />
      </button>
    </motion.div>
  );
};

export default FlipCardModal;
