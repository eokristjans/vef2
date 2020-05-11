/**
 * Component that provides a sidebar with the user's notebooks and their contents.
 */

import React, { Fragment } from 'react';

import EditableLabel from '../editable-label/EditableLabel';
import { INotebook } from '../../api/types';
import Button from '../button/Button';
import { 
  EnglishConstants,
  EntityTypes,
} from '../../MyConstClass';

import './SideBar.scss';

interface ISideBarProps {
  notebookId: number,
  sectionId: number,
  notebooksWithContents: INotebook[],
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
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
      <ul className="sidebar">
        {notebooksWithContents.map(notebook => (
          // Render each Notebook
          <li key={notebook.id} className="sidebar__item">
            <div className="sidebar__item__elem" onClick={() => setNotebookId(notebook.id)}>
              {notebook.title}
            </div>
            <Button
              children={EnglishConstants.DELETE_BUTTON}
              onClick={() => handleDeleteEntity(notebook.id, EntityTypes.NOTEBOOK)}
            />
            {
              (notebookId === notebook.id) && (notebook.sections !== undefined) &&
              <ul>
                {notebook.sections.map(section => (
                  // Render each Section
                  <li key={section.id} className="sidebar__item">
                    <div className="sidebar__item__elem" onClick={() => setSectionId(section.id)}>
                      {section.title}
                    </div>
                    <Button
                      children={EnglishConstants.DELETE_BUTTON}
                      onClick={() => handleDeleteEntity(section.id, EntityTypes.SECTION)}
                    />
                  {
                    (sectionId === section.id) && (section.pages !== undefined) &&
                    <ul>
                      {section.pages.map(page => (
                          // Render each Page
                          <li key={page.id} className="sidebar__item">
                            <div className="sidebar__item__elem" onClick={() => setPageId(page.id)}>
                              {page.title}
                            </div>
                            <Button
                              children={EnglishConstants.DELETE_BUTTON}
                              onClick={() => handleDeleteEntity(page.id, EntityTypes.PAGE)}
                            />
                          </li>
                        ))
                      }
                      <li className="sidebar__item sidebar__item__elem">
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
                <li className="sidebar__item sidebar__item__elem">                
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
        <li className="sidebar__item sidebar__item__elem"> 
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