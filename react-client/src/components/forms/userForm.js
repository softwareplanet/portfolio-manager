import React, {Component} from 'react';
import {removeUserErrors, updateUser} from "../../actions/user";
import connect from "react-redux/es/connect/connect";
import {DatePicker, TextField} from "office-ui-fabric-react";
import {PanelFooter} from "../projectCommon/panelFooter";
import {formatDate} from "../../service/utils";

class UserFormComponent extends Component {

  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    username: this.props.username,
    dob: new Date(this.props.dob),
    email: this.props.email,
    description: this.props.description
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const {editUserState} = nextProps;
    if (editUserState) {
      this._onClose();
    }
  }

  render() {
    const {firstName, lastName, dob, username, email, description} = this.state;
    const {errors, loading, id, isStaff, user} = this.props;
    return (
      <form className={'profile-edit-form'}>
        <TextField label="First name:"
                   value={firstName}
                   onChange={(e) => this.setState({firstName: e.target.value})}
                   errorMessage={(errors.firstName || []).join('<br/>')}
                   placeholder="First name"
                   required
        />
        <br/>
        <TextField label="Last name:"
                   value={lastName}
                   onChange={(e) => this.setState({lastName: e.target.value})}
                   errorMessage={(errors.lastName || []).join('<br/>')}
                   placeholder="Last name"
                   required
        />
        <br/>
        <DatePicker
          value={dob}
          placeholder="Select a date..."
          label="Birthday:"
          onSelectDate={(dob) => {
            this.setState({dob})
          }}
          isRequired={true}
        />
        <br/>
        <TextField label="Username:" value={username}
                   onChange={(e) => this.setState({username: e.target.value})}
                   errorMessage={(errors.username || []).join('<br/>')}
                   required
                   placeholder="Username"
        />
        <br/>
        <TextField label="E-Mail:" value={email}
                   onChange={(e) => this.setState({email: e.target.value})}
                   errorMessage={(errors.email || []).join('<br/>')}
                   type="email"
                   placeholder="example@mail.com"
        />
        <br/>
        {isStaff && id !== user.id &&
        <TextField label="Summary:" value={description}
                   onChange={(e) => this.setState({description: e.target.value})}
                   errorMessage={(errors.description || []).join('<br/>')}
                   type="email"
                   placeholder="Your summary..."
                   multiline
                   rows={16}
                   resizable={false}
        />}
        <PanelFooter onClose={this._onClose.bind(this)} loading={loading}
                     onSave={() => this.props.updateUser(id, {...this.state, dob: formatDate(dob)}, user.id)}/>
      </form>
    );
  }

  _onClose() {
    this.props.removeErrors();
    this.props.onClose();
  }
}

const mapStateToProps = ({user, editUserErrors, editUserLoading, editUserState, isStaff}, {employee: {id, firstName, lastName, dob, username, email, description}}) => {
  return {
    user,
    id,
    firstName,
    lastName,
    dob,
    username,
    email,
    description,
    editUserState,
    errors: editUserErrors,
    loading: editUserLoading,
    isStaff
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (userId, user, currentUserId) => dispatch(updateUser(userId, user, currentUserId)),
    removeErrors: () => dispatch(removeUserErrors())
  };
};

export const UserForm = connect(mapStateToProps, mapDispatchToProps)(UserFormComponent);