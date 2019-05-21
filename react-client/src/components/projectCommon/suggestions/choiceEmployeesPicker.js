import * as React from "react";
import {IBasePickerSuggestionsProps, ListPeoplePicker} from "office-ui-fabric-react";
import {connect} from "react-redux";

const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    mostRecentlyUsedHeaderText: 'Suggested Contacts',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading',
    showRemoveButtons: true,
    suggestionsAvailableAlertText: 'People Picker Suggestions available',
    suggestionsContainerAriaLabel: 'Suggested contacts'
};

const people = [{text: 'Oleksii Bondar', secondaryText: 'Software Developer'}, {
    text: 'Lex Botcher',
    secondaryText: 'Software Developer'
}];

class choiceEmployees extends React.Component {

    constructor(props: {}) {
        super(props);

        this.state = {
            currentPicker: 0,
            delayResults: false,
            peopleList: people,
            currentSelectedItems: [],
            isPickerDisabled: false
        };
    }

    render() {
        return (
            <ListPeoplePicker
                onResolveSuggestions={this._onFilterChanged}
                onEmptyInputFocus={this._returnMostRecentlyUsed}
                getTextFromItem={this._getTextFromItem}
                className={'ms-PeoplePicker'}
                pickerSuggestionsProps={suggestionProps}
                key={'list'}
                onRemoveSuggestion={this._onRemoveSuggestion}
                onValidateInput={this._validateInput}
                inputProps={{
                    onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
                    onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
                    'aria-label': 'People Picker'
                }}
                componentRef={this._picker}
                resolveDelay={300}
                disabled={this.state.isPickerDisabled}
            />
        );
    }

    _onRemoveSuggestion = (item): void => {
        const {peopleList, mostRecentlyUsed: mruState} = this.state;
        const indexPeopleList: number = peopleList.indexOf(item);
        const indexMostRecentlyUsed: number = mruState.indexOf(item);

        if (indexPeopleList >= 0) {
            const newPeople: any[] = peopleList.slice(0, indexPeopleList).concat(peopleList.slice(indexPeopleList + 1));
            this.setState({peopleList: newPeople});
        }

        if (indexMostRecentlyUsed >= 0) {
            const newSuggestedPeople: [] = mruState
                .slice(0, indexMostRecentlyUsed)
                .concat(mruState.slice(indexMostRecentlyUsed + 1));
            this.setState({mostRecentlyUsed: newSuggestedPeople});
        }
    };

    _onFilterChanged = (
        filterText,
        currentPersonas,
        limitResults) => {
        if (filterText) {
            let filteredPersonas: [] = this._filterPersonasByText(filterText);

            filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
            filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
            return this._filterPromise(filteredPersonas);
        } else {
            return [];
        }
    };

    _returnMostRecentlyUsed = (currentPersonas) => {
        let mostRecentlyUsed = [{text: 'Oleksii Bondar', secondaryText: 'Software Developer'}];
        mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
        return this._filterPromise(mostRecentlyUsed);
    };


    _filterPromise(personasToReturn): any[] | Promise<any[]> {
        return personasToReturn;
    }

    _listContainsPersona(persona, personas) {
        if (!personas || !personas.length || personas.length === 0) {
            return false;
        }
        return personas.filter(item => item.text === persona.text).length > 0;
    }


    _filterPersonasByText(filterText: string): any[] {
        return this.state.peopleList.filter(item => this._doesTextStartWith(item.text, filterText));
    }

    _doesTextStartWith(text: string, filterText: string): boolean {
        return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
    }

    _removeDuplicates(personas: [], possibleDupes: []) {
        return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
    }
}

export const ChoiceEmployeesPicker = connect()(choiceEmployees);