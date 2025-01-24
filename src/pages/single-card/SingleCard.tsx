import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Fragment, useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { Tables } from "../../database.types";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from 'embla-carousel-auto-scroll';
import { DeckCard } from "../../components/DeckCard";

export const SingleCard = () => {
    const { getInstance } = useClient();

    const [card, setCard] = useState<Tables<"card">>();
    const [relatedDecks, setRelatedDecks] = useState<Tables<"deck">[]>([]);
    const mobileDisplay = { xs: "block", md: "none" };
    const desktopDisplay = { xs: "none", md: "block" };

    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.up('sm'))
    const matchesMD = useMediaQuery(theme.breakpoints.up('md'))
    const matchesLG = useMediaQuery(theme.breakpoints.up('lg'))
    const matchesXL = useMediaQuery(theme.breakpoints.up('xl'))

    const getCarrouselSizes = () => {
        if (matchesXL) return "0 0 15%";
        else if (matchesLG) return "0 0 25%";
        else if (matchesMD) return "0 0 30%";
        else if (matchesSM) return "0 0 50%";
        else return "0 0 90%"
    }

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1 })]
    )

    const loadCardData = async () => {
        const url = new URL(location.href);
        const cardID = url.searchParams.get("id");

        if (cardID) {
            const supabase = getInstance();
            // Card search by id
            const { data: cardData, error: cardError } = await supabase.from('card').select().eq("id", cardID);
            cardError && console.log(cardError);

            // DeckIdSearch
            const { data: decksIdData, error: decksIdError } = await supabase.from('card_in_deck').select("deck_id").eq("card_id", cardID)
            decksIdError && console.log(decksIdError);
            console.log(decksIdData)
            const uniqueDeckIds = Array.from(new Set(decksIdData.map((d: { deck_id: string }) => d.deck_id)))
            console.log(uniqueDeckIds)

            // DeckIdSearch
            const { data: decksData, error: decksError } = await supabase.from('deck').select().in("id", uniqueDeckIds)
            decksError && console.log(decksError);

            return { cardData: cardData[0], decks: decksData };
        }
    }

    useEffect(() => {
        loadCardData().then((res) => {
            console.log(res);
            setCard(res?.cardData);
            setRelatedDecks(res?.decks ?? []);
        });
    }, []);

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
                                <DeckCard deck={d} key={d.id} hideTierInfo />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    )
};
