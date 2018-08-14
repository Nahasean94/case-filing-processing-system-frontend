import {ADD_ORGANIZATION_PLAINTIFF, CLEAR_ORGANIZATION_PLAINTIFF, UPDATE_ORGANIZATION_PLAINTIFF} from "../actions/types"

export function addOrganizationPlaintiff(organizationPlaintiff) {
    return {
        type: ADD_ORGANIZATION_PLAINTIFF,
        payload: organizationPlaintiff
    }
}

export function clearOrganizationPlaintiff() {
    return {
        type: CLEAR_ORGANIZATION_PLAINTIFF,
        payload: {}
    }
}

export function updateOrganizationPlaintiff(organizationPlaintiff) {
    return {
        type: UPDATE_ORGANIZATION_PLAINTIFF,
        payload: organizationPlaintiff
    }
}
