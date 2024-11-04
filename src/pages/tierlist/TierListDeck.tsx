import { ImageListItem, ImageListItemBar, IconButton } from "@mui/material"
import { Tables } from "../../database.types"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClient } from "../../client/useClient";
import InfoIcon from '@mui/icons-material/Info';

interface ITierListDeck {
    deck: Tables<"deck">;
}

export const TierListDeck = ({ deck }: ITierListDeck) => {
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const supabase = getInstance();
    const [hasImage, setHasImage] = useState(false);
    const [ownerName, setOwnerName] = useState<string>();

    const handleSearchImage = async () => {
        const { data, error } = await supabase
            .storage
            .from('DeckImages')
            .list('', {
                limit: 1,
                offset: 0,
                search: deck.id + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT
            });

        setHasImage(!error && data.length > 0);

        const { data: dname, error: dnameError } = await supabase
            .from('profile')
            .select('display_name')
            .eq('id', deck.owner);

        if (dname[0]) {
            setOwnerName(dname[0].display_name);
        }
        dnameError && console.log("Owner get error on deck", deck.id, ":", dnameError);
    }

    useEffect(() => {
        handleSearchImage();
    }, []);

    return (
        <ImageListItem key={deck.id} sx={{ maxHeight: "10em" }}>
            <img
                style={{ maxHeight: "inherit", minHeight: "10rem" }}
                src={hasImage ?
                    import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + deck.id + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT + "?ver=" + new Date().getTime()
                    : "/images/card-question.png"}
                alt={deck.name}
                loading="lazy"
            />
            <ImageListItemBar
                title={deck.name}
                subtitle={ownerName}
                actionIcon={
                    <IconButton sx={{ color: 'white' }} onClick={() => navigate("/deck/?id=" + deck.id)}>
                        <InfoIcon/>
                    </IconButton>
                }
            />
        </ImageListItem>
    )
}