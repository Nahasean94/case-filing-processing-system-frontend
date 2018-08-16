"use strict"
import React from 'react'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../../../../shared/TextFieldsGroup'
import PropTypes from "prop-types"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Progress} from "reactstrap"

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
            this.setState({errors: {}, isLoading: true})
            const pad2 = (n) => n < 10 ? '0' + n : n

            const date = new Date()

            const timestamp = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())

            const password = btoa(174379 + "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" + timestamp)
            const auth = "Bearer C3p7n9hVbUOtzrGeA5etNSTmz1KN"
            const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            request(
                {
                    method: 'POST',
                    url: url,
                    headers: {
                        "Authorization": auth
                    },
                    json: {
                        "BusinessShortCode": "174379",
                        "Password": password,
                        "Timestamp": timestamp,
                        "TransactionType": "CustomerPayBillOnline",
                        "Amount": "1",
                        "PartyA": "600342",
                        "PartyB": "174379",
                        "PhoneNumber": this.state.number,
                        "CallBackURL": "https://classmite.com/mpesa_response.php",
                        "AccountReference": "CaseFiling",
                        "TransactionDesc": "This transaction is to pay for forms for ejudiciary"
                    }
                },
                (error, response, body) => {
                    // TODO: Use the body object to extract the response
                    if (error) {
                        this.setState({error})
                        console.log(error)
                        return
                    }
                    this.setState({body})
                    this.props.onClose()

                }
            )

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