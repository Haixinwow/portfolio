import React, { Component } from 'react';
import MoviesSearchResults from '../MoviesSearchResults';


class MovieSearch extends Component {
    state = {
        movies: [],
        movieName: '',
        isFetching: false
    }

    movieInputChange = element => {
        this.setState({ movieName: element.target.value, isFetching: true });

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=3849570d3922b2c68ab7edb0fe125435&query=${element.target.value}`)
            .then((response) => response.json())
            .then(json => this.setState({ movies: json.results, isFetching: false }))
    }

    render() {
        let { movies, movieName, isFetching } = this.state
        return (
            <div>
                <div>
                    <input value={movieName} placeholder="Type in a Movie" type="text" onChange={this.movieInputChange}></input>
                </div>
                {
                    !isFetching && <MoviesSearchResults list={movies} />
                }

            </div>
        )
    }
}

export default MovieSearch;