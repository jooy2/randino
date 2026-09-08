import { words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// The two forms a Spanish verb group is written in: the third person singular of
// the present, and the same person of the pretérito, which is the tense a story
// is told in. A question is the statement with the marks around it, so there is
// no third.
function tensed(present: string, past: string): { words: WordPool; past: PredicateTense } {
	return { words: words(present), past: { words: words(past) } };
}

export const ES: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	// Guillemets first, and the curly quotes for a quote inside one.
	quotes: { double: ['«', '»'], single: ['“', '”'] },
	// The one language here that marks a question and an exclamation at both
	// ends, which is why the openers exist at all.
	openers: { question: '¿', exclamation: '¡' },
	// The definite article, by the noun's gender. The feminine entries in front of
	// the default are the nouns that begin on a stressed a- and take `el` for the
	// sound of it: the two that only start the same way are listed above them, so
	// the first match is still the right one.
	articles: {
		m: [['', 'el']],
		f: [
			['aguamarina', 'la'],
			['aguanieve', 'la'],
			['agua', 'el'],
			['alma', 'el'],
			['ancla', 'el'],
			['hacha', 'el'],
			['águila', 'el'],
			['', 'la']
		]
	},
	predicateAgrees: true,
	// Third person singular of the present, which is the form every subject here
	// takes, and the pretérito beside it.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...tensed(
				`se_despierta se_levanta se_incorpora despierta se_espabila se_endereza abre_los_ojos se_estira se_pone_en_pie`,
				`se_despertó se_levantó se_incorporó despertó se_espabiló se_enderezó abrió_los_ojos se_estiró se_puso_en_pie`
			)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `hacia` rather than `a`, because `a` merges with `el` into
		// `al` and a preposition here is written in front of whatever article the
		// noun takes.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`va se_dirige se_encamina se_acerca avanza marcha viaja se_aproxima se_desplaza se_apresura se_lanza se_mueve`,
				`fue se_dirigió se_encaminó se_acercó avanzó marchó viajó se_aproximó se_desplazó se_apresuró se_lanzó se_movió`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`corre camina sube baja trota anda pasea salta cojea trepa`,
				`corrió caminó subió bajó trotó anduvo paseó saltó cojeó trepó`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...tensed(
				`parte se_marcha sale se_va se_aleja se_retira emprende_la_marcha se_pone_en_camino se_escabulle se_esfuma se_larga echa_a_andar arranca`,
				`partió se_marchó salió se_fue se_alejó se_retiró emprendió_la_marcha se_puso_en_camino se_escabulló se_esfumó se_largó echó_a_andar arrancó`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...tensed(
				`llega vuelve regresa viene se_acerca avanza se_aproxima se_desplaza`,
				`llegó volvió regresó vino se_acercó avanzó se_aproximó se_desplazó`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...tensed(
				`retorna vuelve_a_casa regresa_a_casa llega_a_casa aparece reaparece se_presenta asoma entra se_asoma`,
				`retornó volvió_a_casa regresó_a_casa llegó_a_casa apareció reapareció se_presentó asomó entró se_asomó`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...tensed(
				`corre camina salta pasea deambula trota corretea brinca marcha anda cojea zapatea se_pasea trepa da_saltos da_brincos camina_de_puntillas avanza_a_zancadas`,
				`corrió caminó saltó paseó deambuló trotó correteó brincó marchó anduvo cojeó zapateó se_paseó trepó dio_saltos dio_brincos caminó_de_puntillas avanzó_a_zancadas`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			...tensed(
				`vaga pasa se_mueve avanza retrocede gira da_vueltas se_desplaza se_desliza merodea ronda se_acerca se_aleja cruza se_escurre`,
				`vagó pasó se_movió avanzó retrocedió giró dio_vueltas se_desplazó se_deslizó merodeó rondó se_acercó se_alejó cruzó se_escurrió`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...tensed(
				`nada bucea chapotea flota se_sumerge emerge bracea`,
				`nadó buceó chapoteó flotó se_sumergió emergió braceó`
			)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			...tensed(
				`vuela despega planea revolotea aletea se_eleva se_posa aterriza desciende_en_picado sobrevuela alza_el_vuelo se_cierne emprende_el_vuelo`,
				`voló despegó planeó revoloteó aleteó se_elevó se_posó aterrizó descendió_en_picado sobrevoló alzó_el_vuelo se_cernió emprendió_el_vuelo`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...tensed(
				`repta se_arrastra serpentea se_desliza se_enrosca se_retuerce gatea se_escurre avanza_a_rastras excava`,
				`reptó se_arrastró serpenteó se_deslizó se_enroscó se_retorció gateó se_escurrió avanzó_a_rastras excavó`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...tensed(
				`espera se_esconde mira_alrededor vacila se_detiene aguarda escucha titubea duda se_queda_quieto permanece_inmóvil se_agazapa acecha se_asoma echa_un_vistazo se_demora holgazanea remolonea se_para hace_una_pausa observa_en_silencio se_queda_esperando`,
				`esperó se_escondió miró_alrededor vaciló se_detuvo aguardó escuchó titubeó dudó se_quedó_quieto permaneció_inmóvil se_agazapó acechó se_asomó echó_un_vistazo se_demoró holgazaneó remoloneó se_paró hizo_una_pausa observó_en_silencio se_quedó_esperando`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...tensed(
				`descansa se_sienta se_acuesta se_apoya se_acurruca reposa se_tumba se_recuesta se_relaja se_arrodilla se_agacha se_estira se_desploma toma_aliento recupera_el_aliento se_echa se_repantiga se_pone_cómodo hace_un_alto se_tiende reposa_un_rato`,
				`descansó se_sentó se_acostó se_apoyó se_acurrucó reposó se_tumbó se_recostó se_relajó se_arrodilló se_agachó se_estiró se_desplomó tomó_aliento recuperó_el_aliento se_echó se_repantigó se_puso_cómodo hizo_un_alto se_tendió reposó_un_rato`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...tensed(
				`duerme se_adormece se_duerme dormita echa_una_siesta cabecea se_queda_dormido ronca sueña da_una_cabezada se_amodorra descansa_profundamente cierra_los_ojos duerme_a_pierna_suelta`,
				`durmió se_adormeció se_durmió dormitó echó_una_siesta cabeceó se_quedó_dormido roncó soñó dio_una_cabezada se_amodorró descansó_profundamente cerró_los_ojos durmió_a_pierna_suelta`
			)
		},
		// What somebody shows, split by what it shows — see the Korean data.
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'content',
			...tensed(
				`ríe sonríe tararea se_ríe silba vitorea asiente aplaude guiña_un_ojo se_ríe_a_carcajadas canturrea sonríe_de_oreja_a_oreja`,
				`rió sonrió tarareó se_rió silbó vitoreó asintió aplaudió guiñó_un_ojo se_rió_a_carcajadas canturreó sonrió_de_oreja_a_oreja`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'restless',
			...tensed(
				`llora suspira murmura solloza gime gruñe refunfuña lloriquea resopla balbucea hace_una_mueca niega_con_la_cabeza frunce_el_ceño se_muerde_el_labio se_rasca_la_cabeza da_vueltas`,
				`lloró suspiró murmuró sollozó gimió gruñó refunfuñó lloriqueó resopló balbuceó hizo_una_mueca negó_con_la_cabeza frunció_el_ceño se_mordió_el_labio se_rascó_la_cabeza dio_vueltas`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'tired',
			...tensed(
				`bosteza se_frota_los_ojos se_estira se_masajea_los_hombros parpadea`,
				`bostezó se_frotó_los_ojos se_estiró se_masajeó_los_hombros parpadeó`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'hungry',
			...tensed(
				`traga_saliva se_relame se_frota_la_barriga olfatea_el_aire`,
				`tragó_saliva se_relamió se_frotó_la_barriga olfateó_el_aire`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...tensed(
				`grita exclama jadea se_encoge_de_hombros estornuda se_sonroja chilla saluda_con_la_mano ladea_la_cabeza abre_los_ojos_como_platos se_sobresalta`,
				`gritó exclamó jadeó se_encogió_de_hombros estornudó se_sonrojó chilló saludó_con_la_mano ladeó_la_cabeza abrió_los_ojos_como_platos se_sobresaltó`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...tensed(
				`charla conversa platica habla parlotea cotillea chismea susurra cuchichea dialoga se_explaya cuenta_historias saluda charlotea intercambia_palabras`,
				`charló conversó platicó habló parloteó cotilleó chismeó susurró cuchicheó dialogó se_explayó contó_historias saludó charloteó intercambió_palabras`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...tensed(
				`baila canta rueda juega brinca retoza salta da_volteretas gira da_vueltas se_revuelca juguetea travesea hace_el_tonto se_divierte juega_al_escondite da_saltitos hace_piruetas se_columpia`,
				`bailó cantó rodó jugó brincó retozó saltó dio_volteretas giró dio_vueltas se_revolcó jugueteó traveseó hizo_el_tonto se_divirtió jugó_al_escondite dio_saltitos hizo_piruetas se_columpió`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...tensed(
				`recuerda olvida imagina cuenta evoca añora piensa_en sueña_con medita_sobre reflexiona_sobre considera contempla cree_en confía_en anhela extraña echa_de_menos rememora se_acuerda_de se_pregunta_por se_preocupa_por entiende comprende visualiza se_imagina teme`,
				`recordó olvidó imaginó contó evocó añoró pensó_en soñó_con meditó_sobre reflexionó_sobre consideró contempló creyó_en confió_en anheló extrañó echó_de_menos rememoró se_acordó_de se_preguntó_por se_preocupó_por entendió comprendió visualizó se_imaginó temió`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`mira observa contempla examina toca acaricia ve vigila estudia inspecciona escruta ojea echa_un_vistazo_a admira analiza revisa palpa roza tantea golpea huele olfatea sopesa manosea escudriña vislumbra repasa`,
				`miró observó contempló examinó tocó acarició vio vigiló estudió inspeccionó escrutó ojeó echó_un_vistazo_a admiró analizó revisó palpó rozó tanteó golpeó olió olfateó sopesó manoseó escudriñó vislumbró repasó`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...tensed(
				`busca rebusca husmea explora hurga escarba curiosea rastrea indaga fisgonea revuelve_todo mira_por_todas_partes olisquea escudriña_los_rincones sondea inspecciona_el_lugar`,
				`buscó rebuscó husmeó exploró hurgó escarbó curioseó rastreó indagó fisgoneó revolvió_todo miró_por_todas_partes olisqueó escudriñó_los_rincones sondeó inspeccionó_el_lugar`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`encuentra descubre halla recoge localiza desentierra tropieza_con da_con se_topa_con recupera rescata saca_a_la_luz levanta_del_suelo descubre_por_casualidad`,
				`encontró descubrió halló recogió localizó desenterró tropezó_con dio_con se_topó_con recuperó rescató sacó_a_la_luz levantó_del_suelo descubrió_por_casualidad`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`elige toma agarra coge saca recibe atrapa sujeta sostiene levanta alza reúne junta escoge selecciona acepta obtiene consigue se_lleva se_queda_con guarda_en_el_bolsillo empuña aferra pilla arrebata se_apodera_de acapara`,
				`eligió tomó agarró cogió sacó recibió atrapó sujetó sostuvo levantó alzó reunió juntó escogió seleccionó aceptó obtuvo consiguió se_llevó se_quedó_con guardó_en_el_bolsillo empuñó aferró pilló arrebató se_apoderó_de acaparó`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`lleva trae carga acarrea transporta arrastra remolca empuja tira_de lleva_a_cuestas carga_al_hombro trae_consigo lleva_consigo traslada mueve`,
				`llevó trajo cargó acarreó transportó arrastró remolcó empujó tiró_de llevó_a_cuestas cargó_al_hombro trajo_consigo llevó_consigo trasladó movió`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`esconde guarda oculta entierra conserva almacena atesora acumula aparta reserva envuelve cubre tapa disimula pone_a_salvo guarda_bajo_llave mete_en_un_cajón deja_a_buen_recaudo custodia protege encierra archiva empaqueta`,
				`escondió guardó ocultó enterró conservó almacenó atesoró acumuló apartó reservó envolvió cubrió tapó disimuló puso_a_salvo guardó_bajo_llave metió_en_un_cajón dejó_a_buen_recaudo custodió protegió encerró archivó empaquetó`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			...tensed(
				`pierde extravía olvida deja_caer suelta deja_atrás traspapela se_olvida_de descuida deja_olvidado pierde_de_vista`,
				`perdió extravió olvidó dejó_caer soltó dejó_atrás traspapeló se_olvidó_de descuidó dejó_olvidado perdió_de_vista`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`hace construye talla pinta teje arma fabrica crea diseña elabora monta ensambla moldea esculpe dibuja inventa produce termina idea concibe da_forma_a completa perfecciona decora adorna`,
				`hizo construyó talló pintó tejió armó fabricó creó diseñó elaboró montó ensambló moldeó esculpió dibujó inventó produjo terminó ideó concibió dio_forma_a completó perfeccionó decoró adornó`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// Forged, cast and welded: metal and wood, never a coat or a jewel.
			objectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`forja funde suelda martillea remacha atornilla labra lima`,
				`forjó fundió soldó martilleó remachó atornilló labró limó`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing'],
			// Sewn and knitted: what is worn.
			objectThemes: ['clothing'],
			...tensed(
				`cose confecciona borda zurce hilvana cose_a_mano tricota`,
				`cosió confeccionó bordó zurció hilvanó cosió_a_mano tricotó`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`repara limpia pule arregla ordena ajusta friega lava frota sacude desempolva enjuaga seca lustra abrillanta afina aprieta engrasa lubrica parchea remienda restaura renueva revisa mantiene cuida atiende barniza cepilla plancha recompone retoca`,
				`reparó limpió pulió arregló ordenó ajustó fregó lavó frotó sacudió desempolvó enjuagó secó lustró abrillantó afinó apretó engrasó lubricó parcheó remendó restauró renovó revisó mantuvo cuidó atendió barnizó cepilló planchó recompuso retocó`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			...tensed(
				`vende entrega cede ofrece despacha subasta comercia_con negocia_con liquida coloca remata pone_a_la_venta saca_a_la_venta se_deshace_de traspasa vende_a_buen_precio malvende revende exhibe expone`,
				`vendió entregó cedió ofreció despachó subastó comerció_con negoció_con liquidó colocó remató puso_a_la_venta sacó_a_la_venta se_deshizo_de traspasó vendió_a_buen_precio malvendió revendió exhibió expuso`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			...tensed(
				`compra adquiere encarga consigue paga se_hace_con se_agencia pide se_compra se_procura invierte_en se_provee_de se_abastece_de`,
				`compró adquirió encargó consiguió pagó se_hizo_con se_agenció pidió se_compró se_procuró invirtió_en se_proveyó_de se_abasteció_de`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`hornea calienta cocina corta asa sirve guisa fríe hierve cuece saltea sazona adereza condimenta sala remueve mezcla bate rehoga estofa tuesta gratina pela pica trocea ralla lamina recalienta aliña prepara emplata adoba marina escalfa`,
				`horneó calentó cocinó cortó asó sirvió guisó frió hirvió coció salteó sazonó aderezó condimentó saló removió mezcló batió rehogó estofó tostó gratinó peló picó troceó ralló laminó recalentó aliñó preparó emplató adobó marinó escalfó`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...tensed(
				`come mastica prueba mordisquea devora saborea degusta traga engulle zampa muerde roe lame picotea da_un_bocado_a se_zampa se_come termina se_traga se_come_entero da_cuenta_de merienda cena almuerza desayuna`,
				`comió masticó probó mordisqueó devoró saboreó degustó tragó engulló zampó mordió royó lamió picoteó dio_un_bocado_a se_zampó se_comió terminó se_tragó se_comió_entero dio_cuenta_de merendó cenó almorzó desayunó`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...tensed(
				`bebe sorbe apura saborea traga se_bebe se_toma toma degusta prueba paladea trasiega bebe_a_sorbos bebe_de_un_trago da_un_sorbo_a vacía termina se_termina se_traga_de_golpe`,
				`bebió sorbió apuró saboreó tragó se_bebió se_tomó tomó degustó probó paladeó trasegó bebió_a_sorbos bebió_de_un_trago dio_un_sorbo_a vació terminó se_terminó se_tragó_de_golpe`
			)
		},
		{
			field: 'change',
			subject: ['place'],
			...tensed(
				`se_calma oscurece se_ilumina se_llena se_vacía se_anima despierta se_despierta se_duerme se_silencia enmudece se_aquieta se_agita bulle se_abarrota se_llena_de_gente se_queda_desierto se_queda_en_silencio brilla resplandece reluce se_congela se_hiela se_descongela se_moja se_seca se_inunda se_apaga se_enciende se_transforma cambia amanece anochece se_cubre_de_niebla se_cubre_de_nieve se_vuelve_a_llenar se_tranquiliza se_alboroza`,
				`se_calmó oscureció se_iluminó se_llenó se_vació se_animó despertó se_despertó se_durmió se_silenció enmudeció se_aquietó se_agitó bulló se_abarrotó se_llenó_de_gente se_quedó_desierto se_quedó_en_silencio brilló resplandeció relució se_congeló se_heló se_descongeló se_mojó se_secó se_inundó se_apagó se_encendió se_transformó cambió amaneció anocheció se_cubrió_de_niebla se_cubrió_de_nieve se_volvió_a_llenar se_tranquilizó se_alborozó`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...tensed(
				`brilla fluye se_ahonda empieza termina continúa pasa sigue transcurre avanza se_acerca llega se_aleja se_prolonga se_alarga se_demora se_repite se_desvanece concluye acaba finaliza se_desarrolla se_intensifica se_calma se_atenúa persiste dura cesa`,
				`brilló fluyó se_ahondó empezó terminó continuó pasó siguió transcurrió avanzó se_acercó llegó se_alejó se_prolongó se_alargó se_demoró se_repitió se_desvaneció concluyó acabó finalizó se_desarrolló se_intensificó se_calmó se_atenuó persistió duró cesó`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it breaks, wears away, draws in.
			subjectThemes: ['time'],
			...tensed(
				`amanece anochece atardece clarea despunta declina cae se_agota se_va se_escapa vuela se_desliza avanza_despacio se_instala se_asienta cambia se_acorta se_alarga se_apaga muere renace`,
				`amaneció anocheció atardeció clareó despuntó declinó cayó se_agotó se_fue se_escapó voló se_deslizó avanzó_despacio se_instaló se_asentó cambió se_acortó se_alargó se_apagó murió renació`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, sets in, lets up.
			subjectThemes: ['weather'],
			...tensed(
				`llega se_acerca se_avecina estalla arrecia amaina escampa despeja se_disipa se_levanta se_aleja pasa_de_largo azota arrasa se_desata se_calma cesa se_intensifica se_debilita cubre_el_cielo envuelve_todo cae remite`,
				`llegó se_acercó se_avecinó estalló arreció amainó escampó despejó se_disipó se_levantó se_alejó pasó_de_largo azotó arrasó se_desató se_calmó cesó se_intensificó se_debilitó cubrió_el_cielo envolvió_todo cayó remitió`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it kicks off, heats up, wraps up.
			subjectThemes: ['sport'],
			...tensed(
				`comienza arranca se_inicia se_reanuda se_interrumpe se_suspende se_alarga se_calienta se_decide se_disputa se_celebra se_juega se_acaba llega_a_su_fin entra_en_su_recta_final se_pone_emocionante`,
				`comenzó arrancó se_inició se_reanudó se_interrumpió se_suspendió se_alargó se_calentó se_decidió se_disputó se_celebró se_jugó se_acabó llegó_a_su_fin entró_en_su_recta_final se_puso_emocionante`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...tensed(
				`se_mece reluce cae rueda se_inclina envejece brilla resplandece destella tiembla vibra se_tambalea se_bambolea se_vuelca se_derrumba se_desliza resbala se_desploma gira da_vueltas se_detiene se_para se_mueve se_desplaza se_desgasta se_decolora se_apaga se_empaña se_deforma se_dobla se_tuerce sale_volando rebota salta se_estremece se_balancea oscila se_asienta se_queda_quieto se_aja se_ensucia se_cubre_de_polvo`,
				`se_meció relució cayó rodó se_inclinó envejeció brilló resplandeció destelló tembló vibró se_tambaleó se_bamboleó se_volcó se_derrumbó se_deslizó resbaló se_desplomó giró dio_vueltas se_detuvo se_paró se_movió se_desplazó se_desgastó se_decoloró se_apagó se_empañó se_deformó se_dobló se_torció salió_volando rebotó saltó se_estremeció se_balanceó osciló se_asentó se_quedó_quieto se_ajó se_ensució se_cubrió_de_polvo`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			...tensed(
				`se_oxida chirría cruje traquetea rechina tintinea se_rompe se_quiebra se_agrieta se_raja se_parte se_atasca se_traba se_afloja se_suelta se_desarma se_estropea se_avería echa_humo se_abolla se_desmonta`,
				`se_oxidó chirrió crujió traqueteó rechinó tintineó se_rompió se_quebró se_agrietó se_rajó se_partió se_atascó se_trabó se_aflojó se_soltó se_desarmó se_estropeó se_averió echó_humo se_abolló se_desmontó`
			)
		},
		{
			field: 'change',
			subject: ['thing'],
			// What a song or a drum does: it plays, rings out, dies away.
			subjectThemes: ['music'],
			...tensed(
				`suena resuena retumba flota se_eleva se_apaga se_desvanece se_extingue calla se_detiene se_repite continúa sigue se_prolonga se_propaga se_extiende se_oye llega_de_lejos hace_eco resuena_a_lo_lejos crece decrece sube baja se_alza se_impone`,
				`sonó resonó retumbó flotó se_elevó se_apagó se_desvaneció se_extinguió calló se_detuvo se_repitió continuó siguió se_prolongó se_propagó se_extendió se_oyó llegó_de_lejos hizo_eco resonó_a_lo_lejos creció decreció subió bajó se_alzó se_impuso`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...tensed(
				`circula se_detiene pasa regresa parte resbala arranca avanza rueda se_desliza acelera frena se_para se_aleja se_acerca gira dobla da_la_vuelta retrocede se_estaciona aparca llega sale entra se_mueve traquetea vibra derrapa patina zumba ruge se_pone_en_marcha se_detiene_en_seco sigue_su_camino va_despacio`,
				`circuló se_detuvo pasó regresó partió resbaló arrancó avanzó rodó se_deslizó aceleró frenó se_paró se_alejó se_acercó giró dobló dio_la_vuelta retrocedió se_estacionó aparcó llegó salió entró se_movió traqueteó vibró derrapó patinó zumbó rugió se_puso_en_marcha se_detuvo_en_seco siguió_su_camino fue_despacio`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...tensed(
				`se_extiende desaparece permanece flota se_ahonda crece se_desvanece se_esfuma se_diluye se_debilita se_fortalece se_intensifica surge aflora emerge resurge renace vuelve regresa se_apaga se_asienta se_instala se_acumula se_arraiga echa_raíces se_agita se_calma se_apacigua se_aviva se_enciende se_propaga se_difunde persiste perdura se_disipa sube baja cambia oscila fluctúa se_agranda se_reduce se_transforma se_pierde se_borra`,
				`se_extendió desapareció permaneció flotó se_ahondó creció se_desvaneció se_esfumó se_diluyó se_debilitó se_fortaleció se_intensificó surgió afloró emergió resurgió renació volvió regresó se_apagó se_asentó se_instaló se_acumuló se_arraigó echó_raíces se_agitó se_calmó se_apaciguó se_avivó se_encendió se_propagó se_difundió persistió perduró se_disipó subió bajó cambió osciló fluctuó se_agrandó se_redujo se_transformó se_perdió se_borró`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...tensed(
				`crece se_marchita florece se_mece brota germina retoña echa_brotes echa_hojas echa_raíces se_abre se_despliega reverdece amarillea se_seca se_agosta se_dobla se_inclina se_curva se_estira se_alarga trepa se_enreda se_extiende da_fruto da_flores fructifica perfuma se_agita tiembla susurra se_balancea oscila se_yergue se_endereza pierde_las_hojas suelta_las_hojas se_deshoja revive resucita se_espesa prospera se_desarrolla`,
				`creció se_marchitó floreció se_meció brotó germinó retoñó echó_brotes echó_hojas echó_raíces se_abrió se_desplegó reverdeció amarilleó se_secó se_agostó se_dobló se_inclinó se_curvó se_estiró se_alargó trepó se_enredó se_extendió dio_fruto dio_flores fructificó perfumó se_agitó tembló susurró se_balanceó osciló se_irguió se_enderezó perdió_las_hojas soltó_las_hojas se_deshojó revivió resucitó se_espesó prosperó se_desarrolló`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...tensed(
				`tiembla se_mueve se_entumece sana se_estremece tirita se_sacude late palpita se_crispa se_tensa se_relaja se_afloja se_agarrota se_endurece se_ablanda se_calienta se_enfría se_hincha se_deshincha se_inflama duele escuece pica hormiguea arde suda se_cansa se_agota se_recupera se_repone se_estira se_encoge se_dobla se_flexiona se_alza se_baja se_eleva se_gira se_agita cede se_adormece se_despierta cosquillea se_abre se_cierra`,
				`tembló se_movió se_entumeció sanó se_estremeció tiritó se_sacudió latió palpitó se_crispó se_tensó se_relajó se_aflojó se_agarrotó se_endureció se_ablandó se_calentó se_enfrió se_hinchó se_deshinchó se_inflamó dolió escoció picó hormigueó ardió sudó se_cansó se_agotó se_recuperó se_repuso se_estiró se_encogió se_dobló se_flexionó se_alzó se_bajó se_elevó se_giró se_agitó cedió se_adormeció se_despertó cosquilleó se_abrió se_cerró`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...tensed(
				`madura se_enfría hierve se_derrite se_estropea se_calienta se_entibia se_templa humea echa_vapor huele_bien desprende_aroma se_acaba se_termina se_agota sobra queda se_reduce llega_a_la_mesa se_sirve se_cuaja se_endurece se_ablanda se_pudre se_echa_a_perder fermenta se_congela se_espesa se_aclara se_asienta reposa se_enfría_del_todo`,
				`maduró se_enfrió hirvió se_derritió se_estropeó se_calentó se_entibió se_templó humeó echó_vapor olió_bien desprendió_aroma se_acabó se_terminó se_agotó sobró quedó se_redujo llegó_a_la_mesa se_sirvió se_cuajó se_endureció se_ablandó se_pudrió se_echó_a_perder fermentó se_congeló se_espesó se_aclaró se_asentó reposó se_enfrió_del_todo`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a dish does and a drink does not: it sizzles, crumbles, goes stale.
			subjectThemes: ['food'],
			...tensed(
				`chisporrotea se_dora se_tuesta se_quema se_chamusca se_desmigaja se_desmorona se_pone_duro se_pone_rancio se_seca se_reseca se_humedece se_enmohece se_agria se_infla sube se_cuece se_hornea se_asa se_fríe se_deshace se_desmenuza se_derrumba`,
				`chisporroteó se_doró se_tostó se_quemó se_chamuscó se_desmigajó se_desmoronó se_puso_duro se_puso_rancio se_secó se_resecó se_humedeció se_enmoheció se_agrió se_infló subió se_coció se_horneó se_asó se_frió se_deshizo se_desmenuzó se_derrumbó`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it fizzes, spills, goes flat.
			subjectThemes: ['drink'],
			...tensed(
				`burbujea espuma hace_espuma se_derrama se_vierte salpica chapotea se_agita se_revuelve se_enturbia se_aclara se_asienta pierde_el_gas se_evapora se_desborda gotea chorrea se_aguada se_concentra se_hiela`,
				`burbujeó espumó hizo_espuma se_derramó se_vertió salpicó chapoteó se_agitó se_revolvió se_enturbió se_aclaró se_asentó perdió_el_gas se_evaporó se_desbordó goteó chorreó se_aguadó se_concentró se_heló`
			)
		}
	],
	// Written in the masculine singular, which is what `agreement` reshapes. What
	// a hero is by nature takes `ser`, and how they are just now takes `estar`,
	// which is why the groups that carry a condition bring their own copula.
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`
				grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado fiero manso listo
				joven viejo fuerte débil audaz tímido orgulloso vivaz sereno terco ágil alerta robusto honesto astuto
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			head: 'está',
			pastHead: 'estaba',
			words: words(`hambriento famélico voraz ávido`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			head: 'está',
			pastHead: 'estaba',
			words: words(`satisfecho lleno saciado repleto`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			head: 'está',
			pastHead: 'estaba',
			words: words(`cansado soñoliento agotado exhausto rendido fatigado`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			head: 'está',
			pastHead: 'estaba',
			words: words(`descansado fresco animado despejado ligero vigoroso`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			head: 'está',
			pastHead: 'estaba',
			words: words(`feliz contento alegre tranquilo dichoso risueño encantado gozoso`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			head: 'está',
			pastHead: 'estaba',
			words: words(`aburrido curioso inquieto nervioso impaciente ansioso desasosegado intranquilo`)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'edible',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(
				`hermoso extraño nuevo común raro bonito conocido singular ordinario espléndido precioso`
			)
		},
		{
			subject: ['place', 'event'],
			words: words(`
				ancho estrecho tranquilo profundo oscuro claro lejano empinado
				amplio angosto concurrido vacío inmenso sombrío llano largo breve luminoso
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				duro ligero pesado viejo liso transparente robusto
				redondo plano afilado delgado grueso frágil lujoso sencillo delicado áspero brillante
			`)
		},
		{
			subject: ['edible'],
			words: words(
				`dulce salado picante ácido caliente frío sabroso amargo espeso suave tibio jugoso crujiente rico soso`
			)
		},
		{
			subject: ['idea'],
			words: words(
				`sencillo evidente vago eterno fugaz complejo claro profundo familiar valioso secreto menudo difícil fácil`
			)
		},
		{
			subject: ['plant'],
			words: words(`verde frondoso fragante marchito alto tierno esbelto lozano ralo tupido`)
		},
		{
			subject: ['body'],
			words: words(`cálido frío dolorido rígido suave áspero terso pálido fuerte entumecido pesado`)
		}
	],
	// Masculine singular, the form `agreement` reshapes, after the noun.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				valiente animado amable ocupado perezoso tímido listo joven viejo pequeño grande silencioso alegre paciente ágil curioso
				audaz temeroso cauto terco manso ruidoso fornido flaco soñoliento astuto alerta callado orgulloso inocente honrado despierto sereno
			`)
		},
		{
			subject: ['person'],
			words: words(`
				joven amable severo serio ocupado sincero
				sabio humilde educado hábil famoso pobre rico anciano risueño perspicaz afable trabajador
			`)
		},
		{
			subject: ['creature'],
			words: words(
				`veloz feroz manso rechoncho pequeñito peludo moteado rayado escuálido enorme diestro rollizo lustroso alargado`
			)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				dulce picante tibio fresco crujiente sabroso fragante caliente salado blando maduro rico
				dorado ahumado cremoso tierno jugoso sustancioso humeante tostado pegajoso soso especiado
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(
				`dulce tibio frío fresco caliente fragante espumoso fuerte amargo cremoso helado lechoso turbio claro burbujeante suave templado`
			)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				viejo nuevo pequeño grande ligero pesado brillante liso transparente duro bonito precioso antiguo
				oxidado gastado pulido sencillo recargado estrecho ancho redondo plano afilado romo frágil hueco polvoriento torcido
			`)
		},
		{
			subject: ['vehicle'],
			words: words(
				`rápido lento robusto chirriante reluciente oxidado destartalado enorme ruidoso vetusto`
			)
		},
		{
			subject: ['place'],
			words: words(`
				tranquilo amplio oscuro luminoso extraño viejo acogedor apartado bullicioso silencioso remoto lejano cercano vacío solitario soleado
				angosto concurrido ventoso brumoso sombreado polvoriento húmedo rocoso empinado llano desolado frondoso desierto despejado
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				verde frondoso fragante joven marchito alto pequeño tierno fresco
				espinoso florido incipiente trepador silvestre esbelto pálido caído tupido
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				vago viejo nuevo extraño claro precioso pequeño raro
				tenue sencillo enredado terco fugaz lejano audaz secreto callado familiar
			`)
		},
		{
			subject: ['event'],
			words: words(`
				largo breve tranquilo soleado nublado ruidoso repentino
				solemne alegre aburrido lluvioso tormentoso sereno concurrido animado espléndido sencillo
			`)
		},
		{
			subject: ['body'],
			words: words(
				`pequeño frío cálido esbelto robusto suave rígido dolorido áspero terso pálido fuerte`
			)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(
				`hermoso misterioso extraño nuevo bonito conocido curioso corriente espléndido humilde`
			)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				en_silencio despacio rápidamente suavemente de_repente apenas a_solas brevemente firmemente audazmente
				con_cuidado ansiosamente tranquilamente alegremente torpemente fuertemente pacientemente ligeramente serenamente
				vivamente con_calma
				sigilosamente de_puntillas atropelladamente apresuradamente cuidadosamente atentamente distraídamente
				nerviosamente curiosamente orgullosamente tímidamente amablemente dulcemente amargamente severamente
				ávidamente descuidadamente tiernamente bruscamente hábilmente diestramente decididamente felizmente
				tristemente pesadamente animadamente a_duras_penas de_mala_gana adrede sin_decir_nada de_un_salto
				sin_prisa con_ganas en_voz_baja sin_pausa
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(`
				en_silencio despacio suavemente de_repente apenas otra_vez todavía de_nuevo poco_a_poco lentamente débilmente aún
				gradualmente
				silenciosamente levemente intensamente vivamente profundamente ampliamente tenuemente cálidamente
				fríamente dulcemente espesamente firmemente pesadamente ligeramente sin_cesar constantemente
				eternamente una_vez_más durante_un_rato de_golpe por_todas_partes
			`)
		}
	],
	times: {
		day: words(`
			al_amanecer de_madrugada por_la_mañana a_mediodía por_la_tarde al_anochecer por_la_noche
			a_medianoche
		`),
		any: words(`
			en_primavera en_verano en_otoño en_invierno los_fines_de_semana en_los_días_festivos todo_el_día
			en_plena_primavera a_finales_de_primavera a_principios_de_verano en_pleno_verano a_finales_de_verano
			a_principios_de_otoño a_finales_de_otoño en_pleno_invierno a_finales_de_invierno en_la_época_de_lluvias
			en_la_cosecha en_la_fiesta en_día_de_mercado en_luna_llena en_un_día_de_lluvia en_un_día_de_nieve
			en_un_día_de_viento en_un_día_claro en_un_día_nublado en_un_día_de_niebla en_vacaciones
		`),
		past: words(`
			ayer la_semana_pasada hace_tiempo aquel_día aquella_noche una_vez
			anteayer el_mes_pasado el_año_pasado hace_años hace_un_rato aquella_mañana aquella_tarde por_entonces
			en_aquellos_días la_semana_anterior la_primavera_pasada el_verano_pasado el_otoño_pasado
			el_invierno_pasado hace_unos_días
		`),
		present: words(`
			hoy hace_poco mañana la_semana_que_viene
			ahora_mismo esta_mañana esta_tarde esta_noche pasado_mañana el_mes_que_viene el_año_que_viene
			este_año esta_semana este_fin_de_semana en_un_momento enseguida
		`),
		habitual: words(`
			estos_días a_veces cada_día cada_noche
			siempre a_menudo normalmente rara_vez de_vez_en_cuando cada_mañana cada_semana cada_año
			por_lo_general casi_siempre
		`)
	},
	homes: words(`casa cabaña`),
	join: { word: 'y' },
	// Written with the comma the ones that need one take.
	connectives: {
		additive: words(`y_luego además, también asimismo, es_más, encima,`),
		temporal: words(`
			después por_fin mientras_tanto, más_tarde al_final poco_después
			acto_seguido, al_rato en_seguida, para_entonces, al_cabo_de_un_rato, momentos_después,
		`),
		contrastive: words(
			`pero sin_embargo, aun_así en_cambio, no_obstante, con_todo, por_el_contrario, aun_entonces,`
		),
		causal: words(`entonces por_eso así_que por_tanto, en_consecuencia, de_ahí_que por_esa_razón,`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		pájaro golondrina gorrión cuervo halcón águila pavo_real loro búho paloma grulla cisne pato ganso
		mariposa abeja libélula cigarra mosca mosquito murciélago garza pelícano
		dragón fénix hada pegaso grifo ángel valquiria
		mirlo ruiseñor alondra codorniz faisán perdiz colibrí tucán flamenco cigüeña abubilla jilguero
		urraca arrendajo avispa polilla luciérnaga hipogrifo
		`),
		swimmer: words(`
		cocodrilo tortuga rana sapo pez ballena delfín tiburón pulpo calamar gamba cangrejo morsa foca
		pingüino
		sirena kraken náyade
		anguila sardina atún bacalao merluza trucha salmón carpa raya medusa almeja mejillón ostra
		salamandra tritón castor hipopótamo ornitorrinco
		`),
		crawler: words(`
		cocodrilo serpiente lagarto tortuga caracol hormiga araña gusano cangrejo
		basilisco
		iguana camaleón salamandra tritón boa víbora cobra pitón escarabajo
		saltamontes grillo pulga oruga ciempiés escorpión
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			hechizo maldición profecía amuleto talismán runa portal santuario ídolo tótem augurio presagio bestiario
			conjuro sortilegio grimorio pentáculo reliquia cáliz grial varita báculo cetro corona
		`),
		// A word of the place class that is no place.
		placeless: words(`
			arena guijarro terremoto géiser fumarola estalactita estalagmita eco brasa
			estrella sol meteoro aurora menguante creciente eclipse cenit satélite cúmulo constelación órbita gravedad rotación
			traslación mancha_solar año_luz astro eclíptica meridiano ingravidez plenilunio novilunio perigeo apogeo lucero
			supernova cuásar púlsar
			corriente marea oleaje espuma rompiente paralaje parsec acimut perihelio afelio elipse cuadrante nadir gravitación
			halo bólido enana coma
		`)
	},
	interjections: words(`
		ay, oh, vaya, caramba, madre_mía, mira, desde_luego, uy, anda, hombre, cielos, vamos,
		ajá, ea, huy, válgame, por_fin, claro, qué_va, ojalá, atiza, hala, oye, menos_mal,
	`),
	// Spanish carries its subject in the verb ending, so a second sentence about
	// the same thing writes no pronoun at all.
	pronouns: { n: [''] },
	// What somebody answers with. The opening ¿ and ¡ are the language's own
	// openers, written by the sentence rather than in the entry.
	replies: {
		casual: {
			agree: words(`
				ya claro es_verdad yo_también así_es sin_duda desde_luego eso_mismo y_que_lo_digas ya_lo_creo
			`),
			cheer: words(`
				qué_bien! bien_hecho! estupendo! qué_suerte genial! enhorabuena qué_alegría! fantástico! por_fin! me_alegro
			`),
			care: words(`
				estás_bien? descansa_un_poco no_te_esfuerces_tanto vamos_a_comer_algo qué_pena tómate_tu_tiempo no_te_preocupes ten_cuidado ánimo siéntate_un_momento bebe_un_poco_de_agua te_ayudo
			`),
			wonder: words(`
				de_verdad? en_serio? dónde? cuándo? y_luego? no_puede_ser! cómo? por_qué? ah_sí? y_después? qué_pasó? qué?
			`),
			answer: words(`
				sí,_un_poco no,_estoy_bien sí,_bastante más_o_menos no,_todavía_no sí,_mucho un_poquito no_mucho sí,_muchísimo no,_para_nada regular sí,_la_verdad
			`)
		}
	},
	// A question to the person beside them drops its subject and conjugates the
	// copula: `¿Estás cansado?`, `¿Eres valiente?`. The first person would have to
	// conjugate every verb, so there is no `speech`.
	listener: { subject: '', heads: { es: 'eres', está: 'estás' } },
	// What somebody says on coming home — said whole, so no verb has to be
	// conjugated for a first person the language otherwise leaves unwritten.
	homecomings: {
		casual: words(`ya_estoy_en_casa ya_llegué ya_estoy_de_vuelta en_casa_por_fin!`)
	},
	// How much a state holds, in front of it: `está muy cansado`.
	degrees: words(`muy bastante un_poco realmente algo demasiado sumamente verdaderamente`),
	// An object named once is a clitic the next time, in front of the verb and
	// agreeing with the noun: `cocinó la salchicha y la comió`.
	objectPronouns: { words: { m: words(`lo`), f: words(`la`) }, clitic: true },
	// Money only, for the reason English has: a counted phrase would need a plural
	// noun, and most of these pools are not countable at all.
	numeral: {
		order: 'before',
		counters: {},
		count: [2, 12],
		currency: 'euros',
		amounts: [100, 500, 1000, 5000, 12000, 25000, 50000, 100000],
		group: '.',
		gap: ' '
	},
	// Spanish names its months and writes `de` between every part of a date.
	calendar: {
		date: 'D de MMMM de Y',
		months: words(`
			enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre
		`),
		clock: 'h:mm',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`es`),
			past: { words: words(`fue`) }
		}
	},
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', head: 'el', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: 'a las', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `El partido es a las 11:40.`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', head: 'el', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', head: 'a las', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 18
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'en', modifiable: true }
			],
			weight: 14
		},
		// Where the subject is going, and where it arrives: `va hacia el mercado`,
		// `vuelve hasta la casa`.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hacia', modifiable: true }
			],
			weight: 8,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hasta', modifiable: true }
			],
			weight: 8,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hacia', modifiable: true }
			],
			weight: 4,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'hasta', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 3,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'es', pastHead: 'era' }
			],
			weight: 12
		},
		// A state with how much of it, and one with when: `El gato está muy cansado`,
		// `Por la mañana, el gato estaba cansado`. The copula moves in front of the
		// degree, whichever one the group brings.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state', head: 'es', pastHead: 'era' }
			],
			weight: 9
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'es', pastHead: 'era' }
			],
			weight: 5
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'manner' }],
			weight: 10
		},
		{
			parts: [{ slot: 'time', tail: ',' }, { slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 8
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'place', head: 'en', modifiable: true }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'en', modifiable: true }
			],
			weight: 6
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'money' }],
			weight: 6
		}
	]
};
