import React, {Component} from 'react';
import './projects.css'
import {connect} from "react-redux";
import {Loader, ProjectsForm} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {deleteUserProject, getUserProjects} from "../../actions/userProjects";
import {IconButton, Panel, PanelType, PrimaryButton, SelectionMode} from "office-ui-fabric-react";
import {getProjects} from "../../actions/projects";
import {getSkills} from "../../actions/skills";

class ProjectsPage extends Component {

  editProject(projectId) {
    console.log(projectId);
  }

  deleteProject(projectId) {
    const {user, deleteProject} = this.props;
    deleteProject(user.id, projectId);
  }

  _columns = [
    {
      key: 'projectName',
      name: 'Project Name',
      fieldName: 'project.name',
      minWidth: 210,
      maxWidth: 350,
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
        return <span>{durationMonths + ' Month'}</span>;
      },
      isPadded: true
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
    },
    {
      key: 'actions',
      name: 'Actions',
      fieldName: 'skills',
      minWidth: 50,
      maxWidth: 50,
      onRender: (item) => {
        return (<IconButton
          allowDisabledFocus={true}
          menuIcon={{iconName: 'MoreVertical'}}
          menuProps={{
            items: [
              {
                key: 'edit',
                text: 'Edit',
                iconProps: {iconName: 'Edit'},
                onClick: () => this.editProject(item.id)
              },
              {
                key: 'delete',
                text: 'Delete',
                iconProps: {iconName: 'Delete'},
                onClick: () => this.deleteProject(item.project.id)
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
    showPanel: false
  };

  componentDidMount() {
    const {user, userProjects, getUserProjects, projects, skills, getProjects, getSkills} = this.props;
    if (user) {
      if (!userProjects)
        getUserProjects(user.id);
      if (projects.length === 0)
        getProjects();
      if (skills.length === 0)
        getSkills();
    }
  }

  render() {
    return (
      <div className={'page-container'}>
        <span className={'page-title'}>Projects</span>
        <div className={'add-button'}>
          <PrimaryButton
            text={'Add a Project'}
            onClick={this._setShowPanel(true)}
          />
          <Panel
            isBlocking={false}
            isOpen={this.state.showPanel}
            onDismiss={this._setShowPanel(false)}
            type={PanelType.smallFixedFar}
            headerText="Add a Project"
            hasCloseButton={false}
          >
            <ProjectsForm onClose={this._setShowPanel(false)}/>
          </Panel>
        </div>
        {
          this.props.userProjects ?
            <DetailsList
              items={this.props.userProjects}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.fixedColumns}
            /> :
            <Loader title="Loading your projects..."/>
        }
      </div>
    );
  }

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({showPanel});
    };
  };
}

const mapStateToProps = ({user, userProjects, projects, skills}) => {
  return {user, userProjects, projects, skills};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProjects: (userId) => dispatch(getUserProjects(userId)),
    getProjects: () => dispatch(getProjects()),
    getSkills: () => dispatch(getSkills()),
    deleteProject: (userId, projectId) => dispatch(deleteUserProject(userId, projectId))
  };
};

export const Projects = connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);