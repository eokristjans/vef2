import React, { Fragment, Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  // deleteNotebook,
  // deleteSection
  deletePage, getNotebooksWithContents,
} from '../../api';

import { INotebook, ISection, IPage } from '../../api/types';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../../routes/system-pages/NotFound';
import NoAccess from '../../routes/system-pages/NoAccess';

import Button from '../button/Button';

import { EnglishConstants, EnglishErrorMessages } from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './SideBar.scss';

// TODO: Add `preventDefault` to onClicks?

interface ISideBarButtonsProps {
  notebookId: number,
  sectionId: number,
  pageId: number,
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
  notebooksWithContents: INotebook[],
  setNotebooksWithContents: (notebooks: INotebook[])=> void,
  notebook?: INotebook,
  section?: ISection,
  page?: IPage,
}

interface ISideBarButtonsState {
  loading: boolean,
  success: boolean,
  error?: any,
  // notebookId: number,
  // sectionId: number,
  // pageId: number,
  notebook?: INotebook,
  section?: ISection,
  page?: IPage,
}

const initialState: ISideBarButtonsState = {
  loading: false,
  success: true,
  // notebookId: 0,
  // sectionId: 0,
  // pageId: 0,
}

class SideBarButtons extends Component<ISideBarButtonsProps, ISideBarButtonsState> {

  constructor(props: ISideBarButtonsProps) {
    super(props);
    this.state = initialState;
    // this.setState({
    //   notebookId: this.props.notebookId,
    //   sectionId: this.props.sectionId,
    //   pageId: this.props.pageId,
    // });
    this.deleteEntity = this.deleteEntity.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.setSuccess = this.setSuccess.bind(this);
    this.setError = this.setError.bind(this);
  }

  /**
   * Deletes an entity
   * @param {number} id of the entity being deleted.
   * @param {number} entityType Type of entity that is being deleted.
   * 1 for notebook, 2 for section, 3 for page, 4 for image
   */
  async deleteEntity(id: number) {
    
    let result;
    let entityName = '';

    const { 
      notebooksWithContents,
      setNotebooksWithContents,
      page,
      section,
      notebook, 
    } = this.props;

    let entityType;
    if (page !== undefined) entityType = 3;
    else if (section !== undefined) entityType = 2;
    else if (notebook !== undefined) entityType = 1;

    this.setState({loading: true});
    switch (entityType) {
      case 1:
        entityName = 'notebook';
        break;
      case 2:
        entityName = 'section';
        break;
      case 3:
        entityName = 'page';
        try {
          result = await deletePage(id);

          if (!result.ok) {
            this.setError(result.data.errors);
          } else {
            if (page !== undefined) {
              debug(notebooksWithContents ? 'notebooks defined' : 'notebooks undefined');
              debug(notebooksWithContents[page.notebookId] ? `notebooks(${page.notebookId}) defined` : `notebooks(${page.notebookId}) undefined`);
              // Find the index of the deleted page in the notebooksWithContents array
              const pageIndex = notebooksWithContents[page.notebookId].sections[page.sectionId].pages.map(function(p) {
                  return p.id;
                }).indexOf(id);
              // Remove the deleted page from the notebooksWithContents array
              notebooksWithContents[page.notebookId].sections[page.sectionId].pages = 
                notebooksWithContents[page.notebookId].sections[page.sectionId].pages.splice(pageIndex, 1);
              // Update state of notebooksWithContents
              setNotebooksWithContents(
                notebooksWithContents,
              );

            }

            this.setError(null);
            this.setSuccess(true);
          }
   
        } catch (e) {
          console.error(e);
        }
        break;
      case 4:
        entityName = 'image';
        break;
      default:
        // Should not happen. TODO: Deal with?
        break;
    }
    this.setState({loading: false});

  }
  
  setLoading = (loading: boolean) => {
    this.setState({
      loading: loading,
    });
  }
  setSuccess = (success: boolean) => {
    this.setState({
      success: success,
    });
  }
  setError = (error: any) => {
    this.setState({
      error: error,
    });
  }
     
  render() {

    let entityId = 0;
    if (this.props.page !== undefined) entityId = this.props.page.id;
    else if (this.props.section !== undefined) entityId = this.props.section.id;
    else if (this.props.notebook !== undefined) entityId = this.props.notebook.id;

//    const {
//      notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId, page, notebooksWithContents
//    } = this.props;

    // Draw the buttons
    return (
      <Fragment>
        <Button
          children={EnglishConstants.RENAME_BUTTON}
        />
        <Button
          children={EnglishConstants.DELETE_BUTTON}
          onClick={() => this.deleteEntity(entityId)}
        />
        {this.state.error &&
          <p>{this.state.error}</p>
        }
      </Fragment>
    )

  }
}

interface ISideBarProps {
  notebookId: number,
  sectionId: number,
  pageId: number,
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
  notebooksWithContents: INotebook[],
  setNotebooksWithContents: (notebooks: INotebook[])=> void,
  notebook?: INotebook,
  section?: ISection,
  page?: IPage,
}


function Page(props: ISideBarProps) {
  const {
    notebookId,
    sectionId,
    pageId,
    setNotebookId,
    setSectionId,
    setPageId,
    page,
    notebooksWithContents,
    setNotebooksWithContents
  } = props;
     
  // Draw the Page
  return (
    <Fragment>
      {page && 
        <li key={page.id} className="pages__item">
          <a href='#' onClick={() => setPageId(page.id)}>{page.title}</a>
          <SideBarButtons
            notebookId={page.notebookId}
            sectionId={page.sectionId}
            pageId={page.id}
            setNotebookId={setNotebookId}
            setSectionId={setSectionId}
            setPageId={setPageId}
            page={page}
            notebooksWithContents={notebooksWithContents}
            setNotebooksWithContents={setNotebooksWithContents}
          />
        </li>
      }
    </Fragment>
  )
}

function Section(props: ISideBarProps) {
  const {
    notebookId,
    sectionId,
    pageId,
    setNotebookId,
    setSectionId,
    setPageId,
    section,
    notebooksWithContents,
    setNotebooksWithContents,
  } = props;
     
  // Draw the Section
  return (
    <Fragment>
      {section && 
      <li key={section.id} className="sections__item">
      <a href='#' onClick={() => setSectionId(section.id)}>{section.title}</a>
      <Button
        children={EnglishConstants.RENAME_BUTTON}
      />
      <Button
        children={EnglishConstants.DELETE_BUTTON}
      />
      {
        (sectionId === section.id) && (section.pages !== undefined) &&
        <ul>
          {
            section.pages.map(page => (
              <Page
                notebookId={notebookId}
                sectionId={sectionId}
                pageId={pageId}
                setNotebookId={setNotebookId}
                setSectionId={setSectionId}
                setPageId={setPageId}
                page={page}
                notebooksWithContents={notebooksWithContents}
                setNotebooksWithContents={setNotebooksWithContents}
              />
            ))
          }
        </ul>
      }
      </li>
    }
    </Fragment>
  )
}

function Notebook(props: ISideBarProps) {
  const {
    notebookId,
    sectionId,
    pageId,
    setNotebookId,
    setSectionId,
    setPageId,
    notebook,
    notebooksWithContents,
    setNotebooksWithContents
  } = props;

  // Draw the Notebook
  return (
    <Fragment>
      {notebook &&
      <li key={notebook.id} className="notebooks__item">
        <a href='#' onClick={() => setNotebookId(notebook.id)}>{notebook.title}</a>
        <Button
          children={EnglishConstants.RENAME_BUTTON}
        />
        <Button
          children={EnglishConstants.DELETE_BUTTON}
        />
        {
          (notebookId === notebook.id) && (notebook.sections !== undefined) &&
          <ul>
            {notebook.sections.map(section => (
              <Section
                notebookId={notebookId}
                sectionId={sectionId}
                pageId={pageId}
                setNotebookId={setNotebookId}
                setSectionId={setSectionId}
                setPageId={setPageId}
                section={section}
                notebooksWithContents={notebooksWithContents}
                setNotebooksWithContents={setNotebooksWithContents}
              />
            ))}
          </ul>
        }
      </li>
      }
    </Fragment>
  )
}

export default function SideBar(props: ISideBarProps) {
  const {
    notebookId,
    sectionId,
    pageId,
    setNotebookId,
    setSectionId,
    setPageId,
    notebooksWithContents,
    setNotebooksWithContents,
  } = props;

  // Draw the SideBar
  return (
    <Fragment>
      {notebooksWithContents && notebooksWithContents.map(notebook => (
        <Notebook
          notebookId={notebookId}
          sectionId={sectionId}
          pageId={pageId}
          setNotebookId={setNotebookId}
          setSectionId={setSectionId}
          setPageId={setPageId}
          notebook={notebook}
          notebooksWithContents={notebooksWithContents}
          setNotebooksWithContents={setNotebooksWithContents}
        />
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