import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { albums } from '../data/catalog';
import AudioPreview from '../components/AudioPreview';
import { searchAlbumTracks } from '../services/itunes';

const AlbumDetail = () => {
  const { id } = useParams();
  const album = albums.find(a => a.id === id);
  const [trackMap, setTrackMap] = useState({});

  useEffect(() => {
    if (!album) return;
    searchAlbumTracks(album.artist, album.title).then(map => {
      setTrackMap(map || {});
    });
  }, [album]);

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
          <img src={album.cover} alt={album.title} className="album-cover" />
          <div className="album-info">
            <div className="album-artist">{album.artist}</div>
            <h1 className="album-title">{album.title}</h1>
            <div className="album-year">{album.year}</div>
            {album.description && <p className="album-description">{album.description}</p>}
          </div>
        </div>

        <div className="tracklist">
          {album.songs.map((song, index) => {
            // Normalize the song title to match the map keys
            const normalized = song.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
            const previewUrl = trackMap[normalized] || null;
            return (
              <AudioPreview
                key={index}
                song={song}
                albumArtist={album.artist}
                index={index}
                previewUrl={previewUrl}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;