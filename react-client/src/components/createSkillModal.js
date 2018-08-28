import React, {Component} from "react";
import {
  ActionButton,
  Modal,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  TextField
} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setSkillModal} from "../actions/modals";
import {createSkill} from "../actions/skills";

class CreateSkill extends Component{

  state = {
    name: '',
    url: ''
  };

  render() {
    const {opened, closeModal, loading, createSkill} = this.props;
    const {name, url} = this.state;
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
          createSkill({name, url});
        }}>
          <TextField label="Name:" value={name}
                     onChange={(e) => this.setState({name: e.target.value})}
                     isRequired={true}
                     placeholder="e.i. JavaScript"
          />
          <TextField label="Url:" value={url}
                     onChange={(e) => this.setState({url: e.target.value})}
                     placeholder="Link to technology page"
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

const mapStateToProps = ({skillModal, newSkillLoading}) => {
  return {
    opened: skillModal,
    loading: newSkillLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setSkillModal(false)),
    createSkill: (skill) => dispatch(createSkill(skill))
  };
};
export const CreateSkillModal = connect(mapStateToProps, mapDispatchToProps)(CreateSkill);