/**
 * Route to /users.
 */
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';

import {
  getUsers,
} from '../../api';
import { IUser } from '../../api/types';
import NoAccess from '../system-pages/NoAccess';
import UsersComponentWithRouter from '../../components/users/UsersWithRouter';
import Login from '../login/Login';

interface IUsersState {
  users: IUser[],
  deleting: boolean,
  saving: boolean,
  error: string,
}

const initialState: IUsersState = {
  users: [],
  deleting: false,
  saving: false,
  error: '',
};

/**
 * Route to /users.
 * Manages which users, section and page is open.
 * Fetches the users when mounted,
 * Fetches a page when opened.
 */
export default class Users extends Component<{}, IUsersState> {

  constructor(props: {}) {
    super(props);
    this.state = initialState;

    this.setUsers = this.setUsers.bind(this);
  }

  setUsers = async () => {
    // Get the Users and set the state
    try {
      const newUsers = await getUsers();
      this.setState({
        users: newUsers,
      });
    } catch (e) {
      this.setError(e);
    }
  }
  setError = (error: any) => {
    this.setState({
      error: error + '',
    });
  }

  render() {
    const {
      error,
    } = this.state;

    // TODO: Not good to match on strings
    if (error == 'Error: invalid token') {
      console.error('Users ' + error);
      return (<NoAccess/>);
    }

    if (error == 'Error: expired token') {
      console.error('Users ' + error);
      // Remove the user from localStorage
      localStorage.removeItem('user');

      // window.location.replace('/login');
      // TODO: return <Login /> with new prop, message = 'Your login session expired'
      return (<Login/>);
    }

    if (error.endsWith('not found.')){
      console.error('Users ' + error);
    }

    if (error != '') {
      // TODO: Handle error from failed server request or other unknown error.
      console.error('Users UNHANDLED ' + error);
    }

    return (
      <Fragment>
        <Helmet title="Users"/>
        <UsersComponentWithRouter
          limit={10}
          paging={true}
        />
      </Fragment>
    )
  }
}