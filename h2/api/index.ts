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
