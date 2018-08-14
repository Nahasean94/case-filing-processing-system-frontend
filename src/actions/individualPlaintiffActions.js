import {ADD_INDIVIDUAL_PLAINTIFF, CLEAR_INDIVIDUAL_PLAINTIFF, UPDATE_INDIVIDUAL_PLAINTIFF} from "../actions/types"

export function addIndividualPlaintiff(individualPlaintiff) {
    return {
        type: ADD_INDIVIDUAL_PLAINTIFF,
        payload: IndividualPlaintiff
    }
}

export function clearIndividualPlaintiff() {
    return {
        type: CLEAR_INDIVIDUAL_PLAINTIFF,
        payload: {}
    }
}

export function updateIndividualPlaintiff(individualPlaintiff) {
    return {
        type: UPDATE_INDIVIDUAL_PLAINTIFF,
        payload: individualPlaintiff
    }
}
