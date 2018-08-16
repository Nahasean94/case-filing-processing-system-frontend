import {ADD_FORM, CLEAR_FORMS, DELETE_FORM, UPDATE_FORM} from "../actions/types"

export function addForm(form) {
    return {
        type: ADD_FORM,
        payload: form
    }
}

export function clearForms() {
    return {
        type: CLEAR_FORMS,
        payload: {}
    }
}

export function updateForm(form) {
    return {
        type: UPDATE_FORM,
        payload: form
    }
}

export function deleteForm(form) {
    return {
        type: DELETE_FORM,
        payload: form
    }
}
