import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albums } from '../data/catalog';

// Import all 19 PNG images from assets
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';
import img8 from '../assets/8.png';
import img9 from '../assets/9.png';
import img10 from '../assets/10.png';
import img11 from '../assets/11.png';
import img12 from '../assets/12.png';
import img13 from '../assets/13.png';
import img14 from '../assets/14.png';
import img15 from '../assets/15.png';
import img16 from '../assets/16.png';
import img17 from '../assets/17.png';
import img18 from '../assets/18.png';
import img19 from '../assets/19.png';

const heroImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const superunknown = albums.find(a => a.id === 'superunknown');
  const otherAlbums = albums.filter(a => a.id !== 'superunknown');

  // Auto‑advance slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero section with snapshot slideshow */}
      <section className="hero">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Chris Cornell</h1>
          <p className="hero-subtitle">1964 - 2017</p>
          <p className="hero-text">
            The voice that defined a generation. Exploring the complete catalog 
            of a legendary artist.
          </p>
        </div>
      </section>

      {/* Superunknown 30th anniversary feature */}
      {superunknown && (
        <div className="container">
          <div className="anniversary">
            <div className="anniversary-content">
              <img 
                src={superunknown.cover} 
                alt={superunknown.title}
                className="anniversary-image"
              />
              <div className="anniversary-text">
                <span className="anniversary-badge">32nd Anniversary</span>
                <h2 className="anniversary-title">{superunknown.title}</h2>
                <p className="anniversary-meta">{superunknown.artist} • {superunknown.year}</p>
                <p className="anniversary-description">{superunknown.description}</p>
                <Link to={`/album/${superunknown.id}`} className="btn">
                  Explore Album
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete discography grid */}
      <div className="container">
        <h2 className="section-title">Complete Discography</h2>
        <div className="album-grid">
          {otherAlbums.map(album => (
            <Link key={album.id} to={`/album/${album.id}`} className="album-card">
              <img 
                src={album.cover} 
                alt={album.title}
                className="album-card-image"
                loading="lazy"
              />
              <div className="album-card-content">
                <div className="album-card-artist">{album.artist}</div>
                <div className="album-card-title">{album.title}</div>
                <div className="album-card-year">{album.year}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;