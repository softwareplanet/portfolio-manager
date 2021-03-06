import React, {Component} from "react";
import {connect} from "react-redux";
import {
  BasePickerListBelow,
  Checkbox,
  DatePicker, Dropdown,
  Label,
  TagPicker,
  TextField,
  Toggle,
  DropdownMenuItemType,
} from 'office-ui-fabric-react';
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

  state = {
    startDate: new Date(),
    duration: '',
    description: '',
    selectedSkills: [],
    selectedProject: [],
    errors: {},
    isFinished: false,
    edit: false
  };

  _onFilterChange = (items) => {
    return (filterText) => {
      return filterText ? items.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) : [];
    }
  };

  createProject = () => {
    const {user, createUserProject} = this.props;
    const project = this._generateProjectObject();
    if (project)
      createUserProject(user.id, project);
  };

  editProject = () => {
    const {user, editUserProject, userProject, afterSaveAction} = this.props;
    const project = this._generateProjectObject();
    if (project)
      editUserProject(userProject.employeeId || user.id, {...project, id: userProject.id}).then(() => afterSaveAction && afterSaveAction());
  };

  componentWillMount() {
    const {userProject} = this.props;
    if (userProject) {
      const {startDate, durationMonths, skills, project, description, isFinished} = userProject;
      const projectToEdit = {
        startDate: new Date(startDate),
        duration: durationMonths,
        selectedSkills: skills,
        selectedProject: [project],
        isFinished,
        description
      };
      this.setState({...this.state, ...projectToEdit, edit: true})
    }
  }

  render() {
    const {projects, skills, createSkill, createProject, onClose, loading} = this.props;
    const {duration, startDate, selectedSkills, selectedProject, errors, edit, description, isFinished, isSkillsSelect} = this.state;

    const numberTextField = isFinished ?
      <NumberTextField
        label="Duration, month"
        value={duration}
        onChange={(duration) => this.setState({duration})}
        errorMessage={(errors.durationMonths || []).join('\r\n')}
      />
      : '';

    return (
      <div>
        <Label>Name</Label>
        <TagPicker
          onChange={this._onChange(selectedProject, 'selectedProject')}
          items={projects}
          getTextFromItem={({name}) => name}
          onResolveSuggestions={this._onFilterChange(projects)}
          selectedItems={selectedProject}
          inputProps={{
            placeholder: 'Enter a project name',
          }}
          pickerSuggestionsProps={{
            onRenderNoResultFound: () =>
                !selectedProject[0] ? <CreateNew
                  onClick={() => createProject()}
                  text={'No such projects yet...'}
                /> : ''
          }}
          itemLimit={1}
        />
        <ErrorLabel title={(errors.project || []).join('\r\n')}/>
        <br/>
        <DatePicker
          value={startDate}
          placeholder="Select a date..."
          label="Start date"
          onSelectDate={(startDate) => {
            this.setState({startDate})
          }}
          errorMessage={(errors.startDate || []).join('\r\n')}
        />
        <br/>
        <Checkbox defaultChecked={isFinished} label="You finished work on project?" onChange={(ev, isChecked) => {
          this.setState({isFinished: isChecked});}}/>
        {numberTextField}
        <br/>
        <TextField label="Role on project:" value={description}
                   onChange={(e) => this.setState({description: e.target.value})}
                   errorMessage={(errors.description || []).join('\r\n')}
                   placeholder="Detailed description about your role on project..."
                   isRequired={true}
                   multiline rows={8}
                   autoAdjustHeight={true}
                   resizable={false}
        />
        <br/>
        <Label>Skills</Label>
        <div className={ `skills-picker ${ isSkillsSelect ? 'hide-skills-picker' : '' }` }>
          <Toggle
            label="Switch to multiselect"
            inlineLabel
            value={isSkillsSelect}
            onChanged={(isSkillsSelect) => this.setState({ isSkillsSelect })}
          />
          { isSkillsSelect && <Dropdown
            placeholder="Select skills"
            selectedKeys={selectedSkills.map(({id}) => id)}
            options={this._generateSkillsListForDropdown(skills)}
            onChanged={this._onDropdownChange}
            multiSelect
          /> }
          <DocumentPicker
            onRenderSuggestionsItem={SuggestionsItem}
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
        </div>
        <ErrorLabel title={(errors.skills || []).join('\r\n')}/>
        <br/>
        <ErrorLabel title={(errors.non_field_errors || []).join('\r\n')}/>
        <PanelFooter onClose={onClose} loading={loading}
                     onSave={edit ? this.editProject.bind(this) : this.createProject.bind(this)}/>
      </div>
    );
  }

  _generateProjectObject() {
    const {startDate, duration, selectedSkills, selectedProject, description, isFinished} = this.state;

    const durationMonthsForSave = duration === '' ? null : duration;

    let errors = {};
    let valid = true;
    let project = {};
    project.startDate = startDate ? formatDate(startDate) : (errors.startDate = ['Enter start date']) && (valid = false);
    project.description = description ? description : (errors.description = ['Your role on this project can not be empty, what you`ve done there?']) && (valid = false);
    project.projectId = selectedProject[0] ? selectedProject[0].id : (errors.project = ['Choose your project or create a new one']) && (valid = false);
    project.skillIds = selectedSkills.length !== 0 ? selectedSkills.map(skill => skill.id) : (errors.skills = ['Choose some skills']) && (valid = false);

    if (durationMonthsForSave) {
        project.durationMonths = durationMonthsForSave;
    } else if (isFinished) {
      if (!errors.durationMonths) {
        valid = false;
        errors.durationMonths = ['Enter valid positive number'];
      }
    }
    project.isFinished = isFinished;
    this.setState({errors});
    return valid ? project : null;
  }

  _generateSkillsListForDropdown = (skills) => {
    const groupedSkills = skills.reduce((acc, { id, name, category: { name: categoryName } }) => {
      acc[categoryName] = [ ...(acc[categoryName] || []), { key: id, text: name } ];
      return acc;
    }, {});
    return Object.keys(groupedSkills).reduce((acc, key) => {
      groupedSkills[key] = groupedSkills[key].sort(({ text: a }, { text: b }) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : b.toLowerCase() > a.toLowerCase() ? -1 : 0);
      return [
        ...acc,
        { key, text: key, itemType: DropdownMenuItemType.Header },
        ...groupedSkills[key],
      ]
    }, []);
  };

  _onDropdownChange = ({ key, selected }) => {
    const { skills } = this.props;
    const { selectedSkills } = this.state;
    if (selected) {
      const skill = skills.find(({ id }) => id === key);
      this.setState({ selectedSkills: [...selectedSkills, skill] })
    } else {
      this.setState({ selectedSkills: selectedSkills.filter(({id}) => id !== key) })
    }
  };

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

const mapStateToProps = ({ employee: user, skills = [], projects = [], newUserProjectLoading, createUserProjectErrors, skillCategories }) => {
  return { user, skills, projects, loading: newUserProjectLoading, errors: createUserProjectErrors, skillCategories };
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
