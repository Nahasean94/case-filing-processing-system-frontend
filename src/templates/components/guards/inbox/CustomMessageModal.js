import React, {Component} from 'react'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import {newCustomMessage} from "../../../shared/queries"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import validator from '../../../../node_modules/validator/index.js'
import classnames from "classnames"
import CurrentGuard from '../../../shared/CurrentGuard'
import {Button,Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"


class CustomMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            duration: '',
            message: '',
            response: '',
            title: '',
            guards: [],
            errors: {},
            isLoading: false,
            invalid: false,
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})

    }

    validateInfo(data) {
        let errors = {}
        if (validator.isEmpty(data.title)) {
            errors.title = 'This field is required'
        }
        if (validator.isEmpty(data.message)) {
            errors.message = 'This field is required'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }


    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.props.graphql.query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        author: CurrentGuard.getGuardId(),
                        body: this.state.message,
                        account_type: 'guard',
                        message_type: 'custom',
                        title: this.state.title
                    },
                    query: newCustomMessage
                }
            }).request.then(({data}) => {
                if (data) {
                    this.setState({
                        title: '',
                        duration: '',
                        message: '',
                        response: 'Message successfully sent',
                    })
                    this.props.onClose()
                }
            })
        }
    }


    render() {
        const {errors, response} = this.state
        const {show, onClose} = this.props
        const messageError = errors.message
        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog-centered">
                    <ModalHeader toggle={onClose}>Register new guard</ModalHeader>
                    <ModalBody>
                        <div className="container-fluid">
                            {response && <div className="alert alert-dark">{response}</div>}
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    label="Title"
                                    type="text"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChange}
                                    error={errors.title}
                                />

                                <div className="form-group row">
                                    <div className="col-sm-3"><label htmlFor="message">Description</label>
                                    </div>
                                    <div className="col-sm-9">
                        <textarea name="message" onChange={this.onChange}
                                  className={classnames("form-control form-control-sm", {"is-invalid": messageError})}
                                  rows="5" id="message" onClick={this.onChange} value={this.state.message}/>
                                        {messageError && <div className="invalid-feedback">{messageError}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-5 offset-sm-3">
                                        <input type="submit" value="Send    "
                                               className="form-control btn btn-dark btn-sm "/>
                                    </div>

                                </div>
                            </form>
                        </div>
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

export default CustomMessage

