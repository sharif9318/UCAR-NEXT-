import React, { useState } from "react";
import {
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Comment } from "../../types/comment/comment";
import { REACT_APP_API_URL } from "../../config";
import Moment from "react-moment";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface ReviewProps {
  comment: Comment;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
}

const Review = (props: ReviewProps) => {
  const { comment, onEdit, onDelete } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.commentContent);
  const imagePath: string = comment?.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`
    : "/img/profile/defaultUser.svg";

  const isOwner = user?._id === comment?.memberId;

  /** HANDLERS **/
  const goMemberPage = (id: string) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    const rawContent =
      typeof comment.commentContent === "string"
        ? comment.commentContent
        : String(comment.commentContent);
    setEditContent(rawContent);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    const rawContent =
      typeof comment.commentContent === "string"
        ? comment.commentContent
        : String(comment.commentContent);
    setEditContent(rawContent);
  };

  const handleSaveEdit = () => {
    const cleanContent = editContent.trim();

    if (cleanContent && onEdit) {
      onEdit(comment._id, cleanContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this review?")
    ) {
      onDelete(comment._id);
    }
  };
  if (device === "mobile") {
    return <div>REVIEW</div>;
  } else {
    return (
      <Stack className={"review-config"}>
        <Stack className={"review-mb-info"}>
          <Stack className={"img-name-box"}>
            <img src={imagePath} alt="" className={"img-box"} />
            <Stack>
              <Typography
                className={"name"}
                onClick={() => goMemberPage(comment?.memberData?._id as string)}
              >
                {comment.memberData?.memberNick}
              </Typography>
              <Typography className={"date"}>
                <Moment format={"DD MMMM, YYYY"}>{comment.createdAt}</Moment>
              </Typography>
            </Stack>
          </Stack>
          {isOwner && !isEditing && (
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleEditClick}
                size="small"
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleDelete} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
        <Stack className={"desc-box"}>
          {isEditing ? (
            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your review..."
                inputProps={{ maxLength: 100 }}
                helperText={`${editContent.length}/100 characters`}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || editContent.length > 100}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Typography className={"description"}>
              {comment.commentContent}
            </Typography>
          )}
        </Stack>
      </Stack>
    );
  }
};

export default Review;
