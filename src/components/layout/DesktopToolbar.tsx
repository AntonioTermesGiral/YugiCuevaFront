import { Box, AppBar, Toolbar, Button, Paper, IconButton, InputBase, Divider, Grid, DividerProps } from "@mui/material"
import { getUserRoute } from "../../utils/getUserRoute";
import { DARK_BLUE } from "../../constants/colors";
import SearchIcon from '@mui/icons-material/Search';
import { useToolbar } from "./useToolbar";
import { CSSProperties } from "react";

export const YGCDesktopToolbar = () => {
    const {
        searchBarValue,
        pfpUrl,
        handleSearchSubmit,
        handleNavigate,
        onChangeSearchValue
    } = useToolbar();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={styles.toolbar}>
                    <Grid container>
                        <Grid item display="flex" alignItems="center" xs={8}>
                            <img {...styles.profilePicture} src={pfpUrl} onClick={() => handleNavigate(getUserRoute())} />
                            <Divider {...styles.divider} />
                            <Button sx={styles.navButton} onClick={() => handleNavigate("/tierlists/meta")}>Tierlist</Button>
                            <Divider {...styles.divider} />
                            <Button sx={styles.navButton} onClick={() => handleNavigate("/duels")}>Duels</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={styles.searchContainer}>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search..."
                                    value={searchBarValue}
                                    onKeyDown={(e) => { if (e.key == "Enter" || e.code == "Enter") handleSearchSubmit(); }}
                                    onChange={onChangeSearchValue}
                                />
                                <Divider {...styles.divider} />
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

const styles = {
    toolbar: {
        backgroundColor: DARK_BLUE,
        p: 1
    },
    profilePicture: {
        width: "69",
        height: "69",
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
    divider: {
        sx: {
            height: 28,
            m: 0.5
        },
        orientation: "vertical"
    } as DividerProps,
    searchContainer: {
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center'
    },
    navButton: {
        my: 2,
        color: 'white',
        display: 'block'
    }
}
