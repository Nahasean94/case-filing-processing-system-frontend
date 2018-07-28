import React from 'react'
import Menu from "../Menu"
import {Consumer} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import CourtStationView from "./CourtSationView"
import {addCourtStation, courtStations, isCourtStationExists} from "../../../shared/queries"
import PropTypes from 'prop-types'
import {isEmpty} from "lodash"
import validator from "validator"
import TextFieldGroup from '../../../shared/TextFieldsGroup'

class CourtStations extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            showNewCourtStationForm: false,
            courtStations: [],
            error: false,
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.showNewCourtStationForm = this.showNewCourtStationForm.bind(this)
        this.closeNewCourtStationForm = this.closeNewCourtStationForm.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkLocationExists = this.checkLocationExists.bind(this)
    }

    checkLocationExists() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        name: this.state.name,
                    },
                    query: isCourtStationExists
                }
            })
            .request.then(({data}) => {

            if (data) {
                if (data.isCourtStationExists.exists) {
                    let errors = {}
                    errors.name = 'A location with that name already exists'
                    this.setState({errors, invalid: true,})
                } else {
                    let errors = {}
                    this.setState({errors, invalid: false,})
                }
            }
        })

    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.name)) {
            errors.name = 'This field is required'
        }


        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateInput(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            name: this.state.name,
                        },
                        query: addCourtStation
                    }
                })
                .request.then(({data}) => {

                    if (data) {
                        this.setState({
                            name: '',
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            loading: false,
                            message: data.addCourtStation
                                ? <div className="alert alert-success" role="alert">Successfully added court station
                                    "{data.addCourtStation.name}"
                                </div>
                                : <div className="alert alert-danger" role="alert">An error occurred while adding location
                                </div>
                        })
                    }
                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }






    componentDidMount() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    query: courtStations
                }
            })
            .request.then(({data, loading, error}) => {
            if (data) {
                if (data.courtStations.length > 0) {
                    this.setState({courtStations: data.courtStations})
                } else {
                    this.setState({message: 'No court stations found'})
                }
            } else if (loading) {

                this.setState({loading: true})
            } else if (error) {

                this.setState({error: true})
            }

        })
    }

    onSelectLocation(id, name) {
        this.setState({id, name})
    }

    showNewCourtStationForm() {
        this.setState({showNewCourtStationForm: true})
    }

    closeNewCourtStationForm() {
        this.setState({showNewCourtStationForm: false})
    }

    render() {
        const {showNewCourtStationForm, courtStations, errors,error, loading, message, isLoading, invalid} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm-3 col-md-3 bd-sidebar">
                    <Menu router={this.context.router} active="court-station"/>
                </div>
                <div className="col-sm-8 bd-content">
                    {!showNewCourtStationForm ?
                        <button className="btn btn-sm btn-success" onClick={this.showNewCourtStationForm}><span><i
                            className="fa fa-plus"></i></span></button> :
                        <button className="btn btn-sm btn-success" onClick={this.closeNewCourtStationForm}><span><i
                            className="fa fa-angle-double-up"></i></span></button>}
                    <br/><br/>
                    {showNewCourtStationForm && <div>
                        {message && <div>{message}</div>}
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                label="Name"
                                type="name"
                                name="name"
                                value={this.state.name} autoFocus={true}
                                onChange={this.onChange}
                                error={errors.name}
                                checkLocationExists={this.checkLocationExists}
                            />
                            <div className="form-group row">
                                <div className="col-sm-9 offset-sm-3 ">
                                    <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                            type="submit">Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>}
                    {courtStations.length > 0 ?
                        <table className="table ">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courtStations.map(station => {
                                return <CourtStationView station={station}/>

                            })}
                            </tbody>
                        </table> : <div className="alert alert-dark">No stations found</div>}

                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>
                    }
                    {error && <div className="alert alert-dark">An error occurred while fetching court stations</div>}


                </div>

            </div>
        </div>)
    }
}

CourtStations.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <CourtStations graphql={graphql}/>}</Consumer>
