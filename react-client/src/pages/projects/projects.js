import React, {Component} from 'react';
import {connect} from "react-redux";
import {CreateProjectModal, Loader} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  SelectionMode
} from "office-ui-fabric-react";
import {deleteProject, getProjects} from "../../actions/projects";
import {setProjectModal} from "../../actions/modals";

class ProjectsPage extends Component {

  editProject(project) {
    this.props.createProject();
    this.setState({projectToEdit: project})
  }

  deleteProject(projectId) {
    const {deleteProject} = this.props;
    deleteProject(projectId);
  }

  _openDeleteDialog(project) {
    this.setState({projectToDelete: project, hideDialog: false})
  }

  _columns = [
    {
      key: 'name',
      name: 'Project Name',
      fieldName: 'name',
      minWidth: 110,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({name}) => {
        return <span>{name}</span>;
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
      maxWidth: 65,
      data: 'string',
      onRender: ({durationMonths}) => {
        return <span>{durationMonths + ` Month${durationMonths > 1 ? 's' : ''}`}</span>;
      },
      isPadded: true
    },
    {
      key: 'description',
      name: 'Description',
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
      key: 'url',
      name: 'Link',
      fieldName: 'url',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({url}) => {
        return <span>{url}</span>;
      },
      isPadded: true
    }
  ];

  _actions = {
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
  };

  state = {
    hideDialog: true,
    projectToDelete: null,
    projectToEdit: null
  };

  componentDidMount() {
    const {user, getProjects} = this.props;
    if (user) {
      getProjects();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.isStaff && this._columns.length === 5)
      this._columns.push(this._actions);

    const {projects} = this.props;
    if (projects && nextProps.projects && (projects.length !== nextProps.projects.length)) {
      const {hideDialog} = this.state;
      !hideDialog && this._closeDialog();
    }
    if (!nextProps.projectModal) this.setState({projectToEdit: null});
  }

  _openCreateModal = () => {
    const {createProject} = this.props;
    createProject();
  };

  render() {
    const {projectToEdit, hideDialog, projectToDelete} = this.state;

    return (
      <div className={'page-container'}>
        <CreateProjectModal project={projectToEdit}/>
        <span className={'page-title'}>Projects</span>
        <div className={'add-button'}>
          <PrimaryButton
            text={'Add a Project'}
            onClick={this._openCreateModal}
          />
        </div>
        {
          this.props.projects ?
            <DetailsList
              items={this.props.projects}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading projects..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete project ${projectToDelete && projectToDelete.name}`,
            subText:
              'This can not be undone. This project will be deleted for all employees.'
          }}
          modalProps={{
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

const mapStateToProps = ({user, projects, isStaff, projectModal}) => {
  return {user, projects, isStaff, projectModal};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects()),
    deleteProject: (userId, projectId) => dispatch(deleteProject(userId, projectId)),
    createProject: () => dispatch(setProjectModal(true)),
  };
};

export const Projects = connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);