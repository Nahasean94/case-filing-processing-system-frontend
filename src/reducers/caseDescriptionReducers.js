import {ADD_CASE_DESCRIPTION, CLEAR_CASE_DESCRIPTION, UPDATE_CASE_DESCRIPTION} from "../actions/types"

export default (state = {}, action = {}) => {
    switch (action.type) {
        case ADD_CASE_DESCRIPTION:
            return action.payload
        case CLEAR_CASE_DESCRIPTION:
            return {}
        case UPDATE_CASE_DESCRIPTION:
            return action.payload
        default:
            return state
    }
}