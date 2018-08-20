import React, { Component } from 'react';
import './home.css';
import {LogoutButton} from "../../components";

export class Home extends Component {
  render() {
    return (
      <div className={'centered-loading'}>
        here can be your home page
        <LogoutButton/>
      </div>
    );
  }
}