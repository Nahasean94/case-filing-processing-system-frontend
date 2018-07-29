import React from 'react'

class FormFeeStructureView extends React.Component {
    render() {
        const {name, id,fee} = this.props.station

        return (
            <tr>
                <td>{name}</td>
                <td>{fee}</td>
            </tr>
        )
    }
}

export default FormFeeStructureView