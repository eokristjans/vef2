import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  getNotebooksWithContents,
  getNotebooks,
  getNotebook,
  getSection,
  getPage,
} from '../../api';
import { INotebook, ISection, IPage } from '../../api/types';
import useApi from '../../hooks/useApi';
import useSideBar from '../../hooks/useSideBar';
import NotFound from '../../routes/system-pages/NotFound';
import NoAccess from '../../routes/system-pages/NoAccess';

import { EnglishConstants, EnglishErrorMessages } from '../../MyConstClass';

import { debug } from '../../utils/debug';

import './SideBar.scss';

// TODO: Add `preventDefault` to onClicks?


interface ISectionProps {
  id: number,
}

function Section(props: ISideBarSubProps) {
  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId, notebooksWithContents,
  } = props;
  
  let section;
  const notebook = notebooksWithContents[notebookId];
  if (notebook.sections) {
    section = notebook.sections[0];

    debug(section.pages ? 'yes pages' : 'no pages')
      
    return (
      <Fragment>
      {<span key={section.id} className="sections__item" >
          <span>{section.title}</span>
          <ul>
            {section.pages && section.pages.map(page => (
              (pageId === page.id) && 
                // Draw the entire page if it matches the pageId
                <li key={page.id}>
                  {/* <Page id={page.id}/> */}
                  {page.title}
                </li> || 
                <li key={page.id}><a href='#' onClick={() => setPageId(page.id)}>{page.title}</a></li>
            ))}
          </ul>
        </span>
      }
      </Fragment>
    )
  }

  return (
    <Fragment>
    </Fragment>
  )
}

interface INotebookProps {
  id: number,
}

function Notebook(props: ISideBarSubProps) {
  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId, notebooksWithContents,
  } = props;

  const notebook = notebooksWithContents[notebookId];

  // Draw the Notebook
  return (
    <Fragment>
      {<span key={notebook.id} className="notebooks__item" >
          <a>{notebook.title}</a>
          <ul>
            {notebook.sections && notebook.sections.map(section => (
              (sectionId === section.id) && 
                // Draw the entire section if it matches the sectionId
                <li key={section.id}>
                  <Section
                    notebookId={notebookId}
                    sectionId={sectionId}
                    pageId={pageId}
                    setNotebookId={setNotebookId}
                    setSectionId={setSectionId}
                    setPageId={setPageId}
                    notebooksWithContents={notebooksWithContents}
                  />
                  </li> || 
                <li key={section.id}><a href='#' onClick={() => setSectionId(section.id)}>{section.title}</a></li>
            ))}
          </ul>
        </span>
      }
    </Fragment>
  )
}

interface ISideBarProps {
  notebookId: number,
  sectionId: number,
  pageId: number,
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
}

interface ISideBarSubProps {
  notebookId: number,
  sectionId: number,
  pageId: number,
  setNotebookId: (id: number) => void,
  setSectionId: (id: number) => void,
  setPageId: (id: number) => void,
  notebooksWithContents: INotebook[],
}

export default function SideBar(props: ISideBarSubProps) {

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId, notebooksWithContents,
  } = props;

  if (notebooksWithContents[0]){
    debug('notebook 0 has sections? ' + (notebooksWithContents[0].sections ? 'yep' : 'nope'));
    if (notebooksWithContents[0].sections) {
      debug('section 0 has pages? ' + (notebooksWithContents[0].sections[0].pages ? 'yep' : 'nope'));
    }
  }

  const [mySectionId, setMySectionId] = useState(sectionId);
  const [myNotebookId, setMyNotebookId] = useState(notebookId);


  return (
    <Fragment>
      {notebooksWithContents.map(notebook => (
        <li key={notebook.id} className="notebooks__item">
          <a href='#' onClick={() => setMyNotebookId(notebook.id)}>{notebook.title}</a>
          {
            (myNotebookId === notebook.id) && (notebook.sections !== undefined) &&
            <ul>
              {notebook.sections.map(section => (
                <li key={section.id} className="sections__item">
                  <a href='#' onClick={() => setMySectionId(section.id)}>{section.title}</a>
                  {
                    (mySectionId === section.id) && (section.pages !== undefined) &&
                    <ul>
                      {
                        section.pages.map(page => (
                          <li key={page.id} className="pages__item">
                            <a href='#' onClick={() => setPageId(page.id)}>{page.title}</a>
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