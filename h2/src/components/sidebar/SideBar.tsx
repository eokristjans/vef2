import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';

import {
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

function Section(props: ISideBarProps) {
  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = props;
  
  const {items: section, loading, error} = useApi<ISection|null>(getSection.bind(null, sectionId), null);

  if (error && error === 'invalid token') {
    return (<NoAccess />);
  }

  // TODO ekki gott að matcha á streng
  if (error && error === 'Section not found') {
    return (<NotFound />);
  }
  
  if (loading) {
    return ( <p></p> );
  }
  
  debug('section: ' + section)
  
  if (error || !section) {
    return (
      <p>{EnglishErrorMessages.FETCHING_ERROR} section: {error}</p>
    );
  }

  debug(section.pages ? 'yes pages' : 'no pages')

  
  debug('Section() pageId: ' + pageId)

  return (
    <Fragment>
    {!loading && !error && 
      <span key={section.id} className="sections__item" >
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

interface INotebookProps {
  id: number,
}

function Notebook(props: ISideBarProps) {
  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = props;
    
  const {items: notebook, loading, error} = useApi<INotebook|null>(getNotebook.bind(null, notebookId), null);

  if (error && error === 'invalid token') {
    return (<NoAccess />);
  }

  // TODO ekki gott að matcha á streng
  if (error && error === 'Notebook not found') {
    return (<NotFound />);
  }
  
  if (loading) {
    return (
      <span>
        {/* Fetching notebook... */}
      </span>
    );
  }
    
  if (error || !notebook) {
    return (
      <span>{EnglishErrorMessages.FETCHING_ERROR} notebook: {error}</span>
    );
  }

  // Draw the Notebook
  return (
    <Fragment>
      {!loading && !error && 
        <span key={notebook.id} className="notebooks__item" >
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

export default function SideBar(props: ISideBarProps) {

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = props;

  const {items: notebooks, loading, error} = useApi<INotebook[]>(getNotebooks.bind(null), []);
    
  if (error && error === 'invalid token') {
    return (<NoAccess />);
  }

  // TODO ekki gott að matcha á streng
  if (error && error === 'Notebook not found') {
    return (<NotFound />);
  }
  
  if (loading) {
    return (
      <span>Fetching notebooks...</span>
    );
  }
  
  if (error || !notebooks) {
    return (
      <span>{EnglishErrorMessages.FETCHING_ERROR} notebooks: {error}</span>
    );
  }

  return (
    <Fragment>
      {!loading && !error && notebooks.map(notebook => (
        <li key={notebook.id} className="notebooks__item">
            {(notebookId === notebook.id) &&
              <Notebook
                notebookId={notebookId}
                sectionId={sectionId}
                pageId={pageId}
                setNotebookId={setNotebookId}
                setSectionId={setSectionId}
                setPageId={setPageId}
              />
              || <a href='#' onClick={() => setNotebookId(notebook.id)}>{notebook.title}</a>
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