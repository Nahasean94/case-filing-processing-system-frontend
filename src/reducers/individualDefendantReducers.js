import {ADD_INDIVIDUAL_DEFENDANT, CLEAR_INDIVIDUAL_DEFENDANT, UPDATE_INDIVIDUAL_DEFENDANT} from "../actions/types"

export default (state = {}, action = {}) => {
    switch (action.type) {
        case ADD_INDIVIDUAL_DEFENDANT:
            return action.payload
        case CLEAR_INDIVIDUAL_DEFENDANT:
            return {}
        case UPDATE_INDIVIDUAL_DEFENDANT:
            return action.payload
        default:
            return state
    }
}