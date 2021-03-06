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
import CourtAssistantLogin from "./components/court-assistant/CourtAssistantLogin"
import requireAssistantAuth from "./components/utils/requireAssistantAuth"
import CourtAssistantDashboard from "./components/court-assistant/CourtAssistantDashboard"
import DeputyRegistrarLogin from "./components/deputy-registrar/DeputyRegistrarLogin"
import requireDeputyRegistrarAuth from "./components/utils/requireDeputyRegistrarAuth"
import NewCase from "./components/advocates/cases/NewCase"
import PendingCases from "./components/advocates/cases/pending-cases/PendingCases"
import CompletedCases from "./components/advocates/cases/closed-cases/CompletedCases"
import AssistantPendingCases from "./components/court-assistant/pending-cases/PendingCases"
import AssistantCompletedCases from "./components/court-assistant/closed-cases/CompletedCases"
import ServedCases from "./components/advocates/cases/served-cases/ServedCases"
import Clientele from "./components/advocates/clientele/Clientele"
import DeputyPendingCases from "./components/deputy-registrar/pending-cases/PendingCases"
import DeputyCompletedCases from "./components/deputy-registrar/closed-cases/CompletedCases"
import Profile from "./components/advocates/profile/Profile"
import CaseTypes from "./components/admin/case-type/CaseTypes"
import Cases from "./components/deputy-registrar/reports/Cases"

export default () => {

    return (<BrowserRouter>
            <div>
                <App>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/advocates/signin" component={AdvocatesSignInPage}/>
                        <Route exact path="/advocates/dashboard" component={requireAdvocateAuth(AdvocateDashboard)}/>
                        <Route exact path="/admin" component={AdminSignInPage}/>
                        <Route exact path="/admin/dashboard" component={requireAuth(AdminDashboard)}/>
                        <Route exact path="/admin/dashboard/court-stations" component={requireAuth(CourtStations)}/>
                        <Route exact path="/admin/dashboard/case-categories" component={requireAuth(CaseCategories)}/>
                        <Route exact path="/admin/dashboard/case-types" component={requireAuth(CaseTypes)}/>
                        <Route exact path="/admin/dashboard/case-forms" component={requireAuth(FormFeeStructures)}/>
                        <Route exact path="/court-admin/signin" component={CourtAdminSignInPage}/>
                        <Route exact path="/court-admin/dashboard"
                               component={requireCourtAdminAuth(CourtAdminDashboard)}/>
                        <Route exact path="/court-admin/dashboard/assistant"
                               component={requireCourtAdminAuth(CourtAssistant)}/>
                        <Route exact path="/court-admin/dashboard/deputy-registrar"
                               component={requireCourtAdminAuth(DeputyRegistrar)}/>
                        <Route exact path="/assistant/signin" component={CourtAssistantLogin}
                        />
                        <Route exact path="/assistant/dashboard"
                               component={requireAssistantAuth(CourtAssistantDashboard)}
                        />
                        {/*<Route exact path="/deputy-registrar/dashboard"*/}
                        {/*component={requireDeputyRegistrarAuth(DeputyRegistrarDashboard)}*/}
                        {/*/>*/}
                        <Route exact path="/deputy-registrar/signin" component={DeputyRegistrarLogin}
                        />
                        <Route exact path="/advocates/dashboard" component={requireAdvocateAuth(NewCase)}
                        />
                        <Route exact path="/advocates/dashboard/new-case" component={requireAdvocateAuth(NewCase)}/>
                        <Route exact path="/advocates/dashboard/pending-cases"
                               component={requireAdvocateAuth(PendingCases)}
                        />
                        <Route exact path="/advocates/dashboard/completed-cases"
                               component={requireAdvocateAuth(CompletedCases)}
                        />
                        <Route exact path="/assistant/dashboard/pending-cases"
                               component={requireAssistantAuth(AssistantPendingCases)}
                        />
                        <Route exact path="/assistant/dashboard/completed-cases"
                               component={requireAssistantAuth(AssistantCompletedCases)}
                        />
                        <Route exact path="/advocates/dashboard/served-cases"
                               component={requireAdvocateAuth(ServedCases)}
                        />
                        <Route exact path="/deputy-registrar/dashboard/pending-cases"
                               component={requireDeputyRegistrarAuth(DeputyPendingCases)}
                        />
                        <Route exact path="/deputy-registrar/dashboard/completed-cases"
                               component={requireDeputyRegistrarAuth(DeputyCompletedCases)}
                        />

                        <Route exact path="/advocates/dashboard/clientele" component={requireAdvocateAuth(Clientele)}
                        />
                        <Route exact path="/advocates/dashboard/clientele" component={requireAdvocateAuth(Clientele)}
                        />
                        <Route exact path="/deputy-registrar/dashboard/reports" component={requireDeputyRegistrarAuth(Cases)}
                        />
                    </Switch>
                </App>
            </div>
        </BrowserRouter>
    )
}