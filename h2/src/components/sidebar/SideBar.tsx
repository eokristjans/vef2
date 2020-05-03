import React, { Fragment, Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  // deleteNotebook,
  // deleteSection
} from '../../api';

import { INotebook, ISection, IPage } from '../../api/types';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../../routes/system-pages/NotFound';
import NoAccess from '../../routes/system-pages/NoAccess';

import Button from '../button/Button';

import { 
  EnglishConstants,
  EnglishErrorMessages,
  EntityTypes,
} from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './SideBar.scss';

// TODO: Add `preventDefault` to onClicks?


interface ISideBarProps {
  notebookId: number,
  sectionId: number,
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
  notebooksWithContents: INotebook[],
  handleDeleteEntity: (id: number, entityType: string) => Promise<void>,
}


/**
 * Draws a sidebar that contains notebooks, with sections, with pages.
 * Each line on the sidebar has delete and rename buttons.
 * @param props 
 */
export default function SideBar(props: ISideBarProps) {

  const {
    notebookId,
    sectionId,
    setNotebookId,
    setSectionId,
    setPageId,
    notebooksWithContents,
    handleDeleteEntity,
  } = props;

  // Draw the SideBar
  return (
    <Fragment>
      {notebooksWithContents.map(notebook => (
        // Draw each Notebook
        <li key={notebook.id} className="notebooks__item">
          <a href='#' onClick={() => setNotebookId(notebook.id)}>{notebook.title}</a>
          <Button
            children={EnglishConstants.RENAME_BUTTON}
          />
          <Button
            children={EnglishConstants.DELETE_BUTTON}
            onClick={() => handleDeleteEntity(notebook.id, EntityTypes.NOTEBOOK)}
          />
          {
            (notebookId === notebook.id) && (notebook.sections !== undefined) &&
            <ul>
              {notebook.sections.map(section => (
                // Draw each Section
                <li key={section.id} className="sections__item">
                <a href='#' onClick={() => setSectionId(section.id)}>{section.title}</a>
                <Button
                  children={EnglishConstants.RENAME_BUTTON}
                />
                <Button
                  children={EnglishConstants.DELETE_BUTTON}
                  onClick={() => handleDeleteEntity(section.id, EntityTypes.SECTION)}
                />
                {
                  (sectionId === section.id) && (section.pages !== undefined) &&
                  <ul>
                    {section.pages.map(page => (
                        // Draw each Page
                        <li key={page.id} className="pages__item">
                          <a href='#' onClick={() => setPageId(page.id)}>{page.title}</a>
                          <Button
                            children={EnglishConstants.RENAME_BUTTON}
                          />
                          <Button
                            children={EnglishConstants.DELETE_BUTTON}
                            onClick={() => handleDeleteEntity(page.id, EntityTypes.PAGE)}
                          />
                        </li>
                      ))
                    }
                  </ul>
                }
                </li>
              ))}
            </ul>
          }
        </li>
      ))}
    </Fragment>
  );
}

/**
 * Just an example click handler
 * @param id 
 * @param event 
 */
function handleNotebookClick(id: number, event: React.MouseEvent) {
  debug('handleNotebookClick ' + id);
}