/**
 * /images route.
 */
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';

import {
  getImages,
  postImage,
} from '../../api';


import { IImage } from '../../api/types';
import NoAccess from '../system-pages/NoAccess';
import Button from '../../components/button/Button';
import ImagesComponentWithRouter from '../../components/images/ImagesWithRouter';

import { EnglishErrorMessages } from '../../MyConstClass';

import './Images.scss';

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

    this.setImages = this.setImages.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  // For uploading images
  handleFileChange(selectedFiles: FileList | null) {
    if (selectedFiles !== null && selectedFiles !== undefined && selectedFiles.length !== 0) {
      this.setSelectedFile(selectedFiles[0]);
    } else {
      this.setSelectedFile(undefined);
    }
  }
  
  async handleFileUpload() {
    console.log(this.state.selectedFile);
    if (this.state.selectedFile !== null && this.state.selectedFile !== undefined) {
      this.setSaving(true);
      try {
        await postImage(
          this.state.selectedFile.name, // Could offer a name choice
          this.state.selectedFile
        );
      } catch (e) {
        console.error('handleFileUpload ' + e);
        this.setError(e);
      } finally {
        this.setSaving(false);
      }
      if (!this.state.saving && !this.state.error) window.location.reload(false);
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
    if (error.includes('invalid token')) {
      console.error('Images ' + error);
      return (<NoAccess/>);
    }

    if (error.includes('expired token')) {
      console.error('Images ' + error);
      // Remove the user from localStorage
      localStorage.removeItem('user');
      window.location.replace('/login');
    }

    if (error.endsWith('not found.')){
      console.error('Images ' + error);
    }

    if (error !== '') {
      // TODO: Handle error from failed server request or other unknown error.
      console.error('Images UNHANDLED ' + error);
    }

    return (
      <Fragment>
        <Helmet title="Images"/>
        <div>{saving && <span>Saving...</span>}</div>
        <div>{deleting && <span>Deleting...</span>}</div>
        
        <div className="container__error"> {/* Display any potential error */}
          {error && error.endsWith('not found.') && error + ' ' + EnglishErrorMessages.ADMIN_CAN_NOT}
          {error && error.startsWith('Error: Error: User already has') && error.substr(7)}
          {error && error.startsWith('The title can not') && error}
          {/* Check for other unknown error */}
          {error && !error.endsWith('not found.') &&
          !error.startsWith('Error: Error: User already has') &&
          !error.startsWith('The title can not') && 
          EnglishErrorMessages.PERMITTED_FILE_TYPES}
        </div>

        <div className="upload"> 
          <strong>Upload an image and copy its Url to embed the image on your page.</strong>

          <input className="button button--small" type="file" onChange={ (e) => this.handleFileChange(e.target.files)} /> 
          <Button className="button button--small" onClick={this.handleFileUpload}>Upload</Button>
          
        </div> 
        <ImagesComponentWithRouter
          limit={6}
          paging={true}
        />
      </Fragment>
    )
  }
}