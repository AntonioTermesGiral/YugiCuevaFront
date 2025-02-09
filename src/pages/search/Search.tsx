import { Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { EmptySearch } from "./EmptySearch";
import { FilledSearch } from "./FilledSearch";
import { useLocation } from "react-router-dom";

export const Search = () => {
    const [searched, setSearched] = useState(false);
    const navLocation = useLocation();

    useEffect(() => {
        setSearched(navLocation.search.trim() !== "");
    }, [navLocation.search]);

    return (
        <Grid container height="100%">
            {searched ? <FilledSearch/> : <EmptySearch />}
        </Grid>
    )
}