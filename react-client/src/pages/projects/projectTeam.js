import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {SelectionMode} from "office-ui-fabric-react";
import {getProject} from "../../actions/projects";

class ProjectTeamPage extends Component {

  _columns = [
    {
      key: 'employeeName',
      name: 'Name',
      fieldName: 'employeeName',
      minWidth: 110,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({employeeName}) => {
        return <span>{employeeName}</span>;
      },
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      minWidth: 70,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: ({startDate}) => {
        return <span>{new Date(startDate).toDateString()}</span>;
      },
    },
    {
      key: 'duration',
      name: 'Duration',
      fieldName: 'durationMonths',
      minWidth: 30,
      maxWidth: 55,
      data: 'string',
      onRender: ({durationMonths}) => {
        return <span>{durationMonths + ` Month${durationMonths > 1 ? 's' : ''}`}</span>;
      },
      isPadded: true
    },
    {
      key: 'description',
      name: 'Role on project',
      fieldName: 'description',
      minWidth: 110,
      maxWidth: 250,
      isResizable: true,
      isPadded: true,
      onRender: ({description}) => {
        return <span>{description}</span>;
      },
    },
    {
      key: 'skills',
      name: 'Skills',
      fieldName: 'skills',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({skills}) => {
        return <span>{skills.map((skill) => skill.name).join(', ')}</span>;
      },
      isPadded: true
    }
  ];

  componentDidMount() {
    const {user, getProject, projectId} = this.props;
    if (user) {
      getProject(projectId);
    }
  }

  render() {
    const {project: {team, name}} = this.props;
    return (
      <div className={'page-container'} key={'employeeProjects'}>
        <span
          className={'page-title'}>{'Project ' + (name ? name : '')}</span>
        {
          team ?
            <DetailsList
              items={team}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading project team..."/>
        }
      </div>
    );
  }
}

const mapStateToProps = ({user, project}, {match: {params: {projectId}}}) => {
  return {user, projectId, project};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProject: (projectId) => dispatch(getProject(projectId))
  };
};

export const ProjectTeam = connect(mapStateToProps, mapDispatchToProps)(ProjectTeamPage);