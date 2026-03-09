import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { albums } from '../data/catalog';
import AudioPreview from '../components/AudioPreview';
import { searchAlbumTracks } from '../services/itunes';

// Helper to find the best matching track preview
const findBestMatch = (songTitle, tracks) => {
  if (!tracks || tracks.length === 0) return null;

  const normalizedSong = songTitle.toLowerCase().replace(/[^\w\s]/g, '').trim();

  // 1. Exact match
  for (let track of tracks) {
    if (track.normalizedTitle === normalizedSong) {
      return track.previewUrl;
    }
  }

  // 2. Song title is contained in track title (e.g., "Black Hole Sun" in "Black Hole Sun (Remastered)")
  for (let track of tracks) {
    if (track.normalizedTitle.includes(normalizedSong)) {
      return track.previewUrl;
    }
  }

  // 3. Track title is contained in song title (unlikely but possible)
  for (let track of tracks) {
    if (normalizedSong.includes(track.normalizedTitle)) {
      return track.previewUrl;
    }
  }

  // 4. No match
  return null;
};

const AlbumDetail = () => {
  const { id } = useParams();
  const album = albums.find(a => a.id === id);
  const [tracks, setTracks] = useState([]); // array of track objects from iTunes

  useEffect(() => {
    if (!album) return;
    searchAlbumTracks(album.artist, album.title).then(result => {
      setTracks(result || []);
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
            const previewUrl = findBestMatch(song.title, tracks);
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