import React from 'react'
import SignupForm from "./SignupForm"
import LoginForm from "./LoginForm"

class AdvocatesSignInPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            createAccount: false,
            message: ''
        }
        this.createdAccount = this.createdAccount.bind(this)
        this.creatingAccount = this.creatingAccount.bind(this)
    }

    creatingAccount(e) {
        e.preventDefault()
        this.setState({createAccount: true})
    }

    createdAccount() {
        this.setState({createAccount: false})
    }

    render() {
        const {createAccount, message} = this.state
        return (
            <div className='container'>
                <div className='row'>
                    <div className="col-sm-6 offset-sm-3">
                        {message &&
                        <div className="alert alert-dark">Account successfully created. Proceed to login</div>}
                        {!createAccount && <div><LoginForm/>
                            <a href="" onClick={this.creatingAccount}>Create account</a>
                        </div>}
                        {createAccount && <SignupForm createdAccount={this.createdAccount}/>}
                    </div>
                </div>
            </div>
        )

    }
}

export default AdvocatesSignInPage