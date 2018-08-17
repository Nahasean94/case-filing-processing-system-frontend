import React from 'react'
import Menu from "../Menu"
import PropTypes from "prop-types"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
// import  from "../../../shared/queries"
import {Consumer} from 'graphql-react'
import Case from "./Case"
import {Progress} from "reactstrap"
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import {searchCourtCases} from "../../../shared/queries"

class Cases extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: "year",
            error: false,
            errors: '',
            search: '',
            invalid: false,
            isLoading: false,
            cases: []
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()
        // const token = jwt.decode(localStorage.getItem("CourtSystem"))
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        state: this.state.state,
                        search: this.state.search,
                    },
                    query: searchCourtCases
                }
            })
            .request.then(({data, loading, error}) => {
                if (data) {
                    if (data.searchCourtCases) {
                        this.setState({cases: data.searchCourtCases, loading: false, error: false})
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

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {cases, loading, error, search, isLoading, invalid} = this.state
        const progressBar = <Progress animated color="success" value={100}/>
        const errorMessage = <div className="alert alert-danger">An error occurred. Please try again later.</div>
        return (<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="reports"/>
                </div>
                <div className="col-sm-10 col-md-10 col-xl-10  bd-content">
                    {loading ? progressBar : ''}
                    {error ? errorMessage : ''}
                        <form onSubmit={this.onSubmit}>
                    <div className="row">

                            <div className="col-sm-2">
                                <select className="form-control form-control-sm" name="state" onChange={this.onChange}>
                                    <option value="year">Year</option>
                                    <option value="case-type">Case Type</option>
                                    <option value="judge">Judge</option>
                                    <option value="all">All cases</option>
                                </select>
                            </div>
                        <div className="col-sm-4">
                        <TextFieldGroup
                            label="Search"
                            type="text"
                            name="search"
                            value={search}
                            onChange={this.onChange}
                        />
                    </div>
                            <div className="col-sm-2">
                                <div className="form-group row">
                                    <div className="col-sm-9 offset-3">
                                        <button disabled={isLoading || invalid}
                                                className="btn btn-dark btn-sm form-control"
                                                type="submit">Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </div>
                        </form>



                    {cases.length > 0 ? <div>
                        {}
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Case number</th>
                                <th scope="col">Title</th>
                                <th scope="col">Advocate</th>
                                <th scope="col">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cases.map(result => {
                                return <Case results={result}/>
                            })}
                            </tbody>
                        </table>
                    </div> : <p>No cases found</p>}
                </div>
            </div>

        </div>)
    }
}

Cases.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <Cases graphql={graphql}/>}</Consumer>