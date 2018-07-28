import React, {Component} from 'react'
import {getAllInbox,} from "../../../shared/queries"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import Menu from '../Menu'
import PropTypes from "prop-types"
import CurrentGuard from "../../../shared/CurrentGuard"
import InboxView from "./InboxView"
import MessageView from "./MessageView"
import classnames from "classnames"
import CustomMessage from "./CustomMessageModal"

class Inbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            showCustomMessageModal: false
        }
        this.onSelectMessage = this.onSelectMessage.bind(this)
        this.showCustomMessageModal = this.showCustomMessageModal.bind(this)
        this.closeCustomMessageModal = this.closeCustomMessageModal.bind(this)
    }

    onSelectMessage(message) {
        this.setState({message})
    }

    showCustomMessageModal() {
        this.setState({showCustomMessageModal: true})
    }

    closeCustomMessageModal() {
        this.setState({showCustomMessageModal: false})

    }


    render() {
        const {message,showCustomMessageModal} = this.state

        return (
            <div className="container-fluid">

                <div className="row">
                    <div className="col-sm-2 col-md-2 bd-sidebar">
                        <Menu router={this.context.router} active="inbox"/>

                    </div>
                    <div className="col-sm-5 col-md-5 col-xl-5 bd-content">
                        <button className="btn btn-sm btn-dark" onClick={this.showCustomMessageModal}>Send custom message</button>
                        <br/>
                        <br/>
                        <Query
                            loadOnMount
                            loadOnReset
                            fetchOptionsOverride={fetchOptionsOverride}
                            // variables={{guard_id: CurrentGuard.getGuardId()}}
                            query={getAllInbox}
                        >
                            {({loading, data}) => {
                                if (data) {
                                    if (data.getAllInbox && data.getAllInbox.length > 0) {
                                        return (<ul className="list-unstyled ">
                                            {data.getAllInbox.map(inbox => {
                                                return <li
                                                    className={classnames("inbox-list", {"inbox-list-selected": inbox.id === this.state.message})}>
                                                    <InboxView inbox={inbox} onSelectMessage={this.onSelectMessage}/>
                                                    {/*<hr className="inbox-list"/>*/}
                                                </li>
                                            })}
                                        </ul>)
                                    } else {
                                        return <p>No items on your inbox</p>
                                    }
                                }
                                else if (loading) {
                                    return <p>Loading…</p>
                                }
                                return <p>Loading failed.</p>
                            }
                            }
                        </Query>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xl-5 bd-location">
                        <MessageView message={message}/>
                    </div>
                </div>
                <Consumer>{graphql=><CustomMessage graphql={graphql} show={showCustomMessageModal} onClose={this.closeCustomMessageModal}/>}</Consumer>
            </div>
        )

    }
}

Inbox.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Inbox

