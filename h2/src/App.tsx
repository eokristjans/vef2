import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, withRouter } from 'react-router-dom';

import Header from './components/header/Header';

import Home from './routes/home/Home';
import Register from './routes/register/Register';
import Login from './routes/login/Login';
import Notebooks from './routes/notebooks/Notebooks';
import Images from './routes/images/Images';
import Users from './routes/users/Users';

// import Admin from './routes/admin/Admin';
import NotFound from './routes/system-pages/NotFound';

import './App.scss';



type Props = {
  location?: Location; // Changed this to be optional
};

function App(props: Props) {
  return (

    <React.Fragment>
      <Helmet defaultTitle="NoteworthyMD" titleTemplate="%s – NoteworthyMD" />

      <Header />

      <div className="app">

        <main className="main__content">
          {/* Define all available routes */}
          <Switch location={props.location}>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/notebooks" component={Notebooks} />
            <Route path="/images" component={Images} />
            <Route path="/users" component={Users} />
            {/* <Route path="/admin" component={Admin} /> */}
            <Route component={NotFound} />
          </Switch>
        </main>

      </div>
    </React.Fragment>
  );
}

export default App;
