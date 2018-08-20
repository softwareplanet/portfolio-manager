import React, {Component} from 'react';
import './register.css';
import {ActionButton, DatePicker, PrimaryButton, Spinner, SpinnerSize, TextField} from 'office-ui-fabric-react';
import axios from "axios";

export class Register extends Component {

  state = {
    username: '',
    password: '',
    birthday: new Date(),
    firstName: '',
    lastName: '',
    email: '',
    errors: {},
    loading: false
  };
  redirectToLogin = () => this.props.history.push('/');

  handleRegistration() {
    this.setState({loading: true});
    const {username, email, password, firstName, lastName, birthday} = this.state;
    axios.post('/api/v1/employee', {
      username, email, password, firstName, lastName, dob: birthday.toISOString().split('T')[0]
    }).then(res => {
    }).catch(errors => {
      this.setState({loading: false});
      this.setState({errors: errors.response.data.errors || {non_field_errors: [errors.message]}});
      console.log(this.state.errors);
    })
  }

  render() {
    const {username, email, password, errors, loading, firstName, lastName, birthday} = this.state;
    return (
      <div className={'centered'}>
        <div className={'login-container'}>
          <form onSubmit={(e) => {
            e.preventDefault();
            this.handleRegistration(username, password);
          }}>
            <TextField label="First name:" value={firstName}
                       onChange={(e) => this.setState({firstName: e.target.value})}
                       errorMessage={(errors.firstName || []).join('<br>')}
                       required
            />
            <TextField label="Last Name:" value={lastName}
                       onChange={(e) => this.setState({lastName: e.target.value})}
                       errorMessage={(errors.lastName || []).join('<br>')}
                       required
            />
            <DatePicker
              value={birthday}
              placeholder="Select a date..."
              label="Birthday:"
              onSelectDate={(birthday) => {
                this.setState({birthday})
              }}
              isRequired={true}
            />
            <TextField label="Username:" value={username}
                       onChange={(e) => this.setState({username: e.target.value})}
                       errorMessage={(errors.username || []).join('<br>')}
                       required
            />
            <TextField label="E-Mail:" value={email}
                       onChange={(e) => this.setState({email: e.target.value})}
                       errorMessage={(errors.email || []).join('<br>')}
                       type="email"
            />
            <TextField label="Password:" value={password}
                       onChange={(e) => this.setState({password: e.target.value})}
                       type="password"
                       errorMessage={(errors.password || errors.non_field_errors || []).join('<br>')}
                       required
            />
            <div className={'button-group-right'}>
              <div>
                <ActionButton className={'register-button'} onClick={this.redirectToLogin}>
                  Cancel
                </ActionButton>
              </div>
              <PrimaryButton type="submit">
                {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Register'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}