import { Button, Dialog, Typography, TextField, Grid, styled } from "@mui/material"
import { useImportDeckDialogVM } from "./useImportDeckDialogVM"
import { maxTier } from "../../../constants/tiers";
import { DeckCard } from "../../../components/deck-card/DeckCard";
import { MOCKED_DECK } from "../../../constants/mocked-data/mocked_deck";

export const ImportDeckDialog = ({ userImage }: { userImage?: string | null }) => {
    const {
        importDialogOpen,
        setImportDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        deckTier,
        setDeckTier,
        gradientStart,
        onGradientStartChange,
        gradientEnd,
        onGradientEndChange,
        textColor,
        onTextColorChange,
        deckImageURL,
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
                        <Grid item xs={12} sm={5}>
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
                            <TextField fullWidth sx={{ my: 1 }} label="Gradient End" value={gradientEnd} onChange={(e) => onGradientEndChange(e.target.value)} type="color" />
                            <TextField fullWidth sx={{ my: 1 }} label="Gradient Start" value={gradientStart} onChange={(e) => onGradientStartChange(e.target.value)} type="color" />
                            <TextField fullWidth sx={{ my: 1 }} label="Text Color" value={textColor} onChange={(e) => onTextColorChange(e.target.value)} type="color" />
                        </Grid>
                        <Grid item xs={12} sm={6.5}>
                            <DeckCard
                                deck={MOCKED_DECK}
                                users={[]}
                                previewParams={{
                                    name: deckName.trim() !== "" ? deckName : "Dummy Text",
                                    tier: (deckTier === undefined || isNaN(deckTier)) ? "N/A" : deckTier.toString(),
                                    points: "0",
                                    startColor: gradientStart,
                                    endColor: gradientEnd,
                                    textColor: textColor,
                                    deckImage: deckImageURL ?? "/images/card-question.png",
                                    ownerImage: userImage ?? "/images/default-profile.jpg"
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