import { Box, useMediaQuery, useTheme } from "@mui/material"
import { YGCDesktopToolbar } from "./DesktopToolbar";
import { YGCMobileToolbar } from "./MobileToolbar";
import { useLoadPFP } from "../../utils/useLoadPFP";
import { useCheckSession } from "../../utils/useCheckSession";

export const getUserRoute = () => {
    const lsRes = localStorage.getItem("sb-tbdesplqufizydsciqzq-auth-token");
    if (lsRes) {
        const userId = JSON.parse(lsRes).user.id;
        return "/user/?id=" + userId;
    }

    return "/login";
}

export const YGCToolbar = ({ children }: { children: JSX.Element[] | JSX.Element }) => {

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.up('sm'));
    useLoadPFP();
    useCheckSession();

    return (
        <Box id="YGC">
            {matchesMD ? <YGCDesktopToolbar /> : <YGCMobileToolbar />}
            {children}
        </Box>
    )
}