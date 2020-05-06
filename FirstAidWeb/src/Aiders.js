import React, { Component } from 'react';
import firebase from 'firebase';
import "firebase/functions";
import ClipLoader from "react-spinners/ClipLoader";
let arr = [];

class Aiders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            l :[]
        };
    };

    componentDidMount(){
        const userRef = firebase.database().ref('users');
        userRef.on('value', (snapshot) => {
            let users = snapshot.val();
            let newState = [];
           console.log(snapshot.length)
            for(let user in users){
                this.reverseGeocode(users[user].location.coords.latitude, users[user].location.coords.longitude)
                newState.push({
                    id: user,
                    name: users[user].name,
                    email: users[user].email,
                    status: users[user].online,
                    lat: users[user].location.coords.latitude,
                    long: users[user].location.coords.longitude,
                    location: '',
                    isBusy: users[user].isBusy,
                    phoneNr: users[user].phoneNr
                });
            }
            this.setState({
                users: newState,
                loading: false
            });
        });
    }
    
    reverseGeocode = (startLoc, desLoc) => {
        //Insert google api key with following APIs: Maps Javascript api, Places API, Geolocation API, Geocoding API
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${startLoc},${desLoc}&key=YOUR_API_KEY`).then(res =>
            res.json()
        ).then( data => {
            arr.push(data.results[0].formatted_address.toString())
            this.setState({
               l: arr
            })
        });
    }
    
    

    render(){
        const {users, loading} = this.state
        const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
        return(
        <div className="container">
            <div style={{ textAlign: "center" }}>
                <h1>First-Aiders</h1>
                <br></br>
            </div>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Location</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Status</th>
                        <th scope="col">On Duty</th>
                    </tr>
                </thead>
                {loading ? 
                    <div style={style}>
                        <ClipLoader/> 
                    </div>
                :
                <tbody>
                    {users.map((user, i) => {
                        return(
                            <tr key={i}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{this.state.l[i]}</td>
                                <td>{user.phoneNr}</td>
                                {user.status === true ? (
                                    <td>online</td>
                                ) : <td>offline</td>}
                                <td>{JSON.stringify(user.isBusy)}</td>

                            </tr>
                        )
                    })}
                </tbody>
            }
            </table>
            
        </div>
        );
    }

}

export default Aiders;