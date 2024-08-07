import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Tables } from "../../database.types"
import { useClient } from "../../client/useClient"
import { DeckCard } from "../../components/DeckCard"
import { useLocation, useNavigate } from "react-router-dom"

export const FilledSearch = () => {
    const { getInstance } = useClient();
    const navigate = useNavigate();
    const loc = useLocation();
    const [foundDecks, setFoundDecks] = useState<Tables<"deck">[]>([]);
    const [foundUsers, setFoundUsers] = useState<Tables<"profile">[]>([]);

    const loadData = async () => {
        const supabase = getInstance();
        const url = new URL(location.href);
        const queryVal = url.searchParams.get("q");
        console.log(queryVal);

        let { data: decksData, error: decksError } = await supabase.from('deck')
            .select()
            .ilike('name', `%${queryVal}%`)
            .limit(5);

        decksError && console.log(decksError);

        let { data: usersData, error: usersError } = await supabase.from('profile')
            .select()
            .or(`display_name.ilike.%${queryVal}%,username.ilike.%${queryVal}%`)
            .limit(5);

        usersError && console.log(usersError);


        console.log(decksData, usersData);

        return { decks: decksData, users: usersData };

    }

    useEffect(() => {
        loadData().then(({ decks, users }) => {
            setFoundDecks(decks);
            setFoundUsers(users);
        });
    }, [loc.pathname])

    return (
        <Grid container direction="column" p={2}>
            <Typography variant="h2" mb={2}>Searched: "{new URL(location.href).searchParams.get("q")}"</Typography>
            <Grid item mb={2}>
                <Typography variant="h3">Decks found: </Typography>
                <Grid container>
                    {foundDecks.map((currentDeck) => (
                        <Grid item key={currentDeck.id} minWidth="250px" m={1}>
                            <DeckCard deck={currentDeck} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h3">Users found: </Typography>
                <Grid container>
                    {foundUsers.map((currentUser) => (
                        <Grid item key={currentUser.id} minWidth="250px">
                            <Card>
                                <CardMedia
                                    sx={{ height: 150, width: "100%" }}
                                    image="/images/default-profile.jpg"
                                    title="user"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {currentUser.display_name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {
                                        navigate("/user/?id=" + currentUser.id)
                                    }}>User profile →</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}