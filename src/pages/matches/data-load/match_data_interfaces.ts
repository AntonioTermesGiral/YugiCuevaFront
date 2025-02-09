import { Enums, Tables } from "../../../database.types"

export const DEF_RAW_MATCH = { data: [], error: null };

export interface IPlayerData {
    playerId: string | null,
    playerDisplayName: string | null,
    playerDeckId: string | null,
    playerDeckName: string | null,
    pointChanges: string,
    deckImage: string
}

export interface IMatch {
    id: string,
    date: string,
    type: Enums<'MatchType'> | null,
    sideDeck: boolean,
    winners: IPlayerData[],
    losers: IPlayerData[],
    winnersScore: number,
    losersScore: number
}

export interface IRawMatchesData {
    matchesObj: { data: Tables<'match'>[], error: unknown };
    matchesDataObj: { data: Tables<'match_data'>[], error: unknown };
}

export interface IIDToSearch { match_id: string }[]