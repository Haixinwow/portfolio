import React, { useState} from 'react';
import './index.css';
import { url } from '../../url';
import { loggedIn } from '../../globalVariables/loggedIn';


const MoviePopup = ({ movie, closePopup }) => {
    const [dropped, setDropped] = useState(false);
    const [showRating, setShow] = useState(false);
    const [lists, setLists] = useState([]);
    const [comment, setcomment] = useState("");
    const [listComments, setcommentlist] = useState([]);
    const [rating, setrating] = useState("");

    // if (!movie) {
    //     return null; // return null if movie is not defined
    // }

    let displayLists = () => {
        // if logged in, set the list visible
        setDropped(!dropped);
        fetchLists();
    }

    let fetchLists = () => {
        if (loggedIn.status) {
            fetch(url + "/getLists?user=" + loggedIn.user)
                .then(response => response.json())
                .then(data => {
                    setLists(data.lists);
                })
                .catch(error => console.error(error));
        }
    }

    let addMovieToList = (list) => {
        if (!list) {
            return;
        }

        const listId = list.list_id;
        const movieId = movie.id;

        // add the movie to the selected list
        fetch(url + "/addToList", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listId, movieId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setDropped(!dropped);
                }
            })
            .catch(error => console.error(error));
    }

    let commentValue = (event) => {
        setcomment(event.target.value);
    }

    let addComment = () => {
        const user = loggedIn.user;
        const movieId = movie.id;
        fetch(url + "/addComments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment, user, movieId }),
        })
            .then((response) => {
                if (response.status === 200) {
                    fetchComments();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    let fetchComments = () => {
        // const movieId = movie.id;
        console.log(movie.id)
        fetch(url + "/getComments?movieId=" + movie.id)
            .then(response => response.json())
            .then(data => {
                console.log(data.listComment);
                setcommentlist(data.listComment);
            })
            .catch(error => console.error(error));
    }

    let ratingValue = (event) => {
        setrating(event.target.value);
    }

    let addRating = () => {
        const user = loggedIn.user;
        const movieId = movie.id;
        fetch(url + "/addRating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, user, movieId }),
        })
            .then((response) => {
                if (response.status === 200) {
                    fetchRating();
                    console.log('test')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    let fetchRating = () => {
        const user = loggedIn.user;
        const movieId = movie.id;
        console.log("fetching" + user);
        // fetch(url + "/getRating?movieId=" + movie.id + "&?user=" + user)
        fetch(url + "/getRating", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, movieId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.rating[0].rating);
                setrating(data.rating[0].rating);
            })
            .catch(error => console.error(error));
    }
    
    fetchComments();

    let displayRating = () => {
        setShow(!showRating);
        fetchRating();
    }
 
    
    console.log(listComments);
    
    return (
        <div className="popup">
            <div className="popupInner">
                <img className="popupImage" src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <div className="popupInfo">
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p><b>Release Date:</b> {movie.release_date}</p>
                    <p><b>Rating:</b> {movie.vote_average}</p>

                    {loggedIn.status && (
                        <React.Fragment>
                            <input type="text" className="rating" placeholder="ratings" onChange={ratingValue} /><br></br>
                            <button className="ratingbtn" onClick={addRating}>Add Rating</button><br></br>
                            {/* <div className='userRating'>
                                Your rating: {rating}
                            </div> */}
                            <button className="ratingbtn" onClick={displayRating}>Show Rating</button><br></br>
                            {showRating && (
                                <div className='userRating'>
                                    Your rating: {rating}
                                </div>
                            )}
                            <button className="closePopupBtn" onClick={displayLists}>Add to List ▼</button>
                            {dropped && (
                                <div className="listNames">
                                    {lists.map(list => (
                                        <div className="movieList" key={list.list_id} onClick={() => addMovieToList(list)}>{list.list_name}</div>
                                    ))}
                                </div>
                            )}
                            <br></br>
                            <br></br>
                            <input type="text" className="comment" placeholder="comments" onChange={commentValue} /><br></br>
                            <button className="commentbtn" onClick={addComment}>Add Comment</button><br></br>
                        </React.Fragment>)}
                        <div className='commentlists'>
                            {listComments.map(comments => (
                                <div key={comments.comment_id}>
                                    {comments.username}: {comments.comment}
                                </div>
                            ))}
                        </div>
                        <button className="closePopupBtn" onClick={closePopup}>Close</button>
                </div>
                
            </div>
        </div>

    );
};

export default MoviePopup;
