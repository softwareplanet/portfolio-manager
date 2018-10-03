import React, {Component} from 'react';
import './register.css';
import {ActionButton, DatePicker, PrimaryButton, Spinner, SpinnerSize, TextField} from 'office-ui-fabric-react';
import {register} from "../../actions/register";
import connect from "react-redux/es/connect/connect";

class RegisterPage extends Component {

  state = {
    username: '',
    password: '',
    birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    firstName: '',
    lastName: '',
    email: ''
  };
  redirectToHome = () => this.props.history.push('/');

  handleRegistration() {
    this.props.register(this.state);
  }

  render() {
    const {username, email, password, firstName, lastName, birthday} = this.state;
    const {errors, loading} = this.props;
    return (
      <div className={'centered'}>
        <div className={'login-container'}>
          <div className={'logo-container'}>
            <img src={'/logo.svg'} width={200} className={'logo'} alt="logo"/>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            this.handleRegistration(username, password);
          }}>
            <TextField label="First name:" value={firstName}
                       onChange={(e) => this.setState({firstName: e.target.value})}
                       errorMessage={(errors.firstName || []).join('\n\r')}
                       required
                       placeholder="First name"
            />
            <TextField label="Last Name:" value={lastName}
                       onChange={(e) => this.setState({lastName: e.target.value})}
                       errorMessage={(errors.lastName || []).join('\r\n')}
                       required
                       placeholder="Last name"
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
                       errorMessage={(errors.username || []).join('\r\n')}
                       required
                       placeholder="Username"
            />
            <TextField label="E-Mail:" value={email}
                       onChange={(e) => this.setState({email: e.target.value})}
                       errorMessage={(errors.email || []).join('\n\r')}
                       type="email"
                       placeholder="example@mail.com"
            />
            <TextField label="Password:" value={password}
                       onChange={(e) => this.setState({password: e.target.value})}
                       type="password"
                       errorMessage={(errors.password || errors.non_field_errors || []).join('\n\r')}
                       required
                       placeholder="Password"
            />
            <div className={'button-group-right'}>
              <div>
                <ActionButton className={'register-button'} onClick={this.redirectToHome}>
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

const mapStateToProps = ({registerErrors, registerLoading}) => {
  return {
    errors: registerErrors,
    loading: registerLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (user) => dispatch(register(user))
  };
};

export const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterPage);