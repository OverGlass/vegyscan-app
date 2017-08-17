import {ALL_TAGS} from '../actions/index';

export default function(state = [], action){
    switch (action.type) {
        case ALL_TAGS:
            return action.payload;
    }
    return state;
}