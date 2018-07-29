import React from 'react'

class DeputyRegistrarView extends React.Component {
    render() {
        const {username, id} = this.props.deputyRegistrar

        return (
            <tr>
                <td>{username}</td>
            </tr>
        )
    }
}

export default DeputyRegistrarView