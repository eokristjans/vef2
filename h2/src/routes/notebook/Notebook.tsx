import React, { Component, Fragment, ReactNode } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/button/Button';

import {
  getNotebooksWithContents,
  getPage,
} from '../../api';


import { INotebook, ISection, IPage } from '../../api/types';
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
  }

  async componentDidMount() {

    debug('componentDidMount()');
    const notebooksWithContents = await getNotebooksWithContents();

    this.setState({
      notebooksWithContents: notebooksWithContents,
    });
  }

  async componentDidUpdate() {
    debug('componentDidUpdate');
    debug('state.prevPageId ' + this.state.prevPageId);
    debug('state.pageId ' + this.state.pageId);
    debug(' ')

    if (this.state.pageId !== this.state.prevPageId) {
      debug('page changed');
      this.setState({
        page: await getPage(this.state.pageId),
        prevPageId: this.state.pageId,
      })
    }

    debug('has page? ' + (this.state.page ? 'yes' : 'no'));
  }

  setNotebookId = (id: number) => {
    this.setState({
      notebookId: id,
    })
  }
  setSectionId = (id: number) => {
    this.setState({
      sectionId: id,
    })
  }
  setPageId = (id: number) => {
    this.setState({
      pageId: id,
    })
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
          <div className="column">
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
          <div className="column">
            {
              (this.state.page !== undefined) && 
              <Page
                page={this.state.page}
              />
            }
          </div>
        </div>
      </Fragment>
    )
  }
}




// TODO: Add Page here
function NotebooksRoute() {

  let {
    items: notebooksWithContents,
    loading,
    error,
  } = useApi<INotebook[]>(getNotebooksWithContents.bind(null), [], []);


  // TODO: Try to get page here and be done with it

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId,
  } = useSideBar();

  const {items: page } = useApi<IPage|null>(getPage.bind(null, pageId), null, []);


  return (
    <Fragment>
      <div className="row">
        <div className="column">
          <SideBar
            notebookId={notebookId}
            sectionId={sectionId}
            pageId={pageId}
            setNotebookId={setNotebookId}
            setSectionId={setSectionId}
            setPageId={setPageId}
            notebooksWithContents={notebooksWithContents}
          />
        </div>
        <div className="column">
          {/* <Page
            pageId={pageId}
          /> */}
        </div>
      </div>
    </Fragment>
    // <Fragment>
    //   <MyNotebooksContainer
    //     notebooksWithContents={notebooksWithContents}
    //   />
    // </Fragment>
  )
}