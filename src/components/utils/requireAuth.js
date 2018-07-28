import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


export default function (ComposedComponent) {
    class Authenticate extends React.Component {
        componentWillMount() {
            if (!this.props.isAuthenticated) {
                this.context.router.history.push('/admin/dashboard')
            }
        }

        componentWillUpdate(nextProps) {
            if(!nextProps.isAuthenticated){
                this.context.router.history.push('/')
            }
        }

        render() {
            return (
                <ComposedComponent {...this.props}/>
            )
        }

    }

    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
    }
    Authenticate.contextTypes = {
        router: PropTypes.object.isRequired
    }

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.loginReducers.isAuthenticated
        }
    }

    return connect(mapStateToProps)(Authenticate)
}