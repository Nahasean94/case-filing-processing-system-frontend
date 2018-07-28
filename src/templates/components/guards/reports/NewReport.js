import React, {Component} from 'react'
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
            message: '',
            response:'',
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
        if (validator.isEmpty(data.message)) {
            errors.message = 'This field is required'
        }
        if (data.message.length<10) {
            errors.message = 'Report must be more than 10 characters'
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
                        message_type:'report'
                    },
                    query: newMessage
                }
            }).request.then(({data}) => {
                if (data) {
                    this.setState({
                        message: '',
                        response:'Report successfully sent',
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
                        <Menu router={this.context.router} active="reports"/>
                    </div>
                    <div className="col-sm-7 col-md-7 col-xl-7 bd-content">
                        {response && <div className="alert alert-dark">{response}</div>}
                        <div className="row">
                            <h2 className="offset-sm-4">New message</h2>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                        <textarea name="message" onChange={this.onChange}
                                  className={classnames("form-control", {"is-invalid": messageError})} rows="3" id="message" onClick={this.onChange} value={this.state.message}/>
                                    {messageError && <div className="invalid-feedback">{messageError}</div>}
                                </div>
                            <div className="form-group row">
                                <div className="col-sm-5 offset-sm-3">
                                    <input type="submit" value="Submit" className="form-control btn btn-dark btn-sm "/>
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

