import React, { useState } from "react";
import InputBar from "./InputBar";

const Comment = ({ comment, addComment, deleteComment, editComment }) => {
    const { commentText, childCommments, id, timestamp, edited } = comment;
    const [childComment, setChildComment] = useState("");
    const [edittedComment, setEdittedComment] = useState(commentText);
    const [showAddComponet, setShowAddComponet] = useState(false);
    const [showEditComment, setShowEditComment] = useState(false);
    const [errorAddComment, setErrorAddComment] = useState(false);
    const [errorEditComment, setErrorEditComment] = useState(false);
    const onAdd = () => {
        if (childComment.length > 0) {
            addComment(id, childComment);
            setShowAddComponet(false);
        }
        else {
            setErrorAddComment(true);
        }
    };
    const onEdit = () => {
        if (edittedComment === commentText) {
            setShowEditComment(false);
        }
        else {
            if (edittedComment.length > 0) {
                editComment(id, edittedComment);
                setShowEditComment(false);
            }
            else {
                setErrorEditComment(true);
            }
        }
    };
    return (
      <div className="comment_container">
        {showEditComment 
            ? (
                <>
                    <InputBar setComment={setEdittedComment} value={commentText} showError={errorEditComment} focusEvent={e => setErrorEditComment(false)} />
                    <button className="comment_btn" onClick={onEdit}>Update</button>
                </>
            )
            : <div className="comment_text">{commentText}{edited ? <span className="editted_key">(edited)</span> : null}</div>
        }
        <div>
            <span className="comment_options">{timestamp}</span> |
            <span className="comment_options pointer" onClick={() => setShowEditComment(true)}>Edit</span>|
            <span className="comment_options pointer" onClick={() => setShowAddComponet(true)}>Add a reply</span>|
            <span className="comment_options pointer" onClick={() => deleteComment(id)}>Delete</span>
            {showAddComponet ?
                <>
                    <InputBar setComment={setChildComment} showError={errorAddComment} focusEvent={e => setErrorAddComment(false)} />
                    <button className="comment_btn" onClick={onAdd}>Submit</button>
                </>
                : null
            }
        </div>
        {childCommments.map((childCommentEl, key) => {
          return (
            <Comment
              key={key}
              comment={childCommentEl}
              addComment={addComment}
              deleteComment={deleteComment}
              editComment={editComment}
            />
          );
        })}
      </div>
    );
};

export default Comment;