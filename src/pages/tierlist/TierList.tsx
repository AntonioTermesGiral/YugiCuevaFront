import { Box, Grid, GridProps, Typography } from "@mui/material";
import { Enums } from "../../database.types"
import { TierListDeck } from "./TierListDeck";
import { useTierList } from "./useTierList";
import { colorLoop } from "../../constants/colors";

interface ITierList {
    variant: Enums<"Tierlist">;
}

const getTierColor = (index: number) => {
    let currentIndex = index;
    while (currentIndex > colorLoop.length - 1) {
        currentIndex -= colorLoop.length;
    }

    return colorLoop[currentIndex];
}

export const TierList = ({ variant }: ITierList) => {
    const styles = getStyles();
    const { sortedDecks, allOwners } = useTierList(variant);

    return (
        <Grid container direction="column" alignItems="center" py={1}>
            {/* FIXME: MAYBE ADD ON MULTIPLE TIERLISTS */}
            {/* <Typography variant="h4" my={2}>TIERLIST: {variant}</Typography> */}
            <Box sx={{ width: "100%", color: "black" }}>
                {[...sortedDecks].map((tierData, index) => {
                    const currentTier = tierData[0];
                    const currentTierDecks = tierData[1];
                    return (
                        <Grid
                            container
                            key={currentTier}
                            direction={{ xs: "column", sm: "row" }}
                            wrap="nowrap"
                            minHeight="10rem"
                        >
                            <Grid {...styles.tier} sx={{ backgroundColor: getTierColor(index) }}>
                                {isNaN(currentTier) ?
                                    <Typography fontWeight={500} fontSize="clamp(2rem, 8vw, 3rem)">No Tier</Typography>
                                    : <Typography fontWeight={500} fontSize="clamp(3rem, 16vw, 4rem)">{currentTier}</Typography>
                                }
                            </Grid>
                            <Grid item container alignItems="center" gap={1} p={1}>
                                {currentTierDecks.map((currentDeck) => <TierListDeck deck={currentDeck} owners={allOwners} key={currentDeck.id} />)}
                                {currentTierDecks.length == 0 && <Typography variant="h5" color="white" ml={1}>No Decks...</Typography>}
                            </Grid>
                        </Grid>
                    )
                })}
            </Box>
        </Grid>
    )
}

const getStyles = () => {
    const tier: GridProps = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        textAlign: "center",
        px: 2,
        m: 1
    }

    return {
        tier
    }
}