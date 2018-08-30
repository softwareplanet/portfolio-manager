import React, {Component} from 'react';
import {connect} from "react-redux";

class ProfilePage extends Component {

  render() {
    let {user} = this.props;
    if (!user) {
      user = {}
    }
    console.log(user);
    return (
      <div className={'page-container'}>
        <span className={'page-title'}>Profile</span>
        <div className={'profile-container'}>
          <div className={'profile-photo'}/>
          <div className={'profile-info'}>
            <span className={'profile-info-line profile-name'}>{user.firstName + ' ' + user.lastName}</span>
            <span className={'profile-info-line'}>{user.username}</span>
            <span className={'profile-info-line'}>{user.dob}</span>
            <span className={'profile-info-line'}>{user.email}</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Profile = connect(mapStateToProps)(ProfilePage);