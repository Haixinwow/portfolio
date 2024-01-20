import React, { Component } from 'react';
import './index.css';
import MoviePopup from '../MoviePopup';

class PopularMovie extends Component {
    state = {
        movies: [],
        selectedMovie: null,
    };

    //fetch movies
    componentDidMount() {
        fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=3849570d3922b2c68ab7edb0fe125435&language=en-US&page=1')
            .then(response => response.json())
            .then(data => this.setState({ movies: data.results}))
            .catch(error => console.error(error));
    }

    openMoviePopup = (movie) => {
        this.setState({ selectedMovie: movie });
    };

    closeMoviePopup = () => {
        this.setState({ selectedMovie: null });
    };

    render() {
        const { movies, selectedMovie } = this.state;

        return (
            <div className="popularMoviesContainer">
                <h1>Popular Movies</h1>
                <div className="popularMovies">
                    {movies.map((movie) => (
                        <div className="popularMovie" key={movie.id} onClick={() => this.openMoviePopup(movie)}>
                            <div className="posterContainer">
                                <img
                                    className="posterImage"
                                    src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                    alt={movie.title}
                                />
                                <div className="movieTitle">{movie.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedMovie && <MoviePopup movie={selectedMovie} closePopup={this.closeMoviePopup} />}
            </div>
        );
    }
}

export default PopularMovie;
