import { Box, useMediaQuery, useTheme } from "@mui/material"
import { YGCDesktopToolbar } from "./DesktopToolbar";
import { YGCMobileToolbar } from "./MobileToolbar";
import { useLoadPFP } from "../../utils/useLoadPFP";
import { useCheckSession } from "../../utils/useCheckSession";

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