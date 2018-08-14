import {ADD_CASE_DESCRIPTION, CLEAR_CASE_DESCRIPTION, UPDATE_CASE_DESCRIPTION} from "../actions/types"

export function addCaseDescription(caseDescription) {
    return {
        type: ADD_CASE_DESCRIPTION,
        payload: caseDescription
    }
}

export function clearCaseDescription() {
    return {
        type: CLEAR_CASE_DESCRIPTION,
        payload: {}
    }
}

export function updateCaseDescription(caseDescription) {
    return {
        type: UPDATE_CASE_DESCRIPTION,
        payload: caseDescription
    }
}
