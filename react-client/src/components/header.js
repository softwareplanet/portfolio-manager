import React, {Component} from "react";
import {LogoutButton} from "./logoutButton";

export class Header extends Component {
  render() {
    return (
      <header className={"header"}>
        <div className={"header-left-container"}>
          <div className={"header-logo"}/>
          <span className={"title"}>
            Portfolio Manager
          </span>
        </div>
        <div>
          <LogoutButton className={"logout-button"}/>
        </div>
      </header>
    );
  }
}