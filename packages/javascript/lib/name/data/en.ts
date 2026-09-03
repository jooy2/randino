import { words } from '../../_internal/parse.js';
import { WESTERN_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const EN: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [4, 8], last: [4, 8], middle: [4, 8] },
	last: words(`
		Smith Johnson Williams Brown Jones Miller Davis Wilson Anderson Taylor Thomas
		Moore Jackson Martin Lee Clark Lewis Walker Hall Allen Young King Wright Scott
		Green Baker Adams Nelson Carter Clover Bennett Foster Hughes Cooper Reed Harris
		Thompson White Robinson Turner Phillips Campbell Parker Evans Edwards Collins
		Stewart Morris Rogers Morgan Bell Murphy Bailey Cook Cox Howard Ward Richardson
		Watson Brooks Kelly Sanders Price Gray Hayes Myers Ford Hamilton Graham Sullivan
		Wallace Woods Cole Palmer Robertson Fisher Ellis Harrison Gibson Marshall Wells
		Webb Simpson Stevens Tucker Porter Hunter Hicks Crawford Henry Boyd Mason Dixon
		Fowler Grant Knight Lawson Newman Osborne Pearce Quinn Riley Sharp Todd Vaughn
		Warren Barnes Chapman Dawson Freeman Gardner Holland Ingram Jennings Lambert
		Mills Norton Owens Payne Reeves Shaw Bryant Butler Coleman Doyle Ferguson
		Fleming Gordon Hopkins Manning Mercer Nichols Norris Pearson Reynolds Sherman
		Sutton Thornton Walton Whitaker Abbott Bradley Bishop Donovan Elliott Rhodes
		Sinclair Walsh Yates Keller Tate
	`),
	male: words(`
		James William Oliver Henry Jack Noah Ethan Liam Lucas Benjamin Alexander Daniel
		Matthew Samuel David Michael Joseph Nathan Ryan Andrew Thomas Charles Gabriel
		Julian Adam Nicholas Aaron Christian Owen Dylan Isaac Leo Max George Eric Jacob
		Logan Mason Elijah Caleb Wyatt Grayson Levi Hunter Connor Evan Nolan Cole Miles
		Jasper Theodore Oscar Felix Simon Vincent Patrick Peter Paul Mark Steven Brian
		Kevin Justin Jason Timothy Gregory Edward Arthur Albert Frank Harry Alan Neil
		Craig Dean Glenn Ross Todd Wayne Bruce Roger Keith Curtis Marcus Trevor Shane
		Blake Chase Drew Brett Colin Derek Eliot Finn Grant Hugh Ian Jared Kyle Lance
		Mitchell Nash Perry Quentin Reid Seth Tyler Victor Walter Zachary Preston
		Spencer Tristan Emmett Rowan Silas Declan Everett Beckett Rhys Callum Xavier
		Quinn Anthony Joshua Brandon Emerson Dominic Cameron Austin Jordan Travis
		Douglas Russell Raymond Philip Dennis Jerome Leonard Bernard Eugene Duncan
		Malcolm Alistair Lachlan Rory Ronan Aidan Brendan Kieran Gavin Stuart Jonathan
		Frederick Lawrence Wesley Garrett Ezra Sawyer Landon Easton Gideon Tobias
	`),
	female: words(`
		Emma Olivia Ava Sophia Isabella Charlotte Amelia Mia Harper Evelyn Abigail Emily
		Grace Chloe Victoria Lily Hannah Zoe Ella Scarlett Aria Layla Nora Hazel Aurora
		Violet Ruby Alice Claire Stella Ivy Rose Eva Naomi Julia Sarah Madison Avery
		Riley Penelope Lucy Anna Caroline Nova Willow Elena Maya Leah Audrey Savannah
		Bella Skylar Paisley Everly Kennedy Piper Lydia Peyton Sadie Alexa Josephine
		Eliza Vivian Clara Delilah Isla Adeline Cora Iris Jasmine Juliette Faith Hope
		Daisy Poppy Ruth Esther Margaret Catherine Helen Diana Laura Rachel Rebecca
		Megan Nicole Amanda Melissa Jennifer Michelle Kimberly Amy Angela Heather Wendy
		Paula Tessa Bonnie Sylvia Vera Nina Elsie Freya Maisie Rosie Edith Beatrix Gemma
		Imogen Norah Opal Pearl Quinn Sienna Talia Ursula Verity Wren Ximena Yvonne Zara
		Sophie Eleanor Natalie Kayla Brooke Danielle Stephanie Christina Veronica
		Melanie Erica Joanna Beverly Marilyn Doris Gloria Irene Judith Louise Phoebe
		Rosalie Matilda Harriet Florence Genevieve Cecilia Beatrice Miriam Marina
		Sabrina Adelaide Arabella Bridget Cordelia Rosemary Holly Summer Autumn Juniper
		Nadia
	`),
	syn: WESTERN_SYLLABLES
};
