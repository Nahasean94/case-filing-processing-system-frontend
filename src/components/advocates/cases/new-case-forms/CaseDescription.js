import React, {Component} from 'react'
import TextFieldGroup from "../../../../shared/TextFieldsGroup"
import {isEmpty} from "lodash"
import validator from 'validator'
import classnames from "classnames"


class CaseDescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            errors: {},
            isLoading: false,
            invalid: false,
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        if (localStorage.getItem("CaseDescription")) {
            const caseDescription = JSON.parse(localStorage.getItem("CaseDescription"))
            this.state.title=caseDescription.title
            this.state.description=caseDescription.description
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})

    }

    validateInfo(data) {
        let errors = {}
        if (validator.isEmpty(data.description)) {
            errors.description = 'This field is required'
        }
        if (validator.isEmpty(data.title)) {
            errors.title = 'This field cannot be empty'
        }
        if(data.title.length<3){
            errors.title='Title must be at least 3 characters'
        }
        if(data.description.length<10){
            errors.description='Description must be at least 10 characters'
        }
        if(!data.title.match(/[\sa-zA-Z]/g)){
            errors.title="Title must contain letters"
        }
        if(!data.description.match(/[\sa-zA-Z]/g)){
            errors.description="Description must contain characters"
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateInfo(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }


    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
        const caseDescription = {
            title: this.state.title,
            description: this.state.description,
        }
        localStorage.setItem("CaseDescription", JSON.stringify(caseDescription))
        localStorage.setItem("view", "case-description")
            this.props.toPlaintiff()
        }
    }


    render() {
        const {errors, response} = this.state
        const descriptionError = errors.description
        return (
            <div className="bd-content">
                {response && <div className="alert alert-dark">{response}</div>}
                <div className="row">
                    <h2 className="offset-sm-4">Case information</h2>
                </div>
                <form onSubmit={this.onSubmit}>
                    <TextFieldGroup
                        label="Title"
                        type="title"
                        name="title"
                        value={this.state.title}
                        onChange={this.onChange}
                        error={errors.title}
                    />

                    <div className="form-group row">
                        <div className="col-sm-3"><label htmlFor="description">Description</label>
                        </div>
                        <div className="col-sm-9">
                        <textarea name="description" onChange={this.onChange}
                                  className={classnames("form-control form-control-sm", {"is-invalid": descriptionError})}
                                  rows="5" id="description" onClick={this.onChange} value={this.state.description}/>
                            {descriptionError && <div className="invalid-feedback">{descriptionError}</div>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                            <button className="form-control btn btn-success btn-sm"
                                    onClick={this.props.toCaseType}>Back
                            </button>
                        </div>
                        <div className="col-sm-4  offset-sm-1">
                            <input type="submit" value="Next" className="form-control btn btn-dark btn-sm "/>
                        </div>

                    </div>
                </form>
            </div>
        )

    }
}

export default CaseDescription

