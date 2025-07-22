import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = `${API_BASE_URL}?apikey=${API_KEY}`;

export function useFetchMovies(query, setSelectedId, onCloseMovie) {


    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


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
        onCloseMovie();
        fetchMovies();
    }, [query, setSelectedId])
    // [query, onCloseMovie, setSelectedId])   why this run the fetch infinte number of times is 
    // because each time a new onCloseMOvie function is created on new render which triggers the re-render
    // const onCloseMovie = () => {
    //   setSelectedId(null);
    // };
    // Then onCloseMovie does change on every render, because it's being re-created every time.

    // That's what triggers your useEffect to run repeatedly, even though query and setSelectedId are stable.
    return { movies, loading, error };
}