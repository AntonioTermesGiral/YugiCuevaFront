import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material"
import { Tables } from "../database.types"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface IUserCard {
    user: Tables<"profile">
}

export const UserCard = ({ user }: IUserCard) => {
    const navigate = useNavigate();
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    useEffect(() => {
        setPfpUrl(import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user.id + import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_EXT);
    }, [user])

    return (
        <Card>
            <CardMedia
                sx={{ height: 150, width: "100%" }}
                image={pfpUrl}
                title="user"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {user.display_name}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
                    navigate("/user/?id=" + user.id)
                }}>User profile →</Button>
            </CardActions>
        </Card>
    )
}