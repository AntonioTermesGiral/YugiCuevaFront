import { Grid, Typography } from "@mui/material"
import { useClient } from "../../client/useClient";
import { useEffect, useState } from "react";
import { MatchCard } from "./MatchCard";
import { CreateMatchDialog } from "./create_dialog/CreateMatchDialog";
import { MatchRandomizerDialog } from "./match_randomizer/MatchRandomizerDialog";
import { DEF_RAW_MATCH, IMatch, IRawMatchesData } from "./data-load/match_data_interfaces";
import { buildMatchData, fetchMatchData, fetchMatchDataByDeck, fetchMatchDataByUser } from "./data-load/match_data_loaders";

export const Matches = () => {
    const { getInstance } = useClient();
    const [matches, setMatches] = useState<IMatch[]>([]);

    // const theme = useTheme();
    // const matchesMD = useMediaQuery(theme.breakpoints.up('md'))

    // TODO: pagination
    const loadData = async (): Promise<IMatch[]> => {
        const supabase = getInstance();
        const url = new URL(location.href);
        const deckInMatch = url.searchParams.get("deck");
        const userInMatch = url.searchParams.get("user");

        const rawData: IRawMatchesData = { matchesObj: DEF_RAW_MATCH, matchesDataObj: DEF_RAW_MATCH }
        switch (true) {
            case deckInMatch !== null: {
                const deckMatchesData = await fetchMatchDataByDeck(supabase, deckInMatch);
                rawData.matchesObj = deckMatchesData.matchesObj;
                rawData.matchesDataObj = deckMatchesData.matchesDataObj;
                break;
            }
            case userInMatch !== null: {
                const userMatchesData = await fetchMatchDataByUser(supabase, userInMatch);
                rawData.matchesObj = userMatchesData.matchesObj;
                rawData.matchesDataObj = userMatchesData.matchesDataObj;
                break;
            }
            default: {
                const defaultMatchesData = await fetchMatchData(supabase);
                rawData.matchesObj = defaultMatchesData.matchesObj;
                rawData.matchesDataObj = defaultMatchesData.matchesDataObj;
            }
        }

        rawData.matchesObj.error && console.log(rawData.matchesObj.error);
        rawData.matchesDataObj.error && console.log(rawData.matchesDataObj.error);

        return buildMatchData(supabase, rawData);
    }

    const handleLoad = () => {
        loadData().then((matchesData) => {
            console.log(matchesData);
            setMatches(matchesData);
        });
    }
    useEffect(handleLoad, [])

    return (
        <Grid container p={2}>
            <Typography variant="h3" mr={2}>Duels</Typography>
            <CreateMatchDialog refreshData={handleLoad} />
            <Grid ml={1}>
                <MatchRandomizerDialog />
            </Grid>
            <Grid container>
                {matches.map((match) => <MatchCard key={match.id} match={match} />)}
            </Grid>
        </Grid>
    )
}