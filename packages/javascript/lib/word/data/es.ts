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
		jabalí:m reno:m antílope:m ñu:m jirafa:f hipopótamo:m rinoceronte:m suricata:f armadillo:m
		puercoespín:m castor:m ornitorrinco:m canguro:m lémur:m chimpancé:m orangután:m babuino:m
		tapir:m mirlo:m ruiseñor:m alondra:f codorniz:f faisán:m perdiz:f colibrí:m tucán:m
		flamenco:m cigüeña:f abubilla:f jilguero:m urraca:f arrendajo:m anguila:f sardina:f atún:m
		bacalao:m merluza:f trucha:f salmón:m carpa:f raya:f medusa:f almeja:f mejillón:m ostra:f
		escarabajo:m saltamontes:m grillo:m avispa:f polilla:f luciérnaga:f ciempiés:m escorpión:m
		pulga:f oruga:f iguana:f camaleón:m salamandra:f tritón:m boa:f víbora:f cobra:f pitón:f
	`,
	object: `
		botella:f lápiz:m goma:f paraguas:m lámpara:f farol:m espejo:m llave:f candado:m bolsa:f
		botón:m aguja:f hilo:m pincel:m pintura:f papel:m cuaderno:m carta:f postal:f sello:m
		mapa:m catalejo:m microscopio:m cámara:f película:f radio:f
		vela:f ancla:f tienda:f linterna:f cerilla:f
		maceta:f tetera:f taza:f cuchara:f plato:m olla:f engranaje:m resorte:m imán:m cinta:f
		sobre:m cesta:f escoba:f silbato:m cuerda:f cubo:m abanico:m escudo:m
		red:f caña:f jarra:f peine:m campanilla:f embudo:m bandeja:f caja:f barril:m lata:f
		frasco:m
		brújula:f llavero:m alfiler:m dedal:m ovillo:m cordel:m soga:f gancho:m clavo:m
		tornillo:m tuerca:f arandela:f bisagra:f cerrojo:m pestillo:m cadena:f cremallera:f
		hebilla:f broche:m pulsera:f anillo:m maletín:m mochila:f baúl:m arcón:m tonel:m
		vasija:f cántaro:m botijo:m cuenco:m colador:m mortero:m pinza:f
		telescopio:m
	`,
	nature: `
		mar:m río:m lago:m cascada:f valle:m montaña:f colina:f pradera:f bosque:m cueva:f
		desierto:m arena:f roca:f guijarro:m volcán:m terremoto:m glaciar:m arrecife:m pantano:m
		arroyo:m bahía:f duna:f cumbre:f páramo:m estepa:f sabana:f humedal:m estuario:m delta:m
		laguna:f atolón:m fiordo:m cala:f cabo:m península:f istmo:m archipiélago:m islote:m
		meseta:f cañón:m acantilado:m grieta:f morrena:f pedregal:m peñasco:m banco:m bajío:m
		escollo:m abismo:m géiser:m fumarola:f sumidero:m estalactita:f estalagmita:f gruta:f
		repisa:f ladera:f sombra:f eco:m brasa:f manantial:m orilla:f litoral:m
		selva:f llanura:f tundra:f marisma:f ciénaga:f oasis:m dehesa:f cañada:f torrente:m
		remanso:m vado:m ribera:f playa:f costa:f golfo:m ensenada:f estrecho:m canal:m
		corriente:f marea:f oleaje:m espuma:f rompiente:f farallón:m risco:m cima:f hondonada:f
		barranco:m sima:f caverna:f
	`,
	plant: `
		árbol:m hoja:f flor:f raíz:f semilla:f fruto:m musgo:m helecho:m bambú:m pino:m arce:m
		cerezo:m rosa:f loto:m crisantemo:m orquídea:f girasol:m nenúfar:m hierba:f rama:f brote:m
		capullo:m pétalo:m polen:m piña:f bellota:f ginkgo:m sauce:m abedul:m cedro:m abeto:m
		roble:m castaño:m nogal:m césped:m alga:f seto:m ramo:m cactus:m áloe:m albahaca:f
		tomillo:m orégano:m perejil:m cilantro:m cebollino:m hinojo:m eneldo:m salvia:f estragón:m
		menta:f manzanilla:f lavanda:f enredadera:f palmera:f
		tallo:m corteza:f savia:f espina:f zarza:f hiedra:f muérdago:m acebo:m laurel:m olivo:m
		higuera:f naranjo:m manzano:m almendro:m avellano:m chopo:m álamo:m fresno:m olmo:m tilo:m
		haya:f alerce:m secuoya:f eucalipto:m acacia:f magnolia:f camelia:f begonia:f petunia:f
		geranio:m clavel:m margarita:f amapola:f jacinto:m narciso:m tulipán:m azucena:f dalia:f
		peonía:f trébol:m junco:m carrizo:m ortiga:f cardo:m
	`,
	gem: `
		oro:m plata:f cobre:m hierro:m acero:m bronce:m latón:m estaño:m zinc:m platino:m
		cristal:m cuarzo:m amatista:f ágata:f ámbar:m perla:f jade:m ópalo:m obsidiana:f mármol:m
		granito:m caliza:f basalto:m pedernal:m meteorito:m mineral:m gema:f lingote:m mica:f
		fluorita:f calcita:f malaquita:f granate:m azufre:m marfil:m pepita:f grafito:m mercurio:m
		yeso:m veta:f olivino:m turmalina:f rubí:m zafiro:m esmeralda:f topacio:m circón:m
		pirita:f magnetita:f hematita:f cinabrio:m galena:f talco:m bismuto:m
		níquel:m titanio:m aluminio:m plomo:m wolframio:m cobalto:m cromo:m manganeso:m litio:m
		uranio:m lapislázuli:m cornalina:f jaspe:m ónice:m berilo:m espinela:f peridoto:m
		alabastro:m pizarra:f arenisca:f esquisto:m gneis:m cuarcita:f toba:f dolomita:f apatito:m
		barita:f corindón:m feldespato:m moscovita:f siderita:f limonita:f bauxita:f
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
		verso:m prosa:f relato:m ensayo:m tesis:f síntesis:f análisis:m método:m teoría:f
		práctica:f técnica:f arte:m ciencia:f ética:f estética:f retórica:f dialéctica:f
		semántica:f ortografía:f caligrafía:f enigma:m certeza:f azar:m destino:m suerte:f
		fortuna:f voluntad:f conciencia:f identidad:f esencia:f materia:f forma:f causa:f efecto:m
		orden:m caos:m límite:m origen:m
	`,
	myth: `
		dragón:m fénix:m unicornio:m sirena:f hada:f duende:m elfo:m enano:m trol:m ogro:m
		gigante:m quimera:f hidra:f grifo:m centauro:m minotauro:m esfinge:f pegaso:m kraken:m
		basilisco:m gólem:m vampiro:m licántropo:m espectro:m fantasma:m alma:f espíritu:m
		demonio:m ángel:m diosa:f dios:m hechizo:m maldición:f profecía:f oráculo:m amuleto:m
		talismán:m runa:f portal:m santuario:m ídolo:m tótem:m ninfa:f náyade:f dríade:f
		valquiria:f musa:f brujo:m bruja:f nigromante:m alquimista:m sabio:m augurio:m presagio:m
		bestiario:m
		sátiro:m fauno:m arpía:f gorgona:f cíclope:m titán:m coloso:m leviatán:m behemot:m
		gnomo:m trasgo:m ondina:f silfo:m sílfide:f genio:m aparición:f conjuro:m sortilegio:m
		grimorio:m pentáculo:m reliquia:f cáliz:m grial:m varita:f báculo:m cetro:m corona:f
		hipogrifo:m mantícora:f
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
		abogado:m juez:m notario:m contable:m banquero:m cajero:m dependiente:m camarero:m
		conserje:m azafata:f maquinista:m conductor:m taxista:m mecánico:m fontanero:m albañil:m
		vidriero:m joyero:m zapatero:m sombrerero:m modista:f peluquero:m barbero:m pastelero:m
		carnicero:m frutero:m florista:m librero:m arqueólogo:m astrónomo:m biólogo:m geólogo:m
		botánico:m historiador:m filósofo:m archivero:m
		cosmonauta:m astronauta:m
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
		contrabajo:m fagot:m corno:m trombón:m tuba:f trompa:f gaita:f zampoña:f ocarina:f
		caramillo:m dulzaina:f bandurria:f cítara:f salterio:m maraca:f güiro:m castañuela:f
		cencerro:m gong:m timbal:m bombo:m contrapunto:m cadencia:f arpegio:m trino:m glisando:m
		legato:m tempo:m ritornelo:m estribillo:m estrofa:f copla:f fandango:m bolero:m tango:m
		rumba:f zarzuela:f ópera:f
	`,
	place: `
		mercado:m plaza:f ciudad:f aldea:f callejón:m puente:m jardín:m biblioteca:f museo:m
		teatro:m escuela:f parque:m puerto:m muelle:m estación:f aeropuerto:m faro:m castillo:m
		muralla:f palacio:m templo:m torre:f desván:m sótano:m azotea:f patio:m porche:m
		invernadero:m granero:m cabaña:f mirador:m recreo:m gimnasio:m piscina:f acuario:m
		galería:f zoológico:m balneario:m ayuntamiento:m mesón:m hospital:m farmacia:f
		librería:f panadería:f cafetería:f restaurante:m cocina:f dormitorio:m salón:m pasillo:m
		escalera:f túnel:m pasarela:f cruce:m alameda:f fortaleza:f granja:f rancho:m huerto:m
		abadía:f claustro:m bastión:m atalaya:f foso:m astillero:m malecón:m campamento:m villa:f
		mansión:f caserío:m
		catedral:f ermita:f capilla:f monasterio:m convento:m cementerio:m mausoleo:m cripta:f
		mezquita:f sinagoga:f pagoda:f posada:f hostal:m albergue:m taberna:f bodega:f cantina:f
		feria:f barrio:m arrabal:m suburbio:m avenida:f bulevar:m calzada:f vereda:f senda:f
		atajo:m encrucijada:f embarcadero:m dique:m esclusa:f presa:f acueducto:m molino:m
		fragua:f taller:m almacén:m silo:m establo:m corral:m pajar:m
	`,
	food: `
		arroz:m pan:m fideo:m sopa:f guiso:m ensalada:f sal:f azúcar:m pimienta:f ajo:m cebolla:f
		patata:f zanahoria:f pepino:m calabaza:f col:f lechuga:f espinaca:f seta:f tofu:m huevo:m
		queso:m mantequilla:f yogur:m manzana:f fresa:f uva:f sandía:f melocotón:m naranja:f
		limón:m plátano:m mango:m cereza:f chocolate:m caramelo:m galleta:f pastel:m
		flan:m rosquilla:f gofre:m tortita:f hamburguesa:f pizza:f pasta:f curry:m tortilla:f
		paella:f empanada:f croqueta:f churro:m turrón:m mazapán:m gazpacho:m tapa:f bocadillo:m
		salchicha:f jamón:m tocino:m chorizo:m morcilla:f albóndiga:f filete:m costilla:f
		mermelada:f miel:f
		centeno:m cebada:f avena:f maíz:m lenteja:f garbanzo:m alubia:f guisante:m haba:f soja:f
		tomate:m pimiento:m berenjena:f calabacín:m brócoli:m coliflor:f alcachofa:f espárrago:m
		puerro:m rábano:m remolacha:f nabo:m apio:m pera:f ciruela:f higo:m granada:f membrillo:m
		níspero:m albaricoque:m nectarina:f pomelo:m mandarina:f kiwi:m nuez:f pistacho:m
		cacahuete:m castaña:f bizcocho:m buñuelo:m torrija:f natilla:f cocido:m potaje:m fabada:f
		migas:fp
	`,
	sport: `
		fútbol:m béisbol:m baloncesto:m voleibol:m tenis:m bádminton:m golf:m boliche:m billar:m
		natación:f atletismo:m maratón:m gimnasia:f karate:m judo:m esgrima:f lucha:f boxeo:m
		tiro:m equitación:f remo:m surf:m esquí:m hockey:m rugby:m críquet:m
		ciclismo:m escalada:f raqueta:f bate:m portería:f medalla:f trofeo:m campeón:m
		eliminatoria:f prórroga:f polo:m patinaje:m buceo:m dardo:m valla:f jabalina:f disco:m
		relevo:m marcador:m casco:m falta:f jonrón:m espalda:f braza:f halterofilia:f trineo:m
		saque:m rebote:m salto:m carrera:f meta:f podio:m vestuario:m grada:f afición:f
		piragüismo:m regata:f triatlón:m pentatlón:m decatlón:m lanzamiento:m pértiga:f
		trampolín:m colchoneta:f anillas:fp potro:m tatami:m
		delantero:m defensa:f entrenador:m hincha:m estadio:m cancha:f pista:f penalti:m
		córner:m tarjeta:f tanteo:m empate:m victoria:f derrota:f récord:m torneo:m liga:f
		copa:f
	`,
	vehicle: `
		bicicleta:f tren:m barco:m coche:m autobús:m taxi:m camión:m moto:f patinete:m avión:m
		helicóptero:m nave:f cohete:m submarino:m yate:m carguero:m velero:m balsa:f acorazado:m
		tanque:m carroza:f carreta:f carretilla:f tractor:m excavadora:f ambulancia:f teleférico:m
		metro:m tranvía:m locomotora:f canoa:f kayak:m dirigible:m paracaídas:m palanquín:m
		triciclo:m furgoneta:f limusina:f quitanieves:m monorraíl:m catamarán:m rompehielos:m
		petrolero:m gabarra:f pesquero:m biplano:m hidroavión:m sonda:f motonieve:f monociclo:m
		remolcador:m góndola:f carruaje:m vagón:m
		carro:m calesa:f diligencia:f berlina:f cabriolé:m faetón:m camioneta:f furgón:m
		volquete:m hormigonera:f grúa:f segadora:f cosechadora:f patín:m monopatín:m ciclomotor:m
		sidecar:m crucero:m galera:f galeón:m fragata:f corbeta:f bergantín:m goleta:f piragua:f
		chalupa:f bote:m lancha:f planeador:m ultraligero:m avioneta:f caza:m bombardero:m
	`,
	product: `
		ordenador:m teclado:m ratón:m pantalla:f impresora:f altavoz:m auricular:m micrófono:m
		dron:m tableta:f móvil:m cargador:m pila:f mando:m nevera:f lavadora:f aspiradora:f
		ventilador:m estufa:f purificador:m arrocera:f microondas:m horno:m licuadora:f
		maquinilla:f cepillo:m dentífrico:m jabón:m champú:m perfume:m reloj:m proyector:m
		enrutador:m escáner:m secadora:f secador:m loción:f protector:m zapatilla:f sandalia:f
		timbre:m termómetro:m extintor:m calculadora:f bombilla:f enchufe:m
		regleta:f funda:f toalla:f palangana:f detergente:m suavizante:m olla_exprés:f
		sartén:f cafetera:f batidor:m pelador:m sacacorchos:m termo:m percha:f
		televisor:m consola:f amplificador:m ecualizador:m báscula:f plancha:f tostadora:f
		freidora:f exprimidor:m hervidor:m calefactor:m radiador:m termostato:m
		cubertería:f vajilla:f cristalería:f mantel:m servilleta:f
		escurridor:m fregadero:m ducha:f bañera:f inodoro:m lavabo:m botiquín:m lentilla:f
		tocadiscos:m
	`,
	color: `
		carmesí:m escarlata:m bermellón:m magenta:m fucsia:m rosado:m
		 ocre:m siena:m sepia:m mostaza:m oliva:m lima:f turquesa:f cian:m
		 añil:m índigo:m lila:m malva:f púrpura:f borgoña:m herrumbre:f terracota:f
		crema:f beige:m caqui:m carbón:m peltre:m ébano:m azabache:m cerúleo:m
		azafrán:m aguamarina:f verdín:m celadón:m nácar:m cobrizo:m bronceado:m
		ceniza:f humo:m trigo:m canela:f nuez_moscada:f pimentón:m
		amaranto:m coral:m violeta:f carmín:m burdeos:m glauco:m bermejo:m pardo:m
		caoba:f antracita:f marengo:m albero:m alazán:m zaino:m bayo:m rubor:m
		tostado:m verdemar:m azulón:m grisáceo:m morado:m corinto:m
		salmonado:m amarillento:m rojizo:m plomizo:m dorado:m
		purpurina:f cárdeno:m garzo:m ambarino:m níveo:m
	`,
	finance: `
		factura:f recibo:m bono:m dividendo:m interés:m préstamo:m hipoteca:f
		depósito:m ahorro:m cuenta:f saldo:m presupuesto:m auditoría:f activo:m pasivo:m capital:m
		ingreso:m ganancia:f margen:m superávit:m déficit:m deuda:f crédito:m débito:m cheque:m
		moneda:f divisa:f rendimiento:m cartera:f arancel:m reembolso:m prima:f pensión:f nómina:f
		salario:m sueldo:m comisión:f regalía:f franquicia:f fusión:f adquisición:f
		rescate:m aval:m vale:m cupón:m caja_fuerte:f tesorería:f remesa:f
		liquidación:f arbitraje:m garantía:f descubierto:m extracto:m libreta:f custodia:f
		acreedor:m deudor:m prestamista:m fiador:m tasación:f inflación:f recesión:f liquidez:f
		solvencia:f quiebra:f donación:f subsidio:m estipendio:m gasto:m descuento:m plazo:m
		arqueo:m asiento:m balance:m contrato:m escritura:f pagaré:m letra:f giro:m tipo:m tasa:f
		cuota:f canon:m tributo:m impuesto:m gravamen:m retención:f exención:f multa:f mora:f
		usura:f fianza:f aporte:m dote:f herencia:f renta:f alquiler:m
		arriendo:m peaje:m portazgo:m diezmo:m botín:m tesoro:m riqueza:f pobreza:f
	`,
	tech: `
		servidor:m caché:f búfer:m píxel:m códec:m paquete:m protocolo:m
		montículo:m puntero:m compilador:m firmware:m registro:m latencia:f
		cortafuegos:m subred:f anfitrión:m carga_útil:f esquema:m cursor:m
		respaldo:m clúster:m fragmento:m réplica:f instantánea:f contenedor:m tubería:f
		repositorio:m depurador:m macro:f matriz:f entero:m sintaxis:f analizador:m ensamblador:m
		instrucción:f interrupción:f tasa_de_bits:f extremo:m cifrado:m descifrado:m
		sombreador:m textura:f polígono:m malla:f octeto:m enrutamiento:m conmutación:f difusión:f
		datagrama:m partición:f directorio:m reversión:f migración:f
		núcleo:m proceso:m sesión:f consulta:f índice:m tabla:f vista:f
		columna:f fila:f campo:m nodo:m grafo:m cola:f lista:f
		conjunto:m módulo:m complemento:m parche:m
		confirmación:f etiqueta:f versión:f compilación:f prueba:f traza:f perfil:m
		disparador:m evento:m señal:f tema:m suscriptor:m
	`,
	weather: `
		nube:f viento:m lluvia:f nieve:f escarcha:f niebla:f rocío:m arcoíris:m ocaso:m rayo:m
		trueno:m chubasco:m monzón:m tifón:m torbellino:m ventisca:f llovizna:f granizo:m
		aguanieve:f vendaval:m ráfaga:f ciclón:m tormenta:f tempestad:f diluvio:m aguacero:m
		calima:f bruma:f neblina:f pronóstico:m nublado:m solana:f ola_de_calor:f
		helada:f deshielo:m cellisca:f remolino:m brisa:f céfiro:m galerna:f borrasca:f
		anticiclón:m clima:m temperatura:f presión:f nubarrón:m chaparrón:m sereno:m relámpago:m
		centella:f escampada:f
		resolana:f canícula:f bochorno:m siroco:m tramontana:f cierzo:m levante:m poniente:m
		ábrego:m alisio:m huracán:m tornado:m tolvanera:f polvareda:f rociada:f
		orvallo:m calabobos:m sirimiri:m nevada:f nevisca:f granizada:f tormentón:m relente:m
		gota:f nubosidad:f humedad:f sequía:f estiaje:m bonanza:f
	`,
	space: `
		estrella:f luna:f sol:m galaxia:f meteoro:m aurora:f menguante:m
		creciente:m eclipse:m cenit:m universo:m planeta:m satélite:m asteroide:m nebulosa:f
		cúmulo:m constelación:f órbita:f gravedad:f rotación:f traslación:f mancha_solar:f
		cráter:m año_luz:m astro:m firmamento:m eclíptica:f meridiano:m estratosfera:f atmósfera:f
		vacío:m ingravidez:f plenilunio:m novilunio:m perigeo:m apogeo:m lucero:m marte:m
		venus:m júpiter:m saturno:m urano:m neptuno:m plutón:m supernova:f cuásar:m púlsar:m
		vía_láctea:f cosmos:m
		cuadrante:m paralaje:m parsec:m nadir:m acimut:m elipse:f
		perihelio:m afelio:m coronal:m fotosfera:f cromosfera:f
		magnetosfera:f ionosfera:f exosfera:f mesosfera:f troposfera:f heliosfera:f
		observatorio:m
		gravitación:f
		halo:m enana:f coma:f bólido:m
	`,
	time: `
		amanecer:m alba:f crepúsculo:m anochecer:m solsticio:m equinoccio:m momento:m
		eternidad:f futuro:m instante:m siglo:m década:f mañana:f mediodía:m tarde:f noche:f
		medianoche:f madrugada:f víspera:f ayer:m hoy:m jornada:f semana:f quincena:f mes:m
		trimestre:m semestre:m año:m lustro:m milenio:m época:f era:f edad:f primavera:f verano:m
		otoño:m invierno:m solano:m trienio:m ahora:m bienio:m infancia:f juventud:f madurez:f
		vejez:f intervalo:m duración:f transcurso:m período:m
		aniversario:m efeméride:f temporada:f alborada:f atardecer:m
		minuto:m segundo:m hora:f lapso:m tregua:f pausa:f espera:f demora:f
		ciclo:m turno:m ronda:f fase:f etapa:f tramo:m jornal:m matinal:m
		vespertino:m antaño:m hogaño:m pasado:m presente:m porvenir:m albor:m
		sazón:f añada:f decenio:m centuria:f cuatrienio:m sexenio:m
	`,
	emotion: `
		alegría:f tristeza:f ira:f miedo:m sorpresa:f gozo:m júbilo:m dicha:f felicidad:f
		euforia:f éxtasis:m consuelo:m alivio:m esperanza:f desesperanza:f pena:f melancolía:f
		nostalgia:f soledad:f añoranza:f anhelo:m deseo:m pasión:f cariño:m ternura:f calidez:f
		bondad:f compasión:f empatía:f lástima:f gratitud:f humildad:f paciencia:f prudencia:f
		templanza:f integridad:f sinceridad:f asombro:m reverencia:f serenidad:f calma:f sosiego:m
		confianza:f duda:f sospecha:f preocupación:f ansiedad:f pavor:m terror:m pánico:m furia:f
		rabia:f enojo:m fastidio:m aburrimiento:m apatía:f entusiasmo:m fervor:m ardor:m emoción:f
		ilusión:f coraje:m valentía:f timidez:f vergüenza:f culpa:f orgullo:m envidia:f celos:p
		codicia:f ánimo:m humor:m capricho:m
		amargura:f rencor:m odio:m desdén:m desprecio:m recelo:m hastío:m tedio:m
		congoja:f angustia:f aflicción:f desconsuelo:m desaliento:m abatimiento:m
		arrebato:m arrobo:m devoción:f piedad:f clemencia:f indulgencia:f benevolencia:f
		afecto:m apego:m simpatía:f antipatía:f alborozo:m regocijo:m contento:m desazón:f
		zozobra:f sobresalto:m estupor:m pasmo:m
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
		sien:f paladar:m amígdala:f laringe:f faringe:f tráquea:f esófago:m diafragma:m
		esternón:m omóplato:m vértebra:f pelvis:f fémur:m tibia:f peroné:m húmero:m
		cúbito:m falange:f metatarso:m empeine:m planta:f dorso:m axila:f ingle:f corva:f
		iris:m pupila:f córnea:f retina:f esclerótica:f tabique:m frenillo:m
	`,
	clothing: `
		sombrero:m zapato:m guante:m bufanda:f gafas:fp abrigo:m gabán:m chaqueta:f americana:f
		camisa:f blusa:f túnica:f pantalón:m vaquero:m short:m falda:f vestido:m chaleco:m
		rebeca:f jersey:m sudadera:f calcetín:m media:f pijama:m delantal:m pañuelo:m corbata:f
		pajarita:f cinturón:m faja:f mocasín:m bota:f pantufla:f uniforme:m disfraz:m bata:f
		capa:f poncho:m chubasquero:m anorak:m parka:f bañador:m manga:f
		 dobladillo:m solapa:f forro:m tela:f lino:m seda:f algodón:m lana:f
		terciopelo:m pana:f franela:f cuero:m boina:f gorro:m gorra:f turbante:m
		velo:m chal:m mantón:m
		levita:f frac:m esmoquin:m chaqué:m casaca:f jubón:m sayo:m camisola:f enagua:f
		corpiño:m polaina:f zueco:m alpargata:f chancla:f babucha:f escarpín:m
		calzón:m taparrabos:m mitón:m manopla:f muñequera:f tirante:m ligero:m corsé:m
		miriñaque:m mantilla:f pamela:f tricornio:m bicornio:m yelmo:m cofia:f capucha:f
	`,
	tool: `
		hacha:f pala:f sierra:f alicate:m cincel:m yunque:m fuelle:m lezna:f abrazadera:f nivel:m
		calibre:m regla:f tijera:f martillo:m mazo:m taladro:m lija:f pico:m hoz:f guadaña:f
		azada:f arado:m rastrillo:m soldador:m amoladora:f cortadora:f hachuela:f palanca:f cuña:f
		polea:f manivela:f almádena:f paleta:f rallador:m tamiz:m laya:f mayal:m huso:m
		lanzadera:f carrete:m cuchilla:f remachadora:f clavadora:f caladora:f
		torno:m lijadora:f motosierra:f serrucho:m gubia:f punzón:m escuadra:f bisel:m
		berbiquí:m barrena:f formón:m garlopa:f escofina:f escoplo:m gramil:m
		plomada:f tenaza:f tenazas:fp cric:m grapadora:f engrapadora:f pistola:f
		soplete:m yesquero:m crisol:m molde:m troquel:m esmeril:m muela:f
		afilador:m mandril:m broca:f macheta:f azuela:f
	`,
	drink: `
		café:m té:m zumo:m leche:f agua:f gaseosa:f limonada:f sidra:f horchata:f batido:m
		malteada:f infusión:f poleo:m tila:f mate:m cortado:m capuchino:m expreso:m carajillo:m
		descafeinado:m cerveza:f clara:f vino:m tinto:m
		cava:m champán:m jerez:m oporto:m vermut:m sangría:f licor:m aguardiente:m orujo:m ron:m
		ginebra:f vodka:m whisky:m coñac:m brandy:m tequila:m mezcal:m sake:m hidromiel:f cóctel:m
		ponche:m néctar:m jarabe:m refresco:m soda:f tónica:f granizado:m
		cacao:m atole:m chicha:f pulque:m tepache:m kombucha:f kéfir:m suero:m
		bíter:m amargo:m anís:m pacharán:m licorcillo:m aguamiel:f rompope:m
		sorbete:m clarete:m albariño:m
		espumoso:m mosto:m garnacha:f fino:m amontillado:m
	`,
	toy: `
		canica:f dado:m naipe:m rompecabezas:m peonza:f cometa:f globo:m ajedrez:m dominó:m parchís:m muñeco:m
		peluche:m juguete:m juego:m partida:f pelota:f comba:f escondite:m rayuela:f columpio:m tobogán:m balancín:m
		tiovivo:m noria:f montaña_rusa:f arenero:m yoyó:m diábolo:m bumerán:m frisbi:m aro:m sonajero:m bloque:m
		plastilina:f papiroflexia:f pompa:f tirachinas:m petardo:m bengala:f confeti:m serpentina:f piñata:f máscara:f
		títere:m marioneta:f maqueta:f zancos:p cama_elástica:f tirolina:f castillo_hinchable:m damas:fp bingo:m
		ruleta:f tres_en_raya:m crucigrama:m sudoku:m sopa_de_letras:f trabalenguas:m baraja:f comodín:m ficha:f
		tablero:m cubilete:m caleidoscopio:m
	`,
	sound: `
		sonido:m ruido:m voz:f grito:m susurro:m murmullo:m suspiro:m risa:f carcajada:f llanto:m sollozo:m gemido:m
		quejido:m lamento:m bostezo:m estornudo:m tos:f ronquido:m silbido:m chillido:m alarido:m aullido:m ladrido:m
		maullido:m rugido:m gruñido:m bramido:m relincho:m mugido:m balido:m cacareo:m graznido:m gorjeo:m ronroneo:m
		zumbido:m siseo:m crujido:m chirrido:m chasquido:m chapoteo:m goteo:m borboteo:m tintineo:m repique:m
		campanada:f tañido:m redoble:m retumbo:m estruendo:m estallido:m explosión:f portazo:m golpe:m golpeteo:m
		traqueteo:m zapateo:m pisada:f aplauso:m palmada:f ovación:f abucheo:m bocinazo:m pitido:m clic:m tictac:m
		runrún:m quiquiriquí:m guau:m miau:m pío:m chinchín:m pum:m bullicio:m alboroto:m jaleo:m algarabía:f
		griterío:m clamor:m cuchicheo:m parloteo:m tartamudeo:m balbuceo:m arrullo:m tarareo:m jadeo:m hipo:m eructo:m
		carraspeo:m soplido:m bufido:m rumor:m resonancia:f vibración:f acústica:f
	`,
	person: `
		niño:m bebé:m adolescente:m adulto:m anciano:m hombre:m mujer:f chico:m señor:m dama:f abuelo:m abuela:f
		madre:f padre:m hijo:m hermano:m tío:m primo:m sobrino:m nieto:m marido:m gemelo:m huérfano:m viudo:m
		soltero:m novio:m novia:f pareja:f amigo:m enemigo:m rival:m vecino:m invitado:m huésped:m extranjero:m
		desconocido:m vagabundo:m nómada:m héroe:m villano:m pícaro:m granuja:m mocoso:m dormilón:m glotón:m
		empollón:m sabelotodo:m charlatán:m parlanchín:m gruñón:m llorón:m soñador:m aventurero:m holgazán:m
		bromista:m mentiroso:m tramposo:m cobarde:m líder:m jefe:m compañero:m testigo:m víctima:f rehén:m
		prisionero:m fugitivo:m ciudadano:m habitante:m aldeano:m mendigo:m ermitaño:m heredero:m ahijado:m padrino:m
		madrina:f suegro:m cuñado:m yerno:m nuera:f padrastro:m madrastra:f antepasado:m pariente:m
	`,
	furniture: `
		almohada:f manta:f colchón:m cortina:f edredón:m armario:m estante:m mesilla:f alfombra:f estor:m persiana:f
		aplique:m flexo:m felpudo:m silla:f mesa:f cama:f sofá:m sillón:m taburete:m banqueta:f escritorio:m pupitre:m
		estantería:f cómoda:f cajón:m vitrina:f aparador:m mueble:m tocador:m perchero:m paragüero:m cuna:f litera:f
		catre:m somier:m cabecero:m sábana:f colcha:f cojín:m hamaca:f mecedora:f tumbona:f diván:m puf:m biombo:m
		mampara:f encimera:f alacena:f moqueta:f estera:f tapete:m tapiz:m cuadro:m marco:m póster:m portarretratos:m
		jarrón:m candelabro:m candil:m quinqué:m plafón:m lámpara_de_araña:f visillo:m mosquitera:f dosel:m adorno:m
		cenefa:f
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
		 perezoso alerta afilado romo liso rugoso denso escaso
		leal paciente vigilante hábil firme apacible franco reservado terco llano
		cortante peludo lustroso reluciente rechoncho macizo liviano gélido humeante aromático
		meloso moteado rayado gastado pulido flamante añejo grueso delgado plano
		puntiagudo torcido recto esbelto achaparrado apagado estridente sonoro grave melodioso
		ronco vibrante susurrante templado bochornoso encapotado
		despejado escarchado estrellado musgoso rojizo perfumado
		esmeralda coralino marfileño obsidiano cristalino argénteo broncíneo estañado plomizo
		carmesí bermejo ocre añil turquesa lavanda malva marfil azabache remoto minúsculo
		grandioso austero primoroso tosco frágil vigoroso amplio escarpado
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
		despertado levantado agachado acurrucado apoyado vuelto acercado alejado detenido caminado
		corrido cruzado regresado partido desaparecido acechado tambaleado brincado mirado
		observado vigilado rozado alisado ordenado cuidado lavado secado
		recortado pegado plegado desplegado llenado vaciado servido
		revuelto guisado salteado calentado enfriado probado tragado grabado teñido barnizado
		limado sopesado saboreado rumiado
	`),
	nouns: NOUNS.pools,
	nounGender: NOUNS.gender,
	// Spanish modifiers agree with the noun, and the base form is the masculine
	// one. Only the endings listed change; `azul` and `grande` match no rule and
	// are already right beside either gender.
	// A word outside the pools is read by its ending, which is what Spanish itself
	// does: `-a`, `-ión`, `-dad`, `-tad` and `-umbre` are feminine, the rest
	// masculine. An invented word has no true gender, and this is what keeps the
	// article and the adjective beside it agreeing with each other.
	genderRules: [
		['ión', 'f'],
		['dad', 'f'],
		['tad', 'f'],
		['umbre', 'f'],
		['triz', 'f'],
		['a', 'f'],
		['', 'm']
	],
	agreement: {
		f: [
			['or', 'ora'],
			['ón', 'ona'],
			['és', 'esa'],
			['ín', 'ina'],
			['án', 'ana'],
			['o', 'a']
		],
		p: [
			['z', 'ces'],
			['or', 'ores'],
			['ón', 'ones'],
			['és', 'eses'],
			['ín', 'ines'],
			['án', 'anes'],
			['o', 'os'],
			['a', 'as'],
			['e', 'es'],
			['', 'es']
		],
		fp: [
			['z', 'ces'],
			['or', 'oras'],
			['ón', 'onas'],
			['és', 'esas'],
			['ín', 'inas'],
			['án', 'anas'],
			['o', 'as'],
			['a', 'as'],
			['e', 'es'],
			['', 'es']
		]
	},
	// Spanish puts the modifier after the noun (`gato azul`), which is also what
	// lets it agree: the noun is drawn first, so its gender is known. There is no
	// possessive shape, for the reason English has none — `de` is a word rather
	// than something that attaches to the word in front of it.
	// How common each noun is, for `vocabulary` to draw by: the everyday words,
	// and the ones a specialist or a dictionary would know. Every noun in neither
	// list is common. See `WordLevels`.
	levels: {
		basic: words(`
			gato perro león tigre zorro lobo oso panda conejo ardilla elefante ciervo caballo burro vaca toro
			cabra oveja cerdo mono gorila cocodrilo serpiente lagarto tortuga rana sapo pájaro cuervo águila
			loro búho paloma cisne pato gallina pez ballena delfín tiburón pulpo calamar gamba cangrejo
			caracol mariposa abeja hormiga araña mosca mosquito gusano murciélago camello koala cebra foca
			pingüino jirafa hipopótamo rinoceronte canguro chimpancé sardina atún bacalao merluza trucha
			salmón medusa almeja mejillón avispa botella lápiz goma paraguas lámpara espejo llave candado
			bolsa botón aguja hilo pincel pintura papel cuaderno carta mapa cámara película radio globo dado
			vela tienda linterna maceta taza cuchara plato olla sobre almohada manta cesta escoba cuerda cubo
			abanico red peine caja lata clavo tornillo cadena cremallera pulsera anillo mochila mar río lago
			cascada valle montaña colina bosque cueva desierto arena roca volcán terremoto arroyo bahía
			cumbre laguna cala cabo península meseta sombra eco orilla selva oasis playa costa canal
			corriente marea espuma cima árbol hoja flor raíz semilla fruto bambú pino rosa girasol hierba
			rama pétalo piña abeto roble césped alga ramo cactus orégano perejil menta manzanilla lavanda
			palmera tallo espina laurel olivo clavel margarita amapola tulipán trébol oro plata cobre hierro
			acero bronce cristal perla mármol mineral mercurio rubí zafiro esmeralda aluminio plomo pizarra
			libertad paz justicia verdad memoria imaginación cuento poema gramática física química biología
			matemática historia leyenda secreto promesa viaje aventura experimento pregunta respuesta consejo
			fiesta costumbre cultura idioma alfabeto razón tradición práctica arte ciencia destino suerte
			forma causa efecto orden límite origen dragón fénix unicornio sirena hada duende elfo enano ogro
			gigante vampiro fantasma alma espíritu demonio ángel diosa dios hechizo maldición brujo bruja
			sabio gnomo genio varita corona caballero cazador ladrón pirata marinero capitán cocinero
			jardinero detective poeta pintor bailarín payaso soldado guardia portero rey reina príncipe
			princesa granjero pescador pastor piloto ingeniero cartero bombero policía médico enfermero
			veterinario maestro alumno periodista escritor cantante actor director músico carpintero doctor
			árbitro panadero abogado juez cajero dependiente camarero conductor taxista mecánico peluquero
			carnicero astronauta piano guitarra tambor campana arpa canción danza ritmo melodía flauta
			trompeta saxofón violín batería pandereta nota silencio coro solo concierto escenario jazz nana
			final orquesta himno dúo trío castañuela estribillo tango rumba ópera mercado plaza ciudad puente
			jardín biblioteca museo teatro escuela parque puerto estación aeropuerto castillo palacio torre
			sótano patio gimnasio piscina zoológico ayuntamiento hospital farmacia librería panadería
			cafetería restaurante cocina dormitorio salón pasillo escalera túnel granja catedral cementerio
			feria barrio avenida taller arroz pan sopa ensalada sal azúcar pimienta ajo cebolla patata
			zanahoria pepino calabaza lechuga espinaca huevo queso mantequilla yogur manzana fresa uva sandía
			melocotón naranja limón plátano mango cereza chocolate caramelo galleta pastel flan hamburguesa
			pizza pasta tortilla paella croqueta churro turrón gazpacho tapa bocadillo salchicha jamón
			chorizo albóndiga filete mermelada miel maíz lenteja garbanzo guisante tomate pimiento berenjena
			calabacín brócoli coliflor pera mandarina kiwi nuez cacahuete bizcocho fútbol béisbol baloncesto
			voleibol tenis golf natación gimnasia karate judo boxeo surf esquí ciclismo raqueta portería
			medalla trofeo campeón patinaje casco falta espalda salto carrera meta podio ajedrez delantero
			entrenador estadio pista penalti córner tarjeta empate victoria derrota liga copa bicicleta tren
			barco coche autobús taxi camión moto patinete avión helicóptero nave cohete submarino tanque
			carretilla tractor excavadora ambulancia metro tranvía paracaídas triciclo furgoneta vagón carro
			camioneta grúa patín monopatín crucero bote ordenador teclado ratón pantalla impresora altavoz
			micrófono tableta móvil cargador pila mando nevera lavadora aspiradora ventilador microondas
			horno cepillo jabón champú perfume reloj secador zapatilla sandalia colchón cortina timbre
			calculadora bombilla enchufe toalla detergente sartén cafetera armario televisor consola plancha
			alfombra persiana mantel servilleta ducha bañera lavabo fucsia rosado mostaza lima turquesa lila
			púrpura crema beige carbón bronceado ceniza humo trigo canela pimentón coral violeta tostado
			morado amarillento rojizo dorado factura recibo interés préstamo hipoteca ahorro cuenta saldo
			presupuesto deuda crédito cheque moneda cartera nómina salario sueldo caja_fuerte gasto descuento
			contrato tipo impuesto multa herencia alquiler peaje botín tesoro riqueza pobreza servidor
			paquete cursor contenedor tubería instrucción proceso sesión consulta índice tabla vista columna
			fila campo cola lista conjunto parche etiqueta versión prueba perfil evento señal tema nube
			viento lluvia nieve niebla arcoíris rayo trueno llovizna granizo tormenta nublado ola_de_calor
			brisa clima temperatura presión chaparrón relámpago huracán tornado nevada gota humedad sequía
			estrella luna sol galaxia eclipse universo planeta satélite asteroide constelación órbita
			gravedad cráter atmósfera vacío marte venus júpiter saturno urano neptuno plutón vía_láctea
			amanecer momento futuro siglo década mañana mediodía tarde noche medianoche madrugada ayer hoy
			semana mes trimestre año época edad primavera verano otoño invierno ahora infancia aniversario
			temporada atardecer minuto segundo hora pausa espera turno pasado presente alegría tristeza miedo
			sorpresa felicidad alivio esperanza pena soledad deseo pasión cariño paciencia calma confianza
			duda preocupación ansiedad terror pánico rabia enojo aburrimiento emoción ilusión vergüenza culpa
			orgullo envidia celos ánimo humor odio cabeza frente ceja pestaña nariz mejilla barbilla labio
			lengua diente oreja cuello hombro codo muñeca dedo pulgar uña puño pecho ombligo cintura muslo
			rodilla tobillo talón hueso músculo corazón pulmón hígado estómago riñón intestino cerebro nervio
			vena sangre carne piel cabello barba lágrima sudor saliva arruga cicatriz moretón sombrero zapato
			guante bufanda gafas abrigo chaqueta camisa pantalón vaquero falda vestido jersey sudadera
			calcetín pijama delantal pañuelo corbata cinturón bota uniforme disfraz bañador manga tela seda
			algodón lana cuero gorro gorra chancla capucha hacha pala sierra alicate nivel regla tijera
			martillo mazo taladro lija pico rastrillo palanca rallador cuchilla motosierra serrucho escuadra
			grapadora pistola molde café té zumo leche agua gaseosa limonada batido mate cortado cerveza vino
			tinto champán sangría licor ron ginebra vodka whisky tequila cóctel jarabe refresco cacao
			muñeco peluche juguete juego pelota comba escondite columpio tobogán baraja sonido ruido voz grito susurro
			suspiro risa llanto bostezo estornudo tos silbido ladrido maullido explosión golpe aplauso guau miau niño
			bebé hombre mujer chico abuelo abuela madre padre hijo hermano tío primo marido novio novia amigo vecino
			héroe silla mesa cama sofá sillón escritorio estantería cuna sábana cojín cuadro balancín tiovivo noria
			aro sonajero plastilina pompa petardo confeti piñata máscara títere marioneta ficha tablero carcajada
			ronquido chillido rugido zumbido portazo pisada palmada pitido jaleo hipo eructo adolescente adulto
			anciano señor sobrino nieto gemelo pareja enemigo invitado extranjero desconocido villano líder jefe
			compañero testigo víctima prisionero mendigo padrino madrina suegro cuñado yerno nuera pariente taburete
			pupitre cómoda cajón mueble perchero litera hamaca mecedora tumbona encimera marco póster jarrón adorno
		`),
		rare: words(`
			ñu suricata ornitorrinco lémur babuino tapir alondra abubilla jilguero arrendajo tritón dedal
			arandela arcón cántaro estuario atolón istmo morrena pedregal bajío escollo fumarola sumidero
			ciénaga remanso vado ensenada rompiente farallón risco hondonada sima ginkgo eneldo estragón
			avellano alerce begonia dalia peonía carrizo ágata basalto pedernal mica fluorita calcita
			malaquita olivino turmalina circón pirita magnetita hematita cinabrio galena bismuto wolframio
			manganeso lapislázuli cornalina jaspe ónice berilo espinela peridoto alabastro arenisca esquisto
			gneis cuarcita toba dolomita apatito barita corindón feldespato moscovita siderita limonita
			bauxita almanaque axioma paradigma linaje retórica dialéctica semántica basilisco gólem
			licántropo náyade dríade valquiria nigromante bestiario sátiro gorgona leviatán behemot trasgo
			ondina silfo sílfide sortilegio grimorio pentáculo hipogrifo mantícora erudito perfumista
			curtidor vidriero botánico archivero interludio rapsodia cantata semitono fagot corno zampoña
			ocarina caramillo dulzaina bandurria cítara salterio güiro contrapunto arpegio trino glisando
			legato ritornelo bastión atalaya caserío arrabal esclusa fragua pentatlón decatlón tanteo
			palanquín gabarra biplano motonieve calesa berlina cabriolé faetón volquete galera corbeta
			bergantín goleta chalupa ultraligero enrutador ecualizador aplique bermellón siena borgoña peltre
			cerúleo verdín celadón amaranto glauco bermejo antracita albero alazán zaino bayo verdemar
			corinto cárdeno garzo ambarino níveo superávit regalía acreedor fiador liquidez solvencia
			estipendio arqueo pagaré gravamen exención usura portazgo diezmo búfer códec subred carga_útil
			clúster depurador ensamblador tasa_de_bits descifrado sombreador octeto enrutamiento conmutación
			datagrama reversión grafo solana cellisca céfiro galerna escampada resolana canícula siroco
			tramontana cierzo ábrego alisio tolvanera rociada orvallo calabobos sirimiri nevisca tormentón
			relente estiaje eclíptica plenilunio novilunio perigeo cuásar púlsar paralaje parsec nadir acimut
			perihelio afelio coronal fotosfera cromosfera magnetosfera ionosfera exosfera mesosfera
			heliosfera solano trienio bienio efeméride alborada jornal vespertino hogaño albor añada decenio
			centuria cuatrienio sexenio templanza reverencia sosiego fervor desdén recelo hastío tedio
			congoja aflicción desconsuelo desaliento abatimiento arrobo clemencia indulgencia benevolencia
			alborozo regocijo desazón zozobra pasmo esternón húmero cúbito falange metatarso corva
			esclerótica frenillo gabán levita chaqué casaca jubón sayo camisola enagua polaina babucha
			escarpín mitón miriñaque bicornio cofia lezna amoladora hachuela almádena laya mayal remachadora
			clavadora caladora gubia bisel berbiquí barrena formón garlopa escofina escoplo gramil plomada
			cric yesquero troquel esmeril mandril macheta azuela hidromiel atole pulque tepache bíter
			licorcillo aguamiel rompope clarete amontillado
			rayuela diábolo bumerán papiroflexia tirachinas tirolina cubilete caleidoscopio trabalenguas gorjeo
			borboteo tañido redoble retumbo estruendo traqueteo zapateo abucheo runrún algarabía griterío clamor
			cuchicheo parloteo tartamudeo balbuceo arrullo carraspeo bufido resonancia acústica chinchín nómada
			ermitaño heredero ahijado antepasado aldeano rehén fugitivo holgazán sabelotodo empollón parlanchín
			banqueta vitrina aparador tocador paragüero catre somier cabecero colcha diván puf biombo mampara alacena
			moqueta estera tapete tapiz portarretratos candelabro candil quinqué plafón lámpara_de_araña visillo
			mosquitera dosel cenefa
		`)
	},
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
