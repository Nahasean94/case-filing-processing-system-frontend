import React from 'react'

class LocationView extends React.Component {
    constructor(props){
        super(props)
        this.onViewLocation=this.onViewLocation.bind(this)
    }
    onViewLocation(e){
       e.preventDefault()
        this.props.onSelectLocation(this.props.location.id,this.props.location.name)
    }
    render() {
        const {name,id} = this.props.location

        return (
            <tr>
                <td><a href="" onClick={this.onViewLocation}>{name}</a></td>
            </tr>
        )
    }
}

export default LocationView