const NORMAL_MONSTERS = [
    "Normal Monster",
    "Normal Tuner Monster",
    "Pendulum Normal Monster"
];
const EFFECT_MONSTERS = [
    "Effect Monster",
    "Tuner Monster",
    "Spirit Monster",
    "Union Effect Monster",
    "Gemini Monster",
    "Pendulum Effect Monster",
    "Pendulum Tuner Effect Monster",
    "Flip Effect Monster"
];
const RITUAL_MONSTERS = [
    "Ritual Effect Monster",
    "Pendulum Effect Ritual Monster"
];
const FUSION_MONSTERS = [
    "Fusion Monster"
];
const SYNCHRO_MONSTERS = [
    "Synchro Monster",
    "Synchro Tuner Monster",
    "Synchro Pendulum Effect Monster"
];
const XYZ_MONSTERS = [
    "XYZ Monster",
    "XYZ Pendulum Effect Monster"
];
const LINK_MONSTERS = [
    "Link Monster"
];
const MONSTER_TYPES = [
    ...NORMAL_MONSTERS,
    ...EFFECT_MONSTERS,
    ...RITUAL_MONSTERS,
    ...FUSION_MONSTERS,
    ...SYNCHRO_MONSTERS,
    ...XYZ_MONSTERS,
    ...LINK_MONSTERS
];
const SPELL_TRAP_TYPES = [
    "Spell Card",
    "Trap Card"
];
const SPELL_SUBTYPES = {
    "Normal": 0,
    "Quick-Play": 1,
    "Ritual": 2,
    "Equip": 3,
    "Continuous": 4,
    "Field": 5
}
const TRAP_SUBTYPES = {
    "Normal": 0,
    "Counter": 1,
    "Continuous": 2
}

export {
    NORMAL_MONSTERS,
    EFFECT_MONSTERS,
    RITUAL_MONSTERS,
    FUSION_MONSTERS,
    SYNCHRO_MONSTERS,
    XYZ_MONSTERS,
    LINK_MONSTERS,
    MONSTER_TYPES,
    SPELL_TRAP_TYPES,
    SPELL_SUBTYPES,
    TRAP_SUBTYPES
}