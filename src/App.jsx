import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AlbumDetail from './pages/AlbumDetail';
import ArtistPage from './pages/ArtistPage';
import './App.css';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album/:id" element={<AlbumDetail />} />
            <Route path="/artist/:artistId" element={<ArtistPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p className="footer-text">In memory of <span className="footer-highlight">Chris Cornell</span></p>
            <p className="footer-text">July 20, 1964 - May 18, 2017</p>
            <p className="footer-text">The greatest voice of a generation</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;