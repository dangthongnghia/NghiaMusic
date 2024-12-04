import React, { useState } from 'react';
import { 
  FaPlayCircle, 
  FaPauseCircle, 
  FaStepForward, 
  FaStepBackward, 
  FaRedoAlt,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute 
} from 'react-icons/fa';
import './ProgressBar.css';

const formatTime = (timeInSeconds) => {
  if (!timeInSeconds) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const ProgressBar = ({
  currentSong = {},
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 1,
  onPlayPause,
  onNext,
  onPrev,
  onRepeat,
  onSeek,
  onVolumeChange
}) => {
  const [prevVolume, setPrevVolume] = useState(volume);

  const handleVolumeClick = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(prevVolume);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  return (
    <div className="player-container">
      <div className="unified-player">
        {/* Left: Song Info */}
        <div className="song-info">
          {currentSong?.image && (
            <img src={currentSong.image} alt={currentSong.name || 'Song cover'} />
          )}
          <div className="song-details">
            <h3>{currentSong?.name || 'No song selected'}</h3>
            <p>{currentSong?.artist || 'Unknown artist'}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            <button className="control-btn" onClick={onPrev}>
              <FaStepBackward />
            </button>
            <button className="play-btn" onClick={onPlayPause}>
              {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
            </button>
            <button className="control-btn" onClick={onNext}>
              <FaStepForward />
            </button>
            <button className="control-btn" onClick={onRepeat}>
              <FaRedoAlt />
            </button>
          </div>
          
          <div className="progress-bar">
            <span className="time-display">{formatTime(currentTime)}</span>
            <input
              type="range"
              value={currentTime}
              max={duration}
              onChange={(e) => onSeek(e.target.value)}
            />
            <span className="time-display">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="volume-control">
          <button 
            className="volume-btn"
            onClick={handleVolumeClick}
          >
            {getVolumeIcon()}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>
        <div className="player-options">
          {/* Add volume controls here if needed */}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;