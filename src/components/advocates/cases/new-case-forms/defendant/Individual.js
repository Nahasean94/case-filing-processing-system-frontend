import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../../../shared/TextFieldsGroup"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../../../shared/fetchOverrideOptions"
import {isAdvocateExists} from '../../../../../shared/queries'


class Individual extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'individual',
            names: '',
            gender: '',
            cellphone: '',
            errors: {},
            isLoading: false,
            invalid: false

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkAdvocateExists = this.checkAdvocateExists.bind(this)

        if (localStorage.getItem("Defendant")) {
            let individual = JSON.parse(localStorage.getItem("Defendant")).defendant
            if (individual.type === 'individual') {
                this.state.names = individual.names
                this.state.cellphone = individual.cellphone
                this.state.email = individual.email
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
        if (validator.isEmpty(data.names)) {
            errors.names = 'This field is required'
        }
        if (!data.names.match(/[\a-zA-Z]/g)) {
            errors.names = "Organization name can only contain letters and spaces"
        }
        if (data.names.length<=2) {
            errors.names = "Organization name must have more than 2 letters"
        }
        if (validator.isEmpty(data.email)) {
            errors.email = 'This field is required'
        }
        if (!validator.isEmail(data.email)) {
            errors.email = 'You must provide a valid email format, eg. example@example.com'
        }
        if (!data.cellphone) {
            errors.cellphone = 'This field is required'
        }
        if (data.cellphone.length<10||data.cellphone.length>10) {
            errors.cellphone = 'Phone number must be 10 numbers'
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
        const defendant = {
            type: this.state.type,
            names: this.state.names,
            cellphone: this.state.cellphone,
            email: this.state.email,
        }
        localStorage.setItem("Defendant", JSON.stringify({view: 'individual', defendant: defendant}))
        localStorage.setItem("view", "defendant")
        this.setState({errors: {}, isLoading: true})
        this.props.toForms()
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, names,  message, email, cellphone
        } = this.state

        return (

            <form onSubmit={this.onSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
                <TextFieldGroup
                    label="Full names"
                    type="text"
                    name="names"
                    value={names}
                    onChange={this.onChange}
                    error={errors.names}
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

Individual.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Individual
