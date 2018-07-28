import React from 'react'
import PropTypes from 'prop-types'
import {timeSince} from "../../../../shared/TimeSince"

class CommentView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.props.comment,

        }
        this.viewComment = this.viewComment.bind(this)
    }

    onProfilePicture(e) {
        e.preventDefault()
        this.setState({show: true})
    }


    viewComment(e) {
        e.preventDefault()
        this.setState({showFullComment: true})
    }

    render() {
        const {show, showFullComment} = this.state
        const {author, body, timestamp} = this.props.comment
        const more = <p>
            {body.substr(0, 599)}... <a href="" onClick={this.viewComment}>more</a></p>
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-2">
                        <p><img src={`http://localhost:8080/uploads/${author.profile_picture}`}
                                width="60" height="40"
                                className="avatar" onClick={this.onProfilePicture}/></p>
                    </div>
                    <div className="col-sm-10">
                        <ul className="list-inline list-unstyled">
                            <li className="list-inline-item author">
                              <strong>{author.username}</strong>
                            </li>
                            <span className="feed-meta">
                            <li className="list-inline-item">{timeSince(timestamp)}</li>
                            </span>
                        </ul>
                        {body.length > 600 && !showFullComment ? more : body}

                        <div className="feed-meta">
                            <ul className="list-inline list-unstyled">
                                {/*<li className="list-inline-item"><a href="" onClick={this.onLike}><i*/}
                                {/*className="fa fa-thumbs-up"></i>*/}
                                {/*&nbsp;*/}
                                {/*{liked ? 'Liked' : 'Like'} {likes.length}  */}
                                {/*Like &nbsp; </a></li>*/}
                                {/*<li className="list-inline-item">*/}
                                {/*<ul className="list-unstyled">*/}
                                {/*{comments.length ? <Comments comments={comments} viewAll={viewAll}/> : ''}*/}
                                {/*</ul>*/}
                                {/*</li>*/}
                                {/*<li className="list-inline-item"><a href="" onClick={this.onCommenting}><i*/}
                                {/*className="fa fa-reply"></i>*/}
                                {/*&nbsp; Reply</a>*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                    </div>
                    {/*<ProfilePictureModal show={show} onClose={this.onClose} picture={author.profile_picture}*/}
                    {/*username={author.username}/>*/}

                </div>
            </div>
        )
    }
}

CommentView.contextTypes = {
    router: PropTypes.object.isRequired
}
export default CommentView
// export default connect(null, {clearPosts, getProfileDetails, likeComment})(CommentView)