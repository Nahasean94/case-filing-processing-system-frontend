import React from 'react'

class CaseTypeView extends React.Component {
    render() {
        const {name, id} = this.props.type

        return (
            <tr>
                <td>{name}</td>
            </tr>
        )
    }
}

export default CaseTypeView