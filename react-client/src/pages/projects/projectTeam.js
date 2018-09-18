import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader, PrivatePageRedirect, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {IconButton, SelectionMode} from "office-ui-fabric-react";
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
        return <Tooltip text={description}>{description}</Tooltip>;
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
        const skillsS = skills.map((skill) => skill.name).join(', ');
        return <Tooltip text={skillsS}>{skillsS}</Tooltip>;
      },
      isPadded: true
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 50,
      maxWidth: 50,
      onRender: (item) => {
        return (<IconButton
          style={{height: 'auto'}}
          allowDisabledFocus={true}
          menuIcon={{iconName: 'MoreVertical'}}
          menuProps={{
            items: [
              {
                key: 'open',
                text: 'Open profile',
                iconProps: {iconName: 'Contact', style: {color: '#000'}},
                onClick: () => this._openEmployeeProfile(item.employeeId)
              },
              {
                key: 'skills',
                text: 'All projects',
                iconProps: {iconName: 'ProjectLogo32', style: {color: '#000'}},
                onClick: () => this._openEmployeeProjects(item.employeeId)
              }
            ],
            directionalHintFixed: true
          }
          }
          split={false}
        />);
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

  componentWillReceiveProps(nextProps, nextContext) {
    const {user, getProject, projectId} = this.props;
    const {projectId: nextId} = nextProps;
    if (projectId !== nextId) {
      if (user) {
        getProject(nextId);
      }
    }
  }

  render() {
    const {project: {team, name, description}} = this.props;
    return (
      <div className={'page-container'} key={'employeeProjects'}>
        <PrivatePageRedirect/>
        <span
          className={'page-title'}>{'Project ' + (name ? name : '')}</span>
        <p className={'page-description'}>{'    ' + description}</p>
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

  _openEmployeeProfile = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/profile`);
  };
  _openEmployeeProjects = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/projects`);
  };
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