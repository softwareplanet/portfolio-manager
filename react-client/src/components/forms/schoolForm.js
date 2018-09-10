import React, {Component} from "react";
import {connect} from "react-redux";
import {DatePicker, Label, TagPicker} from "office-ui-fabric-react";
import {CreateNew} from "../projectCommon/suggestions/createNewSuggestion";
import {setSchoolModal} from "../../actions/modals";
import {PanelFooter} from "../projectCommon/panelFooter";
import {ErrorLabel} from "../common/errorLabel";
import {createUserSchool, editUserSchool, removeSchoolErrors} from "../../actions/userSchools";
import {NumberTextField} from "../common/numberTextField";
import {formatDate} from "../../service/utils";

class SchoolFormComponent extends Component {

  state = {
    startDate: new Date(),
    selectedSchool: [],
    edit: false,
    errors: [],
    durationYears: ''
  };

  _onFilterChange = (items) => {
    return (filterText) => {
      return filterText ? items.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) : [];
    }
  };

  createSchool = () => {
    const {user, createUserSchool} = this.props;
    const school = this._generateSchoolObject();
    if (school)
      createUserSchool(user.id, school);
  };

  editSchool = () => {
    const {user, editUserSchool, userSchool} = this.props;
    const school = this._generateSchoolObject();
    if (school)
      editUserSchool(user.id, {...school, id: userSchool.id});
  };

  componentWillMount() {
    const {userSchool} = this.props;
    if (userSchool) {
      const {school, startDate, durationYears} = userSchool;
      const schoolToEdit = {
        selectedSchool: [school],
        startDate: new Date(startDate),
        durationYears
      };
      this.setState({...this.state, ...schoolToEdit, edit: true})
    }
  }

  render() {
    const {schools, createSchool, loading, errors} = this.props;
    const {selectedSchool, edit, startDate, durationYears} = this.state;
    return (
      <div>
        <Label>Name</Label>
        <TagPicker
          onChange={this._onChange(selectedSchool, 'selectedSchool')}
          items={schools}
          getTextFromItem={({name}) => name}
          onResolveSuggestions={this._onFilterChange(schools)}
          selectedItems={selectedSchool}
          disabled={edit}
          inputProps={{
            placeholder: 'Enter a school name',
          }}
          pickerSuggestionsProps={{
            onRenderNoResultFound: () =>
              <CreateNew
                onClick={() => createSchool()}
                text={'No such schools yet...'}
              />
          }}
          itemLimit={1}
        />
        <ErrorLabel title={(this.state.errors.school || errors.non_field_errors || []).join('<br/>')}/>
        <br/>
        <NumberTextField
          label="Duration, year"
          value={durationYears}
          onChange={(durationYears) => this.setState({durationYears})}
          errorMessage={(errors.durationYears || []).join('<br/>')}
        />
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
        <PanelFooter onClose={this._onClose.bind(this)} loading={loading}
                     onSave={edit ? this.editSchool.bind(this) : this.createSchool.bind(this)}/>
      </div>
    );
  }

  _onClose() {
    this.props.dispatch(removeSchoolErrors());
    this.props.onClose();
  }

  _generateSchoolObject() {
    const {description, startDate, durationYears, selectedSchool} = this.state;
    let valid = true, errors = {}, school = {};
    school.startDate = formatDate(startDate);
    school.durationYears = durationYears;
    school.schoolId = selectedSchool.length !== 0 ? selectedSchool[0].id : (errors.school = ['Choose school']) && (valid = false);
    school.description = description;
    this.setState({errors});
    return valid ? school : null;
  }

  _onChange(selectedItems, name) {
    return (items) => {
      const itemsWithoutDuplicates = items.filter((item, pos, self) => self.indexOf(item) === pos);
      this.setState(SchoolFormComponent._generateStateObject(name, itemsWithoutDuplicates));
    };
  }

  static _generateStateObject(fieldName, fieldValue) {
    const state = {};
    state[fieldName] = fieldValue;
    return state;
  }
}

const mapStateToProps = ({employee: user, schools = [], newUserSchoolLoading, createUserSchoolErrors}) => {
  return {user, schools, loading: newUserSchoolLoading, errors: createUserSchoolErrors};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createSchool: () => dispatch(setSchoolModal(true)),
    createUserSchool: (userId, school) => dispatch(createUserSchool(userId, school)),
    editUserSchool: (userId, school) => dispatch(editUserSchool(userId, school)),
    dispatch
  };
};

export const SchoolsForm = connect(mapStateToProps, mapDispatchToProps)(SchoolFormComponent);