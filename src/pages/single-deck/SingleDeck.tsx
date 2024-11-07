import { Grid, GridProps, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { Enums, Tables } from "../../database.types";
import { useNavigate } from "react-router-dom";
import { EditDeckDialog } from "./edit_dialog/EditDeckDialog";
import { DeleteDeckDialog } from "./delete_dialog/DeleteDeckDialog";
import { YDKEGenerateDialog } from "./ydke_generate_dialog/YDKEGenerateDialog";

interface IDeckContent {
    cardId: number;
    qty: number;
    cardImage: string;
    position?: Enums<'CardPosition'>;
}

interface IDeckScreenData {
    deckContents: IDeckContent[];
    deckData: Tables<'deck'>;
    authorData: IDeckAuthorData;
}

interface IDeckAuthorData {
    authorDisplayName: string;
    authorId: string;
}

export const SingleDeck = () => {
    const { getInstance } = useClient();
    const navigate = useNavigate();
    const { cardsContainerStyles, cardProperties } = singleDeckStyles();
    const [currentUserId, setCurrentUserId] = useState<string>();

    const [deckData, setDeckData] = useState<Tables<'deck'>>();
    const [content, setContent] = useState<IDeckContent[]>([]);
    const [authorData, setAuthorData] = useState<IDeckAuthorData>();

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.up('sm'));
    const matchesLG = useMediaQuery(theme.breakpoints.up('md'));

    const loadDeckData = async (): Promise<IDeckScreenData | undefined> => {
        const url = new URL(location.href);
        const deckID = url.searchParams.get("id");

        if (deckID) {
            const supabase = getInstance();

            const { data: { user: currentUser } } = await supabase.auth.getUser()
            setCurrentUserId(currentUser?.id);

            // Deck search by id
            const { data: deckData, error: deckError } = await supabase.from('deck').select().eq("id", deckID);
            deckError && console.error(deckError);

            // Links search by deck id
            const { data: linksData, error: linksError } = await supabase.from('card_in_deck').select().eq("deck_id", deckID);
            linksError && console.error(linksError);

            // Author search by id
            const { data: authorDN, error: authorError } = await supabase.from('profile').select('id,display_name').eq("id", deckData[0].owner);
            authorError && console.error(authorError);

            const dContent = linksData.map((link: Tables<'card_in_deck'>) => {
                return {
                    cardId: link.card_id,
                    cardImage: import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_URL + link.card_id + import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_EXT + "?ver=" + new Date().getTime(),
                    qty: link.quantity,
                    position: link.position
                } as IDeckContent;
            });

            return {
                deckData: deckData[0],
                deckContents: dContent,
                authorData: {
                    authorDisplayName: authorDN[0].display_name,
                    authorId: authorDN[0].id
                }
            }
        }

        return undefined;

    }

    useEffect(() => {
        loadDeckData().then((res) => {
            setContent(res?.deckContents ?? []);
            setDeckData(res?.deckData);
            setAuthorData(res?.authorData);
        });
    }, []);

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

    return <Grid container direction="column" px={2} mt={2}>
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
                            <EditDeckDialog />
                        </Grid>
                        <Grid item>
                            <DeleteDeckDialog />
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
    </Grid>;
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

    return {
        cardsContainerStyles,
        cardProperties
    };
}
