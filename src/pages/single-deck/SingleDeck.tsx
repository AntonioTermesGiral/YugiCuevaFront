import { CircularProgress, Grid, GridProps, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EditDeckDialog } from "./edit_dialog/EditDeckDialog";
import { DeleteDeckDialog } from "./delete_dialog/DeleteDeckDialog";
import { YDKEGenerateDialog } from "./ydke_generate_dialog/YDKEGenerateDialog";
import { MatchCard } from "../matches/MatchCard";
import { IDeckContent, useSingleDeckViewModel } from "./useSingleDeckViewModel";

export const SingleDeck = () => {
    const navigate = useNavigate();
    const {
        currentUserId,
        deckData,
        content,
        authorData,
        matches,
        loading
    } = useSingleDeckViewModel();
    const { cardsContainerStyles, cardProperties, loaderProps } = singleDeckStyles();

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.up('sm'));
    const matchesLG = useMediaQuery(theme.breakpoints.up('md'));

    const getCardSizes = () => {
        if (matchesLG) return { height: 156.4, width: 107.2 };
        if (matchesMD) return { height: 117.3, width: 80.4 };
        if (!matchesMD) return { height: 78.2, width: 53.6 };
        return { height: 156.4, width: 107.2 };
    }

    const DeckCard = ({ card, i }: { card: IDeckContent, i: number }) =>
        <Grid {...cardProperties} key={card.cardId + "card" + i}
            onClick={() => navigate("/card/?id=" + card.cardId)}>
            <Grid position="absolute" right="10px" bottom="10px">
                <Typography variant={matchesLG ? "h3" : matchesMD ? "h4" : "h5"} sx={{ textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000", color: "white" }}>
                    x{card.qty}
                </Typography>
            </Grid>
            <img height={getCardSizes().height} width={getCardSizes().width} src={card.cardImage} style={{ backgroundImage: 'url("/images/cardback.jpg")', backgroundSize: "contain" }} />
        </Grid>;

    return <>
        <Grid container direction="column" px={2} mt={2}>
            <Grid my={2}>
                <Grid container>
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h2" mb={2}>{deckData?.name ?? "?"}</Typography>
                    </Grid>
                    {authorData?.authorId === currentUserId ?
                        <Grid item container xs={12} md={3} display="flex" justifyContent={{ xs: 'flex-start', md: "flex-end" }} my={2} columnSpacing={1}>
                            <Grid item>
                                <YDKEGenerateDialog />
                            </Grid>
                            <Grid item>
                                <EditDeckDialog userImage={authorData?.image} />
                            </Grid>
                            <Grid item>
                                <DeleteDeckDialog deckId={deckData?.id} deckImageId={deckData?.image} />
                            </Grid>
                        </Grid>
                        :
                        <Grid item container xs={12} sm={3} display="flex" justifyContent={{ xs: 'flex-start', sm: "flex-end" }} my={2}>
                            <YDKEGenerateDialog />
                        </Grid>
                    }
                </Grid>
                <Typography variant="h5" width="fit-content" mb={2} onClick={() => navigate("/user/?id=" + authorData?.authorId)}>Deck owner: {authorData?.authorDisplayName ?? "?"}</Typography>
                {deckData?.tierlist &&
                    <Typography variant="h5" width="fit-content" onClick={() => navigate("/tierlists/" + deckData?.tierlist?.toLowerCase())}>Tierlist: {deckData?.tierlist ?? '?'} - Tier: {deckData?.tier ?? "?"}</Typography>
                }
            </Grid>
            <Grid container direction="column" justifyContent="center">
                <Grid {...cardsContainerStyles}>
                    {content.filter((c) => c.position == "MAIN").map((card, i) => (
                        <DeckCard card={card} i={i} key={card.cardId + i} />
                    ))}
                </Grid>
                <Grid {...cardsContainerStyles}>
                    {content.filter((c) => c.position == "EXTRA").map((card, i) => (
                        <DeckCard card={card} i={i} key={card.cardId + i} />
                    ))}
                </Grid>
                <Grid {...cardsContainerStyles}>
                    {content.filter((c) => c.position == "SIDE").map((card, i) => (
                        <DeckCard card={card} i={i} key={card.cardId + i} />
                    ))}
                </Grid>
            </Grid >
            {matches.length > 0 && <Grid container mt={2}>
                <Typography ml={2} variant="h5">DUELS</Typography>
                <Grid container>
                    {matches.map((match) => <MatchCard key={match.id} match={match} />)}
                </Grid>
            </Grid>}
        </Grid>
        <Grid {...loaderProps} display={loading ? "flex" : "none"} >
            <CircularProgress color="secondary" />
        </Grid>
    </>;
};

const singleDeckStyles = () => {
    const cardsContainerStyles: GridProps = {
        style: { backgroundColor: "lightgray" },
        borderRadius: "10px",
        p: "0.5rem",
        my: 2,
        container: true
    }

    const cardProperties: GridProps = {
        item: true,
        p: "1px",
        sx: {
            ":hover": {
                scale: "120%"
            }
        },
        position: "relative"
    }

    const loaderProps: GridProps = {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        sx: {
            backgroundColor: "#000000dd"
        },
        justifyContent: "center",
        alignItems: "center"
    }

    return {
        cardsContainerStyles,
        cardProperties,
        loaderProps
    };
}
