import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'
import {GraphQL, Provider as GraphQLReact,} from 'graphql-react'
import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import {Provider} from 'react-redux'
import {setCurrentUser} from './actions/loginActions'
import {setCurrentUser as setCurrentAdvocate} from './actions/advocateLoginActions'
import jwt from 'jsonwebtoken'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(rootReducer, compose(applyMiddleware(thunk)))


if (localStorage.getItem('CourtSystem')) {
    const token = jwt.decode(localStorage.getItem('CourtSystem'))
    if (token.role = 'system') {
        store.dispatch(setCurrentUser(token))

    } else if (token.role = 'advocate') {
        store.dispatch(setCurrentAdvocate(token))
    }
    else if (token.role = 'assitant') {
        store.dispatch(setCurrentUser(token))

    }

}


const graphql = new GraphQL()

ReactDOM.render(
    <Provider store={store}>
        <GraphQLReact value={graphql}>
            <Routes/>
        </GraphQLReact>
    </Provider>
    , document.getElementById('root'))

registerServiceWorker()