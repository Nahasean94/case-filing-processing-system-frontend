import React from 'react'
import SigninPage from './admin/SigninPage'


import {Consumer} from "graphql-react"
import jwt from "jsonwebtoken"
import {Link} from "react-router-dom"

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
        window.location.reload()
        localStorage.removeItem('CourtSystem')
        this.context.router.history.push('/guards')
    }

    render() {
        const {showSigninPageModal}=this.state
        let isAuthenticated = false
        let token
        if (localStorage.getItem('CourtSystem')) {
            token = jwt.decode(localStorage.getItem('CourtSystem'))
            isAuthenticated = true
        }

        const userLinks = (<div className="navbar-nav flex-row ml-md-auto">
            {/*<a className="nav-item nav-link" href="" > </a>*/}
            <Link to="/" className="nav-item nav-link-custom" onClick={this.logout}>Logout</Link>
            {/*{token && <Link to="/" className="nav-item nav-link">Dashboard</Link>}*/}
        </div>)

        const guestLinks = (
            <div className="navbar-nav flex-row ml-md-auto">
                <a href="" className="nav-item nav-link-custom" onClick={this.showSigninPageModal}>Sign in</a>
            </div>)

        return (
            <nav className="navbar navbar-expand-sm bg-dark fixed-top">
                <Link className="navbar-brand" to="/">
                    Security Manager
                </Link>
                {/*<button className="navbar-toggler" type="button" data-toggle="collapse"*/}
                        {/*data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"*/}
                        {/*aria-expanded="false" aria-label="Toggle navigation">*/}
                    {/*<span className="navbar-toggler-icon"></span>*/}
                {/*</button>*/}

                <div className="navbar-collapse" id="navbarNavAltMarkup">
                    {isAuthenticated ? userLinks : guestLinks}
                </div>
                 <SigninPage show={showSigninPageModal} onClose={this.closeSigninPageModal}/>
            </nav>


        )
    }
}


export default NavigationBar