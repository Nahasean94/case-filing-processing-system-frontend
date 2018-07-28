import React from 'react'
import {timeSince} from "../../../shared/TimeSince"

class InboxView extends React.Component {
    constructor(props){
        super(props)
        this.selectMessage=this.selectMessage.bind(this)
    }
    selectMessage(e){
        e.preventDefault()
        this.props.onSelectMessage(this.props.inbox.id)
    }
    render() {

        const {id, body, author, timestamp,message_type,title} = this.props.inbox

        return (
            <div className="well" onClick={this.selectMessage}>
                <div className="row view-leave">
                    <div className="col-sm-2">
                        <img
                            src={`http://localhost:8080/uploads/${author.profile_picture}`}
                            width="50" height="50"
                            className="rounded-circle"/>
                    </div>
                    <div className="col-sm-10 view-leave">
                        <ul className="list-unstyled">

                            <li>

                        <ul className="list-inline list-unstyled">
                                <li className="list-inline-item">{message_type==='report'?<strong>Report</strong>:message_type==='leave'?<strong>Leave Request</strong>:<strong>{title}</strong>}
                                </li>
                                <li className="list-inline-item pull-right">{timeSince(timestamp)}</li>
                            </ul>
                            </li>
                        <li>
                     {body.substr(0, 50)}...
                        </li>
                        <li className="feed-meta">{author.username}
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default InboxView