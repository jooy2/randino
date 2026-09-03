// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/name/data/syllables.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/types.dart';

/// The English name dataset.
final NameLanguageData en = NameLanguageData(
  order: NameOrder.givenFirst,
  joiner: ' ',
  hasMiddle: true,
  roman: RomanMode.fold,
  lengthSpec: NameLengthSpec(
    given: LengthRange(4, 8),
    last: LengthRange(4, 8),
    middle: LengthRange(4, 8),
  ),
  last: pool(r'''
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
    Sinclair Walsh Yates Keller Tate Ackerman Aldridge Alcott Ashford Atwood
    Bancroft Barlow Barrett Bartlett Beaumont Benson Berkeley Blackwood Blythe
    Bolton Bradshaw Braxton Bridges Brockman Buchanan Cadogan Calloway Carlisle
    Carrington Chadwick Chambers Chandler Chesterton Clayton Cleveland Clifton
    Compton Coventry Cromwell Crowther Cunningham Dalton Danvers Davenport Delaney
    Dempsey Devereux Dorset Driscoll Duncan Eastwood Edgerton Ellsworth Everard
    Fairbanks Fairfax Falconer Fenwick Fitzgerald Fleetwood Foxwell Galloway Garland
    Gatsby Godwin Granger Greenwood Grimshaw Halloway Hampton Harcourt Hargrove
    Harlow Hathaway Haverford Hawthorne Hayward Heathcote Hollis Huntington
    Ingersoll Kingsley Langdon Larkin Lockwood
  '''),
  male: pool(r'''
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
    Frederick Lawrence Wesley Garrett Ezra Sawyer Landon Easton Gideon Tobias Abel
    Adrian Alfred Angus Barnaby Bennett Bertram Blaine Bradley Brennan Bryson
    Caspian Cedric Clifford Clinton Conrad Corbin Cyrus Dalton Damian Darius Desmond
    Dexter Donald Dorian Edmund Edwin Elias Ellis Emory Ernest Esmond Fabian
    Fletcher Floyd Francis Franklin Gareth Gerald Gilbert Godfrey Gordon Graham
    Harold Harvey Herbert Horace Howard Hugo Humphrey Isaiah Jonah Joel Julius
    Keaton Kenneth Lawson Leland Lionel Lloyd Magnus Marlon Maurice Maxwell Miller
    Milton Morgan Nathaniel Nigel Norman Orson Osborn Percival Phineas Quincy
    Randolph Reginald
  '''),
  female: pool(r'''
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
    Nadia Abigale Adele Agatha Agnes Alberta Althea Amara Amelie Annabel Antonia
    Arden Ariadne Astrid Aveline Belinda Bernice Bethany Beverley Blythe Bridgette
    Bronwyn Camille Carmen Cassandra Cecily Celeste Celia Charity Clarissa
    Clementine Colette Constance Coraline Cressida Daphne Deirdre Delia Dorothea
    Eartha Edwina Eileen Elaine Eloise Elspeth Emmeline Enid Estelle Etta Evangeline
    Fenella Fiona Flora Frances Georgia Georgina Geraldine Gwendolyn Helena
    Henrietta Hilda Honora Imelda Ingrid Isadora Isolde Jacinta Jemima Jessamine
    Josie Juno Katrina Lorna Mabel Madeline Maren
  '''),
  syn: westernSyllables,
);
