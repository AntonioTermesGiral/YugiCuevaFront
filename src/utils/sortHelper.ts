import { EFFECT_MONSTERS, FUSION_MONSTERS, LINK_MONSTERS, MONSTER_TYPES, NORMAL_MONSTERS, RITUAL_MONSTERS, SPELL_SUBTYPES, SPELL_TRAP_TYPES, SYNCHRO_MONSTERS, TRAP_SUBTYPES, XYZ_MONSTERS } from "../constants/sortHelperTypes";
import { Tables } from "../database.types";
import { ISimpleBanlistData } from "../pages/banlist/useBanlistViewModel";
import { ICardSimpleData, IDeckContent } from "../pages/single-deck/useSingleDeckViewModel";

const isMonster = (type: string) => MONSTER_TYPES.includes(type);
const isST = (type: string) => SPELL_TRAP_TYPES.includes(type);
const isSpell = (type: string) => type === "Spell Card";
const isTrap = (type: string) => type === "Trap Card";

const assignMonsterTypeValue = (monsterType: string) => {
    switch (true) {
        case NORMAL_MONSTERS.includes(monsterType):
            return 0;
        case EFFECT_MONSTERS.includes(monsterType):
            return 1;
        case RITUAL_MONSTERS.includes(monsterType):
            return 2;
        case FUSION_MONSTERS.includes(monsterType):
            return 3;
        case SYNCHRO_MONSTERS.includes(monsterType):
            return 4;
        case XYZ_MONSTERS.includes(monsterType):
            return 5;
        case LINK_MONSTERS.includes(monsterType):
            return 6;
        default:
            return 7;
    }
}

const compareMonsters = (a: ICardSimpleData, b: ICardSimpleData) => {
    // Check monsters by Normal/Effect/Ritual
    const typeValA = assignMonsterTypeValue(a.type);
    const typeValB = assignMonsterTypeValue(b.type);
    if (typeValA !== typeValB)
        return typeValA - typeValB;

    // Check monsters by Level
    const levelA = a.level ?? 0;
    const levelB = b.level ?? 0;
    if (levelA !== levelB)
        return levelB - levelA;

    // Check monsters by atk
    const atkA = a.atk ?? 0;
    const atkB = b.atk ?? 0;
    if (atkA !== atkB)
        return atkB - atkA;

    // Check monsters by def
    const defA = a.def ?? 0;
    const defB = b.def ?? 0;
    if (defA !== defB)
        return defB - defA;

    return 0;
}

const compareSpells = (a: ICardSimpleData, b: ICardSimpleData) => {
    const aRace = a.race_type as keyof typeof SPELL_SUBTYPES;
    const bRace = b.race_type as keyof typeof SPELL_SUBTYPES;
    return SPELL_SUBTYPES[aRace] - SPELL_SUBTYPES[bRace];
}

const compareTraps = (a: ICardSimpleData, b: ICardSimpleData) => {
    const aRace = a.race_type as keyof typeof TRAP_SUBTYPES;
    const bRace = b.race_type as keyof typeof TRAP_SUBTYPES;
    return TRAP_SUBTYPES[aRace] - TRAP_SUBTYPES[bRace];
}


const sortCardsInDeck = (cardList: IDeckContent[] | ISimpleBanlistData[]) => {
    return cardList.sort((a, b) => {
        const aType = a.cardSimpleData.type;
        const bType = b.cardSimpleData.type;

        // Monster comparations
        if (isMonster(aType) && isST(bType))
            return -1;
        else if (isST(aType) && isMonster(bType))
            return 1;
        else if (isMonster(aType) && isMonster(bType))
            return compareMonsters(a.cardSimpleData, b.cardSimpleData);
        // Spell & Trap comparations
        else if (isSpell(aType) && isTrap(bType))
            return -1;
        else if (isTrap(aType) && isSpell(bType))
            return 1;
        else if (isSpell(aType) && isSpell(bType))
            return compareSpells(a.cardSimpleData, b.cardSimpleData);
        else if (isTrap(aType) && isTrap(bType))
            return compareTraps(a.cardSimpleData, b.cardSimpleData);
        else return 0;
    });
}

const deckTierComparator = (a: Tables<"deck">, b: Tables<"deck">) => {
    const aTier = a.tier !== null ? a.tier : Infinity;
    const bTier = b.tier !== null ? b.tier : Infinity;
    return aTier - bTier;
}

export {
    sortCardsInDeck,
    deckTierComparator
}