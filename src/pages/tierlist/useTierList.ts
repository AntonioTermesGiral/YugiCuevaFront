import { useLocation } from "react-router-dom";
import { useClient } from "../../client/useClient";
import { useEffect, useState } from "react";
import { Enums, Tables } from "../../database.types";
import { maxTier } from "../../constants/tiers";
import { v4 } from "uuid";

const EMPTY_SELECTED_OWNER = "EMPTY_SELECTED_USER" + v4();

export const useTierList = (variant: Enums<"Tierlist">) => {
    const { getInstance } = useClient();
    const loc = useLocation();
    const [sortedDecks, setSortedDecks] = useState<Map<number, Tables<"deck">[]>>(new Map());
    const [allOwners, setAllOwners] = useState<Tables<"profile">[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<string>(EMPTY_SELECTED_OWNER);

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

    const loadOwners = async () => {
        const supabase = getInstance();
        const { data: owners, error: ownersError } = await supabase
            .from('profile')
            .select('*')
        ownersError && console.log("Owners fetch error:", ownersError)

        return owners;
    }

    useEffect(() => {
        getTierListData().then(setSortedDecks);
        loadOwners().then(setAllOwners)
    }, [loc.pathname]);

    useEffect(() => {
        console.log([...sortedDecks]);
    }, [sortedDecks]);

    return {
        sortedDecks,
        allOwners,
        selectedOwner,
        setSelectedOwner,
        EMPTY_SELECTED_OWNER
    }
}