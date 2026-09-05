"""Chinese sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceCalendar,
    SentenceFrame,
    SentenceLanguageData,
    SentenceNumeral,
    SentencePart,
    StateGroup,
    VerbGroup,
)

ZH = SentenceLanguageData(
    space="",
    capitalize=False,
    terminators={
        "statement": "。",
        "question": "？",
        "exclamation": "！",
        "trailing": "…",
    },
    # The curly quotes rather than 「」: these pools are written in simplified
    # Chinese, and horizontal simplified text uses “” — the corner brackets are
    # what Taiwan and Hong Kong write.
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                奔跑 行走 跳跃 游泳 飞翔 爬行 返回 离开 停下 休息 睡觉 微笑 哭泣 歌唱 跳舞 躲藏
                等待 站立 坐下 打滚 徘徊 经过 靠近 倾听
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                吃 喝 咀嚼 品尝 烘烤 加热
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                观看 寻找 捡起 搬运 触摸 守护 挑选 移动 收集
            """),
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                制作 修理 擦拭 出售 购买 建造
            """),
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                记得 忘记 想象 数
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                发光 流淌 变暗 变亮 加深 沉寂 染色
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                摇晃 闪耀 掉落 滚动 倾斜 老化
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                行驶 停下 经过 返回 出发 滑行
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                蔓延 消失 留下 飘荡 加深
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                生长 枯萎 开花 摇曳 舒展
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                颤抖 移动 麻木 僵硬
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                成熟 冷却 沸腾 融化 变质
            """),
        ),
    ),
    # A bare adjective cannot stand as a predicate on its own, so the shape that
    numeral=SentenceNumeral(
        order="after",
        counters={
            "creature": "只",
            "person": "位",
            "plant": "棵",
            "edible": "个",
            "thing": "个",
            "vehicle": "辆",
            "place": "处",
            "event": "次",
            "idea": "种",
            "body": "个",
        },
        count=(2, 12),
        currency="元",
        amounts=(100, 500, 1000, 3000, 5000, 10000, 30000, 50000, 100000),
        group=",",
        gap="",
    ),
    # uses one writes 很 in front of it.
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                大 小 快 慢 安静 吵闹 勇敢 懒 忙 饿 困 凶 温和 聪明
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
                美丽 陌生 新 常见 罕见
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                宽阔 狭窄 平静 深 暗 亮 遥远 陡峭
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                坚硬 轻 重 旧 光滑 透明 结实
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                甜 咸 辣 酸 烫 凉 香
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                简单 明显 模糊 永恒 短暂
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                青翠 茂盛 芬芳 枯黄
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                温暖 冰凉 酸痛 僵硬
            """),
        ),
    ),
    manners=words("""
        安静地 慢慢地 迅速地 静静地 悄悄地 忽然 一起 独自 又 一直 渐渐地 稍稍 总是 仍然 小心地 有力地 并排 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地
        稳稳地 淡淡地 反复 依旧
    """),
    times=words("""
        黎明时 早晨 中午 傍晚 夜里 深夜 今天 昨天 明天 春天 夏天 秋天 冬天 周末 刚才 有时 每天 黄昏时 正午 午夜 上周 下周 最近 从前 假日 整天 每晚
    """),
    connectives=words("""
        然后 所以 但是 不过 于是 后来 接着 同时 终于 而且 可是 因此 然而 结果 随后
    """),
    interjections=words("""
        啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，
    """),
    pronouns={"n": ("", "它")},
    pronounless=("person",),
    # Chinese writes a date largest to smallest and its copula as a word of its own, in
    # front of what it equates the subject to.
    calendar=SentenceCalendar(
        date="Y年M月D日",
        clock="h点mm分",
        years=(2020, 2030),
        copula=StateGroup(
            # An event is a thing that happens on a day, and a lion is not.
            subject=("event",),
            words=words("是"),
        ),
    ),
    frames=(
        # A date and a clock, standing where an adverbial stands.
        SentenceFrame(
            (
                SentencePart("date", head="在"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="在"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        # And the shape that equates the subject to one: `比赛是11点40分。`
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("place", head="在", tail="里", modifiable=True),
                SentencePart("verb"),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="很"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("place", head="在", tail="里", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("place", head="在", tail="里", modifiable=True),
                SentencePart("verb"),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            5,
        ),
        # Chinese asks with 吗 after the whole clause, which is a tag rather than a
        # phrase, and leaves everything in front of it alone.
        SentenceFrame(
            (SentencePart("subject", modifiable=True), SentencePart("verb")),
            20,
            mood="question",
            tag="吗",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            16,
            mood="question",
            tag="吗",
        ),
        SentenceFrame(
            (SentencePart("subject", modifiable=True), SentencePart("state", head="很")),
            14,
            mood="question",
            tag="吗",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("place", head="在", tail="里", modifiable=True),
                SentencePart("verb"),
            ),
            12,
            mood="question",
            tag="吗",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("quantity"),
            ),
            6,
        ),
        SentenceFrame((SentencePart("quantity"), SentencePart("verb")), 5),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("money"),
            ),
            5,
        ),
    ),
)
