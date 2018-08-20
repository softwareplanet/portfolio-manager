import React, { Component } from 'react';
import './loading.css';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react';
import {AuthService} from "../../service/authService";

export class Loading extends Component {

  componentDidMount() {
    AuthService.isAuthenticated() ? this.props.history.push('/home') : this.props.history.push('/login')
  }

  render() {
    return (
      <div className={'centered-loading'}>
        <Spinner size={SpinnerSize.large} label="Wait a bit, we're loading all information about you..." ariaLive="assertive" />
      </div>
    );
  }
}