import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useClient } from "../../../client/useClient";
import { Fragment, useState } from "react";
import { Tables } from "../../../database.types";
import { GenericAutocompleteItemType } from "../../../constants/types";

interface IDeckAutocomplete {
    currentDeck: Tables<"deck"> | null,
    setCurrentDeck: (value: Tables<"deck"> | null) => void
}

export const DeckAutocomplete = ({ currentDeck, setCurrentDeck }: IDeckAutocomplete) => {
    const { getInstance } = useClient();
    const [decks, setDecks] = useState<Tables<"deck">[]>([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        (async () => {
            const supabase = getInstance();
            setLoading(true);
            // Get decks
            const { data: decks, error: deckError } = await supabase.from('deck').select();
            deckError && console.log(decks, deckError);
            setLoading(false);

            setDecks([...decks]);
        })();
    };

    const handleClose = () => setDecks([]);

    return (
        <Autocomplete
            sx={{ width: 300 }}
            open={decks.length > 0}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={(deck, value) => deck.name === value.name}
            getOptionLabel={(deck) => deck.name}
            getOptionKey={(deck) => deck.id}
            options={decks}
            loading={loading}
            value={currentDeck}
            onChange={(_, newValue: Tables<"deck"> | null) => {
                setCurrentDeck(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Deck"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        )
                    }}
                />
            )}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props as GenericAutocompleteItemType;
                const imgUrl = import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + option.image
                return (
                    <li key={key} {...optionProps}>
                        <img height="50px" width="50px" style={{ marginRight: 10 }} src={imgUrl} />
                        {option.name}
                    </li>
                );
            }}
        />
    )
}