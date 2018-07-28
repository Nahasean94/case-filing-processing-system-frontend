import React from 'react'

class GuardView extends React.Component {
    constructor(props){
        super(props)
        this.onViewGuard=this.onViewGuard.bind(this)
    }
    onViewGuard(e){
       e.preventDefault()
        this.props.onSelectGuard(this.props.guard.guard_id)
    }
    render() {
        const {guard_id, last_name,first_name,gender,location} = this.props.guard

        return (
            <tr>
                <td><a href="" onClick={this.onViewGuard}>{guard_id}</a></td>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{gender}</td>
                <td>{location.name}</td>
            </tr>
        )
    }
}

export default GuardView