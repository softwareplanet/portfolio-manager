import React, {Component} from 'react';
import './home.css';
import {CreateProjectModal, CreateSchoolModal, CreateSkillModal, Header, NavBar, NoPermission} from "../../components";
import {Route, Switch} from "react-router-dom";
import {
  EmployeeProjects,
  Employees,
  EmployeeSchools,
  EmployeesFromSchool,
  EmployeeSkills,
  EmployeesWithSkill,
  Presentation,
  Profile,
  Projects,
  ProjectTeam,
  Schools,
  Skills
} from "..";
import {connect} from "react-redux";

class HomePage extends Component {
  componentDidMount() {
    const {history, user} = this.props;
    const currentLocation = history.location.pathname;
    if (currentLocation === '/home' || currentLocation === '/home/') {
      const lastLocation = localStorage.getItem('location');
      lastLocation && !(lastLocation === '/home' || lastLocation === '/home/') ? history.push(lastLocation) : history.push(`/home/${user && user.id}/profile`);
    }
  }

  render() {
    const {sideBarOpened, isStaff, user} = this.props;
    return (
      <div className={'full-frame'}>
        <CreateSkillModal/>
        <CreateSchoolModal/>
        <CreateProjectModal/>
        <Header/>
        <div className={'flex'}>
          <NavBar history={this.props.history} sideBarOpened={sideBarOpened} isStaff={isStaff}
                  userId={user && user.id}/>
          <div className={`content-container ${!sideBarOpened && 'full'}`}>
            <Switch>
              <Route exact={true} path='/home/:employeeId/profile' component={Profile}/>
              <Route exact={true} path='/home/:employeeId/presentation' component={Presentation}/>
              <Route exact={true} path='/home/:employeeId/projects' component={EmployeeProjects}/>
              <Route exact={true} path='/home/projects' component={Projects}/>
              <Route exact={true} path='/home/projects/:projectId' component={ProjectTeam}/>
              <Route exact={true} path='/home/:employeeId/skills' component={EmployeeSkills}/>
              <Route exact={true} path='/home/skills' component={Skills}/>
              <Route exact={true} path='/home/skills/:skillId' component={EmployeesWithSkill}/>
              <Route exact={true} path='/home/:employeeId/schools' component={EmployeeSchools}/>
              <Route exact={true} path='/home/schools' component={Schools}/>
              <Route exact={true} path='/home/schools/:schoolId' component={EmployeesFromSchool}/>
              <Route exact={true} path='/home/employees' component={Employees}/>
              <Route exact={true} path='/home/no_permission' component={NoPermission}/>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({sideBarOpened, isStaff, user}) => {
  return {sideBarOpened, isStaff, user};
};

export const Home = connect(mapStateToProps)(HomePage);