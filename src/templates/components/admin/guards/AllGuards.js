import React, {Component} from 'react'
import {getAllGuards,} from "../../../shared/queries"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import Menu from '../Menu'
import PropTypes from "prop-types"
import GuardView from "./GuardView"
import GuardDetails from "./GuardDetails"
import NewGuard from "../../guards/modals/NewGuard"

class AllGuards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            guard_id: '',
            showNewGuardModal: false
        }
        this.onSelectGuard = this.onSelectGuard.bind(this)
        this.showNewGuardModal = this.showNewGuardModal.bind(this)
        this.closeNewGuardModal = this.closeNewGuardModal.bind(this)
    }

    onSelectGuard(guard_id) {
        // CurrentGuard.setGuardId(guard_id)
        this.setState({guard_id})
    }

    showNewGuardModal() {
        this.setState({showNewGuardModal: true})
    }

    closeNewGuardModal() {
        this.setState({showNewGuardModal: false})
    }


    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-2 col-md-2 bd-sidebar">
                        <Menu router={this.context.router} active="guards"/>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xl-5 bd-content">
                        <button className="btn btn-sm btn-dark" onClick={this.showNewGuardModal}>New guard</button>
                        <br/>
                        <br/>
                        <NewGuard show={this.state.showNewGuardModal} onClose={this.closeNewGuardModal}/>
                        <Query
                            loadOnMount
                            loadOnReset
                            fetchOptionsOverride={fetchOptionsOverride}
                            // variables={{guard_id: CurrentGuard.getGuardId()}}
                            query={getAllGuards}
                        >
                            {({loading, data}) => {
                                if (data) {
                                    if (data.getAllGuards && data.getAllGuards.length > 0) {
                                        return (
                                            <table className="table table-striped">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Guard ID</th>
                                                    <th scope="col">First name</th>
                                                    <th scope="col">Last name</th>
                                                    <th scope="col">Gender</th>
                                                    <th scope="col">Location</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data.getAllGuards.map(guard => {
                                                    return <GuardView guard={guard} onSelectGuard={this.onSelectGuard}/>

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
                    <div className="col-sm-5 col-md-5 col-xl-5 bd-location">
                        <div className="row">
                            <div className="offset-sm-1">
                                <GuardDetails guard={this.state.guard_id}/></div>
                        </div>

                    </div>
                </div>

            </div>
        )

    }
}

AllGuards.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AllGuards

