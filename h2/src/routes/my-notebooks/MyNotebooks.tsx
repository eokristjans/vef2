import React, { Component, Fragment, ReactNode } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/button/Button';

import {
  getNotebooksWithContents,
  getPage,
  deleteEntity,
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
  error?: any,
}

const initialState: IMyNotebookContainerState = {
  notebooksWithContents: [],
  notebookId: 0,
  sectionId: 0,
  pageId: 0,
  prevPageId: 0,
  deleting: false,
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
    this.setNotebookId = this.setNotebookId.bind(this);
    this.setSectionId = this.setSectionId.bind(this);
    this.setPageId = this.setPageId.bind(this);
    this.setNotebooksWithContents = this.setNotebooksWithContents.bind(this);
    this.handleDeleteEntity = this.handleDeleteEntity.bind(this);
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
        this.setState({ error: null });
      }
    } catch (e) {
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
        <div className="row">
          <div className="col-3">
            <SideBar
              notebookId={notebookId}
              sectionId={sectionId}
              setNotebookId={this.setNotebookId}
              setSectionId={this.setSectionId}
              setPageId={this.setPageId}
              notebooksWithContents={notebooksWithContents}
              handleDeleteEntity={this.handleDeleteEntity}
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