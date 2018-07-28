import React from 'react'
import NewGuard from "../guards/modals/NewGuard"
import NewLocationForm from "./locations/NewLocationForm"
import {Consumer} from "graphql-react"
import TestModal from "../guards/Test"

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showNewGuardModal: false,
            showNewLocationFormModal: false,
            showTestModal: false,
        }
        this.showNewGuardModal = this.showNewGuardModal.bind(this)
        this.closeNewGuardModal = this.closeNewGuardModal.bind(this)
        this.showNewLocationFormModal = this.showNewLocationFormModal.bind(this)
        this.closeNewLocationFormModal = this.closeNewLocationFormModal.bind(this)
        this.showTestModal = this.showTestModal.bind(this)
        this.closeTestModal = this.closeTestModal.bind(this)
    }
    showNewGuardModal() {
        this.setState({showNewGuardModal: true})
    }
    closeNewGuardModal() {
        this.setState({showNewGuardModal: false})
    }
    showNewLocationFormModal() {
        this.setState({showNewLocationFormModal: true})
    }
    closeNewLocationFormModal() {
        this.setState({showNewLocationFormModal: false})
    }
    showTestModal() {
        this.setState({showTestModal: true})
    }
    closeTestModal() {
        this.setState({showTestModal: false})
    }
    render() {
        const {showNewGuardModal, showNewLocationFormModal, showTestModal} = this.state

        return (
            <div>
                <button className="btn btn-sm btn-dark" onClick={this.showNewGuardModal}>new guard</button>
                <br/>
                <br/>
                <button className="btn btn-sm btn-dark" onClick={this.showNewLocationFormModal}>new location
                </button>
                <br/>
                {/*<br/>*/}
                {/*<button className="btn btn-sm btn-dark" onClick={this.showTestModal}>test*/}
                {/*</button>*/}
                <Consumer>{graphql => <NewGuard graphql={graphql} show={showNewGuardModal} onClose={this.closeNewGuardModal} />}</Consumer>
                <Consumer>{graphql => <NewLocationForm graphql={graphql} show={showNewLocationFormModal}
                                                       onClose={this.closeNewLocationFormModal}/>}</Consumer>
                <Consumer>{graphql => <TestModal graphql={graphql} show={showTestModal}
                                                       onClose={this.closeTestModal}/>}</Consumer>
            </div>
        )
    }
}

export default Dashboard