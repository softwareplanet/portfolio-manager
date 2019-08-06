import React, {Component} from "react";
import {ActionButton, Modal, PrimaryButton, Spinner, SpinnerSize} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setTeamModal} from "../../actions/modals";
import {ChoiceEmployeesPicker} from "../projectCommon/suggestions/choiceEmployeesPicker";
import {createTeamMembers} from "../../actions/userProjects";

class AddTeam extends Component {

  initialState = {
    selectedEmployees: [],
  };

  state = {...this.initialState};

  componentWillReceiveProps(nextProps) {
    if (!nextProps.opened) {
      this.setState({...this.initialState});
    }
    if (nextProps.project && !nextProps.loading) {
      this.setState({...nextProps.project, startDate: new Date(nextProps.project.startDate)});
    }
    if (!nextProps.project) this.setState({...this.initialState});
  }

  onTeamChange(selectedEmployees) {
    this.setState({selectedEmployees});
  }

  saveTeam() {
    const {selectedEmployees} = this.state;
    const {createTeamMembers, project} = this.props;
    createTeamMembers(selectedEmployees, {
      description: ' ',
      projectId: project.id,
      durationMonths: project.durationMonths,
      startDate: project.startDate,
      skillIds: [],
      isFinished: project.isFinished,
    });
  }

  render() {
    const {opened, closeModal, loading, employees} = this.props;
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Add team to the project</span>
        <ChoiceEmployeesPicker employees={employees} onChange={this.onTeamChange.bind(this)}/>
        <div className={'button-group-right'}>
          <div>
            <ActionButton
              iconProps={{iconName: 'Cancel'}}
              className={'register-button'}
              onClick={closeModal}>
              Cancel
            </ActionButton>
          </div>
          <PrimaryButton onClick={this.saveTeam.bind(this)} disabled={this.state.selectedEmployees < 1}>
            {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Add'}
          </PrimaryButton>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({teamModal, createTeamMembersLoading, createProjectErrors}) => {
  return {
    opened: teamModal,
    loading: createTeamMembersLoading,
    errors: createProjectErrors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setTeamModal(false)),
    createTeamMembers: (users, project) => dispatch(createTeamMembers(users, project)),
  };
};
export const AddTeamModal = connect(mapStateToProps, mapDispatchToProps)(AddTeam);