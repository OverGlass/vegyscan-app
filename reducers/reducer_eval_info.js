import {EVAL_INFO, EVAL_END} from '../actions/index';

export default function(state = [], action){
    console.log(action)
    switch (action.type) {
        case EVAL_INFO:
            return action.payload;
        case EVAL_END:
            return {note : action.payload.data.note, evalEnd : true}
    }
    return state;
}
