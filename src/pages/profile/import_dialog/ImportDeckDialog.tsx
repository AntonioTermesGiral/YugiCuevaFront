import { Button, Dialog, Typography, TextField, Select, MenuItem, Grid, InputLabel, FormControl } from "@mui/material"
import { useImportDeckDialogVM } from "./useImportDeckDialogVM"
import { maxTier, TIERLIST_VALUES } from "../../../constants/tiers";
import { Enums } from "../../../database.types";

export const ImportDeckDialog = () => {

    const {
        importDialogOpen,
        setImportDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        deckTierlist,
        setDeckTierlist,
        deckTier,
        setDeckTier,
        handleUploadDeck
    } = useImportDeckDialogVM();

    return (
        <>
            <Button onClick={() => setImportDialogOpen(true)}>Importar Deck</Button>
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography my={1}>Import deck</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth sx={{ my: 1 }} label="deck name" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth sx={{ my: 1 }} label="ydke url" value={ydkeURL} onChange={(e) => setydkeURL(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="ygo-deck-tierlist-label">deck tierlist</InputLabel>
                            <Select sx={{ my: 1 }} label="deck tierlist" value={deckTierlist} labelId="ygo-deck-tierlist-label" onChange={(e) => setDeckTierlist(e.target.value as Enums<"Tierlist"> | undefined)}>
                                <MenuItem value={undefined}>Sin seleccionar...</MenuItem>
                                {TIERLIST_VALUES.map(tl => <MenuItem key={tl} value={tl}>{tl}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth sx={{ my: 1 }} label="deck tier" type="number" value={deckTier} onChange={(e) => {
                            let numericVal = Number.parseInt(e.target.value);
                            if (numericVal > maxTier) numericVal = maxTier;
                            setDeckTier(numericVal);
                        }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleUploadDeck}>Yes</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}