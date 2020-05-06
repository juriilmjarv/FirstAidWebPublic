import React, { Component } from 'react';
import {FaUsers} from 'react-icons/fa';
import {Link} from '@reach/router'
import './index.css';

class Navigation extends Component {
  render() {
    const { user, logOutUser } = this.props;

    return (
        <nav className="site-nav family-sans navbar navbar-expand bg-dark navbar-dark higher">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <FaUsers className="mr-1" /> FirstAid
          </Link>
          <div className="navbar-nav ml-auto">
            {user && (
              <Link className="nav-item nav-link" to="/newemergency">
                New emergency
              </Link>
            )}
            {user && (
              <Link className="nav-item nav-link" to="/aiders">
                Aiders
              </Link>
            )}
            {user && (
              <Link className="nav-item nav-link" to="/tasklive">
                Live tasks
              </Link>
            )}
            {user && (
              <Link className="nav-item nav-link" to="/taskcompleted">
                Completed tasks
              </Link>
            )}
            {!user && (
              <Link className="nav-item nav-link" to="/login">
                Log in
              </Link>
            )}
            {!user && (
              <Link className="nav-item nav-link" to="/register">
                Register
              </Link>
            )}
            {user && (
              <Link className="nav-item nav-link" to="/login" onClick={e => logOutUser(e)}>
                Log out
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;