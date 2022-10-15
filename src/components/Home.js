import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Comment from "./Comment";
import Header from "./Header";
import InputBar from "./InputBar";

const getNewComment = (commentValue, isRootNode = false, parentNodeId) => {
    return {
      id: uuidv4(),
      commentText: commentValue,
      childCommments: [],
      isRootNode,
      parentNodeId,
      timestamp : new Date().toLocaleString(),
      edited: false
    };
  };
  
const initialState = {};

const Home = () => {
  const [comments, setComments] = useState(initialState);
  const [rootComment, setRootComment] = useState("");
  const [errorRootComment, setErrorRootComment] = useState(false);
  const addComment = (parentId, newCommentText) => {
    let newComment = null;
    if (parentId) {
      newComment = getNewComment(newCommentText, false, parentId);
      setComments((comments) => ({
        ...comments,
        [parentId]: {
          ...comments[parentId],
          childCommments: [...comments[parentId].childCommments, newComment.id],
        },
      }));
    } else {
      newComment = getNewComment(newCommentText, true, null);
    }
    setComments((comments) => ({ ...comments, [newComment.id]: newComment }));
  };
  const commentMapper = (comment) => {
    return {
      ...comment,
      childCommments: comment.childCommments
        .map((id) => comments[id])
        .map((comment) => commentMapper(comment)),
    };
  };
  const enhancedComments = Object.values(comments)
    .filter((comment) => {
      return !comment.parentNodeId;
    })
    .map(commentMapper);
  const onAdd = () => {
    if (rootComment.length > 0)
        addComment(null, rootComment);
    else
        setErrorRootComment(true);
  };
  const deleteChild = (id, temp) => {
    const { childCommments } = temp[id];
    if (childCommments.length > 0) {
      for(let x of childCommments) {
        if (temp[x].childCommments.length > 0) {
          return deleteChild(x, temp);
        }
        else {
          delete temp[x];
        }
      }
      return temp;
    }
    else {
      delete temp[id];
      return temp;
    }
  };
  const deleteComment = (id) => {
    let temp = {...comments};
    const { childCommments: childOfDeleting, parentNodeId: parentOfDeleting }  = temp[id];
    for (let x of childOfDeleting) {
      temp = deleteChild(x, temp);
      delete temp[x];
    }
    if (parentOfDeleting !== null)
      temp[parentOfDeleting].childCommments.splice(temp[parentOfDeleting].childCommments.indexOf(id),1)
    delete temp[id];
    setComments(temp);
  };
  const editComment = (id, newText) => {
    setComments((comments) => ({
        ...comments,
        [id]: {
          ...comments[id],
          commentText: newText,
          timestamp: new Date().toLocaleString(),
          edited: true,
        },
    }));
  };
  return (
    <>
      <Header />
      <div className="container">
        <InputBar setComment={setRootComment} showError={errorRootComment} focusEvent={() => setErrorRootComment(false)} />
        <button className="root_button" onClick={onAdd}>Add</button>
      </div>
      <div className="comments_list_container">
        {enhancedComments.map((comment, key) => {
          return (
            <Comment key={key} 
                comment={comment} 
                addComment={addComment} 
                deleteComment={deleteComment} 
                editComment={editComment} 
            />
          );
        })}
      </div>
    </>
  );
}

export default Home;