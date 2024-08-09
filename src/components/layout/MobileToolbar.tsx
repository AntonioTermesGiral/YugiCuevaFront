import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, InputBase, Divider, Grid } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { getUserRoute } from "./Toolbar";
import { useEffect, useState } from "react";

export const YGCMobileToolbar = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    const handleSearchSubmit = () => {
        if (searchBarValue.trim() != "") {
            setSearchBarValue("");
            setTimeout(() => setIsDrawerOpen(false))
            navigate("/search/?q=" + searchBarValue);
        }
    }

    useEffect(() => {
        const userPFP = localStorage.getItem('current-user-pfp');
        userPFP && setPfpUrl(userPFP);
    }, [])

    const handleNavigate = (route: string) => {
        setIsDrawerOpen(false);
        navigate(route);
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{ backgroundColor: "lightgray", justifyContent: "space-between" }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    =
                </IconButton>
                <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                    <List>
                        <Grid container justifyContent="flex-end" px={2}>
                            <IconButton onClick={() => setIsDrawerOpen(false)}>{"x"}</IconButton>
                        </Grid>
                        <Divider sx={{ mx: 0.5, my: 2 }} />
                        <Paper sx={{ m: 1, p: '2px 4px', display: 'flex', alignItems: 'center' }}>
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
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/tierlists/meta")}>
                                <ListItemIcon>o</ListItemIcon>
                                <ListItemText primary="Meta Tierlist" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/tierlists/chill")}>
                                <ListItemIcon>o</ListItemIcon>
                                <ListItemText primary="Chill Tierlist" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/matches")}>
                                <ListItemIcon>o</ListItemIcon>
                                <ListItemText primary="Matches" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/polls")}>
                                <ListItemIcon>o</ListItemIcon>
                                <ListItemText primary="Polls" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
                <img
                    width="50"
                    height="50"
                    src={pfpUrl}
                    style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "solid 2px black",
                        marginRight: 10,
                        cursor: "pointer"
                    }}
                    onClick={() => navigate(getUserRoute())}
                />
            </Toolbar>
        </AppBar>
    )
}