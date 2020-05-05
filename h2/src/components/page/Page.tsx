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
}

interface IPageState {
  page: IPage,
  pageBody: string,
  saving: boolean,
  error: string,
}

const mdParser = new MarkdownIt({
  html: true,
});

export default class Page extends React.Component<IPageProps, IPageState> {

  constructor(props: IPageProps) {
    super(props);
    this.state = {
      saving: false,
      page: this.props.page,
      pageBody: this.props.page.body,
      error: '',
    };
    this.renderHTML = this.renderHTML.bind(this);
    this.saveChangesHandler = this.saveChangesHandler.bind(this);
  }

  setPage = (page: IPage) => {
    this.setState({
      page: page,
    });
  }
  setPageBody = (pageBody: string) => {
    this.setState({
      pageBody: pageBody,
    });
  }
  setSaving = (saving: boolean) => {
    this.setState({
      saving: saving,
    });
  }
  setError = (error: string) => {
    this.setState({
      error: error + '',
    });
  }

  /**
   * Saves the page with the most recently rendered body.
   */
  async saveChangesHandler() {
    // TODO: Consider autosave with throttle
    // https://reactjs.org/docs/faq-functions.html#throttle
    if (!this.state.saving) {
      // Can only save if not already saving
      this.setSaving(true);

      // Clear error if it wasn't empty
      if (this.state.error !== '') {
        this.setError(''); 
      }
      try {
        // Patch the page and set state
        this.state.page.body = this.state.pageBody;
        const patchedPage = await patchPage(this.state.page);
        this.setPage(patchedPage);
      } catch (e) {
        // TODO: NoAccess or NotFound?
        this.setError(e);
      }
      // Finished saving
      this.setSaving(false);
    }
  }

  /**
   * Renders HTML immediately as the text changes.
   * @param text 
   */
  renderHTML(text: string) {
    // Store changes in state
    this.setPageBody(text);
    // markdown-it
    return mdParser.render(text);
  }

  render() {

    return (
      <div>
        <div key="page-info">
          {/* TODO : Remove and make it obvious on the sidebar and maybe tab title */}
          <p>Current Page: {this.props.page.id} - {this.props.page.title}</p>
        </div>

        <div> 
          <button onClick={this.saveChangesHandler}>
            {this.state.saving && 'Saving...' || 'Save Changes!'}
          </button>
          <span> Last saved: {this.state.page.updated.toLocaleString()}</span>
          {/*  TODO: Display better error messages, like in MyNotebooks.tsx */}
          <span>{this.state.error}</span>
        </div>
  
        <MdEditor 
          key="mdEditor"
          value={this.props.page.body}
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
