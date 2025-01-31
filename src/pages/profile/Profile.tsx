import { Button, Grid, Tab, Tabs, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useClient } from "../../client/useClient";
import { ImportDeckDialog } from "./import_dialog/ImportDeckDialog";
import { Tables } from "../../database.types";
import { DeckCard } from "../../components/DeckCard";
import { useLocation, useNavigate } from "react-router-dom";
import { DARK_BLUE } from "../../constants/colors";
import { EditProfileDialog } from "./edit_dialog/EditProfileDialog";
import { LS_USER_DATA_KEY } from "../../constants/keys";
import LogoutIcon from '@mui/icons-material/Logout';
import { buildMatchData, fetchMatchDataByUser } from "../matches/data-load/match_data_loaders";
import { IMatch } from "../matches/data-load/match_data_interfaces";
import { MatchCard } from "../matches/MatchCard";

interface IProfileResponse {
    profile: Tables<'profile'>;
    decks: Tables<'deck'>[];
    matches: IMatch[]
}

export const Profile = () => {
    type TABS = "DECKS" | "DUELS";
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const loc = useLocation();
    const [user, setUser] = useState<Tables<'profile'>>();
    const [decks, setDecks] = useState<Tables<'deck'>[]>([]);
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [selectedTab, setSelectedTab] = useState<TABS>("DECKS");
    const [isCurrentUser, setIsCurrentUser] = useState(false);


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
            const matchesData = await buildMatchData(supabase, { matchesObj, matchesDataObj });

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

    return (
        <Grid container direction='column' sx={{ alignItems: "center" }}>
            <Grid item container minHeight="30vh" alignItems="end" sx={{ backgroundColor: DARK_BLUE, py: 4, px: 2 }}>
                <Grid item xs={12} md={3} lg={2} display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                    <img width="200" height="200" src={import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user?.id + import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_EXT + "?ver=" + new Date().getTime()}
                        style={{
                            backgroundImage: 'url("/images/default-profile.jpg")',
                            backgroundSize: "cover",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "solid 5px black"
                        }}
                    />
                    {isCurrentUser && <EditProfileDialog />}
                    {isCurrentUser && <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            localStorage.clear();
                            navigate('/');
                        }}
                        sx={{
                            width: "50px",
                            height: "50px",
                            position: "absolute",
                            left: { "xs": "25%", "sm": "auto" },
                            marginTop: "150px",
                            fontSize: "2em",
                            backgroundColor: "darkred",
                            minWidth: "auto",
                            paddingBottom: "0px"
                        }}><LogoutIcon /></Button>}
                </Grid>
                <Grid item container xs={12} md={9} lg={10} alignItems="end">
                    <Grid item xs={12} sm={7} >
                        <Typography variant="h2" my={{ xs: 2, sm: 0 }} textAlign={{ xs: "center", sm: "left" }} fontSize={getProfileFontSize()}>{user?.display_name}</Typography>
                        {user?.master_duel_ref &&
                            <Typography variant="subtitle1" my={{ xs: 2, sm: 0 }} textAlign={{ xs: "center", sm: "left" }}>Master Duel ID: <b>{user.master_duel_ref}</b></Typography>
                        }
                    </Grid>
                    <Grid item xs={12} sm={5} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
                        <Tabs value={selectedTab} onChange={(_e, val) => setSelectedTab(val)} aria-label="basic tabs example" textColor="inherit" sx={{ ".MuiTabs-indicator": { backgroundColor: "white" } }}>
                            <Tab label="Decks" value="DECKS" />
                            <Tab label="Duels" value="DUELS" />
                        </Tabs>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container px={2} pt={2}>
                {selectedTab == "DECKS" ?
                    <Grid container>
                        {isCurrentUser && <ImportDeckDialog />}
                        <Grid container mt={2} spacing={4}>
                            {decks.map((deck) => (
                                <Grid display="flex" justifyContent="center" key={deck.id} item xs={12} sm={4} md={3} lg={2} mb={2}>
                                    <DeckCard deck={deck} hideOwnerInfo />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    :
                    <Grid container>
                        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
                    </Grid>
                }
            </Grid>
        </Grid >
    )
}