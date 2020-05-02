import React, { Fragment, ThHTMLAttributes } from 'react';

// See https://github.com/HarryChen0506/react-markdown-editor-lite/blob/HEAD/docs/configure.md#onimageupload
// for image upload example.

// See https://www.npmjs.com/package/react-markdown-editor-lite
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // import style manually

import {
  patchPage,
} from '../../api';

import { IPage } from '../../api/types';
import NotFound from '../../routes/system-pages/NotFound';
import NoAccess from '../../routes/system-pages/NoAccess';

import { useState, useEffect } from 'react';

import { EnglishConstants, EnglishErrorMessages } from '../../MyConstClass';

import { debug } from '../../utils/debug';

// import './SideBar.scss';


interface IPageProps {
  page: IPage,
  prevPageId: number,
  // notebookId: number,
  // sectionId: number,
  // pageId: number,
  // setNotebookId: (id: number) => void,
  // setSectionId: (id: number) => void,
  // setPageId: (id: number) => void,
}

interface IPageState {
  page: IPage,
  prevPageId: number,
  saving: boolean,
  lastUpdated: Date,
  updateCount: number,
}

const mdParser = new MarkdownIt({
  html: true,
});

export default class Page extends React.Component<IPageProps, IPageState> {

  constructor(props: IPageProps) {
    super(props);
    this.state = {
      saving: false,
      updateCount: 0,
      page: this.props.page,
      prevPageId: this.props.prevPageId,
      lastUpdated: this.props.page.updated,
    };
    this.renderHTML = this.renderHTML.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }
  
  componentDidMount() {
  }

  componentDidUpdate(prevProps: IPageProps) {
    if(prevProps.page.id !== this.props.page.id) {
      // update something
    }
  }

  async () {
    // Save all changes
    // this.saveChanges(this.props.page.body);
  }

  setPage = (page: IPage) => {
    this.setState({
      page: page,
    });
  }
  setPrevPageId = (id: number) => {
    this.setState({
      prevPageId: id,
    });
  }
  setSaving = (saving: boolean) => {
    this.setState({
      saving: saving,
    });
  }
  setLastUpdated = (lastUpdated: Date) => {
    this.setState({
      lastUpdated: lastUpdated,
    });
  }
  setUpdateCount = (updateCount: number) => {
    this.setState({
      updateCount: updateCount,
    });
  }

  saveChanges(text: string) {

    const now = new Date().getTime();
    const lastUpdated = this.state.page.updated.getTime();
    const timeDiff = (now - lastUpdated);
    const timeToUpdate = (timeDiff > 5000);
    const pageChanged = (this.state.prevPageId !== this.state.page.id);

    if (!this.state.saving && timeToUpdate) {
      // IIFE to patch the changes made to the page
      (async () => {
        this.setSaving(true);
        // save the changes (TODO: Handle error and loading)
        try {
          this.state.page.body = text;
          const patchedPage = await patchPage(this.state.page);
          this.setPage(patchedPage);
        } catch (e) {
          console.error(e);
        }
        this.setSaving(false);
      })();
    }
  }

  /**
   * Renders HTML immediately as the text changes.
   * @param text 
   */
  renderHTML(text: string) {
    // Save changes
    this.saveChanges(text);
    // markdown-it
    return mdParser.render(text);
  }

  render() {

    const pageBody = this.props.page.body;

    return (
      <div>
        <div key="page-info">
          <p>Current Page: {this.props.page.id} - {this.props.page.title}</p>
        </div>

        <div>
          <button>Save Changes!</button>
          <span>Last updated: {this.state.page.updated.toTimeString()}</span>
        </div>
  
        <MdEditor 
          key="mdEditor"
          value={pageBody}
          style={{ 
            // might be able to remove this simplistic unresponsive styling 
            // by adding my own htmlClass and markdownClass
            height: '500px',
            width: '70%',
          }}
          renderHTML={this.renderHTML}
          config={{
            // (do not remove custom-html-style, instead just something like my-html-style)
            // htmlClass: 'my-html-style custom-html-style',
            // markdownClass: 'my-markdown-style',
            view: { 
              md: true,
              html: true,
            },
            canView: {
              menu: false,
            }
          }}
          
        />
      </div>
    )

  }
}
