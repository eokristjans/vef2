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

import './Notebooks.scss';
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
 * Route to /my-notebooks.
 * Manages which notebooks, section and page is open.
 * Fetches the notebooks when mounted,
 * Fetches a page when opened.
 */
export default class Notebooks extends Component<INotebooksProps, INotebooksState> {

  constructor(props: INotebooksProps) {
    super(props);
    this.state = initialState;

    // Basic setters
    this.setNotebookId = this.setNotebookId.bind(this);
    this.setSectionId = this.setSectionId.bind(this);
    this.setPageId = this.setPageId.bind(this);
    this.setNotebooksWithContents = this.setNotebooksWithContents.bind(this);

    this.handleDeleteEntity = this.handleDeleteEntity.bind(this);

    this.handleEditableFocus = this.handleEditableFocus.bind(this);
    this.handleEditableFocusOut = this.handleEditableFocusOut.bind(this);
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

  /**
   * Currently does nothing.
   * @param text 
   * @param entityType 
   * @param entityId 
   */
  handleEditableFocus(text: string, entityType: string, entityId: number) {
    return;
  }

  /**
   * Creates a new entity of given entityType, with title from text.
   * If entityType==='notebook' then entityId will be ignored
   * if entityType==='section' then entityId indicates id of the nesting notebook,
   * if entityType==='page' then entityId indicates id of the nesting section,
   * @param text title of the 
   * @param entityType The type of entity to be created;
   * can be one of 'notebook', 'section' or 'page'.
   * @param entityId of the entity within which the new one shall be nested.
   */
  async handleEditableFocusOut(text: string, entityType: string, entityId: number) {

    this.setState({
      saving: true,
      error: '',
    });

    try {
      // entityType and entityId imply where to place the new entity
      if (entityType === EntityTypes.PAGE) await postPage(text, entityId);
      else if (entityType === EntityTypes.SECTION) await postSection(text, entityId);
      else if (entityType === EntityTypes.NOTEBOOK) await postNotebook(text);
      else {
        console.error('Can only handle Editable Focus Out for notebooks and sections');
        this.setState({ error: EnglishErrorMessages.HANDLE_EDITABLE_ERROR });
      }
    } catch (e) {
      console.error(e);
      this.setError(e);
    } finally {
      this.setNotebooksWithContents();
      this.setState({ saving: false });
    }
  }
  
  
  /**
   * Deletes an entity
   * @param {number} id of the entity being deleted.
   * @param {string} entityType Type of entity that is being deleted, i.e.
   * one of 'notebook', 'section', 'page' or 'image'.
   */
  async handleDeleteEntity(id: number, entityType: string) {

    let result;
    this.setState({deleting: true});
    // Delete the entity
    try {
      result = await deleteEntity(id, entityType);
      if (!result.ok) {
        this.setError(result.data.errors);
      } else {
        await this.setNotebooksWithContents();
        this.setError('');
      }
    } catch (e) {
      this.setError(e);
      console.error(e);
    }
    this.setState({deleting: false});
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
        <div>
          {this.state.saving && <span>Saving...</span>}
        </div>
        <div> {/* Display any potential error */}
          {error && <div>
          {  error.endsWith('not found.') && error + ' ' + EnglishErrorMessages.ADMIN_CAN_NOT
          || error.startsWith('Error: Error: User already has') && error.substr(7)
          || EnglishErrorMessages.UNKNOWN_ERROR + EnglishErrorMessages.UNKNOWN_ERROR }
          </div>
          }
        </div>
        <div className="row">
          <div className="col-3">
            <div>{this.state.deleting && <span>Deleting...</span>}</div>
            <SideBar
              notebookId={notebookId}
              sectionId={sectionId}
              setNotebookId={this.setNotebookId}
              setSectionId={this.setSectionId}
              setPageId={this.setPageId}
              notebooksWithContents={notebooksWithContents}
              handleDeleteEntity={this.handleDeleteEntity}
              handleEditableFocus={this.handleEditableFocus}
              handleEditableFocusOut={this.handleEditableFocusOut}
            />
          </div>
          <div className="col-9">
            {
              (this.state.page !== undefined) && 
              <Page
                key={this.state.page.id}
                page={this.state.page}
              />
            }
          </div>
        </div>
      </Fragment>
    )
  }
}