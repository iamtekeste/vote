import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Login extends Component {
  handleLogin = (event) => {
    event.preventDefault();
    const username = this.username.value;
    const password = this.password.value;
    axios('/api/login', {
      user: {
        username,
        password,
      },
    }).then(resp => {
      console.log('all good');
    }).catch(err => {
      console.log('fail');
    });
  };
  render = () => {
    return (
      <div>
        <input
          type="text"
          name="username"
          placeholder="username"
          ref={(input) => {this.username = input; }} />
        <input
          type="password"
          name="password"
          placeholder="password"
          ref={(password) => {this.password = password; }} />
        <input type="submit" value="login" onClick={this.handleLogin} />
      </div>
    );
  };
}
