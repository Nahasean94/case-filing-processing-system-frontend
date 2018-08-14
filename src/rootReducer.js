import {combineReducers} from 'redux'
import loginReducers from "./reducers/loginReducers"
import advocateLoginReducers from "./reducers/advocateLoginReducers"
import courtAdminLoginReducers from "./reducers/courtAdminLoginReducers"
import factReducers from "./reducers/factReducers"
import caseCategoriesReducers from "./reducers/caseCategoriesReducers"
import caseDescriptionReducers from "./reducers/caseDescriptionReducers"
import individualDefendantReducers from "./reducers/individualDefendantReducers"
import individualPlaintiffReducers from "./reducers/individualPlaintiffReducers"
import organizationPlaintiffReducers from "./reducers/organizationPlaintiffReducers"
import organizationDefendantReducers from "./reducers/organizationDefendantReducers"

export default combineReducers({
    loginReducers,
    advocateLoginReducers,
    courtAdminLoginReducers,
    factReducers,
    caseCategoriesReducers,
    caseDescriptionReducers,
    individualDefendantReducers,
    individualPlaintiffReducers,
    organizationDefendantReducers,
    organizationPlaintiffReducers,
})
