import React from 'react'
import Link from "react-router-dom/es/Link"
import jwt from 'jsonwebtoken'
import PropTypes from "prop-types"

class Home extends React.Component {
    render() {
        if (localStorage.getItem('CourtSystem')) {
            const token = jwt.decode(localStorage.getItem('CourtSystem'))
            console.log(token)
            if (token.role=== 'system') {
                this.context.router.history.push('/admin/dashboard')

            } else if (token.role === 'advocate') {
                this.context.router.history.push('/advocates/dashboard')
            }
            else if (token.role === 'assistant') {
                this.context.router.history.push('/assistant/dashboard')

            } else if (token.role === 'court-admin') {
                this.context.router.history.push('/court-admin/dashboard')


            }
            else if (token.role === 'registrar') {
                this.context.router.history.push('/registrar/dashboard')


            }
            else if (token.role === 'assistant') {
                this.context.router.history.push('/assistant/dashboard')


            }

        }

        return <div className="container">
            <h2>Welcome Case Filing and Processing System</h2>
            <h4>Proceed as:</h4>
            <ul className="list-unstyled">
                <li><Link to="/advocates/signin">Advocate</Link></li>
                <li><Link to="/deputy-registrar/signin">Deputy Registrar</Link></li>
                <li><Link to="/assistant/signin">Assistant of the court</Link></li>
                <li><Link to="/court-admin/signin">Court station admin</Link></li>
            </ul>
        </div>
    }
}

Home.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Home