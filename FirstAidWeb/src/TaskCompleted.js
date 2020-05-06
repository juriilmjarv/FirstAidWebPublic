import React, { Component } from 'react';
import firebase from 'firebase';
import List from "./components/list"
import moment from 'moment';
// Scripts
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';



class TaskCompleted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed:[],
    };
  };

  componentDidMount(){
      const userRef = firebase.database().ref('emergency');
      userRef.on('value', (snapshot) => {
          let completedtasks = snapshot.val();
          let newState = [];
          for(let completedtask in completedtasks){
            if(completedtasks[completedtask].completed === true){
              newState.push({
                  id: completedtask,
                  location: completedtasks[completedtask].location,
                  locationDescription: completedtasks[completedtask].locationDescription,
                  allocated: completedtasks[completedtask].allocated.toString(),
                  phone: completedtasks[completedtask].phone,
                  condition: completedtasks[completedtask].condition,
                  aiderID: completedtasks[completedtask].aiderID,
                  aiderName: completedtasks[completedtask].aiderName,
                  aiderEmail: completedtasks[completedtask].aiderEmail,
                  timestampstart: completedtasks[completedtask].timestamp,
                  timestamp: moment(completedtasks[completedtask].timestamp).format("MMM Do YYYY"),
                  gender: completedtasks[completedtask].gender,
                  age: completedtasks[completedtask].age,
                  completedtime: completedtasks[completedtask].completedtime,
                  lifethreataning: completedtasks[completedtask].lifethreataning,
                  name: completedtasks[completedtask].name,
                  victimName: completedtasks[completedtask].victimName,
                  ambulanceComing: completedtasks[completedtask].ambulanceComing,
              });
            }
          }
          this.setState({
              completed: newState,
          });
      })
  }

  render() {
    return (
      <div className='container'>
        <List
          data={this.state.completed}
        />
      </div>
    );
  }
}


export default TaskCompleted;