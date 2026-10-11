// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

// Written once, with the gender each noun carries; `taggedNouns` splits the tags
// back off into the lookup the modifiers agree against.
final TaggedNouns _nouns = taggedNouns(<WordTheme, String>{
  WordTheme.animal: r'''
    gato:m perro:m león:m tigre:m leopardo:m guepardo:m zorro:m lobo:m oso:m panda:m
    nutria:f conejo:m ardilla:f elefante:m ciervo:m caballo:m burro:m vaca:f toro:m cabra:f
    oveja:f cerdo:m mono:m gorila:m cocodrilo:m serpiente:f lagarto:m tortuga:f rana:f
    sapo:m pájaro:m golondrina:f gorrión:m cuervo:m halcón:m águila:f pavo_real:m loro:m
    búho:m paloma:f grulla:f cisne:m pato:m ganso:m gallina:f pez:m ballena:f delfín:m
    tiburón:m pulpo:m calamar:m gamba:f cangrejo:m caracol:m mariposa:f abeja:f hormiga:f
    araña:f libélula:f cigarra:f mosca:f mosquito:m gusano:m murciélago:m erizo:m mapache:m
    tejón:m lince:m bisonte:m alce:m camello:m koala:m perezoso:m hurón:m topo:m garza:f
    pelícano:m morsa:f comadreja:f gacela:f cebra:f búfalo:m foca:f pingüino:m avestruz:m
    jabalí:m reno:m antílope:m ñu:m jirafa:f hipopótamo:m rinoceronte:m suricata:f
    armadillo:m puercoespín:m castor:m ornitorrinco:m canguro:m lémur:m chimpancé:m
    orangután:m babuino:m tapir:m mirlo:m ruiseñor:m alondra:f codorniz:f faisán:m perdiz:f
    colibrí:m tucán:m cigüeña:f abubilla:f jilguero:m urraca:f arrendajo:m anguila:f
    sardina:f atún:m bacalao:m merluza:f trucha:f salmón:m carpa:f raya:f medusa:f almeja:f
    mejillón:m ostra:f escarabajo:m saltamontes:m grillo:m avispa:f polilla:f luciérnaga:f
    ciempiés:m escorpión:m pulga:f oruga:f iguana:f camaleón:m salamandra:f tritón:m boa:f
    víbora:f cobra:f pitón:f gallo:m pavo:m rata:f hámster:m liebre:f gaviota:f lechuza:f
    pantera:f jaguar:m hiena:f cucaracha:f langosta:f orca:f ratón:m potro:m dinosaurio:m
    mamut:m cordero:m ternero:m cachorro:m polluelo:m yegua:f mula:f poni:m cobaya:f
    periquito:m canario:m cotorra:f guacamayo:m buitre:m cóndor:m gavilán:m petirrojo:m
    pájaro_carpintero:m tórtola:f pinzón:m albatros:m cormorán:m emú:m puma:m coyote:m
    chacal:m marmota:f mofeta:f llama:f alpaca:f dromedario:m corzo:m lagartija:f caimán:m
    anaconda:f ajolote:m renacuajo:m león_marino:m manatí:m narval:m cachalote:m beluga:f
    lubina:f lenguado:m boquerón:m caballa:f pez_espada:m piraña:f caballito_de_mar:m
    estrella_de_mar:f bogavante:m mariquita:f piojo:m garrapata:f termita:f abejorro:m
    mantis:f babosa:f lombriz:f sanguijuela:f tarántula:f
  ''',
  WordTheme.object: r'''
    botella:f lápiz:m goma:f paraguas:m lámpara:f farol:m espejo:m llave:f candado:m bolsa:f
    botón:m aguja:f hilo:m pincel:m pintura:f papel:m cuaderno:m carta:f postal:f sello:m
    mapa:m catalejo:m microscopio:m cámara:f película:f radio:f vela:f ancla:f linterna:f
    cerilla:f maceta:f tetera:f taza:f cuchara:f plato:m olla:f engranaje:m resorte:m imán:m
    cinta:f sobre:m cesta:f escoba:f silbato:m cuerda:f cubo:m abanico:m escudo:m red:f
    caña:f jarra:f campanilla:f embudo:m bandeja:f caja:f barril:m lata:f frasco:m brújula:f
    llavero:m alfiler:m dedal:m ovillo:m cordel:m soga:f gancho:m clavo:m tornillo:m
    tuerca:f arandela:f bisagra:f cerrojo:m pestillo:m cadena:f cremallera:f hebilla:f
    broche:m pulsera:f anillo:m maletín:m mochila:f baúl:m arcón:m tonel:m vasija:f
    cántaro:m botijo:m cuenco:m colador:m mortero:m pinza:f telescopio:m libro:m revista:f
    periódico:m calendario:m agenda:f foto:f bolígrafo:m tiza:f pegamento:m carpeta:f
    tinta:f pluma:f lupa:f cantimplora:f mechero:m esponja:f trapo:m fregona:f alambre:m
    palo:m bastón:m sombrilla:f ladrillo:m teja:f estatua:f despertador:m tenedor:m
    cuchillo:m vaso:m cazuela:f cazo:m pajita:f salero:m tarro:m tapón:m corcho:m pegatina:f
    lazo:m saco:m cofre:m estuche:m horquilla:f bolso:m maleta:f monedero:m pasaporte:m
    collar:m pendiente:m colgante:m cascabel:m reloj_de_arena:m papelera:f regalo:m
    bandera:f letrero:m chincheta:f grapa:f clip:m sacapuntas:m rotulador:m cartulina:f
    folio:m diario:m cenicero:m palillo:m buzón:m incienso:m tapadera:f muleta:f pergamino:m
    espada:f lanza:f flecha:f daga:f ballesta:f látigo:m cerradura:f fiambrera:f riñonera:f
    prismáticos:p antorcha:f imperdible:m cartón:m cómic:m diccionario:m enciclopedia:f
    lienzo:m insignia:f pancarta:f
  ''',
  WordTheme.nature: r'''
    mar:m río:m lago:m cascada:f valle:m montaña:f colina:f pradera:f bosque:m cueva:f
    desierto:m arena:f roca:f guijarro:m volcán:m terremoto:m glaciar:m arrecife:m pantano:m
    arroyo:m bahía:f duna:f cumbre:f páramo:m estepa:f sabana:f humedal:m estuario:m delta:m
    laguna:f atolón:m fiordo:m cala:f cabo:m península:f istmo:m archipiélago:m islote:m
    meseta:f cañón:m acantilado:m grieta:f morrena:f pedregal:m peñasco:m bajío:m escollo:m
    abismo:m géiser:m fumarola:f sumidero:m estalactita:f estalagmita:f gruta:f repisa:f
    ladera:f sombra:f eco:m brasa:f manantial:m orilla:f litoral:m selva:f llanura:f
    tundra:f marisma:f ciénaga:f oasis:m dehesa:f cañada:f torrente:m remanso:m vado:m
    ribera:f playa:f costa:f golfo:m ensenada:f estrecho:m canal:m corriente:f marea:f
    oleaje:m espuma:f rompiente:f farallón:m risco:m cima:f hondonada:f barranco:m sima:f
    caverna:f cielo:m tierra:f isla:f océano:m piedra:f polvo:m barro:m hielo:m fuego:m
    chispa:f ola:f charco:m estanque:m precipicio:m cordillera:f desfiladero:m pozo:m nido:m
    madriguera:f guarida:f paisaje:m luz:f oscuridad:f aire:m lava:f magma:m erupción:f
    avalancha:f inundación:f incendio:m hoguera:f reflejo:m huella:f surco:m fósil:m
    concha:f grava:f arcilla:f iceberg:m témpano:m meandro:m afluente:m cauce:m
    desembocadura:f taiga:f manglar:m arboleda:f matorral:m maleza:f cerro:m burbuja:f
    espejismo:m naturaleza:f suelo:m continente:m trópico:m cayo:m vertiente:f cuenca:f
    tsunami:m vapor:m marejada:f pampa:f altiplano:m quebrada:f cenote:m
  ''',
  WordTheme.plant: r'''
    árbol:m hoja:f flor:f raíz:f semilla:f fruto:m musgo:m helecho:m bambú:m pino:m arce:m
    cerezo:m rosa:f loto:m crisantemo:m orquídea:f girasol:m nenúfar:m hierba:f rama:f
    brote:m capullo:m pétalo:m polen:m bellota:f ginkgo:m sauce:m abedul:m cedro:m abeto:m
    roble:m castaño:m nogal:m césped:m alga:f seto:m ramo:m cactus:m áloe:m manzanilla:f
    lavanda:f enredadera:f palmera:f tallo:m corteza:f savia:f espina:f zarza:f hiedra:f
    muérdago:m acebo:m laurel:m olivo:m higuera:f naranjo:m manzano:m almendro:m avellano:m
    chopo:m álamo:m fresno:m olmo:m tilo:m haya:f alerce:m secuoya:f eucalipto:m acacia:f
    magnolia:f camelia:f begonia:f petunia:f geranio:m clavel:m margarita:f amapola:f
    jacinto:m narciso:m tulipán:m azucena:f dalia:f peonía:f trébol:m junco:m carrizo:m
    ortiga:f cardo:m tronco:m hongo:m liquen:m espiga:f vid:f arbusto:m paja:f heno:m
    bulbo:m tubérculo:m resina:f espora:f moho:m follaje:m ciprés:m encina:f alcornoque:m
    limonero:m peral:m ciruelo:m granado:m morera:f cocotero:m baobab:m tejo:m boj:m brezo:m
    retama:f lirio:m jazmín:m hortensia:f azalea:f gardenia:f buganvilla:f mimosa:f
    caléndula:f adelfa:f lúpulo:m diente_de_león:m esqueje:m planta:f gladiolo:m nardo:m
    madreselva:f glicinia:f enebro:m madroño:m jacarandá:m ceiba:f algarrobo:m mimbre:m
    chumbera:f agave:m bonsái:m alhelí:m gerbera:f jara:f cáñamo:m anémona:f
  ''',
  WordTheme.gem: r'''
    oro:m plata:f cobre:m hierro:m acero:m bronce:m latón:m estaño:m zinc:m platino:m
    cristal:m cuarzo:m amatista:f ágata:f ámbar:m perla:f jade:m ópalo:m obsidiana:f
    mármol:m granito:m caliza:f basalto:m pedernal:m meteorito:m mineral:m gema:f lingote:m
    mica:f fluorita:f calcita:f malaquita:f granate:m azufre:m marfil:m pepita:f grafito:m
    mercurio:m yeso:m veta:f olivino:m turmalina:f rubí:m zafiro:m esmeralda:f topacio:m
    circón:m pirita:f magnetita:f hematita:f cinabrio:m galena:f talco:m bismuto:m níquel:m
    titanio:m aluminio:m plomo:m wolframio:m cobalto:m cromo:m manganeso:m litio:m uranio:m
    lapislázuli:m cornalina:f jaspe:m ónice:m berilo:m espinela:f peridoto:m alabastro:m
    pizarra:f arenisca:f esquisto:m gneis:m cuarcita:f toba:f dolomita:f apatito:m barita:f
    corindón:m feldespato:m moscovita:f siderita:f limonita:f bauxita:f diamante:m joya:f
    vidrio:m porcelana:f cerámica:f sodio:m potasio:m calcio:m magnesio:m silicio:m
    carbono:m paladio:m iridio:m vanadio:m citrino:m aventurina:f heliotropo:m azurita:f
    rodonita:f sodalita:f labradorita:f tanzanita:f alejandrita:f piedra_pómez:f
    piedra_lunar:f ojo_de_tigre:m escoria:f filón:m adoquín:m losa:f travertino:m pórfido:m
    hulla:f lignito:m sílice:f cal:f carbón:m metal:m aleación:f hojalata:f chatarra:f
    cemento:m hormigón:m geoda:f
  ''',
  WordTheme.concept: r'''
    libertad:f paz:f justicia:f verdad:f sabiduría:f memoria:f imaginación:f cuento:m
    poema:m boceto:m gramática:f lógica:f física:f química:f biología:f filosofía:f
    matemática:f geometría:f álgebra:f historia:f mito:m leyenda:f fábula:f refrán:m
    acertijo:m secreto:m promesa:f viaje:m aventura:f travesía:f hallazgo:m experimento:m
    pregunta:f respuesta:f debate:m consejo:m fiesta:f dimensión:f equilibrio:m ritual:m
    costumbre:f cultura:f idioma:m alfabeto:m cifra:f archivo:m almanaque:m horizonte:m
    intuición:f razón:f juicio:m doctrina:f teorema:m axioma:m hipótesis:f paradoja:f
    dilema:m paradigma:m premisa:f deducción:f inducción:f analogía:f metáfora:f símbolo:m
    crónica:f testimonio:m manifiesto:m tratado:m alianza:f linaje:m legado:m tradición:f
    ceremonia:f umbral:m verso:m prosa:f relato:m ensayo:m tesis:f síntesis:f análisis:m
    método:m teoría:f práctica:f técnica:f arte:m ciencia:f ética:f estética:f retórica:f
    dialéctica:f semántica:f ortografía:f caligrafía:f enigma:m certeza:f azar:m destino:m
    suerte:f fortuna:f voluntad:f conciencia:f identidad:f esencia:f materia:f forma:f
    causa:f efecto:m orden:m caos:m límite:m origen:m honor:m gloria:f fama:f valor:m
    milagro:m misterio:m sueño:m idea:f pensamiento:m opinión:f fe:f problema:m solución:f
    plan:m proyecto:m política:f economía:f sociedad:f guerra:f novela:f palabra:f frase:f
    número:m círculo:m triángulo:m medicina:f literatura:f poesía:f conocimiento:m lección:f
    misión:f amistad:f belleza:f ley:f derecho:m poder:m letra:f movimiento:m vida:f
    muerte:f mundo:m mentira:f realidad:f fantasía:f significado:m virtud:f pecado:m éxito:m
    fracaso:m peligro:m oportunidad:f necesidad:f estilo:m moda:f salud:f religión:f
    nación:f examen:m tarea:f chiste:m broma:f fórmula:f ecuación:f geografía:f psicología:f
    arquitectura:f escultura:f fotografía:f noticia:f dibujo:m nombre:m tamaño:m peso:m
    distancia:f velocidad:f fuerza:f energía:f
  ''',
  WordTheme.myth: r'''
    alma:f hechizo:m maldición:f profecía:f oráculo:m amuleto:m talismán:m runa:f ídolo:m
    tótem:m augurio:m presagio:m bestiario:m conjuro:m sortilegio:m grimorio:m pentáculo:m
    reliquia:f cáliz:m grial:m varita:f báculo:m cetro:m corona:f poción:f elixir:m
    bendición:f magia:f alquimia:f brujería:f caldero:m bola_de_cristal:f tridente:m
    piedra_filosofal:f vellocino:m ambrosía:f inframundo:m paraíso:m infierno:m limbo:m
    purgatorio:m ofrenda:f invocación:f exorcismo:m aura:f inmortalidad:f reencarnación:f
    maná:m nigromancia:f adivinación:f teletransporte:m levitación:f transmutación:f
    mal_de_ojo:m vudú:m fetiche:m tarot:m horóscopo:m astrología:f karma:m nirvana:m
    más_allá:m Valhalla:m Atlántida:f sacrificio:m arcano:m agua_bendita:f cornucopia:f
    resurrección:f chakra:m éter:m chamanismo:m clarividencia:f telepatía:f telequinesis:f
    invisibilidad:f alfombra_mágica:f aquelarre:m quiromancia:f numerología:f ectoplasma:m
  ''',
  WordTheme.monster: r'''
    dragón:m fénix:m unicornio:m sirena:f hada:f duende:m elfo:m enano:m trol:m ogro:m
    gigante:m quimera:f hidra:f grifo:m centauro:m minotauro:m esfinge:f pegaso:m kraken:m
    basilisco:m gólem:m vampiro:m hombre_lobo:m espectro:m fantasma:m espíritu:m demonio:m
    ángel:m dios:m diosa:f semidiós:m titán:m ninfa:f náyade:f dríade:f nereida:f oréade:f
    valquiria:f musa:f parca:f erinia:f sátiro:m fauno:m arpía:f gorgona:f lamia:f cíclope:m
    coloso:m leviatán:m behemot:m serpiente_marina:f gnomo:m trasgo:m ondina:f silfo:m
    sílfide:f elemental:m aparición:f ánima:f hipogrifo:m mantícora:f cocatriz:f guiverno:m
    gárgola:f homúnculo:m momia:f zombi:m necrófago:m monstruo:m bestia:f criatura:f yeti:m
    chupacabras:m orco:m querubín:m serafín:m súcubo:m íncubo:m extraterrestre:m marciano:m
    humanoide:m mutante:m nahual:m cadejo:m chaneque:m ciguapa:f imbunche:m lobisón:m
    pishtaco:m muki:m cuélebre:m xana:f ojáncano:m anjana:f hombre_del_saco:m sacamantecas:m
    basajaun:m
  ''',
  WordTheme.job: r'''
    caballero:m cazador:m ladrón:m pirata:m marinero:m capitán:m cocinero:m jardinero:m
    herrero:m detective:m poeta:m pintor:m bailarín:m payaso:m viajero:m peregrino:m monje:m
    arquero:m espadachín:m guerrero:m general:m soldado:m guardia:m portero:m rey:m reina:f
    príncipe:m princesa:f emperador:m mayordomo:m criada:f sirviente:m mercader:m granjero:m
    pescador:m pastor:m leñador:m barquero:m cochero:m piloto:m ingeniero:m cartero:m
    repartidor:m barrendero:m bombero:m policía:m médico:m enfermero:m farmacéutico:m
    veterinario:m maestro:m alumno:m periodista:m escritor:m editor:m traductor:m cantante:m
    actor:m director:m músico:m minero:m carpintero:m alfarero:m sastre:m adivino:m
    profeta:m sacerdote:m erudito:m doctor:m inventor:m explorador:m atleta:m árbitro:m
    acróbata:m escultor:m guía:m relojero:m panadero:m cervecero:m perfumista:m curtidor:m
    tejedor:m abogado:m juez:m notario:m contable:m banquero:m cajero:m dependiente:m
    camarero:m conserje:m azafata:f maquinista:m conductor:m taxista:m mecánico:m
    fontanero:m albañil:m vidriero:m joyero:m zapatero:m sombrerero:m modista:f peluquero:m
    barbero:m pastelero:m carnicero:m frutero:m florista:m librero:m arqueólogo:m
    astrónomo:m biólogo:m geólogo:m botánico:m historiador:m filósofo:m archivero:m
    cosmonauta:m astronauta:m profesor:m científico:m programador:m arquitecto:m dentista:m
    cirujano:m electricista:m ganadero:m recepcionista:m secretario:m vendedor:m
    empresario:m alcalde:m ministro:m embajador:m espía:m verdugo:m mensajero:m bufón:m
    juglar:m malabarista:m fotógrafo:m diseñador:m socorrista:m guardabosques:m centinela:m
    navegante:m almirante:m sargento:m coronel:m brujo:m bruja:f mago:m nigromante:m
    alquimista:m druida:m sabio:m hechicero:m chamán:m trabajador:m obrero:m empleado:m
    funcionario:m tendero:m campesino:m psicólogo:m fisioterapeuta:m fiscal:m político:m
    presidente:m duque:m conde:m escudero:m bardo:m paladín:m mercenario:m gladiador:m
    samurái:m ninja:m asesino:m investigador:m químico:m informático:m técnico:m artista:m
    pianista:m guitarrista:m productor:m locutor:m presentador:m intérprete:m
    bibliotecario:m camionero:m cerrajero:m costurera:f esteticista:m masajista:m
    futbolista:m ciclista:m boxeador:m torero:m jinete:m domador:m guardaespaldas:m
    basurero:m teniente:m comandante:m economista:m obispo:m compositor:m cantautor:m
  ''',
  WordTheme.music: r'''
    piano:m guitarra:f tambor:m campana:f arpa:f canción:f danza:f ritmo:m melodía:f
    acorde:m flauta:f trompeta:f saxofón:m clarinete:m oboe:m violonchelo:m viola:f violín:m
    batería:f platillo:m pandereta:f xilófono:m órgano:m armónica:f acordeón:m laúd:m
    mandolina:f banjo:m partitura:f nota:f silencio:m escala:f coro:m solo:m concierto:m
    escenario:m interludio:m final:m compás:f orquesta:f dúo:m trío:m cuarteto:m quinteto:m
    octava:f semitono:m clave:f pentagrama:m metrónomo:m pedal:m traste:m boquilla:f
    contrabajo:m fagot:m corno:m trombón:m tuba:f trompa:f gaita:f zampoña:f ocarina:f
    caramillo:m dulzaina:f bandurria:f cítara:f salterio:m maraca:f güiro:m castañuela:f
    cencerro:m gong:m timbal:m bombo:m contrapunto:m cadencia:f arpegio:m trino:m glisando:m
    legato:m tempo:m ritornelo:m estribillo:m estrofa:f canto:m tono:m tonalidad:f tenor:m
    soprano:f barítono:m solista:m banda:f álbum:m recital:m gira:f bis:m diapasón:m atril:m
    púa:f tecla:f baqueta:f batuta:f sintetizador:m ukelele:m bandoneón:m charango:m bongó:m
    conga:f marimba:f corneta:f clarín:m lira:f carillón:m karaoke:m armonía:f disco:m
    música:f instrumento:m bajo:m coda:f intro:f actuación:f festival:m sexteto:m charanga:f
    mariachi:m murga:f videoclip:m contralto:m crescendo:m staccato:m vibrato:m afinación:f
    improvisación:f solfeo:m sostenido:m bemol:m corchea:f síncopa:f flautín:m quena:f
    vihuela:f sitar:m clavecín:m vibráfono:m matraca:f zambomba:f balalaica:f lengüeta:f
    clavija:f afinador:m
  ''',
  WordTheme.genre: r'''
    rock:m pop:m rap:m jazz:m blues:m tango:m rumba:f bolero:m mambo:m samba:f cumbia:f
    flamenco:m fandango:m pasodoble:m jota:f copla:f zarzuela:f polca:f ópera:f sinfonía:f
    sonata:f cantata:f réquiem:m rapsodia:f serenata:f nocturno:m preludio:m obertura:f
    fuga:f vals:m marcha:f aria:f balada:f nana:f himno:m música_clásica:f barroco:m
    opereta:f oratorio:m música_de_cámara:f tocata:f minueto:m mazurca:f polonesa:f
    scherzo:m rondó:m lied:m madrigal:m motete:m canto_gregoriano:m poema_sinfónico:m
    villancico:m musical:m rocanrol:m hard_rock:m soft_rock:m punk:m rock_alternativo:m
    indie:m rock_progresivo:m rock_psicodélico:m rock_de_garaje:m folk_rock:m
    rock_sinfónico:m rock_urbano:m rock_gótico:m surf_rock:m glam:m grunge:m britpop:m
    shoegaze:m emo:m heavy_metal:m death_metal:m black_metal:m thrash_metal:m doom_metal:m
    power_metal:m metalcore:m nu_metal:m rockabilly:m tecnopop:m electropop:m dream_pop:m
    indie_pop:m pop_rock:m pop_latino:m city_pop:m teen_pop:m electrónica:f tecno:m house:m
    deep_house:m tech_house:m acid_house:m trance:m dubstep:m drum_and_bass:m jungle:m
    breakbeat:m garage:m grime:m trap:m hardstyle:m hardcore:m electro:m ambient:m
    chill_out:m downtempo:m trip_hop:m synthwave:m vaporwave:m eurodance:m bakalao:m
    makina:f dance:m bebop:m swing:m jazz_latino:m ragtime:m rhythm_and_blues:m soul:m
    funk:m hip_hop:m góspel:m country:m bluegrass:m folk:m reggae:m ska:m dancehall:m
    calipso:m reguetón:m dembow:m bossa_nova:f lambada:f milonga:f chacarera:f zamba:f
    cueca:f huayno:m vallenato:m merengue:m bachata:f chachachá:m danzón:m guaracha:f
    corrido:m trova:f candombe:m fado:m new_age:m cante_jondo:m bulería:f soleá:f
    malagueña:f farruca:f petenera:f sevillanas:fp cuplé:m tonadilla:f chotis:m muiñeira:f
    sardana:f seguidilla:f habanera:f pasacalle:m
  ''',
  WordTheme.place: r'''
    mercado:m plaza:f ciudad:f aldea:f callejón:m puente:m jardín:m parque:m puerto:m
    muelle:m mirador:m piscina:f zoológico:m túnel:m pasarela:f cruce:m alameda:f granja:f
    rancho:m huerto:m foso:m astillero:m malecón:m campamento:m caserío:m cementerio:m
    feria:f barrio:m arrabal:m suburbio:m avenida:f bulevar:m calzada:f vereda:f senda:f
    atajo:m encrucijada:f embarcadero:m dique:m esclusa:f presa:f acueducto:m corral:m
    carretera:f autopista:f camino:m acera:f calle:f semáforo:m fuente:f monumento:m
    pirámide:f laberinto:m campo:m pueblo:m municipio:m provincia:f región:f comarca:f
    distrito:m zona:f país:m frontera:f centro:m afueras:fp esquina:f rotonda:f
    paso_de_cebra:m parada:f andén:m vía:f carril:m arcén:m viaducto:m ruta:f paseo:m
    rambla:f cuesta:f escalinata:f parque_de_atracciones:m merendero:m hipódromo:m viñedo:m
    olivar:m finca:f plantación:f vivero:m cantera:f mina:f vertedero:m aparcamiento:m
    rompeolas:m explanada:f bazar:m tumba:f ruinas:fp yacimiento:m dolmen:m menhir:m
    obelisco:m lugar:m rincón:m reino:m imperio:m territorio:m
  ''',
  WordTheme.building: r'''
    casa:f hogar:m habitación:f cocina:f dormitorio:m salón:m baño:m pasillo:m escalera:f
    desván:m sótano:m azotea:f patio:m porche:m balcón:m terraza:f tejado:m chimenea:f
    puerta:f ventana:f pared:f muro:m garaje:m edificio:m apartamento:m piso:m vivienda:f
    chalé:m adosado:m ático:m dúplex:m loft:m estudio:m rascacielos:m villa:f mansión:f
    palacio:m castillo:m cabaña:f chabola:f choza:f barraca:f cortijo:m masía:f iglú:m
    bungaló:m escuela:f biblioteca:f museo:m teatro:m universidad:f hospital:m farmacia:f
    ayuntamiento:m iglesia:f catedral:f capilla:f ermita:f templo:m monasterio:m convento:m
    abadía:f claustro:m mezquita:f sinagoga:f pagoda:f santuario:m mausoleo:m cripta:f
    oficina:f fábrica:f taller:m almacén:m supermercado:m tienda:f banco:m hotel:m posada:f
    hostal:m albergue:m mesón:m taberna:f bodega:f cantina:f bar:m cine:m circo:m gimnasio:m
    estadio:m acuario:m galería:f balneario:m planetario:m observatorio:m anfiteatro:m
    panadería:f librería:f cafetería:f restaurante:m gasolinera:f estación:f terminal:f
    aeropuerto:m faro:m torre:f fortaleza:f bastión:m atalaya:f muralla:f prisión:f
    refugio:m molino:m fragua:f silo:m establo:m pajar:m granero:m invernadero:m columna:f
    tabique:m portal:m colegio:m instituto:m guardería:f academia:f facultad:f laboratorio:m
    clínica:f ambulatorio:m comisaría:f juzgado:m embajada:f parlamento:m ministerio:m
    cuartel:m centro_comercial:m quiosco:m estanco:m ferretería:f carnicería:f pescadería:f
    frutería:f pastelería:f peluquería:f zapatería:f joyería:f floristería:f papelería:f
    perfumería:f tintorería:f lavandería:f boutique:f heladería:f churrería:f pizzería:f
    cervecería:f pub:m discoteca:f casino:m motel:m parador:m suite:f despacho:m auditorio:m
    sala:f polideportivo:m pabellón:m plaza_de_toros:f velódromo:m sauna:f basílica:f
    campanario:m minarete:m panteón:m alcázar:m alcazaba:f ciudadela:f búnker:m hangar:m
    pérgola:f refinería:f aserradero:m comedor:m recibidor:m vestíbulo:m entrada:f
    despensa:f trastero:m vestidor:m techo:m escalón:m rellano:m atrio:m fachada:f
    barandilla:f viga:f bóveda:f cúpula:f claraboya:f inmueble:m inmobiliaria:f parcela:f
    local:m urbanización:f
  ''',
  WordTheme.food: r'''
    pan:m fideo:m sopa:f guiso:m ensalada:f yogur:m chocolate:m caramelo:m galleta:f
    pastel:m flan:m rosquilla:f gofre:m tortita:f hamburguesa:f pizza:f pasta:f curry:m
    tortilla:f paella:f empanada:f croqueta:f churro:m turrón:m mazapán:m gazpacho:m tapa:f
    bocadillo:m salchicha:f morcilla:f albóndiga:f filete:m bizcocho:m buñuelo:m torrija:f
    natilla:f cocido:m potaje:m fabada:f migas:fp chuleta:f sushi:m taco:m guacamole:m
    cruasán:m bollo:m tarta:f bombón:m chicle:m sándwich:m kebab:m lasaña:f espagueti:m
    macarrón:m puré:m palomitas:fp consomé:m helado:m postre:m comida:f desayuno:m
    almuerzo:m cena:f merienda:f tostada:f magdalena:f ensaimada:f napolitana:f crep:m
    polvorón:m roscón:m leche_frita:f arroz_con_leche:m crema_catalana:f cuajada:f
    tiramisú:m gelatina:f mousse:f piruleta:f regaliz:m algodón_de_azúcar:m gominola:f
    patatas_fritas:fp aperitivo:m pincho:m montadito:m canapé:m perrito_caliente:m burrito:m
    nachos:p quesadilla:f enchilada:f tamal:m arepa:f ceviche:m fajita:f pupusa:f mole:m
    pozole:m hummus:m falafel:m ramen:m canelón:m risotto:m fideuá:f pisto:m salmorejo:m
    callos:p gachas:fp asado:m brocheta:f escalope:m revuelto:m encurtido:m escabeche:m
    kimchi:m chucrut:m tempura:f cuscús:m
  ''',
  WordTheme.ingredient: r'''
    arroz:m trigo:m centeno:m cebada:f avena:f harina:f masa:f sal:f azúcar:m pimienta:f
    miel:f mermelada:f jarabe:m huevo:m queso:m mantequilla:f nata:f tofu:m soja:f lenteja:f
    garbanzo:m alubia:f carne:f pollo:m ternera:f lomo:m jamón:m tocino:m chorizo:m
    salchichón:m pescado:m marisco:m nuez:f almendra:f avellana:f castaña:f pistacho:m
    cacahuete:m aceite:m vinagre:m salsa:f mayonesa:f mostaza:m caldo:m canela:f pimentón:m
    azafrán:m nuez_moscada:f vainilla:f albahaca:f tomillo:m orégano:m perejil:m cilantro:m
    cebollino:m eneldo:m salvia:f estragón:m menta:f romero:m levadura:f almidón:m
    bicarbonato:m pan_rallado:m sémola:f quinoa:f mijo:m pechuga:f alita:f solomillo:m
    panceta:f beicon:m fuet:m sobrasada:f cecina:f mortadela:f salami:m fiambre:m paté:m
    manteca:f anchoa:f surimi:m caviar:m huevas:fp requesón:m margarina:f yema:f kétchup:m
    alioli:m vinagreta:f sofrito:m pesto:m chimichurri:m bechamel:f wasabi:m alcaparra:f
    especia:f condimento:m adobo:m jengibre:m cúrcuma:f comino:m cardamomo:m cayena:f
    hierbabuena:f mejorana:f sésamo:m pipas:fp piñón:m anacardo:m macadamia:f chía:f
    pasas:fp melaza:f compota:f dulce_de_leche:m nori:m kombu:m wakame:m frijol:m seitán:m
  ''',
  WordTheme.vegetable: r'''
    patata:f zanahoria:f cebolla:f ajo:m tomate:m pimiento:m pepino:m lechuga:f espinaca:f
    col:f brócoli:m coliflor:f calabaza:f calabacín:m berenjena:f maíz:m guisante:m haba:f
    alcachofa:f espárrago:m puerro:m rábano:m remolacha:f nabo:m apio:m hinojo:m seta:f
    verdura:f champiñón:m boniato:m yuca:f ñame:m cebolleta:f chalota:f lombarda:f berza:f
    acelga:f canónigo:m rúcula:f berro:m escarola:f endibia:f borraja:f grelo:m guindilla:f
    jalapeño:m judía_verde:f tirabeque:m brote_de_soja:m chirivía:f topinambur:m alfalfa:f
    trufa:f níscalo:m boletus:m shiitake:m rebozuelo:m okra:f nopal:m chayote:m jícama:f
    palmito:m verdolaga:f
  ''',
  WordTheme.fruit: r'''
    manzana:f pera:f naranja:f limón:m lima:f mandarina:f pomelo:m plátano:m fresa:f uva:f
    cereza:f ciruela:f melocotón:m albaricoque:m nectarina:f higo:m granada:f membrillo:m
    níspero:m sandía:f melón:m kiwi:m mango:m piña:f coco:m aguacate:m frambuesa:f
    arándano:m fruta:f aceituna:f dátil:m papaya:f maracuyá:m guayaba:f lichi:m chirimoya:f
    pitaya:f carambola:f mora:f grosella:f endrina:f paraguayo:m cidra:f bergamota:f
    tamarindo:m mamey:m zapote:m lúcuma:f guanábana:f acerola:f feijoa:f baya:f
  ''',
  WordTheme.sport: r'''
    fútbol:m béisbol:m baloncesto:m voleibol:m tenis:m bádminton:m golf:m boliche:m billar:m
    natación:f atletismo:m maratón:m gimnasia:f karate:m judo:m esgrima:f lucha:f boxeo:m
    tiro:m equitación:f remo:m surf:m esquí:m hockey:m rugby:m críquet:m ciclismo:m
    escalada:f raqueta:f bate:m portería:f medalla:f trofeo:m campeón:m eliminatoria:f
    prórroga:f polo:m patinaje:m buceo:m dardo:m valla:f jabalina:f relevo:m marcador:m
    casco:m falta:f jonrón:m braza:f halterofilia:f trineo:m saque:m rebote:m salto:m
    carrera:f meta:f podio:m vestuario:m grada:f afición:f piragüismo:m regata:f triatlón:m
    pentatlón:m decatlón:m lanzamiento:m pértiga:f trampolín:m colchoneta:f anillas:fp
    tatami:m delantero:m defensa:f entrenador:m hincha:m cancha:f pista:f penalti:m córner:m
    tarjeta:f tanteo:m empate:m victoria:f derrota:f récord:m torneo:m liga:f copa:f
    equipo:m jugador:m gol:m balón:m canasta:f ring:m entrenamiento:m calentamiento:m
    flexión:f sentadilla:f pesa:f mancuerna:f pádel:m frontón:m petanca:f taekwondo:m sumo:m
    aikido:m senderismo:m montañismo:m paracaidismo:m parapente:m biatlón:m waterpolo:m
    vuelta:f pelotón:m maillot:m dorsal:m cronómetro:m banquillo:m palco:m suplente:m
    fichaje:m campeonato:m mundial:m olimpiada:f semifinal:f clasificación:f puntuación:f
    goleada:f remontada:f pase:m regate:m remate:m cabezazo:m bloqueo:m triple:m set:m
    revés:m volea:f deporte:m partido:m balonmano:m squash:m windsurf:m kitesurf:m
    motociclismo:m automovilismo:m rally:m yoga:m pilates:m aeróbic:m musculación:f
    pelota_vasca:f snowboard:m resultado:m esprint:m fuera_de_juego:m chilena:f
    contraataque:m centrocampista:m selección:f club:m rodillera:f espinillera:f dopaje:m
    lesión:f estiramiento:m
  ''',
  WordTheme.vehicle: r'''
    bicicleta:f tren:m barco:m coche:m autobús:m taxi:m camión:m moto:f patinete:m avión:m
    helicóptero:m nave:f cohete:m submarino:m yate:m carguero:m velero:m balsa:f acorazado:m
    tanque:m carroza:f carreta:f carretilla:f tractor:m excavadora:f ambulancia:f
    teleférico:m metro:m tranvía:m locomotora:f canoa:f kayak:m dirigible:m paracaídas:m
    palanquín:m triciclo:m furgoneta:f limusina:f quitanieves:m monorraíl:m catamarán:m
    rompehielos:m petrolero:m gabarra:f pesquero:m biplano:m hidroavión:m sonda:f
    motonieve:f monociclo:m remolcador:m góndola:f carruaje:m vagón:m carro:m calesa:f
    diligencia:f berlina:f cabriolé:m faetón:m camioneta:f furgón:m volquete:m hormigonera:f
    grúa:f segadora:f cosechadora:f patín:m monopatín:m ciclomotor:m sidecar:m crucero:m
    galera:f galeón:m fragata:f corbeta:f bergantín:m goleta:f piragua:f chalupa:f bote:m
    lancha:f planeador:m ultraligero:m avioneta:f caza:m bombardero:m autocar:m
    todoterreno:m descapotable:m caravana:f remolque:m tráiler:m quad:m kart:m
    silla_de_ruedas:f funicular:m telesilla:m ascensor:m montacargas:m globo_aerostático:m
    jet:m transbordador:m ferry:m portaaviones:m destructor:m ballenero:m trasatlántico:m
    carabela:f trirreme:m aerodeslizador:m batiscafo:m apisonadora:f tándem:m carromato:m
    cuadriga:f tartana:f ranchera:f monovolumen:m utilitario:m cupé:m vagoneta:f barcaza:f
    trolebús:m vehículo:m deportivo:m balandro:m portacontenedores:m navío:m velocípedo:m
  ''',
  WordTheme.product: r'''
    ordenador:m teclado:m pantalla:f impresora:f altavoz:m auricular:m micrófono:m dron:m
    tableta:f móvil:m cargador:m pila:f mando:m nevera:f lavadora:f aspiradora:f
    ventilador:m estufa:f purificador:m arrocera:f microondas:m horno:m licuadora:f
    cepillo:m dentífrico:m jabón:m reloj:m proyector:m enrutador:m escáner:m secadora:f
    timbre:m termómetro:m extintor:m calculadora:f bombilla:f enchufe:m regleta:f funda:f
    toalla:f palangana:f detergente:m suavizante:m olla_exprés:f sartén:f cafetera:f
    batidor:m pelador:m sacacorchos:m termo:m percha:f televisor:m consola:f amplificador:m
    ecualizador:m báscula:f plancha:f tostadora:f freidora:f exprimidor:m hervidor:m
    calefactor:m radiador:m termostato:m cubertería:f vajilla:f cristalería:f mantel:m
    servilleta:f escurridor:m fregadero:m ducha:f bañera:f inodoro:m lavabo:m botiquín:m
    lentilla:f tocadiscos:m portátil:m monitor:m cable:m disco_duro:m videojuego:m
    reproductor:m grabadora:f gramófono:m vinilo:m casete:m adaptador:m alargador:m
    interruptor:m congelador:m lavavajillas:m vitrocerámica:f extractor:m batidora:f
    sandwichera:f wok:m parrilla:f barbacoa:f desodorante:m pañal:m chupete:m biberón:m
    papel_higiénico:m lejía:f ambientador:m insecticida:m bombona:f aire_acondicionado:m
    humidificador:m calentador:m bidé:m antena:f módem:m teléfono:m fotocopiadora:f gel:m
    pomada:f tirita:f venda:f pastilla:f vitamina:f electrodoméstico:m videocámara:f
    pendrive:m recogedor:m plumero:m bayeta:f estropajo:m abrelatas:m papel_de_aluminio:m
    matamoscas:m tendedero:m aspirina:f antibiótico:m medicamento:m bastoncillo:m compresa:f
    tampón:m hilo_dental:m colutorio:m alarma:f brasero:m
  ''',
  WordTheme.beauty: r'''
    maquillaje:m pintalabios:m rímel:m esmalte:m crema:f loción:f mascarilla:f perfume:m
    colonia:f champú:m acondicionador:m tinte:m laca:f peine:m secador:m rizador:m
    maquinilla:f cortaúñas:m protector:m cosmético:m brillo_de_labios:m bálsamo:m vaselina:f
    delineador:m sombra_de_ojos:f corrector:m colorete:m polvos:p prebase:f iluminador:m
    bronceador:m perfilador:m desmaquillante:m limpiador:m tónico:m sérum:m exfoliante:m
    fragancia:f sales_de_baño:fp gomina:f alisador:m rulo:m pinzas:fp borla:f polvera:f
    neceser:m lima_de_uñas:f quitaesmalte:m manicura:f pedicura:f cera:f depilación:f
    depiladora:f afeitado:m peluca:f permanente:f mechas:fp peinado:m masaje:m tatuaje:m
    bótox:m
  ''',
  WordTheme.color: r'''
    carmesí:m escarlata:m bermellón:m magenta:m fucsia:m rosado:m ocre:m siena:m sepia:m
    oliva:m turquesa:f cian:m añil:m índigo:m lila:m malva:f púrpura:f borgoña:m herrumbre:f
    terracota:f beige:m caqui:m peltre:m ébano:m azabache:m cerúleo:m aguamarina:f verdín:m
    celadón:m nácar:m cobrizo:m bronceado:m ceniza:f humo:m amaranto:m coral:m violeta:f
    carmín:m burdeos:m glauco:m bermejo:m pardo:m caoba:f antracita:f marengo:m albero:m
    alazán:m zaino:m bayo:m rubor:m tostado:m verdemar:m azulón:m grisáceo:m morado:m
    corinto:m salmonado:m amarillento:m rojizo:m plomizo:m dorado:m purpurina:f cárdeno:m
    garzo:m ambarino:m níveo:m marrón:m celeste:m ultramar:m grana:f azulete:m verdoso:m
    azulado:m blanquecino:m negruzco:m anaranjado:m violáceo:m rosáceo:m perlado:m ahumado:m
    tornasol:m matiz:m pigmento:m colorante:m barniz:m acuarela:f témpera:f óleo:m gama:f
    hollín:m tabaco:m rojo:m azul:m verde:m amarillo:m negro:m blanco:m gris:m color:m
    rubio:m moreno:m crudo:m neón:m degradado:m cetrino:m pajizo:m plateado:m
  ''',
  WordTheme.finance: r'''
    factura:f recibo:m bono:m dividendo:m interés:m préstamo:m hipoteca:f depósito:m
    ahorro:m cuenta:f saldo:m presupuesto:m auditoría:f activo:m pasivo:m capital:m
    ingreso:m ganancia:f margen:m superávit:m déficit:m deuda:f crédito:m débito:m cheque:m
    moneda:f divisa:f rendimiento:m cartera:f arancel:m reembolso:m prima:f pensión:f
    nómina:f salario:m sueldo:m comisión:f regalía:f franquicia:f fusión:f adquisición:f
    rescate:m aval:m vale:m cupón:m caja_fuerte:f tesorería:f remesa:f liquidación:f
    arbitraje:m garantía:f descubierto:m extracto:m libreta:f custodia:f acreedor:m deudor:m
    prestamista:m fiador:m tasación:f inflación:f recesión:f liquidez:f solvencia:f
    quiebra:f donación:f subsidio:m estipendio:m gasto:m descuento:m plazo:m arqueo:m
    balance:m contrato:m escritura:f pagaré:m giro:m tipo:m tasa:f cuota:f canon:m tributo:m
    impuesto:m gravamen:m retención:f exención:f multa:f usura:f fianza:f aporte:m dote:f
    herencia:f renta:f alquiler:m arriendo:m peaje:m portazgo:m diezmo:m botín:m tesoro:m
    riqueza:f pobreza:f dinero:m billete:m efectivo:m pago:m cobro:m precio:m coste:m
    pérdida:f inversión:f inversor:m accionista:m acción:f banca:f transferencia:f propina:f
    paga:f limosna:f beca:f subasta:f oferta:f demanda:f venta:f compra:f trueque:m
    negocio:m empresa:f lotería:f apuesta:f premio:m jubilación:f seguro:m póliza:f
    patrimonio:m lujo:m embargo:m desahucio:m devaluación:f cotización:f hucha:f
    calderilla:f céntimo:m euro:m dólar:m libra:f cambio:m fondo:m crisis:f aguinaldo:m
    testamento:m tarifa:f ganga:f peseta:f mercancía:f
  ''',
  WordTheme.tech: r'''
    servidor:m caché:f búfer:m píxel:m códec:m paquete:m protocolo:m montículo:m puntero:m
    compilador:m firmware:m registro:m latencia:f cortafuegos:m subred:f carga_útil:f
    esquema:m cursor:m respaldo:m clúster:m fragmento:m réplica:f instantánea:f contenedor:m
    tubería:f repositorio:m depurador:m macro:f matriz:f entero:m sintaxis:f analizador:m
    ensamblador:m instrucción:f interrupción:f tasa_de_bits:f extremo:m cifrado:m
    descifrado:m sombreador:m textura:f polígono:m malla:f octeto:m enrutamiento:m
    conmutación:f difusión:f datagrama:m partición:f directorio:m reversión:f migración:f
    núcleo:m proceso:m sesión:f consulta:f índice:m tabla:f vista:f fila:f nodo:m grafo:m
    cola:f lista:f conjunto:m módulo:m complemento:m parche:m confirmación:f etiqueta:f
    versión:f compilación:f prueba:f traza:f perfil:m disparador:m evento:m señal:f tema:m
    suscriptor:m internet:m web:f navegador:m buscador:m enlace:m correo:m mensaje:m chat:m
    contraseña:f usuario:m fichero:m programa:m aplicación:f software:m hardware:m sistema:m
    algoritmo:m código:m variable:f función:f bucle:m clase:f base_de_datos:f dato:m bit:m
    procesador:m chip:m circuito:m transistor:m placa:f icono:m descarga:f actualización:f
    instalación:f virus:m dominio:m ancho_de_banda:m wifi:m fibra:f conexión:f resolución:f
    formato:m compresión:f robot:m androide:m autómata:m sensor:m bot:m blog:m foro:m
    captura:f comando:m lenguaje:m error:m excepción:f vector:m documento:m spam:m troyano:m
    antivirus:m menú:m página:f vídeo:m podcast:m meme:m emoji:m configuración:f
    programación:f informática:f láser:m holograma:m byte:m interfaz:f plataforma:f
    dispositivo:m simulador:m notificación:f conector:m radar:m fax:m tecnología:f
  ''',
  WordTheme.weather: r'''
    nube:f viento:m lluvia:f nieve:f escarcha:f niebla:f rocío:m arcoíris:m ocaso:m rayo:m
    trueno:m chubasco:m monzón:m tifón:m torbellino:m ventisca:f llovizna:f granizo:m
    aguanieve:f vendaval:m ráfaga:f ciclón:m tormenta:f tempestad:f diluvio:m aguacero:m
    calima:f bruma:f neblina:f pronóstico:m nublado:m solana:f ola_de_calor:f helada:f
    deshielo:m cellisca:f remolino:m brisa:f céfiro:m galerna:f borrasca:f anticiclón:m
    clima:m temperatura:f presión:f chaparrón:m sereno:m relámpago:m centella:f escampada:f
    canícula:f bochorno:m siroco:m tramontana:f cierzo:m levante:m poniente:m ábrego:m
    alisio:m huracán:m tornado:m tolvanera:f polvareda:f rociada:f orvallo:m calabobos:m
    sirimiri:m nevada:f granizada:f relente:m gota:f nubosidad:f humedad:f sequía:f
    estiaje:m bonanza:f temporal:m tromba:f ola_de_frío:f calor:m frescor:m copo:m
    carámbano:m pedrisco:m mistral:m cirro:m nimbo:m precipitación:f visibilidad:f terral:m
    celaje:m arrebol:m ventolera:f solano:m frío:m meteorología:f gota_fría:f esmog:m
    estrato:m cumulonimbo:m crecida:f cencellada:f
  ''',
  WordTheme.space: r'''
    estrella:f luna:f sol:m galaxia:f meteoro:m aurora:f menguante:m creciente:m eclipse:m
    cenit:m universo:m planeta:m satélite:m asteroide:m nebulosa:f cúmulo:m constelación:f
    órbita:f gravedad:f rotación:f traslación:f mancha_solar:f cráter:m año_luz:m astro:m
    firmamento:m eclíptica:f meridiano:m estratosfera:f atmósfera:f vacío:m ingravidez:f
    plenilunio:m novilunio:m perigeo:m apogeo:m lucero:m supernova:f cuásar:m púlsar:m
    vía_láctea:f cosmos:m cuadrante:m paralaje:m parsec:m nadir:m acimut:m elipse:f
    perihelio:m afelio:m coronal:m fotosfera:f cromosfera:f magnetosfera:f ionosfera:f
    exosfera:f mesosfera:f troposfera:f heliosfera:f gravitación:f halo:m enana:f coma:f
    bólido:m sistema_solar:m agujero_negro:m estación_espacial:f radiación:f viento_solar:m
    llamarada:f materia_oscura:f espacio:m nova:f zodíaco:m ovni:m alunizaje:m despegue:m
    hemisferio:m eje:m magnetar:m singularidad:f cuerpo_celeste:m cometa:m planeta_enano:m
    exoplaneta:m Osa_Mayor:f Osa_Menor:f Orión:m Casiopea:f Pléyades:fp Sirio:m
    Estrella_Polar:f Betelgeuse:f Aldebarán:m Antares:m agujero_de_gusano:m big_bang:m
    antimateria:f astronomía:f astrofísica:f cosmología:f magnitud:f
  ''',
  WordTheme.planet: r'''
    Mercurio:m Venus:f Tierra:f Marte:m Júpiter:m Saturno:m Urano:m Neptuno:m Plutón:m
    Ceres:f Eris:f Haumea:f Makemake:m Sedna:f Quaoar:m Gonggong:m Salacia:f Varuna:f
    Ixión:m Vesta:f Palas:f Juno:f Higía:f Psique:f Eros:m Bennu:m Ryugu:m Apofis:m
    Arrokoth:m Tea:f Vulcano:m Dimidium:m Spe:m Orbitar:m Fortitudo:m Ægir:m Amateru:m
    Dagon:m Meztli:m Smertrios:m Phobetor:m Tassili:m Madriu:m Yanyan:m Tondra:f Eburonia:f
    Yvaga:f Mastika:f Bendida:f Nakanbé:m Awasis:m Wangshu:m Pipitea:f Asye:m Veles:m
    Boinayel:m Eyeke:m Cayahuanca:f Hämarik:m Abol:m Bélisama:f Mintome:m Toge:m Santamasa:f
    Noifasui:m Chura:f Buru:m Staburags:m Baiduri:m Cuptor:m Xólotl:m Hairu:m Laligurans:m
    Kereru:m Albmi:m Perwana:f Viculus:m Samagiya:f Ramajay:m Khomsa:f Barajeel:m
    Cruinlagh:m Ibirapitá:m Madalitso:m Bambaruush:m Tahay:m Awohali:m Enaiposha:f
    Phailinsiam:m Najsakopajk:m Qingluan:m Cuancoá:m Astrolábos:m Ahra:f Aumatex:m
    Ixbalanqué:m Surt:m Haik:m Mulchatna:f Makombé:m Zembretta:f Bocaprins:m Agouto:m
  ''',
  WordTheme.time: r'''
    amanecer:m alba:f crepúsculo:m anochecer:m solsticio:m equinoccio:m momento:m
    eternidad:f futuro:m instante:m siglo:m década:f mañana:f mediodía:m tarde:f noche:f
    medianoche:f madrugada:f víspera:f ayer:m hoy:m jornada:f semana:f quincena:f mes:m
    trimestre:m semestre:m año:m lustro:m milenio:m época:f era:f edad:f primavera:f
    verano:m otoño:m invierno:m trienio:m ahora:m bienio:m infancia:f juventud:f madurez:f
    vejez:f intervalo:m duración:f transcurso:m período:m aniversario:m efeméride:f
    temporada:f alborada:f atardecer:m minuto:m segundo:m hora:f lapso:m tregua:f pausa:f
    espera:f demora:f ciclo:m turno:m ronda:f fase:f etapa:f tramo:m jornal:m matinal:m
    vespertino:m antaño:m hogaño:m pasado:m presente:m porvenir:m albor:m sazón:f añada:f
    decenio:m centuria:f cuatrienio:m sexenio:m día:m fin_de_semana:m lunes:m martes:m
    miércoles:m jueves:m viernes:m sábado:m domingo:m enero:m febrero:m marzo:m abril:m
    mayo:m junio:m julio:m agosto:m septiembre:m octubre:m noviembre:m diciembre:m festivo:m
    vacaciones:fp descanso:m siesta:f cumpleaños:m vendimia:f fecha:f horario:m cita:f
    prisa:f rato:m antigüedad:f prehistoria:f actualidad:f milisegundo:m recreo:m tiempo:m
    vez:f curso:m adolescencia:f nacimiento:m centenario:m cuatrimestre:m sobremesa:f
    cosecha:f siembra:f
  ''',
  WordTheme.emotion: r'''
    alegría:f tristeza:f ira:f miedo:m sorpresa:f gozo:m júbilo:m dicha:f felicidad:f
    euforia:f éxtasis:m consuelo:m alivio:m esperanza:f desesperanza:f pena:f melancolía:f
    nostalgia:f soledad:f añoranza:f anhelo:m deseo:m pasión:f cariño:m ternura:f calidez:f
    bondad:f compasión:f empatía:f lástima:f gratitud:f humildad:f paciencia:f prudencia:f
    templanza:f integridad:f sinceridad:f asombro:m reverencia:f serenidad:f calma:f
    sosiego:m confianza:f duda:f sospecha:f preocupación:f ansiedad:f pavor:m terror:m
    pánico:m furia:f rabia:f enojo:m fastidio:m aburrimiento:m apatía:f entusiasmo:m
    fervor:m ardor:m emoción:f ilusión:f coraje:m valentía:f timidez:f vergüenza:f culpa:f
    orgullo:m envidia:f celos:p codicia:f ánimo:m humor:m capricho:m amargura:f rencor:m
    odio:m desdén:m desprecio:m recelo:m hastío:m tedio:m congoja:f angustia:f aflicción:f
    desconsuelo:m desaliento:m abatimiento:m arrebato:m arrobo:m devoción:f piedad:f
    clemencia:f indulgencia:f benevolencia:f afecto:m apego:m simpatía:f antipatía:f
    alborozo:m regocijo:m contento:m desazón:f zozobra:f sobresalto:m estupor:m pasmo:m
    amor:m placer:m satisfacción:f lealtad:f generosidad:f amabilidad:f crueldad:f egoísmo:m
    pereza:f gula:f lujuria:f soberbia:f vanidad:f inseguridad:f nerviosismo:m estrés:m
    agobio:m tensión:f desesperación:f frustración:f decepción:f indignación:f
    remordimiento:m arrepentimiento:m admiración:f respeto:m fascinación:f curiosidad:f
    indiferencia:f desgana:f cansancio:m dolor:m susto:m inquietud:f desconfianza:f asco:m
    sufrimiento:m motivación:f inspiración:f depresión:f optimismo:m pesimismo:m seguridad:f
    enamoramiento:m antojo:m impaciencia:f cobardía:f diversión:f sentimiento:m sensación:f
    luto:m perdón:m
  ''',
  WordTheme.body: r'''
    cabeza:f frente:f ceja:f pestaña:f párpado:m nariz:f mejilla:f barbilla:f mandíbula:f
    labio:m lengua:f diente:m encía:f oreja:f lóbulo:m cuello:m nuca:f hombro:m codo:m
    muñeca:f palma:f nudillo:m dedo:m pulgar:m uña:f puño:m pecho:m vientre:m ombligo:m
    cintura:f cadera:f muslo:m rodilla:f espinilla:f pantorrilla:f tobillo:m talón:m hueso:m
    cráneo:m músculo:m tendón:m ligamento:m articulación:f cartílago:m corazón:m pulmón:m
    hígado:m estómago:m riñón:m bazo:m intestino:m vejiga:f cerebro:m nervio:m vena:f
    arteria:f capilar:m sangre:f piel:f poro:m cabello:m barba:f lágrima:f sudor:m saliva:f
    aliento:m pulso:m latido:m clavícula:f rótula:f pómulo:m tímpano:m globo_ocular:m
    arruga:f peca:f hoyuelo:m cicatriz:f moretón:m ampolla:f callo:m sien:f paladar:m
    amígdala:f laringe:f faringe:f tráquea:f esófago:m diafragma:m esternón:m omóplato:m
    vértebra:f pelvis:f fémur:m tibia:f peroné:m húmero:m cúbito:m falange:f metatarso:m
    empeine:m dorso:m axila:f ingle:f corva:f iris:m pupila:f córnea:f retina:f
    esclerótica:f frenillo:m ojo:m boca:f mano:f pie:m brazo:m pierna:f cara:f cuerpo:m
    garganta:f esqueleto:m médula:f neurona:f célula:f hormona:f glándula:f páncreas:m
    apéndice:m útero:m bigote:m patilla:f flequillo:m melena:f trenza:f verruga:f lunar:m
    herida:f bíceps:m torso:m costado:m glúteo:m meñique:m anular:m aorta:f oído:m tripa:f
    espalda:f costilla:f muela:f colmillo:m antebrazo:m vello:m coleta:f moño:m calva:f
    cana:f ojera:f moco:m respiración:f tiroides:f tríceps:m papada:f
  ''',
  WordTheme.clothing: r'''
    sombrero:m zapato:m guante:m bufanda:f gafas:fp abrigo:m gabán:m chaqueta:f americana:f
    camisa:f blusa:f túnica:f pantalón:m vaquero:m short:m falda:f vestido:m chaleco:m
    rebeca:f jersey:m sudadera:f calcetín:m media:f pijama:m delantal:m pañuelo:m corbata:f
    pajarita:f cinturón:m faja:f mocasín:m bota:f pantufla:f uniforme:m disfraz:m bata:f
    capa:f poncho:m chubasquero:m anorak:m parka:f bañador:m manga:f dobladillo:m solapa:f
    forro:m tela:f lino:m seda:f algodón:m lana:f terciopelo:m pana:f franela:f cuero:m
    boina:f gorro:m gorra:f turbante:m velo:m chal:m mantón:m levita:f frac:m esmoquin:m
    chaqué:m casaca:f jubón:m sayo:m camisola:f enagua:f corpiño:m polaina:f zueco:m
    alpargata:f chancla:f babucha:f escarpín:m calzón:m taparrabos:m mitón:m manopla:f
    muñequera:f tirante:m ligero:m corsé:m miriñaque:m mantilla:f pamela:f tricornio:m
    bicornio:m yelmo:m cofia:f capucha:f traje:m camiseta:f tacón:m calzoncillos:p bragas:fp
    sujetador:m camisón:m albornoz:m chándal:m mallas:fp bermudas:fp peto:m cazadora:f
    gabardina:f kimono:m sari:m toga:f hábito:m sotana:f armadura:f coraza:f tiara:f
    diadema:f visera:f pasamontañas:m orejeras:fp pantis:p leotardo:m bolsillo:m costura:f
    nailon:m poliéster:m licra:f cachemir:m encaje:m lentejuela:f pañoleta:f fular:m
    cordón:m suela:f plantilla:f zapatilla:f sandalia:f ropa:f biquini:m guayabera:f
    peineta:f chistera:f bombín:m fieltro:m tul:m gasa:f raso:m estampado:m talla:f
  ''',
  WordTheme.tool: r'''
    hacha:f pala:f sierra:f alicate:m cincel:m yunque:m fuelle:m lezna:f abrazadera:f
    nivel:m calibre:m regla:f tijera:f martillo:m mazo:m taladro:m lija:f pico:m hoz:f
    guadaña:f azada:f arado:m rastrillo:m soldador:m amoladora:f cortadora:f palanca:f
    cuña:f polea:f manivela:f almádena:f paleta:f rallador:m tamiz:m laya:f mayal:m huso:m
    lanzadera:f carrete:m cuchilla:f remachadora:f clavadora:f caladora:f torno:m lijadora:f
    motosierra:f serrucho:m gubia:f punzón:m escuadra:f bisel:m berbiquí:m barrena:f
    formón:m garlopa:f escofina:f escoplo:m gramil:m plomada:f tenazas:fp cric:m grapadora:f
    pistola:f soplete:m yesquero:m crisol:m molde:m troquel:m esmeril:m afilador:m mandril:m
    broca:f azuela:f destornillador:m llave_inglesa:f cúter:m navaja:f machete:m
    cortacésped:m desbrozadora:f horca:f regadera:f manguera:f pulverizador:m sembradora:f
    podadora:f andamio:m cinta_métrica:f cartabón:m transportador:m llana:f espátula:f
    rodillo:m brocha:f rascador:m fresadora:f prensa:f caballete:m caja_de_herramientas:f
    pelacables:m multímetro:m carraca:f pie_de_cabra:m cepillo_de_carpintero:m herramienta:f
    silicona:f masilla:f aspersor:m mordaza:f buril:m bisturí:m jeringa:f estetoscopio:m
    molinillo:m compresor:m generador:m cizalla:f guillotina:f trituradora:f ganzúa:f
    arpón:m anzuelo:m trampa:f
  ''',
  WordTheme.drink: r'''
    café:m té:m zumo:m leche:f agua:f gaseosa:f limonada:f sidra:f horchata:f batido:m
    malteada:f infusión:f poleo:m tila:f mate:m cortado:m capuchino:m expreso:m carajillo:m
    descafeinado:m cerveza:f clara:f vino:m tinto:m cava:m champán:m jerez:m oporto:m
    vermut:m sangría:f licor:m aguardiente:m orujo:m ron:m ginebra:f vodka:m whisky:m
    coñac:m brandy:m tequila:m mezcal:m sake:m hidromiel:f cóctel:m ponche:m néctar:m
    refresco:m soda:f tónica:f granizado:m cacao:m atole:m chicha:f pulque:m tepache:m
    kombucha:f kéfir:m suero:m bíter:m amargo:m anís:m pacharán:m aguamiel:f rompope:m
    sorbete:m clarete:m albariño:m espumoso:m mosto:m garnacha:f fino:m amontillado:m
    naranjada:f moscatel:m chupito:m trago:m mojito:m daiquiri:m piña_colada:f cubata:m
    absenta:f pisco:m cachaza:f grappa:f moca:m sifón:m agua_de_coco:f bebida:f frappé:m
    guarapo:m tereré:m calimocho:m rebujito:m queimada:f mistela:f caipiriña:f bourbon:m
    prosecco:m zarzaparrilla:f champurrado:m
  ''',
  WordTheme.toy: r'''
    canica:f dado:m naipe:m rompecabezas:m peonza:f globo:m ajedrez:m dominó:m parchís:m
    muñeco:m peluche:m juguete:m juego:m partida:f pelota:f comba:f escondite:m rayuela:f
    columpio:m tobogán:m balancín:m tiovivo:m noria:f montaña_rusa:f arenero:m yoyó:m
    diábolo:m bumerán:m frisbi:m aro:m sonajero:m bloque:m plastilina:f papiroflexia:f
    pompa:f tirachinas:m petardo:m bengala:f confeti:m serpentina:f piñata:f máscara:f
    títere:m marioneta:f maqueta:f zancos:p cama_elástica:f tirolina:f castillo_hinchable:m
    damas:fp bingo:m ruleta:f tres_en_raya:m crucigrama:m sudoku:m sopa_de_letras:f
    trabalenguas:m baraja:f comodín:m ficha:f tablero:m cubilete:m caleidoscopio:m figura:f
    futbolín:m oca:f chapas:fp pillapilla:m gallinita_ciega:f veo_veo:m corro:m charada:f
    recortable:m matasuegras:m tómbola:f atracción:f tragaperras:f póquer:m mus:m tute:m
    brisca:f solitario:m
  ''',
  WordTheme.sound: r'''
    sonido:m ruido:m voz:f grito:m susurro:m murmullo:m suspiro:m risa:f carcajada:f
    llanto:m sollozo:m gemido:m quejido:m lamento:m bostezo:m estornudo:m tos:f ronquido:m
    silbido:m chillido:m alarido:m aullido:m ladrido:m maullido:m rugido:m gruñido:m
    bramido:m relincho:m mugido:m balido:m cacareo:m graznido:m gorjeo:m ronroneo:m
    zumbido:m siseo:m crujido:m chirrido:m chasquido:m chapoteo:m goteo:m borboteo:m
    tintineo:m repique:m campanada:f tañido:m redoble:m retumbo:m estruendo:m estallido:m
    explosión:f portazo:m golpe:m golpeteo:m traqueteo:m zapateo:m pisada:f aplauso:m
    palmada:f ovación:f abucheo:m bocinazo:m pitido:m clic:m tictac:m runrún:m quiquiriquí:m
    guau:m miau:m pío:m chinchín:m pum:m bullicio:m alboroto:m jaleo:m algarabía:f
    griterío:m clamor:m cuchicheo:m parloteo:m tartamudeo:m balbuceo:m arrullo:m tarareo:m
    jadeo:m hipo:m eructo:m carraspeo:m soplido:m bufido:m rumor:m resonancia:f vibración:f
    acústica:f toque:m disparo:m cañonazo:m vítor:m taconeo:m chisporroteo:m gorgoteo:m
    berrido:m rebuzno:m berrea:f cucú:m volumen:m onda:f frecuencia:f decibelio:m estática:f
    onomatopeya:f
  ''',
  WordTheme.person: r'''
    niño:m bebé:m adolescente:m adulto:m anciano:m hombre:m mujer:f chico:m señor:m dama:f
    abuelo:m abuela:f madre:f padre:m hijo:m hermano:m tío:m primo:m sobrino:m nieto:m
    marido:m gemelo:m huérfano:m viudo:m soltero:m novio:m novia:f pareja:f amigo:m
    enemigo:m rival:m vecino:m invitado:m huésped:m extranjero:m desconocido:m vagabundo:m
    nómada:m héroe:m villano:m pícaro:m granuja:m mocoso:m dormilón:m glotón:m empollón:m
    sabelotodo:m charlatán:m parlanchín:m gruñón:m llorón:m soñador:m aventurero:m
    holgazán:m bromista:m mentiroso:m tramposo:m cobarde:m líder:m jefe:m compañero:m
    testigo:m víctima:f rehén:m prisionero:m fugitivo:m ciudadano:m habitante:m aldeano:m
    mendigo:m ermitaño:m heredero:m ahijado:m padrino:m madrina:f suegro:m cuñado:m yerno:m
    nuera:f padrastro:m madrastra:f antepasado:m pariente:m genio:m anfitrión:m persona:f
    gente:f familia:f chica:f esposa:f bisabuelo:m hermanastro:m prometido:m amante:m
    cliente:m paciente:m turista:m pasajero:m inmigrante:m refugiado:m descendiente:m
    novato:m veterano:m aprendiz:m experto:m tutor:m dueño:m inquilino:m millonario:m
    chismoso:m fanfarrón:m tacaño:m traidor:m aliado:m cómplice:m sospechoso:m ganador:m
    perdedor:m
  ''',
  WordTheme.furniture: r'''
    almohada:f manta:f colchón:m cortina:f edredón:m armario:m estante:m mesilla:f
    alfombra:f estor:m persiana:f aplique:m flexo:m felpudo:m silla:f mesa:f cama:f sofá:m
    sillón:m taburete:m banqueta:f escritorio:m pupitre:m estantería:f cómoda:f cajón:m
    vitrina:f aparador:m mueble:m tocador:m perchero:m paragüero:m cuna:f litera:f catre:m
    somier:m cabecero:m sábana:f colcha:f cojín:m hamaca:f mecedora:f tumbona:f diván:m
    puf:m biombo:m mampara:f encimera:f alacena:f moqueta:f estera:f tapete:m tapiz:m
    cuadro:m marco:m póster:m portarretratos:m jarrón:m candelabro:m candil:m quinqué:m
    plafón:m lámpara_de_araña:f visillo:m mosquitera:f dosel:m adorno:m cenefa:f asiento:m
    futón:m cajonera:f velador:m toldo:m otomana:f escabel:m reposapiés:m revistero:m
    botellero:m trona:f secreter:m archivador:m jardinera:f
  ''',
});

/// The Spanish word dataset.
final WordLanguageData es = WordLanguageData(
  joiner: ' ',
  capitalize: false,
  adjectives: words(r'''
 azul verde rojo negro blanco amarillo dorado plateado oscuro claro brillante grande
 pequeño largo corto ancho estrecho alto bajo rápido lento fuerte débil duro blando
 caliente frío tibio seco húmedo limpio nuevo viejo joven hermoso feo dulce amargo
 salado picante agrio suave áspero ligero pesado redondo agudo profundo lejano
 cercano rico pobre raro tranquilo ruidoso valiente sabio alegre triste libre eterno
 transparente misterioso solitario radiante salvaje sereno silencioso antiguo moderno
 infinito hueco sedoso brumoso nublado lluvioso soleado nevado ventoso oxidado
 curioso travieso noble humilde gentil feroz ágil espinoso inquieto robusto enredado
 vívido tenue gris pálido intenso cálido helado ardiente sombrío luminoso majestuoso
 sencillo elegante gracioso astuto audaz perezoso alerta afilado romo
 liso rugoso denso escaso
 leal paciente vigilante hábil firme apacible franco reservado terco llano
 cortante peludo lustroso reluciente rechoncho macizo liviano gélido humeante
 aromático meloso moteado rayado gastado flamante añejo grueso
 delgado plano puntiagudo torcido recto esbelto achaparrado estridente sonoro
 grave melodioso ronco vibrante susurrante templado bochornoso
 encapotado despejado escarchado estrellado musgoso
 rojizo perfumado esmeralda coralino marfileño obsidiano cristalino
 argénteo broncíneo estañado plomizo carmesí bermejo ocre añil turquesa lavanda
 malva marfil azabache remoto minúsculo grandioso austero primoroso tosco frágil
 vigoroso amplio escarpado
 '''),
  actions: words(r'''
    dormido despierto perdido hallado escondido cansado mojado quemado congelado
    derretido roto abierto cerrado atado colgado caído sentado acostado olvidado
    recordado amado temido deseado buscado guardado herido curado salvado perdonado
    bendecido hechizado encantado asustado sorprendido enojado calmado animado agotado
    soñado peinado bañado vestido marcado pintado bordado tejido cosido tallado forjado
    pulido plantado sembrado cosechado regado podado florecido madurado tostado hervido
    asado frito horneado batido molido cortado picado envuelto sellado firmado escrito
    leído contado narrado cantado bailado tocado callado gritado susurrado reído llorado
    volado nadado saltado trepado rodado arrastrado empujado tirado lanzado atrapado
    soltado alzado bajado girado doblado estirado encogido apagado encendido
    despertado levantado agachado acurrucado apoyado vuelto acercado alejado detenido
    caminado corrido cruzado regresado partido desaparecido acechado tambaleado brincado
    mirado observado vigilado rozado alisado ordenado cuidado lavado
    secado recortado pegado plegado desplegado llenado
    vaciado servido revuelto guisado salteado calentado enfriado probado tragado grabado
    teñido barnizado limado sopesado saboreado rumiado
  '''),
  nouns: _nouns.pools,
  nounGender: _nouns.gender,
  // Spanish modifiers agree with the noun, and the base form is the masculine
  // one. Only the endings listed change; `azul` and `grande` match no rule and
  // are already right beside either gender.
  // A word outside the pools is read by its ending, which is what Spanish itself
  // does: `-a`, `-ión`, `-dad`, `-tad`, `-umbre` and `-triz` are feminine, the rest
  // masculine. An invented word has no true gender, and this is what keeps the
  // article and the adjective beside it agreeing with each other.
  genderRules: const <(String, WordGender)>[
    ('ión', WordGender.f),
    ('dad', WordGender.f),
    ('tad', WordGender.f),
    ('umbre', WordGender.f),
    ('triz', WordGender.f),
    ('a', WordGender.f),
    ('', WordGender.m),
  ],
  agreement: const <WordGender, List<List<String>>>{
    WordGender.f: <List<String>>[
      <String>['or', 'ora'],
      <String>['ón', 'ona'],
      <String>['és', 'esa'],
      <String>['ín', 'ina'],
      <String>['án', 'ana'],
      <String>['o', 'a'],
    ],
    WordGender.p: <List<String>>[
      <String>['z', 'ces'],
      <String>['or', 'ores'],
      <String>['ón', 'ones'],
      <String>['és', 'eses'],
      <String>['ín', 'ines'],
      <String>['án', 'anes'],
      <String>['o', 'os'],
      <String>['a', 'as'],
      <String>['e', 'es'],
      <String>['', 'es'],
    ],
    WordGender.fp: <List<String>>[
      <String>['z', 'ces'],
      <String>['or', 'oras'],
      <String>['ón', 'onas'],
      <String>['és', 'esas'],
      <String>['ín', 'inas'],
      <String>['án', 'anas'],
      <String>['o', 'as'],
      <String>['a', 'as'],
      <String>['e', 'es'],
      <String>['', 'es'],
    ],
  },
  // Spanish puts the modifier after the noun (`gato azul`), which is also what
  // lets it agree: the noun is drawn first, so its gender is known.
  // How common each noun is, for `vocabulary` to draw by: the everyday words,
  // and the ones a specialist or a dictionary would know. Every noun in neither
  // list is common.
  levels: WordLevels(
    basic: words(r'''
      gato perro león tigre zorro lobo oso panda conejo ardilla elefante ciervo caballo
      burro vaca toro cabra oveja cerdo mono gorila cocodrilo serpiente lagarto tortuga rana
      sapo pájaro cuervo águila loro búho paloma cisne pato gallina pez ballena delfín
      tiburón pulpo calamar gamba cangrejo caracol mariposa abeja hormiga araña mosca
      mosquito gusano murciélago camello koala cebra foca pingüino jirafa hipopótamo
      rinoceronte canguro chimpancé sardina atún bacalao merluza trucha salmón medusa almeja
      mejillón avispa botella lápiz goma paraguas lámpara espejo llave candado bolsa botón
      aguja hilo pincel pintura papel cuaderno carta mapa cámara película radio globo dado
      vela tienda linterna maceta taza cuchara plato olla sobre almohada manta cesta escoba
      cuerda cubo abanico red peine caja lata clavo tornillo cadena cremallera pulsera
      anillo mochila mar río lago cascada valle montaña colina bosque cueva desierto arena
      roca volcán terremoto arroyo bahía cumbre laguna cala cabo península meseta sombra eco
      orilla selva oasis playa costa canal corriente marea espuma cima árbol hoja flor raíz
      semilla fruto bambú pino rosa girasol hierba rama pétalo piña abeto roble césped alga
      ramo cactus orégano perejil menta manzanilla lavanda palmera tallo espina laurel olivo
      clavel margarita amapola tulipán trébol oro plata cobre hierro acero bronce cristal
      perla mármol mineral mercurio rubí zafiro esmeralda aluminio plomo pizarra libertad
      paz justicia verdad memoria imaginación cuento poema gramática física química biología
      matemática historia leyenda secreto promesa viaje aventura experimento pregunta
      respuesta consejo fiesta costumbre cultura idioma alfabeto razón tradición práctica
      arte ciencia destino suerte forma causa efecto orden límite origen dragón fénix
      unicornio sirena hada duende elfo enano ogro gigante vampiro fantasma alma espíritu
      demonio ángel diosa dios hechizo maldición brujo bruja sabio gnomo genio varita corona
      caballero cazador ladrón pirata marinero capitán cocinero jardinero detective poeta
      pintor bailarín payaso soldado guardia portero rey reina príncipe princesa granjero
      pescador pastor piloto ingeniero cartero bombero policía médico enfermero veterinario
      maestro alumno periodista escritor cantante actor director músico carpintero doctor
      árbitro panadero abogado juez cajero dependiente camarero conductor taxista mecánico
      peluquero carnicero astronauta piano guitarra tambor campana arpa canción danza ritmo
      melodía flauta trompeta saxofón violín batería pandereta nota silencio coro solo
      concierto escenario jazz nana final orquesta himno dúo trío castañuela estribillo
      tango rumba ópera mercado plaza ciudad puente jardín biblioteca museo teatro escuela
      parque puerto estación aeropuerto castillo palacio torre sótano patio gimnasio piscina
      zoológico ayuntamiento hospital farmacia librería panadería cafetería restaurante
      cocina dormitorio salón pasillo escalera túnel granja catedral cementerio feria barrio
      avenida taller arroz pan sopa ensalada sal azúcar pimienta ajo cebolla patata
      zanahoria pepino calabaza lechuga espinaca huevo queso mantequilla yogur manzana fresa
      uva sandía melocotón naranja limón plátano mango cereza chocolate caramelo galleta
      pastel flan hamburguesa pizza pasta tortilla paella croqueta churro turrón gazpacho
      tapa bocadillo salchicha jamón chorizo albóndiga filete mermelada miel maíz lenteja
      garbanzo guisante tomate pimiento berenjena calabacín brócoli coliflor pera mandarina
      kiwi nuez cacahuete bizcocho fútbol béisbol baloncesto voleibol tenis golf natación
      gimnasia karate judo boxeo surf esquí ciclismo raqueta portería medalla trofeo campeón
      patinaje casco falta espalda salto carrera meta podio ajedrez delantero entrenador
      estadio pista penalti córner tarjeta empate victoria derrota liga copa bicicleta tren
      barco coche autobús taxi camión moto patinete avión helicóptero nave cohete submarino
      tanque carretilla tractor excavadora ambulancia metro tranvía paracaídas triciclo
      furgoneta vagón carro camioneta grúa patín monopatín crucero bote ordenador teclado
      ratón pantalla impresora altavoz micrófono tableta móvil cargador pila mando nevera
      lavadora aspiradora ventilador microondas horno cepillo jabón champú perfume reloj
      secador zapatilla sandalia colchón cortina timbre calculadora bombilla enchufe toalla
      detergente sartén cafetera armario televisor consola plancha alfombra persiana mantel
      servilleta ducha bañera lavabo fucsia rosado mostaza lima turquesa lila púrpura crema
      beige carbón bronceado ceniza humo trigo canela pimentón coral violeta tostado morado
      amarillento rojizo dorado factura recibo interés préstamo hipoteca ahorro cuenta saldo
      presupuesto deuda crédito cheque moneda cartera nómina salario sueldo caja_fuerte
      gasto descuento contrato tipo impuesto multa herencia alquiler peaje botín tesoro
      riqueza pobreza servidor paquete cursor contenedor tubería instrucción proceso sesión
      consulta índice tabla vista columna fila campo cola lista conjunto parche etiqueta
      versión prueba perfil evento señal tema nube viento lluvia nieve niebla arcoíris rayo
      trueno llovizna granizo tormenta nublado ola_de_calor brisa clima temperatura presión
      chaparrón relámpago huracán tornado nevada gota humedad sequía estrella luna sol
      galaxia eclipse universo planeta satélite asteroide constelación órbita gravedad
      cráter atmósfera vacío vía_láctea amanecer momento futuro siglo década mañana mediodía
      tarde noche medianoche madrugada ayer hoy semana mes trimestre año época edad
      primavera verano otoño invierno ahora infancia aniversario temporada atardecer minuto
      segundo hora pausa espera turno pasado presente alegría tristeza miedo sorpresa
      felicidad alivio esperanza pena soledad deseo pasión cariño paciencia calma confianza
      duda preocupación ansiedad terror pánico rabia enojo aburrimiento emoción ilusión
      vergüenza culpa orgullo envidia celos ánimo humor odio cabeza frente ceja pestaña
      nariz mejilla barbilla labio lengua diente oreja cuello hombro codo muñeca dedo pulgar
      uña puño pecho ombligo cintura muslo rodilla tobillo talón hueso músculo corazón
      pulmón hígado estómago riñón intestino cerebro nervio vena sangre carne piel cabello
      barba lágrima sudor saliva arruga cicatriz moretón sombrero zapato guante bufanda
      gafas abrigo chaqueta camisa pantalón vaquero falda vestido jersey sudadera calcetín
      pijama delantal pañuelo corbata cinturón bota uniforme disfraz bañador manga tela seda
      algodón lana cuero gorro gorra chancla capucha hacha pala sierra alicate nivel regla
      tijera martillo mazo taladro lija pico rastrillo palanca rallador cuchilla motosierra
      serrucho escuadra grapadora pistola molde café té zumo leche agua gaseosa limonada
      batido mate cortado cerveza vino tinto champán sangría licor ron ginebra vodka whisky
      tequila cóctel jarabe refresco cacao muñeco peluche juguete juego pelota comba
      escondite columpio tobogán baraja sonido ruido voz grito susurro suspiro risa llanto
      bostezo estornudo tos silbido ladrido maullido explosión golpe aplauso guau miau niño
      bebé hombre mujer chico abuelo abuela madre padre hijo hermano tío primo marido novio
      novia amigo vecino héroe silla mesa cama sofá sillón escritorio estantería cuna sábana
      cojín cuadro balancín tiovivo noria aro sonajero plastilina pompa petardo confeti
      piñata máscara títere marioneta ficha tablero carcajada ronquido chillido rugido
      zumbido portazo pisada palmada pitido jaleo hipo eructo adolescente adulto anciano
      señor sobrino nieto gemelo pareja enemigo invitado extranjero desconocido villano
      líder jefe compañero testigo víctima prisionero mendigo padrino madrina suegro cuñado
      yerno nuera pariente taburete pupitre cómoda cajón mueble perchero litera hamaca
      mecedora tumbona encimera marco póster jarrón adorno gallo pavo rata hámster gaviota
      cucaracha langosta foto bolígrafo tiza pegamento tenedor cuchillo vaso bolso maleta
      collar cielo tierra isla océano piedra polvo barro hielo fuego ola luz oscuridad aire
      tronco hongo arbusto diamante joya vidrio sueño idea pensamiento fe problema solución
      guerra palabra frase número círculo triángulo medicina literatura poesía ley mago
      momia zombi monstruo magia profesor dentista rock pop rap casa habitación baño puerta
      ventana oficina supermercado hotel iglesia cine bar carretera camino calle pollo
      pescado tarta chicle salsa mayonesa aceite melón equipo jugador gol balón ascensor
      ferry portátil videojuego papel_higiénico teléfono pastilla marrón dinero billete
      precio lotería euro dólar internet web mensaje chat contraseña wifi robot error calor
      espacio día fin_de_semana lunes martes miércoles jueves viernes sábado domingo enero
      febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre
      vacaciones amor dolor ojo boca mano pie brazo pierna cara cuerpo traje camiseta
      calzoncillos bragas sujetador bolsillo destornillador libro revista periódico
      calendario carpeta esponja trapo cazo tarro pasaporte papelera charco estanque pozo
      nido paisaje incendio huella concha paja honor fama milagro misterio opinión plan
      proyecto política economía sociedad novela lección amistad poder científico arquitecto
      cirujano electricista vendedor empresario alcalde espía fotógrafo banda álbum hogar
      garaje balcón terraza tejado chimenea pared muro fábrica universidad circo gasolinera
      autopista acera semáforo fuente monumento pirámide prisión marisco ternera chuleta
      bollo bombón sándwich lasaña espagueti macarrón vinagre harina caldo puré palomitas
      nata coco aguacate almendra canasta entrenamiento pesa campeonato mundial monitor
      cable congelador lavavajillas batidora barbacoa desodorante colonia maquillaje pañal
      chupete biberón lejía antena tirita venda efectivo pago pérdida inversión
      transferencia propina beca oferta venta compra negocio empresa premio jubilación
      seguro hucha céntimo navegador buscador enlace correo usuario programa aplicación
      sistema código dato chip descarga actualización virus conexión blog foro festivo
      descanso siesta cumpleaños fecha horario cita prisa rato placer pereza estrés tensión
      frustración decepción respeto curiosidad cansancio susto garganta esqueleto bigote
      flequillo melena trenza herida meñique oído tripa tacón chándal cazadora cordón suela
      navaja cortacésped regadera manguera rodillo brocha chupito trago dinosaurio cordero
      cachorro yegua mula poni canario buitre lagartija mariquita piojo lombriz llama
      caballito_de_mar estrella_de_mar pez_espada babosa tarántula regalo bandera diario
      cenicero buzón espada flecha cartón diccionario cómic sacapuntas rotulador clip
      naturaleza suelo continente planta metal cemento vida muerte mundo mentira realidad
      fantasía éxito peligro moda salud examen tarea chiste broma noticia dibujo nombre
      tamaño peso velocidad fuerza energía paraíso infierno poción horóscopo hombre_lobo
      extraterrestre trabajador obrero empleado presidente político artista pianista
      futbolista camionero técnico informático música instrumento bajo festival flamenco
      reguetón hip_hop reggae música_clásica villancico electrónica pueblo país zona centro
      esquina rotonda parada lugar finca aparcamiento frontera ruta paseo edificio
      apartamento piso colegio instituto guardería clínica centro_comercial quiosco
      comisaría peluquería discoteca comedor techo sala helado postre comida desayuno
      almuerzo cena merienda tostada magdalena perrito_caliente patatas_fritas levadura
      kétchup especia pipas verdura champiñón fruta aceituna deporte partido balonmano yoga
      resultado club selección lesión vehículo electrodoméstico medicamento aspirina alarma
      peluca tatuaje masaje peinado manicura cera gomina bronceador rojo azul verde amarillo
      negro blanco gris color rubio moreno plateado cambio crisis tarifa documento vídeo
      página menú tecnología informática meme emoji frío astronomía Mercurio Venus Tierra
      Marte Júpiter Saturno Urano Neptuno Plutón tiempo vez curso nacimiento asco
      sentimiento diversión perdón colmillo coleta moño moco respiración ropa biquini talla
      herramienta trampa jeringa bebida futbolín figura atracción disparo volumen persona
      gente familia chica esposa cliente paciente turista pasajero dueño
    '''),
    rare: words(r'''
      ñu suricata ornitorrinco lémur babuino tapir alondra abubilla jilguero arrendajo
      tritón dedal arandela arcón cántaro estuario atolón istmo morrena pedregal bajío
      escollo fumarola sumidero ciénaga remanso vado ensenada rompiente farallón risco
      hondonada sima ginkgo eneldo estragón avellano alerce begonia dalia peonía carrizo
      ágata basalto pedernal mica fluorita calcita malaquita olivino turmalina circón pirita
      magnetita hematita cinabrio galena bismuto wolframio manganeso lapislázuli cornalina
      jaspe ónice berilo espinela peridoto alabastro arenisca esquisto gneis cuarcita toba
      dolomita apatito barita corindón feldespato moscovita siderita limonita bauxita
      almanaque axioma paradigma linaje retórica dialéctica semántica basilisco gólem náyade
      dríade valquiria nigromante bestiario sátiro gorgona leviatán behemot trasgo ondina
      silfo sílfide sortilegio grimorio pentáculo hipogrifo mantícora erudito perfumista
      curtidor vidriero botánico archivero interludio rapsodia cantata semitono fagot corno
      zampoña ocarina caramillo dulzaina bandurria cítara salterio güiro contrapunto arpegio
      trino glisando legato ritornelo bastión atalaya caserío arrabal esclusa fragua
      pentatlón decatlón tanteo palanquín gabarra biplano motonieve calesa berlina cabriolé
      faetón volquete galera corbeta bergantín goleta chalupa ultraligero enrutador
      ecualizador aplique bermellón siena borgoña peltre cerúleo verdín celadón amaranto
      glauco bermejo antracita albero alazán zaino bayo verdemar corinto cárdeno garzo
      ambarino níveo superávit regalía acreedor fiador liquidez solvencia estipendio arqueo
      pagaré gravamen exención usura portazgo diezmo búfer códec subred carga_útil clúster
      depurador ensamblador tasa_de_bits descifrado sombreador octeto enrutamiento
      conmutación datagrama reversión grafo solana cellisca céfiro galerna escampada
      canícula siroco tramontana cierzo ábrego alisio tolvanera rociada orvallo calabobos
      sirimiri relente estiaje eclíptica plenilunio novilunio perigeo cuásar púlsar paralaje
      parsec nadir acimut perihelio afelio coronal fotosfera cromosfera magnetosfera
      ionosfera exosfera mesosfera heliosfera solano trienio bienio efeméride alborada
      jornal vespertino hogaño albor añada decenio centuria cuatrienio sexenio templanza
      reverencia sosiego fervor desdén recelo hastío tedio congoja aflicción desconsuelo
      desaliento abatimiento arrobo clemencia indulgencia benevolencia alborozo regocijo
      desazón zozobra pasmo esternón húmero cúbito falange metatarso corva esclerótica
      frenillo gabán levita chaqué casaca jubón sayo camisola enagua polaina babucha
      escarpín mitón miriñaque bicornio cofia lezna amoladora almádena laya mayal
      remachadora clavadora caladora gubia bisel berbiquí barrena formón garlopa escofina
      escoplo gramil plomada cric yesquero troquel esmeril mandril azuela hidromiel atole
      pulque tepache bíter aguamiel rompope clarete amontillado rayuela diábolo bumerán
      papiroflexia tirachinas tirolina cubilete caleidoscopio trabalenguas gorjeo borboteo
      tañido redoble retumbo estruendo traqueteo zapateo abucheo runrún algarabía griterío
      clamor cuchicheo parloteo tartamudeo balbuceo arrullo carraspeo bufido resonancia
      acústica chinchín nómada ermitaño heredero ahijado antepasado aldeano rehén fugitivo
      holgazán sabelotodo empollón parlanchín banqueta vitrina aparador tocador paragüero
      catre somier cabecero colcha diván puf biombo mampara alacena moqueta estera tapete
      tapiz portarretratos candelabro candil quinqué plafón lámpara_de_araña visillo
      mosquitera dosel cenefa témpano meandro afluente desembocadura taiga manglar arboleda
      espejismo liquen tubérculo espora alcornoque cocotero baobab tejo boj brezo retama
      caléndula adelfa lúpulo esqueje sodio potasio magnesio silicio carbono paladio iridio
      vanadio citrino aventurina heliotropo azurita rodonita sodalita labradorita tanzanita
      alejandrita piedra_lunar ojo_de_tigre escoria filón travertino pórfido hulla lignito
      sílice druida nereida semidiós querubín serafín súcubo íncubo elixir alquimia
      vellocino ambrosía inframundo limbo purgatorio invocación exorcismo aura reencarnación
      ánima piedra_filosofal juglar malabarista guardabosques centinela almirante tonalidad
      barítono diapasón atril baqueta batuta bandoneón charango bongó conga marimba clarín
      lira carillón anfiteatro planetario frontón petanca biatlón pelotón maillot dorsal
      fichaje regate volea trirreme aerodeslizador batiscafo apisonadora carromato cuadriga
      tartana monovolumen utilitario cupé vagoneta barcaza trolebús carabela ballenero
      trasatlántico portaaviones destructor montacargas telesilla funicular gramófono vinilo
      casete vitrocerámica sandwichera rizador humidificador bidé módem acondicionador
      ultramar grana azulete perlado ahumado tornasol témpera hollín tabaco accionista banca
      devaluación cotización calderilla embargo desahucio fichero bucle transistor autómata
      compresión excepción vector ancho_de_banda tromba frescor carámbano pedrisco mistral
      cirro nimbo terral celaje arrebol ventolera viento_solar llamarada materia_oscura nova
      alunizaje magnetar singularidad cuerpo_celeste hemisferio vendimia antigüedad
      prehistoria milisegundo lujuria soberbia vanidad desgana indiferencia remordimiento
      fascinación médula neurona glándula páncreas apéndice útero aorta bíceps glúteo anular
      sari toga sotana coraza tiara leotardo cachemir licra poliéster nailon lentejuela
      pañoleta fular hábito desbrozadora pulverizador sembradora podadora andamio cartabón
      transportador llana rascador fresadora prensa caballete pelacables multímetro carraca
      pie_de_cabra cepillo_de_carpintero moscatel absenta pisco cachaza grappa moca sifón
      agua_de_coco consomé pinzón cormorán narval cayo cenote altiplano glicinia enebro
      ceiba alhelí jara geoda nigromancia transmutación chamanismo clarividencia
      telequinesis arcano éter cornucopia Valhalla oréade erinia lamia cocatriz guiverno
      homúnculo necrófago nahual cadejo chaneque ciguapa imbunche lobisón pishtaco muki
      cuélebre xana ojáncano anjana sacamantecas basajaun síncopa vihuela clavecín balalaica
      bebop ragtime lied motete scherzo rondó tocata poema_sinfónico farruca petenera
      tonadilla huayno candombe dembow guaracha shoegaze vaporwave synthwave grime breakbeat
      downtempo city_pop dream_pop nu_metal doom_metal power_metal metalcore alcazaba
      velódromo minarete parador aserradero bungaló barraca pozole pupusa kombu wakame
      seitán melaza topinambur rebozuelo verdolaga jícama borraja grelo feijoa acerola
      lúcuma mamey zapote bergamota cidra balandro velocípedo portacontenedores navío
      colutorio prebase borla cetrino cencellada cumulonimbo Aldebarán Antares cosmología
      magnitud tiroides buril zarzaparrilla champurrado guarapo tereré mistela tute brisca
      corro charada berrea gorgoteo escabel velador secreter otomana quiromancia ectoplasma
      Sedna Quaoar Gonggong Salacia Varuna Ixión Higía Psique Bennu Ryugu Apofis Arrokoth
      Tea Vulcano Dimidium Spe Orbitar Fortitudo Ægir Amateru Dagon Meztli Smertrios
      Phobetor Tassili Madriu Yanyan Tondra Eburonia Yvaga Mastika Bendida Nakanbé Awasis
      Wangshu Pipitea Asye Veles Boinayel Eyeke Cayahuanca Hämarik Abol Bélisama Mintome
      Toge Santamasa Noifasui Chura Buru Staburags Baiduri Cuptor Xólotl Hairu Laligurans
      Kereru Albmi Perwana Viculus Samagiya Ramajay Khomsa Barajeel Cruinlagh Ibirapitá
      Madalitso Bambaruush Tahay Awohali Enaiposha Phailinsiam Najsakopajk Qingluan Cuancoá
      Astrolábos Ahra Aumatex Ixbalanqué Surt Haik Mulchatna Makombé Zembretta Bocaprins
      Agouto
    '''),
  ),
  frames: const <WordFrame>[
    WordFrame(<WordSlot>[WordSlot.noun], 12),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.adjective], 46),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.action], 30),
    WordFrame(<WordSlot>[WordSlot.noun, WordSlot.adjective, WordSlot.action], 12),
  ],
  syn: SyllableSynthesis(
    onset: words('b c ch d f g gu h j l ll m n ñ p qu r rr s t v y z br cr dr fr gr pl pr tr'),
    vowel: words('a a e e i o o u ia ie io ua ue uo ai ei oi au eu'),
    coda: <String>['', '', ...words('n l r s z')],
    minSyllables: 2,
    maxSyllables: 3,
  ),
);
