import { Button, Grid, Tab, Tabs, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useClient } from "../../client/useClient";
import { ImportDeckDialog } from "./import_dialog/ImportDeckDialog";
import { Tables } from "../../database.types";
import { DeckCard } from "../../components/DeckCard";
import { useLocation, useNavigate } from "react-router-dom";
import { WipScreen } from "../../components/WipScreen";
import { DARK_BLUE } from "../../constants/colors";
import { EditProfileDialog } from "./edit_dialog/EditProfileDialog";
import { LS_USER_DATA_KEY } from "../../constants/keys";

interface IProfileResponse {
    profile: Tables<'profile'>;
    decks: Tables<'deck'>[];
}

export const Profile = () => {
    type TABS = "DECKS" | "MATCHES";
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const loc = useLocation();
    const [user, setUser] = useState<Tables<'profile'>>();
    const [decks, setDecks] = useState<Tables<'deck'>[]>([]);
    // TODO: Matches implementation on profile
    // const [matches, setMatches] = useState<Tables<'match'>[]>([]);
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

            // Return
            return { profile: profile[0], decks: decks };
        }
        return undefined;
    }


    useEffect(() => {
        getUserData().then((res) => {
            setUser(res?.profile);
            setDecks(res?.decks ?? []);
        })
    }, [loc.search])

    return (
        <Grid container direction='column' sx={{ alignItems: "center" }}>
            <Grid item container minHeight="30vh" alignItems="end" sx={{ backgroundColor: DARK_BLUE, py: 4, px: 2 }}>
                <Grid item xs={12} md={3} lg={2} display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                    <img width="200" height="200" src={import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user?.id + import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_EXT}
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
                        }}>&#10550;</Button>}
                </Grid>
                <Grid item container xs={12} md={9} lg={10} alignItems="end">
                    <Grid item xs={12} sm={7} >
                        <Typography variant="h2" my={{ xs: 2, sm: 0 }} textAlign={{ xs: "center", sm: "left" }}>{user?.display_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
                        <Tabs value={selectedTab} onChange={(_e, val) => setSelectedTab(val)} aria-label="basic tabs example" textColor="inherit" sx={{ ".MuiTabs-indicator": { backgroundColor: "white" } }}>
                            <Tab label="Decks" value="DECKS" />
                            <Tab label="Matches" value="MATCHES" />
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
                                    <DeckCard deck={deck} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    :
                    <Grid>
                        <Typography>MATCHES</Typography>
                        <WipScreen />
                    </Grid>
                }
            </Grid>
        </Grid >
    )
}