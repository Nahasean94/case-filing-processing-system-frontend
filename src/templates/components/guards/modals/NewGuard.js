import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {locations, registerGuard} from '../../../shared/queries'
import {Query} from "graphql-react"
import Select from 'react-select'


let locationOptions

class NewGuard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            guard_id: '',
            surname: '',
            first_name: '',
            last_name: '',
            dob: '',
            gender: '',
            nationalID: '',
            employment_date: '',
            password: '',
            passwordConfirmation: '',
            message: '',
            email: '',
            cellphone: '',
            postal_address: '',
            location: '',
            gross: 0,
            nssf: 0,
            paye: 0,
            nhif: 0,
            contract: '',
            loans: 0,
            others: 0,
            display: 'personal',
            errors: {},
            isLoading: false,
            invalid: false

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.backToPersonalDetails = this.backToPersonalDetails.bind(this)
        this.forwardToContactDetails = this.forwardToContactDetails.bind(this)
        this.backToContactDetails = this.backToContactDetails.bind(this)
        this.forwardToPaymentDetails = this.forwardToPaymentDetails.bind(this)
        this.backToPaymentDetails = this.backToPaymentDetails.bind(this)
        this.handleLocationChange = this.handleLocationChange.bind(this)
        // this.selectPaymentContract = this.selectPaymentContract.bind(this)
    }

    // selectPaymentContract(e){
    // this.setState({contract:e.target.value})
    // }
    handleLocationChange = (location) => {
        this.setState({location})
    }

    backToPersonalDetails(e) {
        e.preventDefault()
        this.setState({display: 'personal'})
    }

    forwardToContactDetails(e) {
        e.preventDefault()
        if (this.isPersonalInfoValid()) {
            this.setState({display: 'contact'})
        }
    }

    backToContactDetails(e) {
        e.preventDefault()
        this.setState({display: 'contact'})
    }

    forwardToPaymentDetails(e) {
        e.preventDefault()
        if (this.isContactInfoValid()) {
            this.setState({display: 'payment'})
        }
    }

    backToPaymentDetails(e) {
        e.preventDefault()
        this.setState({display: 'payment'})
    }

    validatePersonalInfo(data) {
        let errors = {}
        if (!data.guard_id) {
            errors.guard_id = 'This field is required'
        }
        if (!data.nationalID) {
            errors.nationalID = 'This field is required'
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
            errors.dob = "A guard must be 18 and above"
        }
        if (validator.isEmpty(data.employment_date)) {
            errors.employment_date = 'This field is required'
        }
        if (Date.parse(data.dob) > Date.parse(data.employment_date)) {
            errors.employment_date = 'You cannot be employed before you are born'
        }
        if (Date.parse(data.employment_date) > Date.parse(new Date())) {
            errors.employment_date = 'You cannot be employed in the future'
        }

        if (Date.parse(data.employment_date) < Date.parse(new Date('1976'))) {
            errors.dob = 'You should be retired by now'
        }
        if (Date.parse(data.dob) < Date.parse(new Date('1956'))) {
            errors.dob = 'You should be retired by now'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    validateContactInfo(data) {
        let errors = {}
        if (validator.isEmpty(data.email)) {
            errors.email = 'This field is required'
        }
        if (!data.cellphone) {
            errors.cellphone = 'This field is required'
        }
        if (data.cellphone.length < 10 || data.cellphone.length > 10) {
            errors.cellphone = 'Phone number must be 10 digits'
        }
        let {location} = this.state
        location = location.value
        if (validator.isEmpty(location)) {
            errors.location = 'This field is required'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    validatePaymentInfo(data) {
        let errors = {}
        if (!data.gross) {
            errors.gross = 'This field is required'
        }
        if (!data.contract) {
            errors.contract = 'This field is required'

        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isPersonalInfoValid() {
        const {errors, isValid} = this.validatePersonalInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    isContactInfoValid() {
        const {errors, isValid} = this.validateContactInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    isPaymentValid() {
        const {errors, isValid} = this.validatePaymentInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSubmit(e) {
        e.preventDefault()
        if (this.isPaymentValid() || !this.state.invalid) {
            console.log(this.state)
            this.setState({errors: {}, isLoading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            guard_id: this.state.guard_id,
                            surname: this.state.surname,
                            first_name: this.state.first_name,
                            last_name: this.state.last_name,
                            dob: this.state.dob,
                            gender: this.state.gender,
                            nationalID: this.state.nationalID,
                            employment_date: this.state.employment_date,
                            password: this.state.password,
                            email: this.state.email,
                            cellphone: this.state.cellphone,
                            postal_address: this.state.postal_address,
                            location: this.state.location.value,
                            contract: this.state.contract,
                            gross: this.state.gross,
                            paye: this.state.paye,
                            nssf: this.state.nssf,
                            nhif: this.state.nhif,
                            loans: this.state.loans,
                            others: this.state.others,
                        },
                        query: registerGuard
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.setState({
                            guard_id: '',
                            surname: '',
                            first_name: '',
                            last_name: '',
                            dob: '',
                            gender: '',
                            nationalID: '',
                            employment_date: '',
                            password: '',
                            passwordConfirmation: '',
                            email: '',
                            cellphone: '',
                            postal_address: '',
                            contract:'',
                            location: '',
                            gross: 0,
                            paye: 0,
                            nssf: 0,
                            nhif: 0,
                            loans: 0,
                            others: 0,
                            errors: {},
                            display: 'personal',
                            isLoading: false,
                            invalid: false,
                            message: data.registerGuard
                                ? this.setState({message: 'Personal Details successfully added'})
                                : this.setState({message: 'Registration Failed'})
                        })
                        this.props.onClose()

                    }
                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {show, onClose} = this.props

        const {
            errors, isLoading, invalid, guard_id, surname, first_name, last_name, dob, gender, nationalID, employment_date, password, passwordConfirmation, display, message, email, cellphone, postal_address, location, gross, paye, nssf, nhif, loans, others, contract
        } = this.state
        const monthly = <TextFieldGroup
            label="Mothly Salary"
            type="number"
            name="gross"
            value={gross}
            onChange={this.onChange}
            error={errors.gross}
        />
        const weekly = <TextFieldGroup
            label="Weekly Salary"
            type="number"
            name="gross"
            value={gross}
            onChange={this.onChange}
            error={errors.gross}
        />
        const hourly = <TextFieldGroup
            label="Hourly rate"
            type="number"
            name="gross"
            value={gross}
            onChange={this.onChange}
            error={errors.gross}
        />
        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog-centered">
                    <ModalHeader toggle={onClose}>Register new guard</ModalHeader>
                    <ModalBody>
                        {display === 'personal' && <form>
                            <TextFieldGroup
                                label="Guard ID"
                                type="number"
                                name="guard_id"
                                value={guard_id}
                                onChange={this.onChange}
                                error={errors.guard_id}
                                disabled={true}
                            />

                            <TextFieldGroup
                                label="Surname"
                                type="text"
                                name="surname"
                                value={surname}
                                onChange={this.onChange}
                                error={errors.surname}
                                disabled={true}
                            />
                            <TextFieldGroup
                                label="First name"
                                type="text"
                                name="first_name"
                                value={first_name}
                                onChange={this.onChange}
                                error={errors.first_name}
                                disabled={true}
                            />
                            <TextFieldGroup
                                label="Last name"
                                type="text"
                                name="last_name"
                                value={last_name}
                                onChange={this.onChange}
                                error={errors.last_name}
                                disabled={true}
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
                                disabled={true}
                            />

                            <TextFieldGroup
                                label="National ID"
                                type="number"
                                name="nationalID"
                                value={nationalID}
                                onChange={this.onChange}
                                error={errors.nationalID}
                                disabled={true}

                            />

                            <TextFieldGroup
                                label="Date of Employment"
                                type="date"
                                name="employment_date"
                                value={employment_date}
                                onChange={this.onChange}
                                error={errors.employment_date}
                                disabled={true}
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
                                <div className="col-sm-4 offset-sm-8">
                                    <button disabled={isLoading || invalid}
                                            className="btn btn-dark btn-sm form-control"
                                            onClick={this.forwardToContactDetails}>Next
                                    </button>
                                </div>
                            </div>
                        </form>}
                        {display === 'contact' && <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                label="Email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                error={errors.email}
                                disabled={true}
                            />
                            <TextFieldGroup
                                label="Phone number"
                                type="number"
                                name="cellphone"
                                value={cellphone}
                                onChange={this.onChange}
                                error={errors.cellphone}
                                disabled={true}
                            />
                            <TextFieldGroup
                                label="Postal address (P.O Box)"
                                type="text"
                                name="postal_address"
                                value={postal_address}
                                onChange={this.onChange}
                                error={errors.postal_address}
                                disabled={true}
                            />
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="hosts">Location
                                    deployed</label>
                                <div className="col-sm-9">
                                    <Query
                                        loadOnMount
                                        loadOnReset
                                        fetchOptionsOverride={fetchOptionsOverride}
                                        query={locations}
                                    >
                                        {({loading, data}) => {
                                            if (data) {
                                                locationOptions = data.locations.map(location => {
                                                    return {
                                                        label: location.name,
                                                        value: location.id
                                                    }
                                                })
                                                return <Select
                                                    closeOnSelect={true}
                                                    onChange={this.handleLocationChange}
                                                    options={locationOptions}
                                                    placeholder="Search locations"
                                                    removeSelected={true}
                                                    value={this.state.location}/>
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
                            <div className="form-group row">
                                <div className="col-sm-3 offset-sm-3">
                                    <button disabled={isLoading || invalid}
                                            className="btn btn-secondary btn-sm form-control"
                                            onClick={this.backToPersonalDetails}>Back
                                    </button>
                                </div>
                                <div className="col-sm-3">
                                    <button disabled={isLoading || invalid}
                                            className="btn btn-dark btn-sm form-control"
                                            onClick={this.forwardToPaymentDetails}>Next
                                    </button>
                                </div>
                            </div>
                        </form>}
                        {display === 'payment' && <form onSubmit={this.onSubmit}>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label" htmlFor="contract">Payment Contract</label>
                                <div className="col-sm-9">
                                    <select className="form-control form-control-sm" id="contract" name="contract"
                                            required="true" value={contract} onChange={this.onChange}>
                                        <option>Select</option>
                                        <option value="month">Monthly</option>
                                        <option value="week">Weekly</option>
                                        <option value="day">Daily</option>
                                    </select>
                                    {errors.payment && <div className="invalid-feedback">{errors.payment}</div>}
                                </div>
                            </div>
                            {contract === 'month' && monthly}
                            {contract === 'week' && weekly}
                            {contract === 'day' && hourly}
                            <TextFieldGroup
                                label="PAYE"
                                type="number"
                                name="paye"
                                value={paye}
                                onChange={this.onChange}
                                error={errors.paye}
                            />
                            <TextFieldGroup
                                label="NHIF"
                                type="number"
                                name="nhif"
                                value={nhif}
                                onChange={this.onChange}
                                error={errors.nhif}
                            />
                            <TextFieldGroup
                                label="NSSF"
                                type="number"
                                name="nssf"
                                value={nssf}
                                onChange={this.onChange}
                                error={errors.nssf}
                            />
                            <TextFieldGroup
                                label="Loans"
                                type="number"
                                name="loans"
                                value={loans}
                                onChange={this.onChange}
                                error={errors.loans}
                            />
                            <TextFieldGroup
                                label="Others"
                                type="number"
                                name="others"
                                value={others}
                                onChange={this.onChange}
                                error={errors.others}
                            />

                            <div className="form-group row">
                                <div className="col-sm-3 offset-sm-3">
                                    <button disabled={isLoading || invalid}
                                            className="btn btn-secondary btn-sm form-control"
                                            onClick={this.backToContactDetails}>Back
                                    </button>
                                </div>
                                <div className="col-sm-3">
                                    <button disabled={isLoading || invalid}
                                            className="btn btn-dark btn-sm form-control"
                                            type="submit" onClick={this.onSubmit}>Save
                                    </button>
                                </div>
                            </div>
                        </form>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
                    </ModalFooter>
                </Modal>
            )
        }
        else return null
    }

}


NewGuard.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}
NewGuard.contextTypes = {
    router: PropTypes.object.isRequired
}

export default NewGuard