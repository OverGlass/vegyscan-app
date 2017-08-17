import {LOGIN_ACCESS, DATA_USER} from '../actions/index';

export default function(state = [], action){
    console.log(action.payload)
    switch (action.type) {
        case LOGIN_ACCESS:
            return action.payload;
        case DATA_USER:
            return action.payload.data
    }
    return state;
}
