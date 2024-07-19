import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material"
import { Tables } from "../database.types"
import { useNavigate } from "react-router-dom";

interface IDeckCard {
    deck: Tables<"deck">;
    hideTierInfo?: boolean;
}

export const DeckCard = ({ deck, hideTierInfo }: IDeckCard) => {
    const navigate = useNavigate();

    return (
        <Card key={deck.id} sx={{ maxWidth: 250, width: "100%" }}>
            <CardMedia
                sx={{ height: 150, width: "100%" }}
                image="/images/card-question.png"
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {deck.name}
                </Typography>
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