import React from 'react'
import PropTypes from 'prop-types'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../../shared/TextFieldsGroup'
import {setLoginToken} from "../../../actions/courtAdminLoginActions"
import {connect} from 'react-redux'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {courtAdminLogin} from '../../../shared/queries'
import {Consumer} from "graphql-react"

class CourtAdminLoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        // this.checkUserExists = this.checkUserExists.bind(this)
    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.username)) {
            errors.username = 'This field is required'
        }
        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required'
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
            this.setState({loading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            username: this.state.username,
                            password: this.state.password,
                            court_station: this.props.court_station
                        },
                        query: courtAdminLogin
                    }
                })
                .request.then(({data}) => {

                    if (data.courtAdminLogin.token === null || !data.courtAdminLogin.ok) {
                        this.setState({errors: {form: data.courtAdminLogin.error}, isLoading: false})
                    }
                    else {
                        this.props.setLoginToken(data.courtAdminLogin.token)
                        this.context.router.history.push('/court-admin/dashboard')
                        this.setState({
                            loading: false,
                            message: data
                                ? `Logged in.`
                                : `Logging failed.`
                        })

                    }

                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {errors, password, username, invalid, isLoading, message} = this.state
        return (
            <form onSubmit={this.onSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <div className="row">
                    <h2 className="offset-sm-4">Login</h2>
                </div>
                <TextFieldGroup
                    label="Username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    error={errors.username}
                    autoFocus={true}
                />
                <TextFieldGroup
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    error={errors.password}
                />
                <div className="form-group row">
                    <div className="col-sm-9 offset-3">
                        <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                type="submit">Login
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

CourtAdminLoginForm.propTypes = {
    setLoginToken: PropTypes.func.isRequired,
}
CourtAdminLoginForm.contextTypes = {
    router: PropTypes.object.isRequired
}
const exportAdminLoginForm = ({setLoginToken, court_station}) => <Consumer>{graphql => <CourtAdminLoginForm
    setLoginToken={setLoginToken} graphql={graphql} court_station={court_station}/>}</Consumer>
export default connect(null, {setLoginToken})(exportAdminLoginForm)