import React, {Component} from 'react';
import {connect} from "react-redux";
import {
  ChangePasswordModal,
  ErrorLabel,
  Loader,
  PrivatePageRedirect,
  ProfileInfoLine,
  SummaryTable, Tooltip,
  UserAvatar,
  UserForm,
} from '../../components';
import {
  DirectionalHint,
  Icon,
  Panel,
  PanelType,
  Rating,
} from 'office-ui-fabric-react';
import {getEmployee, updateUserPhoto} from "../../actions/user";
import {getUserProjects} from "../../actions/userProjects";
import {getUserSkills} from "../../actions/userSkills";
import {setPasswordModal} from "../../actions/modals";
import {EmployeeFiles} from "../../components/projectCommon/employeeFiles";
import { Link } from 'react-router-dom';

class ProfilePage extends Component {

  state = {
    showPanel: false,
  };

  componentDidMount() {
    const {getUserProjects, getUserSkills, employeeId, getEmployee, user, isStaff} = this.props;

    if (user && (isStaff || user.id === Number(employeeId))) {
      getEmployee(employeeId);
      getUserProjects(employeeId);
      getUserSkills(employeeId);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {getUserProjects, getUserSkills, employeeId, getEmployee, isStaff, user} = this.props;
    const {employeeId: nextId} = nextProps;
    if ((nextId !== employeeId)) {
      if (user && (isStaff || user.id === Number(nextId))) {
        getEmployee(nextId, true);
        getUserProjects(nextId);
        getUserSkills(nextId);
      }
    }
  }

  render() {
    let {updateUserPhoto, userSkills, userProjects, photoLoading, photoErrors, employee: user, user: currentUser, isStaff, employeeId} = this.props;
    const {showPanel} = this.state;
    if (!user) user = {};
    if (!currentUser) currentUser = {};
    return (
      <div className={'page-container'}>
        <PrivatePageRedirect employeeId={this.props.employeeId}/>
        <ChangePasswordModal employeeId={Number(this.props.employeeId)}/>
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
            <div className={'navigation-container'}>
              {(this._shouldShowElement()) && isStaff &&
                isStaff &&
                <Tooltip text="Open Candidate Presentation">
                  <Icon iconName={'ContactCard'}
                        style={this.styles.icon}
                        onClick={() => this.props.history.push(`/home/${user.id}/presentation`)}
                  />
                </Tooltip>}

              <Tooltip text="Open Skills of the User">
                <Icon iconName={ 'UserEvent' }
                      style={ this.styles.icon }
                      onClick={ () => this.props.history.push(`/home/${ user.id }/skills`) }
                />
              </Tooltip>
              <Tooltip text="Open Projects of the User" directionalHint={DirectionalHint.topCenter}>
                <Icon iconName={'ProjectLogo32'}
                      style={this.styles.icon}
                      onClick={() => this.props.history.push(`/home/${user.id}/projects`)}
                />
              </Tooltip>
              <Tooltip text="Open Schools of the User" directionalHint={DirectionalHint.rightCenter}>
                <Icon iconName={'Education'}
                      style={this.styles.icon}
                      onClick={() => this.props.history.push(`/home/${user.id}/schools`)}
                />
              </Tooltip>
            </div>
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
                }}/>{ !user.isActive && user.isStaff && '(Deactivated) ' }{user.firstName + ' ' + user.lastName}
              </span>
                    {(isStaff || user.id === currentUser.id) &&
                    <div>
                      <Tooltip text="Edit" directionalHint={DirectionalHint.topCenter}>
                        <Icon
                          iconName={'Edit'}
                          style={this.styles.icon}
                          onClick={() => this.setState({showPanel: true})}
                        />
                      </Tooltip>
                      <Tooltip text="Change Password" directionalHint={DirectionalHint.topCenter}>
                        <Icon
                          iconName={'AzureKeyVault'}
                          style={this.styles.icon}
                          onClick={() => this.props.openPasswordModal()}
                        />
                      </Tooltip>
                    </div>
                    }
                  </div>
                  <ProfileInfoLine text={user.username} iconName="Accounts"/>
                  <ProfileInfoLine text={new Date(user.dob || '').toDateString()} iconName="Cake"
                                   noneMessage="You can add birthday"/>
                  <ProfileInfoLine text={user.email} iconName="EditMail" noneMessage="You can add E-Mail"/>
                  <ProfileInfoLine text={user.position} iconName="AccountManagement" noneMessage="Your position"/>
                  <ProfileInfoLine text={user.careerStartDate ? new Date(user.careerStartDate).toDateString() : ''}
                                   iconName="Rocket" noneMessage="Your career start date"/>
                </div>
                {(this._shouldShowElement()) && isStaff &&
                <div className={'profile-description'}>
                <Link className={'table-title'}
                      to={`/home/${user.id}/presentation`}
                >
                  <Icon iconName={'ContactCard'}
                        style={{
                          fontSize: 1.5 + 'rem',
                          margin: 0.5 + 'rem'
                        }}/>
                  Summary
                </Link>
                  <p>{user.description || "Here will be your description"}</p>
                </div>}
              </div>) :
              <Loader title="Loading profile information..." style={{marginTop: -5 + 'rem'}}/>
            }
            {(this._shouldShowElement()) &&
            <div className={'summary-tables-container'}>
              <SummaryTable items={userSkills}
                            renderRow={({name, level, id, skillId}) =>
                              <tr key={`skill${id}`}>
                                <td width="200px">
                                  {
                                    isStaff
                                        ? <Link
                                            to={`/home/skills/${skillId}`}
                                            className="table-link"
                                        >{name}</Link>
                                        : name
                                  }
                                </td>
                                <td className={'summary-table-second-col'}><Rating
                                  min={1}
                                  max={5}
                                  rating={level}
                                  readOnly={true}
                                /></td>
                              </tr>}
                            title="Skills"
                            iconName="UserEvent"
                            link={`/home/${user.id}/skills`}
              />
              <SummaryTable items={userProjects}
                            renderRow={({name, duration, id, projectId}) =>
                              <tr key={`project${id}`}>
                                <td width="200px" className={'summary-table-first-col'}>
                                  <Link
                                    to={`/home/projects/${projectId}`}
                                    className="table-link"
                                  >{name}</Link>
                                </td>
                                <td
                                  className={'summary-table-second-col'}>{duration + ` Month${duration > 1 ? 's' : ''}`}</td>
                              </tr>}
                            title="Projects"
                            iconName="ProjectLogo32"
                            link={`/home/${user.id}/projects`}
              />
            </div>}
          </div>
          {(this._shouldShowElement()) && isStaff &&
          <div className="employee-file-picker">
            <EmployeeFiles employeeId={this.props.employeeId}/>
          </div>
          }
        </div>
      </div>
    );
  }

  styles = {
    icon: {
      fontSize: 1.5 + 'rem',
      marginLeft: 0.6 + 'rem',
      marginBottom: 0.6 + 'rem',
      cursor: 'pointer',
      color: '#0178d4',
    }
  };

  _shouldShowElement = () => {
    const {employee, employeeId} = this.props;
    return (employee && employee.id === Number(employeeId));
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
    userSkills: userSkills && userSkills.slice().sort((a, b) => a.level - b.level).slice(-numOfItemsToShowInSummaryTables).reverse().map(({skill: {name, id: skillId}, level, id}) => ({
      id,
      name,
      level,
      skillId,
    })),
    userProjects: userProjects && userProjects.slice().sort((a, b) => a.durationMonths - b.durationMonths).slice(-numOfItemsToShowInSummaryTables).reverse().map(({project: {name, id: projectId}, durationMonths, id}) => ({
      id,
      name,
      duration: durationMonths,
      projectId,
    })),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserPhoto: (userId, photo, currentUserId) => dispatch(updateUserPhoto(userId, photo, currentUserId)),
    getUserProjects: (userId) => dispatch(getUserProjects(userId)),
    getUserSkills: (userId) => dispatch(getUserSkills(userId)),
    getEmployee: (userId) => dispatch(getEmployee(userId)),
    openPasswordModal: () => dispatch(setPasswordModal(true)),
  };
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
