import React, {Component} from 'react';
import './home.css';
import {CreateProjectModal, CreateSkillModal, Header, NavBar} from "../../components";
import {Route, Switch} from "react-router-dom";
import {Schools, Skills, Profile, Projects} from "..";
import {connect} from "react-redux";

class HomePage extends Component {
  componentDidMount() {
    const {history} = this.props;
    const currentLocation = history.location.pathname;
    if (currentLocation === '/home' || currentLocation === '/home/') {
      const lastLocation = localStorage.getItem('location');
      lastLocation && !(lastLocation === '/home' || lastLocation === '/home/') ? history.push(lastLocation) : history.push('/home/projects');
    }
  }

  render() {
    const {sideBarOpened} = this.props;
    return (
      <div className={'full-frame'}>
        <CreateSkillModal/>
        <CreateProjectModal/>
        <Header/>
        <div className={'flex'}>
          <NavBar history={this.props.history} sideBarOpened={sideBarOpened}/>
          <div className={`content-container ${!sideBarOpened && 'full'}`}>
            <Switch>
              <Route path='/home/profile' component={Profile}/>
              <Route path='/home/projects' component={Projects}/>
              <Route path='/home/skills' component={Skills}/>
              <Route path='/home/schools' component={Schools}/>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({sideBarOpened, }) => {
  return {sideBarOpened};
};

export const Home = connect(mapStateToProps)(HomePage);