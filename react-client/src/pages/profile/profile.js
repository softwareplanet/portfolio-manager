import React, {Component} from 'react';
import {connect} from "react-redux";
import {ProfileInfoLine, SummaryTable, UserAvatar, UserForm} from "../../components";
import {Icon, Panel, PanelType, Rating} from "office-ui-fabric-react";
import {updateUser, updateUserPhoto} from "../../actions/user";
import {getUserProjects} from "../../actions/userProjects";
import {getUserSkills} from "../../actions/userSkills";

class ProfilePage extends Component {

  state = {
    showPanel: false,
  };

  componentDidMount() {
    const {user, getUserProjects, getUserSkills} = this.props;
    if (user) {
      getUserProjects(user.id);
      getUserSkills(user.id)
    }
  }

  render() {
    let {user, updateUserPhoto, userSkills, userProjects} = this.props;
    const {showPanel} = this.state;
    if (!user) {
      user = {}
    }
    return (
      <div className={'page-container'}>
        <Panel
          isBlocking={false}
          isOpen={showPanel}
          onDismiss={this._setShowPanel(false)}
          type={PanelType.smallFixedFar}
          headerText={'Edit profile'}
          hasCloseButton={false}
        >
          <UserForm onClose={this._setShowPanel(false)}/>
        </Panel>
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
            <div className={'profile-info-line profile-name'}>
              <span>
                {user.firstName + ' ' + user.lastName}
              </span>
              <Icon
                iconName={'Edit'}
                style={{
                  fontSize: 1.5 + 'rem',
                  marginLeft: 0.6 + 'rem',
                  marginBottom: 0.6 + 'rem',
                  cursor: 'pointer'
                }}
                onClick={() => this.setState({showPanel: true})}
              />
            </div>
            <ProfileInfoLine text={user.username} iconName="Contact"/>
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
                            <td className={'summary-table-second-col'}><Rating
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
                            <td width="200px" className={'summary-table-first-col'}>{name}</td>
                            <td className={'summary-table-second-col'}>{duration + ` Month${duration > 1 ? 's' : ''}`}</td>
                          </tr>}
                        title="Projects"
          />
        </div>
      </div>
    );
  }

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({showPanel});
    };
  };
}

const mapStateToProps = ({user, userSkills, userProjects}) => {
  return {
    user,
    userSkills: userSkills && userSkills.sort((a, b) => b.level - a.level).slice(0, 4).map(({skill: {name}, level, id}) => ({
      id,
      name,
      level
    })),
    userProjects: userProjects && userProjects.sort((a, b) => b.durationMonths - a.durationMonths).slice(0, 4).map(({project: {name}, durationMonths, id}) => ({
      id,
      name,
      duration: durationMonths
    })),
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