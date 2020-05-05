import React, { Fragment, Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import EditableLabel from '../editable-label/EditableLabel';

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
  handleEditableFocus: (text: string, entityType: string, entityId: number) => void,
  handleEditableFocusOut: (text: string, entityType: string, entityId: number) => Promise<void>,
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
    handleEditableFocus,
    handleEditableFocusOut,
  } = props;

  /** Render the SideBar
   * It's one huge piece because let's face it, passing a bunch of props
   * down a long series of child components is more work, especially
   * if those components won't be reused.
   */
  return (
    <Fragment>
      <ul>
        {notebooksWithContents.map(notebook => (
          // Render each Notebook
          <li key={notebook.id} className="notebooks__item">
            <a href='#' onClick={() => setNotebookId(notebook.id)}>{notebook.title}</a>
            <Button
              children={EnglishConstants.DELETE_BUTTON}
              onClick={() => handleDeleteEntity(notebook.id, EntityTypes.NOTEBOOK)}
            />
            {
              (notebookId === notebook.id) && (notebook.sections !== undefined) &&
              <ul>
                {notebook.sections.map(section => (
                  // Render each Section
                  <li key={section.id} className="sections__item">
                  <a href='#' onClick={() => setSectionId(section.id)}>{section.title}</a>
                  <Button
                    children={EnglishConstants.DELETE_BUTTON}
                    onClick={() => handleDeleteEntity(section.id, EntityTypes.SECTION)}
                  />
                  {
                    (sectionId === section.id) && (section.pages !== undefined) &&
                    <ul>
                      {section.pages.map(page => (
                          // Render each Page
                          <li key={page.id} className="pages__item">
                            <a href='#' onClick={() => setPageId(page.id)}>{page.title}</a>
                            <Button
                              children={EnglishConstants.DELETE_BUTTON}
                              onClick={() => handleDeleteEntity(page.id, EntityTypes.PAGE)}
                            />
                          </li>
                        ))
                      }
                      <li>
                        <EditableLabel
                          text={EnglishConstants.CLICK_TO_CREATE_NEW + EntityTypes.PAGE}
                          labelClassName='myLabelClass'
                          inputClassName='myInputClass'
                          inputWidth='200px'
                          inputHeight='25px'
                          inputMaxLength={100}
                          inputFontWeight='bold'
                          onFocus={handleEditableFocus}
                          onFocusOut={handleEditableFocusOut}
                          entityType={EntityTypes.PAGE}
                          entityTypeId={section.id}
                        />
                      </li>
                    </ul>
                  }
                  </li>
                ))}
                <li>                
                  <EditableLabel
                    text={EnglishConstants.CLICK_TO_CREATE_NEW + EntityTypes.SECTION}
                    labelClassName='myLabelClass'
                    inputClassName='myInputClass'
                    inputWidth='200px'
                    inputHeight='25px'
                    inputMaxLength={100}
                    inputFontWeight='bold'
                    onFocus={handleEditableFocus}
                    onFocusOut={handleEditableFocusOut}
                    entityType={EntityTypes.SECTION}
                    entityTypeId={notebook.id}
                  />
                </li>
              </ul>
            }
          </li>
        ))}
        <li> 
          <EditableLabel
            text={EnglishConstants.CLICK_TO_CREATE_NEW + EntityTypes.NOTEBOOK}
            labelClassName='myLabelClass' 
            inputClassName='myInputClass'
            inputWidth='200px'
            inputHeight='25px'
            inputMaxLength={100}
            inputFontWeight='bold'
            onFocus={handleEditableFocus}
            onFocusOut={handleEditableFocusOut}
            entityType={EntityTypes.NOTEBOOK}
            entityTypeId={0}
          />
        </li>
      </ul>
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