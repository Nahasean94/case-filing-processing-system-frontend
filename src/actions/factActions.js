import {ADD_FACT, CLEAR_FACTS, DELETE_FACT, UPDATE_FACT} from "../actions/types"

export function addFact(fact) {
    return {
        type: ADD_FACT,
        payload: fact
    }
}

export function clearFacts() {
    return {
        type: CLEAR_FACTS,
        payload: {}
    }
}

export function updateFact(fact) {
    return {
        type: UPDATE_FACT,
        payload: fact
    }
}

export function deleteFact(fact) {
    return {
        type: DELETE_FACT,
        payload: fact
    }
}
