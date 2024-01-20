import './App.css';
import React, { Component } from 'react';
import 'whatwg-fetch';
import { url } from '../../url';
import Header from '../containers/Header'
import Content from '../containers/Content'
import BodyBackground from '../BodyBackground';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  // componentDidMount() {
  //   fetch(url + '/users')
  //     .then(res => res.json())
  //     .then(users => {
  //       this.setState({ users: users });
  //     });
  // }

  render() {
    return (
      <div className="App">
        <Header />
        <BodyBackground />
        <Content/>
        <ul>
          {this.state.users.map(user => (
            <li
            key = {user.username}>username: {user.username}</li>
          ))}
        </ul>
      </div>
    );
  };

}

export default App;
