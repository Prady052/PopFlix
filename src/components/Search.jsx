import React, { useEffect, useRef } from "react";
import { useState } from "react";

export default function Search({ setQuery }) {
    const [tempQuery, setTempQuery] = useState('');
    const inputEle = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        setQuery(tempQuery);
        setTempQuery("");
    }

    useEffect(() => {
        inputEle.current?.focus();
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="search"
                type="text"
                placeholder="Search movies..."
                value={tempQuery}
                onChange={(e) => setTempQuery(e.target.value)}
                ref={inputEle}
            />
        </form>
    )
}