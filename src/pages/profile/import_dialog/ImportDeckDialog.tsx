import { Button, Dialog, Typography, TextField } from "@mui/material"
import { useImportDeckDialogVM } from "./useImportDeckDialogVM"

export const ImportDeckDialog = () => {

    const {
        importDialogOpen,
        setImportDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        handleUploadDeck
    } = useImportDeckDialogVM();

    return (
        <>
            <Button onClick={() => setImportDialogOpen(true)}>Import</Button>
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Typography>Import deck</Typography>
                <TextField label="deck name" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
                <TextField label="ydke url" value={ydkeURL} onChange={(e) => setydkeURL(e.target.value)} />
                <Button onClick={handleUploadDeck}>Yes</Button>
            </Dialog>
        </>
    )
}