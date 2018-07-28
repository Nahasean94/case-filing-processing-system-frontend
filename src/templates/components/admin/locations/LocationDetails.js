import React, {Component} from 'react'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import PropTypes from "prop-types"
import {findGuardsInLocation} from "../../../shared/queries"
import EditLocation from "./EditLocation"

class LocationDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showUpdateLocationModal: false,
        }

        this.showUpdateLocationModal = this.showUpdateLocationModal.bind(this)
        this.closeUpdateLocationModal = this.closeUpdateLocationModal.bind(this)
    }

    showUpdateLocationModal() {
        this.setState({showUpdateLocationModal: true})
    }

    closeUpdateLocationModal() {
        this.setState({showUpdateLocationModal: false})
    }

    render() {
        return (
            this.props.location ? <div className="container-fluid">
                <div className="row">
                    <h2 className="offset-sm-4">Location Details </h2>
                    <br/><br/>
                    <div>Location: <strong>{this.props.name}</strong>
                        &nbsp;
                        <span><i className="fa fa-pencil" onClick={this.showUpdateLocationModal}></i></span>
                    </div>
                </div>
                    <hr/>
                    <div><Query
                        loadOnMount
                        loadOnReset
                        fetchOptionsOverride={fetchOptionsOverride}
                        variables={{id: this.props.location}}
                        query={findGuardsInLocation}
                    >
                        {({loading, data}) => {
                            if (data) {
                                if (data.findGuardsInLocation && data.findGuardsInLocation.length > 0) {
                                    return (<div>
                                            <h5>Guards</h5>
                                            <table className="table table-borderless">
                                                <thead>
                                                <th scope="col">Guard Id</th>
                                                <th scope="col">First name</th>
                                                <th scope="col">Last name</th>
                                                <th scope="col">Gender</th>
                                                </thead>
                                                <tbody>
                                                {data.findGuardsInLocation.map(guard => {
                                                    return <tr>
                                                        <td>{guard.guard_id}</td>
                                                        <td>{guard.first_name}</td>
                                                        <td>{guard.last_name}</td>
                                                        <td>{guard.gender}</td>
                                                    </tr>
                                                })}

                                                </tbody>
                                            </table>
                                            <Consumer>{graphql => <EditLocation graphql={graphql}
                                                                                show={this.state.showUpdateLocationModal}
                                                                                onClose={this.closeUpdateLocationModal}
                                                                                name={this.props.name} location={this.props.location}/>}</Consumer>
                                        </div>
                                    )
                                } else {
                                    return <p>No guards found</p>
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
            </div> : <p>Select location to view details</p>)

    }
}

LocationDetails.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LocationDetails

