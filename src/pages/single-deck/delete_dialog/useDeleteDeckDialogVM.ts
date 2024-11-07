import { useEffect, useState } from "react";
import { useClient } from "../../../client/useClient";
import { useNavigate } from "react-router-dom";
import { getUserRoute } from "../../../components/utils/getUserRoute";

export const useDeleteDeckDialogVM = () => {
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deckId, setDeckId] = useState<string>();

    const loadDefaultValues = async () => {
        const currentDeckId = new URL(location.href).searchParams.get('id')
        if (currentDeckId) {
            setDeckId(currentDeckId);
        }
    }

    const handleRemoveDeck = async () => {
        const supabase = getInstance();

        const { removedLinks, removedLinksError } = await supabase.from('card_in_deck').delete().eq('deck_id', deckId);
        console.log("Links Removal: ", removedLinks, removedLinksError);

        const { removedDeck, removedDeckError } = await supabase.from('deck').delete().eq('id', deckId);
        console.log("Deck Removal: ", removedDeck, removedDeckError);

        const removed = await handleRemoveDeckImage();
        console.log("Deck Image Removal: ", removed);
    }

    const handleRemoveDeckImage = async () => {
        const supabase = getInstance();
        const { data: deletionData, error: deletionError } =
            await supabase.storage.from('DeckImages').remove([`${deckId}.jpeg`]);

        console.log(deletionData)
        deletionError && console.log("File upload error: ", deletionError);
        return !deletionError;
    }

    const onDeleteSubmit = () => {
        handleRemoveDeck()
            .then(() => navigate(getUserRoute()));
    }

    useEffect(() => { loadDefaultValues(); }, []);

    return {
        deleteDialogOpen,
        setDeleteDialogOpen,
        onDeleteSubmit
    }
}