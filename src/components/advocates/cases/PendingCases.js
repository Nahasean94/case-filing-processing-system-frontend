import React from 'react'
import Menu from "../Menu"
import PropTypes from "prop-types"

class PendingCases extends React.Component{
    render(){
        return(<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="pending-cases"/>
                </div>
                <div className="col-sm-6 col-md-6 col-xl-6 offset-sm-2 bd-content">
                    Pending Cases
                </div>
            </div>

        </div>)
    }
}
PendingCases.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PendingCases