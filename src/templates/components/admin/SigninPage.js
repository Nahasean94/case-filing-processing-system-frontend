import React from 'react'
import SignupPage from "./signup/SignupPage"
import LoginPage from "./login/LoginPage"
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"
import {Consumer} from "graphql-react"

export default ({show, onClose}) => {
    if (show) {
        return (
            <Modal isOpen={show} toggle={onClose} size="lg">
                <ModalHeader toggle={onClose}>System admin Signin Page</ModalHeader>
                <ModalBody>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className="col-sm-5">
                                <LoginPage onClose={onClose}/>
                            </div>
                            <div className="col-sm-6 offset-1">
                                <SignupPage/>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
                </ModalFooter>
            </Modal>
        )
    }
    else return null
}