import React from 'react'
import Menu from "../Menu"
import PropTypes from "prop-types"


class NewCase extends React.Component{
    render(){
        return(<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="new-case"/>
                </div>
                <div className="col-sm-6 col-md-6 col-xl-6 offset-sm-2 bd-content">
                   New Cases
                </div>
            </div>

        </div>)
    }
}
NewCase.contextTypes = {
    router: PropTypes.object.isRequired
}
export default NewCase