import {ADD_FACT, CLEAR_FACTS, UPDATE_FACT,DELETE_FACT} from "../actions/types"

export default (state = [], action = {}) => {
    switch (action.type) {
        case ADD_FACT:
            return [...state,action.payload]
        case CLEAR_FACTS:
            return []
        case UPDATE_FACT:
            return state.map(fact => {
                if (fact === action.payload) {
                    return action.payload
                }
                return fact
            })
        case DELETE_FACT:
            return [...[...state.slice(0, state.indexOf(action.payload)), ...state.slice(state.indexOf(action.payload) + 1)]]

        default:
            return state
    }
}