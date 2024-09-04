import { Box, AppBar, Toolbar, Button, Paper, IconButton, InputBase, Divider, Grid, Menu, MenuItem } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRoute } from "./Toolbar";
import { DARK_BLUE } from "../../constants/colors";

export const YGCDesktopToolbar = () => {
    const navigate = useNavigate();

    const [searchBarValue, setSearchBarValue] = useState("");
    const [tierlistMenuAnchor, setTierlistMenuAnchor] = useState<null | HTMLElement>(null);
    const tierlistMenuOpen = Boolean(tierlistMenuAnchor);
    const handleOpenTierlistMenu = (event: React.MouseEvent<HTMLElement>) => setTierlistMenuAnchor(event.currentTarget);
    const handleCloseTierlistMenu = () => setTierlistMenuAnchor(null);
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
                            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleOpenTierlistMenu}>Tierlist</Button>
                            <Menu anchorEl={tierlistMenuAnchor} open={tierlistMenuOpen} onClose={handleCloseTierlistMenu}>
                                <MenuItem onClick={() => { navigate("/tierlists/meta"); handleCloseTierlistMenu(); }}>Meta Tierlist</MenuItem>
                                <MenuItem onClick={() => { navigate("/tierlists/chill"); handleCloseTierlistMenu(); }}>Chill Tierlist</MenuItem>
                            </Menu>
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate("/matches")}>Matches</Button>
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate("/polls")}>Polls</Button>
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
                                    Q
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    )
}