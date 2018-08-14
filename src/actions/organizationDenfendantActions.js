import {ADD_ORGANIZATION_DEFENDANT, CLEAR_ORGANIZATION_DEFENDANT, UPDATE_ORGANIZATION_DEFENDANT} from "../actions/types"

export function addOrganizationDefendant(organizationDefendant) {
    return {
        type: ADD_ORGANIZATION_DEFENDANT,
        payload: organizationDefendant
    }
}

export function clearOrganizationDefendant() {
    return {
        type: CLEAR_ORGANIZATION_DEFENDANT,
        payload: {}
    }
}

export function updateOrganizationDefendant(organizationDefendant) {
    return {
        type: UPDATE_ORGANIZATION_DEFENDANT,
        payload: organizationDefendant
    }
}
