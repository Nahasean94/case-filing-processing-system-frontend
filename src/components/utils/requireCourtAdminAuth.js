import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


export default function (ComposedComponent) {
    class RequireAdvocateAuth extends React.Component {
        componentWillMount() {
            if (!this.props.isAuthenticated) {
                this.context.router.history.push('/court-admin/signin')
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.isAuthenticated) {
                this.context.router.history.push('/court-admin/dashboard')
            }
        }

        render() {
            return (
                <ComposedComponent {...this.props}/>
            )
        }

    }

    RequireAdvocateAuth.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
    }
    RequireAdvocateAuth.contextTypes = {
        router: PropTypes.object.isRequired
    }

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.advocateLoginReducers.isAuthenticated
        }
    }

    return connect(mapStateToProps)(RequireAdvocateAuth)
}