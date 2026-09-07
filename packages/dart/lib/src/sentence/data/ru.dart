// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ru.
final SentenceLanguageData ru = SentenceLanguageData(
  space: ' ',
  capitalize: true,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['«', '»'],
    SentenceQuote.single: <String>['„', '“'],
  },
  predicateAgrees: true,
  pastAgreement: const <WordGender, List<List<String>>>{
    WordGender.f: <List<String>>[
      <String>['лся', 'лась'],
      <String>['л', 'ла'],
    ],
    WordGender.n: <List<String>>[
      <String>['лся', 'лось'],
      <String>['л', 'ло'],
    ],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        просыпается встаёт поднимается пробуждается вскакивает потягивается садится приподнимается
        выпрямляется подымается шевелится оживает встряхивается распрямляется разминается
      '''),
      past: PredicateTense(
        words: words(r'''
          проснулся встал поднялся пробудился вскочил потянулся садился приподнялся выпрямлялся
          подымался шевелился оживал встряхивался распрямлялся разминался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        направляется удаляется отправляется спешит уходит отходит выходит ускользает торопится
        ретируется отбывает убегает удирает трогается устремляется откланивается отлучается отбегает
        улепётывает стартует
      '''),
      past: PredicateTense(
        words: words(r'''
          направился удалился отправился поспешил уходил отходил выходил ускользнул поторопился
          ретировался отбыл убегал удирал трогался устремлялся откланивался отлучался отбегал
          улепётывал стартовал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        возвращается прибывает появляется приходит подходит приближается заходит входит объявляется
        показывается подбегает наведывается добирается подступает возникает заявляется подкатывает
        причаливает
      '''),
      past: PredicateTense(
        words: words(r'''
          вернулся прибыл появился приходил подходил приблизился заходил входил объявился показался
          подбегал наведывался добирался подступал возникал заявлялся подкатывал причаливал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'''
        бежит прыгает гуляет шагает ходит бегает скачет топает семенит ковыляет марширует трусит
        мчится носится вышагивает прогуливается галопирует хромает шествует слоняется бредёт топочет
        расхаживает переминается пританцовывает припускает рысит дефилирует плетётся
      '''),
      past: PredicateTense(
        words: words(r'''
          бежал прыгал гулял шагал ходил бегал скакал топал семенил ковылял маршировал трусил мчался
          носился вышагивал прогуливался галопировал хромал шествовал слонялся брёл топотал
          расхаживал переминался пританцовывал припускал рысил дефилировал плёлся
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        бродит проходит движется кружит кружится поворачивается отступает скользит проносится
        мелькает пробирается крадётся блуждает скитается перемещается колышется покачивается
        сдвигается продвигается отдаляется вертится ворочается снуёт петляет
      '''),
      past: PredicateTense(
        words: words(r'''
          бродил проходил двигался кружил кружился поворачивался отступал скользил проносился
          мелькал пробирался крался блуждал скитался перемещался колыхался покачивался сдвигался
          продвигался отдалялся вертелся ворочался сновал петлял
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'''
        плывёт плавает ныряет всплывает погружается барахтается плещется дрейфует подныривает
        выныривает окунается плещет
      '''),
      past: PredicateTense(
        words: words(r'''
          плыл плавал нырял всплывал погружался барахтался плескался дрейфовал подныривал выныривал
          окунался плескал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'''
        летит летает взлетает парит порхает садится приземляется взмывает пикирует улетает пролетает
        вспархивает реет планирует снижается взмахивает трепещет
      '''),
      past: PredicateTense(
        words: words(r'''
          летел летал взлетал парил порхал садился приземлялся взмывал пикировал улетал пролетал
          вспархивал реял планировал снижался взмахивал трепетал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'''
        ползёт ползает извивается закапывается выползает вползает пресмыкается заползает переползает
        копошится ёрзает вьётся
      '''),
      past: PredicateTense(
        words: words(r'''
          ползал ползал извивался закапывался выползал вползал пресмыкался заползал переползал
          копошился ёрзал вился
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        ждёт прячется оглядывается медлит останавливается слушает прислушивается затаивается
        замирает выжидает колеблется мешкает притаивается выглядывает озирается подглядывает
        притихает караулит дожидается топчется сомневается вслушивается укрывается таится
        настораживается
      '''),
      past: PredicateTense(
        words: words(r'''
          ждал прятался оглядывался медлил остановился слушал прислушивался затаился замирал выжидал
          колебался мешкал притаился выглядывал озирался подглядывал притихал караулил дожидался
          топтался сомневался вслушивался укрывался таился настораживался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        отдыхает сидит лежит прислоняется устраивается ложится располагается откидывается
        растягивается расслабляется присаживается нежится валяется полулежит покоится восседает
        передыхает разваливается жмётся сворачивается
      '''),
      past: PredicateTense(
        words: words(r'''
          отдыхал сидел лежал прислонился устроился ложился расположился откинулся растянулся
          расслабился присаживался нежился валялся полулежал покоился восседал передыхал
          разваливался жался сворачивался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        спит дремлет засыпает похрапывает храпит задрёмывает отсыпается посапывает дрыхнет сопит
        забывается придрёмывает
      '''),
      past: PredicateTense(
        words: words(r'''
          спал дремал заснул похрапывал храпел задремал отсыпался посапывал дрыхнул сопел забывался
          придрёмывал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'''
        смеётся улыбается напевает хихикает хохочет ухмыляется свистит ликует кивает подмигивает
        сияет усмехается мурлычет
      '''),
      past: PredicateTense(
        words: words(r'''
          смеялся улыбался напевал хихикал хохотал ухмылялся свистел ликовал кивал подмигивал сиял
          усмехался мурлыкал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'''
        плачет вздыхает бормочет всхлипывает рыдает стонет ворчит хмурится фыркает морщится хмыкает
        кряхтит охает ойкает дрожит вздрагивает ёжится бледнеет
      '''),
      past: PredicateTense(
        words: words(r'''
          плакал вздыхал бормотал всхлипывал рыдал стонал ворчал хмурился фыркал морщился хмыкал
          кряхтел охал ойкал дрожал вздрагивал ёжился бледнел
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'зевает жмурится потягивается моргает'),
      past: PredicateTense(words: words(r'зевал жмурился потягивался моргал')),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'сглатывает облизывается принюхивается причмокивает'),
      past: PredicateTense(words: words(r'сглатывал облизывался принюхивался причмокивал')),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        кричит восклицает ахает чихает икает краснеет визжит лепечет шмыгает пыхтит оглядывается
      '''),
      past: PredicateTense(
        words: words(r'''
          кричал восклицал ахал чихал икал краснел визжал лепетал шмыгал пыхтел оглядывался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        болтает беседует разговаривает говорит толкует сплетничает шепчется шушукается
        перешёптывается трещит тараторит здоровается общается переговаривается рассказывает
        балагурит рассуждает спорит объясняет шепчет бубнит приветствует перебивает откликается
      '''),
      past: PredicateTense(
        words: words(r'''
          болтал беседовал разговаривал говорил толковал сплетничал шептался шушукался
          перешёптывался трещал тараторил поздоровался общался переговаривался рассказывал балагурил
          рассуждал спорил объяснял шептал бубнил приветствовал перебивал откликался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        танцует поёт катается играет резвится подпрыгивает кувыркается веселится дурачится шалит
        забавляется вертится качается балуется пляшет развлекается озорничает проказничает
        попрыгивает гоняется
      '''),
      past: PredicateTense(
        words: words(r'''
          танцевал пел катался играл резвился подпрыгивал кувыркался веселился дурачился шалил
          забавлялся вертелся качался баловался плясал развлекался озорничал проказничал попрыгивал
          гонялся
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        ищет роется осматривается шарит рыщет копается принюхивается высматривает разыскивает
        вынюхивает исследует обшаривает прочёсывает изучает оглядывает нащупывает выискивает
        перебирает
      '''),
      past: PredicateTense(
        words: words(r'''
          искал рылся осматривался шарил рыскал копался принюхивался высматривал разыскивал
          вынюхивал исследовал обшаривал прочёсывал изучал оглядывал нащупывал выискивал перебирал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        успокаивается темнеет светлеет пустеет наполняется оживает просыпается засыпает затихает
        замолкает стихает шумит гудит кишит пустует заполняется сверкает блестит искрится замерзает
        оттаивает намокает высыхает озаряется меняется преображается оживляется теплеет холодеет
        сияет
      '''),
      past: PredicateTense(
        words: words(r'''
          успокоился потемнел посветлел опустел наполнился ожил просыпался засыпал затихал замолкал
          стихал шумел гудел кишел пустовал заполнился сверкал блестел искрился замерзал оттаял
          намокал высыхал озарился менялся преобразился оживился теплел холодел сиял
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        светится струится углубляется начинается заканчивается длится проходит продолжается тянется
        приближается наступает завершается прекращается повторяется затягивается разворачивается
        близится подходит спадает нарастает утихает
      '''),
      past: PredicateTense(
        words: words(r'''
          светился струился углубился начался закончился длился проходил продолжался тянулся
          приближался наступил завершился прекратился повторился затянулся разворачивался близился
          подходил спадал нарастал утихал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.time],
      words: words(r'угасает тает истекает сменяется догорает меркнет настаёт подкрадывается'),
      past: PredicateTense(
        words: words(r'угасал таял истекал сменился догорал меркнул настал подкрался'),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.weather],
      words: words(r'''
        надвигается налетает собирается разыгрывается бушует свирепствует рассеивается редеет
        сгущается крепчает усиливается ослабевает накрапывает моросит хлещет метёт дует льёт
      '''),
      past: PredicateTense(
        words: words(r'''
          надвигался налетел собирался разыгрался бушевал свирепствовал рассеялся редел сгущался
          крепчал усилился ослабел накрапывал моросил хлестал мёл дул лил
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.sport],
      words: words(r'''
        стартует возобновляется прерывается откладывается накаляется решается проводится играется
        открывается
      '''),
      past: PredicateTense(
        words: words(r'''
          стартовал возобновился прервался отложился накалился решился проводился игрался открылся
        '''),
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
        качается блестит падает катится клонится стареет сияет сверкает мерцает шатается
        опрокидывается валится соскальзывает скатывается вертится вращается крутится останавливается
        стоит висит покачивается тускнеет выцветает изнашивается пылится ветшает гнётся прогибается
        отскакивает вибрирует наклоняется оседает
      '''),
      past: PredicateTense(
        words: words(r'''
          качался блестел упал катился клонился старел сиял сверкал мерцал шатался опрокинулся
          валился соскользнул скатился вертелся вращался крутился остановился стоял висел
          покачивался тускнел выцветал изнашивался пылился ветшал гнулся прогибался отскочил
          вибрировал наклонялся оседал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'''
        ржавеет скрипит дребезжит грохочет лязгает звенит трескается ломается разбивается
        раскалывается рвётся лопается заедает застревает расшатывается отваливается разваливается
        дымит громыхает
      '''),
      past: PredicateTense(
        words: words(r'''
          ржавел скрипел дребезжал грохотал лязгал звенел треснул сломался разбился раскололся
          порвался лопнул заел застрял расшатался отвалился развалился дымил громыхал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing],
      subjectThemes: const <WordTheme>[WordTheme.music],
      words: words(r'''
        звучит раздаётся льётся разносится доносится гремит замолкает смолкает растекается
        переливается заливается играет слышится обрывается
      '''),
      past: PredicateTense(
        words: words(r'''
          звучал раздавался лился разносился доносился гремел замолкал смолкал растекался
          переливался заливался играл слышался оборвался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        едет останавливается проезжает возвращается отправляется скользит трогается тормозит
        разгоняется поворачивает сворачивает разворачивается паркуется подъезжает отъезжает въезжает
        выезжает уезжает отчаливает причаливает буксует заносится сигналит тащится петляет
      '''),
      past: PredicateTense(
        words: words(r'''
          ехал останавливался проезжал возвращался отправлялся скользил тронулся тормозил разгонялся
          повернул свернул развернулся припарковался подъехал отъехал въехал выехал уехал отчалил
          причалил буксовал заносился сигналил тащился петлял
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        расходится исчезает остаётся плывёт нарастает слабеет возникает укореняется копится
        накапливается вспыхивает теплится тлеет разгорается распространяется ширится улетучивается
        давит витает бледнеет
      '''),
      past: PredicateTense(
        words: words(r'''
          расходился исчезал остался плыл нарастал слабел возникал укоренился копился накапливался
          вспыхнул теплился тлел разгорался распространялся ширился улетучился давил витал бледнел
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        подрастает вянет расцветает качается тянется прорастает всходит пробивается зацветает
        распускается цветёт отцветает увядает засыхает желтеет зеленеет колышется шелестит стелется
        вьётся плодоносит благоухает никнет поникает опадает осыпается
      '''),
      past: PredicateTense(
        words: words(r'''
          подрастал вял расцветал качался тянулся прорастал всходил пробился зацвёл распустился цвёл
          отцвёл увял засыхал желтел зеленел колыхался шелестел стелился вился плодоносил благоухал
          никнул поникал опал осыпался
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        дрожит движется немеет твердеет вздрагивает дёргается подёргивается пульсирует бьётся ноет
        болит покалывает зудит чешется горит потеет согревается остывает напрягается сжимается
        разжимается коченеет затекает отекает опухает заживает восстанавливается устаёт сгибается
        разгибается опускается вытягивается шевелится ёрзает
      '''),
      past: PredicateTense(
        words: words(r'''
          дрожал двигался немел твердел вздрогнул дёрнулся подёргивался пульсировал бился ныл болел
          покалывал зудел чесался горел потел согревался остывал напрягался сжался разжался коченел
          затекал отекал опухал заживал восстанавливался устал сгибался разгибался опускался
          вытянулся шевелился ёрзал
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        зреет остывает кипит тает портится греется стынет дымится парит кончается убывает застывает
        густеет затвердевает размягчается прокисает скисает замерзает отстаивается настаивается
      '''),
      past: PredicateTense(
        words: words(r'''
          зрел остыл кипел растаял испортился грелся стыл дымился парил кончился убывал застыл
          густел затвердел размягчился прокисал скисал замерзал отстоялся настоялся
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        шипит шкворчит румянится подрумянивается поджаривается пригорает подгорает крошится
        черствеет отсыревает плесневеет поднимается пропекается запекается варится жарится
        разваливается разваривается тушится
      '''),
      past: PredicateTense(
        words: words(r'''
          шипел шкворчал румянился подрумянился поджарился пригорел подгорел крошился черствел
          отсырел плесневел поднимался пропекался запекался варился жарился разваливался разварился
          тушился
        '''),
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        пенится пузырится бурлит булькает выплёскивается проливается разливается мутнеет выдыхается
        испаряется капает взбалтывается расслаивается
      '''),
      past: PredicateTense(
        words: words(r'''
          пенился пузырился бурлил булькал выплеснулся пролился разлился мутнел выдыхался испарился
          капал взболтался расслоился
        '''),
      ),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        большой маленький быстрый медленный тихий шумный смелый ленивый дикий кроткий умный молодой
        старый сильный слабый дерзкий робкий гордый живой невозмутимый упрямый ловкий бдительный
        крепкий честный хитрый
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'голодный оголодавший ненасытный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'сытый пресыщенный сытенький'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'усталый сонный утомлённый измождённый вялый разбитый'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'бодрый свежий отдохнувший окрепший лёгкий энергичный'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'''
        довольный счастливый радостный спокойный весёлый умиротворённый ликующий безмятежный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'''
        скучающий любопытный беспокойный тревожный нетерпеливый взволнованный томящийся смятенный
      '''),
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
      words: words(r'''
        красивый странный новый редкий милый знакомый необычный обычный великолепный драгоценный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        широкий узкий спокойный глубокий тёмный светлый далёкий крутой людный пустынный тесный
        пустой огромный сумрачный ровный долгий короткий солнечный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный круглый плоский острый тонкий
        толстый хрупкий пышный простой искусный шершавый блестящий
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        сладкий солёный острый кислый горячий холодный горький густой мягкий тёплый сочный хрустящий
        вкусный пресный
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        простой ясный смутный вечный мимолётный сложный глубокий знакомый ценный тайный ничтожный
        трудный лёгкий
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        зелёный пышный душистый увядший высокий нежный тонкий цветущий раскидистый густой
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        тёплый холодный больной жёсткий мягкий шершавый гладкий бледный сильный онемевший тяжёлый
      '''),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        смелый живой добрый занятой ленивый робкий умный молодой старый маленький большой тихий
        весёлый терпеливый ловкий любопытный дерзкий пугливый осторожный упрямый кроткий шумный
        крепкий худой сонный хитрый бдительный молчаливый гордый простодушный честный бодрый
        невозмутимый
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'''
        молодой добрый строгий серьёзный занятой честный мудрый скромный вежливый умелый известный
        бедный богатый пожилой приветливый проницательный радушный работящий
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'''
        быстрый свирепый ручной пухлый крохотный лохматый пятнистый полосатый тощий огромный
        проворный кругленький лоснящийся вытянутый
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        сладкий острый тёплый свежий хрустящий вкусный душистый горячий солёный мягкий спелый сытный
        золотистый копчёный сливочный нежный сочный дымящийся поджаристый липкий пресный пряный
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        сладкий тёплый холодный прохладный горячий душистый свежий крепкий горький сливочный ледяной
        молочный мутный прозрачный игристый мягкий тепловатый
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        старый новый маленький большой лёгкий тяжёлый блестящий гладкий прозрачный твёрдый красивый
        ценный древний ржавый потёртый начищенный простой пышный узкий широкий круглый плоский
        острый тупой хрупкий полый пыльный кривой
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        быстрый медленный крепкий скрипучий сверкающий ржавый расхлябанный громоздкий шумный
        новёхонький
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        тихий широкий тёмный светлый чужой старый уютный укромный людный безмолвный далёкий близкий
        пустой одинокий солнечный тесный многолюдный ветреный туманный тенистый пыльный сырой
        каменистый крутой ровный заброшенный зелёный безлюдный просторный
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        зелёный пышный душистый молодой увядший высокий маленький нежный свежий колючий цветущий
        распускающийся вьющийся дикий стройный бледный поникший густой
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        смутный старый новый чужой ясный ценный маленький странный блёклый простой запутанный
        упорный мимолётный далёкий дерзкий тайный тихий знакомый
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        долгий короткий тихий солнечный пасмурный шумный внезапный торжественный весёлый скучный
        дождливый бурный спокойный людный оживлённый пышный скромный
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        маленький холодный тёплый тонкий крепкий мягкий жёсткий больной шершавый гладкий бледный
        сильный
      '''),
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
      words: words(r'''
        красивый таинственный чужой новый милый знакомый необычный обычный великолепный скромный
      '''),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        тихо медленно быстро мягко вдруг едва одиноко ненадолго ровно смело осторожно жадно спокойно
        весело терпеливо легко чётко бодро лениво упрямо охотно шумно неспешно украдкой на_цыпочках
        торопливо поспешно бережно внимательно рассеянно нервно с_любопытством гордо застенчиво
        приветливо нежно горько строго сонно небрежно резко умело решительно счастливо грустно
        тяжело оживлённо с_трудом нехотя нарочно молча одним_прыжком без_спешки с_удовольствием
        вполголоса без_устали
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
        тихо медленно мягко вдруг едва снова ещё мерно постепенно слабо понемногу всё_ещё чуть
        бесшумно слегка сильно живо глубоко широко смутно тепло холодно сладко густо крепко тяжело
        легко бесконечно непрерывно постоянно ещё_раз некоторое_время разом повсюду
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      на_рассвете ранним_утром утром до_полудня в_полдень днём после_полудня в_сумерках вечером
      ночью поздней_ночью в_полночь
    '''),
    any: words(r'''
      весной летом осенью зимой в_выходные в_праздники весь_день ранней_весной поздней_весной
      в_начале_лета в_разгар_лета в_конце_лета в_начале_осени поздней_осенью в_разгар_зимы
      в_конце_зимы в_сезон_дождей в_пору_жатвы на_празднике в_базарный_день в_полнолуние
      в_дождливый_день в_снежный_день в_ветреный_день в_ясный_день в_пасмурный_день в_туманный_день
      на_каникулах
    '''),
    past: words(r'''
      вчера на_прошлой_неделе давно однажды в_тот_день в_ту_ночь позавчера в_прошлом_месяце
      в_прошлом_году годы_назад некоторое_время_назад в_то_утро в_тот_вечер тогда в_те_дни
      неделей_раньше прошлой_весной прошлым_летом прошлой_осенью прошлой_зимой несколько_дней_назад
    '''),
    present: words(r'''
      сегодня только_что завтра на_следующей_неделе сейчас сегодня_утром сегодня_вечером
      сегодня_ночью послезавтра в_следующем_месяце в_следующем_году в_этом_году на_этой_неделе
      в_эти_выходные вот_вот скоро
    '''),
    habitual: words(r'''
      нынче иногда каждый_день каждую_ночь всегда часто обычно редко изредка время_от_времени
      каждое_утро каждую_неделю каждый_год как_правило почти_всегда
    '''),
  ),
  homes: words(r'дом'),
  join: const SentenceJoin(word: 'и'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'и_потом кроме_того также ещё_и притом сверх_того'),
    ConnectiveKind.temporal: words(r'''
      затем наконец потом тем_временем вскоре немного_погодя чуть_позже тут_же в_тот_миг
      спустя_время
    '''),
    ConnectiveKind.contrastive: words(
      r'но однако а зато всё_же напротив тем_не_менее впрочем и_всё_таки',
    ),
    ConnectiveKind.causal: words(
      r'поэтому в_итоге значит следовательно оттого стало_быть по_этой_причине',
    ),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      птица ласточка воробей ворон сокол орёл павлин попугай сова голубь журавль лебедь утка гусь
      бабочка пчела стрекоза цикада муха комар летучая_мышь цапля пеликан дракон феникс фея грифон
      пегас ангел валькирия дрозд соловей жаворонок перепел фазан куропатка колибри тукан фламинго
      аист удод щегол сорока сойка сыч канюк чайка дятел скворец крапивник оса моль светляк шмель
      коровка
    '''),
    NounTrait.swimmer: words(r'''
      крокодил черепаха лягушка жаба рыба кит дельфин акула осьминог кальмар креветка краб морж
      тюлень пингвин русалка кракен наяда угорь сардина тунец треска хек форель лосось карп скат
      медуза мидия устрица омар окунь щука саламандра тритон бобр бегемот утконос
    '''),
    NounTrait.crawler: words(r'''
      крокодил змея ящерица черепаха улитка муравей паук червь краб василиск игуана хамелеон
      саламандра тритон удав гадюка кобра питон жук кузнечик сверчок блоха гусеница сколопендра
      скорпион
    '''),
    NounTrait.lifeless: words(r'''
      заклинание проклятие пророчество амулет талисман руна портал святилище идол тотем примета
      бестиарий ворожба гримуар пентакль реликвия грааль посох жезл скипетр венец
    '''),
  },
  interjections: words(r'''
    ах, ох, эх, ух, боже, гляди, право, ой, ух_ты, батюшки, надо_же, эй, ага, ого, увы, ну, вот_так,
    батюшки_светы, силы_небесные, вот_те_на, гляди_ка, поди_ж_ты, ишь,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.m: <String>['он'],
    WordGender.f: <String>['она'],
    WordGender.n: <String>['оно'],
  },
  objectPronouns: const SentenceObjectPronouns(
    words: <WordGender, WordPool>{
      WordGender.m: <String>['его'],
      WordGender.f: <String>['её'],
      WordGender.n: <String>['его'],
    },
  ),
  replies: <SentenceStyle, Map<ReplyCue, WordPool>>{
    SentenceStyle.casual: <ReplyCue, WordPool>{
      ReplyCue.agree: words(r'''
        точно да верно я_тоже так_и_есть конечно именно ещё_бы вот_именно и_не_говори
        что_правда,_то_правда
      '''),
      ReplyCue.cheer: words(r'''
        как_здорово! молодец! отлично! везёт_тебе здорово! поздравляю какая_радость! чудесно!
        наконец-то! вот_это_да!
      '''),
      ReplyCue.care: words(r'''
        ты_в_порядке? отдохни_немного не_перенапрягайся давай_поедим тяжело,_наверное не_торопись
        не_волнуйся осторожно не_унывай присядь_на_минутку попей_воды я_помогу
      '''),
      ReplyCue.wonder: words(r'''
        правда? серьёзно? где? когда? и_что_потом? не_может_быть! как? почему? вот_как? а_дальше?
        что_случилось? что?
      '''),
      ReplyCue.answer: words(r'''
        да,_немного нет,_всё_хорошо да,_очень так_себе нет,_ещё_нет да,_ужасно чуть-чуть не_очень
        да,_страшно нет,_совсем_нет более-менее да,_честно_говоря
      '''),
    },
  },
  listener: const SentenceSpeech(subject: 'ты'),
  degrees: words(r'очень довольно слишком весьма немного совсем крайне чрезвычайно ужасно слегка'),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 26),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, pastHead: 'был'),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.degree),
      SentencePart(SentenceSlot.state, pastHead: 'был'),
    ], 9),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 16),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, pastHead: 'был'),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 10),
  ],
);
