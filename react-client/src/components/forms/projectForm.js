import React, {Component} from "react";
import {connect} from "react-redux";
import {BasePickerListBelow, DatePicker, Label, TagPicker} from "office-ui-fabric-react";
import {CreateNew} from "../projectCommon/suggestions/createNewSuggestion";
import {NumberTextField} from "../common/numberTextField";
import {SelectedItem} from "../projectCommon/suggestions/selectedItem";
import {SuggestionsItem} from "../projectCommon/suggestions/suggestionsItem";
import {setProjectModal, setSkillModal} from "../../actions/modals";
import {PanelFooter} from "../projectCommon/panelFooter";
import {createUserProject, editUserProject} from "../../actions/userProjects";
import {ErrorLabel} from "../common/errorLabel";
import {formatDate} from "../../service/utils";

class DocumentPicker extends BasePickerListBelow {
}

class ProjectFormComponent extends Component {

  projectsInput = React.createRef();
  skillsInput = React.createRef();

  state = {
    startDate: new Date(),
    duration: '',
    selectedSkills: [],
    selectedProject: [],
    errors: {},
    edit: false
  };

  _onFilterChange = (items) => {
    return (filterText) => {
      return filterText ? items.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0) : [];
    }
  };

  createProject = () => {
    const {user, createUserProject} = this.props;
    const project = this._generateProjectObject();
    if (project)
      createUserProject(user.id, project);
  };

  editProject = () => {
    const {user, editUserProject, userProject} = this.props;
    const project = this._generateProjectObject();
    if (project)
      editUserProject(user.id, {...project, id: userProject.id});
  };

  componentWillMount() {
    const {userProject} = this.props;
    if (userProject) {
      const {startDate, durationMonths, skills, project} = userProject;
      const projectToEdit = {
        startDate: new Date(startDate),
        duration: durationMonths,
        selectedSkills: skills,
        selectedProject: [project]
      };
      this.setState({...this.state, ...projectToEdit, edit: true})
    }
  }

  render() {
    const {projects, skills, createSkill, createProject, onClose, loading} = this.props;
    const {duration, startDate, selectedSkills, selectedProject, errors, edit} = this.state;
    return (
      <div>
        <Label>Name</Label>
        <TagPicker
          onChange={this._onChange(selectedProject, 'selectedProject')}
          componentRef={this.projectsInput}
          items={projects}
          getTextFromItem={({name}) => name}
          onResolveSuggestions={this._onFilterChange(projects)}
          selectedItems={selectedProject}
          inputProps={{
            placeholder: 'Enter a project name',
          }}
          pickerSuggestionsProps={{
            onRenderNoResultFound: () =>
              <CreateNew
                onClick={() => createProject()}
                text={'No such projects yet...'}
              />
          }}
          itemLimit={1}
        />
        <ErrorLabel title={(errors.project || []).join('<br/>')}/>
        <br/>
        <DatePicker
          value={startDate}
          placeholder="Select a date..."
          label="Start date"
          onSelectDate={(startDate) => {
            this.setState({startDate})
          }}
          errorMessage={(errors.startDate || []).join('<br/>')}
        />
        <br/>
        <NumberTextField
          label="Duration, month"
          value={duration}
          onChange={(duration) => this.setState({duration})}
          errorMessage={(errors.durationMonths || []).join('<br/>')}
        />
        <br/>
        <Label>Skills</Label>
        <DocumentPicker
          onRenderSuggestionsItem={SuggestionsItem}
          componentRef={this.skillsInput}
          items={skills}
          getTextFromItem={({name}) => name}
          onResolveSuggestions={this._onFilterChange(skills)}
          selectedItems={selectedSkills}
          onRenderItem={SelectedItem}
          onChange={this._onChange(selectedSkills, 'selectedSkills')}
          pickerSuggestionsProps={{
            onRenderNoResultFound: () =>
              <CreateNew
                onClick={() => createSkill()}
                text={'No such skills yet...'}
              />
          }}
        />
        <ErrorLabel title={(errors.skills || []).join('<br/>')}/>
        <br/>
        <ErrorLabel title={(errors.non_field_errors || []).join('<br/>')}/>
        <PanelFooter onClose={onClose} loading={loading}
                     onSave={edit ? this.editProject.bind(this) : this.createProject.bind(this)}/>
      </div>
    );
  }

  _generateProjectObject() {
    const {startDate, duration, selectedSkills, selectedProject} = this.state;
    let errors = {};
    let valid = true;
    let project = {};
    project.startDate = startDate ? formatDate(startDate) : (errors.startDate = ['Enter start date']) && (valid = false);
    project.projectId = selectedProject[0] ? selectedProject[0].id : (errors.project = ['Choose your project or create a new one']) && (valid = false);
    project.skillIds = selectedSkills.length !== 0 ? selectedSkills.map(skill => skill.id) : (errors.skills = ['Choose some skills']) && (valid = false);
    project.durationMonths = duration ? duration : errors.durationMonths = ['Enter valid positive number'];
    this.setState({errors});
    return valid ? project : null;
  }

  _onChange(selectedItems, name) {
    return (items) => {
      const itemsWithoutDuplicates = items.filter((item, pos, self) => self.indexOf(item) === pos);
      this.setState(ProjectFormComponent._generateStateObject(name, itemsWithoutDuplicates));
    };
  }

  static _generateStateObject(fieldName, fieldValue) {
    const state = {};
    state[fieldName] = fieldValue;
    return state;
  }
}

const mapStateToProps = ({user, skills, projects, newUserProjectLoading, createUserProjectErrors}) => {
  return {user, skills, projects, loading: newUserProjectLoading, errors: createUserProjectErrors};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createSkill: () => dispatch(setSkillModal(true)),
    createProject: () => dispatch(setProjectModal(true)),
    createUserProject: (userId, project) => dispatch(createUserProject(userId, project)),
    editUserProject: (userId, project) => dispatch(editUserProject(userId, project)),
  };
};

export const ProjectsForm = connect(mapStateToProps, mapDispatchToProps)(ProjectFormComponent);