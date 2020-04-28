import { IApiResult, IHeaders } from './types';
// import { mapCart, mapOrder, mapCategory, mapProduct } from './mapping';

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


async function registerUser(username: string, password: string, email: string): Promise<IApiResult> {
  let result: IApiResult;

  try {
    result = await post('/users/register', { username, password, email });
  } catch (e) {
    throw new Error('Gat ekki skráð notanda');
  }

  return result;
}


async function loginUser(username: string, password: string): Promise<any> {
  let result: IApiResult;

  try {
    result = await post('/users/login', { username, password });
  } catch (e) {
    throw new Error('Gat ekki skráð notanda inn');
  }

  return result;
}


export {
  registerUser,
  loginUser,
};