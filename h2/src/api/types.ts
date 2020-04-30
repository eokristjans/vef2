/**
 * Defines and exports interfaces that represent database table entries from the server.
 */

export interface IApiResult {
  data: any;
  ok: boolean;
  status: number;
}

export interface IHeaders {
  method: string;
  headers?: any;
  body?: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  admin: boolean;
  created?: Date;
  updated?: Date;
}

export interface IPage {
  id: number;
  userId: number;
  notebookId: number;
  sectionId: number;
  title: string;
  body: string;
  created?: Date;
  updated?: Date;
}

export interface ISection {
  id: number;
  userId: number;
  notebookId: number;
  title: string;
  created?: Date;
  updated?: Date;
  pages?: IPage[];
}

export interface INotebook {
  id: number;
  userId: number;
  title: string;
  created?: Date;
  updated?: Date;
  sections?: ISection[];
}

export interface IImage {
  id: number;
  userId: number;
  title: string;
  url: string;
  created?: Date;
}
