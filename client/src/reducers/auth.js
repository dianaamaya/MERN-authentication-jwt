/**
 * handle states and error messages in the authentication process
 */
//type of actions
import { AUTH_SIGN_UP, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR, AUTH_CHANGE_PAGE } from '../actions/types';

//previous state
const DEFAULT_STATE = {
  isAuthenticated: false,
  errorMessage: ''
}

/**
 * auth reducers
 * 
 * @param {Object} state - previous state
 * @param {Object} action - variables registered in the application
 */
export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case AUTH_SIGN_UP:
      return { ...state, isAuthenticated: true, errorMessage: '' }
    case AUTH_SIGN_IN:
      return { ...state, isAuthenticated: true, errorMessage: '' }
    case AUTH_SIGN_OUT:
      return { ...state, isAuthenticated: false, errorMessage: '' }
    case AUTH_CHANGE_PAGE: 
      return { ...state, errorMessage: '' }
    case AUTH_ERROR:
      return { ...state, errorMessage: action.payload }
    default:
      return state
  }
}