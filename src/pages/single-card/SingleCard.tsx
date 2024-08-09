import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { Tables } from "../../database.types";

export const SingleCard = () => {
    const { getInstance } = useClient();

    const [card, setCard] = useState<Tables<"card">>();
    const mobileDisplay = { xs: "block", md: "none" };
    const desktopDisplay = { xs: "none", md: "block" };

    const loadCardData = async () => {
        const url = new URL(location.href);
        const cardID = url.searchParams.get("id");

        if (cardID) {
            const supabase = getInstance();
            // Card search by id
            const { data: cardData, error: cardError } = await supabase.from('card').select().eq("id", cardID);
            cardError && console.log(cardError);

            return cardData[0];
        }
    }

    useEffect(() => {
        loadCardData().then((res) => {
            console.log(res);
            setCard(res);
        });
    }, []);

    return (
        <Grid container p={4} direction={{ "xs": "column", "sm": "row" }}>
            <Grid item xs={6} md={4}>
                <Grid>
                    <img
                        src={import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_URL + card?.id + import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_EXT}
                        height="391"
                        width="268"
                        style={{ backgroundImage: 'url("/images/cardback.jpg")', backgroundSize: "contain" }}
                    >
                    </img>
                </Grid>
                {card?.ygoprodeck_url && <Grid display={mobileDisplay} onClick={() => window.open(card.ygoprodeck_url, "_blank")}>
                    <img src="/images/ygoprodeck_header_logo.png"></img>
                </Grid>}
            </Grid>
            <Grid item container xs={6} md={8} direction="column" rowGap={1}>
                <Grid container>
                    <Grid item xs={12} md={9}><Typography variant="h3">{card?.name ?? "?"}</Typography></Grid>
                    {card?.ygoprodeck_url && <Grid item xs={12} md={3} display={desktopDisplay} onClick={() => window.open(card.ygoprodeck_url, "_blank")}>
                        <img src="/images/ygoprodeck_header_logo.png"></img>
                    </Grid>}
                </Grid>
                <Grid>
                    <Typography variant="h4">{card?.type ?? "?"}</Typography>
                </Grid>
                {card?.archetype && <Grid>
                    <Typography variant="h4">{card.archetype}</Typography>
                </Grid>}
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4">{card?.race_type ?? "?"}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4">{card?.attribute ?? "?"}</Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        {card?.level && <Typography variant="h4">Nivel: {card.level}</Typography>}
                        {card?.linkval && <Typography variant="h4"> Link Rating: {card.linkval}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        {card?.atk && <Typography variant="h4">Atk: {card.atk}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        {card?.def && <Typography variant="h4">Def: {card.def}</Typography>}
                    </Grid>
                </Grid>
                <Grid>
                    <Typography variant="h5" display={desktopDisplay}>{card?.description ?? "?"}</Typography>
                </Grid>
            </Grid>
            <Grid item container display={mobileDisplay}>
                <Typography variant="h5">
                    {card?.description ?? "?"}
                </Typography>
            </Grid>
        </Grid>
    )
};
