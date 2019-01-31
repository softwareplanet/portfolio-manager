import React, {Component} from 'react';
import {connect} from "react-redux";
import Dropzone from 'react-dropzone';
import {CreateProjectModal, DropZone, Loader, PrivatePageRedirect, Tooltip} from "../../components";
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
import {createProjectFile, deleteProjectFile, getProject, getProjects} from "../../actions/projects";
import axios from "axios";
import {setProjectModal} from "../../actions/modals";

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
        return <span
          onClick={() => this._openEmployeeProfile(employeeId)}
          className="table-link"
        >{employeeName}</span>;
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

  componentDidMount() {
    this.mounted = true;
    const {user, getProject, projectId, getProjects} = this.props;
    if (user) {
      getProject(projectId);
      getProjects();
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
    const {user, getProject, projectId} = this.props;
    const {projectId: nextId} = nextProps;
    if (projectId !== nextId) {
      if (user) {
        getProject(nextId);
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
    const {project: {team, name, description, files, skills}} = this.props;
    const {hideDialog, projectFileToDelete, group, groups, dropzoneActive, projectToEdit} = this.state;
    return (
      <div className={'page-container'} key={'employeeProjects'}>
        <PrivatePageRedirect/>
        <CreateProjectModal project={projectToEdit}/>
        <span
          className={'page-title'}>{'Project ' + (name ? name : '')}
          <Icon
          iconName={'Edit'}
          style={this.styles.icon}
          onClick={() => this.editProject(this.props.project)}
        /></span>
        <p className={'page-description'}>{description ? description : <b>Project has no description!</b>}</p>
        <p className={'page-description'}>Skills: {skills && skills.map(({name}) => name).join(', ')}</p>
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
        </Dropzone>
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

const mapStateToProps = ({user, project, projectModal}, {match: {params: {projectId}}}) => {
  return {user, projectId, project, projectModal};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProject: () => dispatch(setProjectModal(true)),
    getProject: (projectId) => dispatch(getProject(projectId)),
    getProjects: () => dispatch(getProjects()),
    addProjectFile: (projectId, data) => dispatch(createProjectFile(projectId, data)),
    deleteProjectFile: (projectId) => dispatch(deleteProjectFile(projectId)),
  };
};

export const Project = connect(mapStateToProps, mapDispatchToProps)(ProjectTeamPage);