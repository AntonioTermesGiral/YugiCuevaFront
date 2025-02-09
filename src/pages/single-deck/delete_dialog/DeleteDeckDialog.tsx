import { Box, Button, Dialog, Grid, Typography } from "@mui/material";
import { useDeleteDeckDialogVM } from "./useDeleteDeckDialogVM";
import DeleteIcon from '@mui/icons-material/DeleteOutline';

export interface IDeleteDeckDialog {
    deckId?: string;
    deckImageId?: string | null;
}

export const DeleteDeckDialog = (props: IDeleteDeckDialog) => {
    const {
        deleteDialogOpen,
        setDeleteDialogOpen,
        onDeleteSubmit
    } = useDeleteDeckDialogVM(props);

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                    width: "50px",
                    height: "50px",
                    fontSize: "2em",
                    backgroundColor: "darkred"
                }}><DeleteIcon /></Button>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Box>
                    <Typography variant="h4" my={1}>Eliminar Deck</Typography>
                    <Typography variant="h6" my={1}>Estas seguro de que quieres eliminar el deck?</Typography>
                    <Grid container justifyContent="space-between" mt={10}>
                        <Button color="inherit" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button color="error" onClick={onDeleteSubmit}>Eliminar</Button>
                    </Grid>
                </Box>
            </Dialog>
        </>
    )
}