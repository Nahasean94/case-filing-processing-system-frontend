import React, {Component} from 'react'
import {getAllLocations,} from "../../../shared/queries"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import Menu from '../Menu'
import PropTypes from "prop-types"
import LocationView from "./LocationView"
import LocationDetails from "./LocationDetails"
import NewLocationForm from "./NewLocationForm"

class AllLocations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            showNewLocationModal: false
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.showNewLocationModal = this.showNewLocationModal.bind(this)
        this.closeNewLocationModal = this.closeNewLocationModal.bind(this)
    }

    onSelectLocation(id,name) {
        this.setState({id,name})
    }

    showNewLocationModal() {
        this.setState({showNewLocationModal: true})
    }

    closeNewLocationModal() {
        this.setState({showNewLocationModal: false})
    }


    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-2 col-md-2 bd-sidebar">
                        <Menu router={this.context.router} active="locations"/>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xl-5 bd-content">
                        <button className="btn btn-sm btn-dark" onClick={this.showNewLocationModal}>New location</button>
                        <br/>
                        <br/>
                        <NewLocationForm show={this.state.showNewLocationModal} onClose={this.closeNewLocationModal}/>
                        <Query
                            loadOnMount
                            loadOnReset
                            fetchOptionsOverride={fetchOptionsOverride}
                            // variables={{id: CurrentLocation.getLocationId()}}
                            query={getAllLocations}
                        >
                            {({loading, data}) => {
                                if (data) {
                                    if (data.getAllLocations && data.getAllLocations.length > 0) {
                                        return (
                                            <table className="table table-striped">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data.getAllLocations.map(location => {
                                                    return <LocationView location={location} onSelectLocation={this.onSelectLocation}/>

                                                })}
                                                </tbody>
                                            </table>)
                                    } else {
                                        return <p>No locations found</p>
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
                                <LocationDetails location={this.state.id} name={this.state.name}/></div>
                        </div>

                    </div>
                </div>

            </div>
        )

    }
}

AllLocations.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AllLocations

