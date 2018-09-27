import React, {Component} from 'react';
import {removeUserErrors, updateUser} from "../../actions/user";
import connect from "react-redux/es/connect/connect";
import {Checkbox, DatePicker, TextField} from "office-ui-fabric-react";
import {PanelFooter} from "../projectCommon/panelFooter";
import {formatDate} from "../../service/utils";
import {LittleBr} from "..";

class UserFormComponent extends Component {

  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    username: this.props.username,
    position: this.props.position,
    dob: new Date(this.props.dob),
    careerStartDate: new Date(this.props.careerStartDate),
    email: this.props.email,
    description: this.props.description,
    employeeIsStaff: this.props.employeeIsStaff
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const {editUserState} = nextProps;
    if (editUserState) {
      this._onClose();
    }
  }

  render() {
    const {firstName, lastName, dob, username, email, description, position, careerStartDate, employeeIsStaff} = this.state;
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
        <LittleBr/>
        <TextField label="Last name:"
                   value={lastName}
                   onChange={(e) => this.setState({lastName: e.target.value})}
                   errorMessage={(errors.lastName || []).join('<br/>')}
                   placeholder="Last name"
                   required
        />
        <LittleBr/>
        <DatePicker
          value={dob}
          placeholder="Select a date..."
          label="Birthday:"
          onSelectDate={(dob) => {
            this.setState({dob})
          }}
          isRequired={true}
        />
        <LittleBr/>
        <DatePicker
          value={careerStartDate}
          placeholder="Select a date..."
          label="Carrier start date:"
          onSelectDate={(careerStartDate) => {
            this.setState({careerStartDate})
          }}
          isRequired={true}
        />
        <LittleBr/>
        <TextField label="Username:" value={username}
                   onChange={(e) => this.setState({username: e.target.value})}
                   errorMessage={(errors.username || []).join('<br/>')}
                   required
                   placeholder="Username"
        />
        <LittleBr/>
        <TextField label="Position:" value={position}
                   onChange={(e) => this.setState({position: e.target.value})}
                   errorMessage={(errors.position || []).join('<br/>')}
                   required
                   placeholder="Software Developer"
        />
        <LittleBr/>
        <TextField label="E-Mail:" value={email}
                   onChange={(e) => this.setState({email: e.target.value})}
                   errorMessage={(errors.email || []).join('<br/>')}
                   type="email"
                   placeholder="example@mail.com"
        />
        <LittleBr/>
        {isStaff &&
        <Checkbox
          label="Admin"
          checked={employeeIsStaff}
          onChange={(e, checked) => this.setState({employeeIsStaff: checked})}
        />
        }
        <LittleBr/>
        {isStaff &&
        <TextField label="Summary:" value={description}
                   onChange={(e) => this.setState({description: e.target.value})}
                   errorMessage={(errors.description || []).join('<br/>')}
                   type="email"
                   placeholder="Your summary..."
                   multiline
                   rows={12}
                   resizable={false}
        />}
        <PanelFooter onClose={this._onClose.bind(this)} loading={loading}
                     onSave={() => this.props.updateUser(id, {
                       ...this.state,
                       dob: formatDate(dob),
                       careerStartDate: formatDate(careerStartDate),
                       isStaff: employeeIsStaff
                     }, user.id)}/>
      </form>
    );
  }

  _onClose() {
    this.props.removeErrors();
    this.props.onClose();
  }
}

const mapStateToProps = ({user, editUserErrors, editUserLoading, editUserState, isStaff},
                         {employee: {id, firstName, lastName, dob, username, email, description, position, careerStartDate, isStaff: employeeIsStaff}}) => {
  return {
    user,
    id,
    firstName,
    lastName,
    dob,
    careerStartDate,
    username,
    position,
    email,
    description,
    employeeIsStaff,
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