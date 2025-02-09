import { Grid, GridProps, Paper, Typography } from "@mui/material";
import { Enums } from "../../database.types"
import { TierListDeck } from "./TierListDeck";
import { useTierList } from "./useTierList";

interface ITierList {
    variant: Enums<"Tierlist">;
}

const colorLoop = [
    '#ff7f7f',
    '#ffbf7f',
    '#ffdf7f',
    '#FFFF7F',
    '#bfff7f',
    '#7fff7f',
    '#7fffff',
    '#7fbfff',
    '#7f7fff',
    '#ff7fff',
    '#bf7fbf'
]

const getBackgroundColorLoop = (index: number) => {
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
        <Grid container direction="column" alignItems="center" pb={3}>
            <Typography variant="h4" my={2}>TIERLIST: {variant}</Typography>
            <Paper sx={{ width: "98vw", backgroundColor: "transparent" }}>
                {[...sortedDecks].map((tierData, index) => {
                    const currentTier = tierData[0];
                    const currentTierDecks = tierData[1];
                    return (
                        <Grid container key={currentTier} border="6px solid black" borderBottom={index === sortedDecks.size - 1 ? "6px solid black" : "none"} minHeight="10rem">
                            <Grid {...styles.tier} sx={{ backgroundColor: getBackgroundColorLoop(index) }}>
                                {isNaN(currentTier) ? <Typography variant="h5">No Tier</Typography> : <Typography variant="h4" fontSize="4rem">{currentTier}</Typography>}
                            </Grid>
                            <Grid item container alignItems="center" xs={10} gap={1} p={1}>
                                {currentTierDecks.map((currentDeck) => <TierListDeck deck={currentDeck} owners={allOwners} key={currentDeck.id} />)}
                                {currentTierDecks.length == 0 && <Typography variant="h5" color="white" ml={1}>No Decks...</Typography>}
                            </Grid>
                        </Grid>
                    )
                })}
            </Paper>
        </Grid>
    )
}

const getStyles = () => {
    const tier: GridProps = {
        item: true,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        xs: 2,
        borderRight: "6px solid black",
        textAlign: "center",
        py: 2,
    }

    return {
        tier
    }
}