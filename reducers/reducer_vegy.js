import {FETCH_VEGY} from '../actions/index';

export default function(state = [], action){
    switch (action.type) {
        case FETCH_VEGY:
        console.log(action.payload);
            return [action.payload.data];
    }
    return state;
}
