import { Box, Button, Dialog, Divider, Grid, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { PlayerAutocomplete } from "./PlayerAutocomplete";
import { Tables } from "../../../database.types";
import { useClient } from "../../../client/useClient";

interface IPair {
    player: Tables<"profile">,
    deck: Tables<"deck">
}

export const MatchRandomizerDialog = () => {
    const { getInstance } = useClient();
    const [open, setOpen] = useState(false);
    const [tier, setTier] = useState<number>();
    const [players, setPlayers] = useState<Tables<"profile">[]>([]);
    const [pairs, setPairs] = useState<IPair[]>([]);

    const getMatchup = () => {
        if (tier !== undefined) {
            const supabase = getInstance();
            const vals = new Map<Tables<"profile">, Tables<"deck">[]>();
            // Get decks
            Promise.all(
                players.map(async (player) => {
                    const { data: decksData, error: decksError } = await supabase.from('deck').select().eq("tier", tier).eq("owner", player.id);
                    decksError && console.log("ERR PLAYER: ", decksError, "(", player.display_name, ")")
                    vals.set(player, decksData ?? []);
                })
            ).then(() => {
                setPairs(Array.from(vals).map((vals) => {
                    const playerInfo = vals[0];
                    const playerDeckInfo = vals[1];
                    const randPos = Math.floor(Math.random() * (playerDeckInfo.length));
                    return { player: playerInfo, deck: playerDeckInfo[randPos] } as IPair;
                }))
                console.log(pairs);
            })
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
                sx={{
                    width: "50px",
                    height: "50px",
                    fontSize: "2em"
                }}>
                <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" style={{ fill: "white" }} viewBox="0 0 170.879 170.879" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M143.8,136.363l4.277-4.277c0.011-0.011,0.011-0.022,0.026-0.033l7.092-7.098c2.105-2.099,2.105-5.5,0-7.6 c-2.101-2.1-5.495-2.1-7.601,0l-3.324,3.322l-35.154-35.155l11.092-11.09c0.173-0.17,0.342-0.359,0.487-0.56l49.093-64.935 c1.617-2.134,1.418-5.131-0.477-7.034c-1.896-1.903-4.887-2.118-7.029-0.518l-65.25,48.778c-0.205,0.149-0.399,0.323-0.584,0.504 l-11.091,11.09l-11.09-11.09c-0.17-0.17-0.359-0.339-0.559-0.488L8.773,1.086C6.645-0.526,3.642-0.326,1.74,1.566 c-1.903,1.892-2.124,4.884-0.517,7.028L50,73.848c0.15,0.205,0.321,0.405,0.505,0.58l11.094,11.089l-35.161,35.161l-3.325-3.329 c-2.102-2.099-5.501-2.099-7.601,0c-2.103,2.101-2.103,5.503,0,7.604l7.126,7.127l4.273,4.273L1.577,161.701 c-2.103,2.101-2.103,5.503,0,7.602c1.049,1.051,2.424,1.576,3.8,1.576c1.376,0,2.754-0.525,3.801-1.576l25.344-25.344l4.276,4.277 l7.126,7.124c1.05,1.046,2.425,1.575,3.8,1.575c1.375,0,2.754-0.529,3.801-1.575c2.102-2.104,2.102-5.506,0-7.602l-3.328-3.322 l35.161-35.156l35.161,35.156l-3.324,3.322c-2.104,2.101-2.104,5.497,0,7.602c1.045,1.046,2.421,1.575,3.802,1.575 c1.374,0,2.751-0.529,3.795-1.575l7.112-7.113c0.006-0.005,0.011-0.005,0.016-0.011l4.279-4.271l25.344,25.338 c1.045,1.051,2.421,1.576,3.8,1.576c1.376,0,2.752-0.525,3.797-1.576c2.104-2.099,2.104-5.501,0-7.602L143.8,136.363z"></path> </g> </g></svg>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { padding: 4 } }} fullWidth maxWidth="lg">
                <Box py={1}>
                    <Grid container my={1} justifyContent="space-between">
                        <Typography variant="h4">Crear matchup</Typography>
                        <div onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </div>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Grid container alignItems="center">
                        <Grid container my={2}>
                            <TextField label="Tier" type="number" onChange={(e) => {
                                const val = Number.parseInt(e.target.value);
                                setTier(isNaN(val) ? 0 : val)
                            }} />
                        </Grid>
                        <Grid container my={2}>
                            <PlayerAutocomplete setCurrentPlayers={setPlayers} />
                        </Grid>
                    </Grid>
                    <Grid container>
                        {pairs.map((pair) => <Grid container key={pair.player.id} sx={{ color: pair.deck ? "green" : "red" }}>{pair.player?.display_name} / {pair.deck?.name ?? "X"}</Grid>)}
                    </Grid>
                    <Button onClick={getMatchup}>Get</Button>
                </Box>
            </Dialog>
        </>
    )
}