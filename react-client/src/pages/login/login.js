import React, {Component} from 'react';
import './login.css';
import {ActionButton, PrimaryButton, Spinner, SpinnerSize, TextField} from 'office-ui-fabric-react';
import {AuthService} from "../../service/authService";

export class Login extends Component {

  state = {
    username: '',
    password: '',
    errors: {},
    loading: false
  };

  handleAuthentication(username, password) {
    this.setState({loading: true});
    AuthService.logIn(username, password)
      .then(res => {
        this.setState({loading: false, errors: {}});
        this.props.history.push('/');
      })
      .catch(errors => {
      this.setState({loading: false});
        this.setState({errors: errors.response.data || [errors.message]});
      })
  }

  render() {
    const {username, password, errors, loading} = this.state;
    return (
      <div className={'centered'}>
        <div className={'login-container'}>
          <form onSubmit={(e) => {
            e.preventDefault();
            this.handleAuthentication(username, password);
          }}>
            <TextField label="Username:" value={username}
                       onChange={(e) => this.setState({username: e.target.value})}
                       errorMessage={(errors.username || []).join('<br>')}
            />
            <TextField label="Password:" value={password}
                       onChange={(e) => this.setState({password: e.target.value})}
                       type="password"
                       errorMessage={(errors.password || errors.non_field_errors || []).join('<br>')}
            />
            <div className={'button-group-right'}>
              <div>
                <ActionButton iconProps={{iconName: 'AddFriend'}} className={'register-button'}>
                  Register
                </ActionButton>
              </div>
              <PrimaryButton type="submit">
                {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive" /> : 'Login'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}