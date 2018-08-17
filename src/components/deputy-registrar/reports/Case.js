import React from 'react'
import ViewCase from "../modals/ViewCase"
import {Consumer} from 'graphql-react'

class Case extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewCaseModal: false
        }
        this.showViewCaseModal = this.showViewCaseModal.bind(this)
        this.closeViewCaseModal = this.closeViewCaseModal.bind(this)
    }

    showViewCaseModal(e) {
        e.preventDefault()
        this.setState({showViewCaseModal: true})
    }

    closeViewCaseModal(e) {
        this.setState({showViewCaseModal: false})
    }

    render() {
        const {id,case_number, title, timestamp, advocate} = this.props.results

        return (
            <tr>
                <td><a href="" onClick={this.showViewCaseModal}>{case_number.prefix}/{case_number.suffix}</a></td>
                <td>{title}</td>
                <td>{advocate.surname}</td>
                <td>{new Date(timestamp).toLocaleDateString()}</td>
                <Consumer>{graphql=><ViewCase graphql={graphql} show={this.state.showViewCaseModal} onClose={this.closeViewCaseModal} id={id}/>}</Consumer>
            </tr>
        )
    }
}

export default Case