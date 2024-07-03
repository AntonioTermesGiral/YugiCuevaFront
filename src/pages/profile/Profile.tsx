import { Button, Card, CardActions, CardContent, CardMedia, Grid, Tab, Tabs, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useClient } from "../../client/useClient";
import { ImportDeckDialog } from "./import_dialog/ImportDeckDialog";
import { Tables } from "../../database.types";
import { useNavigate } from "react-router-dom";

interface IProfileResponse {
    profile: Tables<'profile'>;
    decks: Tables<'deck'>[];
}

export const Profile = () => {

    type TABS = "DECKS" | "MATCHES";
    const { getInstance } = useClient();
    const navigate = useNavigate();
    const [user, setUser] = useState<Tables<'profile'>>();
    const [decks, setDecks] = useState<Tables<'deck'>[]>([]);
    const [matches, setMatches] = useState<Tables<'match'>[]>([]);
    const [selectedTab, setSelectedTab] = useState<TABS>("DECKS");


    const getUserData = async (): Promise<IProfileResponse | undefined> => {

        const supastorage = localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token');
        if (supastorage) {
            const supabase = getInstance();
            // Get user
            let { data: profile, error } = await supabase.from('profile').select().eq('id', JSON.parse(supastorage).user.id);
            console.log(error, profile);

            // Get decks
            let { data: decks, error: deckError } = await supabase.from('deck').select().eq('owner', profile[0].id);
            console.log(decks, deckError);

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
    }, [])

    return (
        <Grid container direction='column' sx={{ alignItems: "center" }}>
            <Grid item container minHeight="30vh" alignItems="end" sx={{ backgroundColor: "lightgray", py: 4, px: 2 }}>
                <Grid item xs={12} md={3} lg={2} display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                    {/* TODO: Get image from bucket */}
                    <img width="200" height="200" src="./images/default-profile.jpg" style={{ objectFit: "cover", borderRadius: "50%", border: "solid 5px black" }} />
                </Grid>
                <Grid item container xs={12} md={9} lg={10} alignItems="end">
                    <Grid item xs={12} sm={7} >
                        <Typography variant="h2" my={{ xs: 2, sm: 0 }} textAlign={{ xs: "center", sm: "left" }}>{user?.display_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5} display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
                        <Tabs value={selectedTab} onChange={(e, val) => setSelectedTab(val)} aria-label="basic tabs example" textColor="secondary" indicatorColor="secondary">
                            <Tab label="Decks" value="DECKS" />
                            <Tab label="Matches" value="MATCHES" />
                        </Tabs>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container px={2} pt={2}>
                {selectedTab == "DECKS" ?
                    <Grid container>
                        <ImportDeckDialog />
                        <Grid container mt={2} spacing={4}>
                            {decks.map((deck) => (
                                <Grid display="flex" justifyContent="center" key={deck.id} item xs={12} sm={4} md={3} lg={2} mb={2}>
                                    <Card key={deck.id} sx={{ maxWidth: 250, width: "100%" }}>
                                        <CardMedia
                                            sx={{ height: 150, width: "100%" }}
                                            image="/images/card-question.png"
                                            title="green iguana"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {deck.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Deck Stats (Tierlist)
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                (Tier)
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                (Points)
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => {
                                                navigate("/deck/?id=" + deck.id)
                                            }}>Deck details →</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    : <Typography>MATCHES</Typography>
                }
            </Grid>
        </Grid >
    )
}