import { Typography, Box } from "@mui/material"
import { Tables } from "../database.types"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import styled from "@emotion/styled"

interface IUserCard {
    user: Tables<"profile">
}

const StyledUserBox = styled(Box)(() => ({
    backgroundColor: "#2E2E2E",
    border: "2px solid #3A3A3A",
    width: "180px",
    height: "250px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    padding: "2em",
    margin: 8,
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
}))

export const UserCard = ({ user }: IUserCard) => {
    const navigate = useNavigate();
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    useEffect(() => {
        user.image && setPfpUrl(import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user.image);
    }, [user])

    return (
        <StyledUserBox flexDirection="column" onClick={() => navigate("/user/?id=" + user.id)}>
            <Box mb={3}>
                <img
                    width={150}
                    height={150}
                    src={pfpUrl}
                    style={{
                        backgroundImage: 'url("/images/default-profile.jpg")',
                        backgroundSize: "cover",
                        objectFit: "cover",
                        borderRadius: "50%"
                    }}
                />
            </Box>
            <Typography gutterBottom variant="h5">
                {user.display_name}
            </Typography>
        </StyledUserBox>
    )
}