import {ADD_CASE_CATEGORIES, CLEAR_CASE_CATEGORIES, UPDATE_CASE_CATEGORIES} from "../actions/types"

export function addCaseCategory(caseCategory) {
    return {
        type: ADD_CASE_CATEGORIES,
        payload: caseCategory
    }
}

export function clearCaseCategories() {
    return {
        type: CLEAR_CASE_CATEGORIES,
        payload: {}
    }
}

export function updateCaseCategory(caseCategory) {
    return {
        type: UPDATE_CASE_CATEGORIES,
        payload: caseCategory
    }
}
