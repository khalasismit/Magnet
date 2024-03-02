import { Avatar, Box, Typography } from "@mui/material"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../../redux/reducers";

const Comment = ({ _id, postId, type, userName, comment, likes, profilePic, createdAt, updateCommentField, parentId, handleViewReplies,replies }) => {
    // console.log(_id, postId, type, userName, comment, likes, profilePic, createdAt )
    const [timeAgo, setTimeAgo] = useState('');
    useEffect(() => {
        const calculateTimeAgo = () => {
            if (createdAt) {
                const timeAgoString = formatDistanceToNow(new Date(createdAt), { addSuffix: true, roundingMethod: 'floor' });
                setTimeAgo(timeAgoString);
            }
        };
        calculateTimeAgo();
        const intervalId = setInterval(() => {
            calculateTimeAgo();
        }, 60000);
        return () => clearInterval(intervalId);
    }, [createdAt]);
    const user = useSelector((state) => state.user)
    const isLiked = likes.includes(user._id) ? true : false
    const dispatch = useDispatch()
    const handleCommentLike = async () => {
        const res = await fetch(`http://localhost:3001/posts/${postId}/comment/toggleCommentLike`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user._id,
                commentId: _id
            })
        });
        const updatedPost = await res.json();
        dispatch(setPost(updatedPost));
    }
    const iscomment = type === 'comment' ? true : false;
    return <Box sx={{ p: iscomment ? "0.5rem" : "0.5rem 0.5rem 0.5rem 3rem" }}>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
                {
                    profilePic === "" ?
                        <Avatar sx={{ borderRadius: 2, height: "2rem", width: "2rem" }}></Avatar>
                        :
                        <Avatar src={profilePic} sx={{ borderRadius: 2, height: "2rem", width: "2rem" }}></Avatar>
                }
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", gap: 1, }}>
                        <Typography>
                            <span style={{ fontWeight: "bold", marginRight: "1rem" }}>
                                {userName}
                            </span>
                            <span>
                                {comment}
                            </span>
                        </Typography>
                    </Box>
                    <Typography>
                        <span>
                            {timeAgo}
                        </span>
                        <span style={{ margin: "0 1rem", cursor: "pointer" }} onClick={() => { updateCommentField(`@${userName} `); parentId(_id); }}>
                            Reply
                        </span>
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} onClick={handleCommentLike} >
                {
                    isLiked ?
                        (
                            <FavoriteIcon sx={{ fontSize: "1.2rem", color: "red" }} />
                        )
                        :
                        (
                            <FavoriteBorderIcon sx={{ fontSize: "1.2rem" }} />
                        )
                }
                <span style={{ cursor: "pointer" }}>
                    {likes.length}
                </span>
            </Box >
        </Box>
        {
            <Box sx={{ ml: "2.5rem",cursor:"pointer" }} onClick={()=>{handleViewReplies(_id)}}>
                <Typography>
                    see more ({replies})
                </Typography>
            </Box>
        }
    </Box>
}
export default Comment