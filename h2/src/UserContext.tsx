/**
 * TODO: Documentation
 */

import React, { Component } from 'react'

import { loginUser as apiLoginUser } from './api';

const user = JSON.parse(localStorage.getItem('user') || 'null');

export const Context = React.createContext({
  fetching: false,
  authenticated: !!user,
  user,
  message: [],
  loginUser: async (username: string, password: string) => {},
  logoutUser: () => {},
});

export default class User extends Component {
  state = {
    fetching: false,
    authenticated: !!user,
    message: [],
    user,
  }

  loginUser = async (username: string, password: string) => {
    this.setState({ fetching: true, message: '' });

    let result;
    try {
      result = await apiLoginUser(username, password);

      if (!result.ok) {
        this.setState({ message: result.data });
      } else {
        const user = result.data;
        localStorage.setItem('user', JSON.stringify(user));
        this.setState({ user, fetching: false, authenticated: true });
        window.location.replace('/');
      }
    } catch (e) {
      this.setState({ message: e.message });
    } finally {
      this.setState({ fetching: false });
    }
  };

  logoutUser = async () => {
    localStorage.removeItem('user');
    this.setState({ user: null, authenticated: false });
    window.location.replace('/');
  };

  render() {
    const { children } = this.props;

    return (
      <Context.Provider value={{
        ...this.state,
        loginUser: this.loginUser,
        logoutUser: this.logoutUser,
      }}>
        {children}
      </Context.Provider>
    );
  }
}
