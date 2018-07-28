import React, {Component} from 'react'
import TextFieldGroup from "../../shared/TextFieldsGroup"
import {findGuardsInLocation, locations, signin} from "../../shared/queries"
import {fetchOptionsOverride} from "../../shared/fetchOverrideOptions"
import {dbPromise} from './indexDB'
import {Consumer, Query} from "graphql-react"
import Select from 'react-select'
import validator from "validator"
import {isEmpty} from "lodash"
import bcrypt from 'bcryptjs-then'
import GuardModal from "./modals/GuardModal"
import PropTypes from 'prop-types'
import CurrentGuard from '../../shared/CurrentGuard'
import {Nav, NavItem, NavLink} from "reactstrap"

let locationOptions

class GuardsHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            guard_id: '',
            password: '',
            guards: [],
            location: '',
            errors: {},
            isLoading: false,
            invalid: false,
            showGuardModal: false,
            dropdownOpen: false,
            selectedGuard: '',
            display: 'authorize',

        }
        this.onSubmit = this.onSubmit.bind(this)
        this.removeGuard = this.removeGuard.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleLocationChange = this.handleLocationChange.bind(this)
        this.showGuardModal = this.showGuardModal.bind(this)
        this.closeGuardModal = this.closeGuardModal.bind(this)
        this.goToProfile = this.goToProfile.bind(this)
    }

    removeGuard(guard) {
        this.setState({guards: this.state.guards.filter(g => g !== guard)})
        console.log(this.state.guards)
    }


    showGuardModal(e) {
        e.preventDefault()
        this.setState({showGuardModal: true, selectedGuard: e.target.id})
    }

    closeGuardModal(e) {
        this.setState({showGuardModal: false})
    }

    handleLocationChange = (location) => {
        this.setState({location})
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {id: location.value},
                    query: findGuardsInLocation
                }
            })
            .request.then(({data}) => {
                if (data) {
                    if (data.findGuardsInLocation.length > 0) {
                        dbPromise.then(function (db) {
                            let tx = db.transaction('guards', 'readwrite')
                            let store = tx.objectStore('guards')
                            return data.findGuardsInLocation.map(guard => {
                                return store.add(guard)
                            })
                        }).then(sth => {
                            console.log(sth)
                        })
                    }
                }
            }
        )
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})

    }

    validateInfo(data) {
        let errors = {}
        if (validator.isEmpty(data.password)) {
            errors.password = 'This field is required'
        }
        if (!data.guard_id) {
            errors.guard_id = 'This field is required'
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

    goToProfile(e) {
        e.preventDefault()
        if (this.isValid()) {
            const {guard_id, password} = this.state
            dbPromise.then(db => {
                let tx = db.transaction('guards', 'readonly')
                let store = tx.objectStore('guards')
                return store.get(Number(guard_id))
            }).then(guard => {
                if (guard) {
                    bcrypt.compare(password, guard.password).then(valid => {
                        if (valid) {
                            CurrentGuard.setGuardId(String(this.state.guard_id))
                            this.context.router.history.push('/guards/profile')
                        } else {
                            let errors = {}
                            errors.password = 'Incorrect password'
                            this.setState({errors})
                        }
                    })
                } else {
                    let errors = {}
                    errors.guard_id = 'Guard ID Not Found'
                    this.setState({errors})
                }
            })
        }
    }


    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            const {guard_id, password} = this.state
            dbPromise.then(db => {
                let tx = db.transaction('guards', 'readonly')
                let store = tx.objectStore('guards')
                return store.get(Number(guard_id))
            }).then(guard => {
                if (guard) {
                    bcrypt.compare(password, guard.password).then(valid => {
                        if (valid) {
                            dbPromise.then(db => {
                                let tx = db.transaction('attendance', 'readonly')
                                let store = tx.objectStore('attendance')
                                return store.get(new Date().toLocaleDateString())
                            }).then(g => {
                                if (g) {
                                    let errors = {}
                                    errors.guard_id = 'You are already signed in'
                                    this.setState({errors})
                                } else {
                                    this.setState({
                                        guard_id: '',
                                        password: '',
                                        errors: {},
                                        guards: [...this.state.guards, guard.first_name]
                                    })
                                    const signedIn = {
                                        guard_id: guard_id,
                                        signin: new Date().toLocaleString(),
                                        signout: '',
                                        date: new Date().toLocaleDateString()
                                    }
                                    dbPromise.then(db => {
                                        let tx = db.transaction('attendance', 'readwrite')
                                        let store = tx.objectStore('attendance')
                                        return store.add(signedIn)
                                    }).then(added => {
                                        this.props.graphql
                                            .query({
                                                fetchOptionsOverride: fetchOptionsOverride,
                                                resetOnLoad: true,
                                                operation: {
                                                    variables: {
                                                        guard_id: signedIn.guard_id,
                                                        signin: signedIn.signin,
                                                        date: signedIn.date
                                                    },
                                                    query: signin
                                                }
                                            })
                                            .request.then(({data}) => {
                                                if (data) {
                                                    console.log(data)
                                                }
                                            }
                                        )
                                    })
                                }
                            })

                        } else {
                            let errors = {}
                            errors.password = 'Incorrect password'
                            this.setState({errors})
                        }
                    })
                } else {
                    let errors = {}
                    errors.guard_id = 'Guard ID Not Found'
                    this.setState({errors})
                }
            })
        }
    }


    render() {
        const {guards, errors, isLoading, showGuardModal} = this.state
        return (
            <div>
                <div className="container-fluid">
                    <div className="row flex-xl-nowrap">
                        <div className="col-2 col-md-2 bd-sidebar">
                            <h3>Signed in</h3>
                            <Nav pills vertical className="bd-links" id="bd-docs-nav">
                                {guards.map(guard => {
                                    return <NavItem>
                                        <NavLink href="" onClick={this.showGuardModal} id={guard}> {guard}</NavLink>
                                    </NavItem>
                                })}

                            </Nav>
                        </div>
                        <div className="col-4 col-md-4 col-xl-4 offset-2 bd-content no-float">
                            <div className="sign-in-form">
                                <form onSubmit={this.onSubmit}>
                                    <TextFieldGroup
                                        label="Guard ID"
                                        type="number"
                                        name="guard_id"
                                        value={this.state.guard_id}
                                        onChange={this.onChange}
                                        error={errors.guard_id}
                                    />
                                    <TextFieldGroup
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                        error={errors.password}
                                    />
                                    <div className="form-group row">
                                        <div className="col-sm-5 offset-sm-3">
                                            <input type="submit" value="Sign in"
                                                   className="form-control btn btn-dark btn-sm "/>
                                        </div>
                                        <div className="col-sm-4">
                                            <button className="btn btn-dark btn-sm form-control "
                                                    onClick={this.goToProfile}>Profile
                                            </button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-2 col-md-2 offset-2 bd-location">
                            <h3>Select location</h3>
                            <Query
                                loadOnMount
                                loadOnReset
                                fetchOptionsOverride={fetchOptionsOverride}
                                query={locations}
                            >
                                {({loading, data}) => {
                                    if (data) {
                                        locationOptions = data.locations.map(location => {
                                            return {
                                                label: location.name,
                                                value: location.id
                                            }
                                        })
                                        return <Select.Creatable
                                            closeOnSelect={true}
                                            onChange={this.handleLocationChange}
                                            options={locationOptions}
                                            placeholder="Search locations"
                                            removeSelected={true}
                                            value={this.state.location}/>
                                    }
                                    else if (loading) {
                                        return <p>Loading…</p>
                                    }
                                    return <p>Loading failed.</p>
                                }
                                }
                            </Query>
                            <br/>
                            <strong>Location: </strong>{this.state.location ? this.state.location.label : 'no location set'}
                        </div>
                        <Consumer>{graphql => <GuardModal removeGuard={this.removeGuard} graphql={graphql}
                                                          show={showGuardModal}
                                                          onClose={this.closeGuardModal}
                                                          guard={this.state.selectedGuard}/>}</Consumer>
                    </div>
                </div>
            </div>)
    }
}

GuardsHome.contextTypes = {
    router: PropTypes.object.isRequired
}
export default GuardsHome

