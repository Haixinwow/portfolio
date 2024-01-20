import React, { Component } from 'react';
import './index.css';
import { url } from '../../url';
import { loggedIn } from '../../globalVariables/loggedIn';
import Movie from '../Movie';

class UserLists extends Component {
    state = {
        creatingList: false,
        newListName: "",
        lists: [],
        movieListPairs: [],
    };

    //fetch lists
    componentDidMount() {
        if (loggedIn.status) {
            fetch(url + "/getLists?user=" + loggedIn.user)
                .then(response => response.json())
                .then(data => {
                    this.setState({ lists: data.lists })
                })
                .catch(error => console.error(error));

            this.fetchMovies();
        }
    }

    createNewClick = () => {
        this.setState({ creatingList: true });
    }

    newListNameChange = (event) => {
        this.setState({ newListName: event.target.value });
    }

    createNewList = () => {
        // send a request to a server
        let listName = this.state.newListName
        let user = loggedIn.user;
        fetch(url + "/listUpload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listName, user }),
        })
            .then((response) => {
                if (response.status === 200) {
                    this.componentDidMount()
                    this.setState({ creatingList: false, newListName: '' });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchMovies = () => {
        if (loggedIn.status) {
            fetch(url + "/getMovies")
                .then(response => response.json())
                .then(data => {
                    this.setState({ movieListPairs: data })
                })
                .catch(error => console.error(error));
        }
    }

    deleteList = (id) => {
        fetch(url + "/deleteList?id=" + id, {
            method: "DELETE",
        })
            .catch(error => console.error(error));
    }

    render() {
        return (
            <div className="container">
                <div className="yourListsTitle">
                    <h1>Your Lists</h1>
                    <button onClick={this.createNewClick}>Create New</button>
                </div>
                {/* if logged in, get lists */}
                {loggedIn.status && this.state.lists.map((list) => (
                    <div key={list.list_id}>
                        <h2 className="listName">{list.list_name}</h2>
                        <button className="closePopupBtn" onClick={() => this.deleteList(list.list_id)}>Delete List</button>
                        <div className="popularMovies">
                            {
                                // for each list, add its movies
                                this.state.movieListPairs.map((movie) => (
                                    <React.Fragment key={movie.id}>
                                        {movie.list_id === list.list_id &&
                                            <Movie movie_id={movie.movie_id} id={movie.id}/>
                                        }
                                    </React.Fragment>

                                ))
                            }
                        </div>


                    </div>
                ))}
                {this.state.creatingList && (
                    <div className="popup">
                        <div className="popupContent">
                            <input
                                type="text"
                                placeholder="Enter list name"
                                value={this.state.newListName}
                                onChange={this.newListNameChange}
                            />
                            <button onClick={this.createNewList}>Create</button>
                        </div>
                    </div>
                )}
            </div>

        );
    }
}

export default UserLists;
