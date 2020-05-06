import React, { Component } from 'react';
import {Link} from '@reach/router';
import './index.css';

class Home extends Component {
  render() {
    const { user } = this.props;

    const biggerLead = {
      fontSize: 1.4 + 'em',
      fontWeight: 200,
      color: 'white'
    };

    return (
      <div>
        <div className='fullscreen-bg'>
          <video loop muted autoPlay poster="./video_cover.jpg" className="fullscreen-bg__video">
            <source src={require('./tay4k.mp4')} type="video/webm"></source>
            <source src={require('./tay4k.mp4')} type="video/mp4"></source>
            <source src={require('./tay4k.mp4')} type="video/ogg"></source>
          </video>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div className="container background ">
          <div className='text-center'>       
              <div
                className="display-4 mt-3 mb-2"
                style={{
                  fontSize: 2.8 + 'em',
                  color: 'white'
                }}
              >
                First Aid on Campus
              </div>
              <p className="lead" style={biggerLead}>
                Find the closest first aider on campus using <a href="https://reactjs.org/">React</a>{' '}
                with <a href="https://firebase.google.com">Firebase</a>.
              </p>

              {user == null && (
                <span>
                  <Link
                    to="/register"
                    className="btn btn-outline-success mr-2"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline-success mr-2"
                  >
                    Log In
                  </Link>
                </span>
              )}
              {user && (
                <Link to="/newemergency" className="btn btn-success">
                  Register new emergency
                </Link>
              )}
          </div> 
        </div>
      </div>
    );
  }
}

export default Home;