import React from 'react'
import {Consumer, Query} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {courtStations, isCourtAdminExists} from "../../../shared/queries"
import CourtAdminSignupForm from "./CourtAdminSignupForm"
import CourtAdminLoginForm from "./CourtAdminLoginForm"
import Select from 'react-select'

let courtStationOptions

class CourtAdminSignInPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCourtAdminExists: false,
            loading: false,
            court_station: '',
            message: '',
            error: false
        }
        this.adminSignedUp = this.adminSignedUp.bind(this)
        this.checkCourtAdminExists = this.checkCourtAdminExists.bind(this)
    }

    adminSignedUp() {
        this.setState({
            isCourtAdminExists: true,
            message: 'Admin account successfully created. Use the form below to login'
        })
    }

    checkCourtAdminExists(court_station) {
        this.setState({court_station: court_station})
        if (court_station) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            court_station: court_station.value
                        },
                        query: isCourtAdminExists
                    }
                })
                .request.then(({data, error, loading}) => {
                    if (data) {
                        this.setState({isCourtAdminExists: data.isCourtAdminExists.exists})
                    }
                    else if (loading) {
                        this.setState({loading: true})

                    } else if (error) {
                        this.setState({error: true})

                    }
                }
            )
        }
    }

    render() {
        const {loading, error, isCourtAdminExists, message, court_station} = this.state
        return (
            <div className='container'>
                {message && <div className="alert alert-success">{message}</div>}

                <div className='row'>
                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>}
                    {error && <div className="alert alert-danger">An error occurred. Please makes sure the server is
                        running</div>}
                    <div className="col-sm-4 offset-sm-3">
                        <Query
                            loadOnMount
                            loadOnReset
                            fetchOptionsOverride={fetchOptionsOverride}
                            query={courtStations}
                        >
                            {({loading, data}) => {
                                if (data) {
                                    courtStationOptions = data.courtStations.map(court_station => {
                                        return {
                                            label: court_station.name,
                                            value: court_station.id
                                        }
                                    })
                                    return <Select
                                        closeOnSelect={true}
                                        onChange={this.checkCourtAdminExists}
                                        options={courtStationOptions}
                                        placeholder="Search CourtStations"
                                        removeSelected={true}
                                        value={this.state.court_station}/>
                                }
                                else if (loading) {
                                    return <p>Loading…</p>
                                }
                                return <p>Loading failed.</p>
                            }
                            }
                        </Query>
                        <br/>
                        {!isCourtAdminExists && court_station ? <CourtAdminSignupForm adminSignedUp={this.adminSignedUp}
                                                                                     court_station={this.state.court_station.value}/> : court_station ?
                            <CourtAdminLoginForm court_station={this.state.court_station.value}/>

                            : <p>Select a court station</p>}
                    </div>
                </div>
            </div>
        )


    }
}

export default () => <Consumer>{graphql => <CourtAdminSignInPage graphql={graphql}/>}</Consumer>

