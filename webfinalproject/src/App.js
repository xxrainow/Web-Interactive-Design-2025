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
  const currentTrackIdRef = useRef(null);

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
      case 'intro-back': // ★ intro-back 추가!
      case 'request':
      case 'clue': // 단서 페이지도 인트로 음악 유지 추천
      case 'loading': // 로딩까지도 유지
        return { src: introBGM, id: 'INTRO' };
      case 'map':
        return { src: mapBGM, id: 'MAP' };
      case 'detail': // 미술관 상세에서는 미술관별 음악이 나오므로 없음
        return { src: null, id: 'NONE' };
      case 'final':
        return { src: mapBGM, id: 'MAP' };
      default:
        return { src: mapBGM, id: 'MAP' }; // 기본값
    }
  };

  // ------------------------------------------------------------
  // 🎵 [핵심 로직] 페이지가 바뀔 때 음악 교체하기
  // ------------------------------------------------------------
  useEffect(() => {
    if (!audioRef.current) return;

    const { src: targetSrc, id: targetId } = getBgmForPage(currentPage);

    // 🔍 [디버그] useEffect 실행 시점
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎵 [DEBUG] useEffect 실행됨');
    console.log('📍 현재 페이지:', currentPage);
    console.log('🎯 목표 BGM ID:', targetId);
    console.log('💿 현재 저장된 ID:', currentTrackIdRef.current);
    console.log('🔄 ID 같은가?:', currentTrackIdRef.current === targetId);

    const handleMusicChange = async () => {
      // 1. 틀어야 할 음악이 없는 경우 ('NONE')
      if (!targetSrc) {
        console.log('⏸️ [DEBUG] 음악 없음 - 정지');
        audioRef.current.pause();
        currentTrackIdRef.current = 'NONE';
        return;
      }

      // 2. ★★★ 같은 ID면 아무것도 하지 않음 (음악 유지) ★★★
      if (currentTrackIdRef.current === targetId) {
        console.log('✅ [DEBUG] ID 동일! 음악 유지 (새로고침 안 함)');
        return; // 여기서 함수 종료 - 음악 그대로 유지
      }

      // --- 여기서부터는 음악이 다를 때만 실행됨 ---
      console.log('🔀 [DEBUG] ID 다름! 음악 교체 시작...');
      console.log('   이전 ID:', currentTrackIdRef.current);
      console.log('   새 ID:', targetId);

      // 3. 현재 재생 중이었는지 기억
      const wasPlaying = !audioRef.current.paused;
      console.log('🎧 [DEBUG] 이전에 재생 중이었나?:', wasPlaying);

      try {
        // 4. 현재 트랙 ID 업데이트
        currentTrackIdRef.current = targetId;
        console.log('💾 [DEBUG] ID 업데이트됨:', currentTrackIdRef.current);

        // 5. 기존 음악 정지 & 소스 교체
        audioRef.current.pause();
        audioRef.current.src = targetSrc;
        audioRef.current.load();
        console.log('📀 [DEBUG] 새 음악 로드됨');

        // 6. 이전에 재생 중이었다면 새 음악도 재생
        if (wasPlaying) {
          audioRef.current.volume = 0.5;
          await audioRef.current.play();
          console.log('▶️ [DEBUG] 새 음악 재생 시작');
        }
      } catch (err) {
        console.log('❌ 음악 교체 중 오류:', err);
      }
    };

    handleMusicChange();
  }, [currentPage]); // 페이지 변경 시에만 실행

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
    const { src } = getBgmForPage(currentPage); // 정보 가져오기
    // 음악이 있는 페이지이고, 오디오가 멈춰있다면
    if (src && audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch((e) => console.log(e));
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
