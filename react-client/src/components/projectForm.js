import React, {Component} from "react";
import {connect} from "react-redux";
import {BasePickerListBelow, DatePicker, Label, TagPicker} from "office-ui-fabric-react";
import {CreateNew} from "./createNewSuggestion";
import {NumberTextField} from "./numberTextField";
import {SelectedItem} from "./selectedItem";
import {SuggestionsItem} from "./suggestionsItem";

class DocumentPicker extends BasePickerListBelow {}

class ProjectFormComponent extends Component {

  projectsInput = React.createRef();
  skillsInput = React.createRef();

  state = {
    startDate: new Date(),
    duration: '',
    selectedSkills: [],
    selectedProject: []
  };

  _onFilterChange = (items) => {
    return (filterText) => {
      return filterText ? items.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0) : [];
    }
  };

  render() {
    const {projects, skills} = this.props;
    const {duration, startDate, selectedSkills, selectedProject} = this.state;
    return (
      <div>
        <Label>Name</Label>
        <TagPicker
          onChange={this._onChange(selectedProject, 'selectedProject')}
          componentRef={this.projectsInput}
          items={projects}
          getTextFromItem={({name}) => name}
          onResolveSuggestions={this._onFilterChange(projects)}
          inputProps={{
            placeholder: 'Enter a project name'
          }}
          pickerSuggestionsProps={{
            onRenderNoResultFound: () =>
              <CreateNew
                onClick={() => console.log('new')}
                text={'No such projects yet...'}
              />
          }}
          itemLimit={1}
        />
        <br/>
        <DatePicker
          value={startDate}
          placeholder="Select a date..."
          label="Start date"
          onSelectDate={(startDate) => {
            this.setState({startDate})
          }}
        />
        <br/>
        <NumberTextField
          label="Duration, month"
          value={duration}
          onChange={(duration) => this.setState({duration})}
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
                onClick={() => console.log('new')}
                text={'No such skills yet...'}
              />
          }}
        />
      </div>
    );
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

const mapStateToProps = ({user, skills, projects}) => {
  return {user, skills, projects};
};

export const ProjectsForm = connect(mapStateToProps)(ProjectFormComponent);