
import React, { Component, Fragment, ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Button from '../../components/button/Button';

import {
  getImages,
  getImage,
  postImage,
} from '../../api';


import { IImage, IApiResult } from '../../api/types';
import { Context } from '../../UserContext';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';
import SideBar from '../../components/sidebar/SideBar';
import Page from '../../components/page/Page';

import { 
  EnglishConstants, 
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './Images.scss';
import Login from '../login/Login';


interface IImagesProps {
  children: (data: IImage[], loading: boolean, error: string) => JSX.Element;
}

function ImagesComponent({ children }: IImagesProps) {
  const {items, loading, error} = useApi<IImage[]>(getImages.bind(null, { limit: 20 }), []);

  return children(items, loading, error);
}



interface IImagesState {
  images: IImage[],
  deleting: boolean,
  saving: boolean,
  error: string,
}

const initialState: IImagesState = {
  images: [],
  deleting: false,
  saving: false,
  error: '',
};

/**
 * Route to /images.
 * Manages which images, section and page is open.
 * Fetches the images when mounted,
 * Fetches a page when opened.
 */
export default class Images extends Component<{}, IImagesState> {

  constructor(props: {}) {
    super(props);
    this.state = initialState;

    // Basic setters
    this.setImages = this.setImages.bind(this);

    // this.handleDeleteEntity = this.handleDeleteEntity.bind(this);
  }

  async componentDidMount() {
    // Get the images and set the state
    // await this.setImages();
  }

  async componentDidUpdate() {
  }

  setImages = async () => {
    // Get the images and set the state
    try {
      const newImages = await getImages();
      this.setState({
        images: newImages,
      });
    } catch (e) {
      this.setError(e);
    }
  }
  setError = (error: any) => {
    this.setState({
      error: error + '',
    });
  }

  render() {
    const {
      saving,
      deleting,
      error,
    } = this.state;

    // TODO: Not good to match on strings
    if (error == 'Error: invalid token') {
      console.error('Notebooks ' + error);
      return (<NoAccess/>);
    }

    if (error == 'Error: expired token') {
      console.error('Notebooks ' + error);
      // Remove the user from localStorage
      localStorage.removeItem('user');

      // window.location.replace('/login');
      // TODO: return <Login /> with new prop, message = 'Your login session expired'
      return (<Login/>);
    }

    if (error.endsWith('not found.')){
      console.error('Notebooks ' + error);
    }

    if (error != '') {
      // TODO: Handle error from failed server request or other unknown error.
      console.error('Notebooks UNHANDLED ' + error);
    }

    return (
      <Fragment>
        <div>{saving && <span>Saving...</span>}</div>
        <div>{deleting && <span>Deleting...</span>}</div>
        <div> {/* Display any potential error */}
          {error && <div>
          {  error.endsWith('not found.') && error + ' ' + EnglishErrorMessages.ADMIN_CAN_NOT
          || error.startsWith('Error: Error: User already has') && error.substr(7)
          || EnglishErrorMessages.UNKNOWN_ERROR + EnglishErrorMessages.UNKNOWN_ERROR }
          </div>
          }
        </div>

        <ul className="images__list">
        <ImagesComponent>
          {(images, loading, error) => (
            <Fragment>
            {loading && (
              <li>Loading...</li>
            )}
            {error && (
              <li>{error}</li>
            )}
            {!loading && !error && images.map(image => (
              <li key={image.id} className="images__item">
                <span>{image.title} </span>
                <span> ({image.url})</span>
              </li>
            ))}
            </Fragment>
          )}
        </ImagesComponent>
      </ul>

      </Fragment>
    )
  }
}