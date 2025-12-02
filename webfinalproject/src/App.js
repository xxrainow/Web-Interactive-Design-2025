import React, { useState } from 'react';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion'; // 1. framer-motion 불러오기

// 페이지들 불러오기
import IntroPage from './pages/Intro/IntroPage';
import RequestPage from './pages/Story/RequestPage';
import CluePage from './pages/Story/CluePage';
import SearchLoadingPage from './pages/Story/SearchLoadingPage';
import MapPage from './pages/Map/MapPage';

function App() {
  const [currentPage, setCurrentPage] = useState('intro');

  const handleIntroComplete = () => {
    console.log('인트로 끝! 의뢰서 페이지로 이동합니다.');
    setCurrentPage('request');
  };

  const handleRequestNext = () => {
    console.log('단서 찾으러 가자!');
    setCurrentPage('clue');
  };

  const handleClueNext = () => {
    console.log('데이터 로딩 시작...');
    setCurrentPage('loading');
  };

  // ★ 3. 로딩이 끝나면(3초 뒤) -> 'map' 상태로 변경
  const handleLoadingComplete = () => {
    console.log('로딩 완료! 지도로 이동');
    setCurrentPage('map');
  };

  const handleBackToIntro = () => {
    console.log('인트로 마지막 단계로 돌아갑니다.');
    setCurrentPage('intro-back');
  };

  return (
    <div className="App">
      {/* mode="wait": 이전 페이지가 완전히 사라진(exit) 후 다음 페이지가 나타남(enter)
        영화 장면 전환 같은 느낌을 줍니다.
      */}
      <AnimatePresence mode="wait">
        {/* 1. 인트로 페이지 */}
        {currentPage === 'intro' && (
          <motion.div
            key="intro" // 키가 달라야 애니메이션이 작동함
            initial={{ opacity: 0 }} // 처음 상태 (투명)
            animate={{ opacity: 1 }} // 나타날 때 (불투명)
            exit={{ opacity: 0 }} // 사라질 때 (투명)
            transition={{ duration: 0.8 }} // 0.8초 동안 천천히
            className="page-wrapper" // 스타일링용 클래스 (선택사항)
          >
            <IntroPage onEnter={handleIntroComplete} initialStep={0} />
          </motion.div>
        )}

        {/* 2. 의뢰서(Request) 페이지 */}
        {currentPage === 'request' && (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 10 }} // 약간 아래에서 위로 올라오며 등장
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} // 위로 사라짐
            transition={{ duration: 0.8 }}
            className="page-wrapper"
          >
            <RequestPage
              onNext={handleRequestNext}
              onBack={handleBackToIntro}
            />
          </motion.div>
        )}

        {/* 3. 단서 페이지 */}
        {currentPage === 'clue' && (
          <motion.div
            key="clue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <CluePage
              onNext={handleClueNext}
              onBack={() =>
                setCurrentPage('request')
              } /* request 페이지로 이동 */
            />
          </motion.div>
        )}

        {/* ★ 4. 로딩 화면 추가 */}
        {currentPage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <SearchLoadingPage onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {/* ★ 5. 지도(Map) 페이지 */}
        {currentPage === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="page-wrapper"
          >
            <MapPage />
          </motion.div>
        )}

        {/* 인트로로 돌아가기 (같은 IntroPage지만 key를 다르게 줌) */}
        {currentPage === 'intro-back' && (
          <motion.div
            key="intro-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="page-wrapper"
          >
            <IntroPage onEnter={handleIntroComplete} initialStep={2} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
