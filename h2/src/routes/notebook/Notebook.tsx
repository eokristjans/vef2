import React, { Component, Fragment, ReactNode } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/button/Button';

import {
  getNotebooksWithContents,
  getPage,
} from '../../api';

import { INotebook } from '../../api/types';
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


interface IMyNotebookContainerProps {
  notebooksWithContents: INotebook[]
}

class MyNotebooksContainer extends Component<IMyNotebookContainerProps,{}> {

  state = {
    notebookId: 0, 
    sectionId: 0, 
    pageId: 0, 
  };

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

    const { notebooksWithContents } = this.props;

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
              notebooksWithContents={notebooksWithContents}
            />
          </div>
          <div className="column">
            <Page
              pageId={pageId}
            />
          </div>
        </div>
      </Fragment>
    )
  }
}




// TODO: Add Page here
export default function NotebooksRoute() {

  const {
    items: notebooksWithContents,
    loading,
    error,
  } = useApi<INotebook[]>(getNotebooksWithContents.bind(null), []);


  // TODO: Try to get page here and be done with it

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId,
  } = useSideBar();


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
          <Page
            pageId={pageId}
          />
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