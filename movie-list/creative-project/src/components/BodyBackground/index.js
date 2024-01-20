import React, { Component } from 'react';
import './index.css';

class BodyBackground extends Component {
    render() {
        return (
            <div className="glass">
                <div className = "animation">
                    <br></br>
                    <br></br>
                    <div className = "shape1"></div>
                    <div className = "shape2"></div>
                    <div className = "shape3"></div>
                </div>
            </div>
        )
    }

}

export default BodyBackground;