import {ADD_ORGANIZATION_PLAINTIFF, CLEAR_ORGANIZATION_PLAINTIFF, UPDATE_ORGANIZATION_PLAINTIFF} from "../actions/types"

export default (state = {}, action = {}) => {
    switch (action.type) {
        case ADD_ORGANIZATION_PLAINTIFF:
            return action.payload
        case CLEAR_ORGANIZATION_PLAINTIFF:
            return {}
        case UPDATE_ORGANIZATION_PLAINTIFF:
            return action.payload
        default:
            return state
    }
}