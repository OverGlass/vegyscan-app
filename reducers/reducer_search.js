import {DELETE_TAG, FETCH_VEGIES, IS_FETCHING} from '../actions/index';

export default function(state = [], action){
    switch (action.type) {
        case DELETE_TAG:
            return {tagId : action.payload};
            break;
        case FETCH_VEGIES:
            if (action.payload.data){
                return {search : action.payload.data}
            } else {
                return {error : action.payload.message}
            }
            break;
        case IS_FETCHING:
            return action.payload
           
    }
    return state;
}