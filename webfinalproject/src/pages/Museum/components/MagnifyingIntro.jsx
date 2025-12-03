// src/pages/Story/components/MagnifyingIntro.js
import React, { useState, useRef } from 'react';
import './MagnifyingIntro.css';

const MagnifyingIntro = ({ data, onNext }) => {
  const [glassPos, setGlassPos] = useState({ x: 0, y: 0 });
  const [showGlass, setShowGlass] = useState(false);
  const containerRef = useRef(null);

  // 돋보기 크기 (CSS랑 맞춰줘야 함)
  const GLASS_SIZE = 250;
  // 줌 레벨 (1이면 원본 크기, 1.5면 1.5배 확대)
  // "블러만 없애고 싶다"면 1, "확대해서 보고 싶다"면 1.5 이상
  const ZOOM_LEVEL = 1.2; 

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // 1. 컨테이너 내부에서의 마우스 좌표 계산
    const x = e.clientX - left;
    const y = e.clientY - top;

    // 2. 돋보기 위치 업데이트 (마우스가 원의 중심에 오도록)
    setGlassPos({ x, y });

    // 3. 돋보기 내부 배경 이미지 위치 계산 (비율 계산)
    // 마우스가 10% 위치에 있으면, 배경도 10% 위치를 보여줘야 함
    // 확대 효과를 위해 계산이 조금 복잡함
  };

  const handleMouseEnter = () => setShowGlass(true);
  const handleMouseLeave = () => setShowGlass(false);

  // 돋보기 스타일 동적 계산
  const glassStyle = {
    display: showGlass ? 'block' : 'none',
    top: `${glassPos.y - GLASS_SIZE / 2}px`,
    left: `${glassPos.x - GLASS_SIZE / 2}px`,
    backgroundImage: `url(${data.intro.image})`,
    
    // ★ 핵심: 배경 이미지 사이즈를 컨테이너 * 줌레벨로 설정
    backgroundSize: `${containerRef.current?.offsetWidth * ZOOM_LEVEL}px ${containerRef.current?.offsetHeight * ZOOM_LEVEL}px`,
    
    // ★ 핵심: 마우스 위치에 맞춰 배경 이동
    // 공식: -(마우스위치 * 줌레벨 - 돋보기반지름)
    backgroundPositionX: `-${glassPos.x * ZOOM_LEVEL - GLASS_SIZE / 2}px`,
    backgroundPositionY: `-${glassPos.y * ZOOM_LEVEL - GLASS_SIZE / 2}px`,
  };

  return (
    <div 
      className="magnifier-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onNext} // 클릭하면 다음 화면으로 넘어가게 설정
    >
      {/* 1. 블러 처리된 배경 */}
      <div 
        className="blurred-background" 
        style={{ backgroundImage: `url(${data.intro.image})` }}
      />

      {/* 2. 돋보기 (선명한 부분) */}
      <div className="magnifying-glass" style={glassStyle} />

      {/* 3. 안내 텍스트 */}
      <div className="content-overlay">
        <h1>{data.name}</h1>
        <p>화면을 움직여 미술관을 탐색해보세요.<br/>(클릭하여 입장)</p>
      </div>
    </div>
  );
};

export default MagnifyingIntro;
