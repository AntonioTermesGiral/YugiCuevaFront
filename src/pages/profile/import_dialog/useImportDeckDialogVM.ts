import { ChangeEvent, useState } from "react";
import { useClient } from "../../../client/useClient";
import { IYGOPDCard } from "../../../constants/types";
import { Enums, Tables } from "../../../database.types";
import { parseURL } from "../../../utils/ydke";
import Resizer from "react-image-file-resizer";
import { LS_USER_DATA_KEY } from "../../../constants/keys";

export const useImportDeckDialogVM = () => {
    const { getInstance } = useClient();
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [deckName, setDeckName] = useState("");
    const [ydkeURL, setydkeURL] = useState("");
    const [deckTierlist, setDeckTierlist] = useState<Enums<"Tierlist">>();
    const [deckTier, setDeckTier] = useState<number>();
    const [deckImage, setDeckImage] = useState<File>();

    const countCodes = (codes: number[]) => {
        const res = new Map<number, number>;
        codes.forEach((code) => {
            const currentQuantity = res.get(code);
            res.set(code, (currentQuantity ?? 0) + 1);
        })

        return res;
    };

    const importCards = async (cardList: number[]): Promise<IYGOPDCard[]> => {
        if (cardList.length > 0) {
            const mainRequestString = cardList.join(",");
            console.log(mainRequestString);

            const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?id=' + mainRequestString).then(res => res.text());
            return JSON.parse(res).data;
        }

        return [];
    }

    const exportCards = async (cards: Tables<'card'>[]) => {
        if (cards.length > 0) {
            const supabase = getInstance();
            const { data, error } = await supabase.from('card').insert(cards).select();
            console.log(data, error);
        }
    }

    const getCardsInDBByIds = async (ids: number[]): Promise<number[]> => {
        const supabase = getInstance();
        const { data, error } = await supabase.from('card').select('id').in('id', ids);
        console.log(data, error);
        return (data as Tables<'card'>[]).map(c => c.id) ?? [];
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
                tierlist: deckTierlist,
                points: 0
            } as Tables<'deck'>).select();

            console.log(data, error);
            return data[0] as Tables<'deck'>;
        }
        return undefined;
    }

    const linkCards = async (cardsData: Tables<'card_in_deck'>[]) => {
        const supabase = getInstance();
        const { data, error } = await supabase.from('card_in_deck').insert(cardsData).select();
        console.log(data, error);
    }

    const handleUploadDeck = () => {
        //console.log(parseURL("ydke://iNIjAMWM2wTFjNsEMbESADGxEgAxsRIAlRdjBJUXYwSVF2MEDOCVAAzglQAM4JUAj/cEBY/3BAWP9wQFcxtSAHMbUgBzG1IAFbaGBRW2hgUVtoYFlzRqBbbP8QS2z/EEOy/VATsv1QE7L9UBC0LGBAtCxgQLQsYE25VrAtuVawLblWsC+5oxA/uaMQPN8n4BzfJ+Ac3yfgGhZu4EoWbuBKFm7gQ=!jqxcAfiugQUHFjYA9jypBUs8yQNr1MwEdzBNBGBMZgUx8FcCwUd8BMD0oQCxlvoEsZb6BOj8vQTrqosF!20awBNtGsATbRrAE7I8BAOyPAQDPCQAAHddGA2927wBvdu8A+wR4AvsEeAL7BHgCYHT3BGB09wRgdPcE!"));

        const deckCodes = parseURL(ydkeURL);
        const mainCodes = [...deckCodes.main];
        const extraCodes = [...deckCodes.extra];
        const sideCodes = [...deckCodes.side];

        const mainCardsQuantity = countCodes(mainCodes);
        const extraCardsQuantity = countCodes(extraCodes);
        const sideCardsQuantity = countCodes(sideCodes);

        console.log(mainCardsQuantity, extraCardsQuantity, sideCardsQuantity);
        const uniqueCards = [...new Set([...mainCodes, ...extraCodes, ...sideCodes])];
        getCardsInDBByIds(uniqueCards).then((cardsInDB) => {
            const cardsNOTInDB = uniqueCards.filter((card) => !cardsInDB.includes(card));
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
                exportCards(parsedData).then(() => {
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
                            linkCards(cardLinks).then(() => {
                                handleUploadDeckImage(createdDeck.id).then((success) => {
                                    if (success) {
                                        console.log("Import complete")
                                    } else {
                                        alert("The deck image couldn't be uploaded...");
                                    }
                                })
                                .finally(() => {
                                    setImportDialogOpen(false);
                                })
                            });
                        }
                    })
                });
            });
        })

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
        deckTierlist,
        setDeckTierlist,
        deckTier,
        setDeckTier,
        handleUploadDeck,
        onChangeDeckImage
    }

}