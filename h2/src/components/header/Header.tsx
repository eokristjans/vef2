import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import User from '../user/User';
import { EnglishConstants } from '../../MyConstClass';

import './Header.scss';

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
            {/* <div className="header__cart">
              <NavLink activeClassName="header__link--selected" exact to="/cart">Karfa</NavLink>
            </div> */}
          </div>

          {/* <div className="header__bottom">
            <nav className="header__nav">
              <ul className="header__list">
                <li className="header__item">
                  <NavLink activeClassName="header__link--selected" exact to="/">Nýjar vörur</NavLink>
                </li>
                <li className="header__item">
                  <NavLink activeClassName="header__link--selected" to="/categories">Flokkar</NavLink>
                </li>
              </ul>
            </nav>
          </div> */}

        </div>
      </div>
    </header>
  );
}
