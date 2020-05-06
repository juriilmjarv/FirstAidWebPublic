// Import React
import React, { Component } from 'react';
import Home from './Home';
import Welcome from './Welcome';
import Login from './Login';
import NewEmergency from './NewEmergency';
import Aiders from './Aiders'
import Register from './Register';
import Navigation from './Navigation';
import TaskLive from './TaskLive';
import TaskCompleted from './TaskCompleted';
import {Router, navigate} from '@reach/router';
import firebase from 'firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, 
      displayName: null,
      userID: null
    };
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(FBUser => {
      if(FBUser){
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
      }
    });
  }

  registerUser = userName => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      }).then(() => {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
        navigate('/newemergency');
      })
    });
  }

  logOutUser = e => {
    e.preventDefault();
    this.setState({
      user: null,
      displayName: null,
      userID: null
    });

    firebase.auth().signOut().then(() => {
      navigate('./login');
    })
  }
  render() {
    return (
      <div>
        <Navigation user={this.state.user} logOutUser={this.logOutUser}/>
        {this.state.user && <Welcome userName={this.state.displayName} logOutUser={this.logOutUser} />}
        <Router>
          <Home path="/" user={this.state.user} />
          <Login path="/login"/>
          <NewEmergency path="/newemergency"/>
          <Aiders path="/aiders"/>
          <TaskLive path="/tasklive"/>
          <TaskCompleted path="/taskcompleted"/>
          <Register path="/register" registerUser={this.registerUser}/>
        </Router>
        
      </div>
    );
  }
}

export default App;
