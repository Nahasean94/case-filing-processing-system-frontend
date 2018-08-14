import {ADD_INDIVIDUAL_DEFENDANT, CLEAR_INDIVIDUAL_DEFENDANT, UPDATE_INDIVIDUAL_DEFENDANT} from "../actions/types"

export function addIndividualDefendant(caseCategory) {
    return {
        type: ADD_INDIVIDUAL_DEFENDANT,
        payload: caseCategory
    }
}

export function clearCaseDefendant() {
    return {
        type: CLEAR_INDIVIDUAL_DEFENDANT,
        payload: {}
    }
}

export function updateIndividualDefendant(caseCategory) {
    return {
        type: UPDATE_INDIVIDUAL_DEFENDANT,
        payload: caseCategory
    }
}
