import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material"
import { Tables } from "../database.types"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClient } from "../client/useClient"

interface IUserCard {
    user: Tables<"profile">
}

export const UserCard = ({ user }: IUserCard) => {
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    const loadPfp = async () => {
        const supabase = getInstance();

        let { data: pfpName, error: pfpNameError } = await supabase.rpc('get_avatar_by_user_id', { user_id: user.id });
        pfpNameError && console.log(pfpName, pfpNameError);

        return pfpName;
    }

    useEffect(() => {
        loadPfp().then((res) => {
            res && setPfpUrl(import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + res);
        });
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