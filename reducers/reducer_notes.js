import {GET_NOTES} from '../actions/index';

export default function(state = [], action){
    switch (action.type) {
        case GET_NOTES:
        let data;
            if(action.payload.data){
                data = action.payload.data
            } else {
                data = action.payload
            }
            return data;
    }
    return state;
}