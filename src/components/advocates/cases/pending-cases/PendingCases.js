import React from 'react'
import Menu from "../../Menu"
import PropTypes from "prop-types"
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"
import {findPendingCases} from "../../../../shared/queries"
import jwt from 'jsonwebtoken'
import {Consumer} from 'graphql-react'
import PendingCase from "./PendingCase"
import {Progress} from "reactstrap"

class PendingCases extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: false,
            cases: []
        }
    }

    componentDidMount() {
        const token = jwt.decode(localStorage.getItem("CourtSystem"))
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        advocate: token.id,
                    },
                    query: findPendingCases
                }
            })
            .request.then(({data, loading, error}) => {
                if (data) {
                    if (data.findPendingCases) {
                        this.setState({cases: data.findPendingCases, loading: false, error: false})
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

    render() {
        const {cases, loading, error} = this.state
        const progressBar =  <Progress animated color="success" value={this.state.progress}/>
        const errorMessage = <div className="alert alert-danger">An error occurred. Please try again later.</div>
        return (<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="pending-cases"/>
                </div>
                <div className="col-sm-10 col-md-10 col-xl-10  bd-content">
                    {loading ? progressBar : ''}
                    {error ? errorMessage : ''}
                    {cases.length>0? <table className="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Case number</th>
                            <th scope="col">Title</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cases.map(pendingCase => {
                            return <PendingCase pendingCase={pendingCase}/>
                        })}
                        </tbody>
                    </table>:<p>No cases found</p>}
                </div>
            </div>

        </div>)
    }
}

PendingCases.contextTypes = {
    router: PropTypes.object.isRequired
}
export default () => <Consumer>{graphql => <PendingCases graphql={graphql}/>}</Consumer>