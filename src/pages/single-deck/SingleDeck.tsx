import { Grid, GridProps, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { Enums, Tables } from "../../database.types";
import { useNavigate } from "react-router-dom";

interface IDeckContent {
    cardId: number;
    qty: number;
    cardImage: string;
    position?: Enums<'CardPosition'>;
}

interface IDeckScreenData {
    deckContents: IDeckContent[];
    deckData: Tables<'deck'>;
    authorDisplayName: String;
}

type DECK_VIEW_TYPE = "NORMAL" | "COMPACT";

export const SingleDeck = () => {

    const { getInstance } = useClient();
    const navigate = useNavigate();
    const { cardsContainerStyles, cardProperties } = singleDeckStyles();

    const [deckData, setDeckData] = useState<Tables<'deck'>>();
    const [content, setContent] = useState<IDeckContent[]>([]);
    const [authorName, setAuthorName] = useState<String>();

    // Set by preferences???
    const [viewType, setViewType] = useState<DECK_VIEW_TYPE>("NORMAL");

    const loadDeckData = async (): Promise<IDeckScreenData | undefined> => {
        const url = new URL(location.href);
        const deckID = url.searchParams.get("id");

        if (deckID) {
            const supabase = getInstance();

            // Deck search by id
            const { data: deckData, error: deckError } = await supabase.from('deck').select().eq("id", deckID);
            deckError && console.error(deckError);

            // Links search by deck id
            const { data: linksData, error: linksError } = await supabase.from('card_in_deck').select().eq("deck_id", deckID);
            linksError && console.error(linksError);

            // Author search by id
            const { data: authorDN, error: authorError } = await supabase.from('profile').select('display_name').eq("id", deckData[0].owner);
            authorError && console.error(authorError);

            const dContent = linksData.map((link: Tables<'card_in_deck'>) => {
                return {
                    cardId: link.card_id,
                    cardImage: import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_URL + link.card_id + import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_EXT,
                    qty: link.quantity,
                    position: link.position
                } as IDeckContent;
            });

            return { deckData: deckData[0], deckContents: dContent, authorDisplayName: authorDN[0].display_name }
        }

        return undefined;

    }

    useEffect(() => {
        loadDeckData().then((res) => {
            setContent(res?.deckContents ?? []);
            setDeckData(res?.deckData);
            setAuthorName(res?.authorDisplayName);
        });
    }, []);

    const Card = ({ card, i }: { card: IDeckContent, i: number }) =>
        <Grid {...cardProperties} key={card.cardId + "card" + i}
            onClick={() => navigate("/card/?id=" + card.cardId)}>
            <Grid position="absolute" right="70%" left="30%" bottom="2.5rem">
                <Typography variant="h3" sx={{ textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000", color: "white" }}>
                    x{card.qty}
                </Typography>
            </Grid>
            <img height={156.4} width={107.2} src={card.cardImage} />
        </Grid>;

    // 2 views? 1 with all card and the other with each card and its qty
    /* TODO: OPTIONS TO CHANGE VTYPE */
    return <Grid container direction="column" px={2} mt={2}>
        <Grid my={2}>
            <Typography variant="h2">{deckData?.name ?? "?"}</Typography>
            {/* TODO: Owner link */}
            <Typography variant="h5">Deck owner: {authorName ?? "?"}</Typography>
            <Typography variant="h5">Tierlist: {deckData?.tierlist ?? '?'} - Tier: {deckData?.tier ?? "?"}</Typography>
        </Grid>
        <Grid container direction="column" justifyContent="center">
            <Grid sx={cardsContainerStyles}>
                {content.filter((c) => c.position == "MAIN").map((card, i) => (
                    <Card card={card} i={i} key={card.cardId + i} />
                ))}
            </Grid>
            <Grid sx={cardsContainerStyles}>
                {content.filter((c) => c.position == "EXTRA").map((card, i) => (
                    <Card card={card} i={i} key={card.cardId + i} />
                ))}
            </Grid>
            <Grid sx={cardsContainerStyles}>
                {content.filter((c) => c.position == "SIDE").map((card, i) => (
                    <Card card={card} i={i} key={card.cardId + i} />
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
