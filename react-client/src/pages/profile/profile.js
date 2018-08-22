import React, {Component} from 'react';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react';
import {connect} from "react-redux";

class ProfilePage extends Component {
  render() {
    return (
      <div className={'centered-loading'}>
        <Spinner size={SpinnerSize.large} label="Profile"
                 ariaLive="assertive"/>
      </div>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Profile = connect(mapStateToProps)(ProfilePage);