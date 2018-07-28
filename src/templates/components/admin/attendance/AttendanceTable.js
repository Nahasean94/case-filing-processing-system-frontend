import React from 'react'
import CurrentGuard from "../../../shared/CurrentGuard"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Query} from "graphql-react"
import {getAllGuardsAttendance} from "../../../shared/queries"
import AttendanceView from "./AttendanceView"
import Menu from "../Menu"
import PropTypes from "prop-types"


class AttendanceTable extends React.Component{
    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-2 col-md-2 bd-sidebar">
                        <Menu router={this.context.router} active="attendance"/>
                    </div>
                    <div className="col-sm-10 col-md-10 col-xl-10 bd-content">
                        <Query
                            loadOnMount
                            loadOnReset
                            fetchOptionsOverride={fetchOptionsOverride}
                            query={getAllGuardsAttendance}
                        >
                            {({loading, data}) => {
                                if (data) {
                                    if (data.getAllGuardsAttendance && data.getAllGuardsAttendance.length > 0) {
                                        return (
                                            <table className="table table-striped">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Sign in</th>
                                                    <th scope="col">Sign out</th>
                                                    <th scope="col">Duration</th>
                                                    <th scope="col">Guard ID</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data.getAllGuardsAttendance.map(attendance => {
                                                    return <AttendanceView attendance={attendance}/>

                                                })}
                                                </tbody>
                                            </table>)
                                    } else {
                                        return <p>No attendance records found</p>
                                    }
                                }
                                else if (loading) {
                                    return <p>Loading…</p>
                                }
                                return <p>Loading failed.</p>
                            }
                            }
                        </Query>
                    </div>
                </div>
            </div>
        )
    }
}
AttendanceTable.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AttendanceTable