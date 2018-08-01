import React from 'react'
import Individual from "./Individual"
import Organization from "./Organizations"

class Plaintiff extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: ''
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
                <fieldset>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input form-check-inline" type="radio"
                               value='individual' name="plaintiff"
                               onChange={this.handlePlaintiffChange}
                               id="individual"/>
                        <label className="form-check-label" htmlFor="individual">Individual</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input form-check-inline" type="radio"
                               value='organization' name="plaintiff"
                               onChange={this.handlePlaintiffChange}
                               id="organization"/>
                        <label className="form-check-label" htmlFor="organization">Organization</label>
                    </div>
                    {view === 'individual' && <Individual/>}
                    {view === 'organization' && <Organization/>}
                </fieldset>
            </form>
        </div>)
    }
}

export default Plaintiff