import { Avatar, Box, Divider, TextField, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux"
import Chat from "./chat";
import { useEffect, useState } from "react";
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import { useNavigate } from "react-router-dom";
const Chats = ({ handleSetConversationId }) => {
    const navigate = useNavigate()
    const [isSearch, setIsSearch] = useState(false);
    const [otherUserId, setOtherUserId] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [conversations, setConversations] = useState([]);
    const user = useSelector((state) => state.user)
    const handleCreateConv = async () => {
        const res = await fetch(`http://localhost:3001/chats/conversation/create`, {
            method: "POST",
            headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({
                userId: user._id,
                otherUserId: otherUserId
            })
        })
        const data = await res.json();
        if (res.ok) {
            navigate(`/chats/${data._id}/messages`)
        }
    }
    const getConversations = async () => {
        const res = await fetch(`http://localhost:3001/chats/${user._id}/conversations`, {
            method: "GET"
        })
        const data = await res.json();
        setConversations(data);
    }
    useEffect(() => {
        getConversations();
    }, []);
    const handleIsSearch = () => {
        setIsSearch(!isSearch)
    }
    const handleSearch = async (value) => {
            const searchRes = await fetch(`http://localhost:3001/users/search/${value}`, {
                method: "GET",
                headers: {}
            });
            const data = await searchRes.json();
            setSearchData(data);
    }
    const theme = useTheme();
    return <Box sx={{ flex: 1, display: "flex", background: theme.palette.background.alt, flexDirection: "column", p: 1, borderRadius: "1rem" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
            <Typography sx={{ fontSize: "1.1rem" }}>Conversations</Typography>
            <PersonSearchOutlinedIcon sx={{ fontSize: "1.5rem" }} onClick={handleIsSearch} />
        </Box>
        <Divider sx={{ m: 1 }} flexItem></Divider>
        {isSearch ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField fullWidth
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                    size="small"
                    onChange={e => {
                        handleSearch(e.target.value)
                    }}
                ></TextField>
                <Box sx={{ p: "1rem 0" }}>
                    {
                        searchData && searchData.map((user) => (
                            <Box key={user._id}
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    p: "0.5rem",
                                    m: "0.2rem",
                                    borderRadius: "1rem",
                                    ":hover": { background: theme.palette.background.default }
                                }}
                                onClick={() => {
                                    setOtherUserId(user._id);
                                    handleCreateConv()
                                }}>
                                <Avatar srcSet={user.picturePath}></Avatar>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <Typography fontSize="1rem" fontWeight="bold">{user.firstName} {user.lastName}</Typography>
                                    <Typography fontSize="0.5remrem">followers: {user.followers.length}</Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        ) : (
            <Box sx={{ overflow: "auto", scrollbarWidth: "none", display: "flex", flexDirection: "column" }}>
                {
                    !conversations.length <= 0 ? (
                        conversations && conversations.map((conversation) => (
                            <Box
                                key={conversation._id}
                            >
                                <Chat
                                    handleSetConversationId={handleSetConversationId}
                                    id={conversation._id}
                                    participants={conversation.participants}
                                    messages={conversation.messages[conversation.messages.length-1].message}
                                />
                            </Box>
                        ))
                        ) : (
                        <Box >
                            <Typography sx={{ justifyContent: "center", display: "flex", fontSize: "1rem" }}>
                                No conversations yet
                            </Typography>
                            <Typography sx={{ justifyContent: "center", display: "flex", fontSize: "0.9rem" }}>
                                start new conversation by clicking on the search button in the top right corner
                            </Typography>
                        </Box>

                    )
                }
            </Box>
        )}
    </Box>
}
export default Chats;