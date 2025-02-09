import { Button, Dialog, Grid, styled, TextField, Typography } from "@mui/material";
import { useEditDeckDialogVM } from "./useEditDeckDialogVM";
import EditIcon from '@mui/icons-material/Edit';
import { DeckCard } from "../../../components/deck-card/DeckCard";
import { MOCKED_DECK } from "../../../constants/mocked-data/mocked_deck";

export const EditDeckDialog = ({ userImage }: { userImage?: string | null }) => {
    const {
        currentTier,
        editDialogOpen,
        setEditDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        gradientStart,
        onGradientStartChange,
        gradientEnd,
        onGradientEndChange,
        textColor,
        onTextColorChange,
        deckImageURL,
        handleUpdateDeck,
        onChangeDeckImage
    } = useEditDeckDialogVM();

    const DeckImageInput = styled('input')({
        clipPath: 'inset(50%)',
        display: 'none'
    });

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                onClick={() => setEditDialogOpen(true)}
                sx={{
                    width: "50px",
                    height: "50px",
                    fontSize: "2em",
                    backgroundColor: "darkgray"
                }}><EditIcon /></Button>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4" my={1}>Deck</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            sx={{ my: 1 }}
                            label="Deck Name"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth sx={{ my: 1 }} label="NEW ydke url (dejar vacio si no la quieres cambiar)" value={ydkeURL} onChange={(e) => setydkeURL(e.target.value)} />
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
                                    tier: currentTier === null ? "N/A" : currentTier.toString(),
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
                    <Grid item container justifyContent="space-between" mt={2}>
                        <Button color="inherit" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleUpdateDeck}>Aplicar</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}