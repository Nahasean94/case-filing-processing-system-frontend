import {ADD_FORM, CLEAR_FORMS, UPDATE_FORM,DELETE_FORM} from "../actions/types"

export default (state = [], action = {}) => {
    switch (action.type) {
        case ADD_FORM:
            return [...state,action.payload]
        case CLEAR_FORMS:
            return []
        case UPDATE_FORM:
            return state.map(fact => {
                console.log(action.payload,fact.value)
                if (fact.value === action.payload.value) {
                    return action.payload
                }
                return fact
            })
        case DELETE_FORM:
            return [...[...state.slice(0, state.indexOf(action.payload)), ...state.slice(state.indexOf(action.payload) + 1)]]

        default:
            return state
    }
}