import { useState, useRef, useEffect } from 'react';
import { searchTrack } from '../services/itunes';

const AudioPreview = ({ song, albumArtist, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPreview, setHasPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const audioRef = useRef(null);
  const instanceId = useRef(Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    let isMounted = true;
    const fetchPreview = async () => {
      setIsLoading(true);
      const result = await searchTrack(albumArtist, song.title);
      if (isMounted) {
        if (result?.previewUrl) {
          setPreviewUrl(result.previewUrl);
          setHasPreview(true);
        }
        setIsLoading(false);
      }
    };
    fetchPreview();
    return () => { isMounted = false; };
  }, [song.title, albumArtist]);

  // Listen for play events from other instances
  useEffect(() => {
    const handleOtherPlay = (e) => {
      if (e.detail.id !== instanceId.current && isPlaying) {
        // Another track started playing, stop this one
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    };
    window.addEventListener('audio-play-started', handleOtherPlay);
    return () => {
      window.removeEventListener('audio-play-started', handleOtherPlay);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !previewUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause all audio elements directly (redundant but safe)
      document.querySelectorAll('audio').forEach(a => a.pause());
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('audio-play-started', { detail: { id: instanceId.current } }));
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`track-row ${hasPreview ? 'has-preview' : 'no-preview'} ${isPlaying ? 'playing' : ''}`}>
      <span className="track-number">{index + 1}</span>
      <div className="track-info">
        <span className="track-title">{song.title}</span>
        {isLoading && <span className="track-loading">…</span>}
      </div>
      <span className="track-duration">{song.duration}</span>
      {hasPreview && !isLoading && (
        <button 
          className={`track-play ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      )}
      {hasPreview && <audio ref={audioRef} src={previewUrl} onEnded={handleAudioEnd} />}
    </div>
  );
};

export default AudioPreview;