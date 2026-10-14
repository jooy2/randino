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
      words: words(r'起きる 目覚める 立ち上がる 起き上がる 起き出す 飛び起きる 身を起こす'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'起きます 目覚めます 立ち上がります 起き上がります 起き出します 飛び起きます 身を起こします'),
        PredicateForm.linking: words(r'起きて 目覚めて 立ち上がって 起き上がって 起き出して 飛び起きて 身を起こして'),
      },
      past: PredicateTense(
        words: words(r'起きた 目覚めた 立ち上がった 起き上がった 起き出した 飛び起きた 身を起こした'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'起きました 目覚めました 立ち上がりました 起き上がりました 起き出しました 飛び起きました 身を起こしました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'起き 目覚め 立ち上がり 起き上がり 起き出し 飛び起き 身を起こし'),
        PredicateJoint.negative: words(r'起き 目覚め 立ち上がら 起き上がら 起き出さ 飛び起き 身を起こさ'),
      },
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'行く 向かう 出かける 訪れる 訪ねていく 近づく 進む 入っていく 渡る 立ち寄る 足を運ぶ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'行きます 向かいます 出かけます 訪れます 訪ねていきます 近づきます 進みます 入っていきます 渡ります 立ち寄ります 足を運びます',
        ),
        PredicateForm.linking: words(r'行って 向かって 出かけて 訪れて 訪ねていって 近づいて 進んで 入っていって 渡って 立ち寄って 足を運んで'),
      },
      past: PredicateTense(
        words: words(r'行った 向かった 出かけた 訪れた 訪ねていった 近づいた 進んだ 入っていった 渡った 立ち寄った 足を運んだ'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            行きました 向かいました 出かけました 訪れました 訪ねていきました 近づきました 進みました 入っていきました 渡りました 立ち寄りました 足を運びました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'行き 向かい 出かけ 訪れ 訪ねていき 近づき 進み 入っていき 渡り 立ち寄り 足を運び'),
        PredicateJoint.negative: words(r'行か 向かわ 出かけ 訪れ 訪ねていか 近づか 進ま 入っていか 渡ら 立ち寄ら 足を運ば'),
      },
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'駆けていく 上る 下りる 歩いていく 走っていく 急いでいく 駆けつける'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'駆けていきます 上ります 下ります 歩いていきます 走っていきます 急いでいきます 駆けつけます'),
        PredicateForm.linking: words(r'駆けていって 上って 下りて 歩いていって 走っていって 急いでいって 駆けつけて'),
      },
      past: PredicateTense(
        words: words(r'駆けていった 上った 下りた 歩いていった 走っていった 急いでいった 駆けつけた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'駆けていきました 上りました 下りました 歩いていきました 走っていきました 急いでいきました 駆けつけました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'駆けていき 上り 下り 歩いていき 走っていき 急いでいき 駆けつけ'),
        PredicateJoint.negative: words(r'駆けていか 上ら 下り 歩いていか 走っていか 急いでいか 駆けつけ'),
      },
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'去る 出発する 出ていく 出る 立ち去る 旅立つ 歩き出す 出かけていく 動き出す 家を出る 抜け出す 飛び出す'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          去ります 出発します 出ていきます 出ます 立ち去ります 旅立ちます 歩き出します 出かけていきます 動き出します 家を出ます 抜け出します 飛び出します
        '''),
        PredicateForm.linking: words(
          r'去って 出発して 出ていって 出て 立ち去って 旅立って 歩き出して 出かけていって 動き出して 家を出て 抜け出して 飛び出して',
        ),
      },
      past: PredicateTense(
        words: words(r'去った 出発した 出ていった 出た 立ち去った 旅立った 歩き出した 出かけていった 動き出した 家を出た 抜け出した 飛び出した'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            去りました 出発しました 出ていきました 出ました 立ち去りました 旅立ちました 歩き出しました 出かけていきました 動き出しました 家を出ました 抜け出しました
            飛び出しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'去り 出発し 出ていき 出 立ち去り 旅立ち 歩き出し 出かけていき 動き出し 家を出 抜け出し 飛び出し'),
        PredicateJoint.negative: words(r'去ら 出発し 出ていか 出 立ち去ら 旅立た 歩き出さ 出かけていか 動き出さ 家を出 抜け出さ 飛び出さ'),
      },
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'着く 到着する 入る たどり着く 帰り着く 近づいてくる 行き着く 到達する 帰っていく 戻っていく'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'着きます 到着します 入ります たどり着きます 帰り着きます 近づいてきます 行き着きます 到達します 帰っていきます 戻っていきます',
        ),
        PredicateForm.linking: words(r'着いて 到着して 入って たどり着いて 帰り着いて 近づいてきて 行き着いて 到達して 帰っていって 戻っていって'),
      },
      past: PredicateTense(
        words: words(r'着いた 到着した 入った たどり着いた 帰り着いた 近づいてきた 行き着いた 到達した 帰っていった 戻っていった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            着きました 到着しました 入りました たどり着きました 帰り着きました 近づいてきました 行き着きました 到達しました 帰っていきました 戻っていきました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'着き 到着し 入り たどり着き 帰り着き 近づいてき 行き着き 到達し 帰っていき 戻っていき'),
        PredicateJoint.negative: words(r'着か 到着し 入ら たどり着か 帰り着か 近づいてこ 行き着か 到達し 帰っていか 戻っていか'),
      },
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'帰る 戻る 帰宅する 姿を見せる 顔を出す 帰路につく 家に帰る 舞い戻る 帰ってくる 戻ってくる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'帰ります 戻ります 帰宅します 姿を見せます 顔を出します 帰路につきます 家に帰ります 舞い戻ります 帰ってきます 戻ってきます',
        ),
        PredicateForm.linking: words(r'帰って 戻って 帰宅して 姿を見せて 顔を出して 帰路について 家に帰って 舞い戻って 帰ってきて 戻ってきて'),
      },
      past: PredicateTense(
        words: words(r'帰った 戻った 帰宅した 姿を見せた 顔を出した 帰路についた 家に帰った 舞い戻った 帰ってきた 戻ってきた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            帰りました 戻りました 帰宅しました 姿を見せました 顔を出しました 帰路につきました 家に帰りました 舞い戻りました 帰ってきました 戻ってきました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'帰り 戻り 帰宅し 姿を見せ 顔を出し 帰路につき 家に帰り 舞い戻り 帰ってき 戻ってき'),
        PredicateJoint.negative: words(r'帰ら 戻ら 帰宅し 姿を見せ 顔を出さ 帰路につか 家に帰ら 舞い戻ら 帰ってこ 戻ってこ'),
      },
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'''
        走る 歩く 跳ぶ 駆け回る 散歩する 駆ける 歩き回る 跳ねる 走り回る うろつく 駆け出す 飛び跳ねる よたよた歩く のしのし歩く つま先立ちで歩く 行進する ジョギングする
        練り歩く 早足で歩く 駆け抜ける 大股で歩く
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          走ります 歩きます 跳びます 駆け回ります 散歩します 駆けます 歩き回ります 跳ねます 走り回ります うろつきます 駆け出します 飛び跳ねます よたよた歩きます のしのし歩きます
          つま先立ちで歩きます 行進します ジョギングします 練り歩きます 早足で歩きます 駆け抜けます 大股で歩きます
        '''),
        PredicateForm.linking: words(r'''
          走って 歩いて 跳んで 駆け回って 散歩して 駆けて 歩き回って 跳ねて 走り回って うろついて 駆け出して 飛び跳ねて よたよた歩いて のしのし歩いて つま先立ちで歩いて
          行進して ジョギングして 練り歩いて 早足で歩いて 駆け抜けて 大股で歩いて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          走った 歩いた 跳んだ 駆け回った 散歩した 駆けた 歩き回った 跳ねた 走り回った うろついた 駆け出した 飛び跳ねた よたよた歩いた のしのし歩いた つま先立ちで歩いた
          行進した ジョギングした 練り歩いた 早足で歩いた 駆け抜けた 大股で歩いた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            走りました 歩きました 跳びました 駆け回りました 散歩しました 駆けました 歩き回りました 跳ねました 走り回りました うろつきました 駆け出しました 飛び跳ねました
            よたよた歩きました のしのし歩きました つま先立ちで歩きました 行進しました ジョギングしました 練り歩きました 早足で歩きました 駆け抜けました 大股で歩きました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          走り 歩き 跳び 駆け回り 散歩し 駆け 歩き回り 跳ね 走り回り うろつき 駆け出し 飛び跳ね よたよた歩き のしのし歩き つま先立ちで歩き 行進し ジョギングし 練り歩き
          早足で歩き 駆け抜け 大股で歩き
        '''),
        PredicateJoint.negative: words(r'''
          走ら 歩か 跳ば 駆け回ら 散歩し 駆け 歩き回ら 跳ね 走り回ら うろつか 駆け出さ 飛び跳ね よたよた歩か のしのし歩か つま先立ちで歩か 行進し ジョギングし 練り歩か
          早足で歩か 駆け抜け 大股で歩か
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'さまよう 通る 動く 移動する 旋回する 進む 退く 近寄る 遠ざかる 行き来する 通り過ぎる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'さまよいます 通ります 動きます 移動します 旋回します 進みます 退きます 近寄ります 遠ざかります 行き来します 通り過ぎます',
        ),
        PredicateForm.linking: words(r'さまよって 通って 動いて 移動して 旋回して 進んで 退いて 近寄って 遠ざかって 行き来して 通り過ぎて'),
      },
      past: PredicateTense(
        words: words(r'さまよった 通った 動いた 移動した 旋回した 進んだ 退いた 近寄った 遠ざかった 行き来した 通り過ぎた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            さまよいました 通りました 動きました 移動しました 旋回しました 進みました 退きました 近寄りました 遠ざかりました 行き来しました 通り過ぎました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'さまよい 通り 動き 移動し 旋回し 進み 退き 近寄り 遠ざかり 行き来し 通り過ぎ'),
        PredicateJoint.negative: words(r'さまよわ 通ら 動か 移動し 旋回し 進ま 退か 近寄ら 遠ざから 行き来し 通り過ぎ'),
      },
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'泳ぐ 泳ぎ回る 潜る 浮かぶ 水面に出る 泳いでいく 水を切る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'泳ぎます 泳ぎ回ります 潜ります 浮かびます 水面に出ます 泳いでいきます 水を切ります'),
        PredicateForm.linking: words(r'泳いで 泳ぎ回って 潜って 浮かんで 水面に出て 泳いでいって 水を切って'),
      },
      past: PredicateTense(
        words: words(r'泳いだ 泳ぎ回った 潜った 浮かんだ 水面に出た 泳いでいった 水を切った'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'泳ぎました 泳ぎ回りました 潜りました 浮かびました 水面に出ました 泳いでいきました 水を切りました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'泳ぎ 泳ぎ回り 潜り 浮かび 水面に出 泳いでいき 水を切り'),
        PredicateJoint.negative: words(r'泳が 泳ぎ回ら 潜ら 浮かば 水面に出 泳いでいか 水を切ら'),
      },
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'飛ぶ 飛び立つ 舞い上がる 羽ばたく 滑空する 舞い降りる 飛び回る 飛び去る 旋回する 羽を休める 舞う 空を切る 降り立つ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          飛びます 飛び立ちます 舞い上がります 羽ばたきます 滑空します 舞い降ります 飛び回ります 飛び去ります 旋回します 羽を休めます 舞います 空を切ります 降り立ちます
        '''),
        PredicateForm.linking: words(r'''
          飛んで 飛び立って 舞い上がって 羽ばたいて 滑空して 舞い降りて 飛び回って 飛び去って 旋回して 羽を休めて 舞って 空を切って 降り立って
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          飛んだ 飛び立った 舞い上がった 羽ばたいた 滑空した 舞い降りた 飛び回った 飛び去った 旋回した 羽を休めた 舞った 空を切った 降り立った
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            飛びました 飛び立ちました 舞い上がりました 羽ばたきました 滑空しました 舞い降りました 飛び回りました 飛び去りました 旋回しました 羽を休めました 舞いました
            空を切りました 降り立ちました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'飛び 飛び立ち 舞い上がり 羽ばたき 滑空し 舞い降り 飛び回り 飛び去り 旋回し 羽を休め 舞い 空を切り 降り立ち'),
        PredicateJoint.negative: words(
          r'飛ば 飛び立た 舞い上がら 羽ばたか 滑空し 舞い降り 飛び回ら 飛び去ら 旋回し 羽を休め 舞わ 空を切ら 降り立た',
        ),
      },
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'這う 這い回る 這い出す くねる 身をよじる とぐろを巻く 這い上がる 這い進む'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'這います 這い回ります 這い出します くねります 身をよじります とぐろを巻きます 這い上がります 這い進みます'),
        PredicateForm.linking: words(r'這って 這い回って 這い出して くねって 身をよじって とぐろを巻いて 這い上がって 這い進んで'),
      },
      past: PredicateTense(
        words: words(r'這った 這い回った 這い出した くねった 身をよじった とぐろを巻いた 這い上がった 這い進んだ'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(
            r'這いました 這い回りました 這い出しました くねりました 身をよじりました とぐろを巻きました 這い上がりました 這い進みました',
          ),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'這い 這い回り 這い出し くねり 身をよじり とぐろを巻き 這い上がり 這い進み'),
        PredicateJoint.negative: words(r'這わ 這い回ら 這い出さ くねら 身をよじら とぐろを巻か 這い上がら 這い進ま'),
      },
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        待つ 隠れる 見回す ためらう 立ち止まる うろうろする 息をひそめる じっとする 立ちすくむ ぐずぐずする 佇む 様子をうかがう 覗く 身を潜める 静かに待つ 足を止める
        待ちぼうけする 目を凝らす
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          待ちます 隠れます 見回します ためらいます 立ち止まります うろうろします 息をひそめます じっとします 立ちすくみます ぐずぐずします 佇みます 様子をうかがいます 覗きます
          身を潜めます 静かに待ちます 足を止めます 待ちぼうけします 目を凝らします
        '''),
        PredicateForm.linking: words(r'''
          待って 隠れて 見回して ためらって 立ち止まって うろうろして 息をひそめて じっとして 立ちすくんで ぐずぐずして 佇んで 様子をうかがって 覗いて 身を潜めて 静かに待って
          足を止めて 待ちぼうけして 目を凝らして
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          待った 隠れた 見回した ためらった 立ち止まった うろうろした 息をひそめた じっとした 立ちすくんだ ぐずぐずした 佇んだ 様子をうかがった 覗いた 身を潜めた 静かに待った
          足を止めた 待ちぼうけした 目を凝らした
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            待ちました 隠れました 見回しました ためらいました 立ち止まりました うろうろしました 息をひそめました じっとしました 立ちすくみました ぐずぐずしました 佇みました
            様子をうかがいました 覗きました 身を潜めました 静かに待ちました 足を止めました 待ちぼうけしました 目を凝らしました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          待ち 隠れ 見回し ためらい 立ち止まり うろうろし 息をひそめ じっとし 立ちすくみ ぐずぐずし 佇み 様子をうかがい 覗き 身を潜め 静かに待ち 足を止め 待ちぼうけし
          目を凝らし
        '''),
        PredicateJoint.negative: words(r'''
          待た 隠れ 見回さ ためらわ 立ち止まら うろうろし 息をひそめ じっとし 立ちすくま ぐずぐずし 佇ま 様子をうかがわ 覗か 身を潜め 静かに待た 足を止め 待ちぼうけし
          目を凝らさ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        休む 座る 寝転ぶ もたれる うずくまる 横になる 腰を下ろす 寝そべる もたれかかる 膝をつく しゃがむ 腰かける くつろぐ 一息つく のんびりする ひと休みする 足を伸ばす
        横たわる 身を休める うつ伏せになる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          休みます 座ります 寝転びます もたれます うずくまります 横になります 腰を下ろします 寝そべります もたれかかります 膝をつきます しゃがみます 腰かけます くつろぎます
          一息つきます のんびりします ひと休みします 足を伸ばします 横たわります 身を休めます うつ伏せになります
        '''),
        PredicateForm.linking: words(r'''
          休んで 座って 寝転んで もたれて うずくまって 横になって 腰を下ろして 寝そべって もたれかかって 膝をついて しゃがんで 腰かけて くつろいで 一息ついて のんびりして
          ひと休みして 足を伸ばして 横たわって 身を休めて うつ伏せになって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          休んだ 座った 寝転んだ もたれた うずくまった 横になった 腰を下ろした 寝そべった もたれかかった 膝をついた しゃがんだ 腰かけた くつろいだ 一息ついた のんびりした
          ひと休みした 足を伸ばした 横たわった 身を休めた うつ伏せになった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            休みました 座りました 寝転びました もたれました うずくまりました 横になりました 腰を下ろしました 寝そべりました もたれかかりました 膝をつきました しゃがみました
            腰かけました くつろぎました 一息つきました のんびりしました ひと休みしました 足を伸ばしました 横たわりました 身を休めました うつ伏せになりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          休み 座り 寝転び もたれ うずくまり 横になり 腰を下ろし 寝そべり もたれかかり 膝をつき しゃがみ 腰かけ くつろぎ 一息つき のんびりし ひと休みし 足を伸ばし 横たわり
          身を休め うつ伏せになり
        '''),
        PredicateJoint.negative: words(r'''
          休ま 座ら 寝転ば もたれ うずくまら 横になら 腰を下ろさ 寝そべら もたれかから 膝をつか しゃがま 腰かけ くつろが 一息つか のんびりし ひと休みし 足を伸ばさ 横たわら
          身を休め うつ伏せになら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        眠る 寝る 眠り込む うたた寝する 昼寝する 寝入る 寝込む まどろむ うとうとする いびきをかく ぐっすり眠る 寝落ちする 夢を見る 眠りに落ちる 目を閉じる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          眠ります 寝ます 眠り込みます うたた寝します 昼寝します 寝入ります 寝込みます まどろみます うとうとします いびきをかきます ぐっすり眠ります 寝落ちします 夢を見ます
          眠りに落ちます 目を閉じます
        '''),
        PredicateForm.linking: words(r'''
          眠って 寝て 眠り込んで うたた寝して 昼寝して 寝入って 寝込んで まどろんで うとうとして いびきをかいて ぐっすり眠って 寝落ちして 夢を見て 眠りに落ちて 目を閉じて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          眠った 寝た 眠り込んだ うたた寝した 昼寝した 寝入った 寝込んだ まどろんだ うとうとした いびきをかいた ぐっすり眠った 寝落ちした 夢を見た 眠りに落ちた 目を閉じた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            眠りました 寝ました 眠り込みました うたた寝しました 昼寝しました 寝入りました 寝込みました まどろみました うとうとしました いびきをかきました ぐっすり眠りました
            寝落ちしました 夢を見ました 眠りに落ちました 目を閉じました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          眠り 寝 眠り込み うたた寝し 昼寝し 寝入り 寝込み まどろみ うとうとし いびきをかき ぐっすり眠り 寝落ちし 夢を見 眠りに落ち 目を閉じ
        '''),
        PredicateJoint.negative: words(r'''
          眠ら 寝 眠り込ま うたた寝し 昼寝し 寝入ら 寝込ま まどろま うとうとし いびきをかか ぐっすり眠ら 寝落ちし 夢を見 眠りに落ち 目を閉じ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'笑う 微笑む にっこりする ほほえむ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'笑います 微笑みます にっこりします ほほえみます'),
        PredicateForm.linking: words(r'笑って 微笑んで にっこりして ほほえんで'),
      },
      past: PredicateTense(
        words: words(r'笑った 微笑んだ にっこりした ほほえんだ'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'笑いました 微笑みました にっこりしました ほほえみました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'笑い 微笑み にっこりし ほほえみ'),
        PredicateJoint.negative: words(r'笑わ 微笑ま にっこりし ほほえま'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.person],
      condition: Condition.content,
      words: words(r'くすくす笑う 口笛を吹く 歓声を上げる うなずく 手を叩く ウインクする 鼻歌を歌う にやりとする 手を振る'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'くすくす笑います 口笛を吹きます 歓声を上げます うなずきます 手を叩きます ウインクします 鼻歌を歌います にやりとします 手を振ります',
        ),
        PredicateForm.linking: words(
          r'くすくす笑って 口笛を吹いて 歓声を上げて うなずいて 手を叩いて ウインクして 鼻歌を歌って にやりとして 手を振って',
        ),
      },
      past: PredicateTense(
        words: words(r'くすくす笑った 口笛を吹いた 歓声を上げた うなずいた 手を叩いた ウインクした 鼻歌を歌った にやりとした 手を振った'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            くすくす笑いました 口笛を吹きました 歓声を上げました うなずきました 手を叩きました ウインクしました 鼻歌を歌いました にやりとしました 手を振りました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'くすくす笑い 口笛を吹き 歓声を上げ うなずき 手を叩き ウインクし 鼻歌を歌い にやりとし 手を振り'),
        PredicateJoint.negative: words(r'くすくす笑わ 口笛を吹か 歓声を上げ うなずか 手を叩か ウインクし 鼻歌を歌わ にやりとし 手を振ら'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'泣く うめく 泣きじゃくる そわそわする'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'泣きます うめきます 泣きじゃくります そわそわします'),
        PredicateForm.linking: words(r'泣いて うめいて 泣きじゃくって そわそわして'),
      },
      past: PredicateTense(
        words: words(r'泣いた うめいた 泣きじゃくった そわそわした'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'泣きました うめきました 泣きじゃくりました そわそわしました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'泣き うめき 泣きじゃくり そわそわし'),
        PredicateJoint.negative: words(r'泣か うめか 泣きじゃくら そわそわし'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.person],
      condition: Condition.restless,
      words: words(r'つぶやく ため息をつく ぼやく 顔をしかめる 鼻をすする 独り言を言う 涙ぐむ 首を振る 舌打ちする 眉をひそめる 唇をかむ 頭をかく'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          つぶやきます ため息をつきます ぼやきます 顔をしかめます 鼻をすすります 独り言を言います 涙ぐみます 首を振ります 舌打ちします 眉をひそめます 唇をかみます 頭をかきます
        '''),
        PredicateForm.linking: words(r'''
          つぶやいて ため息をついて ぼやいて 顔をしかめて 鼻をすすって 独り言を言って 涙ぐんで 首を振って 舌打ちして 眉をひそめて 唇をかんで 頭をかいて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          つぶやいた ため息をついた ぼやいた 顔をしかめた 鼻をすすった 独り言を言った 涙ぐんだ 首を振った 舌打ちした 眉をひそめた 唇をかんだ 頭をかいた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            つぶやきました ため息をつきました ぼやきました 顔をしかめました 鼻をすすりました 独り言を言いました 涙ぐみました 首を振りました 舌打ちしました 眉をひそめました
            唇をかみました 頭をかきました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(
          r'つぶやき ため息をつき ぼやき 顔をしかめ 鼻をすすり 独り言を言い 涙ぐみ 首を振り 舌打ちし 眉をひそめ 唇をかみ 頭をかき',
        ),
        PredicateJoint.negative: words(
          r'つぶやか ため息をつか ぼやか 顔をしかめ 鼻をすすら 独り言を言わ 涙ぐま 首を振ら 舌打ちし 眉をひそめ 唇をかま 頭をかか',
        ),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'あくびする 伸びをする まばたきする'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'あくびします 伸びをします まばたきします'),
        PredicateForm.linking: words(r'あくびして 伸びをして まばたきして'),
      },
      past: PredicateTense(
        words: words(r'あくびした 伸びをした まばたきした'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'あくびしました 伸びをしました まばたきしました')},
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'あくびし 伸びをし まばたきし'),
        PredicateJoint.negative: words(r'あくびし 伸びをし まばたきし'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.person],
      condition: Condition.tired,
      words: words(r'目をこする 肩を回す 首を回す'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'目をこすります 肩を回します 首を回します'),
        PredicateForm.linking: words(r'目をこすって 肩を回して 首を回して'),
      },
      past: PredicateTense(
        words: words(r'目をこすった 肩を回した 首を回した'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'目をこすりました 肩を回しました 首を回しました')},
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'目をこすり 肩を回し 首を回し'),
        PredicateJoint.negative: words(r'目をこすら 肩を回さ 首を回さ'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'つばを飲み込む 舌なめずりする 鼻をひくつかせる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'つばを飲み込みます 舌なめずりします 鼻をひくつかせます'),
        PredicateForm.linking: words(r'つばを飲み込んで 舌なめずりして 鼻をひくつかせて'),
      },
      past: PredicateTense(
        words: words(r'つばを飲み込んだ 舌なめずりした 鼻をひくつかせた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'つばを飲み込みました 舌なめずりしました 鼻をひくつかせました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'つばを飲み込み 舌なめずりし 鼻をひくつかせ'),
        PredicateJoint.negative: words(r'つばを飲み込ま 舌なめずりし 鼻をひくつかせ'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.person],
      condition: Condition.hungry,
      words: words(r'お腹をさする'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'お腹をさすります'),
        PredicateForm.linking: words(r'お腹をさすって'),
      },
      past: PredicateTense(
        words: words(r'お腹をさすった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'お腹をさすりました')},
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'お腹をさすり'),
        PredicateJoint.negative: words(r'お腹をさすら'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'叫ぶ はっとする 首をかしげる 目を丸くする 息をのむ 振り返る 顔を上げる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'叫びます はっとします 首をかしげます 目を丸くします 息をのみます 振り返ります 顔を上げます'),
        PredicateForm.linking: words(r'叫んで はっとして 首をかしげて 目を丸くして 息をのんで 振り返って 顔を上げて'),
      },
      past: PredicateTense(
        words: words(r'叫んだ はっとした 首をかしげた 目を丸くした 息をのんだ 振り返った 顔を上げた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'叫びました はっとしました 首をかしげました 目を丸くしました 息をのみました 振り返りました 顔を上げました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'叫び はっとし 首をかしげ 目を丸くし 息をのみ 振り返り 顔を上げ'),
        PredicateJoint.negative: words(r'叫ば はっとし 首をかしげ 目を丸くし 息をのま 振り返ら 顔を上げ'),
      },
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.person],
      words: words(r'声を上げる 肩をすくめる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'声を上げます 肩をすくめます'),
        PredicateForm.linking: words(r'声を上げて 肩をすくめて'),
      },
      past: PredicateTense(
        words: words(r'声を上げた 肩をすくめた'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'声を上げました 肩をすくめました')},
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'声を上げ 肩をすくめ'),
        PredicateJoint.negative: words(r'声を上げ 肩をすくめ'),
      },
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        話す おしゃべりする 語り合う しゃべる 会話する 雑談する ささやく つぶやき合う 語る 話し込む 立ち話する 声をかける 言葉を交わす 談笑する 挨拶する
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          話します おしゃべりします 語り合います しゃべります 会話します 雑談します ささやきます つぶやき合います 語ります 話し込みます 立ち話します 声をかけます 言葉を交わします
          談笑します 挨拶します
        '''),
        PredicateForm.linking: words(r'''
          話して おしゃべりして 語り合って しゃべって 会話して 雑談して ささやいて つぶやき合って 語って 話し込んで 立ち話して 声をかけて 言葉を交わして 談笑して 挨拶して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          話した おしゃべりした 語り合った しゃべった 会話した 雑談した ささやいた つぶやき合った 語った 話し込んだ 立ち話した 声をかけた 言葉を交わした 談笑した 挨拶した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            話しました おしゃべりしました 語り合いました しゃべりました 会話しました 雑談しました ささやきました つぶやき合いました 語りました 話し込みました 立ち話しました
            声をかけました 言葉を交わしました 談笑しました 挨拶しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          話し おしゃべりし 語り合い しゃべり 会話し 雑談し ささやき つぶやき合い 語り 話し込み 立ち話し 声をかけ 言葉を交わし 談笑し 挨拶し
        '''),
        PredicateJoint.negative: words(r'''
          話さ おしゃべりし 語り合わ しゃべら 会話し 雑談し ささやか つぶやき合わ 語ら 話し込ま 立ち話し 声をかけ 言葉を交わさ 談笑し 挨拶し
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        踊る 歌う 転がる 遊ぶ はねる 跳ね回る じゃれる はしゃぐ 駆け回って遊ぶ ぐるぐる回る くるくる回る 飛び跳ねる ふざける 遊び回る かくれんぼする ボール遊びする 水遊びする
        戯れる でんぐり返しする 転げ回る
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          踊ります 歌います 転がります 遊びます はねます 跳ね回ります じゃれます はしゃぎます 駆け回って遊びます ぐるぐる回ります くるくる回ります 飛び跳ねます ふざけます
          遊び回ります かくれんぼします ボール遊びします 水遊びします 戯れます でんぐり返しします 転げ回ります
        '''),
        PredicateForm.linking: words(r'''
          踊って 歌って 転がって 遊んで はねて 跳ね回って じゃれて はしゃいで 駆け回って遊んで ぐるぐる回って くるくる回って 飛び跳ねて ふざけて 遊び回って かくれんぼして
          ボール遊びして 水遊びして 戯れて でんぐり返しして 転げ回って
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          踊った 歌った 転がった 遊んだ はねた 跳ね回った じゃれた はしゃいだ 駆け回って遊んだ ぐるぐる回った くるくる回った 飛び跳ねた ふざけた 遊び回った かくれんぼした
          ボール遊びした 水遊びした 戯れた でんぐり返しした 転げ回った
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            踊りました 歌いました 転がりました 遊びました はねました 跳ね回りました じゃれました はしゃぎました 駆け回って遊びました ぐるぐる回りました くるくる回りました
            飛び跳ねました ふざけました 遊び回りました かくれんぼしました ボール遊びしました 水遊びしました 戯れました でんぐり返ししました 転げ回りました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          踊り 歌い 転がり 遊び はね 跳ね回り じゃれ はしゃぎ 駆け回って遊び ぐるぐる回り くるくる回り 飛び跳ね ふざけ 遊び回り かくれんぼし ボール遊びし 水遊びし 戯れ
          でんぐり返しし 転げ回り
        '''),
        PredicateJoint.negative: words(r'''
          踊ら 歌わ 転がら 遊ば はね 跳ね回ら じゃれ はしゃが 駆け回って遊ば ぐるぐる回ら くるくる回ら 飛び跳ね ふざけ 遊び回ら かくれんぼし ボール遊びし 水遊びし 戯れ
          でんぐり返しし 転げ回ら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        覚える 忘れる 想像する 数える 思い出す 懐かしむ 考える 思い描く 夢に見る 気にかける 心配する 信じる 期待する 理解する 悟る 恋しがる 懐かしがる 思い返す 反芻する
        案じる 想う
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          覚えます 忘れます 想像します 数えます 思い出します 懐かしみます 考えます 思い描きます 夢に見ます 気にかけます 心配します 信じます 期待します 理解します 悟ります
          恋しがります 懐かしがります 思い返します 反芻します 案じます 想います
        '''),
        PredicateForm.linking: words(r'''
          覚えて 忘れて 想像して 数えて 思い出して 懐かしんで 考えて 思い描いて 夢に見て 気にかけて 心配して 信じて 期待して 理解して 悟って 恋しがって 懐かしがって
          思い返して 反芻して 案じて 想って
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          覚えた 忘れた 想像した 数えた 思い出した 懐かしんだ 考えた 思い描いた 夢に見た 気にかけた 心配した 信じた 期待した 理解した 悟った 恋しがった 懐かしがった
          思い返した 反芻した 案じた 想った
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            覚えました 忘れました 想像しました 数えました 思い出しました 懐かしみました 考えました 思い描きました 夢に見ました 気にかけました 心配しました 信じました
            期待しました 理解しました 悟りました 恋しがりました 懐かしがりました 思い返しました 反芻しました 案じました 想いました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          覚え 忘れ 想像し 数え 思い出し 懐かしみ 考え 思い描き 夢に見 気にかけ 心配し 信じ 期待し 理解し 悟り 恋しがり 懐かしがり 思い返し 反芻し 案じ 想い
        '''),
        PredicateJoint.negative: words(r'''
          覚え 忘れ 想像し 数え 思い出さ 懐かしま 考え 思い描か 夢に見 気にかけ 心配し 信じ 期待し 理解し 悟ら 恋しがら 懐かしがら 思い返さ 反芻し 案じ 想わ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        見る 見つめる 眺める 調べる 触る なでる 眺め回す 見渡す 観察する じっと見る 覗き込む 見下ろす 見上げる 見比べる さする 叩く 嗅ぐ 手に取って見る いじる 持ち上げてみる
        品定めする 鑑賞する 睨む 見守る ちらりと見る
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          見ます 見つめます 眺めます 調べます 触ります なでます 眺め回します 見渡します 観察します じっと見ます 覗き込みます 見下ろします 見上げます 見比べます さします
          叩きます 嗅ぎます 手に取って見ます いじります 持ち上げてみます 品定めします 鑑賞します 睨みます 見守ります ちらりと見ます
        '''),
        PredicateForm.linking: words(r'''
          見て 見つめて 眺めて 調べて 触って なでて 眺め回して 見渡して 観察して じっと見て 覗き込んで 見下ろして 見上げて 見比べて さして 叩いて 嗅いで 手に取って見て
          いじって 持ち上げてみて 品定めして 鑑賞して 睨んで 見守って ちらりと見て
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          見た 見つめた 眺めた 調べた 触った なでた 眺め回した 見渡した 観察した じっと見た 覗き込んだ 見下ろした 見上げた 見比べた さした 叩いた 嗅いだ 手に取って見た
          いじった 持ち上げてみた 品定めした 鑑賞した 睨んだ 見守った ちらりと見た
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            見ました 見つめました 眺めました 調べました 触りました なでました 眺め回しました 見渡しました 観察しました じっと見ました 覗き込みました 見下ろしました 見上げました
            見比べました さしました 叩きました 嗅ぎました 手に取って見ました いじりました 持ち上げてみました 品定めしました 鑑賞しました 睨みました 見守りました ちらりと見ました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          見 見つめ 眺め 調べ 触り なで 眺め回し 見渡し 観察し じっと見 覗き込み 見下ろし 見上げ 見比べ さし 叩き 嗅ぎ 手に取って見 いじり 持ち上げてみ 品定めし 鑑賞し
          睨み 見守り ちらりと見
        '''),
        PredicateJoint.negative: words(r'''
          見 見つめ 眺め 調べ 触ら なで 眺め回さ 見渡さ 観察し じっと見 覗き込ま 見下ろさ 見上げ 見比べ さし 叩か 嗅が 手に取って見 いじら 持ち上げてみ 品定めし 鑑賞し
          睨ま 見守ら ちらりと見
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        探し回る 探す うろつく 見て回る 捜す 探し出す 漁る 掘り返す 手探りする 隅々まで探す 探索する 探検する 詮索する 嗅ぎ回る 見回って探す 引っかき回す
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          探し回ります 探します うろつきます 見て回ります 捜します 探し出します 漁ります 掘り返します 手探りします 隅々まで探します 探索します 探検します 詮索します 嗅ぎ回ります
          見回って探します 引っかき回します
        '''),
        PredicateForm.linking: words(r'''
          探し回って 探して うろついて 見て回って 捜して 探し出して 漁って 掘り返して 手探りして 隅々まで探して 探索して 探検して 詮索して 嗅ぎ回って 見回って探して
          引っかき回して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          探し回った 探した うろついた 見て回った 捜した 探し出した 漁った 掘り返した 手探りした 隅々まで探した 探索した 探検した 詮索した 嗅ぎ回った 見回って探した
          引っかき回した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            探し回りました 探しました うろつきました 見て回りました 捜しました 探し出しました 漁りました 掘り返しました 手探りしました 隅々まで探しました 探索しました
            探検しました 詮索しました 嗅ぎ回りました 見回って探しました 引っかき回しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          探し回り 探し うろつき 見て回り 捜し 探し出し 漁り 掘り返し 手探りし 隅々まで探し 探索し 探検し 詮索し 嗅ぎ回り 見回って探し 引っかき回し
        '''),
        PredicateJoint.negative: words(r'''
          探し回ら 探さ うろつか 見て回ら 捜さ 探し出さ 漁ら 掘り返さ 手探りし 隅々まで探さ 探索し 探検し 詮索し 嗅ぎ回ら 見回って探さ 引っかき回さ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        見つける 発見する 拾う 見いだす 探し当てる 掘り出す 見つけ出す 手に入れる 拾い上げる 拾い集める すくい上げる 引き当てる 突き止める 取り戻す 探り当てる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          見つけます 発見します 拾います 見いだします 探し当てます 掘り出します 見つけ出します 手に入れます 拾い上げます 拾い集めます すくい上げます 引き当てます 突き止めます
          取り戻します 探り当てます
        '''),
        PredicateForm.linking: words(r'''
          見つけて 発見して 拾って 見いだして 探し当てて 掘り出して 見つけ出して 手に入れて 拾い上げて 拾い集めて すくい上げて 引き当てて 突き止めて 取り戻して 探り当てて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          見つけた 発見した 拾った 見いだした 探し当てた 掘り出した 見つけ出した 手に入れた 拾い上げた 拾い集めた すくい上げた 引き当てた 突き止めた 取り戻した 探り当てた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            見つけました 発見しました 拾いました 見いだしました 探し当てました 掘り出しました 見つけ出しました 手に入れました 拾い上げました 拾い集めました すくい上げました
            引き当てました 突き止めました 取り戻しました 探り当てました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          見つけ 発見し 拾い 見いだし 探し当て 掘り出し 見つけ出し 手に入れ 拾い上げ 拾い集め すくい上げ 引き当て 突き止め 取り戻し 探り当て
        '''),
        PredicateJoint.negative: words(r'''
          見つけ 発見し 拾わ 見いださ 探し当て 掘り出さ 見つけ出さ 手に入れ 拾い上げ 拾い集め すくい上げ 引き当て 突き止め 取り戻さ 探り当て
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        選ぶ 取る つかむ 手に取る 受け取る 取り出す 握る つかみ取る 持つ 持ち上げる 抱く 集める 拾う 選び取る 受け入れる 得る 手にする 引き寄せる 抱え上げる 取り上げる
        くわえる 抜き取る 選び出す
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          選びます 取ります つかみます 手に取ります 受け取ります 取り出します 握ります つかみ取ります 持ちます 持ち上げます 抱きます 集めます 拾います 選び取ります 受け入れます
          得ます 手にします 引き寄せます 抱え上げます 取り上げます くわえます 抜き取ります 選び出します
        '''),
        PredicateForm.linking: words(r'''
          選んで 取って つかんで 手に取って 受け取って 取り出して 握って つかみ取って 持って 持ち上げて 抱いて 集めて 拾って 選び取って 受け入れて 得て 手にして 引き寄せて
          抱え上げて 取り上げて くわえて 抜き取って 選び出して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          選んだ 取った つかんだ 手に取った 受け取った 取り出した 握った つかみ取った 持った 持ち上げた 抱いた 集めた 拾った 選び取った 受け入れた 得た 手にした 引き寄せた
          抱え上げた 取り上げた くわえた 抜き取った 選び出した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            選びました 取りました つかみました 手に取りました 受け取りました 取り出しました 握りました つかみ取りました 持ちました 持ち上げました 抱きました 集めました
            拾いました 選び取りました 受け入れました 得ました 手にしました 引き寄せました 抱え上げました 取り上げました くわえました 抜き取りました 選び出しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          選び 取り つかみ 手に取り 受け取り 取り出し 握り つかみ取り 持ち 持ち上げ 抱き 集め 拾い 選び取り 受け入れ 得 手にし 引き寄せ 抱え上げ 取り上げ くわえ 抜き取り
          選び出し
        '''),
        PredicateJoint.negative: words(r'''
          選ば 取ら つかま 手に取ら 受け取ら 取り出さ 握ら つかみ取ら 持た 持ち上げ 抱か 集め 拾わ 選び取ら 受け入れ 得 手にし 引き寄せ 抱え上げ 取り上げ くわえ 抜き取ら
          選び出さ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        運ぶ 持ち帰る 抱える 持ってくる 持っていく 持ち上げる 抱えていく 背負う 担ぐ 引きずる 押す 引く 引っ張る 運び込む 運び出す 持ち運ぶ 抱きかかえる 担いでいく
        引きずっていく
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          運びます 持ち帰ります 抱えます 持ってきます 持っていきます 持ち上げます 抱えていきます 背負います 担ぎます 引きずります 押します 引きます 引っ張ります 運び込みます
          運び出します 持ち運びます 抱きかかえます 担いでいきます 引きずっていきます
        '''),
        PredicateForm.linking: words(r'''
          運んで 持ち帰って 抱えて 持ってきて 持っていって 持ち上げて 抱えていって 背負って 担いで 引きずって 押して 引いて 引っ張って 運び込んで 運び出して 持ち運んで
          抱きかかえて 担いでいって 引きずっていって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          運んだ 持ち帰った 抱えた 持ってきた 持っていった 持ち上げた 抱えていった 背負った 担いだ 引きずった 押した 引いた 引っ張った 運び込んだ 運び出した 持ち運んだ
          抱きかかえた 担いでいった 引きずっていった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            運びました 持ち帰りました 抱えました 持ってきました 持っていきました 持ち上げました 抱えていきました 背負いました 担ぎました 引きずりました 押しました 引きました
            引っ張りました 運び込みました 運び出しました 持ち運びました 抱きかかえました 担いでいきました 引きずっていきました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          運び 持ち帰り 抱え 持ってき 持っていき 持ち上げ 抱えていき 背負い 担ぎ 引きずり 押し 引き 引っ張り 運び込み 運び出し 持ち運び 抱きかかえ 担いでいき 引きずっていき
        '''),
        PredicateJoint.negative: words(r'''
          運ば 持ち帰ら 抱え 持ってこ 持っていか 持ち上げ 抱えていか 背負わ 担が 引きずら 押さ 引か 引っ張ら 運び込ま 運び出さ 持ち運ば 抱きかかえ 担いでいか 引きずっていか
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        隠す しまう 守る 埋める 取っておく しまい込む 保管する 蓄える 貯める 片付ける 押し込む 詰め込む 覆う 包む 収める 大事にする 見守る 隠しておく 置いておく 仕舞っておく
        埋めておく
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          隠します しまいます 守ります 埋めます 取っておきます しまい込みます 保管します 蓄えます 貯めます 片付けます 押し込みます 詰め込みます 覆います 包みます 収めます
          大事にします 見守ります 隠しておきます 置いておきます 仕舞っておきます 埋めておきます
        '''),
        PredicateForm.linking: words(r'''
          隠して しまって 守って 埋めて 取っておいて しまい込んで 保管して 蓄えて 貯めて 片付けて 押し込んで 詰め込んで 覆って 包んで 収めて 大事にして 見守って 隠しておいて
          置いておいて 仕舞っておいて 埋めておいて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          隠した しまった 守った 埋めた 取っておいた しまい込んだ 保管した 蓄えた 貯めた 片付けた 押し込んだ 詰め込んだ 覆った 包んだ 収めた 大事にした 見守った 隠しておいた
          置いておいた 仕舞っておいた 埋めておいた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            隠しました しまいました 守りました 埋めました 取っておきました しまい込みました 保管しました 蓄えました 貯めました 片付けました 押し込みました 詰め込みました
            覆いました 包みました 収めました 大事にしました 見守りました 隠しておきました 置いておきました 仕舞っておきました 埋めておきました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          隠し しまい 守り 埋め 取っておき しまい込み 保管し 蓄え 貯め 片付け 押し込み 詰め込み 覆い 包み 収め 大事にし 見守り 隠しておき 置いておき 仕舞っておき
          埋めておき
        '''),
        PredicateJoint.negative: words(r'''
          隠さ しまわ 守ら 埋め 取っておか しまい込ま 保管し 蓄え 貯め 片付け 押し込ま 詰め込ま 覆わ 包ま 収め 大事にし 見守ら 隠しておか 置いておか 仕舞っておか
          埋めておか
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.lose,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'なくす 落とす 失う 置き忘れる 落としてしまう 取り落とす 置いてくる 忘れる 見失う 手放す 落っことす 紛失する'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          なくします 落とします 失います 置き忘れます 落としてしまいます 取り落とします 置いてきます 忘れます 見失います 手放します 落っことします 紛失します
        '''),
        PredicateForm.linking: words(
          r'なくして 落として 失って 置き忘れて 落としてしまって 取り落として 置いてきて 忘れて 見失って 手放して 落っことして 紛失して',
        ),
      },
      past: PredicateTense(
        words: words(r'なくした 落とした 失った 置き忘れた 落としてしまった 取り落とした 置いてきた 忘れた 見失った 手放した 落っことした 紛失した'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            なくしました 落としました 失いました 置き忘れました 落としてしまいました 取り落としました 置いてきました 忘れました 見失いました 手放しました 落っことしました
            紛失しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'なくし 落とし 失い 置き忘れ 落としてしまい 取り落とし 置いてき 忘れ 見失い 手放し 落っことし 紛失し'),
        PredicateJoint.negative: words(r'なくさ 落とさ 失わ 置き忘れ 落としてしまわ 取り落とさ 置いてこ 忘れ 見失わ 手放さ 落っことさ 紛失し'),
      },
    ),
    VerbGroup(
      field: VerbField.meet,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.person],
      words: words(r'訪ねる 見かける 迎える 迎え入れる 歓迎する 見つける 抱きしめる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'訪ねます 見かけます 迎えます 迎え入れます 歓迎します 見つけます 抱きしめます'),
        PredicateForm.linking: words(r'訪ねて 見かけて 迎えて 迎え入れて 歓迎して 見つけて 抱きしめて'),
      },
      past: PredicateTense(
        words: words(r'訪ねた 見かけた 迎えた 迎え入れた 歓迎した 見つけた 抱きしめた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'訪ねました 見かけました 迎えました 迎え入れました 歓迎しました 見つけました 抱きしめました'),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'訪ね 見かけ 迎え 迎え入れ 歓迎し 見つけ 抱きしめ'),
        PredicateJoint.negative: words(r'訪ね 見かけ 迎え 迎え入れ 歓迎し 見つけ 抱きしめ'),
      },
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        作る 建てる 描く 編む 組み立てる 削る こしらえる 仕上げる 組む 設計する 製作する 作り上げる 形作る 彫る 織る 磨き上げる 創る 生み出す 飾り付ける 描き上げる
        完成させる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          作ります 建てます 描きます 編みます 組み立てます 削ります こしらえます 仕上げます 組みます 設計します 製作します 作り上げます 形作ります 彫ります 織ります
          磨き上げます 創ります 生み出します 飾り付けます 描き上げます 完成させます
        '''),
        PredicateForm.linking: words(r'''
          作って 建てて 描いて 編んで 組み立てて 削って こしらえて 仕上げて 組んで 設計して 製作して 作り上げて 形作って 彫って 織って 磨き上げて 創って 生み出して
          飾り付けて 描き上げて 完成させて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          作った 建てた 描いた 編んだ 組み立てた 削った こしらえた 仕上げた 組んだ 設計した 製作した 作り上げた 形作った 彫った 織った 磨き上げた 創った 生み出した
          飾り付けた 描き上げた 完成させた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            作りました 建てました 描きました 編みました 組み立てました 削りました こしらえました 仕上げました 組みました 設計しました 製作しました 作り上げました 形作りました
            彫りました 織りました 磨き上げました 創りました 生み出しました 飾り付けました 描き上げました 完成させました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          作り 建て 描き 編み 組み立て 削り こしらえ 仕上げ 組み 設計し 製作し 作り上げ 形作り 彫り 織り 磨き上げ 創り 生み出し 飾り付け 描き上げ 完成させ
        '''),
        PredicateJoint.negative: words(r'''
          作ら 建て 描か 編ま 組み立て 削ら こしらえ 仕上げ 組ま 設計し 製作し 作り上げ 形作ら 彫ら 織ら 磨き上げ 創ら 生み出さ 飾り付け 描き上げ 完成させ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        直す 磨く 手入れする 整える 片付ける 修理する 修繕する 掃除する 拭く 洗う 調整する 締める 点検する 整備する 世話する 大切にする 洗い流す 乾かす 拭き取る 磨き直す
        修理し直す
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          直します 磨きます 手入れします 整えます 片付けます 修理します 修繕します 掃除します 拭きます 洗います 調整します 締めます 点検します 整備します 世話します
          大切にします 洗い流します 乾かします 拭き取ります 磨き直します 修理し直します
        '''),
        PredicateForm.linking: words(r'''
          直して 磨いて 手入れして 整えて 片付けて 修理して 修繕して 掃除して 拭いて 洗って 調整して 締めて 点検して 整備して 世話して 大切にして 洗い流して 乾かして
          拭き取って 磨き直して 修理し直して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          直した 磨いた 手入れした 整えた 片付けた 修理した 修繕した 掃除した 拭いた 洗った 調整した 締めた 点検した 整備した 世話した 大切にした 洗い流した 乾かした
          拭き取った 磨き直した 修理し直した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            直しました 磨きました 手入れしました 整えました 片付けました 修理しました 修繕しました 掃除しました 拭きました 洗いました 調整しました 締めました 点検しました
            整備しました 世話しました 大切にしました 洗い流しました 乾かしました 拭き取りました 磨き直しました 修理し直しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          直し 磨き 手入れし 整え 片付け 修理し 修繕し 掃除し 拭き 洗い 調整し 締め 点検し 整備し 世話し 大切にし 洗い流し 乾かし 拭き取り 磨き直し 修理し直し
        '''),
        PredicateJoint.negative: words(r'''
          直さ 磨か 手入れし 整え 片付け 修理し 修繕し 掃除し 拭か 洗わ 調整し 締め 点検し 整備し 世話し 大切にし 洗い流さ 乾かさ 拭き取ら 磨き直さ 修理し直さ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'売る 手渡す 譲る 並べる 売り払う 売りさばく 売り渡す 差し出す 引き渡す 手放す 売り出す 譲り渡す 取引する 陳列する 並べて売る 卸す'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          売ります 手渡します 譲ります 並べます 売り払います 売りさばきます 売り渡します 差し出します 引き渡します 手放します 売り出します 譲り渡します 取引します 陳列します
          並べて売ります 卸します
        '''),
        PredicateForm.linking: words(r'''
          売って 手渡して 譲って 並べて 売り払って 売りさばいて 売り渡して 差し出して 引き渡して 手放して 売り出して 譲り渡して 取引して 陳列して 並べて売って 卸して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          売った 手渡した 譲った 並べた 売り払った 売りさばいた 売り渡した 差し出した 引き渡した 手放した 売り出した 譲り渡した 取引した 陳列した 並べて売った 卸した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            売りました 手渡しました 譲りました 並べました 売り払いました 売りさばきました 売り渡しました 差し出しました 引き渡しました 手放しました 売り出しました 譲り渡しました
            取引しました 陳列しました 並べて売りました 卸しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(
          r'売り 手渡し 譲り 並べ 売り払い 売りさばき 売り渡し 差し出し 引き渡し 手放し 売り出し 譲り渡し 取引し 陳列し 並べて売り 卸し',
        ),
        PredicateJoint.negative: words(
          r'売ら 手渡さ 譲ら 並べ 売り払わ 売りさばか 売り渡さ 差し出さ 引き渡さ 手放さ 売り出さ 譲り渡さ 取引し 陳列し 並べて売ら 卸さ',
        ),
      },
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'''
        買う 買い求める 手に入れる 仕入れる 購入する 注文する 買い込む 買い付ける 買い占める 買い揃える 買い足す 支払う 買って帰る 値切る 予約する
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          買います 買い求めます 手に入れます 仕入れます 購入します 注文します 買い込みます 買い付けます 買い占めます 買い揃えます 買い足します 支払います 買って帰ります
          値切ります 予約します
        '''),
        PredicateForm.linking: words(r'''
          買って 買い求めて 手に入れて 仕入れて 購入して 注文して 買い込んで 買い付けて 買い占めて 買い揃えて 買い足して 支払って 買って帰って 値切って 予約して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          買った 買い求めた 手に入れた 仕入れた 購入した 注文した 買い込んだ 買い付けた 買い占めた 買い揃えた 買い足した 支払った 買って帰った 値切った 予約した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            買いました 買い求めました 手に入れました 仕入れました 購入しました 注文しました 買い込みました 買い付けました 買い占めました 買い揃えました 買い足しました
            支払いました 買って帰りました 値切りました 予約しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(
          r'買い 買い求め 手に入れ 仕入れ 購入し 注文し 買い込み 買い付け 買い占め 買い揃え 買い足し 支払い 買って帰り 値切り 予約し',
        ),
        PredicateJoint.negative: words(
          r'買わ 買い求め 手に入れ 仕入れ 購入し 注文し 買い込ま 買い付け 買い占め 買い揃え 買い足さ 支払わ 買って帰ら 値切ら 予約し',
        ),
      },
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        焼く 温める 煮る 料理する 切る 盛る 炒める 煮込む 蒸す 揚げる 茹でる 刻む 混ぜる 味付けする 調理する 炊く 温め直す 盛り付ける 味見する かき混ぜる ひっくり返す 注ぐ
        刻んで入れる 仕込む 用意する
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          焼きます 温めます 煮ます 料理します 切ります 盛ります 炒めます 煮込みます 蒸します 揚げます 茹でます 刻みます 混ぜます 味付けします 調理します 炊きます 温め直します
          盛り付けます 味見します かき混ぜます ひっくり返します 注ぎます 刻んで入れます 仕込みます 用意します
        '''),
        PredicateForm.linking: words(r'''
          焼いて 温めて 煮て 料理して 切って 盛って 炒めて 煮込んで 蒸して 揚げて 茹でて 刻んで 混ぜて 味付けして 調理して 炊いて 温め直して 盛り付けて 味見して かき混ぜて
          ひっくり返して 注いで 刻んで入れて 仕込んで 用意して
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          焼いた 温めた 煮た 料理した 切った 盛った 炒めた 煮込んだ 蒸した 揚げた 茹でた 刻んだ 混ぜた 味付けした 調理した 炊いた 温め直した 盛り付けた 味見した かき混ぜた
          ひっくり返した 注いだ 刻んで入れた 仕込んだ 用意した
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            焼きました 温めました 煮ました 料理しました 切りました 盛りました 炒めました 煮込みました 蒸しました 揚げました 茹でました 刻みました 混ぜました 味付けしました
            調理しました 炊きました 温め直しました 盛り付けました 味見しました かき混ぜました ひっくり返しました 注ぎました 刻んで入れました 仕込みました 用意しました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          焼き 温め 煮 料理し 切り 盛り 炒め 煮込み 蒸し 揚げ 茹で 刻み 混ぜ 味付けし 調理し 炊き 温め直し 盛り付け 味見し かき混ぜ ひっくり返し 注ぎ 刻んで入れ 仕込み
          用意し
        '''),
        PredicateJoint.negative: words(r'''
          焼か 温め 煮 料理し 切ら 盛ら 炒め 煮込ま 蒸さ 揚げ 茹で 刻ま 混ぜ 味付けし 調理し 炊か 温め直さ 盛り付け 味見し かき混ぜ ひっくり返さ 注が 刻んで入れ 仕込ま
          用意し
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food, WordTheme.fruit, WordTheme.vegetable],
      words: words(r'''
        食べる 噛む 味わう かじる 平らげる 頬張る かじりつく 食べ尽くす つまむ 口に運ぶ 舐める 飲み込む むしゃむしゃ食べる ぱくつく 一口食べる 貪る 噛みしめる 食べてみる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          食べます 噛みます 味わいます かじります 平らげます 頬張ります かじりつきます 食べ尽くします つまみます 口に運びます 舐めます 飲み込みます むしゃむしゃ食べます
          ぱくつきます 一口食べます 貪ります 噛みしめます 食べてみます
        '''),
        PredicateForm.linking: words(r'''
          食べて 噛んで 味わって かじって 平らげて 頬張って かじりついて 食べ尽くして つまんで 口に運んで 舐めて 飲み込んで むしゃむしゃ食べて ぱくついて 一口食べて 貪って
          噛みしめて 食べてみて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          食べた 噛んだ 味わった かじった 平らげた 頬張った かじりついた 食べ尽くした つまんだ 口に運んだ 舐めた 飲み込んだ むしゃむしゃ食べた ぱくついた 一口食べた 貪った
          噛みしめた 食べてみた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            食べました 噛みました 味わいました かじりました 平らげました 頬張りました かじりつきました 食べ尽くしました つまみました 口に運びました 舐めました 飲み込みました
            むしゃむしゃ食べました ぱくつきました 一口食べました 貪りました 噛みしめました 食べてみました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          食べ 噛み 味わい かじり 平らげ 頬張り かじりつき 食べ尽くし つまみ 口に運び 舐め 飲み込み むしゃむしゃ食べ ぱくつき 一口食べ 貪り 噛みしめ 食べてみ
        '''),
        PredicateJoint.negative: words(r'''
          食べ 噛ま 味わわ かじら 平らげ 頬張ら かじりつか 食べ尽くさ つまま 口に運ば 舐め 飲み込ま むしゃむしゃ食べ ぱくつか 一口食べ 貪ら 噛みしめ 食べてみ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        飲む すする 飲み干す 口にする 飲んでみる ごくごく飲む 一口飲む 飲み込む すすり込む 喉に流し込む 味わって飲む 飲み終える こくりと飲む がぶ飲みする ちびちび飲む 一杯やる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          飲みます すすります 飲み干します 口にします 飲んでみます ごくごく飲みます 一口飲みます 飲み込みます すすり込みます 喉に流し込みます 味わって飲みます 飲み終えます
          こくりと飲みます がぶ飲みします ちびちび飲みます 一杯やります
        '''),
        PredicateForm.linking: words(r'''
          飲んで すすって 飲み干して 口にして 飲んでみて ごくごく飲んで 一口飲んで 飲み込んで すすり込んで 喉に流し込んで 味わって飲んで 飲み終えて こくりと飲んで がぶ飲みして
          ちびちび飲んで 一杯やって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          飲んだ すすった 飲み干した 口にした 飲んでみた ごくごく飲んだ 一口飲んだ 飲み込んだ すすり込んだ 喉に流し込んだ 味わって飲んだ 飲み終えた こくりと飲んだ がぶ飲みした
          ちびちび飲んだ 一杯やった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            飲みました すすりました 飲み干しました 口にしました 飲んでみました ごくごく飲みました 一口飲みました 飲み込みました すすり込みました 喉に流し込みました
            味わって飲みました 飲み終えました こくりと飲みました がぶ飲みしました ちびちび飲みました 一杯やりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          飲み すすり 飲み干し 口にし 飲んでみ ごくごく飲み 一口飲み 飲み込み すすり込み 喉に流し込み 味わって飲み 飲み終え こくりと飲み がぶ飲みし ちびちび飲み 一杯やり
        '''),
        PredicateJoint.negative: words(r'''
          飲ま すすら 飲み干さ 口にし 飲んでみ ごくごく飲ま 一口飲ま 飲み込ま すすり込ま 喉に流し込ま 味わって飲ま 飲み終え こくりと飲ま がぶ飲みし ちびちび飲ま 一杯やら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        静まる 暗くなる 明ける 賑わう 色づく 明るくなる 目覚める 眠る 静まり返る にぎやかになる 華やぐ 息を吹き返す 眠りにつく 輝く きらめく 凍りつく 溶ける 濡れる 乾く
        霧に包まれる 光に満ちる 空っぽになる 人であふれる ざわめく 沈む
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          静まります 暗くなります 明けます 賑わいます 色づきます 明るくなります 目覚めます 眠ります 静まり返ります にぎやかになります 華やぎます 息を吹き返します 眠りにつきます
          輝きます きらめきます 凍りつきます 溶けます 濡れます 乾きます 霧に包まれます 光に満ちます 空っぽになります 人であふれます ざわめきます 沈みます
        '''),
        PredicateForm.linking: words(r'''
          静まって 暗くなって 明けて 賑わって 色づいて 明るくなって 目覚めて 眠って 静まり返って にぎやかになって 華やいで 息を吹き返して 眠りについて 輝いて きらめいて
          凍りついて 溶けて 濡れて 乾いて 霧に包まれて 光に満ちて 空っぽになって 人であふれて ざわめいて 沈んで
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          静まった 暗くなった 明けた 賑わった 色づいた 明るくなった 目覚めた 眠った 静まり返った にぎやかになった 華やいだ 息を吹き返した 眠りについた 輝いた きらめいた
          凍りついた 溶けた 濡れた 乾いた 霧に包まれた 光に満ちた 空っぽになった 人であふれた ざわめいた 沈んだ
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            静まりました 暗くなりました 明けました 賑わいました 色づきました 明るくなりました 目覚めました 眠りました 静まり返りました にぎやかになりました 華やぎました
            息を吹き返しました 眠りにつきました 輝きました きらめきました 凍りつきました 溶けました 濡れました 乾きました 霧に包まれました 光に満ちました 空っぽになりました
            人であふれました ざわめきました 沈みました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          静まり 暗くなり 明け 賑わい 色づき 明るくなり 目覚め 眠り 静まり返り にぎやかになり 華やぎ 息を吹き返し 眠りにつき 輝き きらめき 凍りつき 溶け 濡れ 乾き
          霧に包まれ 光に満ち 空っぽになり 人であふれ ざわめき 沈み
        '''),
        PredicateJoint.negative: words(r'''
          静まら 暗くなら 明け 賑わわ 色づか 明るくなら 目覚め 眠ら 静まり返ら にぎやかになら 華やが 息を吹き返さ 眠りにつか 輝か きらめか 凍りつか 溶け 濡れ 乾か
          霧に包まれ 光に満ち 空っぽになら 人であふれ ざわめか 沈ま
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        光る 流れる 暮れる 深まる 始まる 終わる 続く 過ぎる 止まる 近づく 遠ざかる 訪れる 終わりに近づく 繰り返す 長引く 終わりを迎える 移ろう 巡る 過ぎ去る 明ける 迫る
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          光ります 流れます 暮れます 深まります 始まります 終わります 続きます 過ぎます 止まります 近づきます 遠ざかります 訪れます 終わりに近づきます 繰り返します 長引きます
          終わりを迎えます 移ろいます 巡ります 過ぎ去ります 明けます 迫ります
        '''),
        PredicateForm.linking: words(r'''
          光って 流れて 暮れて 深まって 始まって 終わって 続いて 過ぎて 止まって 近づいて 遠ざかって 訪れて 終わりに近づいて 繰り返して 長引いて 終わりを迎えて 移ろって
          巡って 過ぎ去って 明けて 迫って
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          光った 流れた 暮れた 深まった 始まった 終わった 続いた 過ぎた 止まった 近づいた 遠ざかった 訪れた 終わりに近づいた 繰り返した 長引いた 終わりを迎えた 移ろった
          巡った 過ぎ去った 明けた 迫った
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            光りました 流れました 暮れました 深まりました 始まりました 終わりました 続きました 過ぎました 止まりました 近づきました 遠ざかりました 訪れました
            終わりに近づきました 繰り返しました 長引きました 終わりを迎えました 移ろいました 巡りました 過ぎ去りました 明けました 迫りました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          光り 流れ 暮れ 深まり 始まり 終わり 続き 過ぎ 止まり 近づき 遠ざかり 訪れ 終わりに近づき 繰り返し 長引き 終わりを迎え 移ろい 巡り 過ぎ去り 明け 迫り
        '''),
        PredicateJoint.negative: words(r'''
          光ら 流れ 暮れ 深まら 始まら 終わら 続か 過ぎ 止まら 近づか 遠ざから 訪れ 終わりに近づか 繰り返さ 長引か 終わりを迎え 移ろわ 巡ら 過ぎ去ら 明け 迫ら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.time],
      words: words(r'更ける 暮れていく 深まっていく 傾く 過ぎていく 巡ってくる 明け始める 暮れ始める 移り変わる 幕を開ける'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'更けます 暮れていきます 深まっていきます 傾きます 過ぎていきます 巡ってきます 明け始めます 暮れ始めます 移り変わります 幕を開けます',
        ),
        PredicateForm.linking: words(
          r'更けて 暮れていって 深まっていって 傾いて 過ぎていって 巡ってきて 明け始めて 暮れ始めて 移り変わって 幕を開けて',
        ),
      },
      past: PredicateTense(
        words: words(r'更けた 暮れていった 深まっていった 傾いた 過ぎていった 巡ってきた 明け始めた 暮れ始めた 移り変わった 幕を開けた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            更けました 暮れていきました 深まっていきました 傾きました 過ぎていきました 巡ってきました 明け始めました 暮れ始めました 移り変わりました 幕を開けました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'更け 暮れていき 深まっていき 傾き 過ぎていき 巡ってき 明け始め 暮れ始め 移り変わり 幕を開け'),
        PredicateJoint.negative: words(r'更け 暮れていか 深まっていか 傾か 過ぎていか 巡ってこ 明け始め 暮れ始め 移り変わら 幕を開け'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.weather],
      words: words(r'やってくる 近づいてくる 遠のく 収まる 強まる 弱まる 晴れる 吹き荒れる 立ち込める 去っていく 通り過ぎる 迫ってくる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          やってきます 近づいてきます 遠のきます 収まります 強まります 弱まります 晴れます 吹き荒れます 立ち込めます 去っていきます 通り過ぎます 迫ってきます
        '''),
        PredicateForm.linking: words(
          r'やってきて 近づいてきて 遠のいて 収まって 強まって 弱まって 晴れて 吹き荒れて 立ち込めて 去っていって 通り過ぎて 迫ってきて',
        ),
      },
      past: PredicateTense(
        words: words(r'やってきた 近づいてきた 遠のいた 収まった 強まった 弱まった 晴れた 吹き荒れた 立ち込めた 去っていった 通り過ぎた 迫ってきた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            やってきました 近づいてきました 遠のきました 収まりました 強まりました 弱まりました 晴れました 吹き荒れました 立ち込めました 去っていきました 通り過ぎました
            迫ってきました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'やってき 近づいてき 遠のき 収まり 強まり 弱まり 晴れ 吹き荒れ 立ち込め 去っていき 通り過ぎ 迫ってき'),
        PredicateJoint.negative: words(r'やってこ 近づいてこ 遠のか 収まら 強まら 弱まら 晴れ 吹き荒れ 立ち込め 去っていか 通り過ぎ 迫ってこ'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.sport],
      words: words(r'開幕する 白熱する 盛り上がる 終了する 幕を閉じる 再開する 行われる 佳境に入る 幕が上がる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'開幕します 白熱します 盛り上がります 終了します 幕を閉じます 再開します 行われます 佳境に入ります 幕が上がります',
        ),
        PredicateForm.linking: words(r'開幕して 白熱して 盛り上がって 終了して 幕を閉じて 再開して 行われて 佳境に入って 幕が上がって'),
      },
      past: PredicateTense(
        words: words(r'開幕した 白熱した 盛り上がった 終了した 幕を閉じた 再開した 行われた 佳境に入った 幕が上がった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(
            r'開幕しました 白熱しました 盛り上がりました 終了しました 幕を閉じました 再開しました 行われました 佳境に入りました 幕が上がりました',
          ),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'開幕し 白熱し 盛り上がり 終了し 幕を閉じ 再開し 行われ 佳境に入り 幕が上がり'),
        PredicateJoint.negative: words(r'開幕し 白熱し 盛り上がら 終了し 幕を閉じ 再開し 行われ 佳境に入ら 幕が上がら'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[
        WordTheme.object,
        WordTheme.tool,
        WordTheme.clothing,
        WordTheme.product,
        WordTheme.beauty,
        WordTheme.toy,
        WordTheme.furniture,
        WordTheme.gem,
        WordTheme.vehicle,
      ],
      words: words(r'''
        揺れる 輝く 落ちる 転がる 傾く 古びる 光る きらめく ぐらつく 倒れる 滑る 落下する 回る 止まる 揺らめく 色あせる すり減る 曇る くすむ 転がり落ちる 飛んでいく
        跳ね上がる 動く 静止する 揺れ動く ずれる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          揺れます 輝きます 落ちます 転がります 傾きます 古びます 光ります きらめきます ぐらつきます 倒れます 滑ります 落下します 回ります 止まります 揺らめきます 色あせます
          すり減ります 曇ります くすみます 転がり落ちます 飛んでいきます 跳ね上がります 動きます 静止します 揺れ動きます ずれます
        '''),
        PredicateForm.linking: words(r'''
          揺れて 輝いて 落ちて 転がって 傾いて 古びて 光って きらめいて ぐらついて 倒れて 滑って 落下して 回って 止まって 揺らめいて 色あせて すり減って 曇って くすんで
          転がり落ちて 飛んでいって 跳ね上がって 動いて 静止して 揺れ動いて ずれて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          揺れた 輝いた 落ちた 転がった 傾いた 古びた 光った きらめいた ぐらついた 倒れた 滑った 落下した 回った 止まった 揺らめいた 色あせた すり減った 曇った くすんだ
          転がり落ちた 飛んでいった 跳ね上がった 動いた 静止した 揺れ動いた ずれた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            揺れました 輝きました 落ちました 転がりました 傾きました 古びました 光りました きらめきました ぐらつきました 倒れました 滑りました 落下しました 回りました
            止まりました 揺らめきました 色あせました すり減りました 曇りました くすみました 転がり落ちました 飛んでいきました 跳ね上がりました 動きました 静止しました
            揺れ動きました ずれました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          揺れ 輝き 落ち 転がり 傾き 古び 光り きらめき ぐらつき 倒れ 滑り 落下し 回り 止まり 揺らめき 色あせ すり減り 曇り くすみ 転がり落ち 飛んでいき 跳ね上がり 動き
          静止し 揺れ動き ずれ
        '''),
        PredicateJoint.negative: words(r'''
          揺れ 輝か 落ち 転がら 傾か 古び 光ら きらめか ぐらつか 倒れ 滑ら 落下し 回ら 止まら 揺らめか 色あせ すり減ら 曇ら くすま 転がり落ち 飛んでいか 跳ね上がら 動か
          静止し 揺れ動か ずれ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'錆びる きしむ がたつく 壊れる 砕ける 割れる ひび割れる 折れる ひっくり返る 詰まる 引っかかる 音を立てる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          錆びます きしみます がたつきます 壊れます 砕けます 割れます ひび割れます 折れます ひっくり返ります 詰まります 引っかかります 音を立てます
        '''),
        PredicateForm.linking: words(
          r'錆びて きしんで がたついて 壊れて 砕けて 割れて ひび割れて 折れて ひっくり返って 詰まって 引っかかって 音を立てて',
        ),
      },
      past: PredicateTense(
        words: words(r'錆びた きしんだ がたついた 壊れた 砕けた 割れた ひび割れた 折れた ひっくり返った 詰まった 引っかかった 音を立てた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            錆びました きしみました がたつきました 壊れました 砕けました 割れました ひび割れました 折れました ひっくり返りました 詰まりました 引っかかりました 音を立てました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'錆び きしみ がたつき 壊れ 砕け 割れ ひび割れ 折れ ひっくり返り 詰まり 引っかかり 音を立て'),
        PredicateJoint.negative: words(r'錆び きしま がたつか 壊れ 砕け 割れ ひび割れ 折れ ひっくり返ら 詰まら 引っかから 音を立て'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.music, WordTheme.sound],
      words: words(r'''
        響く 鳴る 流れる 響き渡る 聞こえてくる 止まる 静まる 消えていく 高まる 弱まる 繰り返す 漂う 反響する 鳴り響く 続く 始まる 終わる 沈む 広がる 満ちる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          響きます 鳴ります 流れます 響き渡ります 聞こえてきます 止まります 静まります 消えていきます 高まります 弱まります 繰り返します 漂います 反響します 鳴り響きます
          続きます 始まります 終わります 沈みます 広がります 満ちます
        '''),
        PredicateForm.linking: words(r'''
          響いて 鳴って 流れて 響き渡って 聞こえてきて 止まって 静まって 消えていって 高まって 弱まって 繰り返して 漂って 反響して 鳴り響いて 続いて 始まって 終わって 沈んで
          広がって 満ちて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          響いた 鳴った 流れた 響き渡った 聞こえてきた 止まった 静まった 消えていった 高まった 弱まった 繰り返した 漂った 反響した 鳴り響いた 続いた 始まった 終わった 沈んだ
          広がった 満ちた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            響きました 鳴りました 流れました 響き渡りました 聞こえてきました 止まりました 静まりました 消えていきました 高まりました 弱まりました 繰り返しました 漂いました
            反響しました 鳴り響きました 続きました 始まりました 終わりました 沈みました 広がりました 満ちました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          響き 鳴り 流れ 響き渡り 聞こえてき 止まり 静まり 消えていき 高まり 弱まり 繰り返し 漂い 反響し 鳴り響き 続き 始まり 終わり 沈み 広がり 満ち
        '''),
        PredicateJoint.negative: words(r'''
          響か 鳴ら 流れ 響き渡ら 聞こえてこ 止まら 静まら 消えていか 高まら 弱まら 繰り返さ 漂わ 反響し 鳴り響か 続か 始まら 終わら 沈ま 広がら 満ち
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        走る 止まる 通る 戻る 出発する 滑る 動く 進む 出ていく 到着する 去る 発車する 停車する 加速する 減速する 曲がる 揺れる がたがた揺れる 通り過ぎる 近づく 遠ざかる
        引き返す 入ってくる 走り去る 滑り込む 速度を落とす 走り出す 停まる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          走ります 止まります 通ります 戻ります 出発します 滑ります 動きます 進みます 出ていきます 到着します 去ります 発車します 停車します 加速します 減速します 曲がります
          揺れます がたがた揺れます 通り過ぎます 近づきます 遠ざかります 引き返します 入ってきます 走り去ります 滑り込みます 速度を落とします 走り出します 停まります
        '''),
        PredicateForm.linking: words(r'''
          走って 止まって 通って 戻って 出発して 滑って 動いて 進んで 出ていって 到着して 去って 発車して 停車して 加速して 減速して 曲がって 揺れて がたがた揺れて
          通り過ぎて 近づいて 遠ざかって 引き返して 入ってきて 走り去って 滑り込んで 速度を落として 走り出して 停まって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          走った 止まった 通った 戻った 出発した 滑った 動いた 進んだ 出ていった 到着した 去った 発車した 停車した 加速した 減速した 曲がった 揺れた がたがた揺れた
          通り過ぎた 近づいた 遠ざかった 引き返した 入ってきた 走り去った 滑り込んだ 速度を落とした 走り出した 停まった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            走りました 止まりました 通りました 戻りました 出発しました 滑りました 動きました 進みました 出ていきました 到着しました 去りました 発車しました 停車しました
            加速しました 減速しました 曲がりました 揺れました がたがた揺れました 通り過ぎました 近づきました 遠ざかりました 引き返しました 入ってきました 走り去りました
            滑り込みました 速度を落としました 走り出しました 停まりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          走り 止まり 通り 戻り 出発し 滑り 動き 進み 出ていき 到着し 去り 発車し 停車し 加速し 減速し 曲がり 揺れ がたがた揺れ 通り過ぎ 近づき 遠ざかり 引き返し
          入ってき 走り去り 滑り込み 速度を落とし 走り出し 停まり
        '''),
        PredicateJoint.negative: words(r'''
          走ら 止まら 通ら 戻ら 出発し 滑ら 動か 進ま 出ていか 到着し 去ら 発車し 停車し 加速し 減速し 曲がら 揺れ がたがた揺れ 通り過ぎ 近づか 遠ざから 引き返さ
          入ってこ 走り去ら 滑り込ま 速度を落とさ 走り出さ 停まら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        広がる 消える 残る 漂う 深まる 育つ 薄れる 浮かぶ 蘇る 積もる 湧く 押し寄せる 沈む 立ち上る 散る 消え去る 静まる 戻ってくる 膨らむ 揺らぐ 芽生える 募る 薄らぐ
        沸き上がる 忍び寄る 過ぎ去る 高まる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          広がります 消えます 残ります 漂います 深まります 育ちます 薄れます 浮かびます 蘇ります 積もります 湧きます 押し寄せます 沈みます 立ち上ります 散ります 消え去ります
          静まります 戻ってきます 膨らみます 揺らぎます 芽生えます 募ります 薄らぎます 沸き上がります 忍び寄ります 過ぎ去ります 高まります
        '''),
        PredicateForm.linking: words(r'''
          広がって 消えて 残って 漂って 深まって 育って 薄れて 浮かんで 蘇って 積もって 湧いて 押し寄せて 沈んで 立ち上って 散って 消え去って 静まって 戻ってきて 膨らんで
          揺らいで 芽生えて 募って 薄らいで 沸き上がって 忍び寄って 過ぎ去って 高まって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          広がった 消えた 残った 漂った 深まった 育った 薄れた 浮かんだ 蘇った 積もった 湧いた 押し寄せた 沈んだ 立ち上った 散った 消え去った 静まった 戻ってきた 膨らんだ
          揺らいだ 芽生えた 募った 薄らいだ 沸き上がった 忍び寄った 過ぎ去った 高まった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            広がりました 消えました 残りました 漂いました 深まりました 育ちました 薄れました 浮かびました 蘇りました 積もりました 湧きました 押し寄せました 沈みました
            立ち上りました 散りました 消え去りました 静まりました 戻ってきました 膨らみました 揺らぎました 芽生えました 募りました 薄らぎました 沸き上がりました 忍び寄りました
            過ぎ去りました 高まりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          広がり 消え 残り 漂い 深まり 育ち 薄れ 浮かび 蘇り 積もり 湧き 押し寄せ 沈み 立ち上り 散り 消え去り 静まり 戻ってき 膨らみ 揺らぎ 芽生え 募り 薄らぎ
          沸き上がり 忍び寄り 過ぎ去り 高まり
        '''),
        PredicateJoint.negative: words(r'''
          広がら 消え 残ら 漂わ 深まら 育た 薄れ 浮かば 蘇ら 積もら 湧か 押し寄せ 沈ま 立ち上ら 散ら 消え去ら 静まら 戻ってこ 膨らま 揺らが 芽生え 募ら 薄らが
          沸き上がら 忍び寄ら 過ぎ去ら 高まら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        育つ 枯れる 咲く 揺れる 伸びる 芽吹く 芽を出す 花開く ほころぶ 茂る 生い茂る 枯れていく しおれる 乾く 色づく そよぐ なびく 蔓を伸ばす 根を張る 実をつける 実る
        青々と茂る 香る 揺らぐ 花をつける うなだれる 芽生える 咲き誇る 咲き乱れる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          育ちます 枯れます 咲きます 揺れます 伸びます 芽吹きます 芽を出します 花開きます ほころびます 茂ります 生い茂ります 枯れていきます しおれます 乾きます 色づきます
          そよぎます なびきます 蔓を伸ばします 根を張ります 実をつけます 実ります 青々と茂ります 香ります 揺らぎます 花をつけます うなだれます 芽生えます 咲き誇ります
          咲き乱れます
        '''),
        PredicateForm.linking: words(r'''
          育って 枯れて 咲いて 揺れて 伸びて 芽吹いて 芽を出して 花開いて ほころんで 茂って 生い茂って 枯れていって しおれて 乾いて 色づいて そよいで なびいて 蔓を伸ばして
          根を張って 実をつけて 実って 青々と茂って 香って 揺らいで 花をつけて うなだれて 芽生えて 咲き誇って 咲き乱れて
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          育った 枯れた 咲いた 揺れた 伸びた 芽吹いた 芽を出した 花開いた ほころんだ 茂った 生い茂った 枯れていった しおれた 乾いた 色づいた そよいだ なびいた 蔓を伸ばした
          根を張った 実をつけた 実った 青々と茂った 香った 揺らいだ 花をつけた うなだれた 芽生えた 咲き誇った 咲き乱れた
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            育ちました 枯れました 咲きました 揺れました 伸びました 芽吹きました 芽を出しました 花開きました ほころびました 茂りました 生い茂りました 枯れていきました
            しおれました 乾きました 色づきました そよぎました なびきました 蔓を伸ばしました 根を張りました 実をつけました 実りました 青々と茂りました 香りました 揺らぎました
            花をつけました うなだれました 芽生えました 咲き誇りました 咲き乱れました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          育ち 枯れ 咲き 揺れ 伸び 芽吹き 芽を出し 花開き ほころび 茂り 生い茂り 枯れていき しおれ 乾き 色づき そよぎ なびき 蔓を伸ばし 根を張り 実をつけ 実り 青々と茂り
          香り 揺らぎ 花をつけ うなだれ 芽生え 咲き誇り 咲き乱れ
        '''),
        PredicateJoint.negative: words(r'''
          育た 枯れ 咲か 揺れ 伸び 芽吹か 芽を出さ 花開か ほころば 茂ら 生い茂ら 枯れていか しおれ 乾か 色づか そよが なびか 蔓を伸ばさ 根を張ら 実をつけ 実ら 青々と茂ら
          香ら 揺らが 花をつけ うなだれ 芽生え 咲き誇ら 咲き乱れ
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        震える 動く 痺れる 固まる 疼く ずきずきする ひりひりする こわばる ほぐれる ゆるむ 温まる 冷える むくむ 腫れる かゆくなる 汗ばむ 鳴る 疲れる 休まる 軽くなる 重くなる
        縮む 伸びる ぴくぴくする ほてる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          震えます 動きます 痺れます 固まります 疼きます ずきずきします ひりひりします こわばります ほぐれます ゆるみます 温まります 冷えます むくみます 腫れます かゆくなります
          汗ばみます 鳴ります 疲れます 休まります 軽くなります 重くなります 縮みます 伸びます ぴくぴくします ほてります
        '''),
        PredicateForm.linking: words(r'''
          震えて 動いて 痺れて 固まって 疼いて ずきずきして ひりひりして こわばって ほぐれて ゆるんで 温まって 冷えて むくんで 腫れて かゆくなって 汗ばんで 鳴って 疲れて
          休まって 軽くなって 重くなって 縮んで 伸びて ぴくぴくして ほてって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          震えた 動いた 痺れた 固まった 疼いた ずきずきした ひりひりした こわばった ほぐれた ゆるんだ 温まった 冷えた むくんだ 腫れた かゆくなった 汗ばんだ 鳴った 疲れた
          休まった 軽くなった 重くなった 縮んだ 伸びた ぴくぴくした ほてった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            震えました 動きました 痺れました 固まりました 疼きました ずきずきしました ひりひりしました こわばりました ほぐれました ゆるみました 温まりました 冷えました
            むくみました 腫れました かゆくなりました 汗ばみました 鳴りました 疲れました 休まりました 軽くなりました 重くなりました 縮みました 伸びました ぴくぴくしました
            ほてりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          震え 動き 痺れ 固まり 疼き ずきずきし ひりひりし こわばり ほぐれ ゆるみ 温まり 冷え むくみ 腫れ かゆくなり 汗ばみ 鳴り 疲れ 休まり 軽くなり 重くなり 縮み 伸び
          ぴくぴくし ほてり
        '''),
        PredicateJoint.negative: words(r'''
          震え 動か 痺れ 固まら 疼か ずきずきし ひりひりし こわばら ほぐれ ゆるま 温まら 冷え むくま 腫れ かゆくなら 汗ばま 鳴ら 疲れ 休まら 軽くなら 重くなら 縮ま 伸び
          ぴくぴくし ほてら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food, WordTheme.drink],
      words: words(r'''
        熟れる 冷める 煮える 溶ける 傷む 温まる 湯気を立てる 冷たくなる 温かくなる ぬるくなる 減る 尽きる 残る 香る 匂う 用意される 出てくる 並ぶ 固まる 腐る 変わる
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          熟れます 冷めます 煮えます 溶けます 傷みます 温まります 湯気を立てます 冷たくなります 温かくなります ぬるくなります 減ります 尽きます 残ります 香ります 匂います
          用意されます 出てきます 並びます 固まります 腐ります 変わります
        '''),
        PredicateForm.linking: words(r'''
          熟れて 冷めて 煮えて 溶けて 傷んで 温まって 湯気を立てて 冷たくなって 温かくなって ぬるくなって 減って 尽きて 残って 香って 匂って 用意されて 出てきて 並んで
          固まって 腐って 変わって
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          熟れた 冷めた 煮えた 溶けた 傷んだ 温まった 湯気を立てた 冷たくなった 温かくなった ぬるくなった 減った 尽きた 残った 香った 匂った 用意された 出てきた 並んだ
          固まった 腐った 変わった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            熟れました 冷めました 煮えました 溶けました 傷みました 温まりました 湯気を立てました 冷たくなりました 温かくなりました ぬるくなりました 減りました 尽きました
            残りました 香りました 匂いました 用意されました 出てきました 並びました 固まりました 腐りました 変わりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'''
          熟れ 冷め 煮え 溶け 傷み 温まり 湯気を立て 冷たくなり 温かくなり ぬるくなり 減り 尽き 残り 香り 匂い 用意され 出てき 並び 固まり 腐り 変わり
        '''),
        PredicateJoint.negative: words(r'''
          熟れ 冷め 煮え 溶け 傷ま 温まら 湯気を立て 冷たくなら 温かくなら ぬるくなら 減ら 尽き 残ら 香ら 匂わ 用意され 出てこ 並ば 固まら 腐ら 変わら
        '''),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'焦げる 焼ける 崩れる 乾く 硬くなる 柔らかくなる 膨らむ さくさくになる 冷めていく 焼き上がる 炊ける 蒸れる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          焦げます 焼けます 崩れます 乾きます 硬くなります 柔らかくなります 膨らみます さくさくになります 冷めていきます 焼き上がります 炊けます 蒸れます
        '''),
        PredicateForm.linking: words(
          r'焦げて 焼けて 崩れて 乾いて 硬くなって 柔らかくなって 膨らんで さくさくになって 冷めていって 焼き上がって 炊けて 蒸れて',
        ),
      },
      past: PredicateTense(
        words: words(r'焦げた 焼けた 崩れた 乾いた 硬くなった 柔らかくなった 膨らんだ さくさくになった 冷めていった 焼き上がった 炊けた 蒸れた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            焦げました 焼けました 崩れました 乾きました 硬くなりました 柔らかくなりました 膨らみました さくさくになりました 冷めていきました 焼き上がりました 炊けました
            蒸れました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'焦げ 焼け 崩れ 乾き 硬くなり 柔らかくなり 膨らみ さくさくになり 冷めていき 焼き上がり 炊け 蒸れ'),
        PredicateJoint.negative: words(r'焦げ 焼け 崩れ 乾か 硬くなら 柔らかくなら 膨らま さくさくになら 冷めていか 焼き上がら 炊け 蒸れ'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'泡立つ こぼれる あふれる 揺れる 波打つ 凍る 冷めていく 湯気を上げる 気が抜ける 濁る 澄む 泡が消える'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          泡立ちます こぼれます あふれます 揺れます 波打ちます 凍ります 冷めていきます 湯気を上げます 気が抜けます 濁ります 澄みます 泡が消えます
        '''),
        PredicateForm.linking: words(
          r'泡立って こぼれて あふれて 揺れて 波打って 凍って 冷めていって 湯気を上げて 気が抜けて 濁って 澄んで 泡が消えて',
        ),
      },
      past: PredicateTense(
        words: words(r'泡立った こぼれた あふれた 揺れた 波打った 凍った 冷めていった 湯気を上げた 気が抜けた 濁った 澄んだ 泡が消えた'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            泡立ちました こぼれました あふれました 揺れました 波打ちました 凍りました 冷めていきました 湯気を上げました 気が抜けました 濁りました 澄みました 泡が消えました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'泡立ち こぼれ あふれ 揺れ 波打ち 凍り 冷めていき 湯気を上げ 気が抜け 濁り 澄み 泡が消え'),
        PredicateJoint.negative: words(r'泡立た こぼれ あふれ 揺れ 波打た 凍ら 冷めていか 湯気を上げ 気が抜け 濁ら 澄ま 泡が消え'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.fruit, WordTheme.vegetable],
      words: words(r'傷む 腐る しなびる 干からびる 黒ずむ 変色する かびる 柔らかくなる 冷える 残る 余る 届く 並ぶ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          傷みます 腐ります しなびます 干からびます 黒ずみます 変色します かびます 柔らかくなります 冷えます 残ります 余ります 届きます 並びます
        '''),
        PredicateForm.linking: words(
          r'傷んで 腐って しなびて 干からびて 黒ずんで 変色して かびて 柔らかくなって 冷えて 残って 余って 届いて 並んで',
        ),
      },
      past: PredicateTense(
        words: words(r'傷んだ 腐った しなびた 干からびた 黒ずんだ 変色した かびた 柔らかくなった 冷えた 残った 余った 届いた 並んだ'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            傷みました 腐りました しなびました 干からびました 黒ずみました 変色しました かびました 柔らかくなりました 冷えました 残りました 余りました 届きました 並びました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'傷み 腐り しなび 干からび 黒ずみ 変色し かび 柔らかくなり 冷え 残り 余り 届き 並び'),
        PredicateJoint.negative: words(r'傷ま 腐ら しなび 干からび 黒ずま 変色し かび 柔らかくなら 冷え 残ら 余ら 届か 並ば'),
      },
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.ingredient],
      words: words(r'減る 切れる なくなる 足りなくなる 残る 余る 古くなる 届く 並ぶ 混ざる 用意される 見つかる'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          減ります 切れます なくなります 足りなくなります 残ります 余ります 古くなります 届きます 並びます 混ざります 用意されます 見つかります
        '''),
        PredicateForm.linking: words(
          r'減って 切れて なくなって 足りなくなって 残って 余って 古くなって 届いて 並んで 混ざって 用意されて 見つかって',
        ),
      },
      past: PredicateTense(
        words: words(r'減った 切れた なくなった 足りなくなった 残った 余った 古くなった 届いた 並んだ 混ざった 用意された 見つかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            減りました 切れました なくなりました 足りなくなりました 残りました 余りました 古くなりました 届きました 並びました 混ざりました 用意されました 見つかりました
          '''),
        },
      ),
      joints: <PredicateJoint, WordPool>{
        PredicateJoint.stem: words(r'減り 切れ なくなり 足りなくなり 残り 余り 古くなり 届き 並び 混ざり 用意され 見つかり'),
        PredicateJoint.negative: words(r'減ら 切れ なくなら 足りなくなら 残ら 余ら 古くなら 届か 並ば 混ざら 用意され 見つから'),
      },
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 賢い 優しい 荒々しい 若い 幼い 強い 弱い 大胆だ 臆病だ おとなしい 頑固だ 用心深い たくましい 陽気だ 無口だ
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          大きいです 小さいです 速いです 遅いです 静かです うるさいです 勇敢です 元気です 賢いです 優しいです 荒々しいです 若いです 幼いです 強いです 弱いです 大胆です
          臆病です おとなしいです 頑固です 用心深いです たくましいです 陽気です 無口です
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          大きかった 小さかった 速かった 遅かった 静かだった うるさかった 勇敢だった 元気だった 賢かった 優しかった 荒々しかった 若かった 幼かった 強かった 弱かった 大胆だった
          臆病だった おとなしかった 頑固だった 用心深かった たくましかった 陽気だった 無口だった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            大きかったです 小さかったです 速かったです 遅かったです 静かでした うるさかったです 勇敢でした 元気でした 賢かったです 優しかったです 荒々しかったです 若かったです
            幼かったです 強かったです 弱かったです 大胆でした 臆病でした おとなしかったです 頑固でした 用心深かったです たくましかったです 陽気でした 無口でした
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'空腹だ ひもじい ぺこぺこだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'空腹です ひもじいです ぺこぺこです')},
      past: PredicateTense(
        words: words(r'空腹だった ひもじかった ぺこぺこだった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'空腹でした ひもじかったです ぺこぺこでした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'満腹だ お腹いっぱいだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'満腹です お腹いっぱいです')},
      past: PredicateTense(
        words: words(r'満腹だった お腹いっぱいだった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'満腹でした お腹いっぱいでした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'眠い くたくただ だるい へとへとだ 気だるい 眠たい'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'眠いです くたくたです だるいです へとへとです 気だるいです 眠たいです'),
      },
      past: PredicateTense(
        words: words(r'眠かった くたくただった だるかった へとへとだった 気だるかった 眠たかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'眠かったです くたくたでした だるかったです へとへとでした 気だるかったです 眠たかったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'爽やかだ 元気いっぱいだ 軽やかだ 晴れやかだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'爽やかです 元気いっぱいです 軽やかです 晴れやかです')},
      past: PredicateTense(
        words: words(r'爽やかだった 元気いっぱいだった 軽やかだった 晴れやかだった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'爽やかでした 元気いっぱいでした 軽やかでした 晴れやかでした'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'嬉しい 楽しい 満足だ 幸せだ 穏やかだ 上機嫌だ 心地よい 誇らしい'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'嬉しいです 楽しいです 満足です 幸せです 穏やかです 上機嫌です 心地よいです 誇らしいです'),
      },
      past: PredicateTense(
        words: words(r'嬉しかった 楽しかった 満足だった 幸せだった 穏やかだった 上機嫌だった 心地よかった 誇らしかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(
            r'嬉しかったです 楽しかったです 満足でした 幸せでした 穏やかでした 上機嫌でした 心地よかったです 誇らしかったです',
          ),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'退屈だ もどかしい 不安だ 気がかりだ 落ち着かない 心細い'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'退屈です もどかしいです 不安です 気がかりです 落ち着かないです 心細いです'),
      },
      past: PredicateTense(
        words: words(r'退屈だった もどかしかった 不安だった 気がかりだった 落ち着かなかった 心細かった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'退屈でした もどかしかったです 不安でした 気がかりでした 落ち着かなかったです 心細かったです'),
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
      words: words(r'美しい 珍しい 新しい 見慣れない 愛らしい 不思議だ 立派だ 奇妙だ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'美しいです 珍しいです 新しいです 見慣れないです 愛らしいです 不思議です 立派です 奇妙です'),
      },
      past: PredicateTense(
        words: words(r'美しかった 珍しかった 新しかった 見慣れなかった 愛らしかった 不思議だった 立派だった 奇妙だった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(
            r'美しかったです 珍しかったです 新しかったです 見慣れなかったです 愛らしかったです 不思議でした 立派でした 奇妙でした',
          ),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい 賑やかだ 寂しい 近い 平らだ 薄暗い のどかだ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          広いです 狭いです 静かです 深いです 暗いです 明るいです 遠いです 険しいです 賑やかです 寂しいです 近いです 平らです 薄暗いです のどかです
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          広かった 狭かった 静かだった 深かった 暗かった 明るかった 遠かった 険しかった 賑やかだった 寂しかった 近かった 平らだった 薄暗かった のどかだった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            広かったです 狭かったです 静かでした 深かったです 暗かったです 明るかったです 遠かったです 険しかったです 賑やかでした 寂しかったです 近かったです 平らでした
            薄暗かったです のどかでした
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ 平たい 丸い 鋭い 薄い 分厚い 華やかだ 質素だ 精巧だ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          硬いです 軽いです 重いです 古いです 滑らかです 透明です 丈夫です 平たいです 丸いです 鋭いです 薄いです 分厚いです 華やかです 質素です 精巧です
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          硬かった 軽かった 重かった 古かった 滑らかだった 透明だった 丈夫だった 平たかった 丸かった 鋭かった 薄かった 分厚かった 華やかだった 質素だった 精巧だった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            硬かったです 軽かったです 重かったです 古かったです 滑らかでした 透明でした 丈夫でした 平たかったです 丸かったです 鋭かったです 薄かったです 分厚かったです
            華やかでした 質素でした 精巧でした
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food, WordTheme.drink],
      words: words(r'甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい 苦い ぬるい 濃い まろやかだ 柔らかい 新鮮だ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'''
          甘いです しょっぱいです 辛いです 酸っぱいです 熱いです 冷たいです 香ばしいです 苦いです ぬるいです 濃いです まろやかです 柔らかいです 新鮮です
        '''),
      },
      past: PredicateTense(
        words: words(r'''
          甘かった しょっぱかった 辛かった 酸っぱかった 熱かった 冷たかった 香ばしかった 苦かった ぬるかった 濃かった まろやかだった 柔らかかった 新鮮だった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            甘かったです しょっぱかったです 辛かったです 酸っぱかったです 熱かったです 冷たかったです 香ばしかったです 苦かったです ぬるかったです 濃かったです まろやかでした
            柔らかかったです 新鮮でした
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.fruit, WordTheme.vegetable],
      words: words(r'新鮮だ みずみずしい おいしい 柔らかい 硬い 大きい 小さい 冷たい 安い 高い 旬だ 食べ頃だ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'新鮮です みずみずしいです おいしいです 柔らかいです 硬いです 大きいです 小さいです 冷たいです 安いです 高いです 旬です 食べ頃です',
        ),
      },
      past: PredicateTense(
        words: words(r'''
          新鮮だった みずみずしかった おいしかった 柔らかかった 硬かった 大きかった 小さかった 冷たかった 安かった 高かった 旬だった 食べ頃だった
        '''),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            新鮮でした みずみずしかったです おいしかったです 柔らかかったです 硬かったです 大きかったです 小さかったです 冷たかったです 安かったです 高かったです 旬でした
            食べ頃でした
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.ingredient],
      words: words(r'高い 安い 手頃だ 高級だ 上質だ 貴重だ 必要だ 十分だ 少ない 多い 足りない 古い'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'高いです 安いです 手頃です 高級です 上質です 貴重です 必要です 十分です 少ないです 多いです 足りないです 古いです',
        ),
      },
      past: PredicateTense(
        words: words(r'高かった 安かった 手頃だった 高級だった 上質だった 貴重だった 必要だった 十分だった 少なかった 多かった 足りなかった 古かった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            高かったです 安かったです 手頃でした 高級でした 上質でした 貴重でした 必要でした 十分でした 少なかったです 多かったです 足りなかったです 古かったです
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'難しい 易しい 明らかだ 曖昧だ 永遠だ はかない 単純だ 複雑だ 懐かしい 密かだ 些細だ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(
          r'難しいです 易しいです 明らかです 曖昧です 永遠です はかないです 単純です 複雑です 懐かしいです 密かです 些細です',
        ),
      },
      past: PredicateTense(
        words: words(r'難しかった 易しかった 明らかだった 曖昧だった 永遠だった はかなかった 単純だった 複雑だった 懐かしかった 密かだった 些細だった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'''
            難しかったです 易しかったです 明らかでした 曖昧でした 永遠でした はかなかったです 単純でした 複雑でした 懐かしかったです 密かでした 些細でした
          '''),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'青い 香しい 瑞々しい 高い 細い 淡い 大きい'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'青いです 香しいです 瑞々しいです 高いです 細いです 淡いです 大きいです'),
      },
      past: PredicateTense(
        words: words(r'青かった 香しかった 瑞々しかった 高かった 細かった 淡かった 大きかった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'青かったです 香しかったです 瑞々しかったです 高かったです 細かったです 淡かったです 大きかったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'温かい 冷たい 痛い 硬い しなやかだ 青白い 力強い 細い'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'温かいです 冷たいです 痛いです 硬いです しなやかです 青白いです 力強いです 細いです'),
      },
      past: PredicateTense(
        words: words(r'温かかった 冷たかった 痛かった 硬かった しなやかだった 青白かった 力強かった 細かった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(
            r'温かかったです 冷たかったです 痛かったです 硬かったです しなやかでした 青白かったです 力強かったです 細かったです',
          ),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.find, VerbField.arrive],
      words: words(r'よい 幸運だ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'よいです 幸運です')},
      past: PredicateTense(
        words: words(r'よかった 幸運だった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'よかったです 幸運でした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.find, VerbField.look],
      words: words(r'不思議だ 珍しい 意外だ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'不思議です 珍しいです 意外です')},
      past: PredicateTense(
        words: words(r'不思議だった 珍しかった 意外だった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'不思議でした 珍しかったです 意外でした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.lose],
      words: words(r'残念だ 悲しい 惜しい 心細い'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'残念です 悲しいです 惜しいです 心細いです')},
      past: PredicateTense(
        words: words(r'残念だった 悲しかった 惜しかった 心細かった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'残念でした 悲しかったです 惜しかったです 心細かったです'),
        },
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.eat, VerbField.cook],
      words: words(r'おいしい うまい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'おいしいです うまいです')},
      past: PredicateTense(
        words: words(r'おいしかった うまかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'おいしかったです うまかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.drink],
      words: words(r'おいしい 爽やかだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'おいしいです 爽やかです')},
      past: PredicateTense(
        words: words(r'おいしかった 爽やかだった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'おいしかったです 爽やかでした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.meet, VerbField.talk],
      words: words(r'嬉しい 楽しい 和やかだ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'嬉しいです 楽しいです 和やかです')},
      past: PredicateTense(
        words: words(r'嬉しかった 楽しかった 和やかだった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'嬉しかったです 楽しかったです 和やかでした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.rest, VerbField.sleep],
      words: words(r'心地よい 穏やかだ 快適だ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'心地よいです 穏やかです 快適です')},
      past: PredicateTense(
        words: words(r'心地よかった 穏やかだった 快適だった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'心地よかったです 穏やかでした 快適でした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[
        VerbField.make,
        VerbField.tend,
        VerbField.sell,
        VerbField.hide,
        VerbField.buy,
      ],
      words: words(r'満足だ 誇らしい すがすがしい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'満足です 誇らしいです すがすがしいです')},
      past: PredicateTense(
        words: words(r'満足だった 誇らしかった すがすがしかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'満足でした 誇らしかったです すがすがしかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.rise, VerbField.go, VerbField.move, VerbField.play],
      words: words(r'爽やかだ 楽しい 気持ちよい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'爽やかです 楽しいです 気持ちよいです')},
      past: PredicateTense(
        words: words(r'爽やかだった 楽しかった 気持ちよかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'爽やかでした 楽しかったです 気持ちよかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.search, VerbField.wait],
      words: words(r'退屈だ 心細い もどかしい'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'退屈です 心細いです もどかしいです')},
      past: PredicateTense(
        words: words(r'退屈だった 心細かった もどかしかった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'退屈でした 心細かったです もどかしかったです')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      after: const <VerbField>[VerbField.think, VerbField.look],
      words: words(r'不思議だ 妙だ'),
      forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'不思議です 妙です')},
      past: PredicateTense(
        words: words(r'不思議だった 妙だった'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'不思議でした 妙でした')},
      ),
    ),
    StateGroup(
      subject: const <NounClass>[],
      impersonal: true,
      words: words(r'静かだ 穏やかだ 寒い 暖かい 涼しい のどかだ'),
      forms: <PredicateForm, WordPool>{
        PredicateForm.polite: words(r'静かです 穏やかです 寒いです 暖かいです 涼しいです のどかです'),
      },
      past: PredicateTense(
        words: words(r'静かだった 穏やかだった 寒かった 暖かかった 涼しかった のどかだった'),
        forms: <PredicateForm, WordPool>{
          PredicateForm.polite: words(r'静かでした 穏やかでした 寒かったです 暖かかったです 涼しかったです のどかでした'),
        },
      ),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        勇敢な 元気な 優しい 働き者の 怠け者の 恥ずかしがりの 賢い 若い 年老いた 小さな 大きな 静かな 陽気な のんびりした 素早い 好奇心旺盛な 大胆な 臆病な 用心深い 気ままな
        律儀な 頑固な おとなしい 騒がしい たくましい ひょろ長い ふくよかな 痩せた 眠そうな ずる賢い 落ち着いた 無邪気な 生意気な 誇らしげな 物静かな
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'''
        若い 親切な 厳しい 真面目な 忙しい 誠実な 賢明な 気さくな 無口な おしゃべりな 慎ましい 腕利きの 名高い 貧しい 裕福な 正直な 老いた 若々しい 温厚な 気難しい
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'素早い 荒々しい 大人しい 小柄な 丸々した 毛むくじゃらの 斑の 縞模様の 痩せこけた つやつやした 巨大な すばしこい ふさふさの 細長い'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        甘い 辛い 温かい 新鮮な 香ばしい 熱い しょっぱい 柔らかい みずみずしい 熟れた おいしそうな こんがりした もちもちの さくさくの こってりした あっさりした 濃厚な 香り高い
        焼きたての 湯気の立つ 素朴な 彩り豊かな ぴりっとした 冷めた
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.fruit, WordTheme.vegetable],
      words: words(r'''
        新鮮な みずみずしい 採れたての 旬の 生の 大きな 小さな 立派な 冷えた 傷んだ しなびた 国産の 地元の 安い 珍しい 形のよい おいしそうな 山盛りの
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.ingredient],
      words: words(r'''
        高級な 上質な 国産の 外国産の 地元の 本場の 特製の 定番の 少量の たっぷりの 大量の 残りの 使いかけの 買い置きの 業務用の 新しい 古い 安い 珍しい
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        甘い 温かい 冷たい 熱い 香り高い 新鮮な 濃い 苦い ぬるい 冷えた 泡立つ 澄んだ 濁った 甘酸っぱい 香ばしい 渋い すっきりした まろやかな
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        古い 新しい 小さな 大きな 軽い 重い きらめく 滑らかな 透明な 硬い 美しい 大切な 古びた 錆びた 使い込んだ 磨かれた 質素な 華やかな 細長い 平たい 丸い 尖った 薄い
        分厚い 壊れやすい 埃をかぶった 曲がった 精巧な
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'速い 遅い 頑丈な がたがたの 軋む 光る 錆びついた 静かな 揺れる 立派な'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        静かな 広い 暗い 明るい 見知らぬ 古い 心地よい ひっそりした 賑やかな 遠い 近い 空っぽの 寂しい 日当たりのよい 狭い 混み合った 風の強い 霧深い 木陰の 埃っぽい 湿った
        岩だらけの 険しい 平らな 荒れ果てた 緑豊かな 人けのない 見晴らしのよい
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        青い 茂った 香しい 若い 枯れた 大きな 小さな 瑞々しい とげのある 花盛りの 芽吹いた 這う 野生の 細い 色あせた 垂れ下がった よじ登る 咲き誇る
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        かすかな 古い 新しい 見知らぬ 明らかな 大切な 小さな 奇妙な 曖昧な 淡い 単純な 込み入った 頑なな はかない 遠い 大胆な 密かな 静かな 懐かしい
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'長い 短い 静かな 晴れた 曇った 騒がしい 突然の 華やかな 厳かな 楽しい 退屈な 雨の 嵐の 穏やかな 忙しない のどかな 賑やかな'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'小さな 冷たい 温かい 細い 丈夫な しなやかな こわばった 痛む 荒れた 滑らかな 青白い 力強い'),
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
      words: words(r'美しい 不思議な 見知らぬ 新しい 愛らしい 見慣れた 奇妙な ありふれた 立派な 慎ましい'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        静かに ゆっくり 速く じっと そっと ひとりで しばらく 急に 慎重に 力強く 素早く 黙って 軽やかに 丁寧に 懸命に のんびり ぼんやり しっかり さらりと ひっそり 悠々と
        きちんと 朗らかに 元気よく こっそり そろそろと こそこそ とぼとぼ せかせか あたふた もじもじ きょろきょろ うろうろ じっくり しみじみ わざと うっかり 思わず ふらりと
        ひょいと さっと ぱっと すたすた のろのろ どっしり 堂々と 誇らしげに 恥ずかしそうに 嬉しそうに 悲しそうに 楽しげに 静々と 淡々と 黙々と 律儀に 丹念に 巧みに 不器用に
        必死に かろうじて ようやく わざわざ しぶしぶ 自然に 器用に 優しく 荒っぽく 冷ややかに 熱心に 夢中で ぼそぼそ
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
        静かに ゆっくり 次第に ふと ずっと しばらく 急に いつも まだ そっと じっと 少しずつ 徐々に だんだん ひっそり ふいに たちまち しばし 長らく ずいぶん やけに ひときわ
        すっかり 淡く ほのかに かすかに はっきり くっきり ぼんやり ゆらゆら きらきら さらさら ふわふわ そよそよ しんしん ざわざわ ひらひら もくもく ゆったり しっとり 静々と
        果てしなく 絶え間なく
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'夜明けに 早朝に 朝に 昼前に 昼に 午後に 夕暮れに 夕方に 夜に 深夜に 真夜中に'),
    any: words(r'''
      春に 夏に 秋に 冬に 週末に 休日に 一日中 元日に 早春に 晩春に 初夏に 真夏に 晩夏に 初秋に 晩秋に 真冬に 晩冬に 梅雨に 花見の頃に 紅葉の頃に 収穫の頃に 祭りの日に
      市の立つ日に 満月の夜に 雨の日に 雪の日に 風の強い日に 晴れた日に 曇りの日に 霧の日に 連休に 休みの日に
    '''),
    past: words(r'''
      昨日 先週 昔 かつて その日 その夜 一昨日 先月 去年 一昨年 先々週 ずっと昔に しばらく前に その朝 その晩 あの頃 当時 去年の春に 去年の夏に 去年の秋に 去年の冬に 数日前に
      少し前に
    '''),
    present: words(r'今日 さっき 明日 来週 今 今朝 今晩 今夜 明後日 来月 来年 今年 今週 今週末 もうすぐ'),
    habitual: words(r'近頃 時々 毎日 毎晩 たいてい しばしば めったに まれに 時折 たまに 毎朝 毎週 毎年 一日おきに 普段は 常に 折に触れて'),
  ),
  homes: words(r'家'),
  join: const SentenceJoin(form: PredicateForm.linking),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'そして また しかも ところで さらに その上 それに おまけに なお'),
    ConnectiveKind.temporal: words(r'やがて すぐに ついに 一方 その後 しばらくして そのうち 次に それから ほどなく 間もなく そのとき'),
    ConnectiveKind.contrastive: words(r'しかし ところが けれども それでも だが でも とはいえ それなのに 逆に 一方で'),
    ConnectiveKind.causal: words(r'だから そこで それで したがって ゆえに その結果 そのため'),
    ConnectiveKind.turn: words(r'すると ちょうどその時 その瞬間 そこへ'),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      フクロウ スズメ カササギ ツバメ ワシ ハヤブサ ツル ハクチョウ カモ キツツキ インコ クジャク チョウ ガ ハチ トンボ テントウムシ コウモリ サギ ペリカン カラス ウグイス
      カワセミ カブトムシ ホタル イヌワシ セミ カゲロウ コガネムシ クワガタ ハエ 蚊 竜 鳳凰 天狗 妖精 精霊 天使 ドラゴン グリフォン 不死鳥 青竜 朱雀 八咫烏 ハーピー
      ペガサス インプ ピクシー ワルキューレ ガーゴイル ハト カモメ 天女 鵺 キジ ハゲワシ コンドル タカ トビ ミミズク オウム フラミンゴ カッコウ ヒバリ メジロ ムクドリ
      ヒヨドリ シジュウカラ コマドリ ツグミ オシドリ トキ コウノトリ ハチドリ アホウドリ ライチョウ バッタ アブ カミキリムシ ミツバチ ワイバーン 堕天使 一反木綿 シルフ
    '''),
    NounTrait.swimmer: words(r'''
      クジラ イルカ サメ カメ アザラシ ペンギン カエル タコ イカ ヒトデ カニ エビ コイ サケ ワニ クラゲ オタマジャクシ ヒキガエル アマガエル フナ ナマズ ライギョ メダカ
      ドジョウ ウナギ アナゴ タチウオ サワラ サンマ タラ 人魚 河童 クラーケン リヴァイアサン マグロ タイ サバ イワシ 金魚 ラッコ アジ ブリ カツオ ヒラメ カレイ フグ アユ
      マス エイ タツノオトシゴ クマノミ アンコウ ウツボ トビウオ カジキ ピラニア シャチ セイウチ アシカ オットセイ ジュゴン マナティー スッポン イモリ ゲンゴロウ アメンボ
      ザリガニ 海坊主 ウンディーネ
    '''),
    NounTrait.crawler: words(r'''
      カメ トカゲ カメレオン ヘビ カタツムリ アリ クモ カニ ワニ カマキリ ミミズ ムカデ ヤスデ サソリ ダニ ノミ カイコ イモムシ サンショウウオ アオダイショウ マムシ コブラ
      ガラガラヘビ ニシキヘビ イグアナ バジリスク ナメクジ ダンゴムシ ケムシ ヒル ヤモリ ハブ ザリガニ ヤドカリ ナマコ スライム 大蛇 ツチノコ
    '''),
    NounTrait.placeless: words(r'''
      氷 波 潮 砂 小石 地震 珊瑚 影 岩盤 間欠泉 噴気孔 鍾乳石 石筍 地平線 水平線 星 太陽 彗星 流星 オーロラ 三日月 星屑 日食 月食 天頂 衛星 星団 星座 軌道 重力 自転
      公転 黒点 太陽風 光年 天体 恒星 天球 黄道 超新星 流星群 満月 新月 半月 上弦 下弦 北極星 土 泥 砂利 埃 空気 光 闇 化石 渦 泡 しぶき さざ波 海流 満潮 干潮 津波
      雪崩 洪水 溶岩 地層 断層 ブラックホール 北斗七星 南十字星 明星 一番星 人工衛星 準惑星 赤色巨星 白色矮星 中性子星 クエーサー 銀河団 暗黒物質 宇宙線 連星 光速 コロナ
      磁気嵐 宇宙ゴミ 噴火 山火事 地滑り 渦潮 パルサー ビッグバン フレア 火球 新星 変光星 重力波 星図 シリウス ベガ アルタイル デネブ ベテルギウス アンタレス スピカ リゲル
      オリオン座 カシオペヤ座 昴 不動産 物件 間取り 屋根 壁 柱 窓 ドア 戸 天井 煙突 軒 雨戸 瓦 梁 塀 尖塔
    '''),
  },
  interjections: words(r'''
    ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、 おやおや、 ふむ、 なるほど、 これは、 ええっ、 うわあ、 まさか、 あれ、
    ほう、 さては、 なんてこと、
  '''),
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
  replies: <SentenceStyle, Map<ReplyCue, WordPool>>{
    SentenceStyle.casual: <ReplyCue, WordPool>{
      ReplyCue.agree: words(r'そうだね そうだよね 私も だよね たしかに そっか なるほど そうそう うん ほんとだね'),
      ReplyCue.cheer: words(r'よかった! やったね! すごい! いいなあ よくやった さすが! おめでとう おつかれ 最高! えらい!'),
      ReplyCue.care: words(r'''
        大丈夫? 少し休んで 無理しないで 何か食べよう 大変だね ゆっくりでいいよ 心配しないで 気をつけて 元気出して ちょっと座って 水飲んで 手伝うよ
      '''),
      ReplyCue.wonder: words(r'本当? まじで? どこで? いつ? それで? まさか! どうやって? どうして? そう? そうなの? それから? なんて?'),
      ReplyCue.answer: words(r'''
        うん、少し ううん、大丈夫 うん、かなり まあまあ ううん、まだ うん、すごく ちょっとね あんまり うん、とても ううん、全然 まあね うん、実は
      '''),
    },
    SentenceStyle.polite: <ReplyCue, WordPool>{
      ReplyCue.agree: words(r'そうですね そうですよね 私もです たしかに なるほど はい 本当ですね そうなんですね'),
      ReplyCue.cheer: words(r'''
        よかったですね! やりましたね! すごいですね! いいですね よくやりましたね さすがですね! おめでとうございます お疲れさまでした 最高ですね!
      '''),
      ReplyCue.care: words(r'''
        大丈夫ですか? 少し休んでください 無理しないでください 何か食べましょう 大変ですね ゆっくりでいいですよ 心配しないでください 気をつけてください 元気を出してください
        少し座ってください 水を飲んでください 手伝いますよ
      '''),
      ReplyCue.wonder: words(r'''
        本当ですか? どこでですか? いつですか? それで? まさか! どうやって? どうしてですか? そうですか? そうなんですか? それから? なんですって?
      '''),
      ReplyCue.answer: words(r'''
        はい、少し いいえ、大丈夫です はい、かなり まあまあです いいえ、まだです はい、とても 少しだけ あまり はい、すごく いいえ、全然 まあ、そうですね はい、実は
      '''),
    },
  },
  listener: const SentenceSpeech(subject: ''),
  homecomings: <SentenceStyle, WordPool>{
    SentenceStyle.casual: words(r'ただいま ただいま！ 帰ったよ やっと家だ 戻ったよ'),
    SentenceStyle.polite: words(r'ただいま戻りました 帰りました ただいまです やっと帰りました'),
  },
  degrees: words(r'とても すごく かなり 少し 本当に ずいぶん 実に なんとも ひどく やけに 大変 相当 ちょっと なかなか 割と 極めて'),
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
    themeCounters: <WordTheme, String>{WordTheme.drink: '杯', WordTheme.ingredient: '種類'},
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
  auxiliaries: <SentenceAuxiliary>[
    SentenceAuxiliary(
      kind: AuxiliaryKind.negative,
      template: '{v}{a}',
      joint: 'negative',
      predicate: AuxiliaryPredicate(
        words: words(r'ない'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'ないです')},
        past: PredicateTense(
          words: words(r'なかった'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'なかったです')},
        ),
      ),
    ),
    SentenceAuxiliary(
      kind: AuxiliaryKind.desire,
      template: '{v}{a}',
      joint: 'stem',
      predicate: AuxiliaryPredicate(
        words: words(r'たがる'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'たがります')},
        past: PredicateTense(
          words: words(r'たがった'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'たがりました')},
        ),
      ),
      unless: const <String>['たがる'],
    ),
    SentenceAuxiliary(
      kind: AuxiliaryKind.begin,
      template: '{v}{a}',
      joint: 'stem',
      predicate: AuxiliaryPredicate(
        words: words(r'始める'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'始めます')},
        past: PredicateTense(
          words: words(r'始めた'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'始めました')},
        ),
      ),
      unless: const <String>['始める', '出す'],
    ),
    SentenceAuxiliary(
      kind: AuxiliaryKind.progressive,
      template: '{v}{a}',
      joint: 'linking',
      predicate: AuxiliaryPredicate(
        words: words(r'いる'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'います')},
        past: PredicateTense(
          words: words(r'いた'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'いました')},
        ),
      ),
      unless: const <String>['いる'],
    ),
    SentenceAuxiliary(
      kind: AuxiliaryKind.attempt,
      template: '{v}{a}',
      joint: 'linking',
      predicate: AuxiliaryPredicate(
        words: words(r'みる'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'みます')},
        past: PredicateTense(
          words: words(r'みた'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'みました')},
        ),
      ),
      unless: const <String>['みる', '見る'],
    ),
    SentenceAuxiliary(
      kind: AuxiliaryKind.completive,
      template: '{v}{a}',
      joint: 'linking',
      predicate: AuxiliaryPredicate(
        words: words(r'しまう'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'しまいます')},
        past: PredicateTense(
          words: words(r'しまった'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'しまいました')},
        ),
      ),
      unless: const <String>['しまう'],
    ),
    SentenceAuxiliary(
      kind: AuxiliaryKind.resolve,
      template: '{v}ことに{a}',
      joint: 'words',
      predicate: AuxiliaryPredicate(
        words: words(r'する'),
        forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'します')},
        past: PredicateTense(
          words: words(r'した'),
          forms: <PredicateForm, WordPool>{PredicateForm.polite: words(r'しました')},
        ),
      ),
    ),
  ],
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
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.degree),
      SentencePart(SentenceSlot.state),
    ], 9),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.state),
    ], 5),
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
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.place, tail: 'で', modifiable: true),
      SentencePart(SentenceSlot.subject, tail: 'が', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.object, tail: 'を', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.verb),
    ], 4),
    SentenceFrame(<SentencePart>[SentencePart(SentenceSlot.state)], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.degree),
      SentencePart(SentenceSlot.state),
    ], 10),
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
        SentencePart(SentenceSlot.subject, tail: 'は', modifiable: true),
        SentencePart(SentenceSlot.degree),
        SentencePart(SentenceSlot.state),
      ],
      6,
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
