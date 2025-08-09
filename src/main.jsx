import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router"; // <-- FIXED IMPORT
import './index.css'
import Home from "./pages/Home"
import GameDetails from "./pages/GameDetails" // <-- ADD THIS IMPORT

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<GameDetails />} /> 
    </Routes>
  </BrowserRouter>
);

