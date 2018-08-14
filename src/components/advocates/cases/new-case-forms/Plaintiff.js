import React from 'react'
import Individual from "./plaintiff/Individual"
import Organization from "./plaintiff/Organizations"

class Plaintiff extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: 'individual'
        }
        this.handlePlaintiffChange = this.handlePlaintiffChange.bind(this)
        if (localStorage.getItem("Plaintiff")) {
            const defendant = JSON.parse(localStorage.getItem("Plaintiff"))
            if (defendant.view === 'organization') {
                this.state.view = 'organization'
            }
        }
    }


    handlePlaintiffChange(e) {
        this.setState({view: e.target.value})
    }


    render() {
        const {view} = this.state
        return (<div>
            <form>
                <h3>Add details of the plaintiff</h3>
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
                    {view === 'individual' &&
                    <Individual toCaseDescription={this.props.toCaseDescription} toDefendant={this.props.toDefendant}/>}
                    {view === 'organization' && <Organization toCaseDescriptio={this.props.toCaseDescription}
                                                              toDefendant={this.props.toDefendant}/>}

                </fieldset>
            </form>
        </div>)
    }
}

export default Plaintiff