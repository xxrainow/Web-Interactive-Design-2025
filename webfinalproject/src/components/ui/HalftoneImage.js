// src/HalftoneImage.js
import React, { useRef, useEffect, useState } from 'react';

const HalftoneImage = ({ src, cellSize = 8, color = 'white' }) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(new Image());

  // 1. 이미지 소스 로딩 시작
  useEffect(() => {
    imgRef.current.src = src;
    imgRef.current.crossOrigin = 'Anonymous'; // 혹시 모를 CORS 문제 방지
    imgRef.current.onload = () => {
      setImageLoaded(true);
    };
  }, [src]);

  // 2. 이미지가 로드되면 캔버스에 도트 그리기 시작
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    // 캔버스 크기를 이미지 크기와 맞춤
    canvas.width = img.width;
    canvas.height = img.height;

    // --- 하프톤 로직 시작 ---

    // (A) 원본 이미지를 보이지 않는 곳에 그려서 픽셀 데이터 추출
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = img.width;
    hiddenCanvas.height = img.height;
    const hiddenCtx = hiddenCanvas.getContext('2d');
    hiddenCtx.drawImage(img, 0, 0);

    const imageData = hiddenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data; // 픽셀들의 RGBA 정보가 담긴 배열

    // (B) 그릴 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color; // 도트 색상 설정

    // (C) 격자 단위로 반복하며 도트 그리기
    // cellSize: 격자 하나의 크기 (값이 클수록 점 간격이 넓어짐)
    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        // 현재 격자 위치의 픽셀 인덱스 계산
        const i = (y * canvas.width + x) * 4;

        // 픽셀의 RGB 값 가져오기
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // 밝기 계산 (표준 공식): 0(검정) ~ 255(흰색)
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // 밝기에 비례하여 반지름 결정
        // 최대 반지름은 셀 사이즈의 절반보다 약간 크게 설정하여 겹치는 느낌 구현
        const maxRadius = cellSize / 1.6;
        // 밝기가 255면 maxRadius, 밝기가 0이면 반지름 0
        const radius = (brightness / 255) * maxRadius;

        // 도트(원) 그리기
        if (radius > 0.5) {
          // 너무 작은 점은 그리지 않음
          ctx.beginPath();
          // x + cellSize / 2 : 격자의 중앙에 점을 찍기 위함
          ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    // --- 하프톤 로직 끝 ---
  }, [imageLoaded, cellSize, color]);

  return <canvas ref={canvasRef} className="halftone-canvas" />;
};

export default HalftoneImage;
