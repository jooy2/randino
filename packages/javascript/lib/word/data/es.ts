import { taggedNouns, words } from '../../_internal/parse.js';
import type { WordLanguageData } from './types.js';

// Written once, with the gender each noun carries; `taggedNouns` splits the tags
// back off into the lookup the modifiers agree against.
const NOUNS = taggedNouns({
	animal: `
		gato:m perro:m león:m tigre:m leopardo:m guepardo:m zorro:m lobo:m oso:m panda:m nutria:f
		conejo:m ardilla:f elefante:m ciervo:m caballo:m burro:m vaca:f toro:m cabra:f oveja:f
		cerdo:m mono:m gorila:m cocodrilo:m serpiente:f lagarto:m tortuga:f rana:f sapo:m pájaro:m
		golondrina:f gorrión:m cuervo:m halcón:m águila:f pavo_real:m loro:m búho:m paloma:f
		grulla:f cisne:m pato:m ganso:m gallina:f pez:m ballena:f delfín:m tiburón:m pulpo:m
		calamar:m gamba:f cangrejo:m caracol:m mariposa:f abeja:f hormiga:f araña:f libélula:f
		cigarra:f mosca:f mosquito:m gusano:m murciélago:m erizo:m mapache:m tejón:m lince:m
		bisonte:m alce:m camello:m koala:m perezoso:m hurón:m topo:m garza:f pelícano:m morsa:f
		comadreja:f gacela:f cebra:f búfalo:m foca:f pingüino:m avestruz:m
	`,
	object: `
		botella:f lápiz:m goma:f paraguas:m lámpara:f farol:m espejo:m llave:f candado:m bolsa:f
		botón:m aguja:f hilo:m pincel:m pintura:f papel:m cuaderno:m carta:f postal:f sello:m
		mapa:m catalejo:m microscopio:m cámara:f película:f radio:f globo:m cometa:f peonza:f
		canica:f dado:m naipe:m rompecabezas:m vela:f ancla:f tienda:f linterna:f cerilla:f
		maceta:f tetera:f taza:f cuchara:f plato:m olla:f engranaje:m resorte:m imán:m cinta:f
		sobre:m almohada:f manta:f cesta:f escoba:f silbato:m cuerda:f cubo:m abanico:m escudo:m
		red:f caña:f jarra:f peine:m campanilla:f embudo:m bandeja:f caja:f barril:m lata:f
		frasco:m
	`,
	nature: `
		mar:m río:m lago:m cascada:f valle:m montaña:f colina:f pradera:f bosque:m cueva:f
		desierto:m arena:f roca:f guijarro:m volcán:m terremoto:m glaciar:m arrecife:m pantano:m
		arroyo:m bahía:f duna:f cumbre:f páramo:m estepa:f sabana:f humedal:m estuario:m delta:m
		laguna:f atolón:m fiordo:m cala:f cabo:m península:f istmo:m archipiélago:m islote:m
		meseta:f cañón:m acantilado:m grieta:f morrena:f pedregal:m peñasco:m banco:m bajío:m
		escollo:m abismo:m géiser:m fumarola:f sumidero:m estalactita:f estalagmita:f gruta:f
		repisa:f ladera:f sombra:f eco:m brasa:f manantial:m orilla:f litoral:m
	`,
	plant: `
		árbol:m hoja:f flor:f raíz:f semilla:f fruto:m musgo:m helecho:m bambú:m pino:m arce:m
		cerezo:m rosa:f loto:m crisantemo:m orquídea:f girasol:m nenúfar:m hierba:f rama:f brote:m
		capullo:m pétalo:m polen:m piña:f bellota:f ginkgo:m sauce:m abedul:m cedro:m abeto:m
		roble:m castaño:m nogal:m césped:m alga:f seto:m ramo:m cactus:m áloe:m albahaca:f
		tomillo:m orégano:m perejil:m cilantro:m cebollino:m hinojo:m eneldo:m salvia:f estragón:m
		menta:f manzanilla:f lavanda:f enredadera:f palmera:f
	`,
	gem: `
		oro:m plata:f cobre:m hierro:m acero:m bronce:m latón:m estaño:m zinc:m platino:m
		cristal:m cuarzo:m amatista:f ágata:f ámbar:m perla:f jade:m ópalo:m obsidiana:f mármol:m
		granito:m caliza:f basalto:m pedernal:m meteorito:m mineral:m gema:f lingote:m mica:f
		fluorita:f calcita:f malaquita:f granate:m azufre:m marfil:m pepita:f grafito:m mercurio:m
		yeso:m veta:f olivino:m turmalina:f rubí:m zafiro:m esmeralda:f topacio:m circón:m
		pirita:f magnetita:f hematita:f cinabrio:m galena:f talco:m bismuto:m
	`,
	concept: `
		libertad:f paz:f justicia:f verdad:f sabiduría:f memoria:f imaginación:f cuento:m poema:m
		boceto:m gramática:f lógica:f física:f química:f biología:f filosofía:f matemática:f
		geometría:f álgebra:f historia:f mito:m leyenda:f fábula:f refrán:m acertijo:m secreto:m
		promesa:f viaje:m aventura:f travesía:f hallazgo:m experimento:m pregunta:f respuesta:f
		debate:m consejo:m fiesta:f dimensión:f equilibrio:m armonía:f ritual:m costumbre:f
		cultura:f idioma:m alfabeto:m cifra:f archivo:m almanaque:m horizonte:m intuición:f
		razón:f juicio:m doctrina:f teorema:m axioma:m hipótesis:f paradoja:f dilema:m paradigma:m
		premisa:f deducción:f inducción:f analogía:f metáfora:f símbolo:m crónica:f testimonio:m
		manifiesto:m tratado:m alianza:f linaje:m legado:m tradición:f ceremonia:f umbral:m
	`,
	myth: `
		dragón:m fénix:m unicornio:m sirena:f hada:f duende:m elfo:m enano:m trol:m ogro:m
		gigante:m quimera:f hidra:f grifo:m centauro:m minotauro:m esfinge:f pegaso:m kraken:m
		basilisco:m gólem:m vampiro:m licántropo:m espectro:m fantasma:m alma:f espíritu:m
		demonio:m ángel:m diosa:f dios:m hechizo:m maldición:f profecía:f oráculo:m amuleto:m
		talismán:m runa:f portal:m santuario:m ídolo:m tótem:m ninfa:f náyade:f dríade:f
		valquiria:f musa:f brujo:m bruja:f nigromante:m alquimista:m sabio:m augurio:m presagio:m
		bestiario:m
	`,
	job: `
		caballero:m cazador:m ladrón:m pirata:m marinero:m capitán:m cocinero:m jardinero:m
		herrero:m detective:m poeta:m pintor:m bailarín:m payaso:m viajero:m peregrino:m monje:m
		arquero:m espadachín:m guerrero:m general:m soldado:m guardia:m portero:m rey:m reina:f
		príncipe:m princesa:f emperador:m mayordomo:m criada:f sirviente:m mercader:m granjero:m
		pescador:m pastor:m leñador:m barquero:m cochero:m piloto:m ingeniero:m cartero:m
		repartidor:m barrendero:m bombero:m policía:m médico:m enfermero:m farmacéutico:m
		veterinario:m maestro:m alumno:m periodista:m escritor:m editor:m traductor:m cantante:m
		actor:m director:m músico:m minero:m carpintero:m alfarero:m sastre:m adivino:m profeta:m
		sacerdote:m erudito:m doctor:m inventor:m explorador:m atleta:m árbitro:m acróbata:m
		escultor:m guía:m relojero:m panadero:m cervecero:m perfumista:m curtidor:m tejedor:m
	`,
	music: `
		piano:m guitarra:f tambor:m campana:f arpa:f canción:f danza:f ritmo:m melodía:f acorde:m
		flauta:f trompeta:f saxofón:m clarinete:m oboe:m violonchelo:m viola:f violín:m batería:f
		platillo:m pandereta:f xilófono:m órgano:m armónica:f acordeón:m laúd:m mandolina:f
		banjo:m partitura:f nota:f silencio:m escala:f coro:m solo:m concierto:m escenario:m
		sinfonía:f sonata:f vals:m jazz:m balada:f nana:f marcha:f preludio:m interludio:m final:m
		compás:f orquesta:f movimiento:m obertura:f fuga:f estudio:m nocturno:m serenata:f
		rapsodia:f himno:m réquiem:m cantata:f aria:f dúo:m trío:m cuarteto:m quinteto:m octava:f
		semitono:m clave:f pentagrama:m metrónomo:m pedal:m traste:m boquilla:f
	`,
	place: `
		mercado:m plaza:f ciudad:f aldea:f callejón:m puente:m jardín:m biblioteca:f museo:m
		teatro:m escuela:f parque:m puerto:m muelle:m estación:f aeropuerto:m faro:m castillo:m
		muralla:f palacio:m templo:m torre:f desván:m sótano:m azotea:f patio:m porche:m
		invernadero:m granero:m cabaña:f mirador:m recreo:m gimnasio:m piscina:f acuario:m
		galería:f zoológico:m balneario:m ayuntamiento:m correos:m hospital:m farmacia:f
		librería:f panadería:f cafetería:f restaurante:m cocina:f dormitorio:m salón:m pasillo:m
		escalera:f túnel:m pasarela:f cruce:m alameda:f fortaleza:f granja:f rancho:m huerto:m
		abadía:f claustro:m bastión:m atalaya:f foso:m astillero:m malecón:m campamento:m villa:f
		mansión:f caserío:m
	`,
	food: `
		arroz:m pan:m fideo:m sopa:f guiso:m ensalada:f sal:f azúcar:m pimienta:f ajo:m cebolla:f
		patata:f zanahoria:f pepino:m calabaza:f col:f lechuga:f espinaca:f seta:f tofu:m huevo:m
		queso:m mantequilla:f yogur:m manzana:f fresa:f uva:f sandía:f melocotón:m naranja:f
		limón:m plátano:m mango:m cereza:f piña_fruta:f chocolate:m caramelo:m galleta:f pastel:m
		flan:m rosquilla:f gofre:m tortita:f hamburguesa:f pizza:f pasta:f curry:m tortilla:f
		paella:f empanada:f croqueta:f churro:m turrón:m mazapán:m gazpacho:m tapa:f bocadillo:m
		salchicha:f jamón:m tocino:m chorizo:m morcilla:f albóndiga:f filete:m costilla:f
		mermelada:f miel:f
	`,
	sport: `
		fútbol:m béisbol:m baloncesto:m voleibol:m tenis:m bádminton:m golf:m boliche:m billar:m
		natación:f atletismo:m maratón:m gimnasia:f karate:m judo:m esgrima:f lucha:f boxeo:m
		tiro:m equitación:f remo:m vela_deporte:f surf:m esquí:m hockey:m rugby:m críquet:m
		ciclismo:m escalada:f raqueta:f bate:m portería:f medalla:f trofeo:m campeón:m
		eliminatoria:f prórroga:f polo:m patinaje:m buceo:m dardo:m valla:f jabalina:f disco:m
		relevo:m marcador:m casco:m falta:f jonrón:m espalda:f braza:f halterofilia:f trineo:m
		saque:m rebote:m salto:m carrera:f meta:f podio:m vestuario:m grada:f afición:f
	`,
	vehicle: `
		bicicleta:f tren:m barco:m coche:m autobús:m taxi:m camión:m moto:f patinete:m avión:m
		helicóptero:m nave:f cohete:m submarino:m yate:m carguero:m velero:m balsa:f acorazado:m
		tanque:m carroza:f carreta:f carretilla:f tractor:m excavadora:f ambulancia:f teleférico:m
		metro:m tranvía:m locomotora:f canoa:f kayak:m dirigible:m paracaídas:m palanquín:m
		triciclo:m furgoneta:f limusina:f quitanieves:m monorraíl:m catamarán:m rompehielos:m
		petrolero:m gabarra:f pesquero:m biplano:m hidroavión:m sonda:f motonieve:f monociclo:m
		remolcador:m góndola:f carruaje:m vagón:m
	`,
	product: `
		ordenador:m teclado:m ratón:m pantalla:f impresora:f altavoz:m auricular:m micrófono:m
		dron:m tableta:f móvil:m cargador:m pila:f mando:m nevera:f lavadora:f aspiradora:f
		ventilador:m estufa:f purificador:m arrocera:f microondas:m horno:m licuadora:f
		maquinilla:f cepillo:m dentífrico:m jabón:m champú:m perfume:m reloj:m proyector:m
		enrutador:m escáner:m secadora:f secador:m loción:f protector:m zapatilla:f sandalia:f
		colchón:m cortina:f timbre:m termómetro:m extintor:m calculadora:f bombilla:f enchufe:m
		regleta:f edredón:m funda:f toalla:f palangana:f detergente:m suavizante:m olla_exprés:f
		sartén:f cafetera:f batidor:m pelador:m sacacorchos:m termo:m felpudo:m percha:f armario:m
		estante:m mesilla:f
	`,
	color: `
		carmesí:m escarlata:m bermellón:m magenta:m fucsia:m rosado:m coral_color:m salmón_color:m
		ámbar_color:m ocre:m siena:m sepia:m mostaza:m oliva:m lima:f turquesa:f cian:m
		azul_cielo:m añil:m índigo:m lila:m malva:f púrpura:f borgoña:m herrumbre:f terracota:f
		crema:f beige:m caqui:m carbón:m peltre:m marfil_color:m ébano:m azabache:m cerúleo:m
		azafrán:m aguamarina:f verdín:m celadón:m nácar:m cobrizo:m dorado_color:m bronceado:m
		ceniza:f humo:m vino_color:m arena_color:f trigo:m canela:f nuez_moscada:f pimentón:m
	`,
	finance: `
		factura:f recibo:m bono:m acción_bolsa:f dividendo:m interés:m préstamo:m hipoteca:f
		depósito:m ahorro:m cuenta:f saldo:m presupuesto:m auditoría:f activo:m pasivo:m capital:m
		ingreso:m ganancia:f margen:m superávit:m déficit:m deuda:f crédito:m débito:m cheque:m
		moneda:f divisa:f rendimiento:m cartera:f arancel:m reembolso:m prima:f pensión:f nómina:f
		salario:m sueldo:m bono_extra:m comisión:f regalía:f franquicia:f fusión:f adquisición:f
		rescate:m aval:m vale:m cupón:m lingote_oro:m caja_fuerte:f tesorería:f remesa:f
		liquidación:f arbitraje:m garantía:f descubierto:m extracto:m libreta:f custodia:f
		acreedor:m deudor:m prestamista:m fiador:m tasación:f inflación:f recesión:f liquidez:f
		solvencia:f quiebra:f donación:f subsidio:m estipendio:m gasto:m descuento:m plazo:m
	`,
	tech: `
		servidor:m caché:f búfer:m píxel:m códec:m paquete:m protocolo:m cola_datos:f pila_datos:f
		montículo:m puntero:m compilador:m firmware:m registro:m latencia:f pasarela_red:f
		cortafuegos:m subred:f anfitrión:m carga_útil:f suma_control:f esquema:m cursor:m
		respaldo:m clúster:m fragmento:m réplica:f instantánea:f contenedor:m tubería:f
		repositorio:m depurador:m macro:f matriz:f entero:m sintaxis:f analizador:m ensamblador:m
		instrucción:f interrupción:f tasa_de_bits:f saludo_red:m extremo:m cifrado:m descifrado:m
		sombreador:m textura:f polígono:m malla:f octeto:m enrutamiento:m conmutación:f difusión:f
		datagrama:m partición:f directorio:m reversión:f migración:f
	`,
	weather: `
		nube:f viento:m lluvia:f nieve:f escarcha:f niebla:f rocío:m arcoíris:m ocaso:m rayo:m
		trueno:m chubasco:m monzón:m tifón:m torbellino:m ventisca:f llovizna:f granizo:m
		aguanieve:f vendaval:m ráfaga:f ciclón:m tormenta:f tempestad:f diluvio:m aguacero:m
		calima:f bruma:f neblina:f humedad_aire:f pronóstico:m nublado:m solana:f ola_de_calor:f
		helada:f deshielo:m cellisca:f remolino:m brisa:f céfiro:m galerna:f borrasca:f
		anticiclón:m clima:m temperatura:f presión:f nubarrón:m chaparrón:m sereno:m relámpago:m
		centella:f escampada:f
	`,
	space: `
		estrella:f luna:f sol:m galaxia:f cometa_astro:m meteoro:m aurora:f menguante:m
		creciente:m eclipse:m cenit:m universo:m planeta:m satélite:m asteroide:m nebulosa:f
		cúmulo:m constelación:f órbita:f gravedad:f rotación:f traslación:f mancha_solar:f
		cráter:m año_luz:m astro:m firmamento:m eclíptica:f meridiano:m estratosfera:f atmósfera:f
		vacío:m ingravidez:f plenilunio:m novilunio:m polar:f vespertino:m matutino:m marte:m
		venus:m júpiter:m saturno:m urano:m neptuno:m plutón:m supernova:f cuásar:m púlsar:m
		vía_láctea:f cosmos:m
	`,
	time: `
		amanecer:m alba:f crepúsculo:m ocaso_hora:m anochecer:m solsticio:m equinoccio:m momento:m
		eternidad:f futuro:m instante:m siglo:m década:f mañana:f mediodía:m tarde:f noche:f
		medianoche:f madrugada:f víspera:f ayer:m hoy:m jornada:f semana:f quincena:f mes:m
		trimestre:m semestre:m año:m lustro:m milenio:m época:f era:f edad:f primavera:f verano:m
		otoño:m invierno:m solano:m antaño:m ahora:m luego:m infancia:f juventud:f madurez:f
		vejez:f ocaso_vida:m plazo_tiempo:m intervalo:m duración:f transcurso:m período:m
		aniversario:m efeméride:f temporada:f alborada:f atardecer:m
	`,
	emotion: `
		alegría:f tristeza:f ira:f miedo:m sorpresa:f gozo:m júbilo:m dicha:f felicidad:f
		euforia:f éxtasis:m consuelo:m alivio:m esperanza:f desesperanza:f pena:f melancolía:f
		nostalgia:f soledad:f añoranza:f anhelo:m deseo:m pasión:f cariño:m ternura:f calidez:f
		bondad:f compasión:f empatía:f lástima:f gratitud:f humildad:f paciencia:f prudencia:f
		templanza:f integridad:f sinceridad:f asombro:m reverencia:f serenidad:f calma:f sosiego:m
		confianza:f duda:f sospecha:f preocupación:f ansiedad:f pavor:m terror:m pánico:m furia:f
		rabia:f enojo:m fastidio:m aburrimiento:m apatía:f entusiasmo:m fervor:m ardor:m emoción:f
		ilusión:f coraje:m valentía:f timidez:f vergüenza:f culpa:f orgullo:m envidia:f celos:m
		codicia:f ánimo:m humor:m capricho:m
	`,
	body: `
		cabeza:f frente:f ceja:f pestaña:f párpado:m nariz:f mejilla:f barbilla:f mandíbula:f
		labio:m lengua:f diente:m encía:f oreja:f lóbulo:m cuello:m nuca:f hombro:m codo:m
		muñeca:f palma:f nudillo:m dedo:m pulgar:m uña:f puño:m pecho:m vientre:m ombligo:m
		cintura:f cadera:f muslo:m rodilla:f espinilla:f pantorrilla:f tobillo:m talón:m hueso:m
		cráneo:m músculo:m tendón:m ligamento:m articulación:f cartílago:m corazón:m pulmón:m
		hígado:m estómago:m riñón:m bazo:m intestino:m vejiga:f cerebro:m nervio:m vena:f
		arteria:f capilar:m sangre:f carne:f piel:f poro:m cabello:m barba:f lágrima:f sudor:m
		saliva:f aliento:m pulso:m latido:m clavícula:f rótula:f pómulo:m tímpano:m globo_ocular:m
		arruga:f peca:f hoyuelo:m cicatriz:f moretón:m ampolla:f callo:m
	`,
	clothing: `
		sombrero:m zapato:m guante:m bufanda:f gafas:f abrigo:m gabán:m chaqueta:f americana:f
		camisa:f blusa:f túnica:f pantalón:m vaquero:m short:m falda:f vestido:m chaleco:m
		rebeca:f jersey:m sudadera:f calcetín:m media:f pijama:m delantal:m pañuelo:m corbata:f
		pajarita:f cinturón:m faja:f mocasín:m bota:f pantufla:f uniforme:m disfraz:m bata:f
		capa:f poncho:m chubasquero:m anorak:m parka:f bañador:m mono_trabajo:m manga:f
		puño_camisa:m dobladillo:m solapa:f forro:m tela:f lino:m seda:f algodón:m lana:f
		terciopelo:m pana:f franela:f cuero:m boina:f gorro:m gorra:f casco_ropa:m turbante:m
		velo:m chal:m mantón:m
	`,
	tool: `
		hacha:f pala:f sierra:f alicate:m cincel:m yunque:m fuelle:m lezna:f abrazadera:f nivel:m
		calibre:m regla:f tijera:f martillo:m mazo:m taladro:m lija:f pico:m hoz:f guadaña:f
		azada:f arado:m rastrillo:m soldador:m amoladora:f cortadora:f hachuela:f palanca:f cuña:f
		polea:f manivela:f almádena:f paleta:f rallador:m tamiz:m laya:f mayal:m huso:m
		lanzadera:f carrete:m cuchilla:f taller_caja:f remachadora:f clavadora:f caladora:f
		torno:m lijadora:f motosierra:f serrucho:m gubia:f punzón:m escuadra:f bisel:m
	`,
	drink: `
		café:m té:m zumo:m leche:f agua:f gaseosa:f limonada:f sidra:f horchata:f batido:m
		malteada:f infusión:f poleo:m tila:f mate:m cortado:m capuchino:m expreso:m carajillo:m
		descafeinado:m cerveza:f caña_cerveza:f clara:f vino:m tinto:m blanco_vino:m rosado_vino:m
		cava:m champán:m jerez:m oporto:m vermut:m sangría:f licor:m aguardiente:m orujo:m ron:m
		ginebra:f vodka:m whisky:m coñac:m brandy:m tequila:m mezcal:m sake:m hidromiel:f cóctel:m
		ponche:m néctar:m jarabe:m refresco:m soda:f tónica:f granizado:m
	`
});

export const ES: WordLanguageData = {
	joiner: ' ',
	capitalize: false,
	adjectives: words(`
		azul verde rojo negro blanco amarillo dorado plateado oscuro claro brillante grande
		pequeño largo corto ancho estrecho alto bajo rápido lento fuerte débil duro blando
		caliente frío tibio seco húmedo limpio nuevo viejo joven hermoso feo dulce amargo salado
		picante agrio suave áspero ligero pesado redondo agudo profundo lejano cercano rico pobre
		raro tranquilo ruidoso valiente sabio alegre triste libre eterno transparente misterioso
		solitario radiante salvaje sereno silencioso antiguo moderno infinito hueco sedoso brumoso
		nublado lluvioso soleado nevado ventoso oxidado curioso travieso noble humilde gentil
		feroz ágil espinoso inquieto robusto enredado vívido tenue gris pálido intenso cálido
		helado ardiente sombrío luminoso majestuoso sencillo elegante gracioso astuto audaz
		sereno_calmo perezoso alerta afilado romo liso rugoso denso escaso
	`),
	actions: words(`
		dormido despierto perdido hallado escondido cansado mojado quemado congelado derretido
		roto abierto cerrado atado colgado caído sentado acostado olvidado recordado amado temido
		deseado buscado guardado herido curado salvado perdonado bendecido hechizado encantado
		asustado sorprendido enojado calmado animado agotado soñado peinado bañado vestido marcado
		pintado bordado tejido cosido tallado forjado pulido plantado sembrado cosechado regado
		podado florecido madurado tostado hervido asado frito horneado batido molido cortado
		picado envuelto sellado firmado escrito leído contado narrado cantado bailado tocado
		callado gritado susurrado reído llorado volado nadado saltado trepado rodado arrastrado
		empujado tirado lanzado atrapado soltado alzado bajado girado doblado estirado encogido
		apagado encendido
	`),
	nouns: NOUNS.pools,
	nounGender: NOUNS.gender,
	// Spanish modifiers agree with the noun, and the base form is the masculine
	// one. Only the endings listed change; `azul` and `grande` match no rule and
	// are already right beside either gender.
	agreement: {
		f: [
			['or', 'ora'],
			['ón', 'ona'],
			['és', 'esa'],
			['ín', 'ina'],
			['án', 'ana'],
			['o', 'a']
		]
	},
	// Spanish puts the modifier after the noun (`gato azul`), which is also what
	// lets it agree: the noun is drawn first, so its gender is known. There is no
	// possessive shape, for the reason English has none — `de` is a word rather
	// than something that attaches to the word in front of it.
	frames: [
		{ slots: ['noun'], weight: 12 },
		{ slots: ['noun', 'adjective'], weight: 46 },
		{ slots: ['noun', 'action'], weight: 30 },
		{ slots: ['noun', 'adjective', 'action'], weight: 12 }
	],
	syn: {
		kind: 'syllable',
		onset: words('b c ch d f g gu h j l ll m n ñ p qu r rr s t v y z br cr dr fr gr pl pr tr'),
		vowel: words('a a e e i o o u ia ie io ua ue uo ai ei oi au eu'),
		coda: ['', '', ...words('n l r s z')],
		minSyllables: 2,
		maxSyllables: 3
	}
};
