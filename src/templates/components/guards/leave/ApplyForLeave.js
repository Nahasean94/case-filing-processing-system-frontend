import React, {Component} from 'react'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import {newMessage} from "../../../shared/queries"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import validator from '../../../../node_modules/validator/index.js'
import classnames from "classnames"
import Menu from '../Menu'
import PropTypes from "prop-types"
import  CurrentGuard from '../../../shared/CurrentGuard'



class ApplyForLeave extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: '',
            duration: '',
            message: '',
            response:'',
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
        if (validator.isEmpty(data.duration)) {
            errors.duration = 'This field is required'
        }
        if (validator.isEmpty(data.message)) {
            errors.message = 'This field is required'
        }
        if (Date.parse(data.date) < Date.parse(new Date())) {
            errors.date = 'Leave cannot start in the past'
        }
        if (!data.date) {
            errors.date = 'This field is required'
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
                        author:CurrentGuard.getGuardId(),
                        body:this.state.message,
                        account_type:'guard',
                        message_type:'leave'
                    },
                    query: newMessage
                }
            }).request.then(({data}) => {
                if (data) {
                  this.setState({
                        date: '',
                            duration: '',
                            message: '',
                            response:'Message successfully sent',
                    })
                }
            })
        }
    }


    render() {
        const { errors, response} = this.state
        const messageError = errors.message
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-2 col-md-2 bd-sidebar">
                        <Menu router={this.context.router} active="leave"/>
                    </div>
                    <div className="col-sm-7 col-md-7 col-xl-7 bd-content">
                        {response && <div className="alert alert-dark">{response}</div>}
                        <div className="row">
                        <h2 className="offset-sm-4">Apply for leave</h2>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                label="Starting date"
                                type="date"
                                name="date"
                                value={this.state.date}
                                onChange={this.onChange}
                                error={errors.date}
                            />
                            <TextFieldGroup
                                label="Duration of leave(days)"
                                type="number"
                                name="duration"
                                value={this.state.duration}
                                onChange={this.onChange}
                                error={errors.duration}
                            />
                            <div className="form-group row">
                                <div className="col-sm-3"><label htmlFor="message">Reason for leave</label>
                                </div>
                                <div className="col-sm-9">
                        <textarea name="message" onChange={this.onChange}
                                  className={classnames("form-control form-control-sm", {"is-invalid": messageError})}
                                  rows="3" id="message" onClick={this.onChange} value={this.state.message}/>
                                    {messageError && <div className="invalid-feedback">{messageError}</div>}
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-5 offset-sm-3">
                                    <input type="submit" value="Apply"
                                           className="form-control btn btn-dark btn-sm "/>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

    }
}

ApplyForLeave.contextTypes = {
    router: PropTypes.object.isRequired
}

export default ApplyForLeave

