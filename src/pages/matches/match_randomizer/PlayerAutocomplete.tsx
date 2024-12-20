import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useClient } from "../../../client/useClient";
import { useState } from "react";
import { Tables } from "../../../database.types";
import { GenericAutocompleteItemType } from "../../../constants/types";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface IDeckAutocomplete {
    setCurrentPlayers: (value: Tables<"profile">[]) => void
}

export const PlayerAutocomplete = ({ setCurrentPlayers }: IDeckAutocomplete) => {
    const { getInstance } = useClient();
    const [players, setPlayers] = useState<Tables<"profile">[]>([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        (async () => {
            const supabase = getInstance();
            setLoading(true);
            // Get decks
            const { data: players, error: playersError } = await supabase.from('profile').select();
            playersError && console.log(players, playersError);
            setLoading(false);

            setPlayers([...players]);
        })();
    };

    const handleClose = () => setPlayers([]);

    return (
        <Autocomplete
            multiple
            sx={{ width: 300 }}
            open={players.length > 0}
            onClose={handleClose}
            loading={loading}
            //value={selectedPlayer}
            onChange={(_, newValue: Tables<"profile">[]) => {
                setCurrentPlayers(newValue);
            }}
            options={players}
            onOpen={handleOpen}
            disableCloseOnSelect
            isOptionEqualToValue={(deck, value) => deck.display_name === value.display_name}
            getOptionKey={(deck) => deck.id}
            getOptionLabel={(option) => option.display_name}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props as GenericAutocompleteItemType;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.display_name}
                    </li>
                );
            }}
            style={{ width: "100%" }}
            renderInput={(params) => (
                <TextField {...params} label="Checkboxes" placeholder="Favorites" />
            )}
        />
    )
}