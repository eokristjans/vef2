/**
 * / route.
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import './Home.scss';

export default function Home() {

  return (
    <Fragment>
      <Helmet title="Home" />

      <div>
        <p>TODO: About this page...</p>
      </div>

    </Fragment>
  );
}