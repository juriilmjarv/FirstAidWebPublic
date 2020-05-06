import React, { Component } from 'react';
import firebase from 'firebase';
import moment from 'moment';
import Moment from 'react-moment';
import {DropdownButton, Dropdown} from 'react-bootstrap'
import ClipLoader from "react-spinners/ClipLoader";
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'



class TaskLive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            liveEmergencies: [],
        };
    };

    componentDidMount(){
        const userRef = firebase.database().ref('emergency');
        userRef.on('value', (snapshot) => {
            let emergencies = snapshot.val();
            let newState = [];
            
            for(let emergency in emergencies){
                //Display only the tasks that are not completed
                if(emergencies[emergency].completed === false){
                    const twoMinutesAgo = moment().subtract(0.5, 'minutes')
                    var timestampTwoMinutes = moment.unix(emergencies[emergency].timestamp/1000, "MMMM Do YYYY, h:mm:ss a").isAfter(twoMinutesAgo);
                    newState.push({
                        id: emergency,
                        location: emergencies[emergency].location,
                        locationDescription: emergencies[emergency].locationDescription,
                        allocated: emergencies[emergency].allocated,
                        name: emergencies[emergency].name,
                        victimName: emergencies[emergency].victimName,
                        phone: emergencies[emergency].phone,
                        condition: emergencies[emergency].condition,
                        lifethreataning: emergencies[emergency].lifethreataning,
                        ambulanceComing: emergencies[emergency].ambulanceComing,
                        aider: emergencies[emergency].aiderID,
                        aiderName: emergencies[emergency].aiderName,
                        aiderEmail: emergencies[emergency].aiderEmail,
                        timestamp: emergencies[emergency].timestamp,
                        checkTime: timestampTwoMinutes,
                        completed: emergencies[emergency].completed,
                        age: emergencies[emergency].age,
                        gender: emergencies[emergency].gender
                    });
                }
            }
            this.setState({
                liveEmergencies: newState
            });
        });
        this.interval = setInterval(() => this.updateTime(), 5000);
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }

    updateTime =() => {
        var s = this.state.liveEmergencies
        for(var i in s){
            s[i].checkTime = moment.unix(s[i].timestamp/1000, "MMMM Do YYYY, h:mm:ss a").isAfter(moment().subtract(0.5, 'minutes'))
            this.forceUpdate()
        }
        /*
        let data = JSON.parse(JSON.stringify(this.state.liveEmergencies))
        for(var i in data){
            data[i].checkTime = moment.unix(data[i].timestamp/1000, "MMMM Do YYYY, h:mm:ss a").isAfter(moment().subtract(1, 'minutes'))
            this.setState({
                liveEmergencies: data 
            })
            console.log('updated!!!: ' + moment.unix(data[i].timestamp/1000, "MMMM Do YYYY, h:mm:ss a").isAfter(moment().subtract(1, 'minutes')))
        }
        */
    }

    manualComplete(i){
        
        firebase.database().ref('emergency/' + this.state.liveEmergencies[i].id).update({
            completed: true,
            allocated: true,
            completedtime: Date.now(),
            aiderID: firebase.auth().currentUser.uid,
            aiderName: firebase.auth().currentUser.displayName,
            aiderEmail: firebase.auth().currentUser.email,
            acceptedTime: Date.now()
        })
        .then(
            swal("Success!", "Task completed by " + firebase.auth().currentUser.displayName, "success")
        )
        
        console.log(this.state.liveEmergencies[i].location)
        console.log(i);
    }

    getSecondClosest(id){
        var secondClosest = firebase.functions().httpsCallable('secondClosest');
           secondClosest({id: id}).then(function(result) {
               // Read result of the Cloud Function.
               console.log(result.data.text);
           }).then(
                swal("Success!", "Notification sent to second closest first-aider!", "success")
           ).catch(function(error) {
               // Getting the Error details.
               // ...
           });
   }

   sendPushAgain(id){
    var sendPush = firebase.functions().httpsCallable('sendPushAgain');
       sendPush({id: id}).then(function(result) {
           // Read result of the Cloud Function.
           console.log(result.data.text);
       }).then(
            swal("Success!", "Notification sent to second closest first-aider!", "success")
       ).catch(function(error) {
           // Getting the Error details.
           // ...
       });
    }
    
  render() {
    return (
        <div className="container">
        <div style={{ textAlign: "center" }}>
          <h1>Current Events</h1>
          <br></br>
        </div>
        <table className="table table-striped">
            <thead className="thead-dark">
                <tr>
                    <th scope='col'>Time</th>
                    <th scope="col">Location</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Condition</th>
                    <th scope="col">Aider Details</th>
                    <th scope='col'>Status</th>
                </tr>
            </thead>
            <tbody>
                {this.state.liveEmergencies.map((emergency, i) => {
                    const timestamp = moment.unix(emergency.timestamp/1000).format();
                    //check if needs further action
                    let btn;
                    if(emergency.checkTime === false && emergency.allocated === false){
                        btn = <DropdownButton id="dropdown-basic-button" title="Actions">
                                <Dropdown.Item onClick={() => {this.sendPushAgain(emergency.id)}}>Send Notification Again</Dropdown.Item>
                                <Dropdown.Item onClick={() => {this.getSecondClosest(emergency.id)}}>Find Second Closest</Dropdown.Item>
                                <Dropdown.Item onClick={() => {this.manualComplete(i)}}>Complete Task</Dropdown.Item>
                            </DropdownButton>
                    } else if(emergency.allocated === true){
                        btn = <div style={{textAlign: 'center'}}>
                                <FontAwesomeIcon icon={faCheckCircle} color='green'/>
                            </div>
                    } 
                    else {
                        btn = <div style={{textAlign: 'center'}}>
                                <ClipLoader/>
                            </div>
                    }
                    //Check if allocated
                    let aiderStatus;
                    if(emergency.aiderName === undefined){
                        aiderStatus = <p>Waiting for Aider...</p>
                    } else {
                        aiderStatus = <p>{emergency.aiderName}, {emergency.aiderEmail}</p>
                    }
                    return(
                        <tr key={i}>
                            <td><Moment fromNow>{timestamp}</Moment></td>
                            <td>{emergency.location}</td>
                            <td>{emergency.phone}</td>
                            <td>{emergency.condition}</td>
                            <td>{aiderStatus}</td>
                            <td>{btn}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
    );
  }
}

export default TaskLive;