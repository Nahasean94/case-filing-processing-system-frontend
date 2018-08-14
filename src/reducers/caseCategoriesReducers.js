import {ADD_CASE_CATEGORIES, CLEAR_CASE_CATEGORIES, UPDATE_CASE_CATEGORIES} from "../actions/types"

export default (state = {}, action = {}) => {
    switch (action.type) {
        case ADD_CASE_CATEGORIES:
            return action.payload
        case CLEAR_CASE_CATEGORIES:
            return {}
        case UPDATE_CASE_CATEGORIES:
            return action.payload
        default:
            return state
    }
}