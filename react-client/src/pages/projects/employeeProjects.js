import React, {Component} from 'react';
import {connect} from "react-redux";
import {AddButton, Loader, PageTitle, PrivatePageRedirect, ProjectsForm, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {deleteUserProject, getUserProjects} from "../../actions/userProjects";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  Panel,
  PanelType,
  PrimaryButton,
  SelectionMode
} from "office-ui-fabric-react";
import {getProjects} from "../../actions/projects";
import {getSkills} from "../../actions/skills";
import {getEmployee} from "../../actions/user";

class ProjectsPage extends Component {

  editProject(project) {
    this.setState({projectToEdit: project, showPanel: true})
  }

  deleteProject(projectId) {
    const {employee, deleteProject} = this.props;
    deleteProject(employee.id, projectId);
  }

  _openDeleteDialog(project) {
    this.setState({projectToDelete: project, hideDialog: false})
  }

  _columns = [
    {
      key: 'projectName',
      name: 'Project Name',
      fieldName: 'project.name',
      minWidth: 110,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({project}) => {
        return <span>{project.name}</span>;
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
      fieldName: 'skills',
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
                key: 'edit',
                text: 'Edit',
                iconProps: {iconName: 'Edit', style: {color: '#000'}},
                onClick: () => this.editProject(item)
              },
              {
                key: 'delete',
                text: 'Delete',
                iconProps: {iconName: 'Delete', style: {color: '#000'}},
                onClick: () => this._openDeleteDialog(item)
              }

            ],
            directionalHintFixed: true
          }}
          split={false}
        />);
      },
      isPadded: true
    }
  ];

  state = {
    showPanel: false,
    hideDialog: true,
    projectToDelete: null,
    projectToEdit: null
  };

  componentDidMount() {
    const {user, getUserProjects, projects, skills, getProjects, getSkills, employeeId, getEmployee} = this.props;
    if (user) {
      if((user.id === Number(employeeId) || user.isStaff)) {
        getEmployee(employeeId);
        getUserProjects(employeeId);
      }
      if (!projects)
        getProjects();
      if (!skills)
        getSkills();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {userProjects, editUserProjectState} = this.props;
    if ((userProjects && nextProps.userProjects && (userProjects.length !== nextProps.userProjects.length)) ||
      ((editUserProjectState && this.state.projectToEdit) &&
        (editUserProjectState === this.state.projectToEdit.id))) {
      const {showPanel, hideDialog} = this.state;
      !hideDialog && this._closeDialog();
      showPanel && this._setShowPanel(false)();
    }

    const {getUserProjects, employeeId, getEmployee} = this.props;
    const {employeeId: nextId} = nextProps;
    if ((nextId !== employeeId)) {
      getEmployee(nextId);
      getUserProjects(nextId);
    }
  }

  render() {
    const {projectToEdit, showPanel, hideDialog, projectToDelete} = this.state;
    return (
      <div className={'page-container'} key={'employeeProjects'}>
        <PrivatePageRedirect employeeId={this.props.employeeId}/>
        <PageTitle title="Projects"/>
        <div className={'add-button'}>
          <AddButton disabled={showPanel} title="Add a Project" onClick={this._setShowPanel(true)} />
          <Panel
            isBlocking={false}
            isOpen={showPanel}
            onDismiss={this._setShowPanel(false)}
            type={PanelType.smallFixedFar}
            headerText={!projectToEdit ? 'Add a Project' : 'Edit a project'}
            hasCloseButton={false}
          >
            <ProjectsForm onClose={this._setShowPanel(false)} userProject={projectToEdit}/>
          </Panel>
        </div>
        {
          this.props.userProjects ?
            <DetailsList
              items={this.props.userProjects}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading your projects..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete project ${projectToDelete && projectToDelete.project.name}`,
            subText:
              'This can not be undone. Your skills from this project would not be affected.'
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton
              iconProps={{iconName: 'Delete'}}
              onClick={() => {
                this.deleteProject(projectToDelete.id);
              }} text="Delete"/>
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  _closeDialog = () => {
    this.setState({hideDialog: true});
  };

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({projectToEdit: null, showPanel});
    };
  };
}

const mapStateToProps = ({user, userProjects, projects, skills, editUserProjectState, employee, isStaff}, {match: {params: {employeeId}}}) => {
  return {user, userProjects, projects, skills, editUserProjectState, employeeId, employee, isStaff};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProjects: (userId) => dispatch(getUserProjects(userId)),
    getProjects: () => dispatch(getProjects()),
    getSkills: () => dispatch(getSkills()),
    deleteProject: (userId, projectId) => dispatch(deleteUserProject(userId, projectId)),
    getEmployee: (userId) => dispatch(getEmployee(userId)),
  };
};

export const EmployeeProjects = connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);