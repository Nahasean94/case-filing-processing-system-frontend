import React from 'react'

class PendingCase extends React.Component {
    constructor(props) {
        super(props)
        this.onViewCase = this.onViewCase.bind(this)
    }

    onViewCase(e) {
        e.preventDefault()
    }

    render() {
        const {case_number, title, timestamp} = this.props.pendingCase

        return (
            <tr>
                <td><a href="" onClick={this.onViewCase}>{case_number.prefix}/{case_number.suffix}</a></td>
                <td>{title}</td>
                <td>{new Date(timestamp).toLocaleDateString()}</td>
            </tr>
        )
    }
}

export default PendingCase