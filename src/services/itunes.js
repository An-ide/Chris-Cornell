// Search for all tracks of an album
export const searchAlbumTracks = async (artist, album) => {
  const cacheKey = `album_${artist}|${album}`;
  
  // Check cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) { // 7 days
        return data;
      }
    }
  } catch (e) {}

  const searchTerm = encodeURIComponent(`${artist} ${album}`);
  const url = `https://itunes.apple.com/search?term=${searchTerm}&media=music&entity=song&limit=200`;

  // Use your existing jsonp with retry logic
  const result = await fetchWithRetry(url);

  if (result.error || !result.results) return null;

  // Map track name to preview URL (normalize track names)
  const trackMap = {};
  result.results.forEach(track => {
    // Simple normalization: lowercase, remove punctuation
    const normalizedTitle = track.trackName.toLowerCase().replace(/[^\w\s]/g, '');
    trackMap[normalizedTitle] = track.previewUrl;
  });

  // Cache it
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data: trackMap,
      timestamp: Date.now()
    }));
  } catch (e) {}

  return trackMap;
};