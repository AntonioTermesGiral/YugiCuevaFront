import { Grid, GridProps, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { Enums, Tables } from "../../database.types";
import { useNavigate } from "react-router-dom";
import { EditDeckDialog } from "./edit_dialog/EditDeckDialog";

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

    const DeckCard = ({ card, i }: { card: IDeckContent, i: number }) =>
        <Grid {...cardProperties} key={card.cardId + "card" + i}
            onClick={() => navigate("/card/?id=" + card.cardId)}>
            <Grid position="absolute" right="70%" left="30%" bottom="2.5rem">
                <Typography variant="h3" sx={{ textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000", color: "white" }}>
                    x{card.qty}
                </Typography>
            </Grid>
            <img height={156.4} width={107.2} src={card.cardImage} style={{ backgroundImage: 'url("/images/cardback.jpg")', backgroundSize: "contain" }} />
        </Grid>;

    return <Grid container direction="column" px={2} mt={2}>
        <Grid my={2}>
            <Grid container>
                <Grid item xs={12} sm={9}>
                    <Typography variant="h2" mb={2}>{deckData?.name ?? "?"}</Typography>
                </Grid>
                {authorData?.authorId == currentUserId &&
                    <Grid item xs={12} sm={3} display="flex" justifyContent={{ xs: 'flex-start', sm: "flex-end" }} my={2}>
                        <EditDeckDialog />
                    </Grid>
                }
            </Grid>
            <Typography variant="h5" width="fit-content" mb={2} onClick={() => navigate("/user/?id=" + authorData?.authorId)}>Deck owner: {authorData?.authorDisplayName ?? "?"}</Typography>
            {deckData?.tierlist &&
                <Typography variant="h5" width="fit-content" onClick={() => navigate("/tierlists/" + deckData?.tierlist?.toLowerCase())}>Tierlist: {deckData?.tierlist ?? '?'} - Tier: {deckData?.tier ?? "?"}</Typography>
            }
        </Grid>
        <Grid container direction="column" justifyContent="center">
            <Grid sx={cardsContainerStyles}>
                {content.filter((c) => c.position == "MAIN").map((card, i) => (
                    <DeckCard card={card} i={i} key={card.cardId + i} />
                ))}
            </Grid>
            <Grid sx={cardsContainerStyles}>
                {content.filter((c) => c.position == "EXTRA").map((card, i) => (
                    <DeckCard card={card} i={i} key={card.cardId + i} />
                ))}
            </Grid>
            <Grid sx={cardsContainerStyles}>
                {content.filter((c) => c.position == "SIDE").map((card, i) => (
                    <DeckCard card={card} i={i} key={card.cardId + i} />
                ))}
            </Grid>
        </Grid >
    </Grid>;
};

const singleDeckStyles = () => {

    const cardsContainerStyles: SxProps<Theme> = {
        backgroundColor: "lightgray",
        borderRadius: "30px",
        p: "1rem",
        my: 2,
        display: "flex",
        flexWrap: "wrap",
        flexGrow: 1
    }

    const cardProperties: GridProps = {
        item: true,
        px: 2,
        py: 1,
        sx: {
            ":hover": {
                scale: "120%"
            }
        },
        position: "relative",
        maxWidth: "100%"
    }

    return {
        cardsContainerStyles,
        cardProperties
    };
}
