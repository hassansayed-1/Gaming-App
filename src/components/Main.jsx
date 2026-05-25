import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { FaStar } from 'react-icons/fa';

export default function Main({ selectedGenre, setSelectedGenre }) {
    const [genres, setGenres] = useState([]);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const key = 'ebf40c2a9fe846538caccea083fafbbf';   // i know it's an error but i was playing
        axios.get(`https://api.rawg.io/api/genres?key=${key}`)
            .then(res => setGenres(res.data.results))
            .catch(() => setGenres([]));
    }, []);

    useEffect(() => {
        const key = 'ebf40c2a9fe846538caccea083fafbbf';
        axios.get(`https://api.rawg.io/api/games?key=${key}`)
            .then(res => setGames(res.data.results))
            .catch(() => setGames([]));
    }, []);

    const trendingGames = games
        ? [...games].sort((a, b) => b.rating - a.rating).slice(0, 4)
        : [];

    const popularGames = selectedGenre
        ? games.filter(game =>
            game.genres && game.genres.some(g => g.id === selectedGenre)
        )
        : games.slice(0, 8);

    return (
        <section className="container mx-auto px-2 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar (Genres) - only on desktop */}
            <div className="hidden md:flex md:col-span-2 flex-col gap-3 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-4 ">
                <h2 className='text-2xl font-bold dark:text-white mb-2'>Genres</h2>
                {genres.map((item) => (
                    <button
                        key={item.id}
                        className={`flex gap-2 items-center min-w-[10rem] py-2 px-2 capitalize rounded-lg mb-2 cursor-pointer transition-all duration-300 active:scale-95 hover:bg-gray-300 hover:dark:bg-gray-600
                            ${selectedGenre === item.id ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                        onClick={() => setSelectedGenre(item.id)}
                    >
                        <img src={item.image_background} alt="Image_Error" className='w-10 h-10 object-cover rounded-lg' />
                        <h3 className='dark:text-white text-base'>{item.name}</h3>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-10 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-4">
                {/* Hook Image Section */}
                <div className="w-full mb-8 relative rounded-xl overflow-hidden">
                    <img
                        src="./images/image.png" // <-- Replace with your image path
                        alt="Grand Theft Auto"
                        className="w-full h-[32rem] md:h-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-xl"></div>
                    <div className="absolute left-6 bottom-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Grand Theft Auto</h2>
                        <a
                            href="https://gta-6.en.softonic.com/"
                            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
                        >
                            Get Now
                        </a>
                    </div>
                </div>

                {/* Trending Games Section */}
                <h2 className="text-xl font-bold mb-4 dark:text-white">Trending Games</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {trendingGames.map(game => (
                        <button
                            key={game.id}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col items-center w-full transition hover:scale-105 focus:outline-none"
                            onClick={() => navigate(`/game/${game.id}`)}
                        >
                            <img src={game.background_image} alt={game.name} className="w-30 h-96 rounded-lg mb-2 object-cover" />
                            <span className="font-semibold dark:text-white mb-1">{game.name}</span>
                            <span className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < Math.round(game.rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                        }
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">{game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
                            </span>
                        </button>
                    ))}
                </div>

                {/* Popular Games Section */}
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Popular Games {selectedGenre && genres.find(g => g.id === selectedGenre)?.name ? `- ${genres.find(g => g.id === selectedGenre)?.name}` : ''}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {popularGames.map(game => (
                        <button
                            key={game.id}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col items-center w-full transition hover:scale-105 focus:outline-none"
                            onClick={() => navigate(`/game/${game.id}`)}
                        >
                            <img src={game.background_image} alt={game.name} className="w-30 h-96 rounded-lg mb-2 object-cover" />
                            <span className="font-semibold dark:text-white mb-1">{game.name}</span>
                            <span className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < Math.round(game.rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                        }
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">{game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
