import React from 'react'

class CaseCategoryView extends React.Component {
    render() {
        const {name, id} = this.props.station

        return (
            <tr>
                <td>{name}</td>
            </tr>
        )
    }
}

export default CaseCategoryView