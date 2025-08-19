import { CircularProgress, Grid, GridProps, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EditDeckDialog } from "./edit_dialog/EditDeckDialog";
import { DeleteDeckDialog } from "./delete_dialog/DeleteDeckDialog";
import { YDKEGenerateDialog } from "./ydke_generate_dialog/YDKEGenerateDialog";
import { MatchCard } from "../matches/MatchCard";
import { IDeckContent, useSingleDeckViewModel } from "./useSingleDeckViewModel";
import { Enums } from "../../database.types";

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

    const DeckCard = ({ card, i }: { card: IDeckContent, i: number }) =>
        <Grid {...cardProperties} key={card.cardId + "card" + i}
            onClick={() => navigate("/card/?id=" + card.cardId)}>
            <img height={150} width={100} src={card.cardImage} style={{ backgroundImage: 'url("/images/cardback.jpg")', backgroundSize: "contain" }} />
        </Grid>;

    const renderDeckCards = (position: Enums<'CardPosition'>) => {
        const cardList = content.filter((c) => c.position == position);

        return cardList.map((card, i) => (
            new Array(card.qty).fill("").map((_, j) => (
                <DeckCard card={card} i={card.cardId + i + j} key={card.cardId + i + j} />
            ))
        ))
    }

    return <>
        <Grid container direction="column" px={{ xs: 2, lg: 16 }} mt={2}>
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
                <Typography variant="h4">Main Deck</Typography>
                <Grid {...cardsContainerStyles}>
                    {renderDeckCards("MAIN")}
                </Grid>

                <Typography variant="h4">Extra Deck</Typography>
                <Grid {...cardsContainerStyles}>
                    {renderDeckCards("EXTRA")}
                </Grid>

                <Typography variant="h4">Side Deck</Typography>
                <Grid {...cardsContainerStyles}>
                    {renderDeckCards("SIDE")}
                </Grid>
            </Grid >
            {matches.length > 0 && <Grid container mt={2}>
                <Typography ml={2} variant="h5">DUELS</Typography>
                <Grid container>
                    {matches.map((match) => <MatchCard key={match.id} match={match} />)}
                </Grid>
            </Grid>}
        </Grid >
        <Grid {...loaderProps} display={loading ? "flex" : "none"} >
            <CircularProgress color="secondary" />
        </Grid>
    </>;
};

const singleDeckStyles = () => {
    const cardsContainerStyles: GridProps = {
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
        xs: 2.4,
        sm: 1.2
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
