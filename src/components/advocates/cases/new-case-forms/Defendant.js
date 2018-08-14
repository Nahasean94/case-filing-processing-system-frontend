import React from 'react'
import Individual from "./defendant/Individual"
import Organization from "./defendant/Organizations"

class Plaintiff extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: 'individual'
        }
        if (localStorage.getItem("Defendant")) {
            const defendant = JSON.parse(localStorage.getItem("Defendant"))
            if (defendant.view === 'organization') {
                this.state.view = 'organization'
            }
        }
        this.handlePlaintiffChange = this.handlePlaintiffChange.bind(this)
    }

    handlePlaintiffChange(e) {
        this.setState({view: e.target.value})
    }


    render() {
        const {view} = this.state
        return (<div>
            <form>
                <h3>Add details of the Defendant</h3>
                <fieldset>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input form-check-inline" type="radio"
                               value='individual' name="plaintiff"
                               onChange={this.handlePlaintiffChange}
                               id="individual" checked={view === 'individual'}/>
                        <label className="form-check-label" htmlFor="individual">Individual</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input form-check-inline" type="radio"
                               value='organization' name="plaintiff"
                               onChange={this.handlePlaintiffChange}
                               id="organization" checked={view === 'organization'}/>
                        <label className="form-check-label" htmlFor="organization">Organization</label>
                    </div>
                    {view === 'individual' && <Individual toPlaintiff={this.props.toPlaintiff} toForms={this.props.toForms}/>}
                    {view === 'organization' && <Organization toPlaintiff={this.props.toPlaintiff} toForms={this.props.toForms}/>}

                </fieldset>
            </form>
        </div>)
    }
}

export default Plaintiff