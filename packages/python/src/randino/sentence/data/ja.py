"""Japanese sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)

JA = SentenceLanguageData(
    space="",
    capitalize=False,
    terminators={
        "statement": "。",
        "question": "？",
        "exclamation": "！",
        "trailing": "…",
    },
    # The corner brackets, not the curly quotes: Japanese writes 「」 first and
    # 『』 for a quote inside one.
    quotes={"double": ("「", "」"), "single": ("『", "』")},
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                走る 歩く 跳ぶ 泳ぐ 飛ぶ 這う 戻る 去る 止まる 休む 眠る 笑う 泣く 歌う 踊る
                隠れる 待つ 立つ 座る 転がる さまよう 通る 近づく 伸びる 聞く
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                食べる 飲む 噛む 味わう 焼く 温める
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                見る 探す 拾う 運ぶ 触る 守る 選ぶ 動かす 集める
            """),
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                作る 直す 磨く 売る 買う 建てる
            """),
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                覚える 忘れる 想像する 数える
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                光る 流れる 暮れる 明ける 深まる 静まる 色づく
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                揺れる 輝く 落ちる 転がる 傾く 古びる
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                走る 止まる 通る 戻る 出発する 滑る
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                広がる 消える 残る 漂う 深まる
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                育つ 枯れる 咲く 揺れる 伸びる
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                震える 動く 痺れる 固まる
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                熟れる 冷める 煮える 溶ける 傷む
            """),
        ),
    ),
    # Plain predicate forms, so a na-adjective closes on だ where an i-adjective
    # closes on itself. The `word` pools hold the attributive 静かな instead,
    # which cannot end a sentence.
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 眠い 賢い 優しい 荒々しい
            """),
        ),
        StateGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "edible",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("""
                美しい 珍しい 新しい 見慣れない
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                難しい 易しい 明らかだ 曖昧だ 永遠だ はかない
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                青い 香しい 瑞々しい
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                温かい 冷たい 痛い 硬い
            """),
        ),
    ),
    manners=words("""
        静かに ゆっくり 速く じっと そっと ふと 一緒に ひとりで また ずっと しばらく 次第に 急に
        いつも まだ 慎重に 力強く 並んで
    """),
    times=words("""
        夜明けに 朝に 昼に 夕方に 夜に 真夜中に 今日 昨日 明日 春に 夏に 秋に 冬に 週末に さっき
        時々 毎日 夕暮れに
    """),
    connectives=words("そして だから しかし ところが やがて すぐに ついに 一方 また"),
    interjections=words("ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、"),
    pronouns={"n": ("", "それ")},
    pronounless=("person",),
    frames=(
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("object", tail="を", modifiable=True),
                SentencePart("verb"),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("place", tail="で", modifiable=True),
                SentencePart("verb"),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="は", modifiable=True),
                SentencePart("state"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("place", tail="で", modifiable=True),
                SentencePart("object", tail="を", modifiable=True),
                SentencePart("verb"),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("place", tail="で", modifiable=True),
                SentencePart("verb"),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("manner"),
                SentencePart("object", tail="を", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        # Japanese asks with か after the predicate, which is a tag rather than a
        # phrase — no slot could carry it, and the word order does not move.
        SentenceFrame(
            (SentencePart("subject", tail="が", modifiable=True), SentencePart("verb")),
            20,
            mood="question",
            tag="か",
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("object", tail="を", modifiable=True),
                SentencePart("verb"),
            ),
            16,
            mood="question",
            tag="か",
        ),
        SentenceFrame(
            (SentencePart("subject", tail="は", modifiable=True), SentencePart("state")),
            14,
            mood="question",
            tag="か",
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="が", modifiable=True),
                SentencePart("place", tail="で", modifiable=True),
                SentencePart("verb"),
            ),
            12,
            mood="question",
            tag="か",
        ),
    ),
)
