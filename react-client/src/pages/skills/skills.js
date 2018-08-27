import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";

class SkillsPage extends Component {
  render() {
    return (
      <Loader title="Skills page is in development..."/>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Skills = connect(mapStateToProps)(SkillsPage);