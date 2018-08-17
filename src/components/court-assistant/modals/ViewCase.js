"use strict"
import React, {Component} from 'react'
import {
    addHearingInfo,
    findCaseInfo,
    getGuardContactInfo,
    getGuardInfo,
    getGuardPaymentInfo,
    onAddVerdict,
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
            description: '',
            judge: ''
        }
        this.toggle = this.toggle.bind(this)
        this.serveDefendant = this.serveDefendant.bind(this)
        this.onChangeJudge = this.onChangeJudge.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSaveHearing = this.onSaveHearing.bind(this)
        this.onAddVerdict = this.onAddVerdict.bind(this)

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
        if (Date.parse(data.date)< Date.parse(new Date())) {
            errors.date = "Hearing can only be in the future"
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isHearingValid() {
        const {errors, isValid} = this.validateInput(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSaveHearing(e) {
        const message = `The case ${this.state.caseInfo.case_number.prefix}/${this.state.caseInfo.case_number.suffix} has been set for hearing on ${this.state.date}. The Judge preciding will be ${this.state.judge.value}`
        e.preventDefault()
        if (this.isHearingValid()) {
            this.setState({errors: {}, isLoading: true})
            this.setState({loading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            id: this.state.caseInfo.id,
                            date: this.state.date,
                            judge: this.state.judge.value,
                            text: message
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

    validateSuspension(data) {
        let errors = {}
        if (validator.isEmpty(data.description)) {
            errors.description = 'This field is required'
        }
        if (data.description.length < 10) {
            errors.description = 'Description must be at least 10 characters'
        }
        if (!data.description.match(/[\sa-zA-Z]/g)) {
            errors.description = "Description must contain characters"
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateSuspension(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }


    onAddVerdict(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true})
            this.setState({loading: true})
            const message = `The case ${this.state.caseInfo.case_number.prefix}/${this.state.caseInfo.case_number.suffix} been close. The verdict is: ${this.state.description}`

            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            id: this.state.caseInfo.id,
                            description: this.state.description,
                            text: message,
                        },
                        query: onAddVerdict
                    }
                })
                .request.then(({data}) => {
                    if (data) {

                        if (data.onAddVerdict) {
                            this.setState({caseInfo: data.onAddVerdict, isLoading: false})
                        }
                    }


                }
            )
        }
    }

    render() {
        const role = jwt.decode(localStorage.getItem("CourtSystem")).role

        const {show, onClose} = this.props
        const {id, title, description, case_number, plaintiff, defendant, court_station, case_type, case_category, form, payment, verdict, timestamp, registrar_approval, advocate, hearing, status} = this.state.caseInfo

        const {errors, isLoading, invalid, date, judge} = this.state
        const descriptionError = errors.description
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
                            {/*<NavItem>*/}
                                {/*<NavLink*/}
                                    {/*className={classnames({active: this.state.activeTab === 'other'})}*/}
                                    {/*onClick={() => {*/}
                                        {/*this.toggle('other')*/}
                                    {/*}}*/}
                                {/*>*/}
                                    {/*Other actions*/}
                                {/*</NavLink>*/}
                            {/*</NavItem>*/}
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
                                    {hearing.date ? <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Date</th>
                                            <td>{new Date(hearing.date).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Judge</th>
                                            <td>{hearing.judge}</td>
                                        </tr>
                                        </tbody>
                                    </table>:'No hearing date found'
                                    }

                                </div>
                            </TabPane>
                            <TabPane tabId="verdict">
                                {/*{console.log(verdict)}*/}
                                {!verdict.description? <form onSubmit={this.onAddVerdict}>
                                        <div className="offset-sm-3">
                                    <h3>Enter verdict of the case</h3>
                                        </div>
                                    {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                                    <div className="form-group row">
                                        <div className="col-sm-3"><label htmlFor="description">Verdict</label>
                                        </div>
                                        <div className="col-sm-6">
                        <textarea name="description" onChange={this.onChange}
                                  className={classnames("form-control form-control-sm", {"is-invalid": descriptionError})}
                                  rows="5" id="description" onClick={this.onChange} value={this.state.description}/>
                                            {descriptionError &&
                                            <div className="invalid-feedback">{descriptionError}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 offset-3">
                                            <button disabled={isLoading || invalid}
                                                    className="btn btn-dark btn-sm form-control"
                                                    type="submit">Save
                                            </button>
                                        </div>
                                    </div>
                                </form>:
                                <table className="table">
                                <tbody>
                                <tr>
                                    <th scope="row">Description</th>
                                    <td>{verdict.description}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Date</th>
                                    <td>{new Date(verdict.date).toLocaleDateString()}</td>
                                </tr>

                                </tbody>

                            </table>}
                            </TabPane>
                            <TabPane tabId="other">

                                {status && status.state && <table className="table table-borderless">
                                    <tbody>
                                    <tr>
                                        <th scope="row">Status</th>
                                        <td>{status.state}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Date</th>
                                        <td>{new Date(status.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Text</th>
                                        <td>{status.text}</td>
                                    </tr>
                                    </tbody>

                                </table>
                           }
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
