import { Box, Button, Checkbox, Dialog, Divider, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DeckAutocomplete } from "./DeckAutocomplete";
import { useCreatematchDialogViewModel } from "./useCreateMatchDialogViewModel";
import CloseIcon from '@mui/icons-material/Close';

interface ISelectedItemImage {
    image?: string | null,
    type: "deck" | "player"
}
const SelectedItemImage = ({ image, type }: ISelectedItemImage) => {
    if (image === undefined || image === null) return null;

    let url = import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + image;
    if (type === "player")
        url = import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + image;

    return (
        <img
            height="50px"
            width="50px"
            style={{ marginLeft: 5 }}
            src={url}
        />
    )
}

export const CreateMatchDialog = ({ refreshData }: { refreshData: () => void }) => {

    const {
        open,
        setOpen,
        sideDeck,
        deck1,
        setDeck1,
        setWinNumber1,
        deck2,
        setDeck2,
        setWinNumber2,
        handleChangeSideDeck,
        handleSubmit
    } = useCreatematchDialogViewModel(refreshData);

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.up('md'))
    const matchesSM = useMediaQuery(theme.breakpoints.up('sm'))

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
                }}>+</Button>
            <Dialog fullScreen={!matchesSM} open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { padding: 4 } }} fullWidth maxWidth="lg">
                <Box py={1}>
                    <Grid container my={1} justifyContent="space-between">
                        <Typography variant="h4">Registrar Duelo</Typography>
                        <div onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </div>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Grid container alignItems="center">
                        <Typography>
                            Side Deck?
                        </Typography>
                        <Checkbox checked={sideDeck} onChange={handleChangeSideDeck} />
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Grid container direction={{ xs: "column", md: "row" }} justifyContent="space-around">
                        <Grid item xs={5} my={2}>
                            <Typography variant="h5" mb={1}>
                                Player 1
                            </Typography>
                            <Grid container my={1} alignItems="center">
                                <DeckAutocomplete currentDeck={deck1} setCurrentDeck={setDeck1} />
                                <SelectedItemImage image={deck1?.image} type="deck" />
                            </Grid>
                            <Grid my={1}>
                                <Typography>
                                    Wins:
                                </Typography>
                                <TextField fullWidth type="number" onChange={(e) => {
                                    const val = Number.parseInt(e.target.value);
                                    setWinNumber1(isNaN(val) ? 0 : val)
                                }} />
                            </Grid>
                        </Grid>
                        <Divider sx={{ mx: 2 }} orientation={matchesMD ? "vertical" : "horizontal"} flexItem />
                        <Grid item xs={5} my={2}>
                            <Typography variant="h5" mb={1}>
                                Player 2
                            </Typography>
                            <Grid container my={1} alignItems="center">
                                <DeckAutocomplete currentDeck={deck2} setCurrentDeck={setDeck2} />
                                <SelectedItemImage image={deck2?.image} type="deck" />
                            </Grid>
                            <Grid my={1}>
                                <Typography>
                                    Wins:
                                </Typography>
                                <TextField fullWidth type="number" onChange={(e) => {
                                    const val = Number.parseInt(e.target.value);
                                    setWinNumber2(isNaN(val) ? 0 : val)
                                }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between" mt={10}>
                        <Button color="error" variant="outlined" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button color="success" variant="outlined" onClick={handleSubmit}>Registrar</Button>
                    </Grid>
                </Box>
            </Dialog>
        </>
    )
}