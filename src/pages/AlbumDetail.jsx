import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { albums } from '../data/catalog';
import AudioPreview from '../components/AudioPreview';
import { searchTrack } from '../services/itunes';

const AlbumDetail = () => {
  const { id } = useParams();
  const album = albums.find(a => a.id === id);
  const [prefetchStarted, setPrefetchStarted] = useState(false);

  // Prefetch all previews in the background (with concurrency control)
  useEffect(() => {
    if (!album || prefetchStarted) return;
    setPrefetchStarted(true);
    album.songs.forEach(song => {
      searchTrack(album.artist, song.title).catch(() => {});
    });
  }, [album, prefetchStarted]);

  if (!album) {
    return (
      <div className="not-found">
        <h2>Album not found</h2>
        <Link to="/">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="album-detail">
        <Link to="/" className="back-link">← Back to Albums</Link>
        
        <div className="album-header">
          <img 
            src={album.cover} 
            alt={album.title}
            className="album-cover"
          />
          <div className="album-info">
            <div className="album-artist">{album.artist}</div>
            <h1 className="album-title">{album.title}</h1>
            <div className="album-year">{album.year}</div>
            {album.description && (
              <p className="album-description">{album.description}</p>
            )}
          </div>
        </div>

        <div className="tracklist">
          {album.songs.map((song, index) => (
            <AudioPreview 
              key={index}
              song={song}
              albumArtist={album.artist}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;