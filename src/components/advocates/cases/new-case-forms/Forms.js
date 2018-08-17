import React, {Component} from 'react'
import {addForm, clearForms, deleteForm, updateForm} from "../../../../actions/formActions"
import validator from "validator"
import {isEmpty} from "lodash"
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"
import {confirmPayment, findCaseForms} from "../../../../shared/queries"
import Select from 'react-select'
import Form from "./forms/Form"
import ProceedToPay from "./forms/ProceedToPay"
import {Consumer} from 'graphql-react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

let caseFormOptions

class Forms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: '',
            forms: '',
            payable: false,
            errors: {},
            paid: false,
            confirmed: false,
            showProceedToPay: false,
            checkout_id: ''
        }
        // if (localStorage.getItem("Forms")) {
        //     const forms = JSON.parse(localStorage.getItem("Forms"))
        //     this.props.clearForms()
        //     forms.forms.map(form => this.props.addForm(form))
        // }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleCaseFormChange = this.handleCaseFormChange.bind(this)
        this.showProceedToPay = this.showProceedToPay.bind(this)
        this.closeProceedToPay = this.closeProceedToPay.bind(this)
        this.onSave = this.onSave.bind(this)
        this.isPayable = this.isPayable.bind(this)
        this.onCheckoutID = this.onCheckoutID.bind(this)
        this.confirmPayment = this.confirmPayment.bind(this)


    }

    showProceedToPay() {
        this.setState({showProceedToPay: true})
    }

    closeProceedToPay() {
        this.setState({showProceedToPay: false})
    }

    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.form)) {
            errors.form = 'This field is required'
        }
        if (!data.form.match(/[\a-zA-Z]/g)) {
            errors.form = "Form must contain letters"
        }
        if (data.form.length <= 2) {
            errors.form = "Form cannot be less than 2 characters"
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

    validateForm() {
        let errors = {}

        if (this.props.forms.length === 0) {
            errors.form = 'You must provide at least one form'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isFormValid() {
        const {errors, isValid} = this.validateForm()
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    handleCaseFormChange(forms) {
        this.setState({forms})
        this.props.clearForms()
        forms.map(form => {
            this.props.addForm(form)

        })


    }

    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.setState({form: '', errors: {}})
            this.props.addForm(this.state.form)
        }
    }

    isPayable(e) {
        this.setState({payable: true})
    }
    confirmPayment() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables:{
                        checkout_id:this.state.checkout_id
                    },
                    query: confirmPayment
                }
            })
            .request.then(({data, loading, error}) => {
            if (data) {
                if (data.confirmPayment.amount_paid>0) {
                    this.setState({paid: true, payable: false})
                }else{
                    this.setState({paid: false, payable: true})
                }
            }
            if (loading) {
                this.setState({loading: true, error: false})
            }
            if (error) {
                this.setState({loading: false, error: true})
            }
        })
    }

    onCheckoutID(checkout_id) {
        this.setState({checkout_id,payable:false})
    };

    onSave(e) {
        e.preventDefault()
        if (this.isFormValid()) {
            localStorage.setItem("Forms", JSON.stringify({form: this.props.forms}))
            localStorage.setItem("view", "forms")
            this.props.toConfirm()
        }
    }

    componentDidMount() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    query: findCaseForms
                }
            })
            .request.then(({data, loading, error}) => {
                if (data) {
                    if (data.findCaseForms) {
                        caseFormOptions = data.findCaseForms.map(case_form => {
                            return {
                                label: case_form.name,
                                fee: case_form.fee,
                                name: case_form.name,
                                value: case_form.id
                            }
                        })
                        this.setState({loading: false, error: false})
                    }
                }
                if (loading) {
                    this.setState({loading: true, error: false})
                }
                if (error) {
                    this.setState({loading: false, error: true})
                }
            }
        )
    }

    render() {
        const {forms} = this.props
        const {form, errors} = this.state
        let totals = 0
        return (
            <div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Attachments</label>
                    <div className="col-sm-9">
                        <Select
                            multi={true}
                            closeOnSelect={true}
                            onChange={this.handleCaseFormChange}
                            options={caseFormOptions}
                            placeholder="Search Case forms"
                            removeSelected={true}
                            value={this.state.forms}/>

                    </div>
                </div>
                <hr/>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Form</th>
                        <th scope="col">Fee</th>
                        <th scope="col">File</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {forms.map(form => {
                        if (form.fee) {

                            totals = totals + Number(form.fee)
                        }
                        return <Form form={form} onFile={this.props.onFile} onSelectFile={this.props.updateForm}
                                     isPayable={this.isPayable}/>
                    })}
                    <tr>
                        <td><h4>Totals</h4></td>
                        <td><h4>{totals} </h4></td>
                        <td>
                            <button className="btn btn-sm btn-info" onClick={this.showProceedToPay}
                                    disabled={!this.state.payable}><span><i className="fa fa-money"></i></span> Proceed
                                to pay
                            </button>
                            <Consumer>{graphql => <ProceedToPay graphql={graphql} show={this.state.showProceedToPay} amount={totals} onClose={this.closeProceedToPay} onCheckoutID={this.onCheckoutID}/>}</Consumer>
                        </td>
                        <td>
                            <button className="btn btn-sm btn-success" disabled={!this.state.checkout_id} onClick={this.confirmPayment}>Confirm
                                payment
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <br/>

                <hr/>
                <div className="form-group row">
                    <div className="col-sm-4 offset-sm-3">
                        <button className="form-control btn btn-success btn-sm"
                                onClick={this.props.toDefendant}>Back
                        </button>
                    </div>
                    <div className="col-sm-4 offset-sm-1">
                        <button className="form-control btn btn-dark btn-sm"
                                onClick={this.onSave} disabled={!this.state.paid}>Next
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

Forms.propTypes = {
    toConfirm: PropTypes.func.isRequired,
    toDefendant: PropTypes.func.isRequired,
    updateForm: PropTypes.func.isRequired,
    addForm: PropTypes.func.isRequired,
    deleteForm: PropTypes.func.isRequired,
    clearForms: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    forms: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
    return {forms: state.formReducers}
}

export default connect(mapStateToProps, {addForm, updateForm, deleteForm, clearForms})(Forms)