import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import './AllCluesModal.css';

import card1 from '../../../assets/images/clues/card1.png';
import card2 from '../../../assets/images/clues/card2.png';
import card3 from '../../../assets/images/clues/card3.png';
import card4 from '../../../assets/images/clues/card4.png';
import card5 from '../../../assets/images/clues/card5.png';

// 레퍼런스 이미지에 있는 텍스트 데이터
const cluesData = [
  {
    id: 1,
    title: '물 위의 불',
    desc: '차가운 수면 위로\n길게 늘어지는 황금빛 상처들',
    image: card1, // 뒷면에 나올 타로/작품 이미지 경로
  },
  {
    id: 2,
    title: '거친 숨결의 질감',
    desc: '매끄럽지 않은 캔버스 위에 덧발라진,\n굳어버린 시간의 두께',
    image: card2,
  },
  {
    id: 3,
    title: '소용돌이가 멈춘 곳',
    desc: '광기 어린 바람은 잦아들고\n오직 고요하게 흐르는 수평의 밤',
    image: card3,
  },
  {
    id: 4,
    title: '일곱 개의 감시자들',
    desc: '침묵하는 허공에서\n내려다보는 창백한 눈동자들',
    image: card4,
  },
  {
    id: 5,
    title: '뒷모습의 연인',
    desc: '가장 화려한 빛 아래, \n어둠 속으로 걸어 들어가는 두 그림자',
    image: card5,
  },
];

// 개별 카드 컴포넌트 (내부에서만 사용)
const ClueGridCard = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="clue-grid-card-container"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="clue-grid-card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 앞면: 텍스트 */}
        <div className="clue-grid-face clue-grid-front">
          <h3 className="clue-card-title">{item.title}</h3>
          <div className="clue-line"></div>
          <p className="clue-card-desc">{item.desc}</p>
        </div>

        {/* 뒷면: 타로 이미지 */}
        <div className="clue-grid-face clue-grid-back">
          {/* 실제 타로 이미지가 있다면 src={item.image} 사용 */}
          {/* 이미지가 없을 경우를 대비해 placeholder 색상 처리 */}
          <div className="tarot-placeholder">
            <img
              src={item.image}
              alt="tarot"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AllCluesModal = ({ onClose }) => {
  return (
    <motion.div
      className="all-clues-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 배경 (약간의 블러) */}
      <div className="all-clues-bg" />

      {/* 닫기 버튼 (우측 상단) */}
      <button className="clue-close-btn" onClick={onClose}>
        <X size={32} color="white" />
      </button>

      {/* 메인 콘텐츠 */}
      <div className="all-clues-container">
        {cluesData.map((item) => (
          <ClueGridCard key={item.id} item={item} />
        ))}
      </div>
    </motion.div>
  );
};

export default AllCluesModal;
