import React from 'react'

class CourtAssistantView extends React.Component {
    render() {
        const {username, id} = this.props.courtAssistant

        return (
            <tr>
                <td>{username}</td>
            </tr>
        )
    }
}

export default CourtAssistantView