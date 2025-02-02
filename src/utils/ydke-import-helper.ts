import { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "../database.types";
import { IYGOPDCard } from "../constants/types";

export const countCodes = (codes: number[]) => {
    const res = new Map<number, number>;
    codes.forEach((code) => {
        const currentQuantity = res.get(code);
        res.set(code, (currentQuantity ?? 0) + 1);
    })

    return res;
};

export const getCardsInDBByIds = async (ids: number[], supabase: SupabaseClient): Promise<number[]> => {
    const { data, error } = await supabase.from('card').select('id').in('id', ids);
    console.log(data, error);
    return (data as Tables<'card'>[]).map(c => c.id) ?? [];
}

export const importCards = async (cardList: number[]): Promise<IYGOPDCard[]> => {
    if (cardList.length > 0) {
        const mainRequestString = cardList.join(",");
        console.log(mainRequestString);

        const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?id=' + mainRequestString).then(res => res.text());
        return JSON.parse(res).data;
    }

    return [];
}

export const exportCards = async (cards: Tables<'card'>[], supabase: SupabaseClient) => {
    if (cards.length > 0) {
        const { data, error } = await supabase.from('card').insert(cards).select();
        console.log(data, error);
        if (error) throw new Error("No se ha podido exportar")
    }
}

export const linkCards = async (cardsData: Tables<'card_in_deck'>[], supabase: SupabaseClient) => {
    const { data, error } = await supabase.from('card_in_deck').insert(cardsData).select();
    console.log(data, error);
}