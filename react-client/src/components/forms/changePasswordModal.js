import React, {Component} from "react";
import {ActionButton, Modal, PrimaryButton, Spinner, SpinnerSize, TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setPasswordModal} from "../../actions/modals";
import {changePassword, updateUser} from "../../actions/user";

class ChangePassword extends Component {

  initialState = {
    oldPassword: '',
    newPassword: '',
  };

  state = {...this.initialState};

  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.opened) {
      this.setState({...this.initialState});
    }
  }

  render() {
    const {opened, closeModal, loading, errors, isStaff, changePassword, updateEmployeePassword, employeeId, userId} = this.props;
    const {oldPassword, newPassword} = this.state;
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Change password</span>
        <form
          style={{width: 13 + 'rem'}}
          onSubmit={(e) => {
            e.preventDefault();
            (isStaff && userId !== employeeId) ?
              updateEmployeePassword(employeeId, newPassword, userId) :
              changePassword({old_password: oldPassword, new_password: newPassword});
          }}>
          {!(isStaff && userId !== employeeId) &&
          <TextField
            label="Old password:" value={oldPassword}
            onChange={(e) => this.setState({oldPassword: e.target.value})}
            isRequired={true}
            type="password"
            errorMessage={(errors.old_password || []).join('\n')}
            placeholder="********"
            required
          />}
          <TextField
            label="New password:" value={newPassword}
            onChange={(e) => this.setState({newPassword: e.target.value})}
            isRequired={true}
            type="password"
            errorMessage={(errors.new_password || []).join('\n')}
            placeholder="********"
            required
          />
          <div className={'button-group-right'}>
            <div>
              <ActionButton
                iconProps={{iconName: 'Cancel'}}
                className={'register-button'}
                onClick={closeModal}>
                Cancel
              </ActionButton>
            </div>
            <PrimaryButton type="submit">
              {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Change'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = ({passwordModal, editUserLoading, editUserErrors, isStaff, user}) => {
  return {
    opened: passwordModal,
    loading: editUserLoading,
    errors: editUserErrors,
    userId: user && user.id,
    isStaff
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setPasswordModal(false)),
    updateEmployeePassword: (employeeId, password, currentUserId) => dispatch(updateUser(employeeId, {password}, currentUserId)),
    changePassword: (project) => dispatch(changePassword(project)),
  };
};
export const ChangePasswordModal = connect(mapStateToProps, mapDispatchToProps)(ChangePassword);