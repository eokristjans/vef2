/**
 * Component that displays the user's images. Supports Paging.
 */
import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
  getImages,
  deleteEntity,
} from '../../api';
import { IImage } from '../../api/types';
import useApi from '../../hooks/useApi';
import Paging from '../paging/Paging';
import NoAccess from '../../routes/system-pages/NoAccess';

import { 
  EnglishConstants, 
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import './ImagesWithRouter.scss';

interface IImagesProps {
  limit?: number;
  paging?: boolean;
  location: Location;
  history: any;
  children: (data: IImage[], loading: boolean, error: string) => JSX.Element;
}

function ImagesComponentWithRouter({ limit = 10, paging = false, location, history, }: IImagesProps) {

  const params = new URLSearchParams(location.search);
  const page: number = Number(params.get('page')) || 1;
  const offset = (page - 1) * limit;

  const {items, loading, error} = useApi<IImage[]>(getImages.bind(null, { limit, offset }), [], [page]);
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
   * one of 'notebook', 'section', 'page' or 'image'.
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

  if (error.endsWith(EnglishErrorMessages.EXPIRED_TOKEN)) {
    // Remove the user from localStorage
    localStorage.removeItem('user');
    window.location.replace('/login');
  }

  if (error.endsWith(EnglishErrorMessages.INVALID_TOKEN)) {
    return (<NoAccess/>);
  }

  return (
    <Fragment>
      {deleting && (
        <li>Deleting...</li>
      )}
      {deleteError && (
        <li>Failed to delete image. {deleteError}</li>
      )}
      {loading && (
        <li>Loading...</li>
      )}
      {error && (
        <li>Failed to load images. {error}</li>
      )}

      <div className="images">

        <ul className="images__list">
        {!loading && !error && items.map(image => (
          <li key={image.id} className="images__item">
            {/* Render each image */}
            <div className="image">

              <div className="image__image">
                <a href={image.url} target="_blank" rel="noopener noreferrer">
                  <img className="image__img" alt={image.title} src={image.url}/>
                </a>
              </div>

              <div className="image__content">
                <table>
                  <tr>
                    <td className="image__delete">
                      <div className="image__delete__button"
                        title={EnglishConstants.DELETE_HOVER + EntityTypes.IMAGE} 
                        onClick={() => { if (window.confirm(EnglishConstants.DELETE_CONFIRM + EntityTypes.IMAGE + '?')) handleDeleteEntity(image.id, EntityTypes.IMAGE) } }
                      ><span role="img" aria-label="Delete-Cross">❌</span></div>
                    </td>
                    <th>Title:</th>
                    <td className="image__title">{image.title}</td>
                    <th>Created:</th>
                    <td>{image.created.toLocaleString()}</td>
                  </tr>
                </table>
                <table>
                  <tr>
                    <th>Url:</th>
                    <td className="image__url">{image.url}</td>
                  </tr>
                </table>
              </div>

            </div>
          </li>
        ))}
        </ul>
      </div>
      
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

export default withRouter(ImagesComponentWithRouter);