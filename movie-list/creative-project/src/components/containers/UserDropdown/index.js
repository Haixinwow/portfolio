import React, { Component } from 'react';
import './index.css';
import { url } from '../../../url';
import { loggedIn } from '../../../globalVariables/loggedIn';

class UserDropdown extends Component {
    state = {
        username: "",
        password: "",
        dropped: false,
        beFriend: false,
        friendname: "",
    }

    changeDroppedStatus = () => {
        this.setState((state) => {
            return {
                dropped: !state.dropped,
            };
        });
    };

    handleUsernameChange = (event) => {
        const value = event.target.value;
        this.setState({ username: value });
    };

    handlePasswordChange = (event) => {
        const value = event.target.value;
        this.setState({ password: value });
    };

    handleSignupLogin = () => {
        const { username, password } = this.state;

        fetch(url + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (response.status === 200) {
                    loggedIn.status = true;
                    loggedIn.user = username;
                    this.setState({});//renders the page again
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    handleLogOut = () => {
        loggedIn.status = false;
        loggedIn.user = "";
        this.setState({});//renders the page again
    }

    handleFriend = () => {
        this.setState((state) => {
            return {
                beFriend: true,
            };
        });   
    }
    
    addFriendName = (event) => {
        const value = event.target.value;
        this.setState({ friendname: value });
    }

    handleBefriend = () => {
        const { friendname } = this.state;
        let user = loggedIn.user;
        console.log("here work!");
        console.log(url + "/beFriend");
        fetch(url + "/beFriend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ friendname, user }),
        })
            .then((response) => {
                if(response.status === 200) {
                    this.setState({ beFriend: false });
                    this.setState({});
                    //display friend's lists
                    //not sure if you do it here !!!!delete after implement!!!!

                }
            })
            .catch((error) => {
                this.setState({ beFriend: false });
                this.setState({});
                console.error(error);
            });
    }

    render() {
        return (
            <div className="container">
                <div className="title option" onClick={this.changeDroppedStatus}>
                    {loggedIn.status && (<h3>{loggedIn.user}</h3>)}
                    {!loggedIn.status && (<h3>User</h3>)}

                </div>
                {this.state.dropped &&
                    (<div className="contents">
                        {!loggedIn.status && (
                            <React.Fragment>
                                <input type="text" className="option" placeholder="Username" onChange={this.handleUsernameChange} />
                                <input type="text" className="option" placeholder="Password" onChange={this.handlePasswordChange} />
                                <div className="option" onClick={this.handleSignupLogin}>
                                    Signup/Login
                                </div>
                            </React.Fragment>)
                        }
                        {loggedIn.status && (
                            <React.Fragment>
                                <div className="option" onClick = {this.handleLogOut}>
                                    Log Out
                                </div>
                                <div className="option" onClick= {this.handleFriend}>
                                    Add Friend
                                    {this.state.beFriend &&
                                        (<div>
                                            <input type="text" className="option" placeholder="Username" onChange={this.addFriendName} />
                                            <div className="option" onClick={this.handleBefriend}>
                                                Add
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </React.Fragment>
                        )}

                    </div>)
                }


            </div>
        )
    }

}

export default UserDropdown;