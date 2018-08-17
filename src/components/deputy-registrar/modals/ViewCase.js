"use strict"
import React, {Component} from 'react'
import {
    addHearingInfo,
    findCaseInfo,
    getGuardContactInfo,
    getGuardInfo,
    getGuardPaymentInfo,
    serveDefendant
} from "../../../shared/queries"
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
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import validator from "validator"
import Select from 'react-select'


const judgeOptions = [{
    label: "Maraga",
    value: "Maraga"
}, {
    label: "Njoki",
    value: "Njoki"
}, {
    label: "Judy",
    value: "Judy"
}, {
    label: "James",
    value: "James"
}]

class ViewCase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'basic',
            caseInfo: {},
            loading: false,
            error: false,
            invalid: false,
            isLoading: false,
            errors: '',
            date: '',
            judge: ''
        }
        this.toggle = this.toggle.bind(this)
        this.serveDefendant = this.serveDefendant.bind(this)
        this.onChangeJudge = this.onChangeJudge.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSaveHearing = this.onSaveHearing.bind(this)

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            })
        }
    }

    componentDidMount() {
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

    serveDefendant() {
        const message = `You have been served. Use the case number ${this.state.caseInfo.case_number.prefix}/${this.state.caseInfo.case_number.suffix} find more about the case. Details of the plaintiff: Name: ${this.state.caseInfo.plaintiff.party_id.name}, Phone no. ${this.state.caseInfo.plaintiff.party_id.cellphone}`
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        id: this.state.caseInfo.id,
                        message: message,
                    },
                    query: serveDefendant
                }
            })
            .request.then(({data, loading, error}) => {
                if (data) {
                    if (data.serveDefendant) {
                        this.setState({caseInfo: data.serveDefendant, loading: false, error: false})
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

    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.date)) {
            errors.date = 'This field is required'
        }
        if (!data.judge.value) {
            errors.judge = 'This field is required'
        }
        if (Date.parse(data.dob) <= Date.parse(new Date())) {
            errors.dob = "Hearing can only be in the future"
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateInput(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSaveHearing(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true})
            this.setState({loading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            id:this.state.caseInfo.id,
                            date: this.state.date,
                            judge: this.state.judge.value
                        },
                        query: addHearingInfo
                    }
                })
                .request.then(({data}) => {
                    if (data) {

                        if (data.addHearingInfo) {
                            this.setState({caseInfo: data.addHearingInfo, isLoading: false})
                        }
                    }


                }
            )
        }
    }

    onChangeJudge(judge) {
        this.setState({judge})
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const role = jwt.decode(localStorage.getItem("CourtSystem")).role

        const {show, onClose} = this.props
        const {id, title, description, case_number, plaintiff, defendant, court_station, case_type, case_category, form, payment, verdict, timestamp, registrar_approval, advocate, hearing} = this.state.caseInfo
        const {errors, isLoading, invalid, date, judge} = this.state
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
                                <div className="col-sm-46">

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
                                        <br/>
                                        {!defendant.served.text ? <tr>
                                            <th scope="row">Serve the defendant</th>
                                            <td>
                                                <button className="btn btn-sm btn-dark"
                                                        onClick={this.serveDefendant}>Serve
                                                </button>
                                            </td>
                                        </tr> : <h6>Defendant served</h6>}
                                        </tbody>

                                    </table>
                                </div>
                            </TabPane>
                            <TabPane tabId="forms">
                                <ol>
                                    <li><a
                                        href={`http://localhost:8080/uploads/${form.path}`}>{form.type_of_form.name}</a>
                                    </li>
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
                                <br/>
                                <div className="col-sm-6">
                                    {hearing? <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Date</th>
                                            <td>{hearing.date}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Judge</th>
                                            <td>{hearing.judge}</td>
                                        </tr>
                                        </tbody>
                                    </table>: <form onSubmit={this.onSaveHearing}>
                                        <div className="row">
                                        </div>
                                        {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                                        <TextFieldGroup
                                            label="Date of hearing"
                                            type="date"
                                            name="date"
                                            value={date}
                                            onChange={this.onChange}
                                            error={errors.date}
                                        />
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Judge</label>
                                            <div className="col-sm-9">
                                        <Select
                                            closeOnSelect={true}
                                            onChange={this.onChangeJudge}
                                            options={judgeOptions}
                                            placeholder="Search Judge"
                                            removeSelected={true}
                                            value={this.state.judge}
                                        />
                                                {errors ? errors.judge && <div className="alert alert-danger">
                                                    {errors.judge}
                                                </div> : ''}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-9 offset-3">
                                                <button disabled={isLoading || invalid}
                                                        className="btn btn-dark btn-sm form-control"
                                                        type="submit">Save
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    }

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
