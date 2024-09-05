import { Grid, Paper, Typography } from "@mui/material";
import { Enums, Tables } from "../../database.types"
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { DeckCard } from "../../components/DeckCard";
import { maxTier } from "../../constants/tiers";
import { useLocation } from "react-router-dom";

interface ITierList {
    variant: Enums<"Tierlist">;
}

export const TierList = ({ variant }: ITierList) => {
    const { getInstance } = useClient();
    const loc = useLocation();
    const [sortedDecks, setSortedDecks] = useState<Map<number, Tables<"deck">[]>>(new Map());

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
            <Paper sx={{ width: "80vw", }}>
                {[...sortedDecks].map((tierData) => {
                    const currentTier = tierData[0];
                    const currentTierDecks = tierData[1];
                    return (
                        <Grid container key={currentTier} borderBottom="1px solid black">
                            <Grid item display="flex" alignItems="center" justifyContent="center" xs={2} borderRight="1px solid black" textAlign="center" py={2}>
                                {isNaN(currentTier) ? <Typography variant="h5">No Tier</Typography> : <Typography variant="h4">{currentTier}</Typography>}
                            </Grid>
                            <Grid item container alignItems="center" xs={10}>
                                {currentTierDecks.map((currentDeck) => (
                                    <Grid item key={currentDeck.id} m={1} minWidth="200px">
                                        <DeckCard deck={currentDeck} hideTierInfo />
                                    </Grid>
                                ))}
                                {currentTierDecks.length == 0 && <Typography variant="h5" ml={1}>No Decks...</Typography>}
                            </Grid>
                        </Grid>
                    )
                })}
            </Paper>
        </Grid>
    )
}