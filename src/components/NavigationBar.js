import React from 'react'
import {Consumer} from "graphql-react"
import jwt from "jsonwebtoken"
import {Link} from "react-router-dom"
import PropTypes from "prop-types"

class NavigationBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showSigninPageModal: false,
        }
        this.logout = this.logout.bind(this)
        this.showSigninPageModal = this.showSigninPageModal.bind(this)
        this.closeSigninPageModal = this.closeSigninPageModal.bind(this)

    }

     showSigninPageModal(e) {
        e.preventDefault()
        this.setState({showSigninPageModal: true})
    }

    closeSigninPageModal() {
        this.setState({showSigninPageModal: false})
    }

    logout(e) {
        e.preventDefault()
        localStorage.removeItem('CourtSystem')
        this.context.router.history.push('/')
    }

    render() {

        let isAuthenticated = false
        let token
        if (localStorage.getItem('CourtSystem')) {
            token = jwt.decode(localStorage.getItem('CourtSystem'))
            isAuthenticated = true
        }

        const userLinks = (<div className="navbar-nav flex-row ml-md-auto">
            <Link to="" className="nav-item nav-link-custom" onClick={this.logout}>Logout</Link>
        </div>)

        return (
            <nav className="navbar navbar-expand-sm bg-dark-green fixed-top">
                <Link className="navbar-brand" to="/">
                   Case Filing and Processing system
                </Link>
                <div className="navbar-collapse" id="navbarNavAltMarkup">
                    {isAuthenticated ? userLinks : ''}
                </div>

            </nav>
        )
    }
}

NavigationBar.contextTypes = {
    router: PropTypes.object.isRequired
}

export default NavigationBar