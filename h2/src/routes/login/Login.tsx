/**
 * Route to /login
 */
import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { Context } from '../../UserContext';
import { EnglishConstants } from '../../MyConstClass';

import './Login.scss';

interface ILoginProps {
  sessionExpired?: boolean,
}

export default function Login(props: ILoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const onSubmit = (loginUser: any) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginUser(username, password);
  }

  function onUsernameChange(e: any): void {
    const { target: { value = '' } = {} } = e;
    setUsername(value);
  }

  function onPasswordChange(e: any): void {
    const { target: { value = '' } = {} } = e;
    setPassword(value);
  }

  const hasError = (f: string) => Boolean(error && error.find((i: any) => i.field === f));

  const usernameInvalid = hasError('username');
  const passwordInvalid = hasError('password');

  return (
    <Fragment>
      <Helmet title="Login"/>

      {props.sessionExpired && (
        <p>Your login session has expired. Please login again.</p>
      )}
      <Context.Consumer>
        {({ message, loginUser, fetching, authenticated }) => {
          console.log('message', message)
          return (
            <div className="login">
              <div className="login__row">
                <div className="login__col">
                  <h1 className="login__heading">{EnglishConstants.LOGIN}</h1>

                  {message && typeof message === 'string' && (
                    <p>{message}</p>
                  )}

                  {message && Array.isArray(message) && (
                    <ul className="login__error">
                      {message.map((e: any, i: number) => (
                        <li key={i}>
                          <label htmlFor={e.field}>{e.field}, {e.error}</label>
                        </li>
                      ))}
                    </ul>
                  )}

                  {authenticated && (
                    <p>{EnglishConstants.LOGIN_SUCCESS}</p>
                  )}

                  {fetching && (
                    <p>{EnglishConstants.LOGIN_LOADING} <em>{username}</em>...</p>
                  )}

                  {!authenticated && !fetching && (
                    <form className="login__form" onSubmit={onSubmit(loginUser)}>
                      <Input
                        className="login__input"
                        label={EnglishConstants.USERNAME_LABEL}
                        name="username"
                        value={username}
                        invalid={usernameInvalid}
                        onChange={onUsernameChange}
                      />

                      <Input
                        className="login__input"
                        type="password"
                        label={EnglishConstants.PASSWORD_LABEL}
                        name="password"
                        value={password}
                        invalid={passwordInvalid}
                        onChange={onPasswordChange}
                      />

                      <Button className="button login__button" disabled={loading}>{EnglishConstants.LOGIN}</Button>
                    </form>
                  )}
                  <p><Link className="login__link" to="/register">{EnglishConstants.SIGN_UP}</Link></p>
                </div>
              </div>
            </div>
          );
        }}
      </Context.Consumer>
    </Fragment>

  );
}
