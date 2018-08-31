import React, {Component} from 'react';
import {updateUser} from "../actions/user";
import connect from "react-redux/es/connect/connect";
import {TextField} from "office-ui-fabric-react";

class UserNameFormComponent extends Component {

  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName
  };

  render() {
    const {firstName, lastName} = this.state;
    const {errors} = this.props;
    return (
      <form onSubmit={(e) => {
        const {afterSubmit, updateUser} = this.props;
        e.preventDefault();
        updateUser(this.state);
        afterSubmit()
      }}
            className={'profile-edit-form'}
      >
        <TextField value={firstName}
                   onChange={(e) => this.setState({firstName: e.target.value})}
                   errorMessage={(errors.firstName || []).join('<br/>')}
                   placeholder="First name"
        />
        <TextField value={lastName}
                   onChange={(e) => this.setState({lastName: e.target.value})}
                   errorMessage={(errors.lastName || []).join('<br/>')}
                   placeholder="Bar"
        />
      </form>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user, errors: {}};
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export const UserNameForm = connect(mapStateToProps, mapDispatchToProps)(UserNameFormComponent);