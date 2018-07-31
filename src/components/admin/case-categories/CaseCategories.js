import React from 'react'
import Menu from "../Menu"
import {Consumer} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import CaseCategoryView from "./CaseCategoryView"
import {addCaseCategory, caseCategories, isCaseCategoryExists} from "../../../shared/queries"
import PropTypes from 'prop-types'
import {isEmpty} from "lodash"
import validator from "validator"
import CustomFieldGroup from "../../../shared/CustomTextFieldGroup"

class CaseCategories extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            showNewCaseCategoryForm: false,
            caseCategories: [],
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

    checkCaseCategoryExists(e) {
        if (e.keyCode !== 13) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            name: this.state.name,
                        },
                        query: isCaseCategoryExists
                    }
                })
                .request.then(({data}) => {

                if (data) {
                    if (data.isCaseCategoryExists.exists) {
                        let errors = {}
                        errors.name = 'A case category with that name already exists'
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
                        query: addCaseCategory
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
                            caseCategories:[data.addCaseCategory,...this.state.caseCategories],
                            message: data.addCaseCategory
                                ? <div className="alert alert-success" role="alert">Successfully added case category
                                    "{data.addCaseCategory.name}"
                                </div>
                                : <div className="alert alert-danger" role="alert">An error occurred while adding case category
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
                    query: caseCategories
                }
            })
            .request.then(({data, loading, error}) => {
            if (data) {
                if (data.caseCategories.length > 0) {
                    this.setState({caseCategories: data.caseCategories})
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
        const {showNewCaseCategoryForm, caseCategories, errors, error, loading, message, isLoading, invalid} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm-3 col-md-3 bd-sidebar">
                    <Menu router={this.context.router} active="case-categories"/>
                </div>
                <div className="col-sm-8 bd-content">
                    {!showNewCaseCategoryForm ?
                        <button className="btn btn-sm btn-success" onClick={this.showNewCaseCategoryForm}><span><i
                            className="fa fa-plus"></i></span></button> :
                        <button className="btn btn-sm btn-success" onClick={this.closeNewCaseCategoryForm}><span><i
                            className="fa fa-angle-double-up"></i></span></button>}
                    <br/><br/>
                    {showNewCaseCategoryForm && <div>
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
                                checkLocationExists={this.checkCaseCategoryExists}
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
                    {caseCategories.length > 0 ?
                        <table className="table ">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {caseCategories.map(category => {
                                return <CaseCategoryView category={category}/>

                            })}
                            </tbody>
                        </table> : <div className="alert alert-dark">No case categories found</div>}

                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>
                    }
                    {error && <div className="alert alert-dark">An error occurred while fetching case categories</div>}


                </div>

            </div>
        </div>)
    }
}

CaseCategories.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <CaseCategories graphql={graphql}/>}</Consumer>
