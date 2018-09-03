import React, {Component} from "react";
import {ActionButton, DatePicker, Modal, PrimaryButton, Spinner, SpinnerSize, TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setProjectModal} from "../actions/modals";
import {createProject} from "../actions/projects";
import {NumberTextField} from "./numberTextField";
import {formatDate} from "../service/utils";

class CreateProject extends Component {

  initialState = {
    name: '',
    url: '',
    description: '',
    startDate: new Date(),
    durationMonths: ''
  };

  state = {...this.initialState};

  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.opened) {
      this.setState({...this.initialState})
    }
  }

  render() {
    const {opened, closeModal, loading, errors, createProject} = this.props;
    const {name, url, description, durationMonths, startDate} = this.state;
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Create new skill</span>
        <form onSubmit={(e) => {
          e.preventDefault();
          createProject({name, url, description, durationMonths, startDate: formatDate(startDate)});
        }}>
          <TextField label="Name:" value={name}
                     onChange={(e) => this.setState({name: e.target.value})}
                     isRequired={true}
                     errorMessage={(errors.name || []).join('<br/>')}
                     placeholder="Project name..."
                     required
          />
          <TextField label="Description:" value={description}
                     onChange={(e) => this.setState({description: e.target.value})}
                     isRequired={true}
                     errorMessage={(errors.description || []).join('<br/>')}
                     placeholder="Detailed description of this project..."
                     multiline rows={4}
          />
          <DatePicker
            value={startDate}
            placeholder="Select a date..."
            label="Start date:"
            onSelectDate={(startDate) => {
              this.setState({startDate})
            }}
            errorMessage={(errors.startDate || []).join('<br/>')}
            required
          />
          <NumberTextField
            label="Duration, month:"
            value={durationMonths}
            onChange={(durationMonths) => this.setState({durationMonths})}
            errorMessage={(errors.durationMonths || []).join('<br/>')}
            required
          />
          <TextField label="Url:" value={url}
                     onChange={(e) => this.setState({url: e.target.value})}
                     placeholder="Link to technology page"
                     errorMessage={(errors.url || errors.non_field_errors || []).join('<br/>')}
                     isRequired={true}
          />
          <div className={'button-group-right'}>
            <div>
              <ActionButton iconProps={{iconName: 'Cancel'}} className={'register-button'}
                            onClick={closeModal}>
                Cancel
              </ActionButton>
            </div>
            <PrimaryButton type="submit">
              {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Create'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = ({projectModal, newProjectLoading, createProjectErrors}) => {
  return {
    opened: projectModal,
    loading: newProjectLoading,
    errors: createProjectErrors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setProjectModal(false)),
    createProject: (project) => dispatch(createProject(project))
  };
};
export const CreateProjectModal = connect(mapStateToProps, mapDispatchToProps)(CreateProject);