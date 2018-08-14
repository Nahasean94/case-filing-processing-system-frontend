import React from 'react'
import Individual from "./plaintiff/Individual"
import Organization from "./plaintiff/Organizations"

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
                <h3>Add details of the plaintiff</h3>
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
                    <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                            <button className="form-control btn btn-success btn-sm"
                                    onClick={this.props.toPlaintiff}>Back
                            </button>
                        </div>
                        <div className="col-sm-4 offset-sm-1">
                            <button className="form-control btn btn-dark btn-sm"
                                    onClick={this.props.toForms}>Next
                            </button>
                        </div>
                        {/*<div className="col-sm-4  offset-sm-1">*/}
                        {/*<input type="submit" value="Next" className="form-control btn btn-dark btn-sm "/>*/}
                        {/*</div>*/}

                    </div>
                </fieldset>
            </form>
        </div>)
    }
}

export default Plaintiff