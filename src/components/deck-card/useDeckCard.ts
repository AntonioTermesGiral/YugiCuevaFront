import { useEffect, useState } from "react";
import { Tables } from "../../database.types";

export const useDeckCard = (deck: Tables<"deck">, users: Tables<"profile">[], isPreview: boolean) => {
    const [deckImage, setDeckImage] = useState<string>("/images/card-question.png");
    const [ownerImage, setOwnerImage] = useState<string>();

    const loadDeckOwner = async () => {
        if (!isPreview) {
            const tempDeckImage = deck.image ?
                import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + deck.image
                : "/images/card-question.png";
            setDeckImage(tempDeckImage);

            const owner = users.find(usr => usr.id === deck.owner)
            const tempOwnerImage = owner?.image ?
                import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + owner?.image
                : "/images/default-profile.jpg";
            setOwnerImage(tempOwnerImage)
        }
    }

    useEffect(() => {
        loadDeckOwner();
    }, []);

    return {
        deckImage,
        ownerImage
    }
}