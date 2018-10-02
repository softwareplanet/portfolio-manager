import React, {Component} from 'react';
import {connect} from "react-redux";
import Dropzone from 'react-dropzone';
import {Loader, PrivatePageRedirect, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {IconButton, SelectionMode} from "office-ui-fabric-react";
import {createProjectFile, getProject, getProjects} from "../../actions/projects";
import axios from "axios";

class ProjectTeamPage extends Component {

  _team_columns = [
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

  _files_columns = [{
    key: 'fileName',
    name: 'Name',
    fieldName: 'fileName',
    minWidth: 110,
    maxWidth: 1040,
    isRowHeader: true,
    isResizable: true,
    isPadded: true,
    onRender: ({file}) => {
      return <a href={axios.defaults.baseURL + file} target="_blank">{file.split('/').slice(-1)[0]}</a>;
    },
  },
    {
      key: 'group',
      name: 'Group',
      fieldName: 'group',
      minWidth: 70,
      maxWidth: 100,
      isPadded: true,
      onRender: ({group: {name}}) => {
        return <span>{name}</span>;
      },
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
                key: 'delete',
                text: 'Delete',
                iconProps: {iconName: 'Trash', style: {color: '#000'}}
              }
            ],
            directionalHintFixed: true
          }
          }
          split={false}
        />);
      },
      isPadded: true
    }];


  componentDidMount() {
    const {user, getProject, projectId, getProjects} = this.props;
    if (user) {
      getProject(projectId);
      getProjects();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {user, getProject, projectId} = this.props;
    const {projectId: nextId} = nextProps;
    if (projectId !== nextId) {
      if (user) {
        getProject(nextId);
      }
    }
  }

  onDrop = (files) => {
    console.log(files);
    files.map( file => this.props.addProjectFile(this.props.projectId, {file, group: '2'}))
  };

  render() {
    const {project: {team, name, description, files}} = this.props;
    return (
      <div className={'page-container'} key={'employeeProjects'}>
        <PrivatePageRedirect/>
        <span
          className={'page-title'}>{'Project ' + (name ? name : '')}</span>
        <p className={'page-description'}>{'    ' + description}</p>
        <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>Project Team</h3>
        {
          team ?
            <DetailsList
              items={team}
              columns={this._team_columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading project team..."/>
        }
        <Dropzone
          disableClick
          style={{position: 'relative'}}
          onDrop={this.onDrop}
        >
          <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>Project Files</h3>
          {
            files ?
              <DetailsList
                items={files}
                columns={this._files_columns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
              /> :
              <Loader title="Loading project team..."/>
          }
        </Dropzone>
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
    getProject: (projectId) => dispatch(getProject(projectId)),
    getProjects: () => dispatch(getProjects()),
    addProjectFile: (projectId, data) => dispatch(createProjectFile(projectId, data)),
  };
};

export const Project = connect(mapStateToProps, mapDispatchToProps)(ProjectTeamPage);