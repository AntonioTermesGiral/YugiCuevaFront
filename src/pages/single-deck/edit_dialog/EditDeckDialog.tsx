import { Button, Dialog, Grid, styled, TextField, Typography } from "@mui/material";
import { useEditDeckDialogVM } from "./useEditDeckDialogVM";

export const EditDeckDialog = () => {
    const {
        editDialogOpen,
        setEditDialogOpen,
        deckName,
        setDeckName,
        handleUpdateDeck,
        onChangeDeckImage,
        originalDeckPictureUrl
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
                }}>&#9998;</Button>
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
                                width="200"
                                height="150"
                                src={originalDeckPictureUrl}
                                style={{
                                    backgroundImage: 'url("/images/card-question.png")',
                                    backgroundSize: "cover",
                                    objectFit: "cover",
                                    border: "1px solid black"
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleUpdateDeck}>Apply</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}