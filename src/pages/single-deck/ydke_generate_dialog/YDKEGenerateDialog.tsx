import { Button, Dialog, Grid, IconButton, Link, TextField, Typography } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from "react";
import { useClient } from "../../../client/useClient";
import { Tables } from "../../../database.types";
import { toURL } from "../../../utils/ydke";

interface IYDKEData {
    ydkeURL: string;
    ygopdShareURL: string;
}

export const YDKEGenerateDialog = () => {
    const { getInstance } = useClient();
    const [open, setOpen] = useState(false);
    const [deckId, setDeckId] = useState<string>();
    const [currentData, setCurrentData] = useState<IYDKEData>();

    const loadDefaultValues = async () => {
        const currentDeckId = new URL(location.href).searchParams.get('id')
        if (currentDeckId) {
            setDeckId(currentDeckId);
        }
    }

    const getDeckCards = async (): Promise<Tables<'card_in_deck'>[]> => {
        const supabase = getInstance();

        // Links search by deck id
        const { data: linksData, error: linksError } = await supabase.from('card_in_deck').select().eq("deck_id", deckId);
        linksError && console.error(linksError);

        return linksData;
    }

    const handleGetYDKE = () => {
        getDeckCards().then((linkCards) => {
            const mainCards = linkCards.filter((c) => c.position == "MAIN");
            const extraCards = linkCards.filter((c) => c.position == "EXTRA");
            const sideCards = linkCards.filter((c) => c.position == "SIDE");

            const countedMainCads: number[] = [];
            const countedExtraCads: number[] = [];
            const countedSideCads: number[] = [];

            mainCards.forEach((card) => {
                for (let i = 0; i < card.quantity; i++)
                    countedMainCads.push(card.card_id);
            })

            extraCards.forEach((card) => {
                for (let i = 0; i < card.quantity; i++)
                    countedExtraCads.push(card.card_id);
            })

            sideCards.forEach((card) => {
                for (let i = 0; i < card.quantity; i++)
                    countedSideCads.push(card.card_id);
            })

            const newYDKEURL = toURL({
                main: new Uint32Array([...countedMainCads]),
                extra: new Uint32Array([...countedExtraCads]),
                side: new Uint32Array([...countedSideCads]),
            });

            const newYGOPDShareURL = "https://ygoprodeck.com/deckbuilder/?y=" + encodeURIComponent(newYDKEURL.substring(7, newYDKEURL.length));
            setCurrentData({
                ydkeURL: newYDKEURL,
                ygopdShareURL: newYGOPDShareURL
            })
        })
    }

    useEffect(() => { loadDefaultValues(); }, []);
    useEffect(() => {
        if (open && !currentData) handleGetYDKE();
    }, [open]);

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                onClick={() => setOpen(true)}
                sx={{
                    width: "50px",
                    height: "50px",
                    fontSize: "2em",
                    backgroundColor: "green"
                }}><FileDownloadIcon /></Button>
            <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Grid container direction="column">
                    <Grid item>
                        <Typography variant="h4" my={1}>Exportar Deck</Typography>
                    </Grid>
                    <Grid item container justifyContent="space-between" mt={2}>
                        <TextField value={currentData?.ydkeURL ?? "Loading..."} disabled />
                        <IconButton onClick={() => navigator.clipboard.writeText(currentData?.ydkeURL ?? "")}><ContentCopyIcon /></IconButton>
                    </Grid>
                    <Grid item container justifyContent="space-between" mt={2}>
                        <Link variant="h6" my={1} href={currentData?.ygopdShareURL} target="_blank" rel="noopener">
                            <Button color="success" variant="contained">Ver en YuGiOhProDeck</Button>
                        </Link>
                        <IconButton onClick={() => navigator.clipboard.writeText(currentData?.ygopdShareURL ?? "")}><ContentCopyIcon /></IconButton>
                    </Grid>
                    <Grid container justifyContent="flex-end" mt={6}>
                        <Button color="inherit" onClick={() => setOpen(false)}>Cerrar</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}