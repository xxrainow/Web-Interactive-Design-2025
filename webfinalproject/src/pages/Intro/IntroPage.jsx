import React, { useState, useRef, useEffect, useCallback } from 'react';
import './IntroPage.css';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react'; // ArrowLeft 추가
import $ from 'jquery';
import 'jquery.ripples';

import IntroBG from '../../assets/images/IntroBG.png';
import MuseumBG from '../../assets/images/MuseumBG.jpg';
import bgMusic from '../../assets/sounds/IntroBGM.mp3';

const IntroPage = ({ onEnter, initialStep = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const bgRef = useRef(null);
  const [step, setStep] = useState(initialStep);

  // ---------------------------------------------------------
  // 🌊 jQuery Ripple Effect
  // ---------------------------------------------------------
  useEffect(() => {
    if (step !== 0) return;
    const $el = $(bgRef.current);
    $el.ripples({
      imageUrl: IntroBG,
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.015,
      interactive: true,
    });
    return () => {
      if ($el && $el.ripples) $el.ripples('destroy');
    };
  }, [step]);

  // ---------------------------------------------------------

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = useCallback(() => {
    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {
      onEnter();
    }
  }, [step, onEnter]);

  // 🔙 뒤로가기 함수 추가
  const handleBack = (e) => {
    e.stopPropagation(); // 배경 클릭 방지
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  // ★★★★★ 화면 배경 클릭 감지 함수
  const handleContainerClick = () => {
    // Step 1일 때만! 화면 어디를 눌러도 넘어감
    if (step === 1) {
      handleNext();
    }
    // Step 0(시작)이나 Step 2(편지)는 버튼을 눌러야만 함
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleNext();
      // (선택사항) 백스페이스 누르면 뒤로가기
      if (e.key === 'Backspace' && step > 0) setStep((prev) => prev - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleNext]);

  return (
    <div
      className="intro-container"
      onClick={
        handleContainerClick
      } /* ★★★★★ 여기서 전체 클릭 감지, 클릭가능한 곳만 손모양으로 바뀜*/
      style={{ cursor: step === 1 ? 'pointer' : 'default' }}
    >
      <audio ref={audioRef} src={bgMusic} loop />

      {step === 0 && (
        <div
          ref={bgRef}
          className="background-image"
          style={{ backgroundImage: `url(${IntroBG})` }}
        ></div>
      )}

      {step > 0 && (
        <div
          className="background-image fade-in"
          style={{ backgroundImage: `url(${MuseumBG})` }}
        ></div>
      )}

      <div className="overlay"></div>

      {/* 🧭 상단 네비게이션 (구조 변경됨) */}
      <header className="navbar">
        {/* [왼쪽] 뒤로가기 버튼 (Step 1부터 등장) */}
        <div className="nav-left">
          {step > 0 && (
            <div className="icon-btn fade-in" onClick={handleBack}>
              <ArrowLeft color="white" size={24} />
            </div>
          )}
        </div>

        {/* [중앙] Info / List */}
        <div className="nav-center">
          {step === 0 && (
            <div className="nav-links fade-in">
              <span className="nav-item">info</span>
              <span className="nav-item">list</span>
            </div>
          )}
        </div>

        {/* [오른쪽] 음악 아이콘 */}
        <div className="nav-right">
          <div className="icon-btn" onClick={toggleMusic}>
            {isPlaying ? (
              <Volume2 color="white" size={24} />
            ) : (
              <VolumeX color="white" size={24} />
            )}
          </div>
        </div>
      </header>

      <main className="main-content fade-in">
        {step === 0 && (
          <>
            <h1 className="main-title">Find a Piece of Art in Paris</h1>
            <p className="sub-title">파리의 미술작품을 탐험해보세요</p>
            <button className="enter-button" onClick={handleNext}>
              ENTER
            </button>
          </>
        )}

        {step === 1 && (
          <div
            className="story-text-box"
            onClick={handleNext}
            style={{ cursor: 'pointer' }} // 클릭해도 다음으로 넘어갈 수 있음
          >
            <p>당신은 파리에서 여행하며 의뢰를 받아</p>
            <p>누군가의 소원을 이루어주는 해결사입니다</p>
            <div
              className="guide-text"
              style={{ marginTop: '4rem', fontSize: '0.9rem', opacity: 0.7 }}
            >
              (Press Enter to continue)
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="story-text-box">
            <p>당신에게로 한 통의 편지가 도착했습니다</p>
            <p className="story-highlight">확인하시겠습니까?</p>
            <button className="enter-button small-btn" onClick={handleNext}>
              YES
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default IntroPage;
