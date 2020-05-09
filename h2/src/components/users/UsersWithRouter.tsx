
import React, { Component, Fragment, ReactNode, useState } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

import Button from '../button/Button';

import {
  getUsers,
  deleteEntity,
} from '../../api';


import { IUser, IApiResult } from '../../api/types';
import { Context } from '../../UserContext';
import useApi from '../../hooks/useApi';
import Paging from '../paging/Paging';

import { 
  EnglishConstants, 
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './Users.scss';
import Login from '../../routes/login/Login';


interface IUsersProps {
  limit?: number;
  paging?: boolean;
  location: Location;
  history: any;
  children: (data: IUser[], loading: boolean, error: string) => JSX.Element;
}

function UsersComponentWithRouter(
  {
    limit = 10,
    paging = false,
    location,
    history,
    children,
  }: IUsersProps
) {

  const params = new URLSearchParams(location.search);

  const page: number = Number(params.get('page')) || 1;

  const offset = (page - 1) * limit;

  const {items, loading, error} = useApi<IUser[]>(getUsers.bind(null, { limit, offset }), [], [page]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const prev = page > 1 && items.length > 0;
  const next = items.length === limit;

  function onPagingClick(page: number, dir: string) {
    let newPage = 1;
    switch (dir) {
      case 'prev':
        newPage = Math.max(1, page - 1)
        break;
      case 'next':
        newPage = Math.max(1, page + 1)
        break;
      default:
        break;
    }
    history.push(`${location.pathname}?page=${newPage}`);
  }

  /**
   * Deletes an entity and reloads the window
   * @param {number} id of the entity being deleted.
   * @param {string} entityType Type of entity that is being deleted, i.e.
   * one of 'notebook', 'section', 'page', 'image' or 'user'.
   */
  async function handleDeleteEntity(id: number, entityType: string) {
    setDeleteError('');
    setDeleting(true);

    let result;
    // Delete the entity
    try {
      result = await deleteEntity(id, entityType);
      if (!result || !result.ok) {
        console.error(result.status);
        setDeleteError(EnglishErrorMessages.UNKNOWN_ERROR + EnglishErrorMessages.ERROR_ADVICE);
      }
    } catch (e) {
      console.error(e);
      setDeleteError(e + '');
    } finally {
      if (deleteError === '') window.location.reload(false);
      setDeleting(false);
    }
  }

  return (    
    <Fragment>
      {deleting && (
        <li>Deleting...</li>
      )}
      {deleteError && (
        <li>Failed to delete user. {deleteError}</li>
      )}
      {loading && (
        <li>Loading...</li>
      )}
      {error && (
        <li>Failed to load users. {error}</li>
      )}
      <ul className="users__list">
      {!loading && !error && items.map(user => (
        <li key={user.id} className="users__item">
          <span>{user.id} </span>
          <span>{user.username} </span>
          <span>{user.email} </span>
          <Button
            children={EnglishConstants.DELETE_BUTTON}
            onClick={() => handleDeleteEntity(user.id, EntityTypes.USER)}
          />
        </li>
      ))}
      </ul>
      
      {paging && (
        <Paging
          next={next}
          prev={prev}
          page={page}
          onClick={onPagingClick}
        />
      )}
    </Fragment>
  )
}

export default withRouter(UsersComponentWithRouter);