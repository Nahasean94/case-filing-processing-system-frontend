import React from 'react'
import validator from 'validator'
import {isEmpty} from 'lodash'
import TextFieldGroup from '../../../shared/TextFieldsGroup'
import {fetchOptionsOverride} from "../../../shared/fetchOverrideOptions"
import {updateLocation, isLocationExists} from "../../../shared/queries"
import PropTypes from "prop-types"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"


class EditLocation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.name,
            errors: {},
            isLoading: false,
            invalid: false,
            loading: false,
            message: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.checkLocationExists = this.checkLocationExists.bind(this)
    }

    checkLocationExists() {
        this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        name: this.state.name,
                    },
                    query: isLocationExists
                }
            })
            .request.then(({data}) => {

            if (data) {
                if (data.isLocationExists.exists) {
                    let errors = {}
                    errors.name = 'A location with that name already exists'
                    this.setState({errors, invalid: true,})
                }else{
                    let errors = {}
                    this.setState({errors, invalid: false,})
                }
            }
        })

    }


    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.name)) {
            errors.name = 'This field is required'
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

    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.setState({errors: {}, isLoading: true})
            this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            id: this.props.location,
                            name: this.state.name,
                        },
                        query: updateLocation
                    }
                })
                .request.then(({data}) => {

                    if (data) {
                        this.setState({
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            loading: false,
                            message: data.updateLocation
                                ? <div className="alert alert-success" role="alert">Successfully updated location
                                    "{data.updateLocation.name}"
                                </div>
                                : <div className="alert alert-danger" role="alert">An error occurred while adding location
                                </div>
                        })
                        this.props.onClose( )
                    }
                }
            )
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {show, onClose} = this.props

        const {errors, loading, message, isLoading, invalid} = this.state
        if (loading) {
            return <p>Adding a new location</p>
        }

        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog modal-dialog-centered">
                    <ModalHeader toggle={onClose}>Edit location</ModalHeader>
                    <ModalBody>
                        {message ? <div>
                            {message}
                        </div> : ""}
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                label="Name"
                                type="name"
                                name="name"
                                value={this.state.name} autoFocus={true}
                                onChange={this.onChange}
                                error={errors.name}
                                checkLocationExists={this.checkLocationExists}
                            />
                            <div className="form-group row">
                                <div className="col-sm-4 offset-sm-4">
                                    <button disabled={isLoading || invalid} className="btn btn-dark btn-sm form-control"
                                            type="submit">Save
                                    </button>
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

EditLocation.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}
export default EditLocation