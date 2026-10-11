import { words } from '../../_internal/parse.js';
import { ES_MODIFIERS } from './modifiers/es.js';
import { ES_NOUNS } from './nouns/es.js';
import type { WordLanguageData } from './types.js';

export const ES: WordLanguageData = {
	...ES_MODIFIERS,
	nouns: ES_NOUNS.pools,
	nounGender: ES_NOUNS.gender,
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
			gallo pavo rata hámster gaviota cucaracha langosta foto bolígrafo tiza pegamento tenedor cuchillo vaso
			bolso maleta collar cielo tierra isla océano piedra polvo barro hielo fuego ola luz oscuridad aire tronco
			hongo arbusto diamante joya vidrio sueño idea pensamiento fe problema solución guerra palabra frase número
			círculo triángulo medicina literatura poesía ley mago momia zombi monstruo magia profesor dentista rock
			pop rap casa habitación baño puerta ventana oficina supermercado hotel iglesia cine bar carretera camino
			calle pollo pescado tarta chicle salsa mayonesa aceite melón equipo jugador gol balón ascensor ferry
			portátil videojuego papel_higiénico teléfono pastilla marrón dinero billete precio lotería euro dólar
			internet web mensaje chat contraseña wifi robot error calor espacio día fin_de_semana lunes martes
			miércoles jueves viernes sábado domingo enero febrero marzo abril mayo junio julio agosto septiembre
			octubre noviembre diciembre vacaciones amor dolor ojo boca mano pie brazo pierna cara cuerpo traje
			camiseta calzoncillos bragas sujetador bolsillo destornillador libro revista periódico calendario carpeta
			esponja trapo cazo tarro pasaporte papelera charco estanque pozo nido paisaje incendio huella concha paja
			honor fama milagro misterio opinión plan proyecto política economía sociedad novela lección amistad poder
			científico arquitecto cirujano electricista vendedor empresario alcalde espía fotógrafo banda álbum hogar
			garaje balcón terraza tejado chimenea pared muro fábrica universidad circo gasolinera autopista acera
			semáforo fuente monumento pirámide prisión marisco ternera chuleta bollo bombón sándwich lasaña espagueti
			macarrón vinagre harina caldo puré palomitas nata coco aguacate almendra canasta entrenamiento pesa
			campeonato mundial monitor cable congelador lavavajillas batidora barbacoa desodorante colonia maquillaje
			pañal chupete biberón lejía antena tirita venda efectivo pago pérdida inversión transferencia propina beca
			oferta venta compra negocio empresa premio jubilación seguro hucha céntimo navegador buscador enlace
			correo usuario programa aplicación sistema código dato chip descarga actualización virus conexión blog
			foro festivo descanso siesta cumpleaños fecha horario cita prisa rato placer pereza estrés tensión
			frustración decepción respeto curiosidad cansancio susto garganta esqueleto bigote flequillo melena trenza
			herida meñique oído tripa tacón chándal cazadora cordón suela navaja cortacésped regadera manguera rodillo
			brocha chupito trago
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
			témpano meandro afluente desembocadura taiga manglar arboleda espejismo liquen tubérculo espora alcornoque
			cocotero baobab tejo boj brezo retama caléndula adelfa lúpulo esqueje sodio potasio magnesio silicio
			carbono paladio iridio vanadio citrino aventurina heliotropo azurita rodonita sodalita labradorita
			tanzanita alejandrita piedra_lunar ojo_de_tigre escoria filón travertino pórfido hulla lignito sílice
			druida nereida semidiós querubín serafín súcubo íncubo elixir alquimia vellocino ambrosía inframundo limbo
			purgatorio invocación exorcismo aura reencarnación ánima piedra_filosofal juglar malabarista guardabosques
			centinela almirante tonalidad barítono diapasón atril baqueta batuta bandoneón charango bongó conga
			marimba clarín lira carillón anfiteatro planetario frontón petanca biatlón pelotón maillot dorsal fichaje
			regate volea trirreme aerodeslizador batiscafo apisonadora carromato cuadriga tartana monovolumen
			utilitario cupé vagoneta barcaza trolebús carabela ballenero trasatlántico portaaviones destructor
			montacargas telesilla funicular gramófono vinilo casete vitrocerámica sandwichera rizador humidificador
			bidé módem acondicionador ultramar grana azulete perlado ahumado tornasol témpera hollín tabaco accionista
			banca devaluación cotización calderilla embargo desahucio fichero bucle transistor autómata compresión
			excepción vector ancho_de_banda tromba frescor carámbano pedrisco mistral cirro nimbo ventarrón terral
			celaje arrebol ventolera viento_solar llamarada materia_oscura nova alunizaje magnetar singularidad
			cuerpo_celeste hemisferio vendimia antigüedad prehistoria milisegundo lujuria soberbia vanidad desgana
			indiferencia remordimiento fascinación médula neurona glándula páncreas apéndice útero aorta bíceps glúteo
			anular sari toga sotana coraza tiara leotardo cachemir licra poliéster nailon lentejuela pañoleta fular
			hábito desbrozadora pulverizador sembradora podadora andamio cartabón transportador llana rascador
			fresadora prensa caballete pelacables multímetro carraca pie_de_cabra cepillo_de_carpintero moscatel
			absenta pisco cachaza grappa moca sifón agua_de_coco consomé
		`)
	}
};
