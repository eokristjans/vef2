import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import User from './User';
import { EnglishConstants } from '../../MyConstClass';

import './Header.scss';

/** Defines a reusable Header component. */
export default function Home() {
  // TODO: If user is admin, link to list of all users.
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">
          <Link className="header__titleLink" to="/">{EnglishConstants.WEB_PAGE_TITLE}</Link>
        </h1>

        <div className="header__meta">
          <div className="header__top">
            <div className="header__user">
              <User />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
