"use strict"
import React, {Component} from 'react'
import {findCaseInfo, getGuardContactInfo, getGuardInfo, getGuardPaymentInfo} from "../../../../shared/queries"
import {isEmpty} from "lodash"
import classnames from "classnames"
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
import jwt from "jsonwebtoken"
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"

class ViewCase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'basic',
            caseInfo: '',
            loading: false,
            error: false,
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

    componentDidMount() {
    console.log(this.props.id)
if(this.props.id){
        const token = jwt.decode(localStorage.getItem("CourtSystem"))
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        id: this.props.id,
                    },
                    query: findCaseInfo
                }
            })
            .request.then(({data, loading, error}) => {
                if (data) {
                    if (data.findCaseInfo) {
                        this.setState({caseInfo: data.findCaseInfo, loading: false, error: false})
                    }
                }
                if (loading) {
                    this.setState({loading: true, error: false})
                }
                if (error) {
                    this.setState({loading: false, error: true})
                }
            }
        )
}
    }

    render() {
        const {show, onClose} = this.props
        const {id, title, description, case_number, plaintiff, defendant, court_station, case_type, case_category, form, payment, judge, verdict, timestamp, registrar_approval, advocate} = this.state.caseInfo
        console.log(this.state.caseInfo)
        if (show && this.state.caseInfo) {
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
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === 'other'})}
                                    onClick={() => {
                                        this.toggle('other')
                                    }}
                                >
                                    Other actions
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="basic">
                                <div className="col-sm-4">

                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Case Number</th>
                                            <td>{case_number.prefix}/{case_number.suffix}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Title</th>
                                            <td>{title}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Description</th>
                                            <td>{description}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabPane>
                            <TabPane tabId="case-type">
                                <div className="col-sm-4">

                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Court Station</th>
                                            <td>{court_station.name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Case Type</th>
                                            <td>{case_type.name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Case Category</th>
                                            <td>{case_category.name}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabPane>
                            <TabPane tabId="plaintiff">
                                <div className="col-sm-4">

                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Type</th>
                                            <td>{plaintiff.party_type}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Name</th>
                                            <td>{plaintiff.party_id.name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email</th>
                                            <td>{plaintiff.party_id.email}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Phone number</th>
                                            <td>{plaintiff.party_id.cellphone}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <hr/>
                                    <h3>Advocate</h3>
                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Name</th>
                                            <td>{advocate.surname} {advocate.first_name} {advocate.last_name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email</th>
                                            <td>{advocate.email}</td>
                                        </tr>
                                        {/*<tr>*/}
                                            {/*<th scope="row">Phone number</th>*/}
                                            {/*<td>{advocate.cellphone}</td>*/}
                                        {/*</tr>*/}
                                        </tbody>
                                    </table>
                                </div>
                            </TabPane>
                            <TabPane tabId="defendant">
                                <div className="col-sm-4">

                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Type</th>
                                            <td>{defendant.party_type}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Name</th>
                                            <td>{defendant.name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email</th>
                                            <td>{defendant.email}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Phone number</th>
                                            <td>{defendant.cellphone}</td>
                                        </tr>
                                        </tbody>

                                    </table>
                                </div>
                            </TabPane>
                            <TabPane tabId="forms">
                             <ol>
                                 <li><a href={`http://localhost:8080/uploads/${form.path}`}>{form.type_of_form.name}</a></li>
                             </ol>
                            </TabPane>
                            <TabPane tabId="payment">
                                <div className="col-sm-4">

                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Total fee paid</th>
                                            <td>{payment.fee}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabPane>
                            <TabPane tabId="hearing">
                                <div className="col-sm-4">
                                    Hearing to be added
                                </div>
                            </TabPane>
                            <TabPane tabId="verdict">
                                Verdict to be added
                            </TabPane>
                            <TabPane tabId="other">
                                <ul className="list-unstyled">
                                    <li>Suspend</li>
                                </ul>
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
