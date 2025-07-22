import React from "react";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { Loader, ErrorMessage } from "./LoadingAndError";
import { useKey } from "./CustomHooks/useKey";


export default function MovieDetail({ selectedId, onCloseMovie, handleAddMovie, watched }) {

    //Fetching env variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `${API_BASE_URL}?apikey=${API_KEY}`;

    //setting state hooks
    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);

    //getting derived state
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
                setIsLoading(true);
                const res = await fetch(API_URL + `&i=${selectedId}`);
                const fetchedMovie = await res.json();
                setMovie(fetchedMovie);
                setIsLoading(false);
            }
            catch (err) {
                console.error(err);
            }

        }
        loadMovie();
    }, [selectedId, watched, API_URL])

    useEffect(() => {
        if (!title) return;
        document.title = `MOVIE | ${title}`;

        return function () {
            document.title = 'PopFlix';
        }
    }, [title])

    useKey('Escape', onCloseMovie);

    // useEffect(() => {
    //     function callback(e) {
    //         if (e.code === 'Escape') {
    //             onCloseMovie();
    //             console.log("closed");
    //         }
    //     }
    //     document.addEventListener("keydown", callback);

    //     // if we dont do this each time a component is mount a new eventlistner 
    //     // is add to DOM which causes multiple callbacks
    //     //so to avoid that we return a clean up function
    //     return function () {
    //         document.removeEventListener("keydown", callback)
    //     }
    // }, [onCloseMovie])
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