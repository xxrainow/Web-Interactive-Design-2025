import React, { useState, useEffect } from 'react';
import watchImage from '../assets/img/watch.png';
import detectiveSource from '../assets/img/detective-source2.png';
import HalftoneImage from '../components/ui/HalftoneImage';
import MusicPlayer from '../components/ui/MusicPlayer';
import Background from '../components/ui/Background';
import audioFile from '../assets/audio/bgm.mp3';

const Recent = () => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = `X에게,

나는 평생 시계공이었소.
늘 정확한 시간만 쫓았지.

하지만 이제 깨달았소.
진짜 아름다운 건
'시간이 멈춘 듯한 순간'
이라는 것을...

그 순간을 포착한 작품을
찾아주시오.`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50); // 50ms마다 한 글자씩

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <div className="recent-page">
      {/* 떠다니는 도트 배경 */}
      <Background />

      {/* 배경 도트 탐정 이미지 - 하프톤 효과 적용 */}
      <div className="background-detective">
        <HalftoneImage src={detectiveSource} cellSize={3} color="#ffffff" />
      </div>

      {/* 상단 타이틀 문구 */}
      <div className="page-header">
        <h1 className="main-title">Find a piece of work!</h1>
      </div>

      <div className="content-wrapper">
        {/* 왼쪽 섹션: 의뢰서 */}
        <section className="left-section">
          <h1 className="page-title">Request 001</h1>

          <div className="request-card">
            <div className="card-header">
              <span>시계공의 의뢰</span>
            </div>

            <div className="card-body">
              <div className="text-area">
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  {displayedText}
                </pre>
              </div>

              {/* 회중시계 이미지 영역 */}
              <div className="image-area">
                <img src={watchImage} alt="Watch" />
              </div>
            </div>

            <button className="accept-btn">수락하기</button>
          </div>
        </section>

        {/* 오른쪽 섹션: 패널들 */}
        <section className="right-section">
          {/* 패널 1: 지침 */}
          <div className="panel guide-panel">
            <div className="panel-content">
              <h3>지침</h3>
              <p>
                의뢰서를 읽으세요.
                <br />
                의뢰를 수락하면 단서를
                <br />
                확인할 수 있습니다
              </p>
            </div>
          </div>

          {/* 패널 2: 뮤직 플레이어 */}
          <MusicPlayer audioSrc={audioFile} trackName="See The Fantasy" />
        </section>
      </div>
    </div>
  );
};

export default Recent;
