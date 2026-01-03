import { Box, Grid, GridProps, MenuItem, Select, Typography } from "@mui/material";
import { Enums } from "../../database.types"
import { TierListDeck } from "./TierListDeck";
import { useTierList } from "./useTierList";
import { colorLoop, POINTS_BLUE } from "../../constants/colors";
import { styled } from '@mui/material/styles';

interface ITierList {
    variant: Enums<"Tierlist">;
}

const getTierColor = (index: number) => {
    let currentIndex = index;
    while (currentIndex > colorLoop.length - 1) {
        currentIndex -= colorLoop.length;
    }

    return colorLoop[currentIndex];
}

const StyledSelect = styled(Select)({
    color: POINTS_BLUE,
    ":hover": {
        ".MuiOutlinedInput-notchedOutline": {
            borderColor: POINTS_BLUE
        }
    },
    "fieldset": {
        borderColor: POINTS_BLUE
    },
    "svg": {
        color: POINTS_BLUE
    }
})

export const TierList = ({ variant }: ITierList) => {
    const styles = getStyles();
    const { sortedDecks, allOwners, selectedOwner, setSelectedOwner, EMPTY_SELECTED_OWNER } = useTierList(variant);

    return (
        <Grid container direction="column" alignItems="center" py={1}>
            <Grid container flexDirection="column" alignContent="flex-start" p={1}>
                <Typography mb={0.5}>Filter By User:</Typography>
                <StyledSelect value={selectedOwner} onChange={(v) => setSelectedOwner(v.target.value as string)} variant="outlined">
                    <MenuItem value={EMPTY_SELECTED_OWNER}>No Owner Selected</MenuItem>
                    {allOwners.map(owner =>
                        <MenuItem key={owner.id} value={owner.id}>{owner.display_name}</MenuItem>
                    )}
                </StyledSelect>
            </Grid>
            {/* FIXME: MAYBE ADD ON MULTIPLE TIERLISTS */}
            {/* <Typography variant="h4" my={2}>TIERLIST: {variant}</Typography> */}
            <Box sx={{ width: "100%", color: "black" }}>
                {[...sortedDecks].map((tierData, index) => {
                    const currentTier = tierData[0];
                    const currentTierDecks = tierData[1].filter((td) => selectedOwner === EMPTY_SELECTED_OWNER || td.owner === selectedOwner);
                    return (
                        <Grid
                            container
                            key={currentTier}
                            direction={{ xs: "column", sm: "row" }}
                            wrap="nowrap"
                            minHeight="10rem"
                        >
                            <Grid {...styles.tier} sx={{ backgroundColor: getTierColor(index) }}>
                                {isNaN(currentTier) ?
                                    <Typography fontWeight={500} fontSize="clamp(2rem, 8vw, 3rem)">No Tier</Typography>
                                    : <Typography fontWeight={500} fontSize="clamp(3rem, 16vw, 4rem)">{currentTier}</Typography>
                                }
                            </Grid>
                            <Grid item container alignItems="center" gap={1} p={1}>
                                {currentTierDecks.map((currentDeck) => <TierListDeck deck={currentDeck} owners={allOwners} key={currentDeck.id} />)}
                                {currentTierDecks.length == 0 && <Typography variant="h5" color="white" ml={1}>No Decks...</Typography>}
                            </Grid>
                        </Grid>
                    )
                })}
            </Box>
        </Grid>
    )
}

const getStyles = () => {
    const tier: GridProps = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        textAlign: "center",
        px: 2,
        m: 1
    }

    return {
        tier
    }
}