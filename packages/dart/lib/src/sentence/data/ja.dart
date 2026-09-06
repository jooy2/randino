// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ja.
final SentenceLanguageData ja = SentenceLanguageData(
  space: '',
  capitalize: false,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '。',
    SentenceType.question: '？',
    SentenceType.exclamation: '！',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['「', '」'],
    SentenceQuote.single: <String>['『', '』'],
  },
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'起きる 目覚める 立ち上がる 起き上がる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'起きます 目覚めます 立ち上がります 起き上がります'),
        PredicateForm.linking: words(r'起きて 目覚めて 立ち上がって 起き上がって'),
      },
      past: PredicateTense(
        words: words(r'起きた 目覚めた 立ち上がった 起き上がった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'起きました 目覚めました 立ち上がりました 起き上がりました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'行く 向かう 出かける'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'行きます 向かいます 出かけます'),
        PredicateForm.linking: words(r'行って 向かって 出かけて'),
      },
      past: PredicateTense(
        words: words(r'行った 向かった 出かけた'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'行きました 向かいました 出かけました')},
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'駆けていく 上る 下りる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'駆けていきます 上ります 下ります'),
        PredicateForm.linking: words(r'駆けていって 上って 下りて'),
      },
      past: PredicateTense(
        words: words(r'駆けていった 上った 下りた'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'駆けていきました 上りました 下りました')},
      ),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'去る 出発する 出ていく'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'去ります 出発します 出ていきます'),
        PredicateForm.linking: words(r'去って 出発して 出ていって'),
      },
      past: PredicateTense(
        words: words(r'去った 出発した 出ていった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'去りました 出発しました 出ていきました')},
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'着く 到着する 入る たどり着く 帰り着く'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'着きます 到着します 入ります たどり着きます 帰り着きます'),
        PredicateForm.linking: words(r'着いて 到着して 入って たどり着いて 帰り着いて'),
      },
      past: PredicateTense(
        words: words(r'着いた 到着した 入った たどり着いた 帰り着いた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'着きました 到着しました 入りました たどり着きました 帰り着きました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'帰る 戻る 帰宅する'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'帰ります 戻ります 帰宅します'),
        PredicateForm.linking: words(r'帰って 戻って 帰宅して'),
      },
      past: PredicateTense(
        words: words(r'帰った 戻った 帰宅した'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'帰りました 戻りました 帰宅しました')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'走る 歩く 跳ぶ 駆け回る 散歩する'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'走ります 歩きます 跳びます 駆け回ります 散歩します'),
        PredicateForm.linking: words(r'走って 歩いて 跳んで 駆け回って 散歩して'),
      },
      past: PredicateTense(
        words: words(r'走った 歩いた 跳んだ 駆け回った 散歩した'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'走りました 歩きました 跳びました 駆け回りました 散歩しました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'さまよう 通る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'さまよいます 通ります'),
        PredicateForm.linking: words(r'さまよって 通って'),
      },
      past: PredicateTense(
        words: words(r'さまよった 通った'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'さまよいました 通りました')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'泳ぐ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'泳ぎます'),
        PredicateForm.linking: words(r'泳いで'),
      },
      past: PredicateTense(
        words: words(r'泳いだ'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'泳ぎました')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'飛ぶ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'飛びます'),
        PredicateForm.linking: words(r'飛んで'),
      },
      past: PredicateTense(
        words: words(r'飛んだ'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'飛びました')},
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'這う'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'這います'),
        PredicateForm.linking: words(r'這って'),
      },
      past: PredicateTense(
        words: words(r'這った'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'這いました')},
      ),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'待つ 隠れる 見回す ためらう 立ち止まる うろうろする'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'待ちます 隠れます 見回します ためらいます 立ち止まります うろうろします'),
        PredicateForm.linking: words(r'待って 隠れて 見回して ためらって 立ち止まって うろうろして'),
      },
      past: PredicateTense(
        words: words(r'待った 隠れた 見回した ためらった 立ち止まった うろうろした'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'待ちました 隠れました 見回しました ためらいました 立ち止まりました うろうろしました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'休む 座る 寝転ぶ もたれる うずくまる 横になる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'休みます 座ります 寝転びます もたれます うずくまります 横になります'),
        PredicateForm.linking: words(r'休んで 座って 寝転んで もたれて うずくまって 横になって'),
      },
      past: PredicateTense(
        words: words(r'休んだ 座った 寝転んだ もたれた うずくまった 横になった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'休みました 座りました 寝転びました もたれました うずくまりました 横になりました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'眠る 寝る 眠り込む うたた寝する'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'眠ります 寝ます 眠り込みます うたた寝します'),
        PredicateForm.linking: words(r'眠って 寝て 眠り込んで うたた寝して'),
      },
      past: PredicateTense(
        words: words(r'眠った 寝た 眠り込んだ うたた寝した'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'眠りました 寝ました 眠り込みました うたた寝しました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'笑う 泣く あくびする 微笑む つぶやく 叫ぶ ため息をつく'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'笑います 泣きます あくびします 微笑みます つぶやきます 叫びます ため息をつきます'),
        PredicateForm.linking: words(r'笑って 泣いて あくびして 微笑んで つぶやいて 叫んで ため息をついて'),
      },
      past: PredicateTense(
        words: words(r'笑った 泣いた あくびした 微笑んだ つぶやいた 叫んだ ため息をついた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'笑いました 泣きました あくびしました 微笑みました つぶやきました 叫びました ため息をつきました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'話す おしゃべりする 語り合う'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'話します おしゃべりします 語り合います'),
        PredicateForm.linking: words(r'話して おしゃべりして 語り合って'),
      },
      past: PredicateTense(
        words: words(r'話した おしゃべりした 語り合った'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'話しました おしゃべりしました 語り合いました')},
      ),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'踊る 歌う 転がる 遊ぶ はねる 跳ね回る じゃれる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'踊ります 歌います 転がります 遊びます はねます 跳ね回ります じゃれます'),
        PredicateForm.linking: words(r'踊って 歌って 転がって 遊んで はねて 跳ね回って じゃれて'),
      },
      past: PredicateTense(
        words: words(r'踊った 歌った 転がった 遊んだ はねた 跳ね回った じゃれた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'踊りました 歌いました 転がりました 遊びました はねました 跳ね回りました じゃれました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'覚える 忘れる 想像する 数える 思い出す 懐かしむ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'覚えます 忘れます 想像します 数えます 思い出します 懐かしみます'),
        PredicateForm.linking: words(r'覚えて 忘れて 想像して 数えて 思い出して 懐かしんで'),
      },
      past: PredicateTense(
        words: words(r'覚えた 忘れた 想像した 数えた 思い出した 懐かしんだ'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'覚えました 忘れました 想像しました 数えました 思い出しました 懐かしみました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'見る 見つめる 眺める 調べる 触る なでる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'見ます 見つめます 眺めます 調べます 触ります なでます'),
        PredicateForm.linking: words(r'見て 見つめて 眺めて 調べて 触って なでて'),
      },
      past: PredicateTense(
        words: words(r'見た 見つめた 眺めた 調べた 触った なでた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'見ました 見つめました 眺めました 調べました 触りました なでました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'探し回る 探す うろつく 見て回る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'探し回ります 探します うろつきます 見て回ります'),
        PredicateForm.linking: words(r'探し回って 探して うろついて 見て回って'),
      },
      past: PredicateTense(
        words: words(r'探し回った 探した うろついた 見て回った'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'探し回りました 探しました うろつきました 見て回りました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'見つける 発見する 拾う 見いだす'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'見つけます 発見します 拾います 見いだします'),
        PredicateForm.linking: words(r'見つけて 発見して 拾って 見いだして'),
      },
      past: PredicateTense(
        words: words(r'見つけた 発見した 拾った 見いだした'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'見つけました 発見しました 拾いました 見いだしました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'選ぶ 取る つかむ 手に取る 受け取る 取り出す'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'選びます 取ります つかみます 手に取ります 受け取ります 取り出します'),
        PredicateForm.linking: words(r'選んで 取って つかんで 手に取って 受け取って 取り出して'),
      },
      past: PredicateTense(
        words: words(r'選んだ 取った つかんだ 手に取った 受け取った 取り出した'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'選びました 取りました つかみました 手に取りました 受け取りました 取り出しました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'運ぶ 持ち帰る 抱える 持ってくる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'運びます 持ち帰ります 抱えます 持ってきます'),
        PredicateForm.linking: words(r'運んで 持ち帰って 抱えて 持ってきて'),
      },
      past: PredicateTense(
        words: words(r'運んだ 持ち帰った 抱えた 持ってきた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'運びました 持ち帰りました 抱えました 持ってきました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'隠す しまう 守る 埋める 取っておく'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'隠します しまいます 守ります 埋めます 取っておきます'),
        PredicateForm.linking: words(r'隠して しまって 守って 埋めて 取っておいて'),
      },
      past: PredicateTense(
        words: words(r'隠した しまった 守った 埋めた 取っておいた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'隠しました しまいました 守りました 埋めました 取っておきました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.lose,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'なくす 落とす'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'なくします 落とします'),
        PredicateForm.linking: words(r'なくして 落として'),
      },
      past: PredicateTense(
        words: words(r'なくした 落とした'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'なくしました 落としました')},
      ),
    ),
    VerbGroup(
      field: VerbField.meet,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.person],
      words: words(r'訪ねる 見かける 迎える'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'訪ねます 見かけます 迎えます'),
        PredicateForm.linking: words(r'訪ねて 見かけて 迎えて'),
      },
      past: PredicateTense(
        words: words(r'訪ねた 見かけた 迎えた'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'訪ねました 見かけました 迎えました')},
      ),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'作る 建てる 描く 編む 組み立てる 削る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'作ります 建てます 描きます 編みます 組み立てます 削ります'),
        PredicateForm.linking: words(r'作って 建てて 描いて 編んで 組み立てて 削って'),
      },
      past: PredicateTense(
        words: words(r'作った 建てた 描いた 編んだ 組み立てた 削った'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'作りました 建てました 描きました 編みました 組み立てました 削りました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'直す 磨く 手入れする 整える 片付ける 修理する'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'直します 磨きます 手入れします 整えます 片付けます 修理します'),
        PredicateForm.linking: words(r'直して 磨いて 手入れして 整えて 片付けて 修理して'),
      },
      past: PredicateTense(
        words: words(r'直した 磨いた 手入れした 整えた 片付けた 修理した'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'直しました 磨きました 手入れしました 整えました 片付けました 修理しました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'売る 手渡す 譲る 並べる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'売ります 手渡します 譲ります 並べます'),
        PredicateForm.linking: words(r'売って 手渡して 譲って 並べて'),
      },
      past: PredicateTense(
        words: words(r'売った 手渡した 譲った 並べた'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'売りました 手渡しました 譲りました 並べました')},
      ),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'買う 買い求める 手に入れる 仕入れる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'買います 買い求めます 手に入れます 仕入れます'),
        PredicateForm.linking: words(r'買って 買い求めて 手に入れて 仕入れて'),
      },
      past: PredicateTense(
        words: words(r'買った 買い求めた 手に入れた 仕入れた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'買いました 買い求めました 手に入れました 仕入れました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'焼く 温める 煮る 料理する 切る 盛る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'焼きます 温めます 煮ます 料理します 切ります 盛ります'),
        PredicateForm.linking: words(r'焼いて 温めて 煮て 料理して 切って 盛って'),
      },
      past: PredicateTense(
        words: words(r'焼いた 温めた 煮た 料理した 切った 盛った'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'焼きました 温めました 煮ました 料理しました 切りました 盛りました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'食べる 噛む 味わう かじる 平らげる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'食べます 噛みます 味わいます かじります 平らげます'),
        PredicateForm.linking: words(r'食べて 噛んで 味わって かじって 平らげて'),
      },
      past: PredicateTense(
        words: words(r'食べた 噛んだ 味わった かじった 平らげた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'食べました 噛みました 味わいました かじりました 平らげました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'飲む すする 飲み干す 口にする'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'飲みます すすります 飲み干します 口にします'),
        PredicateForm.linking: words(r'飲んで すすって 飲み干して 口にして'),
      },
      past: PredicateTense(
        words: words(r'飲んだ すすった 飲み干した 口にした'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'飲みました すすりました 飲み干しました 口にしました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'静まる 暗くなる 明ける 賑わう 色づく 明るくなる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'静まります 暗くなります 明けます 賑わいます 色づきます 明るくなります'),
        PredicateForm.linking: words(r'静まって 暗くなって 明けて 賑わって 色づいて 明るくなって'),
      },
      past: PredicateTense(
        words: words(r'静まった 暗くなった 明けた 賑わった 色づいた 明るくなった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'静まりました 暗くなりました 明けました 賑わいました 色づきました 明るくなりました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'光る 流れる 暮れる 深まる 始まる 終わる 続く'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'光ります 流れます 暮れます 深まります 始まります 終わります 続きます'),
        PredicateForm.linking: words(r'光って 流れて 暮れて 深まって 始まって 終わって 続いて'),
      },
      past: PredicateTense(
        words: words(r'光った 流れた 暮れた 深まった 始まった 終わった 続いた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'光りました 流れました 暮れました 深まりました 始まりました 終わりました 続きました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'揺れる 輝く 落ちる 転がる 傾く 古びる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'揺れます 輝きます 落ちます 転がります 傾きます 古びます'),
        PredicateForm.linking: words(r'揺れて 輝いて 落ちて 転がって 傾いて 古びて'),
      },
      past: PredicateTense(
        words: words(r'揺れた 輝いた 落ちた 転がった 傾いた 古びた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'揺れました 輝きました 落ちました 転がりました 傾きました 古びました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'走る 止まる 通る 戻る 出発する 滑る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'走ります 止まります 通ります 戻ります 出発します 滑ります'),
        PredicateForm.linking: words(r'走って 止まって 通って 戻って 出発して 滑って'),
      },
      past: PredicateTense(
        words: words(r'走った 止まった 通った 戻った 出発した 滑った'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'走りました 止まりました 通りました 戻りました 出発しました 滑りました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'広がる 消える 残る 漂う 深まる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'広がります 消えます 残ります 漂います 深まります'),
        PredicateForm.linking: words(r'広がって 消えて 残って 漂って 深まって'),
      },
      past: PredicateTense(
        words: words(r'広がった 消えた 残った 漂った 深まった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'広がりました 消えました 残りました 漂いました 深まりました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'育つ 枯れる 咲く 揺れる 伸びる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'育ちます 枯れます 咲きます 揺れます 伸びます'),
        PredicateForm.linking: words(r'育って 枯れて 咲いて 揺れて 伸びて'),
      },
      past: PredicateTense(
        words: words(r'育った 枯れた 咲いた 揺れた 伸びた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'育ちました 枯れました 咲きました 揺れました 伸びました'),
        },
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'震える 動く 痺れる 固まる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'震えます 動きます 痺れます 固まります'),
        PredicateForm.linking: words(r'震えて 動いて 痺れて 固まって'),
      },
      past: PredicateTense(
        words: words(r'震えた 動いた 痺れた 固まった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'震えました 動きました 痺れました 固まりました')},
      ),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'熟れる 冷める 煮える 溶ける 傷む'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'熟れます 冷めます 煮えます 溶けます 傷みます'),
        PredicateForm.linking: words(r'熟れて 冷めて 煮えて 溶けて 傷んで'),
      },
      past: PredicateTense(
        words: words(r'熟れた 冷めた 煮えた 溶けた 傷んだ'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'熟れました 冷めました 煮えました 溶けました 傷みました'),
        },
      ),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 賢い 優しい 荒々しい'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'大きいです 小さいです 速いです 遅いです 静かです うるさいです 勇敢です 元気です 賢いです 優しいです 荒々しいです',
        ),
      },
      past: PredicateTense(
        words: words(r'大きかった 小さかった 速かった 遅かった 静かだった うるさかった 勇敢だった 元気だった 賢かった 優しかった 荒々しかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            大きかったです 小さかったです 速かったです 遅かったです 静かでした うるさかったです 勇敢でした 元気でした 賢かったです 優しかったです 荒々しかったです
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'空腹だ ひもじい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'空腹です ひもじいです')},
      past: PredicateTense(
        words: words(r'空腹だった ひもじかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'空腹でした ひもじかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'満腹だ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'満腹です')},
      past: PredicateTense(
        words: words(r'満腹だった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'満腹でした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'眠い くたくただ だるい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'眠いです くたくたです だるいです')},
      past: PredicateTense(
        words: words(r'眠かった くたくただった だるかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'眠かったです くたくたでした だるかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'爽やかだ 元気いっぱいだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'爽やかです 元気いっぱいです')},
      past: PredicateTense(
        words: words(r'爽やかだった 元気いっぱいだった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'爽やかでした 元気いっぱいでした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'嬉しい 楽しい 満足だ 幸せだ 穏やかだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'嬉しいです 楽しいです 満足です 幸せです 穏やかです')},
      past: PredicateTense(
        words: words(r'嬉しかった 楽しかった 満足だった 幸せだった 穏やかだった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'嬉しかったです 楽しかったです 満足でした 幸せでした 穏やかでした'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'退屈だ もどかしい 不安だ 気がかりだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'退屈です もどかしいです 不安です 気がかりです')},
      past: PredicateTense(
        words: words(r'退屈だった もどかしかった 不安だった 気がかりだった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'退屈でした もどかしかったです 不安でした 気がかりでした'),
        },
      ),
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
      words: words(r'美しい 珍しい 新しい 見慣れない'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'美しいです 珍しいです 新しいです 見慣れないです')},
      past: PredicateTense(
        words: words(r'美しかった 珍しかった 新しかった 見慣れなかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'美しかったです 珍しかったです 新しかったです 見慣れなかったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'広いです 狭いです 静かです 深いです 暗いです 明るいです 遠いです 険しいです'),
      },
      past: PredicateTense(
        words: words(r'広かった 狭かった 静かだった 深かった 暗かった 明るかった 遠かった 険しかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'広かったです 狭かったです 静かでした 深かったです 暗かったです 明るかったです 遠かったです 険しかったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'硬いです 軽いです 重いです 古いです 滑らかです 透明です 丈夫です'),
      },
      past: PredicateTense(
        words: words(r'硬かった 軽かった 重かった 古かった 滑らかだった 透明だった 丈夫だった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'硬かったです 軽かったです 重かったです 古かったです 滑らかでした 透明でした 丈夫でした'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'甘いです しょっぱいです 辛いです 酸っぱいです 熱いです 冷たいです 香ばしいです'),
      },
      past: PredicateTense(
        words: words(r'甘かった しょっぱかった 辛かった 酸っぱかった 熱かった 冷たかった 香ばしかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'甘かったです しょっぱかったです 辛かったです 酸っぱかったです 熱かったです 冷たかったです 香ばしかったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'難しい 易しい 明らかだ 曖昧だ 永遠だ はかない'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'難しいです 易しいです 明らかです 曖昧です 永遠です はかないです'),
      },
      past: PredicateTense(
        words: words(r'難しかった 易しかった 明らかだった 曖昧だった 永遠だった はかなかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'難しかったです 易しかったです 明らかでした 曖昧でした 永遠でした はかなかったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'青い 香しい 瑞々しい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'青いです 香しいです 瑞々しいです')},
      past: PredicateTense(
        words: words(r'青かった 香しかった 瑞々しかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'青かったです 香しかったです 瑞々しかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'温かい 冷たい 痛い 硬い'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'温かいです 冷たいです 痛いです 硬いです')},
      past: PredicateTense(
        words: words(r'温かかった 冷たかった 痛かった 硬かった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'温かかったです 冷たかったです 痛かったです 硬かったです'),
        },
      ),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        勇敢な 元気な 優しい 働き者の 怠け者の 恥ずかしがりの 賢い 若い 年老いた 小さな 大きな 静かな 陽気な のんびりした 素早い 好奇心旺盛な
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'若い 親切な 厳しい 真面目な 忙しい 誠実な'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'素早い 荒々しい 大人しい 小柄な 丸々した'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'甘い 辛い 温かい 新鮮な 香ばしい 熱い しょっぱい 柔らかい みずみずしい 熟れた おいしそうな'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'甘い 温かい 冷たい 熱い 香り高い 新鮮な 濃い 苦い'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'古い 新しい 小さな 大きな 軽い 重い きらめく 滑らかな 透明な 硬い 美しい 大切な 古びた'),
    ),
    ModifierGroup(subject: const <NounClass>[NounClass.vehicle], words: words(r'速い 遅い 頑丈な')),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'静かな 広い 暗い 明るい 見知らぬ 古い 心地よい ひっそりした 賑やかな 遠い 近い 空っぽの 寂しい 日当たりのよい'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'青い 茂った 香しい 若い 枯れた 大きな 小さな 瑞々しい'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'かすかな 古い 新しい 見知らぬ 明らかな 大切な 小さな 奇妙な 曖昧な'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'長い 短い 静かな 晴れた 曇った 騒がしい 突然の'),
    ),
    ModifierGroup(subject: const <NounClass>[NounClass.body], words: words(r'小さな 冷たい 温かい 細い 丈夫な')),
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
      words: words(r'美しい 不思議な 見知らぬ 新しい'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        静かに ゆっくり 速く じっと そっと ひとりで しばらく 急に 慎重に 力強く 素早く 黙って 軽やかに 丁寧に 懸命に のんびり ぼんやり しっかり さらりと ひっそり 悠々と
        きちんと 朗らかに 元気よく こっそり
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
      words: words(r'静かに ゆっくり 次第に ふと また ずっと しばらく 急に いつも まだ そっと じっと 少しずつ 徐々に だんだん ひっそり'),
    ),
  ],
  times: SentenceTimes(
    day: words(r'夜明けに 早朝に 朝に 昼前に 昼に 午後に 夕暮れに 夕方に 夜に 深夜に 真夜中に'),
    any: words(r'春に 夏に 秋に 冬に 週末に 休日に 一日中 元日に'),
    past: words(r'昨日 先週 昔 かつて その日 その夜'),
    present: words(r'今日 さっき 明日 来週'),
    habitual: words(r'近頃 時々 毎日 毎晩'),
  ),
  homes: words(r'家'),
  join: const SentenceJoin(form: PredicateForm.linking),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'そして また しかも ところで'),
    ConnectiveKind.temporal: words(r'やがて すぐに ついに 一方 その後 しばらくして'),
    ConnectiveKind.contrastive: words(r'しかし ところが けれども それでも'),
    ConnectiveKind.causal: words(r'だから そこで それで'),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      フクロウ スズメ カササギ ツバメ ワシ ハヤブサ ツル ハクチョウ カモ キツツキ インコ クジャク チョウ ガ ハチ トンボ テントウムシ コウモリ サギ ペリカン カラス ウグイス
      カワセミ カブトムシ ホタル 犬鷲 蝉 蜉蝣 黄金虫 鍬形虫 蛍火 蠅 蚊 蛾 竜 鳳凰 天狗 妖精 精霊 天使 ドラゴン グリフォン 不死鳥 黒竜 白竜 青竜 朱雀 八咫烏 蛟竜 鳥女
      天馬 小悪魔 小妖精 戦乙女 石像鬼
    '''),
    NounTrait.swimmer: words(r'''
      クジラ イルカ サメ カメ アザラシ ペンギン カエル タコ イカ ヒトデ カニ エビ コイ サケ ワニ クラゲ 御玉杓子 蟇 雨蛙 鰐 鮒 鯰 雷魚 桂魚 目高 泥鰌 鰻 穴子 太刀魚
      鰆 秋刀魚 片口鰯 石持 介党鱈 人魚 海妖 巨烏賊 海獣王 河童
    '''),
    NounTrait.crawler: words(r'''
      カメ トカゲ カメレオン ヘビ カタツムリ アリ クモ カニ ワニ 蟷螂 蚯蚓 百足 馬陸 蠍 壁蝨 蚤 蚕 蛹 芋虫 山椒魚 青大将 蝮 毒蛇 眼鏡蛇 響尾蛇 錦蛇 鰐 鬣蜥 蛇王
    '''),
  },
  interjections: words(r'ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、'),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', 'それ'],
  },
  pronounless: const <NounClass>[NounClass.person, NounClass.creature],
  objectPronouns: const SentenceObjectPronouns(
    words: <WordGender, WordPool>{
      WordGender.n: <String>[''],
    },
  ),
  speech: const SentenceSpeech(subject: ''),
  numeral: const SentenceNumeral(
    order: NumeralOrder.after,
    counters: <NounClass, String>{
      NounClass.creature: '匹',
      NounClass.person: '人',
      NounClass.plant: '本',
      NounClass.edible: '個',
      NounClass.thing: '個',
      NounClass.vehicle: '台',
      NounClass.place: '箇所',
      NounClass.event: '回',
      NounClass.idea: '種類',
      NounClass.body: '本',
    },
    count: LengthRange(2, 12),
    currency: '円',
    amounts: <int>[1000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000],
    group: ',',
    gap: '',
  ),
  calendar: SentenceCalendar(
    date: 'Y年M月D日',
    clock: 'h時mm分',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(
      subject: const <NounClass>[NounClass.event],
      words: <String>['だ'],
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: <String>['です'],
      },
      past: PredicateTense(
        words: <String>['だった'],
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: <String>['でした'],
        },
      ),
    ),
  ),
  frames: const <SentenceFrame>[
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, tail: 'に'),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, tail: 'に'),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は'),
      SentencePart(SentenceSlot.date, copula: CopulaSide.tail),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は'),
      SentencePart(SentenceSlot.clock, copula: CopulaSide.tail),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 14),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.destination, tail: 'へ', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      8,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.destination, tail: 'に', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      8,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.time),
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.destination, tail: 'へ', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      4,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.manner),
        SentencePart(SentenceSlot.destination, tail: 'に', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      3,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.state),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 4),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      20,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      16,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      14,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      12,
      mood: SentenceMood.question,
      tag: 'か',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
        SentencePart(SentenceSlot.destination, tail: 'へ', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      6,
      mood: SentenceMood.question,
      tag: 'か',
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.quantity, tail: 'を'),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.quantity, tail: 'が'),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.money, tail: 'を'),
      SentencePart(SentenceSlot.verb),
    ], 5),
  ],
);
