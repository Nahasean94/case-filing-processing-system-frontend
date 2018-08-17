import React from 'react'
import PropTypes from 'prop-types'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../shared/TextFieldsGroup'
import {setLoginToken} from "../../actions/courtAssistantLoginActions"
import {connect} from 'react-redux'
import {fetchOptionsOverride} from "../../shared/fetchOverrideOptions"
import {courtAssistantLogin, courtStations} from '../../shared/queries'
import {Consumer, Query} from "graphql-react"
import Select from 'react-select'

let courtStationOptions

class CourtAssistantLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            court_station: '',
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: '',
            error: ''

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleCourtStationChange = this.handleCourtStationChange.bind(this)
    }

    handleCourtStationChange(court_station) {
        this.setState({court_station})
    }

    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.username)) {
            errors.username = 'This field is required'
        }
        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required'
        }
        // if (!data.court_station.value) {
        //     // let errors={}
        //     errors.form = 'You must select a court station'
        //     // this.setState({errors:errors,invalid:true})
        // } else {
        //     // this.setState({errors:'',invalid:false})
        //     errors.form = ''
        // }
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
            this.setState({loading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            username: this.state.username,
                            password: this.state.password,
                            court_station: this.state.court_station.value
                        },
                        query: courtAssistantLogin
                    }
                })
                .request.then(({data}) => {

                    if (data.courtAssistantLogin.token === null || !data.courtAssistantLogin.ok) {
                        this.setState({errors: {form: data.courtAssistantLogin.error}, isLoading: false})
                    }
                    else {
                        this.props.setLoginToken(data.courtAssistantLogin.token)
                        this.context.router.history.push('/assistant/dashboard/pending-cases')
                        this.setState({
                            loading: false,
                            message: data
                                ? `Logged in.`
                                : `Logging failed.`
                        })

                    }

                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {errors, password, username, invalid, isLoading, message} = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-5 offset-sm-3">
                        <form onSubmit={this.onSubmit}>

                            {message && <div className="alert alert-success">{message}</div>}
                            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                            <div className="row">
                                <h2 className="offset-sm-4">Login</h2>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">Court station</label>
                                <div className="col-sm-9">
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
                                                    onChange={this.handleCourtStationChange}
                                                    options={courtStationOptions}
                                                    placeholder="Search Court Stations"
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
                                </div>
                            </div>
                            <TextFieldGroup
                                label="Username"
                                type="text"
                                name="username"
                                value={username}
                                onChange={this.onChange}
                                error={errors.username}
                                autoFocus={true}
                            />
                            <TextFieldGroup
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.onChange}
                                error={errors.password}
                            />
                            <div className="form-group row">
                                <div className="col-sm-9 offset-3">
                                    <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                            type="submit">Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

CourtAssistantLogin.propTypes = {
    setLoginToken: PropTypes.func.isRequired,
}
CourtAssistantLogin.contextTypes = {
    router: PropTypes.object.isRequired
}
const exportLogin = ({setLoginToken}) => <Consumer>{graphql => <CourtAssistantLogin setLoginToken={setLoginToken}
                                                                                    graphql={graphql}/>}</Consumer>
export default connect(null, {setLoginToken})(exportLogin)