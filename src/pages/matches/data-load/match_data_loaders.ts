import { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "../../../database.types";
import { DEF_RAW_MATCH, IMatch, IPlayerData, IRawMatchesData } from "./match_data_interfaces";

export const fetchMatchData = async (supabase: SupabaseClient): Promise<IRawMatchesData> => {
    let matchesObj = DEF_RAW_MATCH;
    let matchesDataObj = DEF_RAW_MATCH;

    // LASTEST MATCHES
    matchesObj = await supabase.from('match').select().limit(10).order('date', { ascending: false });
    matchesDataObj = await supabase.from('match_data').select();

    return { matchesObj, matchesDataObj }
}

export const fetchMatchDataByDeck = async (supabase: SupabaseClient, deckId: string): Promise<IRawMatchesData> => {
    let matchesObj = DEF_RAW_MATCH;
    let matchesDataObj = DEF_RAW_MATCH;

    // MATCHES BY DECK
    const { data: searchIds, error: searchIdsError } = await supabase.from('match_data').select('match_id').eq('deck', deckId);
    searchIdsError && console.log(searchIdsError);

    const ids_to_search: { match_id: string }[] = searchIds;
    const idsToSearch = ids_to_search.map((sid) => sid.match_id);

    matchesObj = await supabase.from('match').select().in('id', idsToSearch).order('date', { ascending: false });
    matchesDataObj = await supabase.from('match_data').select().in('match_id', idsToSearch);

    return { matchesObj, matchesDataObj }
}

export const fetchMatchDataByUser = async (supabase: SupabaseClient, userId: string): Promise<IRawMatchesData> => {
    let matchesObj = DEF_RAW_MATCH;
    let matchesDataObj = DEF_RAW_MATCH;

    // MATCHES BY USER
    const { data: searchIds, error: searchIdsError } = await supabase.from('match_data').select('match_id').eq('player', userId);
    searchIdsError && console.log(searchIdsError);

    const ids_to_search: { match_id: string }[] = searchIds;
    const idsToSearch = ids_to_search.map((sid) => sid.match_id);

    matchesObj = await supabase.from('match').select().in('id', idsToSearch).order('date', { ascending: false });
    matchesDataObj = await supabase.from('match_data').select().in('match_id', idsToSearch);

    return { matchesObj, matchesDataObj }
}

export const buildMatchData = async (supabase: SupabaseClient, rawData: IRawMatchesData): Promise<IMatch[]> => {
    // Decks search
    const decksIds = [...(new Set((rawData.matchesDataObj.data as Tables<'match_data'>[]).map((mdo) => mdo.deck)))];

    const { data: matchesDecksData, error: matchesDecksError } = await supabase.from('deck').select().in('id', decksIds);
    matchesDecksError && console.log(matchesDecksError);

    const matchesDecks = new Map<string, string>();
    (matchesDecksData as Tables<'deck'>[]).forEach((d) => {
        matchesDecks.set(d.id, d.name);
    });

    // Players search
    const playersIds = [...(new Set((rawData.matchesDataObj.data as Tables<'match_data'>[]).map((mdo) => mdo.player)))];

    const { data: matchesPlayersData, error: matchesPlayersError } = await supabase.from('profile').select().in('id', playersIds);
    matchesPlayersError && console.log(matchesPlayersError);

    const matchesPlayers = new Map<string, string>();
    (matchesPlayersData as Tables<'profile'>[]).forEach((d) => {
        matchesPlayers.set(d.id, d.display_name);
    });

    // Builds the results
    const matchesRes: IMatch[] = [];

    (rawData.matchesObj.data as Tables<'match'>[]).forEach((match) => {

        const currentMatchData = (rawData.matchesDataObj.data as Tables<'match_data'>[])
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
                pointChanges: cmd.deck_point_changes ?? "0",
                deckImage: import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + cmd.deck + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT// + "?ver=" + new Date().getTime()
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
