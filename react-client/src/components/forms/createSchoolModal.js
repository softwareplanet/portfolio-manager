import React, {Component} from "react";
import {ActionButton, Modal, PrimaryButton, Spinner, SpinnerSize, TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setSchoolModal} from "../../actions/modals";
import {createSchool} from "../../actions/schools";

class CreateSchool extends Component {

  state = {
    name: '',
    url: ''
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.opened) {
      this.setState({
        name: '',
        url: ''
      })
    }
  }

  render() {
    const {opened, closeModal, loading, createSchool, errors} = this.props;
    const {name, description} = this.state;
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Create new school</span>
        <form onSubmit={(e) => {
          e.preventDefault();
          createSchool({name, description});
        }}>
          <TextField label="Name:" value={name}
                     onChange={(e) => this.setState({name: e.target.value})}
                     isRequired={true}
                     errorMessage={(errors.name || []).join('<br/>')}
                     placeholder="inCamp S8"
          />
          <TextField label="Description:" value={description}
                     onChange={(e) => this.setState({description: e.target.value})}
                     isRequired={true}
                     errorMessage={(errors.description || []).join('<br/>')}
                     placeholder="Detailed description of this school/course..."
                     multiline rows={4}
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

const mapStateToProps = ({schoolModal, newSchoolLoading, createSchoolErrors}) => {
  return {
    opened: schoolModal,
    loading: newSchoolLoading,
    errors: createSchoolErrors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setSchoolModal(false)),
    createSchool: (school) => dispatch(createSchool(school))
  };
};
export const CreateSchoolModal = connect(mapStateToProps, mapDispatchToProps)(CreateSchool);