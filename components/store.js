import {createStore} from 'redux';
import rootReducer from './reducers'; // Assuming you have a file named reducers.js

const store = createStore(rootReducer);

export default store;
