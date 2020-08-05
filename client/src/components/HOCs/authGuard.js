/**
 * to protect routes
 * return the component if the user is loged in
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (OriginalComponent) => {
  class MixedComponent extends Component {

    checkAuth() {
      if (!this.props.isAuth && !this.props.jwtToken) {
        this.props.history.push('/');
      }
    }

    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    render() {
      return <OriginalComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuth: state.auth.isAuthenticated,
      jwtToken: state.auth.token
    }
  }

  //connect has 2 arguments : 
  //1* arguments getting access to the store, 
  //2* argument, all about actions 
  return connect(mapStateToProps)(MixedComponent);
};