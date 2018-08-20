import React, { Component } from 'react';
import './App.css';
import {Switch, Route} from "react-router-dom";
import {Loading, Login, Home} from "./pages";
import {AuthService} from "./service/authService";
import {PrivateRoute} from "./components";

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Loading}/>
          <PrivateRoute authed={!AuthService.isAuthenticated()} pathTo={'/'} exact path='/login' component={Login}/>
          <PrivateRoute authed={!AuthService.isAuthenticated()} pathTo={'/'} exact path='/register' component={Login}/>
          <PrivateRoute authed={AuthService.isAuthenticated()} pathTo={'/login'} path='/home' component={Home}/>
        </Switch>
      </main>
    );
  }
}

export default App;
