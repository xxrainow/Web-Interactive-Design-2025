// src/App.js
import React, { useState, useEffect, useRef } from 'react'; // useRef, useEffect 추가 필수
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
import ResultChoicePage from './pages/Result/ResultChoicePage';
import ResultLoadingPage from './pages/Result/ResultLoadingPage';
import CompletePage from './pages/Result/CompletePage';
import FailPage from './pages/Result/FailPage';

// 음악 파일
import introBGM from './assets/sounds/introBGM.mp3';
import mapBGM from './assets/sounds/mapBGM.mp3';

function App() {
  const [currentPage, setCurrentPage] = useState('intro'); // 초기값 intro 추천
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // ★ [수정 1] audioRef 선언 필수
  const audioRef = useRef(null);

  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [lastViewedId, setLastViewedId] = useState('louvre');
  const [selectedArt, setSelectedArt] = useState({ name: '', image: '' });

  // ------------------------------------------------------------
  // 🎵 [핵심 로직] 페이지별 BGM 매핑
  // ------------------------------------------------------------
  // ★ [수정 2] 변수명 currentPage로 통일, 음악 변수명 introBGM 등으로 통일
  const getBgmForPage = (pageName) => {
    switch (pageName) {
      case 'intro':
      case 'request':
      case 'clue': // 단서 페이지도 인트로 음악 유지 추천
      case 'loading': // 로딩까지도 유지
        return introBGM;
      case 'map':
        return mapBGM;
      case 'detail': // 미술관 상세에서는 미술관별 음악이 나오므로 없음
        return null;
      case 'final':
        return mapBGM;
      default:
        return mapBGM; // 기본값
    }
  };

  // ------------------------------------------------------------
  // 🎵 [핵심 로직] 페이지가 바뀔 때 음악 교체하기
  // ------------------------------------------------------------
  useEffect(() => {
    if (!audioRef.current) return;

    const targetSrc = getBgmForPage(currentPage);

    const handleMusicChange = async () => {
      // 1. 틀어야 할 음악이 없으면 멈춤
      if (!targetSrc) {
        audioRef.current.pause();
        return;
      }

      // 2. 이미 같은 음악이 설정되어 있다면? -> 아무것도 안 함 (Return)
      // (src 속성 비교 시 전체 경로가 나오므로 includes로 확인)
      if (audioRef.current.src && audioRef.current.src.includes(targetSrc)) {
        if (isMusicPlaying && audioRef.current.paused) {
          audioRef.current.play().catch((e) => console.log(e));
        }
        return;
      }

      // 3. 음악 교체 작업
      try {
        // 기존 음악 정지
        audioRef.current.pause();

        // 소스 교체
        audioRef.current.src = targetSrc;
        audioRef.current.load(); // 새 소스 로드

        // 재생 (사용자 인터랙션이 있었다고 가정)
        if (isMusicPlaying) {
          audioRef.current.volume = 0.5;
          await audioRef.current.play();
        }
      } catch (err) {
        console.log('음악 교체 중 오류:', err);
      }
    };

    handleMusicChange();
  }, [currentPage, isMusicPlaying]); // ★ page -> currentPage 수정

  // 🎵 음악 토글 버튼 함수
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.log('재생 실패:', e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // 🎵 음악 강제 재생 시도 (클릭 시 등)
  const ensureMusicPlays = async () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => {
          console.log('재생 실패 (아직 사용자 상호작용 부족):', err);
        });
    }
  };

  // ★ [추가] 앱 처음 실행 시(새로고침 시) 한 번 재생 시도
  useEffect(() => {
    ensureMusicPlays();
  }, []);

  // ----------------------- 네비게이션 핸들러 -----------------------
  const handleIntroComplete = () => setCurrentPage('request');
  const handleRequestNext = () => setCurrentPage('clue');
  const handleClueNext = () => setCurrentPage('loading');
  const handleLoadingComplete = () => setCurrentPage('map');
  const handleBackToIntroBack = () => setCurrentPage('intro-back');
  const handleBackToIntro = () => setCurrentPage('intro');
  const handleBackToClue = () => setCurrentPage('clue');

  //--------------------  지도 미술관 데이터 선택 부분  ----------------------------
  const handleMuseumClick = (museumId) => {
    const museumInfo = museumData[museumId];
    if (museumInfo) {
      setSelectedMuseum(museumInfo);
      setLastViewedId(museumId);
      setCurrentPage('detail');
    }
  };

  const handleBackToMap = () => {
    setCurrentPage('map');
    setSelectedMuseum(null);
  };

  const handleFinalDecision = () => setCurrentPage('final');
  const handleBackFromFinal = () => setCurrentPage('map');

  // ----------------------- ★ 결과 처리 로직 -----------------------
  const handleArtChoice = (artName, artImage) => {
    setSelectedArt({ name: artName, image: artImage });
    setCurrentPage('result-loading');
  };

  const handleResultReveal = () => setCurrentPage('result-outcome');

  const handleRetry = () => {
    setCurrentPage('map');
    setSelectedArt({ name: '', image: '' });
  };

  return (
    <div className="App">
      {/* ★ [수정 3] 실제 오디오 태그가 반드시 있어야 함 */}
      <audio ref={audioRef} loop />

      <AnimatePresence mode="wait">
        {/* 1. 인트로 페이지 */}
        {currentPage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            {/* 음악 관련 props 전달 */}
            <IntroPage
              onEnter={handleIntroComplete}
              onClick={() => ensureMusicPlays()}
              initialStep={0}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}

        {/* 2. 의뢰서 페이지 */}
        {currentPage === 'request' && (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="page-wrapper"
          >
            <RequestPage
              onNext={handleRequestNext}
              onBack={handleBackToIntroBack}
              // 음악 버튼을 보여주려면 아래 props 필요
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
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
              onBack={() => setCurrentPage('request')}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}

        {/* 4. 로딩 화면 */}
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

        {/* 5. 지도 페이지 */}
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
              initialId={lastViewedId}
              onFinalDecision={handleFinalDecision}
              // 음악 버튼 props
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}

        {/* 6. 미술관 상세 페이지 */}
        {currentPage === 'detail' && selectedMuseum && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            {/* MuseumFlow 내부에서 오디오를 따로 쓰더라도, 
                배경음악을 끄고 싶다면 여기서 isMusicPlaying을 받아서 처리 가능 */}
            <MuseumFlow museumData={selectedMuseum} onBack={handleBackToMap} />
          </motion.div>
        )}

        {/* 7. 최종 결정 페이지 */}
        {currentPage === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <ResultChoicePage
              onComplete={handleArtChoice}
              onBack={handleBackFromFinal}
            />
          </motion.div>
        )}

        {/* 8. 결과 로딩 */}
        {currentPage === 'result-loading' && (
          <motion.div
            key="result-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <ResultLoadingPage
              selectedArtName={selectedArt.name}
              onComplete={handleResultReveal}
            />
          </motion.div>
        )}

        {/* 9. 결과 (성공/실패) */}
        {currentPage === 'result-outcome' && (
          <motion.div
            key="result-outcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            {selectedArt.name &&
            selectedArt.name.includes('아를의 별이 빛나는 밤') ? (
              <CompletePage
                selectedArtName={selectedArt.name}
                selectedArtImage={selectedArt.image}
                onReset={handleBackToIntro}
              />
            ) : (
              <FailPage
                selectedArtName={selectedArt.name}
                selectedArtImage={selectedArt.image}
                onRetry={handleRetry}
              />
            )}
          </motion.div>
        )}

        {/* 인트로로 돌아가기 (다시 보기) */}
        {currentPage === 'intro-back' && (
          <motion.div
            key="intro-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="page-wrapper"
          >
            <IntroPage
              onEnter={handleIntroComplete}
              initialStep={2}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
              ensureMusicPlays={ensureMusicPlays}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
