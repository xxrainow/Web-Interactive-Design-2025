import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = ({ audioSrc, trackName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const skipForward = () => {
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  };

  return (
    <div className="panel player-panel">
      <audio ref={audioRef} src={audioSrc} />
      
      <div className="player-info">
        <span className="icon">💿</span>
        <span className="track-name">{trackName || 'No track loaded'}</span>
      </div>
      
      <div className="player-controls">
        <button onClick={skipBackward} title="10초 뒤로">◀◀</button>
        <button onClick={togglePlay} title={isPlaying ? '일시정지' : '재생'}>
          {isPlaying ? '⏸︎' : '▶'}
        </button>
        <button onClick={skipForward} title="10초 앞으로">▶▶</button>
      </div>
    </div>
  );
};

export default MusicPlayer;
