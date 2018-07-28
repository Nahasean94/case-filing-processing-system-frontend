import React from 'react'
import SignupForm from './SignupForm'
import {Consumer} from "graphql-react"


class SignupPage extends React.Component {

    render() {

        return (
                <div>
                    <Consumer>{graphql =>   <SignupForm   graphql={graphql}/>}</Consumer>
                </div>
        )
    }
}

export default SignupPage