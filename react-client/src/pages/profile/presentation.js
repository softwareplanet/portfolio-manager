import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader, PrivatePageRedirect, Project, UserAvatar} from "../../components";
import {getEmployee} from "../../actions/user";
import {getUserProjects} from "../../actions/userProjects";
import {getUserSkills} from "../../actions/userSkills";
import {groupBy} from "../../service/utils";

class PresentationPage extends Component {

  componentDidMount() {
    const {getUserProjects, getUserSkills, employeeId, employee, getEmployee} = this.props;
    if (!employee || employee.id !== employeeId) {
      getEmployee(employeeId);
      getUserProjects(employeeId);
      getUserSkills(employeeId)
    }
  }

  render() {
    let {photoLoading, employee, employeeId, userSkills, userProjects} = this.props;
    if (!employee) employee = {};
    return (
      <div className={'page-container'}>
        <PrivatePageRedirect/>
        <span className={'page-title'}>Candidate Presentation</span>
        <div className={'profile-container'}>
          <div className={'profile-photo-container'}>
            <div className={'profile-photo'}>
              {photoLoading ? <Loader/> : <UserAvatar url={employee.id === Number(employeeId) && employee.image}/>}
            </div>
          </div>
          <div className={'presentation-container'}>
            <div className="info">
              <span>
              Name: <b>{employee ? employee.firstName + ' ' + employee.lastName : ''}</b>
            </span>
              <br/>
              <br/>
              <p style={{textAlign: 'justify'}}>
                {employee.description}
              </p>
              <div style={{textDecoration: 'underline', fontWeight: 700, marginBottom: 1 + 'rem'}}>Technical Summary
              </div>
              {userSkills ? this._renderSkills(userSkills) : <Loader title={'Loading skills...'}/>}
              <div style={{
                textDecoration: 'underline',
                fontWeight: 700,
                marginBottom: 2 + 'rem',
                marginTop: 2 + 'rem'
              }}>Professional Experience
              </div>
              {userProjects ? this._renderProjects(userProjects) : <Loader title={'Loading projects...'}/>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderSkills = (groupedSkills = []) => {
    return groupedSkills.sort((a, b) => a[1][0].skill.category.id - b[1][0].skill.category.id).map((arr, index) => {
      const skillNames = arr[1].map(({skill}) => skill.name);
      const category = arr[0];
      return (
        <span style={{color: '#4b709d', display: 'flex', marginBottom: 0.5 + 'rem'}} key={'category' + index}>
          <span style={{flex: 1, textAlign: 'right', paddingRight: 1 + 'rem'}}>{category}: </span>
          <span style={{
            flex: 2,
            textAlign: 'justify'
          }}>{skillNames && (skillNames.length ? skillNames.join(', ') : 'Employee has not added any...')}</span>
          </span>
      )
    })
  };

  _renderProjects = (projects = []) => {
    return projects.map((project) => <Project key={project.id} project={project}/>)
  }
}

const mapStateToProps = ({user, userSkills, userProjects, editUserPhotoLoading, editUserErrors: {image}, isStaff, employee}, {match: {params: {employeeId}}}) => {
  return {
    user,
    employee,
    employeeId,
    isStaff,
    photoLoading: editUserPhotoLoading,
    photoErrors: image,
    userSkills: userSkills && groupBy(userSkills, ({skill}) => skill.category.name),
    userProjects: userProjects && userProjects.slice().sort(({project: a}, {project: b}) => {
      let aDate = new Date(a.startDate), bDate = new Date(b.startDate);
      return aDate.setMonth(aDate.getMonth() + a.durationMonths) - bDate.setMonth(bDate.getMonth() + b.durationMonths)
    }).reverse().map(({project: {name, description: projectDescription}, description: candidateDescription, id, skills}) => ({
      id,
      name,
      projectDescription,
      candidateDescription,
      skills
    })),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProjects: (userId) => dispatch(getUserProjects(userId)),
    getUserSkills: (userId) => dispatch(getUserSkills(userId)),
    getEmployee: (userId) => dispatch(getEmployee(userId)),
  };
};

export const Presentation = connect(mapStateToProps, mapDispatchToProps)(PresentationPage);