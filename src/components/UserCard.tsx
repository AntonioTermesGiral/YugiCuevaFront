import { Card, CardMedia, CardContent, Typography } from "@mui/material"
import { Tables } from "../database.types"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import styled from "@emotion/styled"

interface IUserCard {
    user: Tables<"profile">
}

const StyledUserCard = styled(Card)(() => ({
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
    width: 250,
    height: 350
}))

export const UserCard = ({ user }: IUserCard) => {
    const navigate = useNavigate();
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    useEffect(() => {
        user.image && setPfpUrl(import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user.image);
    }, [user])

    return (
        <StyledUserCard onClick={() => navigate("/user/?id=" + user.id)}>
            <CardMedia
                sx={{ height: 250, width: "100%" }}
                image={pfpUrl}
                title="user"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {user.display_name}
                </Typography>
            </CardContent>
        </StyledUserCard>
    )
}