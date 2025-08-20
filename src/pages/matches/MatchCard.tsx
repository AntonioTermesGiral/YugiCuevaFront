import { Grid, Typography, GridProps, Box, TypographyProps, SxProps } from "@mui/material"
import { POINTS_BLUE, POINTS_DARKBLUE } from "../../constants/colors"
import { useNavigate } from "react-router-dom"
import { IMatch } from "./data-load/match_data_interfaces"

interface IMatchCard {
    match: IMatch
}

const pointsContainer: GridProps = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "min-content",
    width: "min-content",
    py: "5px",
    px: "15px",
    mt: 2,
    borderRadius: "12px",
    color: "white"
}

const longNameStyles: TypographyProps = {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxWidth: "100%"
}

const cardSx: SxProps = {
    py: 1,
    px: 2,
    m: 1,
    textAlign: "center",
    backgroundColor: "#2E2E2E",
    border: "2px solid #3A3A3A",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4);"
}

export const MatchCard = ({ match }: IMatchCard) => {
    const navigate = useNavigate();

    return (
        <Grid item key={match.id} xs={12} md={6} lg={4} >
            <Box sx={cardSx} >
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item container xs={4} my={1} flexDirection="column" alignItems="center">
                        <Typography color="white" mb={3} mt={1} ml={2} alignSelf="flex-start">
                            {match.type}
                        </Typography>
                        <Box sx={{ ":hover": { scale: "120%", cursor: "pointer" } }} onClick={() => navigate("/deck/?id=" + match.winners[0].playerDeckId)}>
                            <img height="100px" width="100px" src={match.winners[0].deckImage} style={{ borderRadius: "12px" }} />
                        </Box>
                        <Typography variant="h5" color="white" mt={2} {...longNameStyles}>
                            {match.winners[0].playerDisplayName}
                        </Typography>
                        <Typography variant="h6" color="#B0B0B0" {...longNameStyles}>
                            {match.winners[0].playerDeckName}
                        </Typography>
                        <Grid item {...pointsContainer} bgcolor={POINTS_BLUE}>
                            <Typography variant="h6" fontWeight={800}>
                                {match.winners[0].pointChanges}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h3" fontWeight={800} color="white" fontSize="clamp(24px, 10vw, 48px)" whiteSpace="nowrap">
                            {match.winnersScore} - {match.losersScore}
                        </Typography>
                    </Grid>
                    <Grid item container xs={4} my={1} flexDirection="column" alignItems="center">
                        <Typography color="white" mb={3} mt={1} mr={3} alignSelf="flex-end">
                            {new Date(match.date).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ ":hover": { scale: "120%", cursor: "pointer" } }} onClick={() => navigate("/deck/?id=" + match.losers[0].playerDeckId)}>
                            <img height="100px" width="100px" src={match.losers[0].deckImage} style={{ borderRadius: "12px" }} />
                        </Box>
                        <Typography variant="h5" color="white" mt={2} {...longNameStyles}>
                            {match.losers[0].playerDisplayName}
                        </Typography>
                        <Typography variant="h6" color="#B0B0B0" {...longNameStyles}>
                            {match.losers[0].playerDeckName}
                        </Typography>
                        <Grid item {...pointsContainer} bgcolor={POINTS_DARKBLUE}>
                            <Typography variant="h6" fontWeight={800} >
                                {match.losers[0].pointChanges}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Grid >
    )
}