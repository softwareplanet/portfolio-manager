import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader, PrivatePageRedirect, CompanyProject} from "../../components";
import {getProjectsExtended} from "../../actions/projects";

class CompanyPortfolioPage extends Component {

  componentDidMount() {
    const {getProjectsExtended, isStaff} = this.props;
    if (isStaff) {
      getProjectsExtended();
    }
  }

  render() {
    let {projects} = this.props;
    return (
      <div className={'page-container'}>
        <PrivatePageRedirect/>
        <span className={'page-title'}>Company Presentation</span>
        <div className={'presentation-container'}>
          {projects ? this._renderProjects(projects) : <Loader title={'Loading projects...'}/>}
        </div>
      </div>
    );
  }

  _renderProjects = (projects = []) => {
    return projects.map((project) => <CompanyProject key={project.id} project={project}/>)
  }
}

const mapStateToProps = ({isStaff, projects}) => {
  return {
    isStaff,
    projects
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjectsExtended: () => dispatch(getProjectsExtended()),
  };
};

export const CompanyPortfolio = connect(mapStateToProps, mapDispatchToProps)(CompanyPortfolioPage);