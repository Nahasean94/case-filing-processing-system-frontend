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
                        {/*<Route exact path="/guards" component={Home}/>*/}
                        {/*<Route exact path="/guards/leave" component={Leave}/>*/}
                        {/*<Route exact path="/guards/inbox" component={InboxPage}/>*/}
                        {/*<Route exact path="/guards/profile" component={ProfilePage}/>*/}
                        {/*<Route exact path="/guards/reports" component={Reports}/>*/}
                        {/*<Route exact path="/guards/attendance" component={AttendanceTable}/>*/}
                    </Switch>
                </App>
            </div>
        </BrowserRouter>
    )
}