import {ADD_INDIVIDUAL_PLAINTIFF, CLEAR_INDIVIDUAL_PLAINTIFF, UPDATE_INDIVIDUAL_PLAINTIFF} from "../actions/types"

export default (state = {}, action = {}) => {
    switch (action.type) {
        case ADD_INDIVIDUAL_PLAINTIFF:
            return action.payload
        case CLEAR_INDIVIDUAL_PLAINTIFF:
            return {}
        case UPDATE_INDIVIDUAL_PLAINTIFF:
            return action.payload
        default:
            return state
    }
}