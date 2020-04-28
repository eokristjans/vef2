/**
 * Defines and exports interfaces that represent database table entries from the server.
 */

export interface IApiResult {
  data: any;
  ok: boolean;
  status: number;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
}

export interface IHeaders {
  method: string;
  headers?: any;
  body?: string;
}