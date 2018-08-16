import React from 'react'
import Menu from "../../Menu"
import PropTypes from "prop-types"
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"
import {findServedCases} from "../../../../shared/queries"
import {Consumer} from 'graphql-react'
import ViewCase from "../modals/ViewCase"
import TextFieldGroup from "../../../../shared/TextFieldsGroup"
import validator from "validator"
import {isEmpty} from "lodash"

let caseOptions

class ServedCases extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            errors: {},
            id: '',
            served_case: '',
            showViewCaseModal: false
        }

        this.showViewCaseModal = this.showViewCaseModal.bind(this)
        this.closeViewCaseModal = this.closeViewCaseModal.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSearch = this.onSearch.bind(this)
    }

    showViewCaseModal(e) {
        e.preventDefault()
        this.setState({showViewCaseModal: true})

    }

    closeViewCaseModal() {
        this.setState({showViewCaseModal: false})
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})

    }


    validateInfo(data) {
        let errors = {}

        if (validator.isEmpty(data.search)) {
            errors.search = 'This field is required'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }


    isInfoValid() {
        const {errors, isValid} = this.validateInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }


    onSearch(e) {
        e.preventDefault()
        if (this.isInfoValid()) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            prefix: this.state.search.split("/")[0]
                        },
                        query: findServedCases
                    }
                })
                .request.then(({data, loading, error}) => {
                    if (data) {
                        if (data.findServedCases) {

                            this.setState({served_case: data.findServedCases.title, id: data.findServedCases.id})
                            this.setState({loading: false, error: false})
                        }
                        else
                            {
                                this.setState({served_case: 'Your search yielded no results', id: ''})
                            }


                    }
                    if (loading) {
                        this.setState({loading: true, error: false})
                    }
                    if (error) {
                        this.setState({loading: false, error: true})
                    }
                }
            )
        }
    }

    render() {
        const {errors, search, served_case, id, showViewCaseModal} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="served-cases"/>
                </div>
                <div className="col-sm-8 col-md-8 col-xl-8 bd-content">
                    <form className="form-row" onSubmit={this.onSearch}>
                        <div className="col-sm-6">
                            <TextFieldGroup
                                label="Search"
                                type="text"
                                name="search"
                                value={search}
                                onChange={this.onChange}
                                error={errors.search}
                                autoFocus={true}
                            />
                        </div>
                        <div className="col-sm-4">
                            <button className="btn btn-sm btn-dark" onClick={this.onSearch}>Search</button>
                        </div>
                    </form>
                    <br/>
                    {served_case !== 'Your search yielded no results' ?
                        <a href=""
                           onClick={this.showViewCaseModal}>{served_case}</a> : 'Your search yielded no results'}
                </div>
            </div>
            {served_case && showViewCaseModal &&
            <Consumer>{graphql => <ViewCase graphql={graphql} show={showViewCaseModal}
                                            onClose={this.closeViewCaseModal}
                                            id={id}/>}</Consumer>}

        </div>)
    }
}

ServedCases.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <ServedCases graphql={graphql}/>}</Consumer>