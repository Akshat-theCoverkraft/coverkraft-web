import { combineReducers } from 'redux';
import userReducer from './reducers';

const rootReducer = combineReducers({
  user: userReducer,
 
});
  
export default rootReducer;