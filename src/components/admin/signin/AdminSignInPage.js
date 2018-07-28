import React from 'react'
import {Consumer} from "graphql-react"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {adminExists} from "../../../shared/queries"
import AdminSignupForm from "./AdminSignupForm"
import AdminLoginForm from "./AdminLoginForm"

class AdminSignInPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adminExists: true,
            loading: false,
            message: '',
            error: false
        }
        this.adminSignedUp = this.adminSignedUp.bind(this)
    }

    adminSignedUp() {
        this.setState({adminExists: true, message: 'Admin account successfully created. Use the form below to login'})
    }

    componentDidMount() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    query: adminExists
                }
            })
            .request.then(({data, error, loading}) => {
                if (data) {
                    this.setState({adminExists: data.adminExists.exists})
                }
                else if (loading) {
                    this.setState({loading: true})

                } else if (error) {
                    this.setState({error: true})

                }
            }
        )
    }

    render() {
        const {loading, error, adminExists,message} = this.state
        return (
            <div className='container'>
                {message && <div className="alert alert-success">{message}</div>}

                <div className='row'>
                    {loading && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>}
                    {error && <div className="alert alert-danger">An error occurred. Please makes sure the server is
                        running</div>}
                    {adminExists ? <div className="col-sm-4 offset-sm-3">
                        <AdminLoginForm/>
                    </div> : <div className="col-sm-4 offset-sm-3">
                        <AdminSignupForm adminSignedUp={this.adminSignedUp}/>
                    </div>}
                </div>
            </div>
        )


    }
}

export default () => <Consumer>{graphql => <AdminSignInPage graphql={graphql}/>}</Consumer>

