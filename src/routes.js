import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import App from "./components/App"
import Home from "./components/Home"
import requireAuth from "./components/utils/requireAuth"
import AdvocatesSignInPage from "./components/advocates/signin/AdvocatesSignInPage"
import requireAdvocateAuth from "./components/utils/requireAdvocateAuth"
import AdvocateDashboard from "./components/advocates/AdvocateDashboard"
import AdminSignInPage from "./components/admin/signin/AdminSignInPage"
import AdminDashboard from "./components/admin/AdminDashboard"
import CourtStations from "./components/admin/courts/CourtStations"
import CaseCategories from "./components/admin/case-categories/CaseCategories"
import FormFeeStructures from "./components/admin/form-fee-structure/FormFeeStructures"
import CourtAdminSignInPage from "./components/court-station-admin/signin/CourtAdminSignInPage"
import CourtAdminDashboard from "./components/court-station-admin/CourtAdminDashboard"
import requireCourtAdminAuth from "./components/utils/requireCourtAdminAuth"
import CourtAssistant from "./components/court-station-admin/court-assistant/CourtAssistant"
import DeputyRegistrar from "./components/court-station-admin/deputy-registrar/DeputyRegistrar"

export default () => {

    return (<BrowserRouter>
            <div>
                <App>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/advocates/signin" component={AdvocatesSignInPage}/>
                        <Route exact path="/advocates/dashboard" component={requireAdvocateAuth(AdvocateDashboard)}/>
                        <Route exact path="/admin/signin" component={AdminSignInPage}/>
                        <Route exact path="/admin/dashboard" component={requireAuth(AdminDashboard)}/>
                        <Route exact path="/admin/dashboard/court-stations" component={requireAuth(CourtStations)}/>
                        <Route exact path="/admin/dashboard/case-categories" component={requireAuth(CaseCategories)}/>
                        <Route exact path="/admin/dashboard/case-forms" component={requireAuth(FormFeeStructures)}/>
                        <Route exact path="/court-admin/signin" component={CourtAdminSignInPage}/>
                        <Route exact path="/court-admin/dashboard" component={requireCourtAdminAuth(CourtAdminDashboard)}/>
                        <Route exact path="/court-admin/dashboard/assistant" component={requireCourtAdminAuth(CourtAssistant)}/>
                        <Route exact path="/court-admin/dashboard/deputy-registrar" component={requireCourtAdminAuth(DeputyRegistrar)}
                    />

                    </Switch>
                </App>
            </div>
        </BrowserRouter>
    )
}