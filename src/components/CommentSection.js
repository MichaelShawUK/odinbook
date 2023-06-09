import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import axios from "axios";
import { database } from "../data/constants";

const CommentSection = ({
  postId,
  setIsLoading,
  updatePost,
  setUpdatePost,
}) => {
  const [comments, setComments] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const response = await axios({
        method: "post",
        url: `${database}/comments`,
        headers: { Authorization: `Bearer ${localStorage.token}` },
        data: { postId },
      });

      setIsLoading(false);
      setComments(response.data.comments);
    }
    setIsLoading(true);
    fetchComments();
  }, [postId, update, setIsLoading]);
  return (
    <>
      <CommentForm
        postId={postId}
        setIsLoading={setIsLoading}
        update={update}
        setUpdate={setUpdate}
        updatePost={updatePost}
        setUpdatePost={setUpdatePost}
      />
      {comments.length > 0 ? (
        comments.map((comment) => {
          return <Comment comment={comment} key={comment._id} />;
        })
      ) : (
        <div>There are no comments for this post.</div>
      )}
    </>
  );
};

export default CommentSection;
