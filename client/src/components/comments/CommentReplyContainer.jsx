import { useState } from "react";
import CommentReply from "./CommentReply";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const CommentReplyContainer = ({ id, commentId, comment_user_id }) => {
  const { userDetail } = useSelector((state) => state.auth);
  console.log(userDetail);
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ({ commentId }) => {
      return axios.delete(`/api/posts/${id}/comments/${commentId}`);
    },

    onSuccess() {
      queryClient.invalidateQueries(["posts", id, "comments"]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    console.log(commentId);
    deleteMutation.mutate({ commentId });
  };
  console.log(userDetail.isadmin);
  return (
    <>
      <div className=" flex  justify-end gap-2">
        {(userDetail.user_id === comment_user_id || userDetail.isadmin) && (
          <button
            onClick={handleDelete}
            className="px-1.5 py-0.5 rounded-md text-white text-sm bg-red-500"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting" : "Delete"}
          </button>
        )}
        <p
          className="text-right cursor-pointer underline"
          onClick={() => setShow((prev) => !prev)}
        >
          Reply
        </p>
      </div>

      {show && (
        <CommentReply
          id={id}
          commentId={commentId}
          onCancel={() => setShow(false)}
        />
      )}
    </>
  );
};

export default CommentReplyContainer;
