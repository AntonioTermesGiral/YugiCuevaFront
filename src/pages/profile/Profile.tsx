import { Button, Grid, Tab, Tabs, Typography } from "@mui/material"
import { ImportDeckDialog } from "./import_dialog/ImportDeckDialog";
import { useNavigate } from "react-router-dom";
import { DARK_BLUE } from "../../constants/colors";
import { EditProfileDialog } from "./edit_dialog/EditProfileDialog";
import LogoutIcon from '@mui/icons-material/Logout';
import { MatchCard } from "../matches/MatchCard";
import { DeckCard } from "../../components/deck-card/DeckCard";
import { useProfileViewModel } from "./useProfileViewModel";

export const Profile = () => {
    const navigate = useNavigate();
    const {
        user,
        decks,
        matches,
        selectedTab,
        setSelectedTab,
        isCurrentUser,
        matchesSM,
        getProfileFontSize
    } = useProfileViewModel();

    return (
        <Grid container direction='column' sx={{ alignItems: "center" }}>
            <Grid item container minHeight="30vh" alignItems="end" sx={{ backgroundColor: DARK_BLUE, py: 4, px: 2 }}>
                <Grid item xs={12} md={3} lg={2} display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                    <img width="200" height="200" src={import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user?.image}
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
                        {isCurrentUser && <ImportDeckDialog userImage={import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + user?.image} />}
                        <Grid container gap={1.5} justifyContent={matchesSM ? "flex-start" : "center"}>
                            {decks.map((deck) => <DeckCard deck={deck} users={user ? [user] : []} key={deck.id} />)}
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