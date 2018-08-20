import React, {Component} from "react";
import {AuthService} from "../service/authService";
import {DefaultButton} from "office-ui-fabric-react";
import {Redirect} from "react-router-dom";

export class LogoutButton extends Component {

  state = {
    isAuthenticated: AuthService.isAuthenticated()
  };

  logOut() {
    AuthService.logOut();
    this.setState({isAuthenticated: false});
  }

  render() {
    const {isAuthenticated} = this.state;
    return (
      <div>
        {isAuthenticated ? <DefaultButton onClick={this.logOut.bind(this)}>Log out</DefaultButton> : <Redirect to="/"/>}
      </div>
    );
  }
}