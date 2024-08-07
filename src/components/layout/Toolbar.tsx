import { Box, useMediaQuery, useTheme } from "@mui/material"
import { YGCDesktopToolbar } from "./DesktopToolbar";
import { YGCMobileToolbar } from "./MobileToolbar";

export const getUserRoute = () => {
    let lsRes = localStorage.getItem("sb-tbdesplqufizydsciqzq-auth-token");
    if (lsRes) {
        let userId = JSON.parse(lsRes).user.id;
        return "/user/?id=" + userId;
    }

    return "/login";
}

export const YGCToolbar = ({ children }: { children: JSX.Element[] | JSX.Element }) => {

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Box id="YGC">
            {matchesMD ? <YGCDesktopToolbar /> : <YGCMobileToolbar />}
            {children}
        </Box>
    )
}