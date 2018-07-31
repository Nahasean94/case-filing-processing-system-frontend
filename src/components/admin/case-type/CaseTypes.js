import React from 'react'
import Menu from "../Menu"
import {Consumer} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import CaseTypeView from "./CaseTypeView"
import {addCaseType, caseTypes, isCaseTypeExists} from "../../../shared/queries"
import PropTypes from 'prop-types'
import {isEmpty} from "lodash"
import validator from "validator"
import CustomFieldGroup from "../../../shared/CustomTextFieldGroup"

class CaseTypes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            showNewCaseTypeForm: false,
            caseTypes: [],
            error: false,
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''
        }
        this.onSelectCaseType = this.onSelectCaseType.bind(this)
        this.showNewCaseTypeForm = this.showNewCaseTypeForm.bind(this)
        this.closeNewCaseTypeForm = this.closeNewCaseTypeForm.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkCaseTypeExists = this.checkCaseTypeExists.bind(this)
    }

    checkCaseTypeExists(e) {
        if (e.keyCode !== 13) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            name: this.state.name,
                        },
                        query: isCaseTypeExists
                    }
                })
                .request.then(({data}) => {

                if (data) {
                    if (data.isCaseTypeExists.exists) {
                        let errors = {}
                        errors.name = 'A caset type with that name already exists'
                        this.setState({errors, invalid: true,})
                    } else {
                        let errors = {}
                        this.setState({errors, invalid: false,})
                    }
                }
            })
        }

    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.name)) {
            errors.name = 'This field is required'
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
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            name: this.state.name,
                        },
                        query: addCaseType
                    }
                })
                .request.then(({data}) => {

                    if (data) {
                        this.setState({
                            name: '',
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            loading: false,
                            caseTypes:[data.addCaseType,...this.state.caseTypes],
                            message: data.addCaseType
                                ? <div className="alert alert-success" role="alert">Successfully added case type
                                    "{data.addCaseType.name}"
                                </div>
                                : <div className="alert alert-danger" role="alert">An error occurred while adding caset type
                                </div>
                        })

                    }
                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }


    componentDidMount() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    query: caseTypes
                }
            })
            .request.then(({data, loading, error}) => {
            if (data) {
                if (data.caseTypes.length > 0) {
                    this.setState({caseTypes: data.caseTypes})
                }
            } else if (loading) {

                this.setState({loading: true})
            } else if (error) {

                this.setState({error: true})
            }

        })
    }

    onSelectCaseType(id, name) {
        this.setState({id, name})
    }

    showNewCaseTypeForm() {
        this.setState({showNewCaseTypeForm: true})
    }

    closeNewCaseTypeForm() {
        this.setState({showNewCaseTypeForm: false})
    }

    render() {
        const {showNewCaseTypeForm, caseTypes, errors, error, loading, message, isLoading, invalid} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm-3 col-md-3 bd-sidebar">
                    <Menu router={this.context.router} active="case-types"/>
                </div>
                <div className="col-sm-8 bd-content">
                    {!showNewCaseTypeForm ?
                        <button className="btn btn-sm btn-success" onClick={this.showNewCaseTypeForm}><span><i
                            className="fa fa-plus"></i></span></button> :
                        <button className="btn btn-sm btn-success" onClick={this.closeNewCaseTypeForm}><span><i
                            className="fa fa-angle-double-up"></i></span></button>}
                    <br/><br/>
                    {showNewCaseTypeForm && <div>
                        {message && <div>{message}</div>}
                        <form onSubmit={this.onSubmit} className="form-row">
                            <div className="col-md-9">
                            <CustomFieldGroup
                                label="Name"
                                type="name"
                                name="name"
                                value={this.state.name} autoFocus={true}
                                onChange={this.onChange}
                                error={errors.name}
                                checkLocationExists={this.checkCaseTypeExists}
                            />
                            </div>
                            <div className="col-md-3 ">
                            <div className="form-group ">
                                    <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                            type="submit">Save
                                    </button>
                            </div>
                            </div>
                        </form>
                    </div>}
                    {caseTypes.length > 0 ?
                        <table className="table ">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {caseTypes.map(type => {
                                return <CaseTypeView type={type}/>

                            })}
                            </tbody>
                        </table> : <div className="alert alert-dark">No case types found</div>}

                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>
                    }
                    {error && <div className="alert alert-dark">An error occurred while fetching case types</div>}


                </div>

            </div>
        </div>)
    }
}

CaseTypes.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <CaseTypes graphql={graphql}/>}</Consumer>
