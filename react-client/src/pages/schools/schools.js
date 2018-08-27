import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";

class SchoolsPage extends Component {
  render() {
    return (
      <Loader title="Schools page is in development..."/>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Schools = connect(mapStateToProps)(SchoolsPage);