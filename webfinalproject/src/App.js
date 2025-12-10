// src/App.js
import React, { useState, useEffect, useRef } from 'react';
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
import completeBGM from './assets/sounds/completeBGM.mp3';

function App() {
  const [currentPage, setCurrentPage] = useState('intro');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const audioRef = useRef(null);
  const currentTrackIdRef = useRef(null);
  // ★ [추가] 페이드 효과 타이머를 관리하기 위한 Ref
  const fadeIntervalRef = useRef(null);

  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [lastViewedId, setLastViewedId] = useState('louvre');
  const [selectedArt, setSelectedArt] = useState({ name: '', image: '' });

  // ------------------------------------------------------------
  // 🎵 [헬퍼 함수] 페이드 타이머 정리
  // ------------------------------------------------------------
  const clearFadeInterval = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  // ------------------------------------------------------------
  // 🎵 [헬퍼 함수] Fade In (볼륨 0 -> 0.5)
  // ------------------------------------------------------------
  const fadeIn = (audio) => {
    clearFadeInterval();
    audio.volume = 0;
    audio.play().catch((e) => console.log('재생 오류:', e));

    fadeIntervalRef.current = setInterval(() => {
      // 목표 볼륨(0.5)보다 작으면 증가
      if (audio.volume < 0.5) {
        // 부동소수점 계산 오차 방지를 위해 toFixed 사용 가능하나 간단히 처리
        const newVolume = Math.min(audio.volume + 0.05, 0.5);
        audio.volume = newVolume;
      } else {
        // 목표 도달 시 종료
        clearFadeInterval();
      }
    }, 100); // 0.1초마다 실행
  };

  // ------------------------------------------------------------
  // 🎵 [헬퍼 함수] Fade Out (현재 볼륨 -> 0)
  // ------------------------------------------------------------
  const fadeOut = (audio, callback) => {
    clearFadeInterval();

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > 0) {
        const newVolume = Math.max(audio.volume - 0.05, 0);
        audio.volume = newVolume;
      } else {
        // 볼륨이 0이 되면 정지하고 콜백 실행
        clearFadeInterval();
        audio.pause();
        if (callback) callback();
      }
    }, 100);
  };

  // ------------------------------------------------------------
  // 🎵 [핵심 로직] 페이지별 BGM 매핑
  // ------------------------------------------------------------
  const getBgmForPage = (pageName) => {
    switch (pageName) {
      case 'intro':
      case 'intro-back':
      case 'request':
      case 'clue':
      case 'loading':
        return { src: introBGM, id: 'INTRO' };
      case 'map':
        return { src: mapBGM, id: 'MAP' };
      case 'detail':
        return { src: null, id: 'NONE' };
      case 'final':
        return { src: mapBGM, id: 'MAP' };
      case 'complete':
        return { src: completeBGM, id: 'COMPLETE' };
      default:
        return { src: mapBGM, id: 'MAP' };
    }
  };

  // ------------------------------------------------------------
  // 🎵 [핵심 로직] 페이지가 바뀔 때 음악 교체하기 (Fade 적용)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!audioRef.current) return;

    const { src: targetSrc, id: targetId } = getBgmForPage(currentPage);

    // 1. 같은 음악이면 유지 (아무것도 안 함)
    if (currentTrackIdRef.current === targetId) {
      // 만약 멈춰있는데 재생 상태여야 한다면 Fade In으로 부드럽게 재생
      if (isMusicPlaying && audioRef.current.paused) {
        fadeIn(audioRef.current);
      }
      return;
    }

    // 2. 음악 교체 로직 시작
    const handleMusicChange = () => {
      // (A) 다음 곡이 '없음(NONE)'인 경우 -> 즉시 ID 업데이트 후 Fade Out
      if (!targetSrc) {
        // ★ 먼저 ID를 NONE으로 설정 (fadeOut 완료 전에 페이지 이동해도 반영되도록)
        currentTrackIdRef.current = 'NONE';
        fadeOut(audioRef.current, () => {
          console.log('🔇 [DEBUG] NONE으로 fadeOut 완료');
        });
        return;
      }

      // (B) 다음 곡이 있는 경우
      // ★ 이전 트랙이 'NONE'이었는지 또는 오디오가 멈춰있는지 확인
      const wasNone = currentTrackIdRef.current === 'NONE';
      const wasPaused = audioRef.current.paused;

      // 현재 재생 중이라면 -> Fade Out -> 소스 교체 -> Fade In
      if (!audioRef.current.paused) {
        fadeOut(audioRef.current, async () => {
          // Fade Out이 끝난 후 실행될 로직
          currentTrackIdRef.current = targetId;
          audioRef.current.src = targetSrc;

          // ★ 로드 완료 후 재생
          audioRef.current.oncanplaythrough = () => {
            audioRef.current.oncanplaythrough = null; // 이벤트 제거
            fadeIn(audioRef.current);
            setIsMusicPlaying(true);
            console.log('▶️ [DEBUG] 새 음악 재생 시작 (Fade Out 후)');
          };
          audioRef.current.load();
        });
      } else {
        // 현재 멈춰있다면(첫 진입 또는 NONE에서 복귀) -> 바로 소스 교체 -> Fade In
        console.log('🔍 [DEBUG] else 블록 진입 (오디오 멈춰있음)');
        console.log('🔍 [DEBUG] wasNone:', wasNone);
        console.log('🔍 [DEBUG] wasPaused:', wasPaused);
        console.log('🔍 [DEBUG] isMusicPlaying:', isMusicPlaying);

        currentTrackIdRef.current = targetId;
        audioRef.current.src = targetSrc;
        console.log('📀 [DEBUG] src 설정됨:', targetSrc);

        // ★ 오디오가 멈춰있었다면 (detail에서 fadeOut되어 멈춘 경우 포함) Fade In
        // wasNone, wasPaused, 또는 isMusicPlaying 중 하나라도 true면 재생
        if (wasNone || wasPaused || isMusicPlaying) {
          console.log('✅ [DEBUG] 조건 통과! 로드 시작...');

          // ★ 로드 완료 후 재생
          audioRef.current.oncanplaythrough = () => {
            console.log('🎵 [DEBUG] oncanplaythrough 이벤트 발생!');
            audioRef.current.oncanplaythrough = null; // 이벤트 제거
            fadeIn(audioRef.current);
            setIsMusicPlaying(true);
            console.log('▶️ [DEBUG] 새 음악 재생 시작 (NONE에서 복귀)');
          };

          // 다른 이벤트들도 확인
          audioRef.current.onloadeddata = () => {
            console.log('📥 [DEBUG] onloadeddata 이벤트 발생!');
          };
          audioRef.current.onerror = (e) => {
            console.log('❌ [DEBUG] 오디오 에러:', e);
          };

          audioRef.current.load();
          console.log('⏳ [DEBUG] load() 호출됨');
        } else {
          console.log('⏸️ [DEBUG] 조건 불충족 - 재생 안 함');
          audioRef.current.load();
        }
      }
    };

    handleMusicChange();

    // cleanup: 컴포넌트 언마운트 시 인터벌 정리
    return () => clearFadeInterval();
  }, [currentPage]); // isMusicPlaying은 제외 (재생 상태 변경은 toggleMusic에서 처리)

  // 🎵 음악 토글 버튼 함수
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      // 켜져있으면 -> 끔 (Fade Out)
      fadeOut(audioRef.current, () => {
        setIsMusicPlaying(false);
      });
    } else {
      // 꺼져있으면 -> 켬 (Fade In)
      // 현재 페이지에 맞는 음악이 로드되어 있는지 확인
      const { src } = getBgmForPage(currentPage);
      // 만약 src가 없거나 현재 src가 비어있으면 로드
      if (src && (!audioRef.current.src || audioRef.current.src === '')) {
        audioRef.current.src = src;
        audioRef.current.load();
      }

      setIsMusicPlaying(true);
      fadeIn(audioRef.current);
    }
  };

  // 🎵 음악 강제 재생 시도 (클릭 시 등)
  const ensureMusicPlays = async () => {
    const { src } = getBgmForPage(currentPage);
    if (src && audioRef.current && audioRef.current.paused) {
      // Fade In으로 부드럽게 시작
      setIsMusicPlaying(true);
      fadeIn(audioRef.current);
    }
  };

  // 앱 처음 실행 시 한 번 재생 시도
  useEffect(() => {
    ensureMusicPlays();
  }, []);

  // ----------------------- 네비게이션 핸들러 -----------------------
  // ... (이 아래 코드는 기존과 동일하므로 그대로 두시면 됩니다) ...
  const handleIntroComplete = () => setCurrentPage('request');
  const handleRequestNext = () => setCurrentPage('clue');
  const handleClueNext = () => setCurrentPage('loading');
  const handleLoadingComplete = () => setCurrentPage('map');
  const handleBackToIntroBack = () => setCurrentPage('intro-back');
  const handleBackToIntro = () => setCurrentPage('intro');
  const handleBackToClue = () => setCurrentPage('clue');

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

  const handleArtChoice = (artName, artImage) => {
    setSelectedArt({ name: artName, image: artImage });
    setCurrentPage('result-loading');
  };

  const handleResultReveal = () => {
    // 선택한 작품에 따라 complete 또는 fail 페이지로 분리
    if (
      selectedArt.name &&
      selectedArt.name.includes('아를의 별이 빛나는 밤')
    ) {
      setCurrentPage('complete');
    } else {
      setCurrentPage('fail');
    }
  };

  const handleRetry = () => {
    setCurrentPage('map');
    setSelectedArt({ name: '', image: '' });
  };

  return (
    <div className="App">
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
            // 화면 클릭 시 Fade In으로 재생 시도
            onClick={() => ensureMusicPlays()}
          >
            <IntroPage
              onEnter={handleIntroComplete}
              initialStep={0}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}

        {/* ... (나머지 페이지들 기존과 동일) ... */}
        {currentPage === 'request' && (
          <motion.div
            key="request"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <RequestPage
              onNext={handleRequestNext}
              onBack={handleBackToIntroBack}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}
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
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}
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
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}
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
        {currentPage === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="page-wrapper"
          >
            <CompletePage
              selectedArtName={selectedArt.name}
              selectedArtImage={selectedArt.image}
              onReset={handleBackToIntro}
            />
          </motion.div>
        )}
        {currentPage === 'fail' && (
          <motion.div
            key="fail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-wrapper"
          >
            <FailPage
              selectedArtName={selectedArt.name}
              selectedArtImage={selectedArt.image}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
        {currentPage === 'intro-back' && (
          <motion.div
            key="intro-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="page-wrapper"
            onClick={() => ensureMusicPlays()}
          >
            <IntroPage
              onEnter={handleIntroComplete}
              initialStep={2}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
