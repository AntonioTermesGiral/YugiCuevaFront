import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Tables } from "../../database.types"
import { useClient } from "../../client/useClient"
import { DeckCard } from "../../components/DeckCard"
import { useLocation } from "react-router-dom"
import { UserCard } from "../../components/UserCard"

export const FilledSearch = () => {
    const { getInstance } = useClient();
    const loc = useLocation();
    const [foundDecks, setFoundDecks] = useState<Tables<"deck">[]>([]);
    const [foundUsers, setFoundUsers] = useState<Tables<"profile">[]>([]);

    const loadData = async () => {
        const supabase = getInstance();
        const url = new URL(location.href);
        const queryVal = url.searchParams.get("q");
        console.log(queryVal);

        const { data: decksData, error: decksError } = await supabase.from('deck')
            .select()
            .ilike('name', `%${queryVal}%`)
            .limit(5);

        decksError && console.log(decksError);

        const { data: usersData, error: usersError } = await supabase.from('profile')
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
                        <Grid item m={1} key={currentUser.id} minWidth="250px">
                            <UserCard user={currentUser}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}