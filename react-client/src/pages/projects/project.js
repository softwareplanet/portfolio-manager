import React, {Component} from 'react';
import {connect} from "react-redux";
import Dropzone from 'react-dropzone';
import {
  CreateProjectModal,
  DropZone,
  Loader,
  Tooltip,
} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown, Icon,
  IconButton,
  PrimaryButton,
  SelectionMode
} from "office-ui-fabric-react";
import {
  createProjectFile,
  deleteProjectFile,
  getProject,
  getProjects,
  setProject,
} from '../../actions/projects';
import axios from "axios";
import {setProjectModal, setTeamModal} from "../../actions/modals";
import {AddTeamModal} from "../../components/forms/addTeamModal";
import {getEmployees} from "../../actions/user";
import { Link } from 'react-router-dom';

class ProjectTeamPage extends Component {

  state = {
    hideDialog: true,
    group: 0,
    groups: [{key: 0, text: 'All groups'}],
    dropzoneActive: false,
    projectToEdit: null,
  };

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
      onRender: ({employeeName, employeeId}) => {
        const { isStaff } = this.props.user || {};
        return isStaff
         ? <Link
            to={`/home/${employeeId}/profile`}
            className="table-link"
          >{employeeName}</Link>
         : <span>{employeeName}</span>;
      },
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      minWidth: 100,
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
      minWidth: 65,
      maxWidth: 65,
      data: 'string',
      onRender: ({durationMonths, isFinished, startDate}) => {
        let durations;
        if (isFinished) {
          durations = durationMonths;
        } else {
          durations = Math.floor((new Date() - new Date(startDate))/1000/60/60/24/30)
        }
        return <span>{durations + ` Month${durations > 1 ? 's' : ''}`}</span>;
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
        const { isStaff } = this.props.user || {};
        return isStaff ? (<IconButton
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
        />)
      : <div/>;
      },
      isPadded: true
    }
  ];

  _files_columns = [
    {
      key: 'fileName',
      name: 'Name',
      fieldName: 'fileName',
      minWidth: 110,
      maxWidth: 1040,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({file}) => {
        return <a href={axios.defaults.baseURL + file} download target="_blank">{file.split('/').slice(-1)[0]}</a>;
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
                iconProps: {iconName: 'Trash', style: {color: '#000'}},
                onClick: () => this._openDeleteDialog(item)
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

  editProject(project) {
    this.props.createProject();
    this.setState({projectToEdit: project})
  }

  addTeammates(project) {
    this.props.addTeam();
    this.setState({projectToEdit: project});
  }

  componentWillMount() {
    this.props.setProject(null);
  }

  componentDidMount() {
    this.mounted = true;
    const {user, getProject, projectId, getProjects, getEmployees} = this.props;
    if (user) {
      getProject(projectId);
      getProjects();
      getEmployees();
    }
    this.getFileGroups();
  }

  getFileGroups = () => {
    axios.get('/api/v1/files_group').then(({data}) => {
      this.mounted &&
      this.setState({
        groups: [...this.state.groups, ...data.map(({id, name}) => ({
          key: id,
          text: name
        }))]
      })
    });
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    const {user, getProject, projectId, getEmployees} = this.props;
    const {projectId: nextId} = nextProps;
    if (projectId !== nextId) {
      if (user) {
        getProject(nextId);
        getEmployees();
      }
    }
    if (!nextProps.projectModal) this.setState({projectToEdit: null});
    const {project} = this.props;
    if (project && nextProps) {
      const {files} = project;
      if (files && nextProps.project.files && (files.length !== nextProps.project.files.length)) {
        const {hideDialog} = this.state;
        !hideDialog && this._closeDialog();
      }
    }
  }

  onDrop = (files) => {
    const {group} = this.state;
    this.setState({dropzoneActive: false});
    files.map(file => this.props.addProjectFile(this.props.projectId, {file, group: group ? group.toString() : '1'}));
  };
  styles = {
    icon: {
      fontSize: 1.5 + 'rem',
      marginLeft: 0.6 + 'rem',
      marginBottom: 0.6 + 'rem',
      cursor: 'pointer'
    }
  };
  render() {
    const {project: {id, team, name, description, files, skills}, user} = this.props;
    const {hideDialog, projectFileToDelete, group, groups, dropzoneActive, projectToEdit} = this.state;
    return (
      <div className={'page-container'} key={'employeeProjects'}>
        <CreateProjectModal project={projectToEdit}/>
        <AddTeamModal project={projectToEdit} employees={this.props.employees && this.props.employees.filter(e => team && !team.map(e => e.employeeId).includes(e.id))}/>
        <span
          className={'page-title'}>{'Project ' + (name ? name : '')}
          <Icon
          iconName={'Edit'}
          style={this.styles.icon}
          onClick={() => this.editProject(this.props.project)}
        /></span>
        {id && <p className={'page-description'}>{description ? description : <b>Project has no description!</b>}</p>}
        {id && <p className={'page-description'}>Skills: {skills && skills.map(({name}) => name).join(', ')}</p>}
        <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>
          Project Team
          {user && user.isStaff && <Icon
            iconName={'Add'}
            style={{...this.styles.icon, fontSize: 1 + 'rem'}}
            onClick={() => this.addTeammates(this.props.project)}
          /> }
        </h3>
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
        {user && user.isStaff &&  <Dropzone
          disableClick
          style={{position: 'relative'}}
          onDrop={this.onDrop}
          onDragEnter={this._setDropZoneActive(true)}
          onDragLeave={this._setDropZoneActive(false)}
        >
          {dropzoneActive && <DropZone/>}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>Project Files</h3>
            <div style={{width: 10 + 'rem'}}>
              <Dropdown
                selectedKey={group}
                onChanged={({key: group}) => this.setState({group})}
                placeHolder="Select a Group"
                options={groups}
              />
            </div>
          </div>
          {
            files ?
              <DetailsList
                items={group ? files.filter(({group: {id}}) => id === group) : files}
                columns={this._files_columns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
              /> :
              <Loader title="Loading project team..."/>
          }
        </Dropzone> }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete file ${projectFileToDelete && projectFileToDelete.file.split('/').slice(-1)[0]}`,
            subText:
              'This can not be undone.'
          }}
          modalProps={{
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton
              iconProps={{iconName: 'Delete'}}
              onClick={() => {
                this.props.deleteProjectFile(projectFileToDelete.id);
              }} text="Delete"/>
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  _openDeleteDialog(projectFile) {
    this.setState({projectFileToDelete: projectFile, hideDialog: false})
  }
  _setDropZoneActive = (bool) => () => this.setState({dropzoneActive: bool});
  _closeDialog = () => {
    this.setState({hideDialog: true});
  };
  _openEmployeeProfile = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/profile`);
  };
  _openEmployeeProjects = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/projects`);
  };
}

const mapStateToProps = ({user, project, projectModal, employees}, {match: {params: {projectId}}}) => {
  return {user, projectId, project, projectModal, employees};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProject: () => dispatch(setProjectModal(true)),
    addTeam: () => dispatch(setTeamModal(true)),
    getProject: (projectId) => dispatch(getProject(projectId)),
    getProjects: () => dispatch(getProjects()),
    addProjectFile: (projectId, data) => dispatch(createProjectFile(projectId, data)),
    deleteProjectFile: (projectId) => dispatch(deleteProjectFile(projectId)),
    getEmployees: () => dispatch(getEmployees()),
    setProject: (project) => dispatch(setProject(project)),
  };
};

export const Project = connect(mapStateToProps, mapDispatchToProps)(ProjectTeamPage);
