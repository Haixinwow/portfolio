import React, { Component } from 'react';
import MovieSearch from '../../MovieSearch';
import './index.css';
import UserDropdown from '../UserDropdown';

class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className = "leftAlign headerText">
                    <h3>Movie Page</h3>
                </div>
                <div className = "centerAlign">
                    <MovieSearch />
                </div>
                <div className = "rightAlign headerText">
                    <UserDropdown />
                </div>
            </header>
        )
    }

}

export default Header;