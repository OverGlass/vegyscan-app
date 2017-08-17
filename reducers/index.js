/**
 * Created by antonincarlin on 08/02/2017.
 */
import { combineReducers } from 'redux';
import vegyReducer from './reducer_vegy';
import allVegyReducer from './reducer_allvegy';
import selectedMonths from './selectedMonths';
import loginIn from './reducer_login';
import loginAccess from './reducer_access_login';
import evalInfo from './reducer_eval_info';
import notes from './reducer_notes';
import search from './reducer_search';
import tags from './reducer_tags';

const rootReducer = combineReducers({
    OneVegy : vegyReducer,
    allvegy : allVegyReducer,
    selectedMonths,
    loginIn,
    loginAccess,
    evalInfo,
    notes,
    search, 
    tags

});

export default rootReducer;