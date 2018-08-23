import React, {Component} from 'react';
import './projects.css'
import {connect} from "react-redux";
import {Loader} from "../../components";

class ProjectsPage extends Component {
  render() {
    return (
      <Loader title="Projects"/>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Projects = connect(mapStateToProps)(ProjectsPage);