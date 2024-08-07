import { Card, Grid, Typography } from "@mui/material"
import { useClient } from "../../client/useClient";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Enums, Tables } from "../../database.types";
import { WipScreen } from "../../components/WipScreen";

interface IPlayerData {
    playerId: string | null,
    playerDisplayName: string | null,
    playerDeckId: string | null,
    playerDeckName: string | null,
    pointChanges: string
}

interface IMatch {
    id: string,
    date: string,
    type: Enums<'MatchType'> | null,
    sideDeck: boolean,
    winners: IPlayerData[],
    losers: IPlayerData[],
    winnersScore: number,
    losersScore: number
}

export const Matches = () => {
    const { getInstance } = useClient();
    const navigate = useNavigate();
    const [matches, setMatches] = useState<IMatch[]>([]);

    // TODO: pagination
    const loadData = async (): Promise<IMatch[]> => {
        const supabase = getInstance();
        const url = new URL(location.href);
        const deckInMatch = url.searchParams.get("deck");
        const userInMatch = url.searchParams.get("user");

        let matchesObj = { data: [], error: null };
        let matchesDataObj = { data: [], error: null };

        if (deckInMatch || userInMatch) {
            let ids_to_search: { match_id: String }[] = [];

            if (deckInMatch) {
                // MATCHES BY DECK
                const { data: searchIds, error: searchIdsError } = await supabase.from('match_data').select('match_id').eq('deck', deckInMatch);
                searchIdsError && console.log(searchIdsError);
                ids_to_search = searchIds;

            } else if (userInMatch) {
                // MATCHES BY USER
                const { data: searchIds, error: searchIdsError } = await supabase.from('match_data').select('match_id').eq('player', userInMatch);
                searchIdsError && console.log(searchIdsError);
                ids_to_search = searchIds;
            }

            const idsToSearch = ids_to_search.map((sid) => sid.match_id);

            matchesObj = await supabase.from('match').select().in('id', idsToSearch);
            matchesDataObj = await supabase.from('match_data').select().in('match_id', idsToSearch);

        } else {
            // LASTEST MATCHES
            matchesObj = await supabase.from('match').select().limit(10);
            matchesDataObj = await supabase.from('match_data').select();
        }

        matchesObj.error && console.log(matchesObj.error);

        matchesDataObj.error && console.log(matchesDataObj.error);

        // Decks search
        const decksIds = [...(new Set((matchesDataObj.data as Tables<'match_data'>[]).map((mdo) => mdo.deck)))];

        const { data: matchesDecksData, error: matchesDecksError } = await supabase.from('deck').select().in('id', decksIds);
        matchesDecksError && console.log(matchesDecksError);

        const matchesDecks = new Map<string, string>();
        (matchesDecksData as Tables<'deck'>[]).forEach((d) => {
            matchesDecks.set(d.id, d.name);
        });

        // Players search
        const playersIds = [...(new Set((matchesDataObj.data as Tables<'match_data'>[]).map((mdo) => mdo.player)))];

        const { data: matchesPlayersData, error: matchesPlayersError } = await supabase.from('profile').select().in('id', playersIds);
        matchesPlayersError && console.log(matchesPlayersError);

        const matchesPlayers = new Map<string, string>();
        (matchesPlayersData as Tables<'profile'>[]).forEach((d) => {
            matchesPlayers.set(d.id, d.display_name);
        });

        // Builds the results
        const matchesRes: IMatch[] = [];

        (matchesObj.data as Tables<'match'>[]).forEach((match) => {

            const currentMatchData = (matchesDataObj.data as Tables<'match_data'>[])
                .filter((cmdo) => cmdo.match_id == match.id);

            let currentWinnersScore;
            let currentLosersScore;

            const currentWinners: IPlayerData[] = [];
            const currentLosers: IPlayerData[] = [];

            currentMatchData.forEach((cmd) => {
                const currentPlayer: IPlayerData = {
                    playerDeckId: cmd.deck,
                    playerDeckName: matchesDecks.get(cmd.deck ?? "") ?? null,
                    playerId: cmd.player,
                    playerDisplayName: matchesPlayers.get(cmd.player ?? "") ?? null,
                    pointChanges: cmd.deck_point_changes ?? "0"
                }

                if (cmd.winner) {
                    currentWinnersScore = cmd.score;
                    currentWinners.push(currentPlayer);
                } else {
                    currentLosersScore = cmd.score;
                    currentLosers.push(currentPlayer);
                }

            });

            matchesRes.push({
                id: match.id,
                date: match.date,
                type: match.type,
                sideDeck: match.side_deck ?? false,
                losers: currentLosers,
                losersScore: currentLosersScore ?? 0,
                winners: currentWinners,
                winnersScore: currentWinnersScore ?? 0
            })
        });

        return matchesRes;

    }

    useEffect(() => {
        loadData().then((matchesData) => {
            console.log(matchesData);
            setMatches(matchesData);
        });
    }, [])

    return (
        <Grid container p={2}>
            <Typography variant="h3">Matches</Typography>
            <Grid container>
                {matches.map((match) => {
                    return (
                        <Grid item key={match.id}>
                            <Card sx={{ p: 2, m: 2, textAlign: "center" }}>
                                <div>{new Date(match.date).toLocaleDateString()}</div>
                                <div>{match.type}</div>
                                <div>{match.winners[0].playerDisplayName + ` (${match.winners[0].pointChanges})`} - {match.losers[0].playerDisplayName + ` (${match.losers[0].pointChanges})`}</div>
                                <div>{match.winners[0].playerDeckName} - {match.losers[0].playerDeckName}</div>
                                <div>{match.winnersScore} - {match.losersScore}</div>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
            <WipScreen/>
        </Grid>
    )
}