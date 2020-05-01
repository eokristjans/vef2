import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';

import {
  getNotebooks,
  getPage,
} from '../../api';
import { INotebook, ISection, IPage } from '../../api/types';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../../routes/system-pages/NotFound';
import NoAccess from '../../routes/system-pages/NoAccess';

import { EnglishConstants, EnglishErrorMessages } from '../../MyConstClass';

import { debug } from '../../utils/debug';

// import './SideBar.scss';

// TODO: Add `preventDefault` to onClicks?


interface ISideBarProps {
  notebookId: number,
  sectionId: number,
  pageId: number,
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
}

export default function Page(props: ISideBarProps) {

  debug('Page() invoked...');

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = props;

  debug('Page() pageId: ' + pageId);
    
  const {items: page, loading, error} = useApi<IPage|null>(getPage.bind(null, pageId), null);

  if (error && error === 'invalid token') {
    return (<NoAccess />);
  }

  // TODO ekki gott að matcha á streng
  if (error && error === 'Page not found') {
    return (<NotFound />);
  }
  
  if (loading) {
    return ( <span>Loading page...</span> );
  }
  
  if (!page) {
    return (
    <span>no page + {new Date().toLocaleString()}</span>
    );
  }

  if (!loading && !error) {
    debug('page: ' + page);
  }

  return (
    <Fragment>
      {!loading && !error && 
        <div>
          <h2>{page.title}</h2>
          <div>{page.body}</div>
        </div>}
    </Fragment>
  )
}
