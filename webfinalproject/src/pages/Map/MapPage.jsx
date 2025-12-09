import React, { useState, useRef, useEffect } from 'react';
import {
  Canvas,
  useFrame,
  useLoader,
  extend,
  useThree,
} from '@react-three/fiber';
import { TextureLoader, Color, ClampToEdgeWrapping } from 'three';
import './MapPage.css';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

import { WaveShaderMaterial } from './WaveShaderMaterial';

import imgLouvre from '../../assets/images/map/louvre_out.jpg';
import imgOrsay from '../../assets/images/map/orsay_out.jpg';
import imgPompidou from '../../assets/images/map/pompidou_out.jpg';
import imgOrangerie from '../../assets/images/map/orangerie_out.jpg';

extend({ WaveShaderMaterial });

export const museums = [
  { id: 0, dataKey: 'louvre', name: 'Musee du Louvre', img: imgLouvre },
  { id: 1, dataKey: 'orsay', name: "Musee d'Orsay", img: imgOrsay },
  { id: 2, dataKey: 'pompidou', name: 'Centre Pompidou', img: imgPompidou },
  {
    id: 3,
    dataKey: 'orangerie',
    name: "Musee de l'Orangerie",
    img: imgOrangerie,
  },
];
// --------------------------------------------------------
// 3D 씬 컴포넌트 (배경과 중앙에서 재사용)
// --------------------------------------------------------
const Scene = ({ currentIndex }) => {
  const materialRef = useRef();
  const { viewport } = useThree();

  const textures = useLoader(
    TextureLoader,
    museums.map((m) => m.img)
  );

  useEffect(() => {
    textures.forEach((t) => {
      t.wrapS = ClampToEdgeWrapping;
      t.wrapT = ClampToEdgeWrapping;
    });
  }, [textures]);

  const [activeTexture, setActiveTexture] = useState(textures[0]);
  const [nextTexture, setNextTexture] = useState(textures[0]);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (textures[currentIndex] !== activeTexture) {
      setNextTexture(textures[currentIndex]);
      setIsAnimating(true);
      setProgress(0);
    }
  }, [currentIndex, textures]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      if (isAnimating) {
        const speed = 2.0 * delta;
        const newProgress = Math.min(progress + speed, 1);
        setProgress(newProgress);
        materialRef.current.uProgress = newProgress;
        if (newProgress >= 1) {
          setIsAnimating(false);
          setActiveTexture(nextTexture);
          materialRef.current.uProgress = 0;
        }
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <waveShaderMaterial
        ref={materialRef}
        uTexture1={activeTexture}
        uTexture2={nextTexture}
        uColor={new Color('black')}
        toneMapped={false}
      />
    </mesh>
  );
};

// --------------------------------------------------------
// 메인 페이지 컴포넌트
// --------------------------------------------------------
const MapPage = ({ onMuseumSelect, onBack, initialId, onFinalDecision, isMusicPlaying, toggleMusic }) => {
  // 2. [수정] 초기 인덱스 계산 함수
  const getInitialIndex = () => {
    if (!initialId) return 0; // 없으면 0번(루브르)
    // museums 배열에서 dataKey가 initialId('orsay')인 것의 순서를 찾음
    const foundIndex = museums.findIndex((m) => m.dataKey === initialId);
    return foundIndex !== -1 ? foundIndex : 0;
  };

  // 3. [수정] useState 초기값에 계산 함수 넣기
  const [currentIdx, setCurrentIdx] = useState(getInitialIndex);

  const prevIdx = (currentIdx - 1 + museums.length) % museums.length;
  const nextIdx = (currentIdx + 1) % museums.length;

  const handleNext = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setCurrentIdx(nextIdx);
  };
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx(prevIdx);
  };

  const handleImageClick = () => {
    const selectedDataKey = museums[currentIdx].dataKey; // 현재 보고 있는 미술관의 ID 추출
    console.log(`선택된 미술관: ${selectedDataKey}`);

    if (onMuseumSelect) {
      onMuseumSelect(selectedDataKey); // App.js로 ID 전달 -> 화면 전환!
    }
  };

  return (
    <div className="map-container">
      {/* 1. 상단 네비게이션 - 뒤로가기 버튼만 남김 */}
      <div className="map-navbar">
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

      {/* [수정] 1. 배경용 3D 캔버스 (흐린 셰이더 효과) */}
      <div className="bg-canvas-wrapper">
        {/* 중앙과 동일한 Scene을 사용해 같은 효과 적용 */}
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene currentIndex={currentIdx} />
        </Canvas>
      </div>

      {/* 2. 중앙 3D 캔버스 (선명한 물결 효과) - 기존 유지 */}
      <div
        className="canvas-wrapper"
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene currentIndex={currentIdx} />
        </Canvas>
      </div>

      {/* 3. UI 레이어 (기존 유지) */}
      <div className="map-ui">
        <div className="side-nav prev" onClick={handlePrev}>
          <img src={museums[prevIdx].img} alt="prev" />
        </div>
        <div className="side-nav next" onClick={handleNext}>
          <img src={museums[nextIdx].img} alt="next" />
        </div>
        <div className="text-container">
          <h2 className="museum-name fade-in-up" key={currentIdx}>
            {museums[currentIdx].name}
          </h2>
          <p
            className="enter-msg fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            입장하려면 사진을 클릭하세요
          </p>
        </div>

        {/* ★★★ [추가] 하단 중앙 최종 결정 버튼 ★★★ */}
        <div className="bottom-center-controls">
          <button className="final-decision-btn" onClick={onFinalDecision}>
            최종 결정하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
