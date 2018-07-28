import React from 'react'
import CommentView from './CommentView'
import {Query} from 'graphql-react'
import validator from 'validator'
import {isEmpty} from 'lodash'
import classnames from "classnames"
import {newMessageReply} from "../../../../shared/queries"
import CurrentGuard from "../../../../shared/CurrentGuard"
import {fetchOptionsOverride} from "../../../../shared/fetchOverrideOptions"

class Comments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: '',
            errors: {},
            liked: false,
            isLoading: false,
            invalid: false
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }

    validateInput(data) {
        let errors = {}

        if (data.comment.length < 4) {
            errors.comment = 'Comment must be more than 4 characters'
        }
        if (validator.isEmpty(data.comment)) {
            errors.comment = 'This field is required'
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

    onChange(e) {
        e.preventDefault()
        this.setState({[e.target.name]: e.target.value})
    }


    onSubmit(e) {
        e.preventDefault()
        if (this.isValid()) {
            this.props.graphql
                .query({
                    fetchOptionsOverride:fetchOptionsOverride,
                    resetOnLoad: true,
                    operation: {
                        variables: {
                            message: this.props.id,
                            author:String(CurrentGuard.getGuardId()),
                            account:'guard' ,
                            body: this.state.comment,
                        },
                        query: newMessageReply
                    }
                })
                .request.then(({data}) => {
                    if (data) {
                        this.setState({
                            comment: '',
                            errors: {},
                            isLoading: false,
                            invalid: false,
                            message: data
                                ? <li key={data.newMessageReply.id}><CommentView comment={data.newMessageReply}/></li>
                                : `Sorry, your reply could not be saved.`
                        })
                    }
                }
            )

        }
    }

    render() {
        const {errors} = this.state
        const commentError = errors.comment
        const {replies} = this.props
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <textarea name="comment" onChange={this.onChange}
                                  className={classnames("form-control", {"is-invalid": commentError})} rows="2"
                                  id="reply" value={this.state.comment}/>
                        {commentError && <div className="invalid-feedback">{commentError}</div>}
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-5 offset-sm-7">
                            <input type="submit" value="Reply" className="form-control btn btn-dark btn-sm "/>
                        </div>

                    </div>
                </form>
                <hr/>

                {replies.length > 0 ? <ul className="list-unstyled">
                    {replies.map(comment => {
                        return (
                            <li key={comment.id}><CommentView comment={comment}/></li>)
                    })
                    }
                </ul> : <p>No replies found</p>
                }
            </div>)
    }
}

export default Comments
