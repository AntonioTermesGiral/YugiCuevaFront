import { ChangeEvent, useEffect, useState } from "react";
import { useClient } from "../../../client/useClient";
import Resizer from "react-image-file-resizer";
import { parseURL } from "../../../utils/ydke";
import { countCodes, exportCards, getCardsInDBByIds, importCards, linkCards } from "../../../utils/ydke-import-helper";
import { Tables } from "../../../database.types";

export const useEditDeckDialogVM = () => {
    const { getInstance } = useClient();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deckImage, setDeckImage] = useState<File>();
    const [deckId, setDeckId] = useState<string>();
    const [deckName, setDeckName] = useState("");
    const [ydkeURL, setydkeURL] = useState("");
    const [originalDeckPictureUrl, setOriginalDeckPictureUrl] = useState("/images/default-profile.jpg");

    const loadDefaultValues = async () => {
        const supabase = getInstance();
        const currentDeckId = new URL(location.href).searchParams.get('id')
        if (currentDeckId) {
            setDeckId(currentDeckId);

            // Get deck
            const { data: deckData, error } = await supabase.from('deck').select().eq('id', currentDeckId);
            error && console.log(error, deckData);

            const currentDeckPic = import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + currentDeckId + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT + "?ver=" + new Date().getTime();

            // Sets the values
            currentDeckPic && setOriginalDeckPictureUrl(currentDeckPic);
            setDeckName(deckData[0].name);
        }
    }

    const handleLinkageDeletion = async () => {
        const supabase = getInstance();
        const { removedLinks, removedLinksError } = await supabase.from('card_in_deck').delete().eq('deck_id', deckId);
        console.log("Links Removal: ", removedLinks, removedLinksError);
    }

    const onNewYdkeURL = async () => {
        try {
            // Linkage deletion
            await handleLinkageDeletion();

            // Start new cards linkage
            const supabase = getInstance();
            const deckCodes = parseURL(ydkeURL);
            const mainCodes = [...deckCodes.main];
            const extraCodes = [...deckCodes.extra];
            const sideCodes = [...deckCodes.side];

            const mainCardsQuantity = countCodes(mainCodes);
            const extraCardsQuantity = countCodes(extraCodes);
            const sideCardsQuantity = countCodes(sideCodes);

            console.log(mainCardsQuantity, extraCardsQuantity, sideCardsQuantity);
            const uniqueCards = [...new Set([...mainCodes, ...extraCodes, ...sideCodes])];

            // Searches the cards in the db
            const cardsInDB = await getCardsInDBByIds(uniqueCards, supabase)
            const cardsNOTInDB = uniqueCards.filter((card) => !cardsInDB.includes(card));
            // Gets the non existing cards from the ygoprodeck api
            const rawCardList = await importCards(cardsNOTInDB);
            const parsedData: Tables<'card'>[] = rawCardList.map((card) => {
                return {
                    id: card.id ?? null,
                    name: card.name ?? null,
                    image: null,
                    type: card.type,
                    description: card.desc ?? null,
                    ygoprodeck_url: card.ygoprodeck_url,
                    race_type: card.race ?? null,
                    level: card.level ?? null,
                    attribute: card.attribute ?? null,
                    archetype: card.archetype ?? null,
                    atk: card.atk ?? null,
                    def: card.def ?? null,
                    linkval: card.linkval ?? null
                }
            });
            console.log(parsedData);
            // Saves the new cards into the database
            await exportCards(parsedData, supabase)
            if (deckId) {
                const cardLinks: Tables<'card_in_deck'>[] = [];
                mainCardsQuantity.forEach((v, k) => {
                    cardLinks.push({
                        card_id: k,
                        quantity: v,
                        deck_id: deckId,
                        position: "MAIN"
                    })
                })

                extraCardsQuantity.forEach((v, k) => {
                    cardLinks.push({
                        card_id: k,
                        quantity: v,
                        deck_id: deckId,
                        position: "EXTRA"
                    })
                })

                sideCardsQuantity.forEach((v, k) => {
                    cardLinks.push({
                        card_id: k,
                        quantity: v,
                        deck_id: deckId,
                        position: "SIDE"
                    })
                })

                console.log(cardLinks);
                try {
                    // Adds the cards into the deck
                    await linkCards(cardLinks, supabase)
                } catch {
                    await handleLinkageDeletion()
                    alert("Sa roto en el peor momento posible, disele a Tontonio e intenta de nuevo, ahora seguramente veras el deck vacío, no te asustes... Codigo de error: FCKLNKEDT");
                }
            }

        } catch (err) {
            console.log("Import error: " + err);
            alert("Sa roto al meter el nuevo YDKE, disele a Tontonio o intenta de nuevo, ahora seguramente veras el deck vacío, no te asustes... Codigo de error: FCKFCKEDT");
        }
    }

    const handleUpdateDeck = async () => {
        const supabase = getInstance();

        // Removes current cards on deck and links the new ones
        if (ydkeURL.trim() !== "") await onNewYdkeURL();

        const { data, error } = await supabase
            .from('deck')
            .update({ name: deckName })
            .eq('id', deckId)
            .select();

        console.log("Name update: " + data);
        error && console.log("Name update error: " + error);

        handleUpdateDeckImage().then((success) => {
            if (success) {
                console.log("Upload complete");
                location.reload();
            } else {
                if (deckImage) {
                    alert("The deck picture couldn't be updated...");
                } else location.reload();
            }
        })

    }

    const handleUpdateDeckImage = async () => {
        if (deckImage) {
            const supabase = getInstance();
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('DeckImages')
                .upload(`${deckId}.jpeg`, deckImage, {
                    cacheControl: '3600',
                    upsert: true
                });

            console.log("File uploaded: ", uploadData);
            uploadError && console.log("File upload error: ", uploadError);
            return !uploadError;
        }

        return false;
    }

    const handleResizeDeckImage = (file: File): Promise<File> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => resolve(uri as File),
                "file"
            );
        });

    const onChangeDeckImage = (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files;
        const imagePreview = document.getElementById('deck-image-preview') as HTMLImageElement;

        if (files && files[0]) {
            console.log(files[0])
            handleResizeDeckImage(files[0]).then((res) => {
                imagePreview.src = URL.createObjectURL(res)
                setDeckImage(res);
            }).catch(() => {
                imagePreview.removeAttribute("src");
                setDeckImage(undefined);
            })
        } else {
            imagePreview.removeAttribute("src");
            setDeckImage(undefined);
        }
    }

    useEffect(() => { loadDefaultValues(); }, []);

    return {
        editDialogOpen,
        setEditDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        originalDeckPictureUrl,
        onChangeDeckImage,
        handleUpdateDeck
    }

}