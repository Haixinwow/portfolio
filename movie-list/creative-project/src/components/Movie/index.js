import React, { useState, useEffect } from 'react';
import MoviePopup from '../MoviePopup';
import { url } from '../../url';

function Movie(props) {
    const [movie, setMovie] = useState(null);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        const { movie_id } = props; // access the movie_id prop

        fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=3849570d3922b2c68ab7edb0fe125435&language=en-US`)
            .then((response) => response.json())
            .then((data) => {
                setMovie(data); // set the movie state to the fetched data
            })
            .catch((error) => console.log(error));
    }, [props.movie_id]);

    if (!movie) {
        return;
    }

    let deleteMovie = (id) => {
        fetch(url + "/deleteMovieFromList?id=" + id, {
            method: "DELETE",
        })
            .catch(error => console.error(error));
    }
    let closePopup = () =>{
        setPopup(false);
    }
    
    return (
        <div className="popularMovie">
            <div onClick={() => setPopup(true)}>
                <div className="posterContainer">
                    <img
                        className="posterImage"
                        src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <div className="movieTitle">{movie.title}</div>
                </div>
                {popup && <MoviePopup movie={movie} closePopup={closePopup} />}
            </div>
            <button className="closePopupBtn" onClick={() => deleteMovie(props.id)}>Delete Movie</button>
        </div>
    );

}

export default Movie;
