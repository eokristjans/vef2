
import React, { Component, Fragment, ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';



import {
  getUsers,
} from '../../api';


import { IUser, IApiResult } from '../../api/types';
import { Context } from '../../UserContext';
import useApi from '../../hooks/useApi';
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';
import Button from '../../components/button/Button';
import UsersComponentWithRouter from '../../components/users/UsersWithRouter';

import { 
  EnglishConstants, 
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './Users.scss';
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

    // Basic setters
    this.setUsers = this.setUsers.bind(this);

    // this.handleDeleteEntity = this.handleDeleteEntity.bind(this);
  }

  async componentDidMount() {
    // Get the Users and set the state
    // await this.setUsers();
  }

  async componentDidUpdate() {
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
  setSaving = (saving: boolean) => {
    this.setState({
      saving: saving,
    });
  }
  setDeleting = (deleting: boolean) => {
    this.setState({
      deleting: deleting,
    });
  }


  render() {
    const {
      saving,
      deleting,
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
        <div>{saving && <span>Saving...</span>}</div>
        <div>{deleting && <span>Deleting...</span>}</div>
        <div> {/* Display any potential error */}
          {error && <div>
          {  error.endsWith('not found.') && error + ' ' + EnglishErrorMessages.ADMIN_CAN_NOT
          || error.startsWith('Error: User already has') && error
          || EnglishErrorMessages.PERMITTED_FILE_TYPES }
          </div>
          }
        </div>
        <UsersComponentWithRouter
          limit={10}
          paging={true}
        />
      </Fragment>
    )
  }
}