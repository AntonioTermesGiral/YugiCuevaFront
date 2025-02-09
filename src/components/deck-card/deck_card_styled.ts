import { Avatar, CardMedia } from "@mui/material";
import { styled } from "@mui/material/styles";

export const deckCardStyled = () => {
    const StyledRoot = styled("div")<{ color?: string }>(
        () => ({
            position: "relative",
            borderRadius: "1rem",
            width: 320,
            paddingTop: 160,
            "&:before": {
                transition: "0.2s",
                position: "absolute",
                width: "100%",
                height: "100%",
                content: '""',
                display: "block",
                borderRadius: "1rem",
                zIndex: 0,
                bottom: 0
            },
            "&:hover": {
                "&:before": {
                    bottom: -6,
                },
                "& .MuiAvatar-root": {
                    transform: "scale(1.1)",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.38)",
                },
            },
        })
    );

    const CardMediaCover = styled(CardMedia)(() => ({
        borderRadius: "1rem",
        position: "absolute",
        width: "100%",
        height: "70%",
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        backgroundPosition: "center",
    }));

    const StyledH2 = styled("h2")<{ color: string }>(
        ({ color }) => ({
            fontSize: "1.25rem",
            color: color,
            margin: 0,
            maxWidth: 180,
            maxHeight: 90,
            overflowWrap: "break-word",
            overflowY: "hidden"
        })
    );

    const StyledContent = styled("div")<{ startColor: string, endColor: string }>(
        ({ startColor, endColor }) => ({
            position: "relative",
            zIndex: 1,
            padding: "1rem",
            borderRadius: "1rem",
            "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                left: 0,
                top: 1,
                zIndex: 0,
                width: "100%",
                height: "100%",
                clipPath:
                    "polygon(0% 100%, 0% 35%, 0.3% 33%, 1% 31%, 1.5% 30%, 2% 29%, 2.5% 28.4%, 3% 27.9%, 3.3% 27.6%, 5% 27%,95% 0%,100% 0%, 100% 100%)",
                borderRadius: "1rem",
                background: `linear-gradient(to top, ${startColor}, ${endColor})`
            },
        })
    );

    const AvatarLogo = styled(Avatar)(() => ({
        transition: "0.3s",
        width: 100,
        height: 100,
        boxShadow: "0 4px 12px 0 rgba(0,0,0,0.24)",
        borderRadius: "1rem",
    }));

    const StyledTierInfo = styled("div")<{ color: string }>(
        ({ theme, color }) => ({
            color: color,
            backgroundColor: theme.palette.text.disabled,
            fontSize: "1rem",
            padding: "0 0.5rem",
            borderRadius: 12,
        })
    );

    return {
        StyledRoot,
        CardMediaCover,
        StyledH2,
        StyledContent,
        AvatarLogo,
        StyledTierInfo
    }
}