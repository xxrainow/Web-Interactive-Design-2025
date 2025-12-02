import React from 'react';
import { motion } from 'framer-motion';
import './ClueCard.css';

const ClueCard = ({ 
  data,       // 데이터 객체 (frontImg, title, description 등 포함)
  isActive,   // 현재 이 카드가 중앙에 있는지?
  isFlipped,  // 뒤집혔는지?
  onClick     // 클릭 이벤트
}) => {
  return (
    <div className="clue-card-container" onClick={onClick}>
      <motion.div
        className="clue-card-inner"
        // ★ 핵심: 부모가 시키는 대로(isActive && isFlipped) 회전함
        animate={{ rotateY: isActive && isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* === 앞면 (이미지) === */}
        <div className="clue-card-face clue-card-front">
          {/* data.frontImg를 사용합니다 */}
          <img src={data.frontImg} alt={data.title} />
        </div>

        {/* === 뒷면 (텍스트 디자인) === */}
        {/* 이미지가 없어도 CSS로 카드 뒷면처럼 꾸밉니다 */}
        <div className="clue-card-face clue-card-back">
          <div className="back-content">
            <h3 className="clue-title">{data.title}</h3>
            <div className="clue-divider"></div>
            <p className="clue-desc-main">{data.description}</p>
            <p className="clue-desc-sub">{data.subDesc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClueCard;
