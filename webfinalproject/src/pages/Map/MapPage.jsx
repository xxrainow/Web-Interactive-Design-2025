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

import { WaveShaderMaterial } from './WaveShaderMaterial';

import imgLouvre from '../../assets/images/map/louvre_out.jpg';
import imgOrsay from '../../assets/images/map/orsay_out.jpg';
import imgPompidou from '../../assets/images/map/pompidou_out.jpg';
import imgOrangerie from '../../assets/images/map/orangerie_out.jpg';

extend({ WaveShaderMaterial });

export const museums = [
  { id: 0, name: 'Musee du Louvre', img: imgLouvre },
  { id: 1, name: "Musee d'Orsay", img: imgOrsay },
  { id: 2, name: 'Centre Pompidou', img: imgPompidou },
  { id: 3, name: "Musee de l'Orangerie", img: imgOrangerie },
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
const MapPage = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevIdx = (currentIdx - 1 + museums.length) % museums.length;
  const nextIdx = (currentIdx + 1) % museums.length;

  const handleNext = () => {
    setCurrentIdx(nextIdx);
  };
  const handlePrev = () => {
    setCurrentIdx(prevIdx);
  };

  return (
    <div className="map-container">
      {/* [수정] 1. 배경용 3D 캔버스 (흐린 셰이더 효과) */}
      <div className="bg-canvas-wrapper">
        {/* 중앙과 동일한 Scene을 사용해 같은 효과 적용 */}
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene currentIndex={currentIdx} />
        </Canvas>
      </div>

      {/* 2. 중앙 3D 캔버스 (선명한 물결 효과) - 기존 유지 */}
      <div className="canvas-wrapper">
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
      </div>
    </div>
  );
};

export default MapPage;
