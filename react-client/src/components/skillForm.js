import React, {Component} from "react";
import {connect} from "react-redux";
import {Label, Slider, TagPicker, TextField} from "office-ui-fabric-react";
import {CreateNew} from "./createNewSuggestion";
import {setSkillModal} from "../actions/modals";
import {PanelFooter} from "./panelFooter";
import {ErrorLabel} from "./errorLabel";
import {createUserSkill, editUserSkill} from "../actions/userSkills";

class SkillFormComponent extends Component {

  state = {
    description: '',
    level: 3,
    selectedSkill: [],
    edit: false,
    errors: []
  };

  skillDescriptions = ['Master', 'Great', 'Good', 'Normal', 'Lower than normal'];

  _onFilterChange = (items) => {
    return (filterText) => {
      return filterText ? items.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0) : [];
    }
  };

  createSkill = () => {
    const {user, createUserSkill} = this.props;
    const skill = this._generateSkillObject();
    if (skill)
      createUserSkill(user.id, skill);
  };

  editSkill = () => {
    const {user, editUserSkill, userSkill} = this.props;
    const skill = this._generateSkillObject();
    if (skill)
      editUserSkill(user.id, {...skill, id: userSkill.id});
  };

  componentWillMount() {
    const {userSkill} = this.props;
    if (userSkill) {
      const {skill, description, level} = userSkill;
      const skillToEdit = {
        selectedSkill: [skill],
        description, level
      };
      this.setState({...this.state, ...skillToEdit, edit: true})
    }
  }

  _renderSkillLevelLabel = (levelDescription) => (
    <div className={'skill-level-description'}><Label>{levelDescription}</Label></div>
  );

  render() {
    const {skills, createSkill, onClose, loading, errors} = this.props;
    const {selectedSkill, edit, description, level} = this.state;
    return (
      <div>
        <Label>Name</Label>
        <TagPicker
          onChange={this._onChange(selectedSkill, 'selectedSkill')}
          items={skills}
          getTextFromItem={({name}) => name}
          onResolveSuggestions={this._onFilterChange(skills)}
          selectedItems={selectedSkill}
          disabled={edit}
          inputProps={{
            placeholder: 'Enter a skill name',
          }}
          pickerSuggestionsProps={{
            onRenderNoResultFound: () =>
              <CreateNew
                onClick={() => createSkill()}
                text={'No such skills yet...'}
              />
          }}
          itemLimit={1}
        />
        <ErrorLabel title={(errors.skill || []).join('<br/>')}/>
        <br/>
        <TextField
          value={description}
          multiline
          onChange={(e) => this.setState({description: e.target.value})}
          label={"Description"}
        />
        <ErrorLabel title={(errors.description || []).join('<br/>')}/>
        <br/>
        <Label>Skill level</Label>
        <div className={'skill-slider-container'}>
          <div className={'vertical-slider'}>
            <Slider
              min={1}
              max={5}
              step={1}
              value={level}
              vertical={true}
              onChange={(level) => this.setState({level})}
            />
          </div>
          <div className={'skill-level-description-container'}>
            {this.skillDescriptions.map(this._renderSkillLevelLabel)}
          </div>
        </div>
        <ErrorLabel title={(errors.level || []).join('<br/>')}/>
        <br/>
        <ErrorLabel title={(errors.non_field_errors || []).join('<br/>')}/>
        <PanelFooter onClose={onClose} loading={loading}
                     onSave={edit ? this.editSkill.bind(this) : this.createSkill.bind(this)}/>
      </div>
    );
  }

  _generateSkillObject() {
    const {description, level, selectedSkill} = this.state;
    let valid = true, errors = {}, skill = {};

    skill.skillId = selectedSkill.length !== 0 ? selectedSkill[0].id : (errors.skills = ['Choose skill']) && (valid = false);
    skill.level = level;
    skill.description = description;
    this.setState({errors});
    return valid ? skill : null;
  }

  _onChange(selectedItems, name) {
    return (items) => {
      const itemsWithoutDuplicates = items.filter((item, pos, self) => self.indexOf(item) === pos);
      this.setState(SkillFormComponent._generateStateObject(name, itemsWithoutDuplicates));
    };
  }

  static _generateStateObject(fieldName, fieldValue) {
    const state = {};
    state[fieldName] = fieldValue;
    return state;
  }
}

const mapStateToProps = ({user, skills, newUserSkillLoading, createUserSkillErrors}) => {
  return {user, skills, loading: newUserSkillLoading, errors: createUserSkillErrors};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createSkill: () => dispatch(setSkillModal(true)),
    createUserSkill: (userId, skill) => dispatch(createUserSkill(userId, skill)),
    editUserSkill: (userId, skill) => dispatch(editUserSkill(userId, skill)),
  };
};

export const SkillsForm = connect(mapStateToProps, mapDispatchToProps)(SkillFormComponent);