// What an invented fictional name or place is kept from coming out as. The
// syllables and halves are chosen so that hardly any pair spells one of these;
// the lists hold the pairs that still do, and `test/fictional.test.ts` walks
// every pair there is to keep them whole, and to keep off them anything no pair
// can spell.

/**
 * The words, written in Latin letters, whose spelling in some script is a real
 * country (`Albania`, and `Senegar`, which is `セネガル`), a character or a place
 * a well-known work made up (`Arwen`, `Riverwood`), or a famous real place
 * (`Hollywood`).
 */
export const FICTIONAL_AVOID = `
Albania Armenia Romania Italia Karelia Servia Iran Ilan Olan Oran Fenlan Fenran Malta
Senegar Dania Gana Marta Rosia Itaria Almenia Alvania Arbania Lumania Kathar Livia Selvia Namivia
Arthas Arwen Davos Saria Rosaria Riven Garen Draven Varian Arnor Mordor Dalaran
Valoran Rivia
Hollywood Silverstone Westfield
Redridge Moonbrook Oakvale Riverwood Riverdale Hartford Glendale Copperfield
Kingston Ravencrest Ravenholm Westmarch Winterfell
`;

/**
 * Runs of letters no invented word may hold, in any of its five spellings: two
 * syllables that are harmless apart can meet on a word a language reads as an
 * obscenity, the way `a` + `na` + `lan` does in English and `ле` + `ба` + `лан`
 * in Russian. A word that holds one is put together again.
 */
export const FICTIONAL_AVOID_INSIDE = `
anal срал ебал
`;
