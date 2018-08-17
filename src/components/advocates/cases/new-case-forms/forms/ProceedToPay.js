"use strict"
import React from 'react'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../../../../shared/TextFieldsGroup'
import PropTypes from "prop-types"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Progress} from "reactstrap"
import {fetchOptionsOverride} from "../../../../../shared/fetchOverrideOptions"
import {makeMpesaPayment, registerAdmin} from "../../../../../shared/queries"

var request = require('request')
const btoa = require('btoa')

class ProceedToPay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            number: '',
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: '',
            error: '',
            body: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    validateInput(data) {
        let errors = {}

        if (data.number.length < 12 || data.number.length > 12) {
            errors.number = 'Phone number could should be 12 numbers'
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
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            phone_number: this.state.number,
                        },
                        query: makeMpesaPayment
                    }
                })
                .request.then(({data,loading,error}) => {
                if (data) {
                    this.setState({
                            phone_number: '',
                            isLoading: false,
                            invalid: false,
                        }
                    )
                    this.props.onCheckoutID(data.makeMpesaPayment.CheckoutRequestID)
                    this.props.onClose()
                }
                if(loading){
                    this.setState({isLoading:true})
                }
                if(error){
                    this.setState({error:true})
                }
            })

        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {show, onClose,amount} = this.props

        const {errors, loading, isLoading, invalid} = this.state
        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="md" className="modal-dialog modal-dialog-centered">
                    <ModalHeader toggle={onClose}>Pay for the forms to proceed</ModalHeader>
                    <ModalBody>
                        <div className="alert alert-warning">Enter a valid phone number. Use the format 254xxxxxxxxx.
                            You will be prompted to enter your MPESA PIN.
                        </div>
                        <div className="alert alert-info">Amount: {amount}
                        </div>
                        {this.state.error ? <div className="alert alert-danger">An error occurred</div> : ''}
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                label="Phone number"
                                type="number"
                                name="number"
                                value={this.state.number} autoFocus={true}
                                onChange={this.onChange}
                                error={errors.number}
                            />
                            <div className="form-group row">
                                <div className="col-sm-4 offset-sm-4">
                                    <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                            type="submit">Proceed
                                    </button>
                                </div>
                            </div>
                            {isLoading ? <Progress animated color="primary" value="100">Contacting servers. Please
                                wait...</Progress> : ''}
                        </form>
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

ProceedToPay.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}
export default ProceedToPay