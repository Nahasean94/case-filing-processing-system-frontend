import React, {Component} from 'react'
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"
import {addIndividual, addNewCase, addNewForm, addOrganization, makePayment,} from "../../../../shared/queries"
import {Consumer} from 'graphql-react'
import PropTypes from "prop-types"
import Home from "../../../Home"

class Confirm extends Component {
    constructor(props) {
        super(props)
        this.onSave = this.onSave.bind(this)
    }

    addNewCase({case_types, case_description, defendant, plaint, plaintiff_type, form, transaction}) {
        console.log(plaint)
        return this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        title: case_description.title,
                        description: case_description.description,
                        court_station: case_types.court_station.value,
                        case_type: case_types.case_type.value,
                        case_category: case_types.case_category.value,
                        defendant_party_type: defendant.type,
                        defendant_name: defendant.name,
                        defendant_email: defendant.email,
                        defendant_cellphone: defendant.cellphone,
                        plaintiff: plaint.addIndividual?plaint.addIndividual.id:plaint.addOrganization.id,
                        plaintiff_type: plaintiff_type,
                        form: form.addNewForm.id,
                        payment: transaction.makePayment.id,
                    },
                    query: addNewCase
                }
            })
            .request.then(({data}) => {
                    if (data) {
                        return data
                    }
                }
            )


    }

    addNewPlaintiff(data) {
        console.log(data)
        if (data.type === 'organization') {
            return this.props.graphql
                .query({
                    fetchOptionsOverride: fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            name: data.name,
                            email: data.email,
                            cellphone: data.cellphone,
                        },
                        query: addOrganization
                    }
                })
                .request.then(({data}) => {
                        if (data) {
                            return data
                        }
                    }
                )
        }
        return this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        name: data.name,
                        email: data.email,
                        cellphone: data.cellphone,
                        dob: data.dob,
                        gender: data.gender,
                    },
                    query: addIndividual
                }
            })
            .request.then(({data}) => {
                    if (data) {
                        return data
                    }
                }
            )


    }

    async makePayment() {
        return await this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        fee: 500,
                    },
                    query: makePayment
                }
            })
            .request.then(({data}) => {
                    if (data) {
                        return data
                    }
                }
            )
    }

    async addNewForm(data) {
        return await this.props.graphql
            .query({
                fetchOptionsOverride: fetchOptionsOverride,
                resetOnLoad: true,
                operation: {
                    variables: {
                        type_of_form: data.form,
                        facts: data.facts,
                    },
                    query: addNewForm
                }
            })
            .request.then(({data}) => {
                    if (data) {
                        return data
                    }
                }
            )
    }

    onSave(e) {
        e.preventDefault()
        const case_types = JSON.parse(localStorage.getItem("CaseType"))
        const case_description = JSON.parse(localStorage.getItem("CaseDescription"))
        const plaintiff = JSON.parse(localStorage.getItem("Plaintiff")).plaintiff
        const defendant = JSON.parse(localStorage.getItem("Defendant")).defendant
        const forms = JSON.parse(localStorage.getItem("Forms"))
        return this.addNewForm(forms).then(async form => {
            return await this.makePayment().then(async transaction => {
                return await this.addNewPlaintiff(plaintiff).then(async plaint => {
                    const plaintiff_type = plaintiff.type
                    return await this.addNewCase({
                        case_types,
                        case_description,
                        defendant,
                        plaint,
                        plaintiff_type,
                        form,
                        transaction
                    }).then(addedCase => {
                        localStorage.removeItem("CaseType")
                        localStorage.removeItem("CaseDescription")
                        localStorage.removeItem("Plaintiff")
                        localStorage.removeItem("Defendant")
                        localStorage.removeItem("Forms")
                        localStorage.removeItem("view")
                        this.context.router.history.push('/advocates/dashboard/pending-cases')
                    })

                })
            })
        })


    }

    render() {

        return (
            <div>
                <h5>Your details will now be saved</h5>
                <strong>Use the back button to go and edit any information</strong>
                <br/>
                <hr/>
                <div className="form-group row">
                    <div className="col-sm-4 offset-sm-3">
                        <button className="form-control btn btn-success btn-sm"
                                onClick={this.props.toForms}>Back
                        </button>
                    </div>
                    <div className="col-sm-4 offset-sm-1">
                        <button className="form-control btn btn-dark btn-sm"
                                onClick={this.onSave}>Save
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

Confirm.contextTypes = {
    router: PropTypes.object.isRequired
}

export default ({toForms}) => <Consumer>{graphql => <Confirm graphql={graphql} toForms={toForms}/>}</Consumer>