import React from 'react'
import {secondsToHms} from "../../../shared/TimeFunctions"

class AttendanceView extends React.Component {
    render() {
        const {date, signin, signout} = this.props.attendance
        let duration = new Date().setTime(new Date(signout).getTime() - new Date(signin).getTime())
        duration = secondsToHms(duration / 1000)


        return (
            <tr>
                <td>{new Date(date).toLocaleDateString()}</td>
                <td>{new Date(signin).toLocaleTimeString()}</td>
                <td>{new Date(signout).toLocaleTimeString()}</td>
                <td>{duration}</td>
            </tr>
        )
    }
}

export default AttendanceView