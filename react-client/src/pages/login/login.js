import React, {Component} from 'react';
import './login.css';
import {ActionButton, PrimaryButton, Spinner, SpinnerSize, TextField} from 'office-ui-fabric-react';
import {connect} from "react-redux";
import {logIn} from "../../actions/login";

class LoginPage extends Component {

  state = {
    username: '',
    password: '',
  };

  handleAuthentication(username, password) {
    this.props.logIn(username, password);
  }

  redirectToRegister = () => this.props.history.push('/register');

  render() {
    const {username, password} = this.state;
    const {errors, loading} = this.props;
    return (
      <div className={'centered'}>
        <div className={'login-container'}>
          <div className={'logo-container'}>
            <img src={'/logo.svg'} width={200} className={'logo'} alt="logo"/>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            this.handleAuthentication(username, password);
          }}>
            <TextField label="Username:" value={username}
                       onChange={(e) => this.setState({username: e.target.value})}
                       errorMessage={(errors.username || []).join('\r\n')}
                       placeholder="Username"
            />
            <TextField label="Password:" value={password}
                       onChange={(e) => this.setState({password: e.target.value})}
                       type="password"
                       errorMessage={(errors.password || errors.non_field_errors || []).join('\r\n')}
                       placeholder="Password"
            />
            <div className={'button-group-right'}>
              <div>
                <ActionButton iconProps={{iconName: 'AddFriend'}} className={'register-button'}
                              onClick={this.redirectToRegister}>
                  Register
                </ActionButton>
              </div>
              <PrimaryButton type="submit">
                {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Login'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({isAuthenticated, loginErrors, loginLoading}) => {
  return {
    errors: loginErrors,
    loading: loginLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (username, password) => dispatch(logIn(username, password))
  };
};

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginPage);