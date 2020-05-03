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

import './MyNotebooks.scss';


interface IMyNotebookContainerState {
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

const initialState: IMyNotebookContainerState = {
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
interface IMyNotebookContainerProps {
  pageId?: number,
  match?: any,
}

/**
 * Route to /my-notebooks.
 * Manages which notebooks, section and page is open.
 * Fetches the notebooks when mounted,
 * Fetches a page when opened.
 */
export default class MyNotebooksContainer extends Component<IMyNotebookContainerProps, IMyNotebookContainerState> {

  constructor(props: IMyNotebookContainerProps) {
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
    const notebooksWithContents = await getNotebooksWithContents();
    this.setState({
      notebooksWithContents: notebooksWithContents,
    });
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
    if (entityType === EntityTypes.PAGE) {
      // entityType and entityId imply where to place the new entity
      try {
        const page = await postPage(text, entityId);
        await this.setNotebooksWithContents();
      } catch (e) {
        console.error(e);
        this.setState({ error: e });
      }
    }
    else if (entityType === EntityTypes.SECTION) {
      // entityType and entityId imply where to place the new entity
      this.setState({saving: true});
      try {
        const page = await postSection(text, entityId);
        await this.setNotebooksWithContents();
      } catch (e) {
        console.error(e);
        this.setState({ error: e });
      }
    }
    else if (entityType === EntityTypes.NOTEBOOK) {
      // entityType and entityId imply where to place the new entity
      this.setState({saving: true});
      try {
        const page = await postNotebook(text);
        await this.setNotebooksWithContents();
      } catch (e) {
        console.error(e);
        this.setState({ error: e });
      }
    }
    else {
      this.setState({ saving: false });
      this.setState({ error: EnglishErrorMessages.HANDLE_EDITABLE_ERROR });
      console.error('Can only handle Editable Focus Out for notebooks and sections');
    }
    this.setState({ saving: false });
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
        this.setState({ error: result.data.errors });
      } else {
        await this.setNotebooksWithContents();
        this.setState({ error: '' });
      }
    } catch (e) {
      this.setState({ error: 'Error deleting: ' + e});
      console.error(e);
    }
    this.setState({deleting: false});
  }

  setNotebooksWithContents = async () => {
    // Get the notebooks and set the state
    const newNotebooksWithContents = await getNotebooksWithContents();
    this.setState({
      notebooksWithContents: newNotebooksWithContents,
    });
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
    debug('Notebook setPageId: ' + id);
    this.setState({
      pageId: id,
    });
  }

  render() {
    const {
      notebookId,
      sectionId,
      notebooksWithContents,
    } = this.state;

    return (
      <Fragment>
        <div>
          {this.state.saving && <span>Saving...</span> || this.state.error}
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