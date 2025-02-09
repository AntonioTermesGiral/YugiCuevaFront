import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { useMediaQuery, useTheme } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useClient } from "../../client/useClient";

export const useSingleCard = () => {
    const { getInstance } = useClient();
    const [card, setCard] = useState<Tables<"card">>();
    const [relatedDecks, setRelatedDecks] = useState<Tables<"deck">[]>([]);
    const [deckOwners, setDeckOwners] = useState<Tables<"profile">[]>([]);
    const mobileDisplay = { xs: "block", md: "none" };
    const desktopDisplay = { xs: "none", md: "block" };

    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.up('sm'))
    const matchesMD = useMediaQuery(theme.breakpoints.up('md'))
    const matchesLG = useMediaQuery(theme.breakpoints.up('lg'))
    const matchesXL = useMediaQuery(theme.breakpoints.up('xl'))

    const getCarrouselSizes = () => {
        if (matchesXL) return "0 0 22%";
        else if (matchesLG) return "0 0 30%";
        else if (matchesMD) return "0 0 40%";
        else if (matchesSM) return "0 0 65%";
        else return "0 0 120%"
    }

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1 })]
    )

    const loadCardData = async () => {
        const url = new URL(location.href);
        const cardID = url.searchParams.get("id");

        if (cardID) {
            const supabase = getInstance();
            // Card search by id
            const { data: cardData, error: cardError } = await supabase.from('card').select().eq("id", cardID);
            cardError && console.log(cardError);

            // DeckIdSearch
            const { data: decksIdData, error: decksIdError } = await supabase.from('card_in_deck').select("deck_id").eq("card_id", cardID)
            decksIdError && console.log(decksIdError);
            console.log(decksIdData)
            const uniqueDeckIds = Array.from(new Set(decksIdData.map((d: { deck_id: string }) => d.deck_id)))
            console.log(uniqueDeckIds)

            // Deck details
            const { data: decksData, error: decksError } = await supabase.from('deck').select().in("id", uniqueDeckIds)
            decksError && console.log(decksError);

            // Deck owners
            let ownersData = [];
            if (decksData.length > 0) {
                const { data: deckOwnersData, error: deckOwnersError } = await supabase.from('profile')
                    .select()
                    .in('id', (decksData as Tables<"deck">[]).map((d) => d.owner))

                deckOwnersError && console.log(deckOwnersError);
                ownersData = deckOwnersData;
            }

            return { cardData: cardData[0], decks: decksData, owners: ownersData };
        }
    }

    useEffect(() => {
        loadCardData().then((res) => {
            console.log(res);
            setCard(res?.cardData);
            setRelatedDecks(res?.decks ?? []);
            setDeckOwners(res?.owners ?? [])
        });
    }, []);

    return {
        card,
        relatedDecks,
        deckOwners,
        mobileDisplay,
        desktopDisplay,
        getCarrouselSizes,
        emblaRef
    }
}