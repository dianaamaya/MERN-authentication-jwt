/**
 * handle methods and secret in the linking/unlinking process
 */

//type of actions
import { 
    DASHBOARD_GET_DATA, 
    AUTH_LINK_GOOGLE,
    AUTH_LINK_FACEBOOK,
    AUTH_UNLINK_GOOGLE,
    AUTH_UNLINK_FACEBOOK } from '../actions/types';
  
//previous state
const DEFAULT_STATE = {
  secret: '',
  methods: []
}
  
/**
 * dashboard reducers
 * 
 * @param {Object} state - previous state
 * @param {Object} action - variables registered in the application
 */
export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case AUTH_LINK_GOOGLE:
      return { ...state, methods: action.payload.methods }
    case AUTH_LINK_FACEBOOK:
      return { ...state, methods: action.payload.methods }
    case AUTH_UNLINK_GOOGLE:
      return { ...state, methods: action.payload.methods }
    case AUTH_UNLINK_FACEBOOK:
      return { ...state, methods: action.payload.methods }
    case DASHBOARD_GET_DATA:
      return { ...state, secret: action.payload.secret, methods: action.payload.methods }
    default:
      return state
  }
}