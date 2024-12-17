import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, InputBase, Divider, Grid } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DARK_BLUE } from "../../constants/colors";
import { getUserRoute } from "../utils/getUserRoute";
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ViewListIcon from '@mui/icons-material/ViewList';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import MenuIcon from '@mui/icons-material/Menu';

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
            <Toolbar sx={{ backgroundColor: DARK_BLUE, justifyContent: "space-between" }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} PaperProps={{ sx: { backgroundColor: DARK_BLUE, color: "white" } }}>
                    <List>
                        <Grid container justifyContent="flex-end" px={2}>
                            <IconButton sx={{ color: "white" }} onClick={() => setIsDrawerOpen(false)}><ChevronLeftIcon /></IconButton>
                        </Grid>
                        <Divider sx={{ mx: 0.5, my: 2, borderColor: "white" }} />
                        <Paper sx={{ m: 1, p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search..."
                                value={searchBarValue}
                                onKeyDown={(e) => { if (e.key == "Enter" || e.code == "Enter") handleSearchSubmit(); }}
                                onChange={(e) => setSearchBarValue(e.target.value)}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton type="button" sx={{ p: '10px', color: DARK_BLUE }} aria-label="search" onClick={handleSearchSubmit}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/tierlists/meta")}>
                                <ListItemIcon style={{ color: "white" }}><ViewListIcon /></ListItemIcon>
                                <ListItemText primary="Meta Tierlist" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/duels")}>
                                <ListItemIcon style={{ color: "white" }}><HistoryToggleOffIcon /></ListItemIcon>
                                <ListItemText primary="Duels" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigate("/polls")}>
                                <ListItemIcon style={{ color: "white" }}><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
                <img
                    width="50"
                    height="50"
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
            </Toolbar>
        </AppBar>
    )
}