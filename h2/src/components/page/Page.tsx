import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

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


interface IPageProps {
  page: IPage,
  // notebookId: number,
  // sectionId: number,
  //pageId: number,
  // setNotebookId: (id: number) => void,
  // setSectionId: (id: number) => void,
  // setPageId: (id: number) => void,
}

export default function Page(props: IPageProps) {

  debug('Page() invoked...');

  const { page } = props;

  return (
    <Fragment>
      {<div>
          <h2>{page.title}</h2>
          <div>{page.body}</div>
        </div>}
    </Fragment>
  )
}
