/**
 * Component that displays a page as editable text with live markdown rendering. 
 */
import React from 'react';

// See https://www.npmjs.com/package/react-markdown-editor-lite
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // import style manually

import Button from '../../components/button/Button';
import { patchPage } from '../../api';
import { IPage } from '../../api/types';

import './Page.scss';


const mdParser = new MarkdownIt({
  html: true,
});

interface IPageProps {
  page: IPage,
}

interface IPageState {
  page: IPage,
  pageBody: string,
  saving: boolean,
  error: string,
}

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
        <div>
          <strong>Current Page: {this.props.page.title}</strong>
        </div>

        <div> 
          <Button className="button button--small" onClick={this.saveChangesHandler}>
            {this.state.saving ? 'Saving...' : 'Save Changes!'}
          </Button>
          <span> Last saved: {this.state.page.updated.toLocaleString()}</span>
          <span>{this.state.error}</span>
        </div>
  
        <MdEditor 
          key="mdEditor"
          value={this.props.page.body}
          style={{ 
            height: 'calc(100vh - 240px)', // The platform is not designed for small windows
            width: '100%',
          }}
          renderHTML={this.renderHTML}
          config={{
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
