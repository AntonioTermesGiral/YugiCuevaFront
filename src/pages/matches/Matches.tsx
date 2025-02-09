import { Grid, Typography } from "@mui/material"
import { useClient } from "../../client/useClient";
import { useEffect, useState } from "react";
import { MatchCard } from "./MatchCard";
import { CreateMatchDialog } from "./create_dialog/CreateMatchDialog";
import { MatchRandomizerDialog } from "./match_randomizer/MatchRandomizerDialog";
import { IMatch } from "./data-load/match_data_interfaces";
import { buildMatchData, fetchMatchData } from "./data-load/match_data_loaders";

export const Matches = () => {
    const { getInstance } = useClient();
    const [matches, setMatches] = useState<IMatch[]>([]);

    // TODO: pagination
    const loadData = async (): Promise<IMatch[]> => {
        const supabase = getInstance();

        const { matchesObj, matchesDataObj } = await fetchMatchData(supabase);

        matchesObj.error && console.log(matchesObj.error);
        matchesDataObj.error && console.log(matchesDataObj.error);

        return buildMatchData(supabase, { matchesObj, matchesDataObj });
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