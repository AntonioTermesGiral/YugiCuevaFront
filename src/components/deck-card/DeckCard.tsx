import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tables } from "../../database.types";
import { deckCardStyled } from "./deck_card_styled";
import { useNavigate } from "react-router-dom";
import { useDeckCard } from "./useDeckCard";
import { DECK_GRADIENT_END, DECK_GRADIENT_START, DECK_TEXT_COLOR } from "../../constants/colors";

interface IDeckCardPreviewParams {
    startColor: string;
    endColor: string;
    textColor: string;
    tier: string;
    points: string;
    name: string;
    ownerImage: string;
    deckImage: string;
}

interface IDeckCard {
    deck: Tables<"deck">;
    users: Tables<"profile">[];
    hideTierInfo?: boolean;
    previewParams?: IDeckCardPreviewParams;
}

export function DeckCard({ deck, users, previewParams }: IDeckCard) {
    const navigate = useNavigate();
    const { deckImage, ownerImage } = useDeckCard(deck, users, previewParams !== undefined);
    const {
        StyledRoot,
        CardMediaCover,
        StyledH2,
        StyledContent,
        AvatarLogo,
        StyledTierInfo
    } = deckCardStyled();

    let startColor = deck.gradient_color_start ?? DECK_GRADIENT_START;
    let endColor = deck.gradient_color_end ?? DECK_GRADIENT_END;
    let textColor = deck.text_color ?? DECK_TEXT_COLOR;

    let tier = "Tier " + (deck.tier ?? "N/A");
    let points = deck.points ?? "N/A";
    let name = deck.name;

    if (previewParams) {
        startColor = previewParams.startColor;
        endColor = previewParams.endColor;
        textColor = previewParams.textColor;
        tier = "Tier " + previewParams.tier;
        points = previewParams.points;
        name = previewParams.name;
    }

    return (
        <Grid onClick={() => {
            if (!previewParams) navigate("/deck/?id=" + deck.id)
        }}>
            <StyledRoot color={startColor}>
                <CardMediaCover image={previewParams?.deckImage ?? deckImage} />
                <StyledContent startColor={startColor} endColor={endColor}>
                    <Box position="relative" zIndex={1}>
                        <Box display="flex" p={0} gap={2} sx={{ flexWrap: "nowrap" }}>
                            <Box>
                                <AvatarLogo src={previewParams?.ownerImage ?? ownerImage} />
                            </Box>
                            <Box alignSelf="flex-end">
                                <StyledH2 color={textColor}>{name}</StyledH2>
                            </Box>
                        </Box>
                        <Box display="flex" mt={4} alignItems="center">
                            <Box>
                                <StyledTierInfo color="#ffffff">{tier}</StyledTierInfo>
                            </Box>
                            <Box ml="auto">
                                <StyledTierInfo color="#ffffff">{points}</StyledTierInfo>
                            </Box>
                        </Box>
                    </Box>
                </StyledContent>
            </StyledRoot>
        </Grid>
    );
}
