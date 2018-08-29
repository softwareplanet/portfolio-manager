import React, {Component} from "react";
import {LogoutButton} from "./logoutButton";
import connect from "react-redux/es/connect/connect";
import {getUser} from "../actions/user";
import {history} from "../store";
import {toggleSideBar} from "../actions/sidebar";

export class HeaderComponent extends Component {

  componentWillMount() {
    if (!this.props.user) {
      HeaderComponent.rememberLocation();
      history.push('/');
    }
  }

  static rememberLocation() {
    localStorage.setItem('location', history.location.pathname)
  }

  toggleSideBar() {
    this.props.dispatch(toggleSideBar());
  }

  render() {
    const {user} = this.props;
    return (
      <header className={"header"}>
        <div className={"header-left-container"}>
          <div className={"header-logo"} onClick={() => this.toggleSideBar()}/>
          <span className={"title"}>
            Portfolio Manager
          </span>
        </div>
        <div className={'header-right-container'}>
          <span className={'user-name'}>
            Welcome,
            <br/>
            <b>{user ? user.firstName + ' ' + user.lastName : ''}</b>
          </span>
          <LogoutButton className={"logout-button"}/>
        </div>
      </header>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(getUser()),
    dispatch
  };
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);