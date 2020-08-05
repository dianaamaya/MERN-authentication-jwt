/**
 * Action creators
 * 
 * In this file, actions are created/returned * 
 * actions are dispatched using middlewares (redux-thunk) that handle reducers
 */

import axios from 'axios';

//type of actions
import { 
  AUTH_SIGN_UP, 
  AUTH_SIGN_OUT, 
  AUTH_SIGN_IN,
  AUTH_LINK_GOOGLE, 
  AUTH_LINK_FACEBOOK,
  AUTH_UNLINK_GOOGLE,
  AUTH_UNLINK_FACEBOOK, 
  AUTH_CHANGE_PAGE,
  AUTH_ERROR,
  DASHBOARD_GET_DATA } from './types';

  /**
   * reset the error message generated in sign in/sign up page
   * dispatch errorMessage reset
   */
  export const resetMessage = () => {
    return dispatch => {
      dispatch({
        type: AUTH_CHANGE_PAGE
      });
    };
  }

/**
  * use the data and make HTTP request (with axios) to the server 
  * dispatch user just signed up (cookie - token) / dispatch error
  * 
  * @param {Object} data - registration form data 
  */
  export const signUp = data => {
    return async dispatch => {
      try {
        await axios.post('http://localhost:4000/user/signup', data);
        dispatch({
          type: AUTH_SIGN_UP
        });
      } catch(err) {
        
        let message = "something was wrong, please reload the page and try again";
        if(err.response.data.error) message = err.response.data.error;
        //console.log(err.response.status);
        //console.log(err.response.headers);
        //console.log(err.response.data);
        dispatch({
          type: AUTH_ERROR,
          payload: message
        })
      }
    };
  }

/**
  * use the data and make HTTP request (with axios) to the server 
  * dispatch user just logged in (cookie - token) / dispatch error
  * 
  * @param {Object} data - login form data 
  */

  export const signIn = data => {
    return async dispatch => {
      try {
        await axios.post('http://localhost:4000/user/signin', data);
        dispatch({
          type: AUTH_SIGN_IN
        });
      } catch(err) {
        dispatch({
          type: AUTH_ERROR,
          payload: 'Email and password combination isn\'t valid'
        })
      }
    };
  }

/**
  * make HTTP request (with axios) to the server 
  * dispatch user just logged out 
  */

  export const signOut = () => {
    return async dispatch => {
      await axios.get('http://localhost:4000/user/signout');  
      dispatch({
        type: AUTH_SIGN_OUT
      })
    };
  }

/**
  * use the data and add as header access_token,
  * make HTTP request (with axios) to the server,
  * dispatch user just signed up (cookie - token) 
  * 
  * @param {Object} data - information given by google 
  */

  export const oauthGoogle = (data) => {
    return async dispatch => {
      await axios.post('http://localhost:4000/user/oauth/google', {
        access_token: data
      });
      dispatch({
        type: AUTH_SIGN_UP
      });
    };
  }

/**
  * add data with header access_token,
  * make HTTP request (with axios) to the server,
  * dispatch user just linked (cookie - token) and response data
  * 
  * @param {Object} data - information given by google 
  */

  export const linkGoogle = data => {
    return async dispatch => {
      const res = await axios.post('http://localhost:4000/user/oauth/link/google', {
        access_token: data
      });
      dispatch({
        type: AUTH_LINK_GOOGLE,
        payload: res.data
      });
    };
  }
/**
  * add data with header access_token,
  * make HTTP request (with axios) to the server,
  * dispatch user just unlinked (cookie - token) and response data
  * 
  * @param {Object} data - information given by google 
  */
  export const unlinkGoogle = data => {
    return async dispatch => {
      const res = await axios.post('http://localhost:4000/user/oauth/unlink/google');

      dispatch({
        type: AUTH_UNLINK_GOOGLE,
        payload: res.data
      });
    };
  }

/**
  * add data with header access_token,
  * make HTTP request (with axios) to the server,
  * dispatch user just signed up (cookie - token) 
  * 
  * @param {Object} data - information given by facebook 
  */
  export const oauthFacebook = data => {
    return async dispatch => {
      await axios.post('http://localhost:4000/user/oauth/facebook', {
        access_token: data
      });
      dispatch({
        type: AUTH_SIGN_UP
      });
    };
  }

/**
  * add data with header access_token,
  * make HTTP request (with axios) to the server,
  * dispatch user just linked (cookie - token) and response data
  * 
  * @param {Object} data - information given by facebook 
  */
  export const linkFacebook = data => {
    return async dispatch => {
      const res = await axios.post('http://localhost:4000/user/oauth/link/facebook', {
        access_token: data
      });

      dispatch({
        type: AUTH_LINK_FACEBOOK,
        payload: res.data
      });
    };
  }

/**
  * add data with header access_token,
  * make HTTP request (with axios) to the server,
  * dispatch user just unlinked (cookie - token) and response data
  * 
  * @param {Object} data - information given by facebook 
  */
  export const unlinkFacebook = data => {
    return async dispatch => {
      const res = await axios.post('http://localhost:4000/user/oauth/unlink/facebook');

      dispatch({
        type: AUTH_UNLINK_FACEBOOK,
        payload: res.data
      });
    };
  }


/**
  * to check if the user is logged in,  
  * make HTTP request (with axios) to the server,
  * dispatch user if it is logged in 
  */

  export const checkAuth = () => {
    return async dispatch => {
      try {
        await axios.get('http://localhost:4000/user/status');

        dispatch({
          type: AUTH_SIGN_IN
        });

        //console.log('user is auth-ed')
      } catch(err) {
        console.log('error', err)
      }
    };
  }

  
/**
  * get dashboard data,  
  * make HTTP request (with axios) to the server,
  * dispatch dashboard data if user is logged in 
  */
  export const getDashboard = () => {
    return async dispatch => {
      try {
        const res = await axios.get('http://localhost:4000/user/dashboard')
        dispatch({
          type: DASHBOARD_GET_DATA,
          payload: res.data
        })
      } catch(err) {
        console.error('err', err)
      }
    }
  }

