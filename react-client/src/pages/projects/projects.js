import React, {Component} from 'react';
import {connect} from "react-redux";
import {CreateProjectModal, Loader, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  SelectionMode,
  TagPicker
} from "office-ui-fabric-react";
import {deleteProject, getProjects, setProject} from "../../actions/projects";
import {setProjectModal} from "../../actions/modals";
import {getSkills} from "../../actions/skills";

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
      onRender: (item) => {
        return <span
          className="table-link"
          onClick={() => {
          this.props.setProject(item);
          this.props.history.push(`/home/projects/${item.id}`)
        }}>{item.name}</span>;
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
        return (
          <Tooltip text={description}>{description}</Tooltip>
        );
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
                key: 'open',
                text: 'Project page',
                iconProps: {iconName: 'ProjectLogo32', style: {color: '#000'}},
                onClick: () => {
                  this.props.setProject(item);
                  this.props.history.push(`/home/projects/${item.id}`)
                }
              },
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
              },
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
    hideDialog: true,
    projectToDelete: null,
    projectToEdit: null,
    projects: null,
    selectedSkills: []
  };

  componentDidMount() {
    const {user, getProjects, getSkills, projects} = this.props;
    const {projects: projectsToShow} = this.state;
    (!projectsToShow && projects) && this.setState({projects: projects});
    if (user) {
      getProjects();
      getSkills();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {projects} = this.props;
    if (nextProps.projects) this.setState({projects: nextProps.projects});
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

  _openCompanyPortfolio = () => {
    this.props.history.push(`/home/company_portfolio`)
  };

  filterProjects(selectedSkills) {
    const {projects} = this.props;
    if (projects) {
      this.setState({
        projects: projects.filter(({skills}) => {
          return selectedSkills.filter(({id}) => skills.indexOf(id) !== -1).length === selectedSkills.length;
        })
      })
    }
  }

  render() {
    const {projectToEdit, hideDialog, projectToDelete, selectedSkills} = this.state;
    const {skills} = this.props;
    return (
      <div className={'page-container'}>
        <CreateProjectModal project={projectToEdit}/>
        <span className={'page-title'}>Projects</span>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{display: 'flex'}}>
            <div className={'add-button'}>
              <PrimaryButton
                text={'Add a Project'}
                onClick={() => this._openCreateModal()}
              />
            </div>
            <div className={'portfolio-button'}>
              <PrimaryButton
                text={'Company Portfolio'}
                onClick={() => this._openCompanyPortfolio()}
              />
            </div>
          </div>
          <div className={'filter-picker'}>
            <TagPicker
              onResolveSuggestions={this._onFilterChange(skills)}
              selectedItems={selectedSkills}
              items={skills}
              onChange={(selectedSkills) => {
                this.setState({selectedSkills});
                this.filterProjects(selectedSkills);
              }}
              inputProps={{
                placeholder: 'Filter by skill',
              }}
              getTextFromItem={({name}) => name}
              suggestionsClassName={'suggestions-container'}
              pickerSuggestionsProps={{
                suggestionsHeaderText: 'Suggested Tags',
                noResultsFoundText: 'No Skills Found'
              }}
            />
          </div>
        </div>
        {
          (this.props.projects && this.state.projects) ?
            <DetailsList
              items={this.state.projects}
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

  _onFilterChange = (items) => {
    return (filterText) => {
      return filterText ? items.filter((tag) => !this.state.selectedSkills.includes(tag)).filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) : [];
    }
  };

  _closeDialog = () => {
    this.setState({hideDialog: true});
  };
}

const mapStateToProps = ({user, projects, isStaff, projectModal, skills}) => {
  return {user, projects, isStaff, projectModal, skills};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects()),
    getSkills: () => dispatch(getSkills()),
    deleteProject: (userId, projectId) => dispatch(deleteProject(userId, projectId)),
    createProject: () => dispatch(setProjectModal(true)),
    setProject: (project) => dispatch(setProject(project)),
  };
};

export const Projects = connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);