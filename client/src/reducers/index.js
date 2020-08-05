/**
 * main reducer file, handle reducers
 */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

//local modules
import authReducer from './auth';
import dashboardReducer from './dashboard';

//combine reducer functions into one function to send to createStore
export default combineReducers({
  form: formReducer,
  auth: authReducer,
  dash: dashboardReducer
});