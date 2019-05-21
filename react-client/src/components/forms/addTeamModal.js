import React, {Component} from "react";
import {ActionButton, Modal, PrimaryButton, Spinner, SpinnerSize} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setTeamModal} from "../../actions/modals";
import axios from 'axios';
import {applyMiddleware as dispatch} from "redux";
import {ChoiceEmployeesPicker} from "../projectCommon/suggestions/choiceEmployeesPicker";
import {getEmployees} from "../../actions/user";

class AddTeam extends Component {

  initialState = {
    selectedEmployees: [],
  };

  state = {...this.initialState};

  componentDidMount() {
    getEmployees();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.opened) {
      this.setState({...this.initialState});
    }
    if (nextProps.project && !nextProps.loading) {
      this.setState({...nextProps.project, startDate: new Date(nextProps.project.startDate)});
    }
    if (!nextProps.project) this.setState({...this.initialState});


  }

  render() {
    const {opened, closeModal, loading} = this.props;
    const {selectedEmployees, employees} = this.state;
    console.log(this.state);
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Add team to the project</span>
        <ChoiceEmployeesPicker employee={employees}/>
        <div className={'button-group-right'}>
          <div>
            <ActionButton
              iconProps={{iconName: 'Cancel'}}
              className={'register-button'}
              onClick={closeModal}>
              Cancel
            </ActionButton>
          </div>
          <PrimaryButton>
            {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Add'}
          </PrimaryButton>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({teamModal, newProjectLoading, createProjectErrors}) => {
  return {
    opened: teamModal,
    loading: newProjectLoading,
    errors: createProjectErrors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEmployees: () => dispatch(getEmployees()),
    closeModal: () => dispatch(setTeamModal(false)),
  };
};
export const AddTeamModal = connect(mapStateToProps, mapDispatchToProps)(AddTeam);