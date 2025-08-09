import { IoIosSearch } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';
import { FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import logo from "../../public/images/panda2.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Header({ selectedGenre, setSelectedGenre }) {
//   const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "dark");
  const navigate = useNavigate();
  useEffect(() => {
    if (theme == "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  }, [theme]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    const key = "ebf40c2a9fe846538caccea083fafbbf";
    const axiosCreate = axios.create({
      baseURL: "https://api.rawg.io/api",
    });

    const fetchData = async () => {
      const genres = await axiosCreate.get(`/genres?key=${key}`);
      setData(genres.data.results);
    };
    fetchData();
  }, []);

  return (
    <header className="container mx-auto flex items-center gap-3 p-3">
      {/* Mobile: Menu Button */}
      <button
        className="md:hidden p-3 rounded-full bg-slate-200 dark:bg-slate-700"
        onClick={() => setDrawerOpen(true)}
      >
        <FiMenu className="w-5 h-5 text-black dark:text-white" />
      </button>
      {/* Desktop: Logo */}
      <button onClick={() => navigate('/')}>
        <img
        width={60}
        height={60}
        src={logo}
        alt="Image_Error"
        className="hidden md:block"
      />
      </button>
      <div className="relative flex items-center w-full p-2 bg-slate-200 dark:bg-slate-700 rounded-full">
        <IoIosSearch className="dark:text-white cursor-pointer" onClick={() => setSearchOpen(true)} />
        <input
          type="text"
          value={searchText}
          onChange={async (e) => {
            setSearchText(e.target.value);
            if (e.target.value.length > 1) {
              const key = 'ebf40c2a9fe846538caccea083fafbbf';
              const res = await fetch(`https://api.rawg.io/api/games?search=${e.target.value}&key=${key}`);
              const data = await res.json();
              setSearchResults(data.results || []);
              setSearchOpen(true);
            } else {
              setSearchResults([]);
              setSearchOpen(false);
            }
          }}
          placeholder="Search Games"
          className="ml-2 bg-transparent outline-none w-3/4 dark:text-white"
          onFocus={() => searchText.length > 1 && setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        {/* Search Results Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {searchResults.map(game => (
              <button
                key={game.id}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                onMouseDown={() => navigate(`/game/${game.id}`)}
              >
                <img src={game.background_image} alt={game.name} className="w-12 h-12 object-cover rounded-lg" />
                <div>
                  <div className="font-semibold dark:text-white">{game.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">{game.released}</div>
                </div>
              </button>
            ))}
            {searchResults.length === 0 && (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-300">No games found.</div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => {
          if (theme == "dark") {
            setTheme("light");
            localStorage.setItem("theme", "light");
          } else {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
          }
        }}
        className="p-3 rounded-full bg-slate-200 dark:bg-slate-700"
      >
        {theme == "light" ? (
          <FaMoon className="text-md text-black" />
        ) : (
          <IoSunnyOutline className="text-md text-white" />
        )}
      </button>

      {/* Drawer for Categories */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-60 bg-white dark:bg-gray-900 h-full shadow-lg p-4 flex flex-col overflow-y-auto">
            <button
              className="self-end mb-4 p-2"
              onClick={() => setDrawerOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-black dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold dark:text-white mb-2">Genres</h2>
            <div className="flex flex-col gap-2">
              {data.map((item) => (
                <button
                  key={item.id}
                  className={`flex gap-2 items-center py-2 px-2 capitalize rounded-lg mb-2 cursor-pointer transition-all duration-300 active:scale-95 bg-slate-100 dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-600
                    ${selectedGenre === item.id ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
                  onClick={() => {
                    setSelectedGenre(item.id);
                    setDrawerOpen(false);
                  }}
                >
                  <img
                    src={item.image_background}
                    alt="Image_Error"
                    className="w-12 h-12 min-w-12 object-cover rounded-lg"
                  />
                  <span className="dark:text-white text-base">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setDrawerOpen(false)}
          ></div>
        </div>
      )}
    </header>
  );
}
