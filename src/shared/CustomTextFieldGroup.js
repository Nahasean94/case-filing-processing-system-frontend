import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CustomFieldGroup = ({ name,value, label, error, type, onChange,checkLocationExists,checkIfExists,autoFocus}) => {
    return (
        <div className="form-group row">
            <label className="col-sm-2 col-form-label" >{label}</label>
            <div className="col-sm-10">
                <input type={type} name={name}
                       className={classnames("form-control form-control-sm", {"is-invalid": error})}
                       value={value}
                       onChange={onChange}
                       onBlur={checkIfExists}
                       onKeyUp={checkLocationExists}
                       autoFocus={autoFocus}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    )
}
CustomFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    checkIfExits: PropTypes.func,
    checkLocationExists: PropTypes.func,
    autoFocus:PropTypes.bool,

}
CustomFieldGroup.defaultTypes = {
    type: 'text'
}
export default CustomFieldGroup