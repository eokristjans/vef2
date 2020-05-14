/**
 * Component that provides a list of all users.
 */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import {
  getUsers,
  deleteEntity,
} from '../../api';
import { IUser } from '../../api/types';
import useApi from '../../hooks/useApi';
import Paging from '../paging/Paging';

import { 
  EnglishConstants, 
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import './UsersWithRouter.scss';

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
      else {        
        // No exception was caught and result was ok, so there is no error. Best reload the page.
        window.location.reload(false);
      }
    } catch (e) {
      console.error(e);
      setDeleteError(e + '');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="users">
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

      <table className="users__table">
        <tr>
          <th>Id</th>
          <th>Username</th>
          <th>Email Address</th>
          <th>Created</th>
          <th className="users__admin">Admin</th>
          <th className="users__delete">Delete?</th>
        </tr>
      {!loading && !error && items.map(user => (
        <tr key={user.id} className="users__item">
          <td>{user.id}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.created ? user.created.toLocaleDateString() : ''}</td>
          <td className="users__admin">{user.admin ? '✔' : '🗙'}</td>
          <td className="users__delete" >
            <div className="users__delete__button"
              title={EnglishConstants.DELETE_HOVER + EntityTypes.USER} 
              onClick={() => { if (window.confirm(EnglishConstants.DELETE_CONFIRM + EntityTypes.USER + '?')) handleDeleteEntity(user.id, EntityTypes.USER) } }
            >❌</div>
          </td>
        </tr>
      ))}
      </table>
      
      {paging && (
        <Paging
          next={next}
          prev={prev}
          page={page}
          onClick={onPagingClick}
        />
      )}
    </div>
  )
}

export default withRouter(UsersComponentWithRouter);