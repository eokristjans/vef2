/**
 * Contains header links for the user, based on whether or not he's authenticated.
 */

import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import { Context } from '../../UserContext';
import { EnglishConstants } from '../../MyConstClass';

import './User.scss';

export default function User() {
  const onClick = (logoutUser: any) => (e: any) => {
    e.preventDefault();
    logoutUser();
  }

  return (
    <Context.Consumer>
      {({ user, authenticated, logoutUser }) => {


        if (!authenticated) {
          return (
            <Fragment>
              <NavLink activeClassName="user__link--selected" className="user__link" to="/register">
                {EnglishConstants.SIGN_UP}
              </NavLink>
              <NavLink activeClassName="user__link--selected" className="user__link" to="/login">
              {EnglishConstants.LOGIN}
              </NavLink>
            </Fragment>
          )
        }

        return (
          <p className="user__info">
            <NavLink
              activeClassName="user__link--selected"
              className="user__link" to="/logout"
              onClick={onClick(logoutUser)}
            >
              {user.user.username} {EnglishConstants.LOGOUT}
            </NavLink>
            {/* <NavLink activeClassName="user__link--selected" className="user__link" to="/orders">
              Pantanir
            </NavLink> */}
          </p>
        );
      }}
    </Context.Consumer>
  );
}
