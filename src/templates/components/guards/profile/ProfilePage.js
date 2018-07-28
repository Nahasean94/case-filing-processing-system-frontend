import React from 'react'
import {Consumer} from "graphql-react"
import Profile from "./Profile"


class ProfilePage extends React.Component {

    render() {

        return (
            <div>
                <Consumer>{graphql =>   <Profile   graphql={graphql}/>}</Consumer>
            </div>
        )
    }
}

export default ProfilePage