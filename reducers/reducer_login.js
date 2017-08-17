import {LOGIN_REQUEST} from '../actions/index';

export default function(state = [], action){
    switch (action.type) {
        case LOGIN_REQUEST:
            return action.payload;
    }
    return state;
}
