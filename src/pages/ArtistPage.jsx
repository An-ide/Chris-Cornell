import { useParams, Link } from 'react-router-dom';
import { albums, artists } from '../data/catalog';

const ArtistPage = () => {
  const { artistId } = useParams();
  const artist = artists.find(a => a.id === artistId);
  const artistAlbums = albums.filter(album => album.artistId === artistId);

  if (!artist) {
    return (
      <div className="not-found">
        <h2>Artist not found</h2>
        <Link to="/">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="artist-header">
        <h1 className="artist-name">{artist.name}</h1>
        <p className="artist-count">{artistAlbums.length} albums</p>
      </div>
      
      <div className="album-grid">
        {artistAlbums.map(album => (
          <Link key={album.id} to={`/album/${album.id}`} className="album-card">
            <img 
              src={album.cover} 
              alt={album.title}
              className="album-card-image"
            />
            <div className="album-card-content">
              <div className="album-card-title">{album.title}</div>
              <div className="album-card-year">{album.year}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;