import { Pause, Play } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // percent
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    audio.currentTime = currentTime;
    setCurrentTime(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * audio.duration;

    audio.currentTime = newProgress;
    setCurrentTime(newProgress);
    setProgress((newProgress / audio.duration) * 100);
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);
  
  return (
    <div className="bg-white rounded-lg p-4 max-w-md mx-auto shadow-md">
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>

        <div
          ref={progressRef}
          onClick={handleSeek}
          className="flex-1 cursor-pointer"
        >
          <div className="bg-gray-200 rounded-full h-2 relative">
            <div
              className="bg-purple-600 h-2 rounded-full absolute top-0 left-0"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <span className="text-sm text-gray-500 whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioPlayer;
