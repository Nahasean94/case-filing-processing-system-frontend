import React from 'react'

import {Consumer} from "graphql-react"
import TextFieldGroup from "../../../shared/TextFieldsGroup"
import validator from "validator"
import {isEmpty} from "lodash"
import bcrypt from 'bcryptjs-then'
import {dbPromise} from '../indexDB'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {signout} from "../../../shared/queries"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"

class GuardModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            guard_id:'',
            password:'',
            errors: {},
        }

        this.onSignout = this.onSignout.bind(this)
        this.onChange = this.onChange.bind(this)
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


    onSignout(e) {
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
                            this.setState({
                                guard_id: '',
                                password: '',
                                errors: {},
                            })
                            const todayDate = new Date().toLocaleString()
                            let date, signin
                            dbPromise.then(db => {
                                let tx = db.transaction('attendance', 'readonly')
                                let store = tx.objectStore('attendance')
                                return store.get(new Date().toLocaleDateString())
                            }).then(guard => {
                                dbPromise.then(db => {
                                    let tx = db.transaction('attendance', 'readwrite')
                                    let store = tx.objectStore('attendance')
                                    let updatedRecord = {
                                        guard_id: guard.guard_id,
                                        signin: guard.signin,
                                        signout: todayDate,
                                        date: guard.date
                                    }
                                    date = guard.date
                                    signin = guard.signin
                                    return store.put(updatedRecord)
                                }).then(put => {
                                    this.props.graphql
                                        .query({
                                            fetchOptionsOverride: fetchOptionsOverride,
                                            resetOnLoad: true,
                                            operation: {
                                                variables: {
                                                    guard_id: guard_id,
                                                    signout: todayDate,
                                                    date: date
                                                },
                                                query: signout
                                            }
                                        })
                                        .request.then(({data}) => {
                                            if (data) {
                                                this.props.removeGuard(this.props.guard)
                                               this.props.onClose()
                                            }
                                        }
                                    )
                                })
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
        const {show, onClose} = this.props
        const {errors, display} = this.state
        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="lg">
                    <ModalHeader toggle={onClose}>Guard Actions</ModalHeader>
                    <ModalBody>
                       <form onSubmit={this.onSignout}>
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
                                <div className="col-sm-9 offset-sm-3">
                                    <input type="submit" value="Sign out"
                                           className="form-control btn btn-dark btn-sm "/>
                                </div>

                            </div>

                        </form>

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

export default GuardModal