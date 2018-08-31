import React, {Component} from 'react';
import {connect} from "react-redux";
import {ProfileInfoLine, SummaryTable, UserAvatar, UserForm} from "../../components";
import {Icon, Rating} from "office-ui-fabric-react";
import {updateUser, updateUserPhoto} from "../../actions/user";
import {getUserProjects} from "../../actions/userProjects";
import {getUserSkills} from "../../actions/userSkills";

class ProfilePage extends Component {

  state = {
    editName: false,
    editDob: false,
    editEmail: false,

    dob: '',
    email: ''
  };

  componentDidMount() {
    const {user, getUserProjects, getUserSkills} = this.props;
    if (user) {
      getUserProjects(user.id);
      getUserSkills(user.id)
    }
  }

  render() {
    let {user, updateUserPhoto, updateUser, userSkills, userProjects} = this.props;
    const {editName, editDob, editEmail} = this.state;
    if (!user) {
      user = {}
    }
    return (
      <div className={'page-container'}>
        <span className={'page-title'}>Profile</span>
        <div className={'profile-container'}>
          <div className={'profile-photo-container'}>
            <div className={'profile-photo'}>
              <UserAvatar/>
            </div>
            <div>
              <label htmlFor="user-avatar" className={'upload-user-photo'}>
                <Icon iconName={'Upload'} style={{marginRight: 4}}/>
                Upload photo
              </label>
              <input type="file" id="user-avatar" style={{display: 'none'}}
                     onChange={({target: {files}}) => files[0] && updateUserPhoto({image: files[0]})}/>
            </div>
          </div>
          <div className={'profile-info'}>
            <span className={'profile-info-line profile-name'}>{user.firstName + ' ' + user.lastName}</span>
            <ProfileInfoLine text={user.username} iconName="Contact" onClick={() => this.setState({editName: true})}/>
            <ProfileInfoLine text={new Date(user.dob || '').toDateString()} iconName="Cake"
                             noneMessage="You can add birthday"/>
            <ProfileInfoLine text={user.email} iconName="EditMail" noneMessage="You can add E-Mail"/>
            <ProfileInfoLine text={user.description} iconName="ContactCard"
                             noneMessage="Here will be your description"/>
          </div>
          <SummaryTable items={userSkills}
                        renderRow={({name, level, id}) =>
                          <tr key={`skill${id}`}>
                            <td width="200px">{name}</td>
                            <td><Rating
                              min={1}
                              max={5}
                              rating={level}
                              readOnly={true}
                            /></td>
                          </tr>}
                        title="Skills"
          />
          <SummaryTable items={userProjects}
                        renderRow={({name, duration, id}) =>
                          <tr key={`project${id}`}>
                            <td width="200px">{name}</td>
                            <td>{duration + ` Month${duration > 1 ? 's' : ''}`}</td>
                          </tr>}
                        title="Projects"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({user, userSkills, userProjects}) => {
  return {
    user,
    userSkills: userSkills && userSkills.slice(0, 4).map(({skill: {name}, level, id}) => ({
      id,
      name,
      level
    })).sort((a, b) => b.level - a.level),
    userProjects: userProjects && userProjects.slice(0, 4).map(({project: {name}, durationMonths, id}) => ({
      id,
      name,
      duration: durationMonths
    })).sort((a, b) => b.duration - a.duration),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserPhoto: (user) => dispatch(updateUserPhoto(user)),
    updateUser: (user) => dispatch(updateUser(user)),
    getUserProjects: (userId) => dispatch(getUserProjects(userId)),
    getUserSkills: (userId) => dispatch(getUserSkills(userId)),
  };
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(ProfilePage);