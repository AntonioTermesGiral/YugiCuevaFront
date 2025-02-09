import { Box, Chip } from "@mui/material"
import { Tables } from "../../database.types"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

interface ITierListDeck {
    deck: Tables<"deck">;
    owners: Tables<"profile">[];
}

export const TierListDeck = ({ deck, owners }: ITierListDeck) => {
    const navigate = useNavigate();
    const [deckImage, setDeckImage] = useState("/images/card-question.png");
    const [ownerImage, setOwnerImage] = useState<string>("/images/default-profile.jpg");

    const handleSearchImage = async () => {
        deck.image !== null && setDeckImage(import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + deck.image);

        const deckOwner = owners.find((ow) => ow.id === deck.owner)
        if (deckOwner && deckOwner.image !== null)
            setOwnerImage(import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + deckOwner.image);
    }

    useEffect(() => {
        handleSearchImage();
    }, []);

    const StyledBox = styled(Box)(() => ({
        transition: "transform 0.15s ease-in-out",
        "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
        width: "9em",
        height: "9em"
    }))

    return (
        <StyledBox key={deck.id} position="relative" onClick={() => navigate("/deck/?id=" + deck.id)}>
            <img
                style={{ objectFit: "cover" }}
                height="100%" width="100%"
                src={deckImage}
                alt={deck.name}
                loading="lazy"
            />
            <Box position="absolute" zIndex={1} height="45px" width="45px" overflow="hidden" borderRadius="50%" top={3} right={3}>
                <img src={ownerImage} height="100%" width="100%" style={{ objectFit: "cover" }} />
            </Box>
            <Box position="absolute" zIndex={1} bottom={3} right={3}>
                <Chip label={deck.points === null ? "N/A" : deck.points} sx={{ color: "white", backgroundColor: "#000000cc" }} />
            </Box>
        </StyledBox >
    )
}