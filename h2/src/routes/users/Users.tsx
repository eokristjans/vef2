
import React, { Component, Fragment, ReactNode } from 'react';

import { Link, NavLink } from 'react-router-dom';

import Button from '../../components/button/Button';

import {
  getNotebooksWithContents,
  getPage,
  deleteEntity,
  postPage,
  postSection,
  postNotebook,
} from '../../api';


import { INotebook, IPage, IApiResult } from '../../api/types';
import { Context } from '../../UserContext';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';

import SideBar from '../../components/sidebar/SideBar';
import Page from '../../components/page/Page';

import { 
  EnglishConstants, 
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './Users.scss';
import Login from '../login/Login';


interface INotebooksState {
  notebooksWithContents: INotebook[],
  page?: IPage,
  notebookId: number, 
  sectionId: number,
  pageId: number,
  prevPageId: number,
  deleting: boolean,
  saving: boolean,
  error: string,
  sectionIdOfNewPage?: number,
}

const initialState: INotebooksState = {
  notebooksWithContents: [],
  notebookId: 0,
  sectionId: 0,
  pageId: 0,
  prevPageId: 0,
  deleting: false,
  saving: false,
  error: '',
};

// TODO: ??
interface INotebooksProps {
  pageId?: number,
  match?: any,
}

/**
 * Route to /notebooks.
 * Manages which notebooks, section and page is open.
 * Fetches the notebooks when mounted,
 * Fetches a page when opened.
 */
export default class Users extends Component<INotebooksProps, INotebooksState> {

  constructor(props: INotebooksProps) {
    super(props);
    this.state = initialState;

    // Basic setters
    this.setNotebookId = this.setNotebookId.bind(this);
    this.setSectionId = this.setSectionId.bind(this);
    this.setPageId = this.setPageId.bind(this);
    this.setNotebooksWithContents = this.setNotebooksWithContents.bind(this);

    // this.handleDeleteEntity = this.handleDeleteEntity.bind(this);
    // this.handleEditableFocus = this.handleEditableFocus.bind(this);
    // this.handleEditableFocusOut = this.handleEditableFocusOut.bind(this);
  }

  async componentDidMount() {
    // Get the notebooks and set the state
    await this.setNotebooksWithContents();
  }

  async componentDidUpdate() {
    // Get new Page if pageId changed
    if (this.state.pageId !== this.state.prevPageId) {
      try {
        this.setState({
          page: await getPage(this.state.pageId),
          prevPageId: this.state.pageId,
        });
      } catch(e) {
        console.error(e)
        this.setError(e);
      }
    }
  }

  setNotebooksWithContents = async () => {
    // Get the notebooks and set the state
    try {
      const newNotebooksWithContents = await getNotebooksWithContents();
      this.setState({
        notebooksWithContents: newNotebooksWithContents,
      });
    } catch (e) {
      this.setError(e);
    }
  }
  setNotebookId = (id: number) => {
    this.setState({
      notebookId: id,
    });
  }
  setSectionId = (id: number) => {
    this.setState({
      sectionId: id,
    });
  }
  setPageId = (id: number) => {
    this.setState({
      pageId: id,
    });
  }
  setError = (error: any) => {
    this.setState({
      error: error + '',
    });
  }

  render() {
    const {
      notebookId,
      sectionId,
      notebooksWithContents,
      error,
    } = this.state;

    // TODO: Not good to match on strings
    if (error == 'Error: invalid token') {
      console.error('Notebooks ' + error);
      return (<NoAccess/>);
    }
    
    if (error == 'Error: expired token') {
      console.error('Notebooks ' + error);
      // Remove the user from localStorage
      localStorage.removeItem('user');

      // This is brute force...
      // window.location.replace('/login');
      // TODO: return <Login /> with new prop, message = 'Your login session expired'
      return (<Login/>);
    }

    if (error.endsWith('not found.')){
      console.error('Notebooks ' + error);
    }

    if (error != '') {
      // TODO: Handle error from failed server request or other unknown error.
      console.error('Notebooks UNHANDLED ' + error);
    }

    return (
      <Fragment>
        <div>{this.state.saving && <span>Saving...</span>}</div>
        <div>{this.state.deleting && <span>Deleting...</span>}</div>
        <div> {/* Display any potential error */}
          {error && <div>
          {  error.endsWith('not found.') && error + ' ' + EnglishErrorMessages.ADMIN_CAN_NOT
          || error.startsWith('Error: Error: User already has') && error.substr(7)
          || EnglishErrorMessages.UNKNOWN_ERROR + EnglishErrorMessages.UNKNOWN_ERROR }
          </div>
          }
        </div>
      </Fragment>
    )
  }
}