import React from "react"

export default function NumberOfResults({ movies }) {
    return (<p className="num-results">
        Found <strong>{movies?.length}</strong> results
    </p>)
}