import { useState } from "react";
import { useClient } from "../../../client/useClient";
import { useNavigate } from "react-router-dom";
import { getUserRoute } from "../../../utils/getUserRoute";
import { IDeleteDeckDialog } from "./DeleteDeckDialog";

export const useDeleteDeckDialogVM = ({ deckId, deckImageId }: IDeleteDeckDialog) => {
    const navigate = useNavigate();
    const { getInstance } = useClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleRemoveDeck = async () => {
        if (deckId) {
            const supabase = getInstance();

            const { removedLinks, removedLinksError } = await supabase.from('card_in_deck').delete().eq('deck_id', deckId);
            console.log("Links Removal: ", removedLinks, removedLinksError);

            const { removedDeck, removedDeckError } = await supabase.from('deck').delete().eq('id', deckId);
            console.log("Deck Removal: ", removedDeck, removedDeckError);

            const removed = await handleRemoveDeckImage();
            console.log("Deck Image Removal: ", removed);
        } else console.log("COULD NOT DELETE DECK, undefined id")
    }

    const handleRemoveDeckImage = async () => {
        if (deckImageId !== undefined && deckImageId !== null) {
            const supabase = getInstance();
            const { data: deletionData, error: deletionError } =
                await supabase.storage.from('DeckImages').remove([deckImageId]);

            console.log(deletionData)
            deletionError && console.log("File deletion error: ", deletionError);
            return !deletionError;
        }

        return "Not removed / obj = " + deckImageId;
    }

    const onDeleteSubmit = () => {
        handleRemoveDeck()
            .then(() => navigate(getUserRoute()));
    }

    return {
        deleteDialogOpen,
        setDeleteDialogOpen,
        onDeleteSubmit
    }
}