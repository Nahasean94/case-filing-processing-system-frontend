import React from 'react'
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"
import {caseCategories, caseTypes, courtStations} from "../../../../shared/queries"
import {Query} from "graphql-react"
import Select from 'react-select'
import {isEmpty} from "lodash"

let courtStationOptions, caseTypeOptions, caseCategoryOptions

class CaseType extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            court_station: '',
            case_category: '',
            case_type: '',
            errors: '',
        }
        this.handleCourtStations = this.handleCourtStations.bind(this)
        this.handleCaseType = this.handleCaseType.bind(this)
        this.handleCaseCategories = this.handleCaseCategories.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        if (localStorage.getItem("CaseType")) {
            const caseType = JSON.parse(localStorage.getItem("CaseType"))
            this.state.court_station = caseType.court_station
            this.state.case_category = caseType.case_category
            this.state.case_type = caseType.case_type
        }
    }

    handleCourtStations(station) {
        this.setState({court_station: station})
    }

    handleCaseType(case_type) {
        this.setState({case_type: case_type})
    }

    handleCaseCategories(category) {
        this.setState({case_category: category})
    }

    validateInput(data) {
        let errors = {}

        if (!data.case_category) {
            errors.case_category = 'This field is required'
        }
        if (!data.case_type) {
            errors.case_type = 'This field is required'
        }
        if (!data.court_station) {
            errors.court_station = 'This field is required'
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

    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
        this.setState({errors: {}})

        const caseDescription = {
            case_category: this.state.case_category,
            case_type: this.state.case_type,
            court_station: this.state.court_station,
        }
        localStorage.setItem("CaseType", JSON.stringify(caseDescription))
        localStorage.setItem("view", "case-type")

        this.props.toCaseDescription()
        }
    }

    render() {
        const {errors} = this.state
        console.log(errors)
        return (
            <div className="col-sm-10">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Court station</label>
                        <div className="col-sm-9">
                            <Query
                                loadOnMount
                                loadOnReset
                                fetchOptionsOverride={fetchOptionsOverride}
                                query={courtStations}
                            >
                                {({loading, data}) => {
                                    if (data) {
                                        courtStationOptions = data.courtStations.map(court_station => {
                                            return {
                                                label: court_station.name,
                                                value: court_station.id
                                            }
                                        })
                                        return <Select
                                            closeOnSelect={true}
                                            onChange={this.handleCourtStations}
                                            options={courtStationOptions}
                                            placeholder="Search Court Stations"
                                            removeSelected={true}
                                            value={this.state.court_station}
                                        />
                                    }
                                    else if (loading) {
                                        return <p>Loading…</p>
                                    }
                                    return <p>Loading failed.</p>
                                }
                                }
                            </Query>
                            {errors ? errors.court_station && <div className="alert alert-danger">
                                {errors.court_station}
                            </div> : ''}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Case category</label>
                        <div className="col-sm-9">
                            <Query
                                loadOnMount
                                loadOnReset
                                fetchOptionsOverride={fetchOptionsOverride}
                                query={caseCategories}
                            >
                                {({loading, data}) => {
                                    if (data) {
                                        caseCategoryOptions = data.caseCategories.map(case_category => {
                                            return {
                                                label: case_category.name,
                                                value: case_category.id
                                            }
                                        })
                                        return <Select
                                            closeOnSelect={true}
                                            onChange={this.handleCaseCategories}
                                            options={caseCategoryOptions}
                                            placeholder="Search Case Categories"
                                            removeSelected={true}
                                            value={this.state.case_category}
                                        />
                                    }
                                    else if (loading) {
                                        return <p>Loading…</p>
                                    }
                                    return <p>Loading failed.</p>
                                }
                                }
                            </Query>
                            {errors ? errors.case_category && <div className="alert alert-danger">
                                {errors.case_category}
                            </div> : ''}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Case type</label>
                        <div className="col-sm-9">
                            <Query
                                loadOnMount
                                loadOnReset
                                fetchOptionsOverride={fetchOptionsOverride}
                                query={caseTypes}
                            >
                                {({loading, data}) => {
                                    if (data) {
                                        caseTypeOptions = data.caseTypes.map(case_type => {
                                            return {
                                                label: case_type.name,
                                                value: case_type.id
                                            }
                                        })
                                        return <Select
                                            closeOnSelect={true}
                                            onChange={this.handleCaseType}
                                            options={caseTypeOptions}
                                            placeholder="Search Case types"
                                            removeSelected={true}
                                            value={this.state.case_type}/>
                                    }
                                    else if (loading) {
                                        return <p>Loading…</p>
                                    }
                                    return <p>Loading failed.</p>
                                }
                                }
                            </Query>
                            {errors ? errors.case_type && <div className="alert alert-danger">
                                {errors.case_type}
                            </div> : ''}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-5 offset-7">
                            <button className="btn btn-dark btn-sm form-control"
                                    type="submit">Next
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default CaseType