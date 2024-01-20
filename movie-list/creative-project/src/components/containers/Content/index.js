import React, { Component } from 'react';
import './index.css';
import PopularMovie from '../../PopularMovie';
import UserLists from '../../User Lists';

class Content extends Component {
    render() {
        return (
            <div className="content">
                <PopularMovie />
                <UserLists />
            </div>
        )
    }
}

export default Content;