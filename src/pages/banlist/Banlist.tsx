import { CircularProgress, FormControl, Grid, GridProps, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IBanlistCard, useBanlistViewModel } from "./useBanlistViewModel";
import { Enums } from "../../database.types";
import { DARK_BLUE } from "../../constants/colors";

export const Banlist = () => {
    const navigate = useNavigate();
    const {
        content,
        loading
    } = useBanlistViewModel();
    const { cardsContainerStyles, cardProperties, loaderProps } = singleDeckStyles();

    const DeckCard = ({ card, i }: { card: IBanlistCard, i: number }) =>
        <Grid {...cardProperties} key={card.id + "card" + i}
            onClick={() => navigate("/card/?id=" + card.id)}>
            <img height={150} width={100} src={card.image} style={{ backgroundImage: 'url("/images/cardback.jpg")', backgroundSize: "contain" }} />
        </Grid>;

    const renderCards = (restriction: Enums<'Restriction'>) => {
        const cardList = content.filter((c) => c.restriction == restriction);

        return cardList.map((card, i) => (
            <DeckCard card={card} i={card.id + i} key={card.id + i} />
        ))
    }

    return <>
        <Grid container direction="column" px={{ xs: 2, lg: 16 }} mt={2}>
            <Grid container my={4}>
                <Typography variant="h3" mr={2}>Banlist</Typography>
                {/* TODO: integrate banlist selector*/}
                <FormControl variant="filled">
                    <Select
                        value="TCG"
                        label="TCG"
                        sx={{
                            color: 'white',
                            backgroundColor: DARK_BLUE,
                            fontSize: '2rem',
                            '& .MuiSelect-icon': {
                                color: 'white'
                            },
                            '.MuiSelect-select': {
                                padding: '8px 12px',
                                backgroundColor: DARK_BLUE
                            },
                        }}>
                        <MenuItem value="TCG"><Typography fontSize="2rem">TCG</Typography></MenuItem>
                        <img width="115px" src="/images/wipV.jpeg" />
                    </Select>
                </FormControl>
            </Grid>
            <Grid container direction="column" justifyContent="center">
                <Typography variant="h4">Forbidden</Typography>
                <Grid {...cardsContainerStyles}>
                    {renderCards("FORBIDDEN")}
                </Grid>

                <Typography variant="h4">Limited</Typography>
                <Grid {...cardsContainerStyles}>
                    {renderCards("LIMITED")}
                </Grid>

                <Typography variant="h4">Semi-Limited</Typography>
                <Grid {...cardsContainerStyles}>
                    {renderCards("SEMI-LIMITED")}
                </Grid>
            </Grid >
        </Grid >
        <Grid {...loaderProps} display={loading ? "flex" : "none"} >
            <CircularProgress color="secondary" />
        </Grid>
    </>;
};

const singleDeckStyles = () => {
    const cardsContainerStyles: GridProps = {
        p: "0.5rem",
        my: 2,
        container: true
    }

    const cardProperties: GridProps = {
        item: true,
        p: "1px",
        sx: {
            ":hover": {
                scale: "120%"
            }
        },
        xs: 2.4,
        sm: 1.2
    }

    const loaderProps: GridProps = {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        sx: {
            backgroundColor: "#000000dd"
        },
        justifyContent: "center",
        alignItems: "center"
    }

    return {
        cardsContainerStyles,
        cardProperties,
        loaderProps
    };
}
