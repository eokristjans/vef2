import React, { Fragment } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Button from '../../components/button/Button';

import { getNotebooks, getNotebook } from '../../api';
import { INotebook } from '../../api/types';
import { Context } from '../../UserContext';
import useApi from '../../hooks/useApi';
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';

import SideBar from '../../components/sidebar/SideBar';

import { EnglishConstants, EnglishErrorMessages } from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './Notebook.scss';



interface INotebookProps {
  // TODO correct type
  match: any,
}

// TODO: Add Page here
export default function NotebooksRoute() {

  return (
    <SideBar/>
  )
}