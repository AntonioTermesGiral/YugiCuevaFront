import { Grid, Card, Typography, GridProps } from "@mui/material"
import { IMatch } from "./Matches"
import { POINTS_BLUE } from "../../constants/colors"

interface IMatchCard {
    match: IMatch
}

const pointsContainer: GridProps = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "4px solid #1976d2",
    height: "min-content",
    p: "3px",
    borderRadius: "15%",
    bgcolor: POINTS_BLUE,
    color: "white"
}

export const MatchCard = ({ match }: IMatchCard) => (
    <Grid item key={match.id} xs={12} >
        <Card sx={{ py: 1, px: 2, m: 2, textAlign: "center" }}>
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Typography variant="caption" color="GrayText">
                        {match.type}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="caption" color="GrayText">
                        {new Date(match.date).toLocaleDateString()}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="space-around" alignItems="center">
                <Grid item {...pointsContainer}>
                    <Typography variant="h6" fontWeight={800}>
                        {match.winners[0].pointChanges}
                    </Typography>
                </Grid>
                <Grid item display="flex" my={1} xs={12} md="auto" justifyContent="center">
                    <Grid display="flex" flexDirection="column" justifyContent="center" mr={2}>
                        <img height="100px" width="100px" src={match.winners[0].deckImage} />
                    </Grid>
                    <Grid display="flex" flexDirection="column" justifyContent="center">
                        <Typography variant="h6">
                            {match.winners[0].playerDeckName}
                        </Typography>
                        <Typography variant="h6">
                            {match.winners[0].playerDisplayName}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item {...pointsContainer} xs={12} md="auto" borderRadius="10px">
                    <Typography variant="h6" fontWeight={800}>
                        {match.winnersScore} - {match.losersScore}
                    </Typography>
                </Grid>
                <Grid item display="flex" my={1} xs={12} md="auto" justifyContent="center">
                    <Grid display="flex" flexDirection="column" justifyContent="center">
                        <Typography variant="h6">
                            {match.losers[0].playerDeckName}
                        </Typography>
                        <Typography variant="h6">
                            {match.losers[0].playerDisplayName}
                        </Typography>
                    </Grid>
                    <Grid display="flex" flexDirection="column" justifyContent="center" ml={2}>
                        <img height="100px" width="100px" src={match.losers[0].deckImage} />
                    </Grid>
                </Grid>
                <Grid item {...pointsContainer}>
                    <Typography variant="h6" fontWeight={800}>
                        {match.losers[0].pointChanges}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    </Grid >
)
