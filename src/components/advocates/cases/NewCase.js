import React from 'react'
import Menu from "../Menu"
import PropTypes from "prop-types"
import {Progress} from 'reactstrap'
import CaseType from "./new-case-forms/CaseType"
import CaseDescription from "./new-case-forms/CaseDescription"
import Plaintiff from "./new-case-forms/Plaintiff"


class NewCase extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            step: 1,
            case_type: {
                court_station: '',
                case_category: '',
                case_type: '',
            },
            case_description: {
                title: '',
                description: ''
            },
            plaintiff: {
                type: 'individual',
                individual: {
                    names: '',
                    email: '',
                    gender: '',
                    cellphone: '',
                    location: '',
                },
                organization: {
                    name: '',
                    email: '',
                    cellphone: '',
                    location: '',
                    postal_address: '',
                }
            },
            defendant: {
                type: 'individual',
                individual: {
                    names: '',
                    gender: '',
                    cellphone: '',
                    location: '',
                },
                organization: {
                    name: '',
                    cellphone: '',
                    location: '',
                    postal_address: '',
                }
            },
            confirm: false,
            view: 'case-type'

        }

        this.toCaseType = this.toCaseType.bind(this)
        this.toCaseDescription = this.toCaseDescription.bind(this)
        this.toPlaintiff = this.toPlaintiff.bind(this)
        this.toDefendant = this.toDefendant.bind(this)
        this.toConfirm = this.toConfirm.bind(this)
    }

    toCaseType() {
        this.setState({progress: 0, step: 1, view: 'case-type'})
    }

    toCaseDescription() {
        this.setState({progress: 25, step: 2, view: 'case-description'})
    }

    toPlaintiff() {
        this.setState({progress: 50, step: 3, view: 'plaintiff'})
    }

    toDefendant() {
        this.setState({progress: 75, step: 4, view: 'defendant'})
    }

    toConfirm() {
        this.setState({progress: 100, step: 5, view: 'confirm'})
    }


    render() {
        const {progress, step, case_type, case_description, plaintiff, defendant, confirm, view,} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="new-case"/>
                </div>
                <div className="col-sm-8 col-md-8 col-xl-8 bd-content">
                    <div className="text-center">Step {this.state.step} of 5</div>
                    <Progress color="success" value={this.state.progress}/>
                    <br/>
                    {view === 'case-type' && <div>
                        <h5>Case options</h5>
                        <CaseType toCaseDescription={this.toCaseDescription}/>

                    </div>}
                    {view === 'case-description' &&
                        <CaseDescription toCaseType={this.toCaseType} toPlaintiff={this.toPlaintiff}/>
}
                    {view === 'plaintiff' && <div>Plaintiff
                        <Plaintiff/>
                        <button className="btn btn-primary" onClick={this.toCaseDescription}>Back</button>
                        <br/>
                        <button className="btn btn-primary" onClick={this.toDefendant}>Next</button>

                    </div>}
                    {view === 'defendant' && <div>Defendant
                        <br/>
                        <button className="btn btn-primary" onClick={this.toPlaintiff}>Back</button>
                        <br/>
                        <button className="btn btn-primary" onClick={this.toConfirm}>Next</button>

                    </div>}
                    {view === 'confirm' && <div>Confirm
                        <br/>
                        <button className="btn btn-primary" onClick={this.toDefendant}>Back</button>
                        <br/>
                        <button className="btn btn-primary">Next</button>

                    </div>}

                </div>
            </div>

        </div>)
    }
}

NewCase.contextTypes = {
    router: PropTypes.object.isRequired
}
export default NewCase