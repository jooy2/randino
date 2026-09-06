// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for de.
final SentenceLanguageData de = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['„', '“'],
    SentenceQuote.single: <String>['‚', '‘'],
  },
  articles: const <WordGender, List<List<String>>>{
    WordGender.m: <List<String>>[
      <String>['', 'ein'],
    ],
    WordGender.f: <List<String>>[
      <String>['', 'eine'],
    ],
    WordGender.n: <List<String>>[
      <String>['', 'ein'],
    ],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        erwacht erhebt_sich regt_sich reckt_sich streckt_sich räkelt_sich rührt_sich ermuntert_sich
      '''),
      past: PredicateTense(
        words: words(r'''
          erwachte erhob_sich regte_sich reckte_sich streckte_sich räkelte_sich rührte_sich
          ermunterte_sich
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        geht wandert eilt reist zieht entfernt_sich trollt_sich schleicht flieht flüchtet enteilt
        entschwindet verabschiedet_sich entweicht entflieht verschwindet
      '''),
      past: PredicateTense(
        words: words(r'''
          ging wanderte eilte reiste zog entfernte_sich trollte_sich schlich floh flüchtete enteilte
          entschwand verabschiedete_sich entwich entfloh verschwand
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'kommt erscheint naht nähert_sich landet'),
      past: PredicateTense(words: words(r'kam erschien nahte näherte_sich landete')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'''
        läuft springt bummelt trabt spaziert rennt tänzelt schlendert stolziert stapft trottet
        stakst joggt marschiert tippelt watschelt humpelt galoppiert flitzt hetzt hastet trippelt
        stiefelt tobt flaniert schreitet wandelt sprintet hopst
      '''),
      past: PredicateTense(
        words: words(r'''
          lief sprang bummelte trabte spazierte rannte tänzelte schlenderte stolzierte stapfte
          trottete stakste joggte marschierte tippelte watschelte humpelte galoppierte flitzte
          hetzte hastete trippelte stiefelte tobte flanierte schritt wandelte sprintete hopste
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        streift bewegt_sich wendet_sich dreht_sich kreist treibt gleitet huscht schweift streunt
        weicht rückt
      '''),
      past: PredicateTense(
        words: words(r'''
          streifte bewegte_sich wandte_sich drehte_sich kreiste trieb glitt huschte schweifte
          streunte wich rückte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'schwimmt taucht plantscht paddelt strampelt krault'),
      past: PredicateTense(words: words(r'schwamm tauchte plantschte paddelte strampelte kraulte')),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'fliegt flattert schwebt segelt schwirrt steigt sinkt schwingt_sich stürzt'),
      past: PredicateTense(
        words: words(r'''
          flog flatterte schwebte segelte schwirrte stieg sank schwang_sich stürzte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'''
        kriecht schlängelt_sich windet_sich robbt krabbelt ringelt_sich gräbt wühlt
      '''),
      past: PredicateTense(
        words: words(r'''
          kroch schlängelte_sich wand_sich robbte krabbelte ringelte_sich grub wühlte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        wartet zögert verharrt lauscht lauert horcht verweilt harrt zaudert duckt_sich
        versteckt_sich späht trödelt bleibt stockt schweigt wacht
      '''),
      past: PredicateTense(
        words: words(r'''
          wartete zögerte verharrte lauschte lauerte horchte verweilte harrte zauderte duckte_sich
          versteckte_sich spähte trödelte blieb stockte schwieg wachte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        ruht sitzt liegt rastet lehnt setzt_sich legt_sich entspannt_sich kauert kniet hockt lümmelt
        fläzt_sich verschnauft lagert bettet_sich erholt_sich pausiert
      '''),
      past: PredicateTense(
        words: words(r'''
          ruhte saß lag rastete lehnte setzte_sich legte_sich entspannte_sich kauerte kniete hockte
          lümmelte fläzte_sich verschnaufte lagerte bettete_sich erholte_sich pausierte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        schläft schlummert dämmert döst schnarcht träumt pennt entschlummert duselt
      '''),
      past: PredicateTense(
        words: words(r'''
          schlief schlummerte dämmerte döste schnarchte träumte pennte entschlummerte duselte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        lacht weint gähnt seufzt lächelt summt murmelt ruft kichert grinst schluchzt stöhnt murrt
        brummt pfeift schreit jauchzt jubelt keucht nickt niest klatscht zwinkert errötet prustet
        schnieft schnaubt kreischt stammelt winkt strahlt schmunzelt gluckst schnalzt hustet
        räuspert_sich wimmert heult grunzt jammert flucht
      '''),
      past: PredicateTense(
        words: words(r'''
          lachte weinte gähnte seufzte lächelte summte murmelte rief kicherte grinste schluchzte
          stöhnte murrte brummte pfiff schrie jauchzte jubelte keuchte nickte nieste klatschte
          zwinkerte errötete prustete schniefte schnaubte kreischte stammelte winkte strahlte
          schmunzelte gluckste schnalzte hustete räusperte_sich wimmerte heulte grunzte jammerte
          fluchte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        plaudert redet schwatzt spricht quatscht tratscht klönt tuschelt flüstert unterhält_sich
        ratscht palavert erzählt grüßt plauscht schnattert quasselt labert
      '''),
      past: PredicateTense(
        words: words(r'''
          plauderte redete schwatzte sprach quatschte tratschte klönte tuschelte flüsterte
          unterhielt_sich ratschte palaverte erzählte grüßte plauschte schnatterte quasselte laberte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        tanzt singt tollt spielt hüpft rollt purzelt wirbelt kugelt_sich albert balgt_sich
        vergnügt_sich schaukelt wälzt_sich springt tummelt_sich kaspert trällert scherzt
      '''),
      past: PredicateTense(
        words: words(r'''
          tanzte sang tollte spielte hüpfte rollte purzelte wirbelte kugelte_sich alberte
          balgte_sich vergnügte_sich schaukelte wälzte_sich sprang tummelte_sich kasperte trällerte
          scherzte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        sucht stöbert kramt wühlt forscht schnüffelt buddelt fahndet erkundet tastet stochert
        schnuppert
      '''),
      past: PredicateTense(
        words: words(r'''
          suchte stöberte kramte wühlte forschte schnüffelte buddelte fahndete erkundete tastete
          stocherte schnupperte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        verstummt dunkelt erhellt_sich leert_sich füllt_sich belebt_sich erwacht summt brummt
        wimmelt glänzt glitzert funkelt taut trocknet versinkt erstrahlt verändert_sich wandelt_sich
        verblasst dämmert erblüht leuchtet ergraut verödet verstaubt vereist brodelt lärmt tost
        rauscht flimmert erglüht verdunkelt_sich beruhigt_sich
      '''),
      past: PredicateTense(
        words: words(r'''
          verstummte dunkelte erhellte_sich leerte_sich füllte_sich belebte_sich erwachte summte
          brummte wimmelte glänzte glitzerte funkelte taute trocknete versank erstrahlte
          veränderte_sich wandelte_sich verblasste dämmerte erblühte leuchtete ergraute verödete
          verstaubte vereiste brodelte lärmte toste rauschte flimmerte erglühte verdunkelte_sich
          beruhigte_sich
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        leuchtet fließt vertieft_sich beginnt endet dauert vergeht verstreicht naht verklingt
        verläuft steigert_sich verebbt entfaltet_sich wiederholt_sich verrinnt währt schwindet
        erlischt eskaliert verfliegt nähert_sich verlängert_sich verkürzt_sich
      '''),
      past: PredicateTense(
        words: words(r'''
          leuchtete floss vertiefte_sich begann endete dauerte verging verstrich nahte verklang
          verlief steigerte_sich verebbte entfaltete_sich wiederholte_sich verrann währte schwand
          erlosch eskalierte verflog näherte_sich verlängerte_sich verkürzte_sich
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.time],
      words: words(r'''
        dämmert graut neigt_sich senkt_sich kippt kommt geht erwacht erblüht weicht entschwindet
        verglüht ergraut
      '''),
      past: PredicateTense(
        words: words(r'''
          dämmerte graute neigte_sich senkte_sich kippte kam ging erwachte erblühte wich entschwand
          verglühte ergraute
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.weather],
      words: words(r'''
        tobt wütet braust peitscht prasselt rieselt nieselt tröpfelt weht bläst fegt legt_sich
        verzieht_sich lichtet_sich verdichtet_sich dräut lastet hängt liegt
      '''),
      past: PredicateTense(
        words: words(r'''
          tobte wütete brauste peitschte prasselte rieselte nieselte tröpfelte wehte blies fegte
          legte_sich verzog_sich lichtete_sich verdichtete_sich dräute lastete hing lag
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.sport],
      words: words(r'läuft startet entscheidet_sich steigt verzögert_sich wogt'),
      past: PredicateTense(
        words: words(r'lief startete entschied_sich stieg verzögerte_sich wogte'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[
        WordTheme.object,
        WordTheme.tool,
        WordTheme.clothing,
        WordTheme.product,
        WordTheme.gem,
        WordTheme.vehicle,
      ],
      words: words(r'''
        schwankt glänzt fällt rollt neigt_sich altert schimmert wackelt rutscht kullert stoppt steht
        verschleißt verbiegt_sich verformt_sich flattert wippt erzittert taumelt ruckelt sackt
        pendelt baumelt
      '''),
      past: PredicateTense(
        words: words(r'''
          schwankte glänzte fiel rollte neigte_sich alterte schimmerte wackelte rutschte kullerte
          stoppte stand verschliss verbog_sich verformte_sich flatterte wippte erzitterte taumelte
          ruckelte sackte pendelte baumelte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'''
        rostet quietscht knarrt klappert rattert scheppert klirrt bricht zerbricht splittert reißt
        platzt klemmt hakt lockert_sich löst_sich zerfällt versagt qualmt poltert rumpelt
      '''),
      past: PredicateTense(
        words: words(r'''
          rostete quietschte knarrte klapperte ratterte schepperte klirrte brach zerbrach splitterte
          riss platzte klemmte hakte lockerte_sich löste_sich zerfiel versagte qualmte polterte
          rumpelte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing],
      subjectThemes: const <WordTheme>[WordTheme.music],
      words: words(r'''
        klingt erklingt ertönt hallt verhallt schallt dröhnt tönt erschallt widerhallt dudelt plärrt
        leiert klimpert perlt
      '''),
      past: PredicateTense(
        words: words(r'''
          klang erklang ertönte hallte verhallte schallte dröhnte tönte erschallte widerhallte
          dudelte plärrte leierte klimperte perlte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        fährt hält rollt wendet gleitet bremst beschleunigt parkt rangiert kurvt schlingert rast
        tuckert zuckelt hupt ankert kreuzt
      '''),
      past: PredicateTense(
        words: words(r'''
          fuhr hielt rollte wendete glitt bremste beschleunigte parkte rangierte kurvte schlingerte
          raste tuckerte zuckelte hupte ankerte kreuzte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        wächst verschwindet bleibt schwebt vertieft_sich verblasst verfliegt keimt wuchert erstarkt
        verstärkt_sich brennt lodert glimmt flackert schwelt gärt verfestigt_sich verankert_sich
        verwurzelt_sich hält wirkt wallt schwankt beruhigt_sich
      '''),
      past: PredicateTense(
        words: words(r'''
          wuchs verschwand blieb schwebte vertiefte_sich verblasste verflog keimte wucherte
          erstarkte verstärkte_sich brannte loderte glomm flackerte schwelte gärte verfestigte_sich
          verankerte_sich verwurzelte_sich hielt wirkte wallte schwankte beruhigte_sich
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        wächst welkt blüht schwankt sprießt keimt knospt verblüht verdorrt vertrocknet vergilbt
        ergrünt grünt rankt klettert wiegt_sich raschelt duftet fruchtet gedeiht wurzelt
        entlaubt_sich biegt_sich krümmt_sich
      '''),
      past: PredicateTense(
        words: words(r'''
          wuchs welkte blühte schwankte spross keimte knospte verblühte verdorrte vertrocknete
          vergilbte ergrünte grünte rankte kletterte wiegte_sich raschelte duftete fruchtete gedieh
          wurzelte entlaubte_sich bog_sich krümmte_sich
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        zittert bebt erstarrt heilt zuckt kribbelt pocht pulsiert schmerzt sticht juckt schwitzt
        friert erwärmt_sich kühlt verkrampft_sich verspannt_sich ermüdet erlahmt versteift_sich
        beugt_sich hebt_sich erschlafft prickelt schaudert bibbert zappelt
      '''),
      past: PredicateTense(
        words: words(r'''
          zitterte bebte erstarrte heilte zuckte kribbelte pochte pulsierte schmerzte stach juckte
          schwitzte fror erwärmte_sich kühlte verkrampfte_sich verspannte_sich ermüdete erlahmte
          versteifte_sich beugte_sich hob_sich erschlaffte prickelte schauderte bibberte zappelte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        reift kühlt kocht schmilzt verdirbt erkaltet dampft riecht schmeckt gerinnt verdunstet
        gefriert verdickt_sich klärt_sich köchelt siedet zischt
      '''),
      past: PredicateTense(
        words: words(r'''
          reifte kühlte kochte schmolz verdarb erkaltete dampfte roch schmeckte gerann verdunstete
          gefror verdickte_sich klärte_sich köchelte siedete zischte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        brutzelt bräunt verbrennt verkohlt zerbröselt verschimmelt säuert quillt gart zerläuft
        trieft krümelt bröckelt schrumpft schrumpelt
      '''),
      past: PredicateTense(
        words: words(r'''
          brutzelte bräunte verbrannte verkohlte zerbröselte verschimmelte säuerte quoll garte
          zerlief triefte krümelte bröckelte schrumpfte schrumpelte
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        sprudelt schäumt spritzt schwappt plätschert kräuselt_sich trübt_sich tropft rinnt gluckert
        blubbert moussiert
      '''),
      past: PredicateTense(
        words: words(r'''
          sprudelte schäumte spritzte schwappte plätscherte kräuselte_sich trübte_sich tropfte rann
          gluckerte blubberte moussierte
        '''),
      ),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'groß klein schnell langsam still laut mutig faul sanft klug wild'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'hungrig ausgehungert'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'satt gesättigt'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'müde schläfrig erschöpft'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'ausgeruht frisch munter'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'froh zufrieden glücklich heiter'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'gelangweilt neugierig unruhig rastlos'),
    ),
    StateGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'schön fremd neu häufig selten'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'weit eng ruhig tief dunkel hell fern steil'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'hart leicht schwer alt glatt klar stabil'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'süß salzig scharf sauer heiß kalt herzhaft'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'einfach deutlich vage ewig flüchtig'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'grün üppig duftend welk'),
    ),
    StateGroup(subject: const <NounClass>[NounClass.body], words: words(r'warm kalt wund steif')),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        mutig lebhaft sanft fleißig faul schüchtern klug jung alt klein groß still fröhlich geduldig
        flink neugierig
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'jung freundlich streng ernst beschäftigt aufrichtig'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'flink wild zahm rundlich winzig'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        süß scharf warm frisch knusprig würzig duftend heiß salzig weich reif lecker
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'süß warm kalt kühl heiß duftend frisch stark'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        alt neu klein groß leicht schwer glänzend glatt klar stabil hübsch kostbar uralt
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'schnell langsam robust'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        still weit dunkel hell fremd alt gemütlich abgelegen belebt leise fern nah leer einsam
        sonnig
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'grün üppig duftend jung welk klein zart frisch'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'vage alt neu fremd klar kostbar klein seltsam'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'lang kurz still sonnig trüb laut plötzlich'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'klein kalt warm schlank kräftig'),
    ),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'schön geheimnisvoll fremd neu'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        leise langsam schnell sanft plötzlich kaum allein kurz kühn sorgsam eifrig ruhig heftig
        geduldig leicht fröhlich munter schwerfällig gelassen emsig zügig vergnügt
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'''
        leise langsam sanft plötzlich kaum wieder noch stetig allmählich nach_und_nach schwach
        weiter
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      bei_Tagesanbruch am_frühen_Morgen am_Morgen am_Vormittag am_Mittag am_Nachmittag
      in_der_Dämmerung am_Abend in_der_Nacht spät_in_der_Nacht um_Mitternacht
    '''),
    any: words(r'''
      im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende an_Feiertagen den_ganzen_Tag
    '''),
    past: words(r'gestern letzte_Woche vor_langer_Zeit einst an_jenem_Tag in_jener_Nacht'),
    present: words(r'heute gerade_eben morgen nächste_Woche'),
    habitual: words(r'heutzutage manchmal jeden_Tag jede_Nacht'),
  ),
  homes: words(r'Haus'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'und'),
    ConnectiveKind.contrastive: words(r'aber doch'),
    ConnectiveKind.causal: words(r'denn'),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      Vogel Schwalbe Spatz Rabe Falke Adler Pfau Papagei Eule Taube Kranich Schwan Ente Gans Biene
      Libelle Zikade Fliege Mücke Fledermaus Reiher Pelikan Drache Phönix Fee Greif Pegasus Engel
      Walküre
    '''),
    NounTrait.swimmer: words(r'''
      Krokodil Schildkröte Frosch Kröte Fisch Wal Delfin Hai Krake Tintenfisch Garnele Krabbe
      Walross Robbe Pinguin Meerjungfrau Najade
    '''),
    NounTrait.crawler: words(r'''
      Krokodil Schlange Eidechse Schildkröte Schnecke Ameise Spinne Wurm Krabbe Basilisk
    '''),
    NounTrait.lifeless: words(r'''
      Zauber Fluch Weissagung Amulett Talisman Rune Pforte Heiligtum Götze Totem Vorzeichen Omen
      Bestiarium
    '''),
  },
  interjections: words(r'''
    oh, ach, na, mensch, oje, sieh_an, wahrhaftig, hui, herrje, du_meine_Güte, nanu,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.m: <String>['er'],
    WordGender.f: <String>['sie'],
    WordGender.n: <String>['es'],
  },
  calendar: SentenceCalendar(
    date: 'D. MMMM Y',
    months: words(r'''
      Januar Februar März April Mai Juni Juli August September Oktober November Dezember
    '''),
    clock: 'h:mm Uhr',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(
      subject: const <NounClass>[NounClass.event],
      words: <String>['ist'],
      past: PredicateTense(words: <String>['war']),
    ),
  ),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: 'am'),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: 'um'),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, head: 'am', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, head: 'um', copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 26),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 22),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'ist', pastHead: 'war'),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
    ], 16),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.time),
    ], 10),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.subject, modifiable: true),
      ],
      26,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.manner),
      ],
      20,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, head: 'ist', pastHead: 'war', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      18,
      mood: SentenceMood.question,
    ),
  ],
);
