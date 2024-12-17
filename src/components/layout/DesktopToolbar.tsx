import { Box, AppBar, Toolbar, Button, Paper, IconButton, InputBase, Divider, Grid } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRoute } from "../utils/getUserRoute";
import { DARK_BLUE } from "../../constants/colors";
import SearchIcon from '@mui/icons-material/Search';

export const YGCDesktopToolbar = () => {
    const navigate = useNavigate();

    const [searchBarValue, setSearchBarValue] = useState("");
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    const handleSearchSubmit = () => {
        if (searchBarValue.trim() != "") {
            navigate("/search/?q=" + searchBarValue);
            setSearchBarValue("");
        }
    }

    useEffect(() => {
        const userPFP = localStorage.getItem('current-user-pfp');
        userPFP && setPfpUrl(userPFP);
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ backgroundColor: DARK_BLUE, p: 1 }}>
                    <Grid container>
                        <Grid item display="flex" alignItems="center" xs={8}>
                            <img
                                width="69"
                                height="69"
                                src={pfpUrl}
                                style={{
                                    backgroundImage: 'url("/images/default-profile.jpg")',
                                    backgroundSize: "cover",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "solid 2px black",
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                                onClick={() => navigate(getUserRoute())}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate("/tierlists/meta")}>Tierlist</Button>
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate("/duels")}>Duels</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search..."
                                    value={searchBarValue}
                                    onKeyDown={(e) => { if (e.key == "Enter" || e.code == "Enter") handleSearchSubmit(); }}
                                    onChange={(e) => setSearchBarValue(e.target.value)}
                                />
                                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchSubmit}>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    )
}