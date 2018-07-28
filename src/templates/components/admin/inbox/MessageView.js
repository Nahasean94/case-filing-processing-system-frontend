import React from 'react'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import { getMessage} from "../../../shared/queries"
import {Consumer, Query} from "graphql-react"
import Comments from "./comments/Comments"

class MessageView extends React.Component {
    render() {
        const {message} = this.props
        if (message) {
            return <Query
                loadOnMount
                loadOnReset
                fetchOptionsOverride={fetchOptionsOverride}
                variables={{id: message}}
                query={getMessage}
            >
                {({loading, data}) => {
                    if (data) {
                        const {id, body, author, replies, timestamp,message_type,title} = data.getMessage
                        return <div>
                            {message_type==='report'?<h4>Report</h4>:message_type==='leave'?<h4>Leave Request</h4>:<h4>{title}</h4>}
                            <hr/>
                            <div className="row view-leave">
                                <div className="col-sm-3">
                                    <img
                                        src={`http://localhost:8080/uploads/${author.profile_picture}`}
                                        width="90" height="90"
                                        className="rounded-circle"/>
                                </div>
                                <div className="col-sm-9">
                                    <ul className="list-unstyled">
                                        <li><strong>{author.username}</strong></li>
                                        <li>
                                            <strong>Date: </strong>&nbsp;{new Date(timestamp).toLocaleString()}</li>
                                    </ul>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <p>{body}...</p>
                            <hr/>
                            <h5>Replies</h5>
                            <Consumer>{graphql =>
                                <Comments graphql={graphql} replies={replies} id={message}/>}</Consumer>
                        </div>
                    }
                    else if (loading) {
                        return <p>Loading…</p>
                    }
                    return <p>Loading failed.</p>
                }}

            </Query>
        }
        return <p>Select an item to read</p>
    }
}

export default MessageView