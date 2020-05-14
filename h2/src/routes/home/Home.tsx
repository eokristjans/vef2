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

      <div className="container">
        <h2><i>Welcome to</i> # noteworthyMD</h2>
        <div>
          <p>TODO: About this page...</p>
        </div>
      </div>
    </Fragment>
  );
}