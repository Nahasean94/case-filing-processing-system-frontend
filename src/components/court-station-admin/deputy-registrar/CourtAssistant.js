import React from 'react'
import Menu from "../Menu"
import {Consumer} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import CourtAssistantView from "./CourtAssistantView"
import {getCourtAssistant, registerCourtAssistant} from "../../../shared/queries"
import PropTypes from 'prop-types'
import {isEmpty} from "lodash"
import validator from "validator"
import * as jwt from "jsonwebtoken"
import TextFieldGroup from "../../../shared/TextFieldsGroup"

class CourtAssistant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            username: '',
            password: '',
            passwordConfirmation: '',
            showNewCourtAssistantForm: false,
            courtAssistant: '',
            court_station: jwt.decode(localStorage.getItem('CourtSystem')).court_station,
            error: false,
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''
        }
        this.showNewCourtAssistantForm = this.showNewCourtAssistantForm.bind(this)
        this.closeNewCourtAssistantForm = this.closeNewCourtAssistantForm.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.username)) {
            errors.username = 'This field is required'
        }
        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required'
        }
        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required'
        }
        if (validator.isEmpty(data.passwordConfirmation)) {
            errors.passwordConfirmation = 'This field is required'
        }
        if (!validator.equals(data.password, data.passwordConfirmation)) {
            errors.passwordConfirmation = 'Passwords must match'
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
                            username: this.state.username,
                            password: this.state.password,
                            court_station: this.state.court_station,

                        },
                        query: registerCourtAssistant
                    }
                })
                .request.then(({data}) => {

                    if (data) {
                        this.setState({
                            username: '',
                            password: '',
                            passwordConfirmation: '',
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            loading: false,
                            courtAssistant: data.registerCourtAssistant,
                            message: data.registerCourtAssistant
                                ? <div className="alert alert-success" role="alert">Successfully added
                                    "{data.registerCourtAssistant.username}"
                                </div>
                                : <div className="alert alert-danger" role="alert">An error occurred while adding court
                                    assistant
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
                    variables: {
                        court_station: this.state.court_station,

                    },
                    query: getCourtAssistant
                }
            })
            .request.then(({data, loading, error}) => {
            if (data) {
                if (data.getCourtAssistant) {
                    this.setState({courtAssistant: data.getCourtAssistant})
                }
            } else if (loading) {

                this.setState({loading: true})
            } else if (error) {

                this.setState({error: true})
            }

        })
    }

    showNewCourtAssistantForm() {
        this.setState({showNewCourtAssistantForm: true})
    }

    closeNewCourtAssistantForm() {
        this.setState({showNewCourtAssistantForm: false})
    }

    render() {
        const {showNewCourtAssistantForm, courtAssistant, errors, error, loading,username,password,passwordConfirmation, message, isLoading, invalid} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm-3 col-md-3 bd-sidebar">
                    <Menu router={this.context.router} active="court-assistant"/>
                </div>
                <div className="col-sm-8 bd-content">
                    {!courtAssistant? !showNewCourtAssistantForm?
                        <button className="btn btn-sm btn-success" onClick={this.showNewCourtAssistantForm}><span><i
                            className="fa fa-plus"></i></span></button> :
                        <button className="btn btn-sm btn-success" onClick={this.closeNewCourtAssistantForm}><span><i
                            className="fa fa-angle-double-up"></i></span></button>:''}
                    <br/><br/>
                    {showNewCourtAssistantForm && !courtAssistant && <div>
                        {message && <div>{message}</div>}
                        <form onSubmit={this.onSubmit}>
                            <div className="row">
                                <h2 className="offset-sm-4">Create new court assistant account</h2>
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
                            <TextFieldGroup
                                label="Confirm Password "
                                type="password"
                                name="passwordConfirmation"
                                value={passwordConfirmation}
                                onChange={this.onChange}
                                error={errors.passwordConfirmation}
                            />

                            <div className="form-group ">
                                <div className="col-sm-9 offset-sm-3">
                                    <button disabled={isLoading || invalid}
                                            className="btn btn-dark btn-sm form-control"
                                            onClick={this.onSubmit}>Sign up
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>}
                    {courtAssistant ?
                        <table className="table ">
                            <thead>
                            <tr>
                                <th scope="col">Username</th>
                            </tr>
                            </thead>
                            <tbody>
                            <CourtAssistantView courtAssistant={courtAssistant}/>

                            </tbody>
                        </table> : <div className="alert alert-dark">No court assistant found</div>}

                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>
                    }
                    {error && <div className="alert alert-dark">An error occurred while fetching court assistants</div>}


                </div>

            </div>
        </div>)
    }
}

CourtAssistant.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <CourtAssistant graphql={graphql}/>}</Consumer>
