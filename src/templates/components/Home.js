import React from 'react'
import GuardsHome from "./guards/GuardsHome"
import {Consumer} from "graphql-react"

class Home extends React.Component{
   render(){
      return   <Consumer>{graphql =>   <GuardsHome   graphql={graphql}/>}</Consumer>
   }
}

export default Home