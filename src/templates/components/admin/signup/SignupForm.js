import React from 'react'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../../shared/TextFieldsGroup'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {signup} from "../../../shared/queries"



class SignupForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.username)) {
            errors.username = 'This field is required'
        }
        if (validator.isEmpty(data.email)) {
            errors.email = 'This field is required'
        }
        if (!validator.isEmail(data.email)) {
            errors.email = 'This field must be an email'
        }

        if (data.password.length<8) {
            errors.password = 'Password must be at least 8 characters'
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
                            email: this.state.email,
                            password: this.state.password,
                        },
                        query: signup
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.setState({
                            username: '',
                            email: '',
                            password: '',
                            passwordConfirmation: '',
                            role: '',
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            loading: false,
                            message: data
                                ? `You can now use your email and password to log in.`
                                : `Signup failed.`
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
        const {errors, loading, message} = this.state
        if (loading) {
            return <p>Creating account…</p>
        }
        if (message) {
            return <div className="alert alert-dark">{message}</div>
        }
        return (
            <form onSubmit={this.onSubmit}>
                <h3>Create an admin account</h3>

                <TextFieldGroup
                    label="Username"
                    type="username"
                    name="username"
                    value={this.state.username} autoFocus={true}
                    onChange={this.onChange}
                    error={errors.username}
                />
                <TextFieldGroup
                    label="Email"
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                />
                <TextFieldGroup
                    label="Password"
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                />
                <TextFieldGroup
                    label="Confirm Password "
                    type="password"
                    name="passwordConfirmation"
                    value={this.state.passwordConfirmation}
                    onChange={this.onChange}
                    error={errors.passwordConfirmation}
                />

                <div className="form-group row">
                    <div className="col-sm-9 offset-3">
                    <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-dark btn-sm form-control "
                            type="submit">Sign up
                    </button>
                    </div>
                </div>
            </form>
        )
    }
}

export default SignupForm