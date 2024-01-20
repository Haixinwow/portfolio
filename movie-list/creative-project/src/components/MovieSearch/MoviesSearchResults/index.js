import React, { useState } from 'react';
import './index.css';
import MoviePopup from '../MoviePopup';

const MoviesListElement = ({ movie, openMoviePopup}) => (
    <li>
        <div className="movie" onClick={() => {
            openMoviePopup(movie);
            clearSearchbar();
        }}>
            {movie.title}
            <br></br>
            <img src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path} alt="movie poster" />
        </div>
    </li>
)

const MoviesSearchResults = ({props}) => {
    const [selectedMovie, setSelectedMovie] = useState(null);

    const openMoviePopup = (movie) => {
        setSelectedMovie(movie);
    }

    const closeMoviePopup = () => {
        setSelectedMovie(null);
    }

    return (
        <div>
            <ul className="moviesList">
                {props.list.map(movie => (
                    <MoviesListElement movie={movie} key={movie.id} openMoviePopup={openMoviePopup}/>
                ))}
            </ul>
            {selectedMovie && <MoviePopup movie={selectedMovie} closePopup={closeMoviePopup} />}
        </div>
    )
}

export default MoviesSearchResults;
