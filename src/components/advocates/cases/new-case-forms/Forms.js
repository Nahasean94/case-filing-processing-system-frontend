import React, {Component} from 'react'
import {connect} from 'react-redux'
import {addFact, clearFacts, deleteFact, updateFact} from "../../../../actions/factActions"
import TextFieldGroup from "../../../../shared/TextFieldsGroup"
import validator from "validator"
import {isEmpty} from "lodash"
import PropTypes from 'prop-types'


class Forms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fact: '',
            form: '5b7274f27bb873209c99905b',
            errors: {},
        }
        if (localStorage.getItem("Forms")) {
            const forms = JSON.parse(localStorage.getItem("Forms"))
            this.props.clearFacts()
            forms.facts.map(fact => this.props.addFact(fact))
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSave = this.onSave.bind(this)

    }

    validateInput(data) {
        let errors = {}

        if (validator.isEmpty(data.fact)) {
            errors.fact = 'This field is required'
        }
        if (!data.fact.match(/[\a-zA-Z]/g)) {
            errors.fact = "Fact must contain letters"
        }
        if (data.fact.length <= 2) {
            errors.fact = "Fact cannot be less than 2 characters"
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isValid() {
        const {errors, isValid} = this.validateInput(this.state)
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    validateForm() {
        let errors = {}

        if (this.props.facts.length === 0) {
            errors.fact = 'You must provide at least one fact'
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    isFormaValid() {
        const {errors, isValid} = this.validateForm()
        if (!isValid) {
            this.setState({errors})
        }
        return isValid
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.setState({fact: '', errors: {}})
            this.props.addFact(this.state.fact)
        }
    };

    onSave(e) {
        e.preventDefault()
        if (this.isFormaValid()) {
            localStorage.setItem("Forms", JSON.stringify({form: this.state.form, facts: this.props.facts}))
            localStorage.setItem("view", "forms")
            this.props.toConfirm()
        }
    }

    render() {
        const {facts} = this.props
        const {fact, errors} = this.state
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <p>Press enter to add</p>
                    <TextFieldGroup
                        label="Fact"
                        type="text"
                        name="fact"
                        value={fact}
                        onChange={this.onChange}
                        error={errors.fact}
                    />
                </form>
                <ol>
                    {facts.map(fact => {
                        return <li>{fact}</li>
                    })}
                </ol>
                <hr/>
                <div className="form-group row">
                    <div className="col-sm-4 offset-sm-3">
                        <button className="form-control btn btn-success btn-sm"
                                onClick={this.props.toDefendant}>Back
                        </button>
                    </div>
                    <div className="col-sm-4 offset-sm-1">
                        <button className="form-control btn btn-dark btn-sm"
                                onClick={this.onSave}>Next
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

Forms.propTypes = {
    toConfirm: PropTypes.func.isRequired,
    toDefendant: PropTypes.func.isRequired,
    updateFact: PropTypes.func.isRequired,
    addFact: PropTypes.func.isRequired,
    deleteFact: PropTypes.func.isRequired,
    clearFacts: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    facts: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
    return {facts: state.factReducers}
}

export default connect(mapStateToProps, {addFact, updateFact, deleteFact, clearFacts})(Forms)