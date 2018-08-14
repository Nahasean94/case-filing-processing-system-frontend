import {ADD_ORGANIZATION_DEFENDANT, CLEAR_ORGANIZATION_DEFENDANT, UPDATE_ORGANIZATION_DEFENDANT} from "../actions/types"

export default (state = {}, action = {}) => {
    switch (action.type) {
        case ADD_ORGANIZATION_DEFENDANT:
            return action.payload
        case CLEAR_ORGANIZATION_DEFENDANT:
            return {}
        case UPDATE_ORGANIZATION_DEFENDANT:
            return action.payload
        default:
            return state
    }
}