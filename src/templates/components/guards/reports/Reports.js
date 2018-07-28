import React from 'react'
import {Consumer} from "graphql-react"
import NewReport from "./NewReport"


class Reports extends React.Component {

    render() {

        return (
            <div>
                <Consumer>{graphql =>   <NewReport   graphql={graphql}/>}</Consumer>
            </div>
        )
    }
}

export default Reports