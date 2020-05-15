/**
 * Component that provides a sidebar with the user's notebooks and their contents.
 */

import React, { Fragment } from 'react';

import EditableLabel from '../editable-label/EditableLabel';
import { INotebook } from '../../api/types';
import { 
  EnglishConstants,
  EntityTypes,
} from '../../MyConstClass';

import './SideBar.scss';

interface ISideBarProps {
  notebookId: number,
  sectionId: number,
  pageId: number,
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
    pageId,
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
          <div>
            <li key={notebook.id} className={(notebookId === notebook.id) ? "sidebar__selected sidebar__item sidebar__notebook" : "sidebar__item sidebar__notebook"}>
              <div className="sidebar__item__title" onClick={() => setNotebookId(notebook.id)}>{notebook.title}</div>
              <span 
                title={EnglishConstants.DELETE_HOVER + EntityTypes.NOTEBOOK} 
                className="sidebar__delete"
                onClick={() => { if (window.confirm(EnglishConstants.DELETE_CONFIRM + EntityTypes.NOTEBOOK + '?')) handleDeleteEntity(notebook.id, EntityTypes.NOTEBOOK) } }
                role="img" aria-label="Delete-Cross">❌</span>
            </li>
            {(notebookId === notebook.id) && (notebook.sections !== undefined) && notebook.sections.map(section => (
              <div>
                <li key={section.id} className={(sectionId === section.id) ? "sidebar__selected sidebar__item sidebar__section" : "sidebar__item sidebar__section"}>
                  <div className="sidebar__item__title" onClick={() => setSectionId(section.id)}>{section.title}</div>
                  <span 
                    title={EnglishConstants.DELETE_HOVER + EntityTypes.SECTION} 
                    className="sidebar__delete"
                    onClick={() => { if (window.confirm(EnglishConstants.DELETE_CONFIRM + EntityTypes.SECTION + '?')) handleDeleteEntity(section.id, EntityTypes.SECTION) } }
                    role="img" aria-label="Delete-Cross">❌</span>
                </li>
                {(sectionId === section.id) && (section.pages !== undefined) && section.pages.map(page => (
                  <li key={page.id} className={(pageId === page.id) ? "sidebar__selected sidebar__item sidebar__page" : "sidebar__item sidebar__page"}>
                    <div className="sidebar__item__title" onClick={() => setPageId(page.id)}>{page.title}</div>
                    <span 
                      title={EnglishConstants.DELETE_HOVER + EntityTypes.PAGE} 
                      className="sidebar__delete" 
                      onClick={() => { if (window.confirm(EnglishConstants.DELETE_CONFIRM + EntityTypes.PAGE + '?')) handleDeleteEntity(page.id, EntityTypes.PAGE) } }
                      role="img" aria-label="Delete-Cross">❌</span>
                  </li>
                ))}
                {(sectionId === section.id) && (section.pages !== undefined) &&
                <li className="sidebar__create sidebar__page sidebar__item">
                  <EditableLabel
                    text={EnglishConstants.CLICK_TO_CREATE_NEW + EntityTypes.PAGE}
                    labelClassName='sidebar__create'
                    inputClassName='myInputClass'
                    inputWidth='200px'
                    inputHeight='25px'
                    inputMaxLength={100}
                    inputFontWeight='bold'
                    onFocus={handleEditableFocus}
                    onFocusOut={handleEditableFocusOut}
                    entityType={EntityTypes.PAGE}
                    entityTypeId={section.id}
                  /><span className="sidebar__checkmark" role="img" aria-label="Create-Checkmark">✅</span>
                </li>}
              </div>
            ))}
            {(notebookId === notebook.id) && (notebook.sections !== undefined) &&
            <li className="sidebar__create sidebar__section sidebar__item">
              <EditableLabel
                text={EnglishConstants.CLICK_TO_CREATE_NEW + EntityTypes.SECTION}
                labelClassName='sidebar__create'
                inputClassName='myInputClass'
                inputWidth='200px'
                inputHeight='25px'
                inputMaxLength={100}
                inputFontWeight='bold'
                onFocus={handleEditableFocus}
                onFocusOut={handleEditableFocusOut}
                entityType={EntityTypes.SECTION}
                entityTypeId={notebookId}
              /><span className="sidebar__checkmark" role="img" aria-label="Create-Checkmark">✅</span>
            </li>}
          </div>
        ))}
        <li className="sidebar__create sidebar__notebook sidebar__item">
          <EditableLabel
            text={EnglishConstants.CLICK_TO_CREATE_NEW + EntityTypes.NOTEBOOK}
            labelClassName='sidebar__create' 
            inputClassName='myInputClass'
            inputWidth='200px'
            inputHeight='25px'
            inputMaxLength={100}
            inputFontWeight='bold'
            onFocus={handleEditableFocus}
            onFocusOut={handleEditableFocusOut}
            entityType={EntityTypes.NOTEBOOK}
            entityTypeId={0}
          /><span className="sidebar__checkmark" role="img" aria-label="Create-Checkmark">✅</span>
        </li>
      </ul>
              
    </Fragment>
  );
}
