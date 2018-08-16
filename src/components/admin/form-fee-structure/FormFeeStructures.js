import React from 'react'
import Menu from "../Menu"
import {Consumer} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import FormFeeStructureView from "./FormFeeStructureView"
import {addFormFeeStructure, formFeeStructures, isFormFeeStructureExists} from "../../../shared/queries"
import PropTypes from 'prop-types'
import {isEmpty} from "lodash"
import validator from "validator"
import CustomFieldGroup from "../../../shared/CustomTextFieldGroup"

class FormFeeStructures extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            fee: 0,
            showNewCaseCategoryForm: false,
            formFeeStructures: [],
            error: false,
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''
        }
        this.onSelectCaseCategory = this.onSelectCaseCategory.bind(this)
        this.showNewCaseCategoryForm = this.showNewCaseCategoryForm.bind(this)
        this.closeNewCaseCategoryForm = this.closeNewCaseCategoryForm.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkCaseCategoryExists = this.checkCaseCategoryExists.bind(this)
    }

    checkCaseCategoryExists() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        name: this.state.name,
                    },
                    query: isFormFeeStructureExists
                }
            })
            .request.then(({data}) => {

            if (data) {
                if (data.isFormFeeStructureExists.exists) {
                    let errors = {}
                    errors.name = 'A form with that name already exists'
                    this.setState({errors, invalid: true,})
                } else {
                    let errors = {}
                    this.setState({errors, invalid: false,})
                }
            }
        })

    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.name)) {
            errors.name = 'This field is required'
        }
        if (!data.fee) {
            errors.fee = 'This field is required'
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
                            fee: this.state.fee,
                        },
                        query: addFormFeeStructure
                    }
                })
                .request.then(({data}) => {

                    if (data) {
                        this.setState({
                            name: '',
                            fee:0,
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            loading: false,
                            formFeeStructures: [data.addFormFeeStructure, ...this.state.formFeeStructures],
                            message: data.addFormFeeStructure
                                ? <div className="alert alert-success" role="alert">Successfully added Form
                                    "{data.addFormFeeStructure.name}"
                                </div>
                                : <div className="alert alert-danger" role="alert">An error occurred while form
                                    category
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
                    query: formFeeStructures
                }
            })
            .request.then(({data, loading, error}) => {
            if (data) {
                if (data.formFeeStructures.length > 0) {
                    this.setState({formFeeStructures: data.formFeeStructures})
                }
            } else if (loading) {

                this.setState({loading: true})
            } else if (error) {

                this.setState({error: true})
            }

        })
    }

    onSelectCaseCategory(id, name) {
        this.setState({id, name})
    }

    showNewCaseCategoryForm() {
        this.setState({showNewCaseCategoryForm: true})
    }

    closeNewCaseCategoryForm() {
        this.setState({showNewCaseCategoryForm: false})
    }

    render() {
        const {showNewCaseCategoryForm, formFeeStructures, errors, error, loading, message, isLoading, invalid} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm-3 col-md-3 bd-sidebar">
                    <Menu router={this.context.router} active="case-forms"/>
                </div>
                <div className="col-sm-9 bd-content">
                    {!showNewCaseCategoryForm ?
                        <button className="btn btn-sm btn-success" onClick={this.showNewCaseCategoryForm}><span><i
                            className="fa fa-plus"></i></span></button> :
                        <button className="btn btn-sm btn-success" onClick={this.closeNewCaseCategoryForm}><span><i
                            className="fa fa-angle-double-up"></i></span></button>}
                    <br/><br/>
                    {showNewCaseCategoryForm && <div>
                        {message && <div>{message}</div>}
                        <form onSubmit={this.onSubmit} className="form-row ">
                            <div className="col-md-5 ">
                                <CustomFieldGroup
                                    label="Name"
                                    type="name"
                                    name="name"
                                    value={this.state.name} autoFocus={true}
                                    onChange={this.onChange}
                                    error={errors.name}
                                    checkLocationExists={this.checkCaseCategoryExists}
                                />
                            </div>
                            <div className="col-md-5">
                                <CustomFieldGroup
                                    label="Fee (KES)"
                                    type="number"
                                    name="fee"
                                    value={this.state.fee}
                                    onChange={this.onChange}
                                    error={errors.fee}
                                />
                            </div>
                            <div className="col-md-2">
                                <div className="form-group ">
                                    <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                            type="submit">Save
                                    </button>

                                </div>
                            </div>
                        </form>
                    </div>}
                    {formFeeStructures.length > 0 ?
                        <table className="table ">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Fee (KES)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formFeeStructures.map(station => {
                                return <FormFeeStructureView station={station}/>

                            })}
                            </tbody>
                        </table> : <div className="alert alert-dark">No forms found</div>}

                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>
                    }
                    {error && <div className="alert alert-dark">An error occurred while fetching forms</div>}
                </div>

            </div>
        </div>)
    }
}

FormFeeStructures.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <FormFeeStructures graphql={graphql}/>}</Consumer>
