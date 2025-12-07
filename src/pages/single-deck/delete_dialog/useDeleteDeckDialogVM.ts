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

            const { data: matches, error: matchesError } = await supabase.from('match_data').select('match_id').eq("deck", deckId);
            matchesError && console.log("Error while loading matches to delete", matchesError);
            const matchesIds = (matches as {match_id: string}[]).map((m) => m.match_id)

            const { removedMatches, removedMatchesError } = await supabase.from('match').delete().in('id', matchesIds);
            console.log("Deck Removal: ", removedMatches, removedMatchesError);

            const { removedDeck, removedDeckError } = await supabase.from('deck').delete().eq('id', deckId);
            console.log("Deck Removal: ", removedDeck, removedDeckError);

            const removedImage = await handleRemoveDeckImage();
            console.log("Deck Image Removal: ", removedImage);
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