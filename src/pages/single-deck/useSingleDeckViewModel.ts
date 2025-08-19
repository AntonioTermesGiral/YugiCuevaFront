import { useLocation } from "react-router-dom";
import { useClient } from "../../client/useClient";
import { useEffect, useState } from "react";
import { Enums, Tables } from "../../database.types";
import { IMatch } from "../matches/data-load/match_data_interfaces";
import { buildMatchData, fetchMatchDataByDeck } from "../matches/data-load/match_data_loaders";
import { sortCardsInDeck } from "../../utils/sortHelper";

interface ICardSimpleData {
    type: string;
    level: number | null;
    linkval: number | null;
    atk: number | null;
    def: number | null;
    race_type: string;
}

export interface ICardSimpleDBData extends Tables<'card_in_deck'> {
    card: ICardSimpleData;
}

export interface IDeckContent {
    cardId: number;
    cardSimpleData: ICardSimpleData;
    qty: number;
    cardImage: string;
    position?: Enums<'CardPosition'>;
}

interface IDeckAuthorData {
    authorDisplayName: string;
    authorId: string;
    image: string;
}

interface IDeckScreenData {
    deckContents: IDeckContent[];
    deckData: Tables<'deck'>;
    authorData: IDeckAuthorData;
    matches: IMatch[]
}

export const useSingleDeckViewModel = () => {
    const { search } = useLocation();
    const { getInstance } = useClient();
    const [currentUserId, setCurrentUserId] = useState<string>();

    const [deckData, setDeckData] = useState<Tables<'deck'>>();
    const [content, setContent] = useState<IDeckContent[]>([]);
    const [authorData, setAuthorData] = useState<IDeckAuthorData>();
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [loading, setLoading] = useState(false);

    const loadDeckData = async (): Promise<IDeckScreenData | undefined> => {
        setLoading(true);
        const url = new URL(location.href);
        const deckID = url.searchParams.get("id");

        if (deckID) {
            const supabase = getInstance();

            const { data: { user: currentUser } } = await supabase.auth.getUser()
            setCurrentUserId(currentUser?.id);

            // Deck search by id
            const { data: deckData, error: deckError } = await supabase.from('deck').select().eq("id", deckID);
            deckError && console.error(deckError);

            // Links search by deck id
            const { data: linksData, error: linksError } = await supabase.from('card_in_deck').select(`
                card_id,
                quantity,
                position,
                card(
                    type,
                    level,
                    linkval,
                    atk,
                    def,
                    race_type
                )
                `).eq("deck_id", deckID);
            linksError && console.error(linksError);

            // Author search by id
            const { data: authorDN, error: authorError } = await supabase.from('profile').select('id,display_name,image').eq("id", deckData[0].owner);
            authorError && console.error(authorError);

            // Matches by deck
            const { matchesObj, matchesDataObj } = await fetchMatchDataByDeck(supabase, deckID);
            matchesObj.error && console.log(matchesObj.error);
            matchesDataObj.error && console.log(matchesDataObj.error);
            const matchesData = await buildMatchData(supabase, { matchesObj, matchesDataObj });

            const dContent = linksData.map((link: ICardSimpleDBData) => {
                return {
                    cardId: link.card_id,
                    cardImage: import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_URL + link.card_id + import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_EXT + "?ver=" + new Date().getTime(),
                    qty: link.quantity,
                    position: link.position,
                    cardSimpleData: link.card
                } as IDeckContent;
            });

            return {
                deckData: deckData[0],
                deckContents: sortCardsInDeck(dContent),
                authorData: {
                    authorDisplayName: authorDN[0].display_name,
                    authorId: authorDN[0].id,
                    image: import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + authorDN[0].image
                },
                matches: matchesData
            }
        }

        return undefined;
    }

    useEffect(() => {
        loadDeckData().then((res) => {
            setContent(res?.deckContents ?? []);
            setDeckData(res?.deckData);
            setAuthorData(res?.authorData);
            setMatches(res?.matches ?? []);
        }).finally(() => setTimeout(() => setLoading(false), 500));
    }, [search]);


    return {
        currentUserId,
        deckData,
        content,
        authorData,
        matches,
        loading
    }
}