import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import Header from '../components/Header';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem(`reviews_${id}`)) || []);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const key = 'ebf40c2a9fe846538caccea083fafbbf';
    axios.get(`https://api.rawg.io/api/games/${id}?key=${key}`)
      .then(res => setGame(res.data))
      .catch(() => setGame(null));
    axios.get(`https://api.rawg.io/api/games/${id}/screenshots?key=${key}`)
      .then(res => setScreenshots(res.data.results))
      .catch(() => setScreenshots([]));
  }, [id]);

  // Add review handler
  const handleAddReview = (e) => {
    e.preventDefault();
    const newReviews = [
      ...reviews,
      { text: reviewText, rating: reviewRating, date: new Date().toLocaleDateString() }
    ];
    setReviews(newReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(newReviews));
    setReviewText('');
    setReviewRating(5);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="text-center py-20 text-gray-500 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="max-w-5xl mx-auto p-4 mt-8">
        {/* Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <img src={game.background_image} alt={game.name} className="w-full h-64 object-cover rounded-xl" />
            {screenshots.slice(0, 5).map(s => (
              <img key={s.id} src={s.image} alt="Screenshot" className="w-full h-64 object-cover rounded-xl" />
            ))}
          </div>
        </div>
        {/* Title & Cart */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold dark:text-white mb-2">{game.name}</h1>
        </div>
        {/* Rating as Stars */}
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(game.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">{game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
        </div>
        {/* Details */}
        <div className="flex flex-wrap gap-4 mb-4">
          <span className="px-3 py-1 bg-green-600 text-white rounded-full font-semibold">Released: {game.released}</span>
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full font-semibold">Metacritic: {game.metacritic}</span>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{game.description_raw}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {game.genres && game.genres.map(genre => (
            <span key={genre.id} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm dark:text-white">{genre.name}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {game.platforms && game.platforms.map(p => (
            <span key={p.platform.id} className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded text-sm dark:text-black">{p.platform.name}</span>
          ))}
        </div>
        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold dark:text-white mb-4">Reviews</h2>
          <form onSubmit={handleAddReview} className="mb-6 flex flex-col md:flex-row gap-2">
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 rounded-lg dark:bg-gray-800 dark:text-white min-h-12"
              required
            />
            <select
              value={reviewRating}
              onChange={e => setReviewRating(Number(e.target.value))}
              className="p-2 rounded-lg dark:bg-gray-800 dark:text-white"
            >
              {[5,4,3,2,1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-gray-500 dark:text-gray-300">No reviews yet.</div>
            )}
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < rev.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">{rev.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-200">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}