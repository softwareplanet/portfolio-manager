import React, {Component} from 'react';
import {connect} from "react-redux";
import {ErrorLabel, Loader, ProfileInfoLine, SummaryTable, UserAvatar, UserForm} from "../../components";
import {Icon, Panel, PanelType, Rating} from "office-ui-fabric-react";
import {getEmployee, updateUserPhoto} from "../../actions/user";
import {getUserProjects} from "../../actions/userProjects";
import {getUserSkills} from "../../actions/userSkills";

class ProfilePage extends Component {

  state = {
    showPanel: false,
  };

  componentDidMount() {
    const {getUserProjects, getUserSkills, employeeId, employee, getEmployee} = this.props;
    if (!employee || employee.id !== employeeId) {
      getEmployee(employeeId);
      getUserProjects(employeeId);
      getUserSkills(employeeId)
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {getUserProjects, getUserSkills, employeeId, getEmployee} = this.props;
    const {employeeId: nextId} = nextProps;
    if ((nextId !== employeeId)) {
      getEmployee(nextId, true);
      getUserProjects(nextId);
      getUserSkills(nextId)
    }
  }

  render() {
    let {updateUserPhoto, userSkills, userProjects, photoLoading, photoErrors, employee: user, user: currentUser, isStaff, employeeId} = this.props;
    const {showPanel} = this.state;
    if (!user) user = {};
    if (!currentUser) currentUser = {};
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
          <UserForm onClose={this._setShowPanel(false)} employee={user}/>
        </Panel>
        <span className={'page-title'}>Profile</span>
        <div className={'profile-container'}>
          <div className={'profile-photo-container'}>
            <div className={'profile-photo'}>
              {photoLoading ? <Loader/> : <UserAvatar url={user.id === Number(employeeId) && user.image}/>}
            </div>
            {(isStaff || user.id === currentUser.id) &&
            <div>
              <label htmlFor="user-avatar" className={'upload-user-photo'}>
                <Icon iconName={'Upload'} style={{marginRight: 4}}/>
                Upload photo
              </label>
              <div style={{width: 9 + 'rem', textAlign: 'justify'}}>
                <ErrorLabel title={photoErrors}/>
              </div>
              <input type="file" id="user-avatar" style={{display: 'none'}}
                     onChange={({target: {files}}) => files[0] && updateUserPhoto(user.id, {image: files[0]}, currentUser.id)}/>
            </div>}
          </div>
          <div className={'info-container'}>
            {user.id === Number(employeeId) ?
              (<div className={'summary-tables-container profile-info-container'}>
              <div className={'profile-info'}>
                <div className={'profile-info-line profile-name'}>
              <span>
                <Icon iconName="Contact" style={{
                  fontSize: 1.5 + 'rem',
                  margin: 0.5 + 'rem'
                }}/>{user.firstName + ' ' + user.lastName}
              </span>
                  {(isStaff || user.id === currentUser.id) &&
                  <Icon
                    iconName={'Edit'}
                    style={{
                      fontSize: 1.5 + 'rem',
                      marginLeft: 0.6 + 'rem',
                      marginBottom: 0.6 + 'rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => this.setState({showPanel: true})}
                  />}
                </div>
                <ProfileInfoLine text={user.username} iconName="Accounts"/>
                <ProfileInfoLine text={new Date(user.dob || '').toDateString()} iconName="Cake"
                                 noneMessage="You can add birthday"/>
                <ProfileInfoLine text={user.email} iconName="EditMail" noneMessage="You can add E-Mail"/>
              </div>
              {(this._shouldShowElement()) &&
              <div className={'profile-description'} onClick={() => this.props.history.push(`/home/${user.id}/presentation`)}>
                <span className={'table-title'}>
                  <Icon iconName={'ContactCard'}
                        style={{
                          fontSize: 1.5 + 'rem',
                          margin: 0.5 + 'rem'
                        }}/>
                  Summary
                </span>
                <p>{user.description || "Here will be your description"}</p>
              </div>}
            </div>) :
              <Loader title="Loading profile information..." style={{marginTop: -5 + 'rem'}}/>
            }
            {(this._shouldShowElement()) &&
            <div className={'summary-tables-container'}>
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
                            iconName="UserEvent"
                            onTitleClick={() => this.props.history.push(`/home/${user.id}/skills`)}
              />
              <SummaryTable items={userProjects}
                            renderRow={({name, duration, id}) =>
                              <tr key={`project${id}`}>
                                <td width="200px" className={'summary-table-first-col'}>{name}</td>
                                <td
                                  className={'summary-table-second-col'}>{duration + ` Month${duration > 1 ? 's' : ''}`}</td>
                              </tr>}
                            title="Projects"
                            iconName="ProjectLogo32"
                            onTitleClick={() => this.props.history.push(`/home/${user.id}/projects`)}
              />
            </div>}
          </div>
        </div>
      </div>
    );
  }

  _shouldShowElement = () => {
    const {employee, employeeId} = this.props;
    return !employee.isStaff && (employee && employee.id === Number(employeeId));
  };

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({showPanel});
    };
  };
}

const numOfItemsToShowInSummaryTables = 5;

const mapStateToProps = ({user, userSkills, userProjects, editUserPhotoLoading, editUserErrors: {image}, isStaff, employee}, {match: {params: {employeeId}}}) => {
  return {
    user,
    employee,
    employeeId,
    isStaff,
    photoLoading: editUserPhotoLoading,
    photoErrors: image,
    userSkills: userSkills && userSkills.slice().sort((a, b) => a.level - b.level).slice(-numOfItemsToShowInSummaryTables).reverse().map(({skill: {name}, level, id}) => ({
      id,
      name,
      level
    })),
    userProjects: userProjects && userProjects.slice().sort((a, b) => a.durationMonths - b.durationMonths).slice(-numOfItemsToShowInSummaryTables).reverse().map(({project: {name}, durationMonths, id}) => ({
      id,
      name,
      duration: durationMonths
    })),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserPhoto: (userId, photo, currentUserId) => dispatch(updateUserPhoto(userId, photo, currentUserId)),
    getUserProjects: (userId) => dispatch(getUserProjects(userId)),
    getUserSkills: (userId) => dispatch(getUserSkills(userId)),
    getEmployee: (userId) => dispatch(getEmployee(userId)),
  };
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(ProfilePage);