import React from 'react'
import PropTypes from 'prop-types'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../../shared/TextFieldsGroup'
import {setLoginToken} from "../../../actions/advocateLoginActions"
import {connect} from 'react-redux'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {advocateLogin} from '../../../shared/queries'
import {Consumer} from "graphql-react"

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            practice_number: '',
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

        if (validator.isEmpty(data.practice_number)) {
            errors.practice_number = 'This field is required'
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
                        variables: {practice_number: this.state.practice_number, password: this.state.password},
                        query: advocateLogin
                    }
                })
                .request.then(({data}) => {

                    if (data.advocateLogin.token === null || !data.advocateLogin.ok) {
                        this.setState({errors: {form: data.advocateLogin.error}, isLoading: false})
                    }
                    else {
                        this.props.setLoginToken(data.advocateLogin.token)
                        this.context.router.history.push('/advocates/dashboard')
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
        const {errors, password, practice_number, invalid, isLoading,} = this.state
        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    <h2 className="offset-sm-4">Login</h2>
                </div>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <TextFieldGroup
                    label="Practice Number"
                    type="number"
                    name="practice_number"
                    value={practice_number}
                    onChange={this.onChange}
                    error={errors.practice_number}
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

LoginForm.propTypes = {
    setLoginToken: PropTypes.func.isRequired,
}
LoginForm.contextTypes = {
    router: PropTypes.object.isRequired
}
const exportAdvocateLoginForm = ({setLoginToken}) => <Consumer>{graphql => <LoginForm setLoginToken={setLoginToken}
                                                                                      graphql={graphql}/>}</Consumer>
export default connect(null, {setLoginToken})(exportAdvocateLoginForm)