import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MagnifyingIntro from './components/MagnifyingIntro';
import ArtworkGallery from './components/ArtworkGallery';

const MuseumFlow = ({ museumData, onBack }) => {
  // 화면 상태: 'intro'(설명/돋보기) -> 'gallery'(작품리스트)
  const [viewState, setViewState] = useState('intro');
  // 1. 오디오 객체를 담을 ref 생성 (리렌더링 되어도 끊기지 않도록)
  const audioRef = useRef(null);
  // 2. 미술관 데이터가 변경되거나 컴포넌트가 처음 뜰 때 음악 재생
  useEffect(() => {
    if (!museumData || !museumData.audioSrc) return;

    // 기존에 재생 중인 오디오가 있다면 정지 (안전 장치)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 새로운 오디오 객체 생성 및 설정
    const audio = new Audio(museumData.audioSrc);
    audio.loop = true; // 반복 재생 설정
    audio.volume = 0.1; // 볼륨 조절 (0.0 ~ 1.0)

    // 재생 시도 (브라우저 정책상 인터랙션 없으면 실패할 수 있으므로 catch 처리)
    audio.play().catch((err) => {
      console.log('배경음악 자동 재생이 차단되었습니다:', err);
    });

    // ref에 저장
    audioRef.current = audio;

    // --- [재생 및 Fade In 시작] ---
    audio.play()
      .then(() => {
        // 0.1초마다 볼륨을 0.05씩 증가 (목표: 0.5)
        const fadeInInterval = setInterval(() => {
          // 오디오가 멈췄거나 볼륨이 목표치에 도달하면 중단
          if (!audio || audio.volume >= 0.5) {
            clearInterval(fadeInInterval);
            return;
          }
          
          // 볼륨 증가 (최대 0.5를 넘지 않도록 Math.min 사용)
          audio.volume = Math.min(audio.volume + 0.05, 0.5);
        }, 100); 
      })
      .catch((err) => {
        console.log('배경음악 자동 재생이 차단되었습니다:', err);
      });

    // --- [Cleanup: Fade Out 처리] ---
    // 컴포넌트가 사라지거나(Unmount), 데이터가 바뀔 때 실행
    return () => {
      const audioToStop = audioRef.current; // 현재 재생 중인 오디오를 변수에 캡처

      if (audioToStop) {
        // 즉시 멈추지 않고, 0.05초마다 볼륨을 줄이는 타이머 실행
        const fadeOutInterval = setInterval(() => {
          // 볼륨이 0보다 크면 계속 줄임
          if (audioToStop.volume > 0.05) {
            audioToStop.volume -= 0.05;
          } else {
            // 볼륨이 거의 0이 되면 완전히 멈추고 타이머 해제
            audioToStop.volume = 0;
            audioToStop.pause();
            clearInterval(fadeOutInterval);
          }
        }, 50); // Fade Out은 좀 더 빠르게 (50ms 간격)
      }
    };
  }, [museumData]);

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
            exit={{ opacity: 0, x: -50 }} // 왼쪽으로 사라짐
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
