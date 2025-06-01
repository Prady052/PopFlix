import { useEffect, useState, } from "react";
import NavBar from "./components/NavBar";
import Logo from "./components/Logo";
import Search from "./components/Search";
import Main from "./components/HomePage";
import { Loader, ErrorMessage } from "./components/LoadingAndError";
import MovieDetail from "./components/MovieDetail";
import MovieList from "./components/MovieList";
import NumberOfResults from "./components/NumberOfResults";
import WatchedMoveList from "./components/WatchedMovieList";
import WatchedSummary from "./components/WatchedSummary";
import Box from "./components/Box";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = `${API_BASE_URL}?apikey=${API_KEY}`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('Interstellar')
  const [selectedId, setSelectedId] = useState(null);

  const handleMovieSelected = (id) => {
    setSelectedId(id === selectedId ? null : id);
  }

  const onCloseMovie = () => {
    setSelectedId(null);
  }

  const handleAddMovie = (movie) => {
    const isAdded = watched.find((e) => e.imdbID === movie.imdbID);
    if (!isAdded) {
      setWatched(watched => [...watched, movie]);
    }
  }

  const handleDeleteMovie = (id) => {
    setWatched(watched.filter((e) => e.imdbID !== id));
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API_URL + `&s=${query}`);

        if (!res.ok) {
          throw new Error("Something went wrong while fetching");
        }
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setLoading(false);
        setSelectedId(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [query])



  return (
    <>
      <NavBar>
        <Logo />
        <Search setQuery={setQuery} />
        <NumberOfResults movies={movies} />
      </NavBar >
      <Main >
        <Box>
          {Loading && <Loader />}
          {!Loading && !error && (<MovieList movies={movies} handleMovieSelected={handleMovieSelected} />)}
          {error && <ErrorMessage message={error} />}

        </Box>
        <Box>
          {selectedId ? <MovieDetail selectedId={selectedId}
            setSelectedId={setSelectedId}
            onCloseMovie={onCloseMovie}
            handleAddMovie={handleAddMovie}
            watched={watched} /> :
            <><WatchedSummary watched={watched} />
              <WatchedMoveList watched={watched} handleDeleteMovie={handleDeleteMovie} /></>}
        </Box>
      </Main>

    </>
  );
}

















