import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material"
import { Tables } from "../database.types"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClient } from "../client/useClient";

interface IDeckCard {
    deck: Tables<"deck">;
    hideTierInfo?: boolean;
    hideOwnerInfo?: boolean;
}

export const DeckCard = ({ deck, hideTierInfo, hideOwnerInfo }: IDeckCard) => {
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const supabase = getInstance();
    const [hasImage, setHasImage] = useState(false);
    const [ownerName, setOwnerName] = useState<string>();

    const handleSearchImage = async () => {
        const { data, error } = await supabase
            .storage
            .from('DeckImages')
            .list('', {
                limit: 1,
                offset: 0,
                search: deck.id + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT
            });

        setHasImage(!error && data.length > 0);

        const { data: dname, error: dnameError } = await supabase
            .from('profile')
            .select('display_name')
            .eq('id', deck.owner);

        if (dname[0]) {
            setOwnerName(dname[0].display_name);
        }
        dnameError && console.log("Owner get error on deck", deck.id, ":", dnameError);
    }

    useEffect(() => {
        handleSearchImage();
    }, []);

    return (
        <Card key={deck.id} sx={{ maxWidth: 250, width: "100%" }}>
            <CardMedia
                sx={{ height: 150, width: "100%" }}
                image={hasImage ?
                    import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + deck.id + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT
                    : "/images/card-question.png"
                }
                title="deck"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {deck.name}
                </Typography>
                {!hideOwnerInfo && <Typography variant="body2" color="text.secondary">
                    Owner: {ownerName ?? "?"}
                </Typography>}
                {!hideTierInfo && <Typography variant="body2" color="text.secondary">
                    Deck Stats (Tierlist)
                </Typography>}
                {!hideTierInfo && <Typography variant="body2" color="text.secondary">
                    (Tier)
                </Typography>}
                <Typography variant="body2" color="text.secondary">
                    (Points)
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
                    navigate("/deck/?id=" + deck.id)
                }}>Deck details →</Button>
            </CardActions>
        </Card>
    )
}