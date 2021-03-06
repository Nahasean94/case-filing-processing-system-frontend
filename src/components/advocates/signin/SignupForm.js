import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {isAdvocateExists, registerAdvocate} from '../../../shared/queries'
import {Consumer} from "graphql-react"


class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            practice_number: '',
            surname: '',
            first_name: '',
            last_name: '',
            dob: '',
            gender: '',
            password: '',
            passwordConfirmation: '',
            message: '',
            email: '',
            cellphone: '',
            errors: {},
            isLoading: false,
            invalid: false

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkAdvocateExists = this.checkAdvocateExists.bind(this)

    }

    checkAdvocateExists(e) {
        console.log("checking")
        if (this.state.practice_number) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            practice_number: this.state.practice_number,
                        },
                        query: isAdvocateExists
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        if (data.isAdvocateExists.exists) {
                            let errors = {}
                            errors.practice_number = 'An advocate with that practice number already exists'
                            this.setState({errors})
                        }
                        else {
                            this.setState({errors: {}})
                        }
                    }
                }
            )
        }
    }

    validateInfo(data) {
        let errors = {}
        if (!data.practice_number) {
            errors.practice_number = 'This field is required'
        }
        if (validator.isEmpty(data.first_name)) {
            errors.first_name = 'This field is required'
        }
        if (validator.isEmpty(data.last_name)) {
            errors.last_name = 'This field is required'
        }
        if (validator.isEmpty(data.gender)) {
            errors.gender = 'This field is required'
        }
        if (validator.isEmpty(data.dob)) {
            errors.dob = 'This field is required'
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
        if (Date.parse(data.dob) > Date.parse(new Date('2000'))) {
            errors.dob = "An advocate should be at least 18 years"
        }
        if (Date.parse(data.dob) < Date.parse(new Date('1956'))) {
            errors.dob = 'You should be retired by now'
        }
        if (Date.parse(data.dob)> Date.parse(new Date())) {
            errors.dob = 'You cannot be born in the future'
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
                            practice_number: this.state.practice_number,
                            surname: this.state.surname,
                            first_name: this.state.first_name,
                            last_name: this.state.last_name,
                            dob: this.state.dob,
                            gender: this.state.gender,
                            password: this.state.password,
                            email: this.state.email,
                            cellphone: this.state.cellphone,

                        },
                        query: registerAdvocate
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.setState({
                            practice_number: '',
                            surname: '',
                            first_name: '',
                            last_name: '',
                            dob: '',
                            gender: '',
                            password: '',
                            passwordConfirmation: '',
                            email: '',
                            cellphone: '',
                            isLoading: false,
                            invalid: false,

                        })
                        this.props.createdAccount()

                    }
                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, practice_number, surname, first_name, last_name, dob, gender, password, passwordConfirmation, message, email, cellphone
        } = this.state

        return (

            <form onSubmit={this.onSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
                <h1>Create advocate account</h1>
                <TextFieldGroup
                    label="Practice Number"
                    type="number"
                    name="practice_number"
                    value={practice_number}
                    onChange={this.onChange}
                    error={errors.practice_number}
                    checkIfExists={this.checkAdvocateExists}

                />

                <TextFieldGroup
                    label="Surname"
                    type="text"
                    name="surname"
                    value={surname}
                    onChange={this.onChange}
                    error={errors.surname}

                />
                <TextFieldGroup
                    label="First name"
                    type="text"
                    name="first_name"
                    value={first_name}
                    onChange={this.onChange}
                    error={errors.first_name}

                />
                <TextFieldGroup
                    label="Last name"
                    type="text"
                    name="last_name"
                    value={last_name}
                    onChange={this.onChange}
                    error={errors.last_name}

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

                <TextFieldGroup
                    label="Date of birth"
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={this.onChange}
                    error={errors.dob}

                />

                <TextFieldGroup
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    error={errors.email}

                />
                <TextFieldGroup
                    label="Phone number"
                    type="number"
                    name="cellphone"
                    value={cellphone}
                    onChange={this.onChange}
                    error={errors.cellphone}

                />

                <div className="form-group row">
                    <label className="col-sm-3 col-form-label" htmlFor="gender">Gender</label>
                    <div className="col-sm-9">
                        <select className="form-control form-control-sm" id="gender" name="gender"
                                required="true" value={gender} onChange={this.onChange}>
                            <option>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-9 offset-sm-3">
                        <button disabled={isLoading || invalid}
                                className="btn btn-dark btn-sm form-control"
                                onClick={this.forwardToContactDetails}>Sign up
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

SignupForm.contextTypes = {
    router: PropTypes.object.isRequired
}

export default ({createdAccount}) => <Consumer>{graphql => <SignupForm createdAccount={createdAccount}
                                                                       graphql={graphql}/>}</Consumer>
