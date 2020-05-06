import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import firebase from 'firebase';
import swal from 'sweetalert';
import {navigate} from '@reach/router';

class NewEmergency extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      address: '',
      latlon: {lat:'', lon:''},
      phone: '', 
      name: '', 
      condition: '',
      gender: '', 
      locationDescription:'', 
      age:'', 
      victimName:'', 
      lifethreataning: false,
      ambulanceComing: false
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChange5 = this.handleChange5.bind(this);
    this.handleChange6 = this.handleChange6.bind(this);
    this.handleChange7 = this.handleChange7.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  handleChange = address => {
    this.setState({ address });
  };

  handleChange1 = event => {
    this.setState({ name: event.target.value});
  };
  handleChange2 = event => {
    this.setState({ phone: event.target.value});
  }
  handleChange3 = event => {
    this.setState({ condition: event.target.value});
  }
  handleChange4 = event => {
    this.setState({ gender: event.target.value});
  }
  handleChange5 = event => {
    this.setState({ victimName: event.target.value});
  }
  handleChange6 = event => {
    this.setState({ locationDescription: event.target.value});
  }
  handleChange7 = event => {
    this.setState({ age: event.target.value});
  }
  handleLifeThreataning = (e) => {
    const lifethreataning = e.target.checked;
    this.setState({ lifethreataning });
  };
  handleAmbulanceComing = (e) => {
    const ambulanceComing = e.target.checked;
    this.setState({ ambulanceComing });
  };
 
  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({
        latlon: {
          lat: latLng.lat,
          lon: latLng.lng
        }
      }))
      .catch(error => console.error('Error', error));
    this.setState({address: address});
    console.log(this.state.latlon);
  };

  handleSubmit = e => {
    //alert('A name was submitted: ' + this.state.address + JSON.stringify(this.state.latlon));
    e.preventDefault();
    var newEmergency = {
      location: this.state.address,
      latlon: {
        lat: this.state.latlon.lat,
        lon: this.state.latlon.lon
      },
      name: this.state.name,
      phone: this.state.phone,
      condition: this.state.condition,
      timestamp: Date.now(),
      allocated: false,
      gender: this.state.gender,
      victimName: this.state.victimName,
      locationDescription: this.state.locationDescription,
      age: this.state.age,
      lifethreataning: this.state.lifethreataning,
      ambulanceComing: this.state.ambulanceComing,
      completed: false
    }
    firebase.database().ref('emergency').push(newEmergency).then(
      swal("Sucess!", "Looking for first-aider!", "success").then(navigate('/tasklive'))
    );
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="jumbotron">
            <h3 className="font-weight-light mb-3">New Emergency</h3>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Location</label>
                <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <input required
                        {...getInputProps({
                          placeholder: 'Search Places ...',
                          className: 'form-control mdb-autocomplete',
                        })}
                      />
                      <div className="autocomplete">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Location Details</label>
                <input type="text" className="form-control" value={this.state.locationDescription} onChange={this.handleChange6} placeholder="Location Details"></input>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Caller Name</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.handleChange1} placeholder="Name"></input>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Victim Name</label>
                <input type="text" className="form-control" value={this.state.victimName} onChange={this.handleChange5} placeholder="Name"></input>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Phone Number</label>
                <input type="text" className="form-control" value={this.state.phone} onChange={this.handleChange2} placeholder="07122345678"></input>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="exampleFormControlSelect1">Gender</label>
                <select className="form-control" id="exampleFormControlSelect1" value={this.state.gender} onChange={this.handleChange4}>
                  <option selected value='undefined'>Select...</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="inputEmail4">Age</label>
                <input type="text" className="form-control" value={this.state.age} onChange={this.handleChange7} placeholder="e.g. 29"></input>
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="inputEmail4">Condition</label>
                <textarea type="text" className="form-control" value={this.state.condition} onChange={this.handleChange3} placeholder="Whats wrong?"></textarea>
              </div>
              <div className="form-group col-md-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="gridCheck" checked={this.state.lifethreataning} onChange={this.handleLifeThreataning}></input>
                  <label className="form-check-label" htmlFor="gridCheck">
                  Life threatening situation?
                  </label>
                </div>
              </div>
              <div className="form-group col-md-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="gridCheck" checked={this.state.ambulanceComing} onChange={this.handleAmbulanceComing}></input>
                  <label className="form-check-label" htmlFor="gridCheck">
                  Ambulance on the way?
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    );
  }



  
}

export default NewEmergency;