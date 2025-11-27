// src/Background.js
import React, { useRef, useEffect } from 'react';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 캔버스 크기 설정 함수
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    // 점(Particle) 설정
    const particlesArray = [];
    const numberOfParticles = 100; // 점의 개수 (조절 가능)

    // Ripple 설정
    const ripplesArray = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 100 + 50; // 점 크기 (5 ~ 15)
        this.speedX = Math.random() * 1.5 - 0.75; // X축 이동 속도
        this.speedY = Math.random() * 1.5 - 0.75; // Y축 이동 속도
        this.color = 'rgba(255, 255, 255, 0.1)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 화면 밖으로 나가면 반대편에서 다시 등장
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        // Drop shadow 효과
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 100;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // 그림자 효과 초기화
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 150;
        this.speed = 3;
        this.opacity = 1;
      }

      update() {
        this.radius += this.speed;
        this.opacity = 1 - this.radius / this.maxRadius;
      }

      draw() {
        ctx.strokeStyle = `rgba(90, 78, 61, ${this.opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      isFinished() {
        return this.radius >= this.maxRadius;
      }
    }

    // 파티클 초기화
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    init();

    // 클릭 이벤트로 ripple 생성
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripplesArray.push(new Ripple(x, y));
    };

    canvas.addEventListener('click', handleClick);

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임 지우기

      // 파티클 그리기
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      // Ripple 그리기 및 업데이트
      for (let i = ripplesArray.length - 1; i >= 0; i--) {
        ripplesArray[i].update();
        ripplesArray[i].draw();

        if (ripplesArray[i].isFinished()) {
          ripplesArray.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 화면 크기 조절 시 캔버스 리사이징
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', // 화면에 고정
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // 다른 콘텐츠 뒤로 보내기
        pointerEvents: 'auto', // ripple 효과를 위해 클릭 가능하게 변경
        cursor: 'pointer',
      }}
    />
  );
};

export default Background;
