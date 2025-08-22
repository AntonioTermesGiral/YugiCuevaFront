import { useClient } from "../../client/useClient";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { sortCardsInDeck } from "../../utils/sortHelper";
import { ICardSimpleData } from "../single-deck/useSingleDeckViewModel";

export interface IBanlistCard extends Tables<"banlist"> {
    image: string;
}

interface ICardSimpleBanlistDBData extends Tables<'banlist'> {
    card: ICardSimpleData;
}

export interface ISimpleBanlistData extends Tables<"banlist"> {
    cardSimpleData: ICardSimpleData
}

export const useBanlistViewModel = () => {
    const { getInstance } = useClient();

    const [content, setContent] = useState<IBanlistCard[]>([]);
    const [loading, setLoading] = useState(false);

    const loadDeckData = async (): Promise<IBanlistCard[]> => {
        setLoading(true);
        const supabase = getInstance();
        const { data, error } = await supabase.from('banlist').select(`
            id,
            format,
            restriction,
            card(
                type,
                level,
                linkval,
                atk,
                def,
                race_type
            )
            `).eq("format", "TCG");
        error && console.log("Error while loading banlist", error);
        console.log(data)

        const dbData = data.map((itm: ICardSimpleBanlistDBData) => {
            return {
                ...itm,
                cardSimpleData: itm.card
            } as ISimpleBanlistData;
        })

        

        return sortCardsInDeck(dbData as ISimpleBanlistData[]).map((itm) => {
            return {
                ...itm,
                image: import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_URL + (itm as ISimpleBanlistData).id + import.meta.env.VITE_SUPABASE_CARD_IMG_BUCKET_EXT + "?ver=" + new Date().getTime()
            } as IBanlistCard;
        });
    }

    useEffect(() => {
        loadDeckData().then((res) => {
            setContent(res ?? []);
        }).finally(() => setTimeout(() => setLoading(false), 500));
    }, []);


    return {
        content,
        loading
    }
}