import { useMediaQuery, useTheme } from "@mui/material";

export const WipScreen = () => {
    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.up('sm'));
    // wipH:  4096 x 2304 -> 2048 x 1152 -> 1024 x 576
    // wipV:  768 x 1024 -> 384 x 512 -> 192 x 256

    return (
        <>
            {
                matchesMD ?
                    <img width="100%" src="/images/wipH.jpeg" onClick={() => window.open("https://twitter.com/kji_10005/status/1783428235642155276", "_blank")} />
                    :
                    <img width="100%" src="/images/wipV.jpeg" />
            }
        </>
    )
}