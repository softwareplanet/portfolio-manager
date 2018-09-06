import React, {Component} from 'react';
import './home.css';
import {CreateProjectModal, CreateSchoolModal, CreateSkillModal, Header, NavBar} from "../../components";
import {Route, Switch} from "react-router-dom";
import {EmployeeProjects, EmployeeSchools, EmployeeSkills, Profile, Projects, Schools, Skills} from "..";
import {connect} from "react-redux";
import {Employees} from "../employees/employees";

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
              <Route path='/home/:employeeId/profile' component={Profile}/>
              <Route path='/home/:employeeId/projects' component={EmployeeProjects}/>
              <Route path='/home/:employeeId/skills' component={EmployeeSkills}/>
              <Route path='/home/:employeeId/schools' component={EmployeeSchools}/>
              <Route path='/home/employees' component={Employees}/>
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