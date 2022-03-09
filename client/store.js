import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from './redux';

export default createStore(appReducer, applyMiddleware(thunkMiddleware));
