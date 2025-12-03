import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MagnifyingIntro from './components/MagnifyingIntro'; 
import ArtworkGallery from './components/ArtworkGallery';

const MuseumFlow = ({ museumData, onBack }) => {
  // 화면 상태: 'intro'(설명/돋보기) -> 'gallery'(작품리스트)
  const [viewState, setViewState] = useState('intro');

  // 데이터가 없으면 렌더링 안 함 (에러 방지)
  if (!museumData) return null;

  return (
    <div className="museum-flow-container">
      <AnimatePresence mode="wait">
        
        {/* 1단계: 미술관 내부 설명 화면 (돋보기 효과) */}
        {viewState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flow-wrapper"
            style={{ width: '100%', height: '100%' }} // 스타일 잡기
          >
            {/* ★ 중요: MagnifyingIntro는 이름(data.name)과 이미지(data.intro)가 다 필요해서
              museumData 전체를 넘겨줌
            */}
            <MagnifyingIntro 
              data={museumData} 
              onNext={() => setViewState('gallery')} 
            />
          </motion.div>
        )}

        {/* 2단계: 작품 리스트 화면 */}
        {viewState === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: 50 }} // 오른쪽에서 스윽 등장
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}   // 왼쪽으로 사라짐
            transition={{ duration: 0.5 }}
            className="flow-wrapper"
            style={{ width: '100%', height: '100%' }}
          >
            <ArtworkGallery 
              artworks={museumData.artworks} 
              onBack={() => setViewState('intro')} // 다시 돋보기 보러 가기
              onExit={onBack} // 아예 지도로 나가기 (App.js의 handleBackToMap 실행)
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default MuseumFlow;
