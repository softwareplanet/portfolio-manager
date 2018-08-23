import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";

class ProfilePage extends Component {
  render() {
    return (
      <Loader title="Loading profile information..."/>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {user};
};

export const Profile = connect(mapStateToProps)(ProfilePage);