import React, {Component} from 'react';
import './loading.css';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react';
import {connect} from "react-redux";
import {getUser} from "../../actions/user";

class LoadingPage extends Component {

  componentDidMount() {
    const {isAuthenticated, user, getUser} = this.props;
    !isAuthenticated ? this.props.history.push('/login') : user ? this.props.history.push('/home') : getUser();
  }

  componentDidUpdate() {
    const {isAuthenticated, user} = this.props;
    if (user && isAuthenticated) this.props.history.push('/home');
  }

  render() {
    return (
      <div className={'full-frame'}>
        <div className={'centered-loading'}>
          <Spinner size={SpinnerSize.large} label="Wait a bit, we're loading all information about you..."
                   ariaLive="assertive"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({isAuthenticated, user}) => {
  return {isAuthenticated, user};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(getUser())
  };
};

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingPage);