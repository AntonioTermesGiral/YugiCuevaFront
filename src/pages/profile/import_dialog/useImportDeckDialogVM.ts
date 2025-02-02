import { ChangeEvent, useState } from "react";
import { useClient } from "../../../client/useClient";
import { Tables } from "../../../database.types";
import { parseURL } from "../../../utils/ydke";
import Resizer from "react-image-file-resizer";
import { LS_USER_DATA_KEY } from "../../../constants/keys";
import { countCodes, exportCards, getCardsInDBByIds, importCards, linkCards } from "../../../utils/ydke-import-helper";

export const useImportDeckDialogVM = () => {
    const { getInstance } = useClient();
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [deckName, setDeckName] = useState("");
    const [ydkeURL, setydkeURL] = useState("");
    const [deckTier, setDeckTier] = useState<number>();
    const [deckImage, setDeckImage] = useState<File>();

    const getInitialPoints = (tier?: number) => {
        switch (tier) {
            case 0: return 325;
            case 1: return 275;
            case 2: return 225;
            case 3: return 175;
            case 4: return 125;
            case 5: return 75;
            case 6: return 25;
            default: return 0;
        }
    }

    const createDeck = async () => {
        const supastorage = localStorage.getItem(LS_USER_DATA_KEY);
        if (supastorage) {
            const supabase = getInstance();
            const userId = JSON.parse(supastorage).user.id;
            const { data, error } = await supabase.from('deck').insert({
                name: deckName,
                owner: userId,
                tier: deckTier,
                tierlist: "META",
                points: getInitialPoints(deckTier)
            } as Tables<'deck'>).select();

            console.log(data, error);
            return data[0] as Tables<'deck'>;
        }
        return undefined;
    }



    const handleDeckRollback = async (deckId: string) => {
        const supabase = getInstance();
        const { removedLinks, removedLinksError } = await supabase.from('card_in_deck').delete().eq('deck_id', deckId);
        console.log("Links Removal: ", removedLinks, removedLinksError);
        const { removedDeck, removedDeckError } = await supabase.from('deck').deck().delete().eq('id', deckId);
        console.log("Deck Removal: ", removedDeck, removedDeckError);
    }

    const handleUploadDeck = () => {
        //console.log(parseURL("ydke://iNIjAMWM2wTFjNsEMbESADGxEgAxsRIAlRdjBJUXYwSVF2MEDOCVAAzglQAM4JUAj/cEBY/3BAWP9wQFcxtSAHMbUgBzG1IAFbaGBRW2hgUVtoYFlzRqBbbP8QS2z/EEOy/VATsv1QE7L9UBC0LGBAtCxgQLQsYE25VrAtuVawLblWsC+5oxA/uaMQPN8n4BzfJ+Ac3yfgGhZu4EoWbuBKFm7gQ=!jqxcAfiugQUHFjYA9jypBUs8yQNr1MwEdzBNBGBMZgUx8FcCwUd8BMD0oQCxlvoEsZb6BOj8vQTrqosF!20awBNtGsATbRrAE7I8BAOyPAQDPCQAAHddGA2927wBvdu8A+wR4AvsEeAL7BHgCYHT3BGB09wRgdPcE!"));
        if (deckName.trim() === "" || ydkeURL.trim() === "") {
            alert("Ponle un nombre y una ydke url al deck.");
            return;
        }

        try {
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
            getCardsInDBByIds(uniqueCards, supabase).then((cardsInDB) => {
                const cardsNOTInDB = uniqueCards.filter((card) => !cardsInDB.includes(card));
                // Gets the non existing cards from the ygoprodeck api
                importCards(cardsNOTInDB).then((res) => {
                    const parsedData: Tables<'card'>[] = res.map((card) => {
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
                    exportCards(parsedData, supabase).then(() => {
                        // Creates the new deck
                        createDeck().then((createdDeck) => {
                            if (createdDeck) {
                                const cardLinks: Tables<'card_in_deck'>[] = [];
                                mainCardsQuantity.forEach((v, k) => {
                                    cardLinks.push({
                                        card_id: k,
                                        quantity: v,
                                        deck_id: createdDeck.id,
                                        position: "MAIN"
                                    })
                                })

                                extraCardsQuantity.forEach((v, k) => {
                                    cardLinks.push({
                                        card_id: k,
                                        quantity: v,
                                        deck_id: createdDeck.id,
                                        position: "EXTRA"
                                    })
                                })

                                sideCardsQuantity.forEach((v, k) => {
                                    cardLinks.push({
                                        card_id: k,
                                        quantity: v,
                                        deck_id: createdDeck.id,
                                        position: "SIDE"
                                    })
                                })

                                console.log(cardLinks);
                                // Adds the cards into the deck
                                linkCards(cardLinks, supabase).then(() => {
                                    // Uploads the deck image
                                    handleUploadDeckImage(createdDeck.id).then((success) => {
                                        if (success || !deckImage) {
                                            console.log("Import complete")
                                            location.reload();
                                        } else {
                                            alert("The deck image couldn't be uploaded...");
                                        }
                                    }).catch(() => alert("The deck image couldn't be uploaded..."))
                                        .finally(() => setImportDialogOpen(false))

                                }).catch(() => {
                                    handleDeckRollback(createdDeck.id)
                                        .then(() => alert("Sa roto en el peor momento posible, disele a Tontonio e intenta de nuevo, Codigo de error: FCKFCK"));
                                });
                            }

                        }).catch(() => alert("Sa roto, disele a Tontonio o intenta de nuevo, Codigo de error: DIKSAD"));

                    }).catch(() => alert("Sa roto, disele a Tontonio e intenta de nuevo, (por si acaso revisa que las cartas del deck no tengan un diseño alternativo) Codigo de error: CARJEW"));

                }).catch(() => alert("Sa roto, revisa que las cartas del deck no tengan un diseño alternativo o prueba a importarlo en yugiohprodeck, Codigo de error: CARINM"));

            }).catch(() => alert("Sa roto, intenta de nuevo o disele a Tontonio, Codigo de error: YDKNGR"));

        } catch (err) {
            console.log("Import error: " + err);
            alert("Algo ha salido mal, revisa la url usada (pruebala el yugioh prodeck o algo) o habla con Tontonio.");
        }
    }

    const handleUploadDeckImage = async (deckId: string) => {
        if (deckImage) {
            const supabase = getInstance();
            const { data: uploadData, error: uploadError } = await supabase.storage.from('DeckImages')
                .upload(`${deckId}.jpeg`, deckImage, { cacheControl: '3600', upsert: false });

            console.log("File uploaded: ", uploadData);
            console.log("File uploaded id: ", uploadData?.id);
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

    return {
        importDialogOpen,
        setImportDialogOpen,
        deckName,
        setDeckName,
        ydkeURL,
        setydkeURL,
        deckTier,
        setDeckTier,
        handleUploadDeck,
        onChangeDeckImage
    }

}