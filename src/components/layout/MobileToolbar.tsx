import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, InputBase, Divider, Grid, IconButtonProps } from "@mui/material"
import { DARK_BLUE } from "../../constants/colors";
import { getUserRoute } from "../../utils/getUserRoute";
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ViewListIcon from '@mui/icons-material/ViewList';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import MenuIcon from '@mui/icons-material/Menu';
import { useToolbar } from "./useToolbar";
import { CSSProperties } from "react";

export const YGCMobileToolbar = () => {
    const {
        isDrawerOpen,
        searchBarValue,
        pfpUrl,
        handleSearchSubmit,
        handleNavigate,
        onChangeSearchValue,
        openDrawer,
        closeDrawer
    } = useToolbar();

    return (
        <AppBar position="static">
            <Toolbar sx={styles.toolbar}>
                <IconButton {...styles.borgar} onClick={openDrawer}>
                    <MenuIcon />
                </IconButton>
                <Drawer open={isDrawerOpen} onClose={closeDrawer} PaperProps={styles.drawerPaperProps}>
                    <List>
                        <Grid container justifyContent="flex-end" px={2}>
                            <IconButton sx={{ color: "white" }} onClick={closeDrawer}><ChevronLeftIcon /></IconButton>
                        </Grid>
                        <Divider sx={{ mx: 0.5, my: 2, borderColor: "white" }} />
                        <Paper sx={styles.searchContainer}>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search..."
                                value={searchBarValue}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter" || e.code == "Enter")
                                        handleSearchSubmit();
                                }}
                                onChange={onChangeSearchValue}
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
                <img {...styles.profilePicture} src={pfpUrl} onClick={() => handleNavigate(getUserRoute())} />
            </Toolbar>
        </AppBar>
    )
}

const styles = {
    toolbar: {
        backgroundColor: DARK_BLUE,
        justifyContent: "space-between"
    },
    borgar: {
        size: "large",
        edge: "start",
        color: "inherit",
        "aria-label": "menu",
        sx: { mr: 2 }
    } as IconButtonProps,
    drawerPaperProps: {
        sx: {
            backgroundColor: DARK_BLUE,
            color: "white"
        }
    },
    profilePicture: {
        width: "50",
        height: "50",
        style: {
            backgroundImage: 'url("/images/default-profile.jpg")',
            backgroundSize: "cover",
            objectFit: "cover",
            borderRadius: "50%",
            border: "solid 2px black",
            marginRight: 10,
            cursor: "pointer"
        } as CSSProperties
    },
    searchContainer: {
        m: 1,
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center'
    }
}