import jsonp from 'jsonp';

// Cache keys
const CACHE_PREFIX = 'itunes_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 1 day

// Request queue with concurrency control
let activeRequests = 0;
const MAX_CONCURRENT = 3;
const requestQueue = [];

const processQueue = () => {
  if (requestQueue.length === 0 || activeRequests >= MAX_CONCURRENT) return;
  const next = requestQueue.shift();
  activeRequests++;
  next()
    .finally(() => {
      activeRequests--;
      processQueue();
    });
};

const queueRequest = (fn) => {
  return new Promise((resolve, reject) => {
    requestQueue.push(() => fn().then(resolve, reject));
    processQueue();
  });
};

// Retry with exponential backoff (up to 3 attempts)
const fetchWithRetry = (url, attempt = 1) => {
  return new Promise((resolve) => {
    jsonp(url, { param: 'callback', timeout: 8000 }, (err, data) => {
      if (err) {
        if (attempt <= 3) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.warn(`Retry ${attempt} for ${url} after ${delay}ms`);
          setTimeout(() => resolve(fetchWithRetry(url, attempt + 1)), delay);
        } else {
          resolve({ error: err });
        }
      } else {
        resolve(data);
      }
    });
  });
};

export const searchTrack = (artist, track) => {
  const cacheKey = `${CACHE_PREFIX}${artist}|${track}`;

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return Promise.resolve(data); // return cached data (could be null)
      }
    }
  } catch (e) {
    // ignore localStorage errors
  }

  // Not cached or expired – queue the request
  return queueRequest(async () => {
    const cleanArtist = artist.replace(/[&]/g, 'and');
    const cleanTrack = track.replace(/[&]/g, 'and');
    const searchTerm = encodeURIComponent(`${cleanArtist} ${cleanTrack}`);
    const url = `https://itunes.apple.com/search?term=${searchTerm}&media=music&entity=song&limit=5`;

    const result = await fetchWithRetry(url);

    let previewData = null;
    if (!result.error && result?.results?.length > 0) {
      const match = result.results.find(item =>
        item.artistName.toLowerCase().includes(artist.toLowerCase()) &&
        item.trackName.toLowerCase().includes(track.toLowerCase())
      );
      const preview = match || result.results[0];
      if (preview?.previewUrl) {
        previewData = {
          previewUrl: preview.previewUrl,
          trackName: preview.trackName,
          artistName: preview.artistName,
        };
      }
    }

    // Store in localStorage (even null, to avoid repeated failures)
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: previewData,
        timestamp: Date.now()
      }));
    } catch (e) {}

    return previewData;
  });
};