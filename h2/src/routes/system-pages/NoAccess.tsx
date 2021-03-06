import React from 'react';
import { Helmet } from 'react-helmet';

import './SystemPages.scss';
import { Link } from 'react-router-dom';
import { EnglishConstants } from '../../MyConstClass';

export default function NotFound() {
  return (
    <div className="system-page">
      <Helmet title="No Access"/>
      <div className="system-page__row">
        <div className="system-page__col">
          <h2 className="system-page__heading">{EnglishConstants.UNAUTHORIZED}</h2>
          <p><Link to="/">{EnglishConstants.BACK_TO_FRONTPAGE}</Link></p>
        </div>
      </div>
    </div>
  )
}
