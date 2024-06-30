export interface IYGOPDImage {
    id: number,
    image_url: string,
    image_url_cropped: string,
    image_url_small: string
}

export interface IYGOPDSet {
    set_name: string | undefined,
    set_code: string | undefined,
    set_price: string | undefined,
    set_rarity: string | undefined,
    set_rarity_code: string | undefined,
}

export interface IYGOPDCard {
    id: number,
    name: string,
    type: string,
    frameType: string,
    desc: string,
    atk: number | undefined,
    def: number | undefined,
    level: number | undefined,
    race: string,
    attribute: string | undefined,
    card_sets: IYGOPDSet[],
    card_images: IYGOPDImage[],
    card_prices: unknown[],
    ygoprodeck_url: string,
    archetype: string | undefined,
    linkval: number | undefined
}