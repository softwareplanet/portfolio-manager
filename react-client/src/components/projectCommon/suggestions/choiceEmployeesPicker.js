import * as React from "react";
import {ListPeoplePicker} from "office-ui-fabric-react";
import axios from 'axios';

const suggestionProps = {
  suggestionsHeaderText: 'Suggested Employees',
  mostRecentlyUsedHeaderText: 'Suggested Employees',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: false,
};


export class ChoiceEmployeesPicker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPicker: 0,
      delayResults: false,
      currentSelectedItems: [],
      isPickerDisabled: false
    };
  }

  componentDidMount() {
    const {employees} = this.props;
    if (employees) {
      let people = employees.map(e => {
        return {text: `${e.firstName} ${e.lastName}`, secondaryText: e.position, id: e.id, user: e, imageUrl: axios.defaults.baseURL + e.image};
      });
      this.setState({peopleList: people});
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.employees) {
      this.setState({
        peopleList: nextProps.employees.map(e => ({
            text: `${e.firstName} ${e.lastName}`,
            secondaryText: e.position,
          id: e.id,
            user: e,
          })
        )
      });
    }
  }

  render() {
    return (
      <ListPeoplePicker
        onResolveSuggestions={this._onFilterChanged}
        onEmptyInputFocus={this._returnMostRecentlyUsed}
        getTextFromItem={this._getTextFromItem}
        className={'ms-PeoplePicker'}
        pickerSuggestionsProps={suggestionProps}
        onRemoveSuggestion={this._onRemoveSuggestion}
        onValidateInput={this._validateInput}
        componentRef={this._picker}
        resolveDelay={300}
        disabled={this.state.isPickerDisabled}
        onChange={this._onChange}
      />
    );
  }

  _onRemoveSuggestion = (item) => {
    const {peopleList, mostRecentlyUsed: mruState} = this.state;
    const indexPeopleList = peopleList.indexOf(item);
    const indexMostRecentlyUsed = mruState.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople = peopleList.slice(0, indexPeopleList).concat(peopleList.slice(indexPeopleList + 1));
      this.setState({peopleList: newPeople});
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople = mruState
        .slice(0, indexMostRecentlyUsed)
        .concat(mruState.slice(indexMostRecentlyUsed + 1));
      this.setState({mostRecentlyUsed: newSuggestedPeople});
    }
  };

  _onChange = (items) => {
    this.props.onChange(items);
  };

  _onFilterChanged = (
    filterText,
    currentPersons) => {
    if (filterText) {
      let filteredPersons = this._filterPersonsByText(filterText);
      filteredPersons = this._removeDuplicates(filteredPersons, currentPersons);
      filteredPersons = filteredPersons.slice(0, 5);
      console.log(this.state);
      return filteredPersons;
    } else {
      return [];
    }
  };

  _returnMostRecentlyUsed = (currentPersons) => {
    let mostRecentlyUsed = this.state.peopleList ? this.state.peopleList.slice(0, 5) : [];
    mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersons);
    return mostRecentlyUsed;
  };

  _listContainsPersona(persona, persons) {
    if (!persons || !persons.length || persons.length === 0) {
      return false;
    }
    return persons.filter(item => item.text === persona.text).length > 0;
  }


  _filterPersonsByText(filterText) {
    return this.state.peopleList.filter(item => this._doesTextStartWith(item.text, filterText));
  }

  _doesTextStartWith(text, filterText) {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  _removeDuplicates(persons, possibleDupes) {
    return persons.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }


}