
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
  // TODO: Add link to next page of images
  const {items, loading, error} = useApi<IImage[]>(getImages.bind(null, { limit: 10 }), []);

  return children(items, loading, error);
}



interface IImagesState {
  images: IImage[],
  deleting: boolean,
  saving: boolean,
  error: string,
  selectedFile?: File | undefined,
  fileTitle: string,
}

const initialState: IImagesState = {
  images: [],
  deleting: false,
  saving: false,
  error: '',
  fileTitle: '',
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
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);

    // this.handleDeleteEntity = this.handleDeleteEntity.bind(this);
  }

  async componentDidMount() {
    // Get the images and set the state
    // await this.setImages();
  }

  async componentDidUpdate() {
  }

  handleFileChange(selectedFiles: FileList | null) {
    if (selectedFiles !== null && selectedFiles !== undefined && selectedFiles.length !== 0) {
      this.setSelectedFile(selectedFiles[0]);
    } else {
      this.setSelectedFile(undefined);
    }
  }
  handleFileTextChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.value === '' && this.state.selectedFile) {
      this.setState({ 
        fileTitle: this.state.selectedFile.name
      });
    } else {
      this.setState({ fileTitle: e.currentTarget.value });
    }
  }
  
  async handleFileUpload() {
    console.log(this.state.selectedFile);
    if (this.state.selectedFile !== null && this.state.selectedFile !== undefined) {
      this.setSaving(true);
      try {
        const uploadedFile = await postImage(
          this.state.selectedFile.name, // TODO: offer name choice?
          this.state.selectedFile
        );
      } catch (e) {
        console.error('handleFileUpload ' + e);
        this.setError(e);
      } finally {
        this.setSaving(false);
      }
    }
  }

  setSelectedFile = (file: File | undefined) => {
    this.setState({
      selectedFile: file,
    });
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
  setSaving = (saving: boolean) => {
    this.setState({
      saving: saving,
    });
  }
  setDeleting = (deleting: boolean) => {
    this.setState({
      deleting: deleting,
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
      console.error('Images ' + error);
      return (<NoAccess/>);
    }

    if (error == 'Error: expired token') {
      console.error('Images ' + error);
      // Remove the user from localStorage
      localStorage.removeItem('user');

      // window.location.replace('/login');
      // TODO: return <Login /> with new prop, message = 'Your login session expired'
      return (<Login/>);
    }

    if (error.endsWith('not found.')){
      console.error('Images ' + error);
    }

    if (error != '') {
      // TODO: Handle error from failed server request or other unknown error.
      console.error('Images UNHANDLED ' + error);
    }

    return (
      <Fragment>
        <div>{saving && <span>Saving...</span>}</div>
        <div>{deleting && <span>Deleting...</span>}</div>
        <div> {/* Display any potential error */}
          {error && <div>
          {  error.endsWith('not found.') && error + ' ' + EnglishErrorMessages.ADMIN_CAN_NOT
          || error.startsWith('Error: User already has') && error
          || EnglishErrorMessages.PERMITTED_FILE_TYPES }
          </div>
          }
        </div>
        {/* TODO: Consider changing to form with onSubmit. I tried it but then the 
          page was refreshed after failed upload, so the error disappeared immediately.
          Consider adding text input field. However, onChange() currently causes all
          images to be fetched again every time it refreshes...
        */}
        <div> 
          <input type="file" onChange={ (e) => this.handleFileChange(e.target.files)} /> 
          {/* <input type="text" value={this.state.fileTitle} onChange={ (e) => this.handleFileTextChange(e)}/> */}
          <button onClick={this.handleFileUpload}>Upload image</button>
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
                <p>{image.url} </p>
                <a href={image.url}>
                  <img alt={image.title} src={image.url} width="150" height="150"/>
                </a>
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