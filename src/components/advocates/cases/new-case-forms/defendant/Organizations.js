import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../../../shared/TextFieldsGroup"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../../../shared/fetchOverrideOptions"
import {isAdvocateExists, registerAdvocate} from '../../../../../shared/queries'
import {Consumer} from "graphql-react"


class Organization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type:'organization',
            name: '',
            cellphone: '',
            location: '',
            postal_address: '',
            errors: {},
            isLoading: false,
            invalid: false,


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

        if (validator.isEmpty(data.location)) {
            errors.location = 'This field is required'
        }
        if (validator.isEmpty(data.gender)) {
            errors.gender = 'This field is required'
        }
        if (validator.isEmpty(data.dob)) {
            errors.dob = 'This field is required'
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

        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, practice_number, name, first_name, location, dob, gender, password, passwordConfirmation, message, email, cellphone
        } = this.state

        return (

            <form onSubmit={this.onSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
                <h1>Add details of the plaintiff</h1>

                <TextFieldGroup
                    label="Names"
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    error={errors.name}
                />

                <TextFieldGroup
                    label="Location"
                    type="text"
                    name="location"
                    value={location}
                    onChange={this.onChange}
                    error={errors.location}
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
                {/*<div className="form-group row">*/}
                    {/*<div className="col-sm-9 offset-sm-3">*/}
                        {/*<button disabled={isLoading || invalid}*/}
                                {/*className="btn btn-dark btn-sm form-control"*/}
                                {/*onClick={this.forwardToContactDetails}>Sign up*/}
                        {/*</button>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </form>
        )
    }
}

Organization.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Organization
