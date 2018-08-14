import React, {Component} from 'react'

class Confirm extends Component {

    render() {

        return (
            <div>
                <h5>Your details will now be saved</h5>
                <strong>Use the back button to go and edit any information</strong>
                <br/>
                <div className="form-group row">
                    <div className="col-sm-4 offset-sm-3">
                        <button className="form-control btn btn-success btn-sm"
                                onClick={this.props.toForms}>Back
                        </button>
                    </div>
                    <div className="col-sm-4 offset-sm-1">
                        <button className="form-control btn btn-dark btn-sm"
                                onClick={this.props.toSave}>Save
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Confirm