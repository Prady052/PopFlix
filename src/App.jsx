import { useState, } from "react";
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
import { useFetchMovies } from "./components/CustomHooks/useFetchMovies";
import { useLocalStorageState } from "./components/CustomHooks/useLocalStorageState";


export default function App() {
  const [query, setQuery] = useState('Interstellar')
  const [selectedId, setSelectedId] = useState(null);

  // BIND THE RELATED USE STATE AND USE EFFECT 
  // TOGETHER AND CREATE A CUSTOM HOOK


  // const [watched, setWatched] = useState(function () {
  //   const storedWatchedMovies = localStorage.getItem('Watched');
  //   return storedWatchedMovies ? JSON.parse(storedWatchedMovies) : [];
  // });

  const handleMovieSelected = (id) => {
    setSelectedId(id === selectedId ? null : id);
  }

  const onCloseMovie = () => {
    setSelectedId(null);
  }

  const [watched, setWatched] = useLocalStorageState([], 'Watched');

  /* this is wrong */
  // const closeMovie = useRef(() => {   
  //   const onCloseMovie = (setSelectedId) => {
  //     setSelectedId(null);
  //   }
  //   onCloseMovie();
  // })


  const handleAddMovie = (movie) => {
    const isAdded = watched.find((e) => e.imdbID === movie.imdbID);
    if (!isAdded) {
      setWatched(watched => [...watched, movie]);
    }
  }

  const handleDeleteMovie = (id) => {
    setWatched(watched.filter((e) => e.imdbID !== id));
  }

  // useEffect(() => {
  // here we don't need call back because here the state is not being updated
  //   localStorage.setItem('Watched', JSON.stringify(watched));
  // }, [watched])

  const { movies, loading, error } = useFetchMovies(query, setSelectedId, onCloseMovie);

  return (
    <>
      <NavBar>
        <Logo />
        <Search setQuery={setQuery} />
        <NumberOfResults movies={movies} />
      </NavBar >
      <Main >
        <Box>
          {loading && <Loader />}
          {!loading && !error && (<MovieList movies={movies} handleMovieSelected={handleMovieSelected} />)}
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

















