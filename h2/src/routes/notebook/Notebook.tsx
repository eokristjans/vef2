import React, { Component, Fragment, ReactNode } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/button/Button';

import {
  getNotebooksWithContents,
  getPage,
} from '../../api';


import { INotebook, IPage } from '../../api/types';
import { Context } from '../../UserContext';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';

import SideBar from '../../components/sidebar/SideBar';
import Page from '../../components/page/Page';

import { EnglishConstants, EnglishErrorMessages } from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './Notebook.scss';


interface IMyNotebookContainerState {
  notebooksWithContents: INotebook[],
  page?: IPage,
  notebookId: number, 
  sectionId: number,
  pageId: number,
  prevPageId: number,
}

const initialState: IMyNotebookContainerState = {
  notebooksWithContents: [],
  notebookId: 0,
  sectionId: 0,
  pageId: 0,
  prevPageId: 0,
};

// TODO: ??
interface IMyNotebookContainerProps {
  pageId?: number,
  match?: any,
}

export default class MyNotebooksContainer extends Component<IMyNotebookContainerProps, IMyNotebookContainerState> {

  constructor(props: IMyNotebookContainerProps) {
    super(props);
    this.state = initialState;
    this.setNotebookId = this.setNotebookId.bind(this);
    this.setSectionId = this.setSectionId.bind(this);
    this.setPageId = this.setPageId.bind(this);
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
      this.setState({
        page: await getPage(this.state.pageId),
        prevPageId: this.state.pageId,
      });
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
    debug('Notebook setPageId: ' + id);
    this.setState({
      pageId: id,
    });
    this.forceUpdate();
  }

  render() {
    const {
      notebookId,
      sectionId,
      pageId,
    } = this.state;

    return (
      <Fragment>
        <div className="row">
          <div className="col-3">
            <SideBar
              notebookId={notebookId}
              sectionId={sectionId}
              pageId={pageId}
              setNotebookId={this.setNotebookId}
              setSectionId={this.setSectionId}
              setPageId={this.setPageId}
              notebooksWithContents={this.state.notebooksWithContents}
            />
          </div>
          <div className="col-9">
            {
              (this.state.page !== undefined) && 
              <Page
                page={this.state.page}
                prevPageId={this.state.prevPageId}
              />
            }
          </div>
        </div>
      </Fragment>
    )
  }
}