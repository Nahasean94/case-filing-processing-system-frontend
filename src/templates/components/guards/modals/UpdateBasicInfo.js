import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextFieldGroup from "../../../shared/TextFieldsGroup"
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
} from "reactstrap"
import validator from 'validator'
import {isEmpty} from 'lodash'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {changePassword, confirmPassword, updateGuardBasicInfo, uploadProfilePicture} from '../../../shared/queries'
import {Query} from "graphql-react"
import classnames from "classnames"

class UpdateBasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            guard_id: this.props.info.guard_id,
            surname: this.props.info.surname,
            first_name: this.props.info.first_name,
            last_name: this.props.info.last_name,
            dob: this.props.info.dob,
            gender: this.props.info.gender,
            nationalID: this.props.info.nationalID,
            employment_date: this.props.info.employment_date,
            password: '',
            passwordConfirmation: '',
            old_password: '',
            message: '',
            activeTab: 'basic',
            errors: {},
            isLoading: false,
            invalid: false

        }
        this.onChange = this.onChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.onSubmitBasicInfo = this.onSubmitBasicInfo.bind(this)
        this.onSubmitPassword = this.onSubmitPassword.bind(this)
        this.onSubmitProfilePicture = this.onSubmitProfilePicture.bind(this)
        this.handleProfilePicture = this.handleProfilePicture.bind(this)
        this.confirmOldPassword = this.confirmOldPassword.bind(this)
    }


    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            })
        }
    }

    confirmOldPassword() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        guard: this.props.info.id,
                        password: this.state.old_password
                    },
                    query: confirmPassword
                }
            })
            .request.then(({data}) => {
                if (data) {
                    if (!data.confirmPassword.confirmed) {
                        let errors = {}
                        errors.old_password = 'Password does not match existing one'
                        this.setState({errors})
                    } else {
                        this.setState({errors: {}})
                    }
                }
            }
        )
    }

    validateBasicInfo(data) {
        let errors = {}
        if (!data.guard_id) {
            errors.guard_id = 'This field is required'
        }
        if (!data.nationalID) {
            errors.nationalID = 'This field is required'
        }
        if (validator.isEmpty(data.first_name)) {
            errors.first_name = 'This field is required'
        }
        if (validator.isEmpty(data.last_name)) {
            errors.last_name = 'This field is required'
        }
        if (validator.isEmpty(data.gender)) {
            errors.gender = 'This field is required'
        }
        if (validator.isEmpty(data.dob)) {
            errors.dob = 'This field is required'
        }
        if (Date.parse(data.dob) > Date.parse(new Date('2000'))) {
            errors.dob = "A guard must be 18 and above"
        }
        if (validator.isEmpty(data.employment_date)) {
            errors.employment_date = 'This field is required'
        }
        if (Date.parse(data.dob) > Date.parse(data.employment_date)) {
            errors.employment_date = 'You cannot be employed before you are born'
        }
        if (Date.parse(data.employment_date) < Date.parse(new Date('1976'))) {
            errors.dob = 'You should be retired by now'
        }
        if (Date.parse(data.dob) < Date.parse(new Date('1956'))) {
            errors.dob = 'You should be retired by now'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }


    isBasicInfoValid() {
        const {errors, isValid} = this.validateBasicInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }
 isPasswordValid() {
        const {errors, isValid} = this.validatePassword(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onSubmitBasicInfo(e) {
        e.preventDefault()
        if (this.isBasicInfoValid()) {
            console.log(this.state)
            this.setState({errors: {}, isLoading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            id: this.props.info.id,
                            guard_id: String(this.state.guard_id),
                            surname: this.state.surname,
                            first_name: this.state.first_name,
                            last_name: this.state.last_name,
                            dob: this.state.dob,
                            gender: this.state.gender,
                            nationalID: this.state.nationalID,
                            employment_date: this.state.employment_date,
                        },
                        query: updateGuardBasicInfo
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.setState({
                            isLoading: false,
                            invalid: false,
                            message: data.updateGuardBasicInfo
                                ? this.setState({message: 'Basic Details successfully updated'})
                                : this.setState({message: 'Registration Failed'})
                        })
                        this.props.onClose()

                    }
                }
            )
        }
    }

    validatePassword(data) {
        let errors = {}
        if (validator.isEmpty(data.old_password)) {
            errors.old_password = 'This field is required'
        }
        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required'
        }
        if (validator.isEmpty(data.passwordConfirmation)) {
            errors.passwordConfirmation = 'This field is required'
        }
        if (!validator.equals(data.password, data.passwordConfirmation)) {
            errors.passwordConfirmation = 'Passwords must match'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    onSubmitPassword(e) {
        e.preventDefault()
        if (this.isPasswordValid()) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            guard: this.props.info.id,
                            password: this.state.password,
                        },
                        query: changePassword
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        if (data.changePassword.confirmed) {
                            window.location.reload()
                            localStorage.removeItem('Fundcast')
                            this.context.router.history.push('/signin')
                        }
                    }
                }
            )
        }
    }

    onSubmitProfilePicture(e) {
        e.preventDefault()
        if (this.state.file) {
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            guard: this.props.info.id,
                            file: this.state.file
                        },
                        query: uploadProfilePicture
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.props.onClose()
                    }
                }
            )
        }
    }

    handleProfilePicture({
                             target: {
                                 validity,
                                 files: [file]
                             }
                         }) {
        if (validity.valid) {
            this.setState({file})
        }
    }


    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {show, onClose} = this.props

        const {errors, isLoading, invalid, guard_id, surname, first_name, last_name, dob, gender, nationalID, employment_date, password, passwordConfirmation, message, old_password} = this.state
        if (show) {
            return <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog-centered modal-full">
                <ModalHeader toggle={onClose}>Update profile information</ModalHeader>
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
                                className={classnames({active: this.state.activeTab === 'password'})}
                                onClick={() => {
                                    this.toggle('password')
                                }}
                            >
                                Update password
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === 'picture'})}
                                onClick={() => {
                                    this.toggle('picture')
                                }}
                            >
                                Update profile picture
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="basic">
                            <br/>
                            <form onSubmit={this.onSubmitBasicInfo}>
                                <TextFieldGroup
                                    label="Guard ID"
                                    type="number"
                                    name="guard_id"
                                    value={guard_id}
                                    onChange={this.onChange}
                                    error={errors.guard_id}

                                />

                                <TextFieldGroup
                                    label="Surname"
                                    type="text"
                                    name="surname"
                                    value={surname}
                                    onChange={this.onChange}
                                    error={errors.surname}

                                />
                                <TextFieldGroup
                                    label="First name"
                                    type="text"
                                    name="first_name"
                                    value={first_name}
                                    onChange={this.onChange}
                                    error={errors.first_name}

                                />
                                <TextFieldGroup
                                    label="Last name"
                                    type="text"
                                    name="last_name"
                                    value={last_name}
                                    onChange={this.onChange}
                                    error={errors.last_name}

                                />
                                <TextFieldGroup
                                    label={`Date of birth ${new Date(dob).toLocaleDateString()}`}
                                    type="date"
                                    name="dob"
                                    value={dob}
                                    onChange={this.onChange}
                                    error={errors.dob}

                                />

                                <TextFieldGroup
                                    label="National ID"
                                    type="number"
                                    name="nationalID"
                                    value={nationalID}
                                    onChange={this.onChange}
                                    error={errors.nationalID}


                                />

                                <TextFieldGroup
                                    label={`Date of employment ${new Date(employment_date).toLocaleDateString()}`}
                                    type="date"
                                    name="employment_date"
                                    value={employment_date}
                                    onChange={this.onChange}
                                    error={errors.employment_date}

                                />
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="gender">Gender</label>
                                    <div className="col-sm-9">
                                        <select className="form-control form-control-sm" id="gender" name="gender"
                                                required="true" value={gender} onChange={this.onChange}>
                                            <option>Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-4 offset-sm-8">
                                        <button disabled={isLoading || invalid}
                                                className="btn btn-dark btn-sm form-control"
                                                type="submit">Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </TabPane>
                        <TabPane tabId="password">
                            <form onSubmit={this.onSubmitPassword}>
                                <TextFieldGroup
                                    label="Old Password"
                                    type="password"
                                    name="old_password"
                                    value={old_password}
                                    onChange={this.onChange}
                                    error={errors.old_password}
                                    checkIfExists={this.confirmOldPassword}
                                />
                                <TextFieldGroup
                                    label="New Password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.onChange}
                                    error={errors.password}
                                />
                                <TextFieldGroup
                                    label="Confirm New Password "
                                    type="password"
                                    name="passwordConfirmation"
                                    value={passwordConfirmation}
                                    onChange={this.onChange}
                                    error={errors.passwordConfirmation}
                                />
                                <div className="form-group row">
                                    <div className="col-sm-4 offset-sm-8">
                                        <button disabled={isLoading || invalid}
                                                className="btn btn-dark btn-sm form-control"
                                                type="submit">Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </TabPane>
                        <TabPane tabId="picture">
                            <br/>
                            <form onSubmit={this.onSubmitProfilePicture}>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label" htmlFor="customFile">Select
                                        picture</label>
                                    <div className="col-sm-10">
                                        <input type="file" className="form-control-sm" id="customFile"
                                               name="file" accept="image/*" onChange={this.handleProfilePicture}/>

                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-10 offset-sm-2">
                                        <div className="form-group">
                                            <button disabled={isLoading || invalid}
                                                    className="form-control from-control-sm btn btn-dark btn-sm"
                                                    type="submit">Upload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </TabPane>

                    </TabContent>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
                </ModalFooter>
            </Modal>
        }
        else return null
    }

}


UpdateBasicInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default UpdateBasicInfo