import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Tables } from "../../database.types"
import { useClient } from "../../client/useClient"
import { useLocation } from "react-router-dom"
import { UserCard } from "../../components/UserCard"
import { DeckCard } from "../../components/deck-card/DeckCard"

export const FilledSearch = () => {
    const { getInstance } = useClient();
    const loc = useLocation();
    const [foundDecks, setFoundDecks] = useState<Tables<"deck">[]>([]);
    const [foundUsers, setFoundUsers] = useState<Tables<"profile">[]>([]);
    const [deckOwners, setDeckOwners] = useState<Tables<"profile">[]>([]);

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

        let ownersData = [];
        if (decksData.length > 0) {
            const { data: deckOwnersData, error: deckOwnersError } = await supabase.from('profile')
                .select()
                .in('id', (decksData as Tables<"deck">[]).map((d) => d.owner))

            deckOwnersError && console.log(deckOwnersError);
            ownersData = deckOwnersData;
        }

        console.log(decksData, usersData);

        return { decks: decksData, users: usersData, owners: ownersData };

    }

    useEffect(() => {
        loadData().then(({ decks, users, owners }) => {
            setFoundDecks(decks);
            setFoundUsers(users);
            setDeckOwners(owners)
        });
    }, [loc.search])

    return (
        <Grid container direction="column" p={2}>
            <Typography variant="h2" mb={2}>Searched: "{new URL(location.href).searchParams.get("q")}"</Typography>
            <Grid item mb={2}>
                <Typography variant="h3">Decks found: </Typography>
                <Grid container>
                    {foundDecks.map((currentDeck) => (
                        <Grid item key={currentDeck.id} minWidth="250px" m={1}>
                            <DeckCard deck={currentDeck} users={deckOwners} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h3">Users found: </Typography>
                <Grid container>
                    {foundUsers.map((currentUser) => (
                        <UserCard user={currentUser} key={currentUser.id} />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}