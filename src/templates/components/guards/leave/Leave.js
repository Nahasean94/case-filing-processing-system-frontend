import React from 'react'
import {Consumer} from "graphql-react"
import ApplyForLeave from "./ApplyForLeave"


class Leave extends React.Component {

    render() {

        return (
            <div>
                <Consumer>{graphql =>   <ApplyForLeave  graphql={graphql}/>}</Consumer>
            </div>
        )
    }
}

export default Leave