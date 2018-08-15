"use strict"
import React, {Component} from 'react'
import {getGuardContactInfo, getGuardInfo, getGuardPaymentInfo} from "../../../shared/queries"
import {isEmpty} from "lodash"
import classnames from "classnames"
import Menu from '../Menu'
import PropTypes from "prop-types"
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap'

class ViewCase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'basic',
        }
        this.toggle = this.toggle.bind(this)

    }


    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            })
        }
    }

    render() {
        const {show, onClose} = this.props
        if (show) {

            return (
                <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog modal-dialog-centered">
                    <ModalHeader toggle={onClose}>View Case</ModalHeader>
                    <ModalBody>

                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'basic'})}
                                                    onClick={() => {
                                                        this.toggle('basic')
                                                    }}
                                                >
                                                    Basic Info
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'case-type'})}
                                                    onClick={() => {
                                                        this.toggle('case-type')
                                                    }}
                                                >
                                                   Case Type
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'plaintiff'})}
                                                    onClick={() => {
                                                        this.toggle('plaintiff')
                                                    }}
                                                >
                                                   Plaintiff
                                                </NavLink>
                                            </NavItem>
                                                <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'defendant'})}
                                                    onClick={() => {
                                                        this.toggle('defendant')
                                                    }}
                                                >
                                                   Defendant
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'forms'})}
                                                    onClick={() => {
                                                        this.toggle('forms')
                                                    }}
                                                >
                                                   Forms
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'payment'})}
                                                    onClick={() => {
                                                        this.toggle('payment')
                                                    }}
                                                >
                                                   Payments
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'hearing'})}
                                                    onClick={() => {
                                                        this.toggle('hearing')
                                                    }}
                                                >
                                                   Hearing info
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === 'verdict'})}
                                                    onClick={() => {
                                                        this.toggle('verdict')
                                                    }}
                                                >
                                                   Verdict
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="basic">

                                            </TabPane>
                                            <TabPane tabId="contact">
                                            </TabPane>
                                            <TabPane tabId="payment">

                                            </TabPane>
                                        </TabContent>


                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
                    </ModalFooter>
                </Modal>
            )
        }
        else return null
    }


}

ViewCase.contextTypes = {
    router: PropTypes.object.isRequired
}

export default ViewCase
