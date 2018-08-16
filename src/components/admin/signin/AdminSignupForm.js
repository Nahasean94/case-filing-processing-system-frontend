import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {registerAdmin} from '../../../shared/queries'
import {Consumer, Query} from "graphql-react"


class AdminSignupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            passwordConfirmation: '',
            errors: {},
            isLoading: false,
            invalid: false

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }


    validateInfo(data) {
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
        if (data.password.length<6) {
            errors.password = 'Password must be at least 6 characters'
        }
        // if (data.password.match(/[a-zA-Z0-9\s\&]/)) {
        //     errors.password = 'Password must be at least 6 characters'
        // }
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


    isInfoValid() {
        const {errors, isValid} = this.validateInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }


    onSubmit(e) {
        e.preventDefault()
        if (this.isInfoValid()) {
            this.setState({errors: {}, isLoading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            username: this.state.username,
                            password: this.state.password,
                        },
                        query: registerAdmin
                    }
                })
                .request.then(({data}) => {
                if (data) {
                    this.setState({
                            username: '',
                            password: '',
                            passwordConfirmation: '',
                            isLoading: false,
                            invalid: false,
                        }
                    )
                        this.props.adminSignedUp()
                }
            })
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, username, password, passwordConfirmation, message
        } = this.state

        return (

            <form onSubmit={this.onSubmit}>
                <div className="row">
                    <h2 className="offset-sm-4">Signup</h2>
                </div>
                {message && <div className="alert alert-success">{message}</div>}

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
        )
    }
}

AdminSignupForm
    .contextTypes = {
    router: PropTypes.object.isRequired
}
export default ({adminSignedUp}) => <Consumer>{graphql => <AdminSignupForm adminSignedUp={adminSignedUp}
                                                                                      graphql={graphql}/>}</Consumer>

// export default AdminSignupForm
