import React, {Component} from 'react'
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
            email: '',
            cellphone: '',
            post_address: '',
            errors: {},
            isLoading: false,
            invalid: false,

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkAdvocateExists = this.checkAdvocateExists.bind(this)
        if (localStorage.getItem("Plaintiff")) {
            let organization = JSON.parse(localStorage.getItem("Plaintiff")).plaintiff
            if (organization.type === 'organization') {
                this.state.name = organization.name
                this.state.email = organization.email
                this.state.post_address = organization.post_address
                this.state.post_address = organization.post_address
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

    valiemailInfo(data) {
        let errors = {}
        if (!data.practice_number) {
            errors.practice_number = 'This field is required'
        }
        if (validator.isEmpty(data.gender)) {
            errors.gender = 'This field is required'
        }
        if (validator.isEmpty(data.email)) {
            errors.email = 'This field is required'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }


    isInfoValid() {
        const {errors, isValid} = this.valiemailInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }


    onSubmit(e) {
        e.preventDefault()
        // if (this.isInfoValid()) {
        const plaintiff = {
            type: this.state.type,
            name: this.state.name,
            cellphone: this.state.cellphone,
            email: this.state.email,
            post_address: this.state.post_address,
        }
        localStorage.setItem("Plaintiff", JSON.stringify({view: 'organization', plaintiff: plaintiff}))
        localStorage.setItem("view", "plaintiff")
        this.setState({errors: {}, isLoading: true})
        this.props.toDefendant()

        // }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const {
            errors, isLoading, invalid, name, post_address, email, message, cellphone
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
                    label="PO Box"
                    type="text"
                    name="post_address"
                    value={post_address}
                    onChange={this.onChange}
                    error={errors.post_address}
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


export default Organization
