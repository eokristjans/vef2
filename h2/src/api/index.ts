/**
 * Contains methods to perform HTTP requests to various API endpoints.
 */

import { IApiResult, IHeaders } from './types';
import { IPage, ISection, INotebook, IImage, IUser } from './types';
import { mapPage, mapSection, mapNotebook, mapImage, mapUser } from './mapping';

import { 
  EnglishErrorMessages, 
  ConsoleErrorMessages,
  EntityTypes,
 } from '../MyConstClass';

 import { isUndefined } from 'util';

const baseurl:string | undefined = process.env.REACT_APP_API_URL;

async function get(path: string): Promise<IApiResult> {
  return request('GET', path);
}

async function post(path: string, data: any): Promise<IApiResult> {
  return request('POST', path, data);
}

async function patch(path: string, data: any): Promise<IApiResult> {
  return request('PATCH', path, data);
}

async function deleteMethod(path: string): Promise<IApiResult> {
  return request('DELETE', path);
}

async function postFile(path: string, data: FormData): Promise<IApiResult> {
  return fileRequest('POST', path, data);
}

/** Async method to perform a HTTP request with option JSON data. */
async function request(method: string, path: string, data?: any) {
  const url = new URL(path, baseurl);

  const options: IHeaders = {
    method,
    headers: {},
  };

  if (data) {
    options.headers = { 'content-type': 'application/json' };
    options.body = JSON.stringify(data);
  }

  const user = window.localStorage.getItem('user');

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('data', userData)
      options.headers['Authorization'] = `Bearer ${userData.token}`;
    } catch (e) {
      console.warn('Unable to parse user from localStorage', e);
    }
  }

  const response = await fetch(url.href, options);

  // Perform request and wait for response. Catch error from null response when deleting.
  let json = null;
  try {
    json = await response.json();
  } catch (e) {
    console.error('No JSON response from request. Probably would have been null: ' + e);
  }

  const { status, ok } = response;

  return {
    data: json,
    ok,
    status,
  }
}

/** Async method to perform a HTTP request with FormData. */
async function fileRequest(method: string, path: string, data: FormData) {
  const url = new URL(path, baseurl);

  const options: IHeaders = {
    method,
    headers: {},
  };

  if (data) {
    options.body = data;
  }

  const user = window.localStorage.getItem('user');

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('data', userData)
      options.headers['Authorization'] = `Bearer ${userData.token}`;
    } catch (e) {
      console.warn('Unable to parse user from localStorage', e);
    }
  }

  const response = await fetch(url.href, options);

  // Perform request and wait for response. Catch error from null response when deleting.
  let json = null;
  try {
    json = await response.json();
  } catch (e) {
    console.error(ConsoleErrorMessages.NO_JSON_RESPONSE + e);
  }

  const { status, ok } = response;

  return {
    data: json,
    ok,
    status,
  }
}

/**
 * Registers a user with the given input if they are valid.
 * @param username
 * @param password
 * @param email
 */
async function registerUser(
  username: string, 
  password: string, 
  email: string
): Promise<IApiResult> {
  let result: IApiResult;

  try {
    result = await post('/users/register', { username, password, email });
  } catch (e) {
    throw new Error(EnglishErrorMessages.SIGN_UP_ERROR);
  }

  return result;
}

/**
 * Logs a user in if the given credentials match those of a user in the system.
 * @param username
 * @param password
 */
async function loginUser(username: string, password: string): Promise<any> {
  let result: IApiResult;

  try {
    result = await post('/users/login', { username, password });
  } catch (e) {
    throw new Error(EnglishErrorMessages.LOGIN_ERROR);
  }

  return result;
}

/**
 * Async function that returns a promise with an array of INotebooks.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 */
async function getNotebooksWithContents(): Promise<INotebook[]> {
  let result: IApiResult;

  try {
    result = await get('/notebooks-with-contents');
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebooks-with-contents' + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
    const { data: { error } } = result;
  	// Throws error: 'expired token' if the user's token is expired.
  	// Throws error: 'invalid token' if the user's token doesn't match any user.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebooks-with-contents' + error);
    throw new Error(error);
  }

  return result.data.results.map(mapNotebook);
}


/**
 * Async function that returns a promise with an array of INotebooks.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 */
async function getNotebooks(): Promise<INotebook[]> {
  let result: IApiResult;

  try {
    result = await get('/notebooks');
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebooks' + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
    const { data: { error } } = result;
  	// Throws error: 'expired token' if the user's token is expired.
  	// Throws error: 'invalid token' if the user's token doesn't match any user.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebooks' + error);
    throw new Error(error);
  }

  return result.data.results.map(mapNotebook);
}


/**
 * Async function that fetches a notebook and returns it.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: 'notebook not found' if the notebook was not found or does not belong to the user.
 */
async function getNotebook(id: number | string): Promise<INotebook> {
  let result: IApiResult;

  try {
    result = await get(`/notebooks/${id}`);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebook' + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
    const { data: { error } } = result;
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: 'notebook not found' if the notebook was not found or does not belong to the user.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebook' + error);
    throw new Error(error);
  }

  return mapNotebook(result.data);
}


/**
 * Async function that fetches a section and returns it.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: 'section not found' if the page was not found or does not belong to the user.
 */
async function getSection(id: number | string): Promise<ISection> {
  let result: IApiResult;

  try {
    result = await get(`/sections/${id}`);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + EntityTypes.SECTION + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: 'section not found' if the section was not found or does not belong to the user.
    const { data: { error } } = result;
    console.error(ConsoleErrorMessages.ERROR_FETCHING + EntityTypes.SECTION + error);
    throw new Error(error);
  }

  return mapSection(result.data);
}


/**
 * Async function that fetches a page and returns it.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: 'page not found' if the page was not found or does not belong to the user.
 */
async function getPage(id: number | string): Promise<IPage> {
  let result: IApiResult;

  console.warn(`getPage(${id})`);

  try {
    result = await get(`/pages/${id}`);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + EntityTypes.PAGE + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: 'page not found' if the page was not found or does not belong to the user.
    const { data: { error } } = result;
    console.error(ConsoleErrorMessages.ERROR_FETCHING + EntityTypes.PAGE + error);
    throw new Error(error);
  }

  return mapPage(result.data);
}

/**
 * Async function that patches a page and returns it.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: 'page not found' if the page was not found or does not belong to the user.
 * @param page 
 */
async function patchPage(page: IPage): Promise<IPage> {
  let result: IApiResult;

  try {
    result = await patch(`/pages/${page.id}`, page);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.PATCH_ERROR + EntityTypes.PAGE + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: 'page not found' if the page was not found or does not belong to the user.
    const { data: { error } } = result;
    console.error(ConsoleErrorMessages.PATCH_ERROR + EntityTypes.PAGE + error);
    throw new Error(error);
  }
  
  return mapPage(result.data);
}

/**
 * Async function that deletes an entity.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: '${entityType} not found' if the entityType was not found or does not belong to the user.
 * Throws error: 'Cannot delete entity of unknown type.' if the type is not one of the four options.
 * @param id 
 * @param entityType Type of entity to delete, must be one of 'notebook', 'section',
 * 'page' or 'image'.
 */
async function deleteEntity(id: number, entityType: string): Promise<IApiResult> {

  // Validate entityType
  const entityTypes = Object.values(EntityTypes);
  if (!entityTypes.includes(entityType)) {
    // Throws error: 'Cannot delete entity of unknown type.' if the type is not one of the four options.
    throw new Error('Cannot delete entity of unknown type.');
  }

  let result: IApiResult;
  try {
    result = await deleteMethod(`/${entityType}s/${id}`);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.DELETE_ERROR + entityType, e);
    throw new Error(e);
  }

  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: '${entityType} not found' if the entityType was not found or does not belong to the user.
    const { data: { error } } = result;
    console.error(ConsoleErrorMessages.DELETE_ERROR + entityType + error);
    throw new Error(error);
  }

  console.warn(`after deleting ${entityType} with id (${id})`);

  return result;
}


/**
 * Posts an entity owned by the user.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: '${entityType} not found' if the entityType was not found or does not belong to the user.
 * Throws error: 'Cannot create entity of unknown type.' if the type is not one of the four options.
 * @param data Body of the request, shaped as JSON Object.
 * @param entityType Type of entity to create, must be one of 'notebook', 'section',
 * 'page' or 'image'.
 */
async function postEntity(
  data: any, 
  entityType: string
): Promise<IApiResult> {

  // Validate entityType
  if ( entityType !== EntityTypes.IMAGE
    && entityType !== EntityTypes.NOTEBOOK
    && entityType !== EntityTypes.SECTION
    && entityType !== EntityTypes.PAGE    
  ) {
    // Throws error: 'Cannot create entity of unknown type.' if the type is not one of the four options.
    throw new Error('Cannot create entity of unknown type.')
  }

  let result: IApiResult;
  try {
    result = await post(`/${entityType}s`, data);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.POST_ERROR + entityType, e);
    throw new Error(e);
  }

  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: '${entityType} not found' if the entityType was not found or does not belong to the user.
    let { data: { error } } = result;

    // In case of field error, in which case they are returned as an array
    if (isUndefined(error)) {
      console.error('postEntity() undefined error');
      const { data: { errors } } = result;
      error = errors[0]['error'];
    }

    console.error(ConsoleErrorMessages.POST_ERROR + entityType + ': ' + error);
    throw new Error(error);
  }

  console.warn(`before creating ${entityType} with title (${data.title})`);

  return result;
}

/**
 * Calls postEntity with data created from title and sectionId.
 * Maps the result to Page.
 * @param title 
 * @param sectionId 
 */
async function postPage(title: string, sectionId: number): Promise<IPage> {
  let result;
  try {
    result = await postEntity(
      { sectionId: sectionId, title: title },
      EntityTypes.PAGE,
    );  
  } catch (e) {
    throw new Error(e);
  }
  return mapPage(result.data);
}

/**
 * Calls postEntity with data created from title and notebookId.
 * Maps the result to Section
 * @param title 
 * @param notebookId 
 */
async function postSection(title: string, notebookId: number): Promise<ISection> {
  let result;
  try {
    result = await postEntity(
      { notebookId: notebookId, title: title },
      EntityTypes.SECTION,
    );
  } catch (e) {
    throw new Error(e);
  }
  return mapSection(result.data);
}


/**
 * Calls postEntity with data created from title.
 * Maps the result to notebook.
 * @param title 
 */
async function postNotebook(title: string): Promise<INotebook> {
  let result;
  try {
    result = await postEntity(
    { title: title },
    EntityTypes.NOTEBOOK,
  );
} catch (e) {
  throw new Error(e);
}
  return mapNotebook(result.data);
}

/**
 * Calls postEntity with data created from title and url.
 * Maps the result to image.
 * @param title 
 */
async function postImage(title: string, file: File): Promise<IImage> {

  const data = new FormData();
  data.append('title', file.name);
  data.append('url', file);
   

  let result: IApiResult;

  try {
    result = await postFile('/images', data);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.POST_ERROR + EntityTypes.IMAGE, e);
    throw new Error(e);
  }

  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: '${entityType} not found' if the entityType was not found or does not belong to the user.
    let { data: { error } } = result;

    // In case of field error, in which case they are returned as an array
    if (isUndefined(error)) {
      console.error('postImage() undefined error');
      const { data: { errors } } = result;
      error = errors[0]['error'];
    }

    console.error(ConsoleErrorMessages.POST_ERROR + EntityTypes.IMAGE + ': ' + error);
    throw new Error(error);
  }

  return mapImage(result.data);
}

/**
 * Async function that fetches a images and returns them.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * @param param0 {limit, offset}
 */
async function getImages({ limit = 10, offset = 0 } = {}): Promise<IImage[]> {
  let result: IApiResult;

  try {
    result = await get(`/images?limit=${limit}&offset=${offset}`);
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'images', e);
    throw new Error(e);
  }
  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    const { data: { error } } = result;
    throw new Error(error);
  }

  return result.data.items.map(mapImage);
}


/**
 * Async function that fetches a Users and returns them.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * @param param0 {limit, offset}
 */
async function getUsers({ limit = 10, offset = 0 } = {}): Promise<IUser[]> {
  let result: IApiResult;

  try {
    result = await get(`/users`); // ?limit=${limit}&offset=${offset}
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'users', e);
    throw new Error(e);
  }
  if (result && !result.ok) {
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    const { data: { error } } = result;
    throw new Error(error);
  }

  return result.data.items.map(mapUser);
}

/**
 * Async function that fetches an image and returns it.
 * Throws unspecified error if HTTP request is unsuccessful.
 * Throws error: 'expired token' if the user's token is expired.
 * Throws error: 'invalid token' if the user's token doesn't match any user.
 * Throws error: 'image not found' if the image was not found or does not belong to the user.
 */
async function getImage(id: number | string): Promise<IImage> {
  let result: IApiResult;

  try {
    result = await get(`/images/${id}`);
  } catch (e) {
    // Throws unspecified error if HTTP request is unsuccessful.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'image' + e);
    throw new Error(e);
  }

  if (result && !result.ok) {
    const { data: { error } } = result;
  	// Throws error: 'expired token' if the user's token is expired.
    // Throws error: 'invalid token' if the user's token doesn't match any user.
    // Throws error: 'image not found' if the image was not found or does not belong to the user.
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'image' + error);
    throw new Error(error);
  }

  return mapImage(result.data);
}

export {
  registerUser,
  loginUser,
  getNotebooksWithContents,
  getNotebooks,
  getNotebook,
  getSection,
  getPage,
  patchPage,
  deleteEntity,
  postPage,
  postSection,
  postNotebook,
  getImages,
  getImage,
  postImage,
  getUsers,
};