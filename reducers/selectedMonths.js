import {SELECTED_MONTHS} from '../actions'
// State = a piece of the reducers ( a value, data)
export default function(state = null, action) {
    //action.type est donné par les fonction d'actions
    switch (action.type) {
        case SELECTED_MONTHS:
            return action.payload;
    }
    return state;
}