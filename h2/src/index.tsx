import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import UserContextProvider from './UserContext';

import './index.scss';
import App from './App';

ReactDOM.render(
  <UserContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserContextProvider>,
  document.getElementById('root'),
);
