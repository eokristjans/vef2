import { IApiResult, IHeaders } from './types';
import { IPage, ISection, INotebook, IImage } from './types';
import { mapPage, mapSection, mapNotebook, mapImage } from './mapping';

import { EnglishErrorMessages, ConsoleErrorMessages } from '../MyConstClass';

import { debug } from '../utils/debug';

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

  const json = method.toLowerCase() !== 'delete' ? await response.json() : null;

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
async function registerUser(username: string, password: string, email: string): Promise<IApiResult> {
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


async function getNotebooksWithContents(): Promise<INotebook[]> {
  let result: IApiResult;

  debug('src api index.ts getNotebooks()');

  try {
    result = await get('/notebooks-with-contents');
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebooks-with-contents', e);
    throw new Error(
      EnglishErrorMessages.FETCHING_ERROR + 'notebooks with contents'
    );
  }

  if (result && !result.ok) {
    const { data: {
      error = EnglishErrorMessages.FETCHING_ERROR + 'notebooks with contents',
    }
    } = result;
    throw new Error(error);
  }

  return result.data.results.map(mapNotebook);
}


async function getNotebooks(): Promise<INotebook[]> {
  let result: IApiResult;

  debug('src api index.ts getNotebooks()');

  try {
    result = await get('/notebooks');
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebooks', e);
    throw new Error(
      EnglishErrorMessages.FETCHING_ERROR + 'notebooks'
    );
  }

  if (result && !result.ok) {
    const { data: {
      error = EnglishErrorMessages.FETCHING_ERROR + 'notebooks',
    }
    } = result;
    throw new Error(error);
  }

  return result.data.results.map(mapNotebook);
}


async function getNotebook(id: number | string): Promise<INotebook> {
  let result: IApiResult;

  debug(`src api index.ts getNotebook(${id})`);

  try {
    result = await get(`/notebooks/${id}`);
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'notebook', e);
    throw new Error(
      EnglishErrorMessages.FETCHING_ERROR + 'notebook'
    );
  }

  if (result && !result.ok) {
    const { data: {
      error = EnglishErrorMessages.FETCHING_ERROR + 'notebook',
    }
    } = result;
    throw new Error(error);
  }

  return mapNotebook(result.data);
}

async function getSection(id: number | string): Promise<ISection> {
  let result: IApiResult;

  debug(`src api index.ts getSection(${id})`);

  try {
    result = await get(`/sections/${id}`);
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'section', e);
    throw new Error(
      EnglishErrorMessages.FETCHING_ERROR + 'section'
    );
  }

  if (result && !result.ok) {
    const { data: {
      error = EnglishErrorMessages.FETCHING_ERROR + 'section',
    }
    } = result;
    throw new Error(error);
  }

  return mapSection(result.data);
}


async function getPage(id: number | string): Promise<IPage> {
  let result: IApiResult;

  console.warn(`getPage(${id})`);

  try {
    result = await get(`/pages/${id}`);
  } catch (e) {
    console.error(ConsoleErrorMessages.ERROR_FETCHING + 'page', e);
    throw new Error(
      EnglishErrorMessages.FETCHING_ERROR + 'page'
    );
  }

  if (result && !result.ok) {
    const { data: {
      error = EnglishErrorMessages.FETCHING_ERROR + 'page',
    }
    } = result;
    throw new Error(error);
  }

  return mapPage(result.data);
}


async function patchPage(page: IPage): Promise<IPage> {
  let result: IApiResult;

  console.warn(`before patchPage(${page.updated})`);

  try {
    result = await patch(`/pages/${page.id}`, page);
  } catch (e) {
    console.error(ConsoleErrorMessages.PATCH_ERROR + 'page', e);
    throw new Error(
      EnglishErrorMessages.PATCH_ERROR + 'page'
    );
  }

  if (result && !result.ok) {
    const { data: {
      error = EnglishErrorMessages.PATCH_ERROR + 'page',
    }
    } = result;
    throw new Error(error);
  }

  const patchedPage = mapPage(result.data);

  console.warn(`after patchPage(${patchedPage.updated})`);

  return patchedPage;
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
};