import React from 'react'
import SignupPage from "./signup/SignupPage"
import LoginPage from "./login/LoginPage"
import {Consumer} from "graphql-react"

export default () => {
        return (
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className="col-sm-5">
                                <LoginPage />
                            </div>
                            <div className="col-sm-6 offset-1">
                                <SignupPage/>
                            </div>
                        </div>
                    </div>
        )

}