import React, {Component} from 'react';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react';
import {connect} from "react-redux";

class ProjectsPage extends Component {
  render() {
    return (
      <div className={'centered-loading'}>
        <Spinner size={SpinnerSize.large} label="Projects"
                 ariaLive="assertive"/>
      </div>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Projects = connect(mapStateToProps)(ProjectsPage);