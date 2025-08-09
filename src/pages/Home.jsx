import { useState } from "react";
import Header from "../components/Header";
import Main from "../components/Main";

export default function Home() {
    const [selectedGenre, setSelectedGenre] = useState(null);

    return (
        <div id="up" className="container2 dark:bg-black">
            <Header selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
            <Main selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
        </div>
    );
}