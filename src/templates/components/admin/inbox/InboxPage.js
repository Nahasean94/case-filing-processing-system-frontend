import React from 'react'
import {Consumer} from "graphql-react"
import Inbox from "./Inbox"


class InboxPage extends React.Component {

    render() {

        return (
            <div>
                <Consumer>{graphql =>   <Inbox   graphql={graphql}/>}</Consumer>
            </div>
        )
    }
}

export default InboxPage