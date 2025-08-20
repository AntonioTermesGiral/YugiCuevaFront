import { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "../../../database.types";
import { DEF_RAW_MATCH, IIDToSearch, IMatch, IPlayerData, IRawMatchesData } from "./match_data_interfaces";

export const fetchMatchData = async (supabase: SupabaseClient): Promise<IRawMatchesData> => {
    let matchesObj = DEF_RAW_MATCH;
    let matchesDataObj = DEF_RAW_MATCH;

    // LASTEST MATCHES
    matchesObj = await supabase.from('match').select().order('date', { ascending: false });
    matchesDataObj = await supabase.from('match_data').select();
    return { matchesObj, matchesDataObj }
}

export const fetchMatchDataByDeck = async (supabase: SupabaseClient, deckId: string): Promise<IRawMatchesData> => {
    let matchesObj = DEF_RAW_MATCH;
    let matchesDataObj = DEF_RAW_MATCH;

    // MATCHES BY DECK
    const { data: searchIds, error: searchIdsError } = await supabase.from('match_data').select('match_id').eq('deck', deckId);
    searchIdsError && console.log(searchIdsError);

    const idsToSearch = (searchIds as IIDToSearch[]).map((sid) => sid.match_id);
    if (idsToSearch.length > 0) {
        matchesObj = await supabase.from('match').select().in('id', idsToSearch).order('date', { ascending: false });
        matchesDataObj = await supabase.from('match_data').select().in('match_id', idsToSearch);
    }

    return { matchesObj, matchesDataObj }
}

export const fetchMatchDataByUser = async (supabase: SupabaseClient, userId: string): Promise<IRawMatchesData> => {
    let matchesObj = DEF_RAW_MATCH;
    let matchesDataObj = DEF_RAW_MATCH;

    // MATCHES BY USER
    const { data: searchIds, error: searchIdsError } = await supabase.from('match_data').select('match_id').eq('player', userId);
    searchIdsError && console.log(searchIdsError);

    const idsToSearch = (searchIds as IIDToSearch[]).map((sid) => sid.match_id);
    if (idsToSearch.length > 0) {
        matchesObj = await supabase.from('match').select().in('id', idsToSearch).order('date', { ascending: false });
        matchesDataObj = await supabase.from('match_data').select().in('match_id', idsToSearch);
    }

    return { matchesObj, matchesDataObj }
}

export const buildMatchData = async (
    supabase: SupabaseClient,
    rawData: IRawMatchesData,
    loadedDecks: Tables<"deck">[] = [],
    loadedOwners: Tables<"profile">[] = []
): Promise<IMatch[]> => {
    // Decks search
    const decksIds = rawData.matchesDataObj.data.filter((mdo) => loadedDecks.find((ld) => ld.id === mdo.deck) === undefined);
    let decks: Tables<"deck">[] = [...loadedDecks];
    if (decksIds.length > 0) {
        const decksIdsToSearch = [...(new Set(decksIds.map((mdo) => mdo.deck)))]
        const { data: matchesDecksData, error: matchesDecksError } = await supabase.from('deck').select().in('id', decksIdsToSearch);
        matchesDecksError && console.log(matchesDecksError);
        decks = [...decks, ...matchesDecksData]
    }

    // Players search
    const playersIds = rawData.matchesDataObj.data.filter((mdo) => loadedOwners.find((ld) => ld.id === mdo.player) === undefined);
    let owners: Tables<"profile">[] = [...loadedOwners];
    if (playersIds.length > 0) {
        const playerIdsToSearch = [...(new Set(playersIds.map((mdo) => mdo.player)))]
        const { data: matchesPlayersData, error: matchesPlayersError } = await supabase.from('profile').select().in('id', playerIdsToSearch);
        matchesPlayersError && console.log(matchesPlayersError);
        owners = [...owners, ...matchesPlayersData]
    }

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
            const currentPlayerDeck = decks.find((d) => d.id === cmd.deck)
            const currentPlayerOwner = owners.find((p) => p.id === cmd.player)

            const currentPlayer: IPlayerData = {
                playerDeckId: cmd.deck,
                playerDeckName: currentPlayerDeck?.name ?? null,
                playerId: cmd.player,
                playerDisplayName: currentPlayerOwner?.display_name ?? null,
                pointChanges: cmd.deck_point_changes ?? "0",
                deckImage: import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + currentPlayerDeck?.image
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
