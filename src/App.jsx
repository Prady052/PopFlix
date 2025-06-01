import { useEffect, useState, } from "react";
import StarRating from "./StarRating";



const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_URL = 'http://www.omdbapi.com/?apikey=ab80aad9';


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
          {selectedId ? <MovieDetails selectedId={selectedId}
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


function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <img className='app-logo' src="./app logo.png" />
      <h1>PopFlix</h1>
    </div>
  )
}


function Search({ setQuery }) {
  const [tempQuery, setTempQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(tempQuery);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={tempQuery}
        onChange={(e) => setTempQuery(e.target.value)}
      />
    </form>
  )
}

function NumberOfResults({ movies }) {
  return (<p className="num-results">
    Found <strong>{movies?.length}</strong> results
  </p>)
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  )
}


function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        children
      )}
    </div>
  )
}

function MovieList({ movies, handleMovieSelected }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleMovieSelected(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}


function WatchedMoveList({ watched, handleDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button className="btn-delete" onClick={() => handleDeleteMovie(movie.imdbID)}>×</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}


function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}


function MovieDetails({ selectedId, onCloseMovie, handleAddMovie, watched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setISLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((e) => e.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(e => e.imdbID === selectedId)?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    const watchedMovie = {
      imdbID: selectedId,
      year,
      title,
      poster,
      imdbRating,
      userRating,
      runtime: Number(runtime.split(' ').at(0)),
    }

    handleAddMovie(watchedMovie);
    onCloseMovie();
  }


  useEffect(() => {
    async function loadMovie() {
      try {
        setISLoading(true);
        const res = await fetch(API_URL + `&i=${selectedId}`);
        const fetchedMovie = await res.json();
        setMovie(fetchedMovie);
        setISLoading(false);
      }
      catch (err) {
        console.error(err);
      }

    }
    loadMovie();
  }, [selectedId, watched])

  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            <section>
              <div className="rating">
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated with movie {watchedUserRating} <span>⭐️</span>
                  </p>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  )
}