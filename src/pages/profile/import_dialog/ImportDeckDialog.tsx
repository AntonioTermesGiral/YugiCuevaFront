import { Button, Dialog, Typography, TextField, Grid, styled } from "@mui/material"
import { useImportDeckDialogVM } from "./useImportDeckDialogVM"
import { maxTier } from "../../../constants/tiers";

export const ImportDeckDialog = () => {
    const {
        importDialogOpen,
        setImportDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        deckTier,
        setDeckTier,
        handleUploadDeck,
        onChangeDeckImage
    } = useImportDeckDialogVM();

    const DeckImageInput = styled('input')({
        clipPath: 'inset(50%)',
        display: 'none'
    });

    return (
        <>
            <Button variant="contained" onClick={() => setImportDialogOpen(true)} sx={{ fontSize: 35, height: 40, width: 40 }}>+</Button>
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4" my={1}>Import deck</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth sx={{ my: 1 }} label="deck name" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth sx={{ my: 1 }} label="ydke url" value={ydkeURL} onChange={(e) => setydkeURL(e.target.value)} />
                    </Grid>
                    <Grid item container justifyContent="space-between">
                        <Grid item xs={12}>
                            <TextField fullWidth sx={{ my: 1 }} label="deck tier" type="number" value={deckTier} onChange={(e) => {
                                let numericVal = Number.parseInt(e.target.value);
                                if (numericVal > maxTier) numericVal = maxTier;
                                setDeckTier(numericVal);
                            }} />
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent="space-between">
                        <Grid item xs={12} sm={5.5}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                endIcon="↑"
                                sx={{ my: 1 }}
                            >
                                Upload Deck Image
                                <DeckImageInput
                                    type="file"
                                    accept="image/*"
                                    onChange={onChangeDeckImage}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={5.5}>
                            <img
                                id="deck-image-preview"
                                width="225"
                                height="175"
                                style={{
                                    backgroundImage: 'url("/images/card-question.png")',
                                    backgroundSize: "cover",
                                    objectFit: "cover"
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleUploadDeck}>Create</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}