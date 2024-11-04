import { Grid, GridProps, Paper, Typography } from "@mui/material";
import { Enums, Tables } from "../../database.types"
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { maxTier } from "../../constants/tiers";
import { useLocation } from "react-router-dom";
import { TierListDeck } from "./TierListDeck";

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
    const { getInstance } = useClient();
    const loc = useLocation();
    const [sortedDecks, setSortedDecks] = useState<Map<number, Tables<"deck">[]>>(new Map());
    const styles = getStyles();

    const getTierListData = async () => {
        const supabase = getInstance();

        // Get user
        const { data: decksData, error } = await supabase.from('deck').select().eq("tierlist", variant);
        error && console.log(error);

        // Assign each deck to its corresponding tier
        let decksBSorted = new Map<number, Tables<"deck">[]>();
        decksData.forEach((deck: Tables<"deck">) => {
            const currentTier = deck.tier ?? NaN;
            const currentTierData = decksBSorted.get(currentTier);

            if (currentTierData) {
                currentTierData.push(deck);
                decksBSorted.set(currentTier, [...currentTierData]);
            } else decksBSorted.set(currentTier, [deck]);
        })

        // Sort each tier by points
        decksBSorted.forEach((currentTierValue, currentTier) => {
            const sortedTier = currentTierValue.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
            decksBSorted.set(currentTier, [...sortedTier]);
        });

        // Get unused tiers
        // TODO: make configurable
        for (let i = 0; i <= maxTier; i++) {
            if (!decksBSorted.get(i)) {
                decksBSorted.set(i, []);
            }
        }

        // Sort the map by tiers
        decksBSorted = new Map([...decksBSorted.entries()].sort());

        return decksBSorted;
    }

    useEffect(() => {
        getTierListData().then(setSortedDecks);
    }, [loc.pathname]);

    useEffect(() => {
        console.log([...sortedDecks]);
    }, [sortedDecks]);

    return (
        <Grid container direction="column" alignItems="center" pb={3}>
            <Typography variant="h4" my={2}>TIERLIST: {variant}</Typography>
            <Paper sx={{ width: "95vw", backgroundColor: "transparent" }}>
                {[...sortedDecks].map((tierData, index) => {
                    const currentTier = tierData[0];
                    const currentTierDecks = tierData[1];
                    return (
                        <Grid container key={currentTier} border="6px solid black" borderBottom={index === sortedDecks.size - 1 ? "6px solid black" : "none"} minHeight="10rem">
                            <Grid {...styles.tier} sx={{ backgroundColor: getBackgroundColorLoop(index) }}>
                                {isNaN(currentTier) ? <Typography variant="h5">No Tier</Typography> : <Typography variant="h4" fontSize="4rem">{currentTier}</Typography>}
                            </Grid>
                            <Grid item container alignItems="center" xs={10} spacing={1} p={1}>
                                {currentTierDecks.map((currentDeck) => (
                                    <Grid item key={currentDeck.id} xs={6} sm={4} md={2}>
                                        <TierListDeck deck={currentDeck} />
                                    </Grid>
                                ))}
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