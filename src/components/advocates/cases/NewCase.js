import React from 'react'
import Menu from "../Menu"
import PropTypes from "prop-types"
import {Progress} from 'reactstrap'
import CaseType from "./new-case-forms/CaseType"
import CaseDescription from "./new-case-forms/CaseDescription"
import Plaintiff from "./new-case-forms/Plaintiff"
import Defendant from "./new-case-forms/Defendant"
import Complaint from "./new-case-forms/Forms"
import Confirm from "./new-case-forms/Confirm"

class NewCase extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            step: 1,
            case_type: {},
            case_description: {},
            plaintiff: {},
            defendant: {},
            forms: {},
            confirm: false,
            view: 'case-type'

        }

        this.toCaseType = this.toCaseType.bind(this)
        this.toCaseDescription = this.toCaseDescription.bind(this)
        this.toPlaintiff = this.toPlaintiff.bind(this)
        this.toDefendant = this.toDefendant.bind(this)
        this.toForms = this.toForms.bind(this)
        this.toConfirm = this.toConfirm.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.submitForms = this.submitForms.bind(this)

    }

    toCaseType() {
        this.setState({progress: 0, step: 1, view: 'case-type'})
    }

    toCaseDescription() {
        this.setState({progress: 20, step: 2, view: 'case-description'})
    }

    toPlaintiff() {
        this.setState({progress: 40, step: 3, view: 'plaintiff'})
    }

    toDefendant() {
        this.setState({progress: 60, step: 4, view: 'defendant'})
    }

    toForms() {
        this.setState({progress: 80, step: 5, view: 'forms'})
    }

    toConfirm() {
        this.setState({progress: 100, step: 6, view: 'confirm'})
    }

    onSubmit() {
        console.log(this.state)
    }

    submitForms(forms) {
        this.setState({forms})
    }


    render() {
        const {progress, step, case_type, case_description, plaintiff, defendant, confirm, view,} = this.state
        return (<div className="container">
            <div className="row">
                <div className="col-sm- col-md-2 bd-sidebar">
                    <Menu router={this.context.router} active="new-case"/>
                </div>
                <div className="col-sm-8 col-md-8 col-xl-8 bd-content">
                    <div className="text-center">Step {this.state.step} of 6</div>
                    <Progress color="success" value={this.state.progress}/>
                    <br/>
                    {view === 'case-type' && <div>
                        <h5>Case options</h5>
                        <CaseType toCaseDescription={this.toCaseDescription}/>

                    </div>}
                    {view === 'case-description' &&
                    <CaseDescription toCaseType={this.toCaseType} toPlaintiff={this.toPlaintiff}/>
                    }
                    {view === 'plaintiff' &&
                    <Plaintiff toCaseDescription={this.toCaseDescription} toDefendant={this.toDefendant}/>
                    }
                    {view === 'defendant' && <div>
                        <Defendant toPlaintiff={this.toPlaintiff} toForms={this.toForms}/>
                    </div>}
                    {view === 'forms' && <div>
                        <Complaint toDefendant={this.toDefendant} toConfirm={this.toConfirm}
                                   onSubmit={this.submitForms}/>
                    </div>}
                    {view === 'confirm' && <div>
                        <br/>
                        <Confirm toForms={this.toForms} toSave={this.onSubmit}/>

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