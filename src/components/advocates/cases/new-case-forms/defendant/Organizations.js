import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../../../shared/TextFieldsGroup"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../../../shared/fetchOverrideOptions"
import {isAdvocateExists} from '../../../../../shared/queries'


class Organization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'organization',
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

        if (localStorage.getItem("Defendant")) {
            let organization = JSON.parse(localStorage.getItem("Defendant")).defendant
            if(organization.type==='organization'){
            this.state.name = organization.name
            this.state.cellphone = organization.cellphone
            this.state.location = organization.location
            this.state.postal_address = organization.postal_address
            }
        }

    }

    checkAdvocateExists(e) {
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
        // if (this.isInfoValid()) {
        this.setState({errors: {}, isLoading: true})
        const defendant = {
            type: this.state.type,
            name: this.state.name,
            cellphone: this.state.cellphone,
            location: this.state.location,
            postal_address: this.state.postal_address,
        }
        localStorage.setItem("Defendant", JSON.stringify({view: 'organization', defendant: defendant}))
        localStorage.setItem("view","defendant")
        this.props.toForms()

        // }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, practice_number, name, first_name, location, dob, gender, password, passwordConfirmation, message, postal_address, cellphone
        } = this.state

        return (

            <form onSubmit={this.onSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
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
                    label="Postal address"
                    type="text"
                    name="postal_address"
                    value={postal_address}
                    onChange={this.onChange}
                    error={errors.postal_address}
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
                    <div className="col-sm-4 offset-sm-3">
                        <button className="form-control btn btn-success btn-sm"
                                onClick={this.props.toPlaintiff}>Back
                        </button>
                    </div>
                    <div className="col-sm-4 offset-sm-1">
                        <button className="form-control btn btn-dark btn-sm"
                                onClick={this.onSubmit}>Next
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

Organization.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Organization
