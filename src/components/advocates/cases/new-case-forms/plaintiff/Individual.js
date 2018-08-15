import React, {Component} from 'react'
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
            dob: '',
            gender: '',
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
        if (localStorage.getItem("Plaintiff")) {
            let individual = JSON.parse(localStorage.getItem("Plaintiff")).plaintiff
            if (individual.type === 'individual') {
                this.state.names = individual.names
                this.state.gender = individual.gender
                this.state.cellphone = individual.cellphone
                this.state.email = individual.email
                this.state.dob = individual.dob
            }
        }
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
        if (validator.isEmpty(data.names)) {
            errors.names = 'This field is required'
        }
        if (!data.names.match(/[\sa-zA-Z]/g)) {
            errors.names = "Names can only contain letters and spaces"
        }
        if (data.names.split(" ").length<2) {
            errors.names = "You must provide at least 2 names"
        }
        if (validator.isEmpty(data.email)) {
            errors.email = 'This field is required'
        }
        if (!validator.isEmail(data.email)) {
            errors.email = 'You must provide a valid email format, eg. example@example.com'
        }
        if (validator.isEmpty(data.gender)) {
            errors.gender = 'This field is required'
        }
        if (validator.isEmpty(data.dob)) {
            errors.dob = 'This field is required'
        }
        if (Date.parse(data.dob) > Date.parse(new Date('2013'))) {
            errors.dob = "The plaintiff must be 5 and above"
        }
        if (Date.parse(data.dob) > Date.parse(new Date())) {
            errors.dob = "The plaintiff cannot be born in the future"
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
        const plaintiff = {
            type: this.state.type,
            names: this.state.names,
            cellphone: this.state.cellphone,
            email: this.state.email,
            gender: this.state.gender,
            dob: this.state.dob,
        }
        localStorage.setItem("Plaintiff", JSON.stringify({view: 'individual', plaintiff: plaintiff}))
        localStorage.setItem("view", "plaintiff")
        this.setState({errors: {}, isLoading: true})
        this.props.toDefendant()
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, names, post_address, dob, gender, message, email, cellphone
        } = this.state

        return (

            <form onSubmit={this.onSubmit}>
                {message && <div className="alert alert-success">{message}</div>}


                <TextFieldGroup
                    label="Full bames"
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
                    label="Date of birth"
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={this.onChange}
                    error={errors.dob}
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
                    <div className="col-sm-4 offset-sm-3">
                        <button className="form-control btn btn-success btn-sm"
                                onClick={this.props.toCaseDescription}>Back
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


export default Individual
