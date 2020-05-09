/**
 * Defines and exports functions that map JSON objects to corresponding interfaces (types).
 */

import { IPage, ISection, INotebook, IImage, IUser } from './types';


export function mapPage(item: any): IPage {
  const page: IPage = {
    id: item.id,
    userId: item.userId,
    notebookId: item.notebookId,
    sectionId: item.sectionId,
    title: item.title,
    body: item.body,
    created: new Date(item.created),
    updated: new Date(item.updated),
  }
  return page;
}

export function mapSection(item: any): ISection {
  const section: ISection = {
    id: item.id,
    userId: item.userId,
    notebookId: item.notebookId,
    title: item.title,
    created: new Date(item.created),
    updated: new Date(item.updated),
    pages: (item.pages || []).map(mapPage)
  }
  return section;
}

export function mapNotebook(item: any): INotebook {
  const notebook: INotebook = {
    id: item.id,
    userId: item.userId,
    title: item.title,
    created: new Date(item.created),
    updated: new Date(item.updated),
    sections: (item.sections || []).map(mapSection)
  }
  return notebook;
}

export function mapImage(item: any): IImage {
  const image: IImage = {
    id: item.id,
    userId: item.userId,
    title: item.title,
    url: item.url,
    created: new Date(item.created),
  }
  return image;
}

export function mapUser(item: any): IUser {
  const user: IUser = {
    id: item.id,
    username: item.username,
    email: item.email,
    admin: item.admin,
    created: new Date(item.created),
    updated: new Date(item.updated),
  }
  return user;
}

