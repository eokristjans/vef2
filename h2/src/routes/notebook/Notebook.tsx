import React, { Fragment } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/button/Button';

import { getNotebooks, getNotebook } from '../../api';
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



// TODO: Add Page here
export default function NotebooksRoute() {

  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = useSideBar();


  return (
    <div className="row">
      <div className="column">
        <SideBar
          notebookId={notebookId}
          sectionId={sectionId}
          pageId={pageId}
          setNotebookId={setNotebookId}
          setSectionId={setSectionId}
          setPageId={setPageId}
        />
      </div>
      <div className="column">
        <Page
          pageId={pageId}
        />
      </div>
    </div>
    
  )
}