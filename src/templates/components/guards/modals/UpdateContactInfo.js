import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {updateGuardContactInfo, } from '../../../shared/queries'
import {Query} from "graphql-react"

class UpdateContactInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: this.props.info.email,
            postal_address: this.props.info.postal_address,
            cellphone: this.props.info.cellphone,
            errors: {},
            isLoading: false,
            invalid: false

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmitContactInfo = this.onSubmitContactInfo.bind(this)
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
        return {
            errors,
            isValid: isEmpty(errors)
        }

    }

    isContactValid() {
        const {errors, isValid} = this.validateContactInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSubmitContactInfo(e) {
        e.preventDefault()
        if (this.isContactValid()) {
            console.log(this.state)
            this.setState({errors: {}, isLoading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            id: this.props.info.id,
                            email: this.state.email,
                            postal_address: this.state.postal_address,
                            cellphone: this.state.cellphone,
                        },
                        query: updateGuardContactInfo
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.setState({
                            isLoading: false,
                            invalid: false,
                            message: data.updateGuardContactInfo
                                ? this.setState({message: 'Contact Details successfully updated'})
                                : this.setState({message: 'Update Failed'})
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

        const {errors,  email, postal_address, cellphone,isLoading,invalid} = this.state
        if (show) {
            return <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog-centered modal-full">
                <ModalHeader toggle={onClose}>Update profile information</ModalHeader>
                <ModalBody>
                    <br/>
                    <form onSubmit={this.onSubmitContactInfo}>
                        <TextFieldGroup
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            error={errors.email}

                        />
                        <TextFieldGroup
                            label="Postal Address"
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
                            <div className="col-sm-5 offset-sm-7">
                                <div className="form-group">
                                    <button disabled={isLoading || invalid}
                                            className="form-control from-control-sm btn btn-dark btn-sm"
                                            type="submit">Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
                </ModalFooter>
            </Modal>
        }
        else return null
    }

}


UpdateContactInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default UpdateContactInfo