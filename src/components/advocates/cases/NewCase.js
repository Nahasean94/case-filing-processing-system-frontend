import React from 'react'
import Menu from "../Menu"
import PropTypes from "prop-types"
import {Progress} from 'reactstrap'


class NewCase extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            step: 1,
            case_type:{},
            case_description:{}
        }
        this.makeProgress = this.makeProgress.bind(this)
    }

    makeProgress() {
        if (this.state.progress < 100) {

            this.setState({progress: this.state.progress + 10, step: this.state.step + 1})
        }
    }

    render() {
        return (<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="new-case"/>
                </div>
                <div className="col-sm-8 col-md-8 col-xl-8 bd-content">
                    <div className="text-center">{this.state.step} of 11</div>
                    <Progress color="success" value={this.state.progress}/>
                    <br/>
                    <button className="btn btn-primary" onClick={this.makeProgress}>make progress</button>
                    <br/>
                    New Cases
                </div>
            </div>

        </div>)
    }
}

NewCase.contextTypes = {
    router: PropTypes.object.isRequired
}
export default NewCase