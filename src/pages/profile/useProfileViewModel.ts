import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import { Tables } from "../../database.types";
import { IMatch } from "../matches/data-load/match_data_interfaces";
import { useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { LS_USER_DATA_KEY } from "../../constants/keys";
import { buildMatchData, fetchMatchDataByUser } from "../matches/data-load/match_data_loaders";

interface IProfileResponse {
    profile: Tables<'profile'>;
    decks: Tables<'deck'>[];
    matches: IMatch[]
}

export const useProfileViewModel = () => {
    type TABS = "DECKS" | "DUELS";
    const { getInstance } = useClient();
    const loc = useLocation();
    const [user, setUser] = useState<Tables<'profile'>>();
    const [decks, setDecks] = useState<Tables<'deck'>[]>([]);
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [selectedTab, setSelectedTab] = useState<TABS>("DECKS");
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.up("sm"))

    const getUserData = async (): Promise<IProfileResponse | undefined> => {

        const supastorage = localStorage.getItem(LS_USER_DATA_KEY);
        if (supastorage) {
            const supabase = getInstance();
            const url = new URL(location.href);
            setIsCurrentUser(JSON.parse(supastorage).user.id === url.searchParams.get("id"));

            // Get user
            const { data: profile, error } = await supabase.from('profile').select().eq('id', url.searchParams.get("id"));
            error && console.log(error, profile);

            // Get decks
            const { data: decks, error: deckError } = await supabase.from('deck').select().eq('owner', profile[0].id);
            deckError && console.log(decks, deckError);

            // Get matches
            const { matchesObj, matchesDataObj } = await fetchMatchDataByUser(supabase, profile[0].id);
            matchesObj.error && console.log(matchesObj.error);
            matchesDataObj.error && console.log(matchesDataObj.error);
            const matchesData = await buildMatchData(supabase, { matchesObj, matchesDataObj }, decks, profile);

            // Return
            return { profile: profile[0], decks: decks, matches: matchesData };
        }
        return undefined;
    }

    const getProfileFontSize = () => {
        const breakingPoint = 10;
        if (user?.display_name && user.display_name.length > breakingPoint) {
            const nameLen = user.display_name.length
            const res = 3.75 - (0.25 * ((nameLen - breakingPoint) / 2));

            return `${res}rem`
        }
        return undefined;
    }

    useEffect(() => {
        getUserData().then((res) => {
            setUser(res?.profile);
            setDecks(res?.decks ?? []);
            setMatches(res?.matches ?? [])
        })
    }, [loc.search])

    return {
        user,
        decks,
        matches,
        selectedTab,
        setSelectedTab,
        isCurrentUser,
        matchesSM,
        getProfileFontSize
    }
}