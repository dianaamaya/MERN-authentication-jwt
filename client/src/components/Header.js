import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import * as actions from '../actions';

class Header extends Component {

    constructor(props) {
       super(props);
       this.signOut = this.signOut.bind(this);
    }
    
    signOut() {
       this.props.signOut();
    }

    render() {
        return <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <Link className="navbar-brand" to="/">API Auth</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav mr-auto">
                    { this.props.isAuth ?
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li> : null }                 
                </ul>
                <ul className="nav navbar-nav ml-auto">
                    { !this.props.isAuth ?
                    [<li className="nav-item" key="signup">
                        <Link className="nav-link" to="/signup">Sign Up</Link>
                    </li>,
                    <li className="nav-item" key="signin">
                        <Link className="nav-link" to="/signin">Sign In</Link>
                    </li>] : null }
                    
                    { this.props.isAuth ?
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={this.signOut}>Sign Out</Link>
                        </li> 
                        : null 
                    }
                </ul>
            </div>
        </nav>
    }
}

function mapStateToProps(state) {
    return {
      isAuth: state.auth.isAuthenticated
    };
}
  
export default connect(mapStateToProps, actions)(Header);