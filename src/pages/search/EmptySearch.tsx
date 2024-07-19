import { Button, Grid, Paper, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const EmptySearch = () => {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState("");
    const [emptySearch, setEmptySearch] = useState(false);

    const onSearch = () => {
        if (searchValue.trim() != "") {
            setEmptySearch(false);
            navigate("/search/?q=" + searchValue);
        } else {
            setEmptySearch(true);
        }
    }

    return (
        <Grid container alignItems="center" justifyContent="center" p={20}>
            <Paper sx={{ p: 5, display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" mb={2}>
                    Intenta buscar algo!
                </Typography>
                <TextField name="cave-search" sx={{ mb: 2 }} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} error={emptySearch} helperText={emptySearch ? "Campo vacío..." : ""}/>
                <Button variant="contained" onClick={onSearch}>Buscar</Button>
            </Paper>
        </Grid>
    )
}