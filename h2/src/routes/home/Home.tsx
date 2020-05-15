/**
 * / route.
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import './Home.scss';

export default function Home() {

  return (
    <Fragment>
      <Helmet title="Home" />

      <div className="home">
        <h2>Welcome to noteworthyMD</h2>
        <h4>A platform designed to keep all of your notes in one place, available anywhere.</h4>
        <div>
          <p>
            Sign up and Log in from the navigation to get started.
          </p>
          <p>
            Create your own notebooks and organize them into sections with pages that you can write your notes into.
          </p>
          <p>
            You can then save your changes and access them any time for any computer.
          </p>
          <br/>
          <p>
            The niche... all of your notes can be written in Markdown with live rendering.
          </p>
          <p>
            Markdown is a lightweight markup language with plain-text-formatting syntax. Markdown is often used to format <br/>
            readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.
          </p>
          <p>
            <strong>noteworthyMD</strong> was actually designed to help you learn Markdown. It's easy and fun. Sign up and try it yourself!
          </p>
          <p>
            When you sign up you will start with a page that contains the contents of a <a rel="noopener noreferrer" target="_blank" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
             <i> Markdown Cheatsheet </i></a> to help you get started.
          </p>
          <br/>
          <p>
            You can also take images and upload them to store them online on the platform. <br/>
            You can then browse your images and copy a Url to embed it into your page. <br/>
            Of course, you don't have to store your images on the platform. Copy any image Url to embed it into your page.
          </p>
        </div>
      </div>
    </Fragment>
  );
}