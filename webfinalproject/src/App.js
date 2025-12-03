import React, { useState } from 'react';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';

// 페이지들 불러오기
import IntroPage from './pages/Intro/IntroPage';
import RequestPage from './pages/Story/RequestPage';
import CluePage from './pages/Story/CluePage';
import SearchLoadingPage from './pages/Story/SearchLoadingPage';
import MapPage from './pages/Map/MapPage';
import MuseumFlow from './pages/Museum/MuseumFlow';
import { museumData } from './data/museumData';

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

  // 지도에서 단서 페이지로 돌아가는 함수
  const handleBackToClue = () => {
    console.log('지도에서 단서 페이지로 돌아갑니다.');
    setCurrentPage('clue');
  };

  //---------------------------------------------------------  지도 미술관 데이터 선택 부분  ---------------------------------------------------------
  //

  // 1. 선택된 미술관 데이터를 저장할 공간
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  // 2. 지도에서 핀을 클릭했을 때 실행될 함수
  const handleMuseumClick = (museumId) => {
    const museumInfo = museumData[museumId]; // 데이터 파일에서 정보 찾기
    if (museumInfo) {
      setSelectedMuseum(museumInfo); // 찾은 정보 저장
      setCurrentPage('detail'); // 페이지 전환
    } else {
      console.error('미술관 데이터를 찾을 수 없습니다:', museumId);
    }
  };

  // 3. 미술관 안에서 '나가기' 눌렀을 때 실행될 함수
  const handleBackToMap = () => {
    setCurrentPage('map');
    setSelectedMuseum(null);
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
            <MapPage
              onMuseumSelect={handleMuseumClick}
              onBack={handleBackToClue}
            />
          </motion.div>
        )}

        {/* 6. 미술관 상세 페이지 (MuseumFlow) */}
        {currentPage === 'detail' && selectedMuseum && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <MuseumFlow museumData={selectedMuseum} onBack={handleBackToMap} />
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
