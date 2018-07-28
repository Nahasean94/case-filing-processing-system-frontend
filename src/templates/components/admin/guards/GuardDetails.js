import React, {Component} from 'react'
import {getGuardContactInfo, getGuardInfo, getGuardPaymentInfo} from "../../../shared/queries"
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {Consumer, Query} from "graphql-react"
import {isEmpty} from "lodash"
import validator from '../../../../node_modules/validator/index.js'
import classnames from "classnames"
import PropTypes from "prop-types"
import {Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap'
import CurrentGuard from "../../../shared/CurrentGuard"
import UpdateBasicInfo from "../../guards/modals/UpdateBasicInfo"
import UpdateContactInfo from "../../guards/modals/UpdateContactInfo"

class GuardDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: '',
            duration: '',
            message: '',
            guards: [],
            errors: {},
            isLoading: false,
            invalid: false,
            activeTab: 'basic',
            showUpdateBasicInfoModal: false,
            showUpdateContactInfoModal: false,
            showUpdatePaymentInfoModal: false
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.showUpdateBasicInfoModal = this.showUpdateBasicInfoModal.bind(this)
        this.closeUpdateBasicInfoModal = this.closeUpdateBasicInfoModal.bind(this)
        this.showUpdateContactInfoModal = this.showUpdateContactInfoModal.bind(this)
        this.closeUpdateContactInfoModal = this.closeUpdateContactInfoModal.bind(this)
    }

    showUpdateBasicInfoModal() {
        this.setState({showUpdateBasicInfoModal: true})
    }

    closeUpdateBasicInfoModal() {
        this.setState({showUpdateBasicInfoModal: false})
    }
    showUpdateContactInfoModal() {
        this.setState({showUpdateContactInfoModal: true})
    }

    closeUpdateContactInfoModal() {
        this.setState({showUpdateContactInfoModal: false})
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            })
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})

    }

    validateInfo(data) {
        let errors = {}
        if (validator.isEmpty(data.duration)) {
            errors.duration = 'This field is required'
        }
        if (!data.date) {
            errors.date = 'This field is required'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            const {date, duration} = this.state


        }
    }

    render() {
        return (
            this.props.guard?<div className="container-fluid"><div className="row"> <h2 className="offset-sm-4">Guard Details </h2>
                                <div>
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
                                                className={classnames({active: this.state.activeTab === 'contact'})}
                                                onClick={() => {
                                                    this.toggle('contact')
                                                }}
                                            >
                                                Contact Info
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({active: this.state.activeTab === 'payment'})}
                                                onClick={() => {
                                                    this.toggle('payment')
                                                }}
                                            >
                                                Payment Info
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="basic">
                                            <Query
                                                loadOnMount
                                                loadOnReset
                                                fetchOptionsOverride={fetchOptionsOverride}
                                                variables={{guard_id:this.props.guard}}
                                                query={getGuardInfo}
                                            >
                                                {({loading, data}) => {
                                                    if (data) {
                                                        if (data.getGuardInfo) {
                                                            return (<div>
                                                                    <ul className="list-inline view-leave">

                                                                        <li className="list-inline-item">
                                                                            <img
                                                                                src={`http://localhost:8080/uploads/${data.getGuardInfo.profile_picture}`}
                                                                                width="150" height="150"
                                                                                className="rounded-circle"/>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <button className="btn-dark btn-sm"
                                                                                    onClick={this.showUpdateBasicInfoModal}>Update
                                                                                basic
                                                                                info
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                    <table className="table table-borderless">
                                                                        <tbody>
                                                                        <tr>
                                                                            <th scope="row">Surname:</th>
                                                                            <td>{data.getGuardInfo.surname}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">First
                                                                                name:
                                                                            </th>
                                                                            <td>{data.getGuardInfo.first_name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Last
                                                                                name:
                                                                            </th>
                                                                            <td>{data.getGuardInfo.last_name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Date of
                                                                                birth:
                                                                            </th>
                                                                            <td>{new Date(data.getGuardInfo.dob).toLocaleDateString()}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Gender:</th>
                                                                            <td>{data.getGuardInfo.gender}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">National
                                                                                ID:
                                                                            </th>
                                                                            <td>{data.getGuardInfo.nationalID}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Date of
                                                                                employment:
                                                                            </th>
                                                                            <td>{new Date(data.getGuardInfo.employment_date).toLocaleDateString()}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Guard
                                                                                ID:
                                                                            </th>
                                                                            <td>{data.getGuardInfo.guard_id}</td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <Consumer>{graphql => <UpdateBasicInfo graphql={graphql}
                                                                                                           show={this.state.showUpdateBasicInfoModal}
                                                                                                           onClose={this.closeUpdateBasicInfoModal}
                                                                                                           info={data.getGuardInfo}/>}</Consumer>
                                                                </div>
                                                            )
                                                        } else {
                                                            return <p>No basic information was found</p>
                                                        }
                                                    }
                                                    else if (loading) {
                                                        return <p>Loading…</p>
                                                    }
                                                    return <p>Loading failed.</p>
                                                }
                                                }
                                            </Query>
                                        </TabPane>
                                        <TabPane tabId="contact"> <Query
                                            loadOnMount
                                            loadOnReset
                                            fetchOptionsOverride={fetchOptionsOverride}
                                            variables={{guard_id: this.props.guard}}
                                            query={getGuardContactInfo}
                                        >
                                            {({loading, data}) => {
                                                if (data) {
                                                    if (data.getGuardContactInfo) {
                                                        return (
                                                            <div>
                                                                <button className="btn-dark btn-sm" onClick={this.showUpdateContactInfoModal}>Update contact
                                                                    info
                                                                </button>

                                                                <table className="table table-borderless">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th scope="row">Email:</th>
                                                                        <td>{data.getGuardContactInfo.email}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Postal Address
                                                                        </th>
                                                                        <td>{data.getGuardContactInfo.postal_address}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Phone number
                                                                        </th>
                                                                        <td>{data.getGuardContactInfo.cellphone}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Deployed Location
                                                                        </th>
                                                                        <td>{data.getGuardContactInfo.location.name}
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <Consumer>{graphql => <UpdateContactInfo graphql={graphql}
                                                                                                         show={this.state.showUpdateContactInfoModal}
                                                                                                         onClose={this.closeUpdateContactInfoModal}
                                                                                                         info={data.getGuardContactInfo}/>}</Consumer>
                                                            </div>
                                                        )
                                                    } else {
                                                        return <p>No contact information was found</p>
                                                    }
                                                }
                                                else if (loading) {
                                                    return <p>Loading…</p>
                                                }
                                                return <p>Loading failed.</p>
                                            }
                                            }
                                        </Query>
                                        </TabPane>
                                        <TabPane tabId="payment">
                                            <Query
                                                loadOnMount
                                                loadOnReset
                                                fetchOptionsOverride={fetchOptionsOverride}
                                                variables={{guard_id: this.props.guard}}
                                                query={getGuardPaymentInfo}
                                            >
                                                {({loading, data}) => {
                                                    if (data) {
                                                        if (data.getGuardPaymentInfo) {
                                                            let total_deductions=0
                                                            return (
                                                                <div>
                                                                    <table className="table table-borderless">
                                                                        <tbody>
                                                                        <tr>
                                                                            <th scope="row">Gross salary:</th>
                                                                            <td>{data.getGuardPaymentInfo.gross_salary}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Payment contract
                                                                            </th>
                                                                            <td>{data.getGuardPaymentInfo.contract}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Deductions
                                                                            </th>
                                                                            {data.getGuardPaymentInfo.deductions.length && data.getGuardPaymentInfo.deductions.map(deduction => {
                                                                                total_deductions=total_deductions+deduction.amount
                                                                                return (
                                                                                    <tr>
                                                                                        <th scope="row">{deduction.name.toLocaleUpperCase()}
                                                                                        </th>
                                                                                        <td>{deduction.amount}</td>
                                                                                    </tr>
                                                                                )
                                                                            })}
                                                                            <hr/>
                                                                            <tr>
                                                                                <th scope="row">Total deductions
                                                                                </th>
                                                                                <td>{total_deductions}</td>
                                                                            </tr>
                                                                        </tr>
                                                                        <tr>
                                                                            <th scope="row">Net Salary
                                                                            </th>
                                                                            <td>{data.getGuardPaymentInfo.gross_salary-total_deductions}</td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>

                                                                </div>
                                                            )
                                                        } else {
                                                            return <p>No payment information was found</p>
                                                        }
                                                    }
                                                    else if (loading) {
                                                        return <p>Loading…</p>
                                                    }
                                                    return <p>Loading failed.</p>
                                                }
                                                }
                                            </Query>
                                        </TabPane>
                                        {/*<TabPane tabId="payment">*/}
                                            {/*<Query*/}
                                                {/*loadOnMount*/}
                                                {/*loadOnReset*/}
                                                {/*fetchOptionsOverride={fetchOptionsOverride}*/}
                                                {/*variables={{guard_id: this.props.guard}}*/}
                                                {/*query={getGuardPaymentInfo}*/}
                                            {/*>*/}
                                                {/*{({loading, data}) => {*/}
                                                    {/*if (data) {*/}
                                                        {/*if (data.getGuardPaymentInfo) {*/}
                                                            {/*let total_deductions*/}
                                                            {/*return (*/}
                                                                {/*<div>*/}
                                                                    {/*<table className="table table-borderless">*/}
                                                                        {/*<tbody>*/}
                                                                        {/*<tr>*/}
                                                                            {/*<th scope="row">Gross salary:</th>*/}
                                                                            {/*<td>{data.getGuardPaymentInfo.gross_salary}</td>*/}
                                                                        {/*</tr>*/}
                                                                        {/*<tr>*/}
                                                                            {/*<th scope="row">Payment contract*/}
                                                                            {/*</th>*/}
                                                                            {/*<td>{data.getGuardPaymentInfo.contract}</td>*/}
                                                                        {/*</tr>*/}
                                                                        {/*<tr>*/}
                                                                            {/*<th scope="row">Deductions*/}
                                                                            {/*</th>*/}
                                                                            {/*{data.getGuardPaymentInfo.deductions.length && data.getGuardPaymentInfo.deductions.map(deduction => {*/}
                                                                                {/*total_deductions=total_deductions+deduction.amount*/}
                                                                                {/*return (*/}
                                                                                    {/*<tr>*/}
                                                                                        {/*<th scope="row">{deduction.name.toLocaleUpperCase()}*/}
                                                                                        {/*</th>*/}
                                                                                        {/*<td>{deduction.amount}</td>*/}
                                                                                    {/*</tr>*/}
                                                                                {/*)*/}
                                                                            {/*})}*/}
                                                                            {/*<hr/>*/}
                                                                            {/*<tr>*/}
                                                                                {/*<th scope="row">Total deductions*/}
                                                                                {/*</th>*/}
                                                                                {/*<td>{total_deductions}</td>*/}
                                                                            {/*</tr>*/}
                                                                        {/*</tr>*/}
                                                                        {/*<tr>*/}
                                                                            {/*<th scope="row">Net Salary*/}
                                                                            {/*</th>*/}
                                                                            {/*<td>{getGuardPaymentInfo.gross_salary-total_deductions}</td>*/}
                                                                        {/*</tr>*/}
                                                                        {/*</tbody>*/}
                                                                    {/*</table>*/}

                                                                {/*</div>*/}
                                                            {/*)*/}
                                                        {/*} else {*/}
                                                            {/*return <p>No payment information was found</p>*/}
                                                        {/*}*/}
                                                    {/*}*/}
                                                    {/*else if (loading) {*/}
                                                        {/*return <p>Loading…</p>*/}
                                                    {/*}*/}
                                                    {/*return <p>Loading failed.</p>*/}
                                                {/*}*/}
                                                {/*}*/}
                                            {/*</Query>*/}
                                        {/*</TabPane>*/}
                                    </TabContent>
                                </div></div></div>:<p>Select guard to view details</p>)

    }
}

GuardDetails.contextTypes = {
    router: PropTypes.object.isRequired
}

export default GuardDetails

