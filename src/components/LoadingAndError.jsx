import React from "react";

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

export { Loader, ErrorMessage };