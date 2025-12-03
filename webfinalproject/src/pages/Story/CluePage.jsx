// src/pages/Story/Clues/CluePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ClueCard from '../../components/ClueCard'; // 경로 확인
import './CluePage.css';

// 이미지 import (경로에 맞게 수정해주세요)
import card1 from '../../assets/images/clues/card1.png';
import card2 from '../../assets/images/clues/card2.png';
import card3 from '../../assets/images/clues/card3.png';
import card4 from '../../assets/images/clues/card4.png';
import card5 from '../../assets/images/clues/card5.png';

// 카드 데이터
const cluesData = [
  {
    id: 1,
    frontImg: card1,
    title: '물 위의 불',
    description: '차가운 수면 위로 \n길게 늘어지는 황금빛 상처들',
    //subDesc: '강물에 비친 빛',
  },
  {
    id: 2,
    frontImg: card2,
    title: '거친 숨결의 질감',
    description: '매끄럽지 않은 캔버스 위에 덧발라진, \n굳어버린 시간의 두께',
    //subDesc: '별빛의 시선',
  },
  {
    id: 3,
    frontImg: card3,
    title: '소용돌이가 멈춘 곳',
    description: '광기 어린 바람은 잦아들고\n오직 고요하게 흐르는 수평의 밤',
    //subDesc: '어둠의 바다',
  },
  {
    id: 4,
    frontImg: card4,
    title: '일곱 개의 감시자들',
    description: '침묵하는 허공에서 \n내려다보는 창백한 눈동자들',
    //subDesc: '밤하늘의 별들',
  },
  {
    id: 5,
    frontImg: card5,
    title: '뒷모습의 연인',
    description: '가장 화려한 빛 아래, \n어둠 속으로 걸어 들어가는 두 그림자',
    //subDesc: '고요한 산책',
  },
];

const CluePage = ({ onNext, onBack }) => {
  // 현재 중앙에 있는 카드 인덱스 (초기값: 가운데 카드인 2번 인덱스)
  const [activeIndex, setActiveIndex] = useState(2);
  // 카드가 뒤집혔는지 상태 (오직 active 카드만 뒤집힘)
  const [isFlipped, setIsFlipped] = useState(false);

  // 카드 클릭 핸들러
  const handleCardClick = (index) => {
    if (index === activeIndex) {
      // 이미 중앙에 있는 카드를 누르면 -> 뒤집기 토글
      setIsFlipped(!isFlipped);
    } else {
      // 옆에 있는 카드를 누르면 -> 그 카드를 중앙으로 이동 (그리고 뒤집힘 초기화)
      setActiveIndex(index);
      setIsFlipped(false);
    }
  };

  // 배경 클릭 시 뒤집힘 닫기 (선택사항)
  const handleBgClick = () => {
    if (isFlipped) setIsFlipped(false);
  };

  return (
    <div className="clue-page-container" onClick={handleBgClick}>
      {/* 상단 네비게이션 - 뒤로가기 버튼 */}
      <div className="clue-navbar">
        <div
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation(); // 배경 클릭 이벤트 전파 방지
            onBack();
          }}
        >
          <ArrowLeft color="white" size={24} />
        </div>
      </div>
      <div className="clue-overlay"></div>

      {/* 텍스트 안내 */}
      <div className="clue-header fade-in">
        <p>단서 카드를 확인해서 단서 5개를 모두 만족하는 작품을 찾아주세요</p>
        <p className="clue-info-text fade-in">
          * 나중에도 단서를 확인할 수 있어요
        </p>
      </div>

      <div className="carousel-container">
        {cluesData.map((item, index) => {
          // 현재 활성 카드와의 거리 계산 (-2, -1, 0, 1, 2)
          const offset = index - activeIndex;

          return (
            <motion.div
              key={item.id}
              className="card-wrapper"
              // 애니메이션 설정 (캐러셀 핵심!)
              animate={{
                x: offset * 160, // 옆으로 퍼지는 간격 (숫자 조절 가능)
                scale: offset === 0 ? 1.2 : 0.8, // 중앙은 크고(1.2), 옆은 작게(0.8)
                opacity: offset === 0 ? 1 : 0.5, // 중앙은 선명, 옆은 흐릿
                zIndex: 10 - Math.abs(offset), // 중앙이 제일 위로 오게
                rotateY: offset === 0 ? 0 : offset * -15, // 옆 카드들은 살짝 회전시켜 입체감 주기
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={(e) => {
                e.stopPropagation(); // 배경 클릭 방지
                handleCardClick(index);
              }}
              style={{
                position: 'absolute', // 겹쳐있어야 함
                // 중앙이 아니면 마우스 올렸을 때 클릭 유도

                cursor: offset === 0 ? 'default' : 'pointer',
              }}
            >
              <ClueCard
                data={item}
                isActive={offset === 0}
                isFlipped={offset === 0 && isFlipped}
                onClick={() => {}} // 부모 div에서 처리하므로 비워둠
              />
            </motion.div>
          );
        })}
      </div>
      <button className="find-art-button fade-in" onClick={onNext}>
        작품 찾으러 가기
      </button>
    </div>
  );
};

export default CluePage;
