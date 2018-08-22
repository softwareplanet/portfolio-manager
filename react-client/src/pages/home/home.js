import React, {Component} from 'react';
import './home.css';
import {Header, NavBar} from "../../components";
import {Route, Switch} from "react-router-dom";
import {Profile, Projects} from "../index";

export class Home extends Component {
  componentDidMount() {
    const {history} = this.props;
    if (history.location.pathname === '/home')
      history.push('/home/profile');
  }

  render() {
    return (
      <div className={'full-frame'}>
        <Header/>
        <div className={'flex'}>
          <NavBar history={this.props.history}/>
          <div className={'content-container'}>
            <Switch>
              <Route path='/home/profile' component={Profile}/>
              <Route path='/home/projects' component={Projects}/>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}