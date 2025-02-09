import { Grid, Typography } from "@mui/material"
import { Fragment } from "react";
import { DeckCard } from "../../components/deck-card/DeckCard";
import { useSingleCard } from "./useSingleCard";

export const SingleCard = () => {
    const {
        card,
        relatedDecks,
        deckOwners,
        mobileDisplay,
        desktopDisplay,
        getCarrouselSizes,
        emblaRef
    } = useSingleCard();

    return (
        <Fragment>
            <Grid container p={4} direction={{ "xs": "column", "sm": "row" }}>
                <Grid item xs={6} md={4}>
                    <Grid>
                        <img
                            src={import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_URL + card?.id + import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_EXT + "?ver=" + new Date().getTime()}
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
                        {card?.attribute &&
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4">{card.attribute}</Typography>
                            </Grid>
                        }
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            {card?.level && <Typography variant="h4">Nivel: {card.level}</Typography>}
                            {card?.linkval && <Typography variant="h4"> Link Rating: {card.linkval}</Typography>}
                        </Grid>
                        <Grid item xs={6}>
                            {(card?.atk !== null && card?.atk !== undefined) &&
                                <Typography variant="h4">Atk: {card.atk}</Typography>}
                        </Grid>
                        <Grid item xs={6}>
                            {(card?.def !== null && card?.def !== undefined) &&
                                <Typography variant="h4">Def: {card.def}</Typography>}
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
            <Grid container direction="column" px={4}>
                <Typography variant="h5" mb={2}>
                    Decks with this card
                </Typography>
                <Grid overflow="hidden" ref={emblaRef} maxWidth="100%">
                    <Grid container wrap="nowrap">
                        {relatedDecks.map((d) => (
                            <Grid flex={getCarrouselSizes()} minWidth={0} key={d.id}>
                                <DeckCard deck={d} key={d.id} users={deckOwners} hideTierInfo />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    )
};
