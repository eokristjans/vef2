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


interface IPageProps {
  id: number,
}

function Page(props: IPageProps) {

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = useSideBar();
  
  const {items: page, loading, error} = useApi<IPage|null>(getPage.bind(null, props.id), null);

  if (error && error === 'invalid token') {
    return (<NoAccess />);
  }

  // TODO ekki gott að matcha á streng
  if (error && error === 'Page not found') {
    return (<NotFound />);
  }
  
  if (loading) {
    return ( <span></span> );
  }
  
  debug('page: ' + page)
  
  if (error || !page) {
    return (
      <span>{EnglishErrorMessages.FETCHING_ERROR} page: {error}</span>
    );
  }

  return (
    <Fragment>
      {/* {page.body} */}
    </Fragment>
  )
}


interface ISectionProps {
  id: number,
}

function Section(props: ISectionProps) {
  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = useSideBar();
  
  const {items: section, loading, error} = useApi<ISection|null>(getSection.bind(null, props.id), null);

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

  return (
    <Fragment>
    {!loading && !error && 
      <span key={section.id} className="sections__item" >
        <span>{section.title}</span>
        <ul>
          {section.pages && section.pages.map(page => (
            (pageId === page.id) && 
              // Draw the entire page if it matches the pageId
              <li key={page.id}><Page id={page.id}/><a href='#' onClick={() => setPageId(page.id)}>{page.title}</a></li> || 
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

function Notebook(props: INotebookProps) {
  
  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = useSideBar();
    
  const {items: notebook, loading, error} = useApi<INotebook|null>(getNotebook.bind(null, props.id), null);

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
                <li key={section.id}><Section id={section.id}/></li> || 
                <li key={section.id}><a href='#' onClick={() => setSectionId(section.id)}>{section.title}</a></li>
            ))}
          </ul>
        </span>
      }
    </Fragment>
  )
}

export default function SideBar() {

  const {
    notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId
  } = useSideBar();

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
              <Notebook id={notebook.id}/>
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