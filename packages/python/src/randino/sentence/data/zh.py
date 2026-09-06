"""The zh sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    SentenceCalendar,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceNumeral,
    SentenceObjectPronouns,
    SentencePart,
    SentencePastMark,
    SentenceSpeech,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

ZH = SentenceLanguageData(
    space="",
    capitalize=False,
    terminators={"statement": "。", "question": "？", "exclamation": "！", "trailing": "…"},
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    past_mark=SentencePastMark(tail="了"),
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("起床 醒来 起身 站起来"),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("去 前往 赶往"),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            requires="destination",
            words=words("走向 跑向"),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("出发 离开 出门 动身"),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("到达 抵达 回到 来到"),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("返回 归来 回家"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words("奔跑 行走 跳跃 散步 溜达"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("徘徊 经过"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("游泳"),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("飞翔"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("爬行"),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("等待 躲藏 环顾 犹豫 停下 张望"),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("休息 坐下 躺下 靠着 蜷缩 歇息"),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("睡觉 入睡 打盹 睡着"),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("微笑 哭泣 打哈欠 叹气 哼歌 咕哝 喊叫 大笑"),
        ),
        VerbGroup(
            field="talk",
            subject=("creature", "person"),
            words=words("聊天 说话 谈话"),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("跳舞 歌唱 打滚 玩耍 蹦跳 嬉戏"),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("记得 忘记 想象 数 想起 惦记"),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("观看 注视 打量 检查 触摸 抚摸 端详"),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("寻找 搜寻 翻找 找寻"),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("找到 发现 捡起 寻得"),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("挑选 拿起 抓住 拿 取出 收下"),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("搬运 带回 抱着 提着 拿回"),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("藏起 收好 守护 埋起 藏好"),
        ),
        VerbGroup(
            field="lose",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("弄丢 丢失 丢下"),
        ),
        VerbGroup(
            field="meet",
            subject=("creature", "person"),
            object=("person",),
            words=words("遇见 碰见 见到"),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("制作 建造 雕刻 绘制 编织 组装"),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("修理 擦拭 保养 整理 打磨 修补"),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("出售 卖掉 转让 摆卖"),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("购买 买下 买回 采购"),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("烘烤 加热 煮 烹饪 切 盛上"),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("吃 咀嚼 品尝 啃 吃光"),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("喝 啜饮 喝光 品饮"),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("安静下来 变暗 变亮 热闹起来 沉寂 亮起来"),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("发光 流淌 加深 开始 结束 持续 过去"),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("摇晃 闪耀 掉落 滚动 倾斜 老化"),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("行驶 停下 经过 返回 出发 滑行"),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("蔓延 消失 留下 飘荡 加深"),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("生长 枯萎 开花 摇曳 舒展"),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("颤抖 移动 麻木 僵硬"),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("成熟 冷却 沸腾 融化 变质"),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("大 小 快 慢 安静 吵闹 勇敢 懒 忙 凶 温和 聪明"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("饿 饥饿"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("饱 饱足"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("累 困 疲倦 乏"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("精神 神清气爽 有精神"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("高兴 开心 快乐 满足 舒心"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("无聊 好奇 焦急 不安"),
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
            words=words("美丽 陌生 新 常见 罕见"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("宽阔 狭窄 平静 深 暗 亮 遥远 陡峭"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("坚硬 轻 重 旧 光滑 透明 结实"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("甜 咸 辣 酸 烫 凉 香"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("简单 明显 模糊 永恒 短暂"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("青翠 茂盛 芬芳 枯黄"),
        ),
        StateGroup(
            subject=("body",),
            words=words("温暖 冰凉 酸痛 僵硬"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words(
                "勇敢的 安静的 勤劳的 懒惰的 害羞的 聪明的 年轻的 年老的 小 大 活泼的 悠闲的 敏捷的 好奇的"
            ),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("年轻的 亲切的 严厉的 认真的 忙碌的 诚实的"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("敏捷的 凶猛的 温顺的 胖胖的 小小的"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words(
                "甜甜的 香辣的 温热的 新鲜的 酥脆的 香喷喷的 热乎乎的 咸香的 软软的 熟透的 美味的"
            ),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("甜甜的 温热的 冰凉的 清凉的 热的 芬芳的 新鲜的 浓浓的 苦涩的"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words(
                "旧 新 小 大 轻巧的 沉重的 闪亮的 光滑的 透明的 坚硬的 漂亮的 珍贵的 古老的"
            ),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("快速的 缓慢的 结实的"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words(
                "安静的 宽阔的 昏暗的 明亮的 陌生的 古老的 温馨的 僻静的 热闹的 遥远的 附近的 空荡荡的 冷清的 阳光明媚的"
            ),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("翠绿的 茂盛的 芬芳的 幼小的 枯萎的 高大的 小小的 娇嫩的"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("模糊的 古老的 新 陌生的 清晰的 珍贵的 小小的 奇怪的"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("漫长的 短暂的 安静的 晴朗的 阴沉的 喧闹的 突然的"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("小小的 冰凉的 温暖的 纤细的 结实的"),
        ),
        ModifierGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("美丽的 神秘的 陌生的 新"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                安静地 慢慢地 迅速地 静静地 悄悄地 独自 稍稍 小心地 有力地 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地 稳稳地 淡淡地 欣然 悠然
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words(
                "慢慢地 渐渐地 忽然 又 一直 总是 仍然 静静地 悄悄地 缓缓地 依旧 反复 逐渐 悄然"
            ),
        ),
    ),
    times=SentenceTimes(
        day=words("黎明时 清晨 早晨 上午 中午 下午 黄昏时 傍晚 夜里 深夜 午夜"),
        any=words("春天 夏天 秋天 冬天 周末 假日 整天"),
        past=words("昨天 上周 从前 那天 当年 那晚"),
        present=words("今天 刚才 明天 下周"),
        habitual=words("最近 有时 每天 每晚"),
    ),
    homes=words("家"),
    join=SentenceJoin(word="，然后"),
    connectives={
        "additive": words("而且 此外"),
        "temporal": words("然后 后来 接着 同时 终于 随后 不久"),
        "contrastive": words("但是 不过 可是 然而"),
        "causal": words("所以 于是 因此 结果"),
    },
    traits={
        "flier": words("""
            猫头鹰 麻雀 喜鹊 燕子 老鹰 游隼 仙鹤 天鹅 鸭子 啄木鸟 鹦鹉 孔雀 蝴蝶 飞蛾 蜜蜂 蜻蜓 瓢虫 蝙蝠 白鹭 鹈鹕 大雁 乌鸦 云雀 夜莺 翠鸟 火烈鸟 萤火虫 金龟子
            锹甲 萤火 蜉蝣 苍蝇 蚊子 神龙 火龙 冰龙 黑龙 白龙 青龙 凤凰 妖精 精灵 仙女 天使 天马 神鸟 朱雀 三足乌 蛟龙 鸟女 石像鬼 小恶魔 小妖精 女武神
        """),
        "swimmer": words("""
            鲸鱼 海豚 鲨鱼 乌龟 海豹 企鹅 青蛙 章鱼 乌贼 海星 螃蟹 龙虾 鲤鱼 三文鱼 鳄鱼 蝌蚪 蟾蜍 雨蛙 鲫鱼 鲶鱼 黑鱼 鳜鱼 青鳉 泥鳅 鳗鱼 海鳗 带鱼 鲅鱼 秋刀鱼
            凤尾鱼 黄鱼 明太鱼 人鱼 美人鱼 海妖 巨乌贼 海兽王
        """),
        "crawler": words("""
            乌龟 蜥蜴 变色龙 蟒蛇 蜗牛 蚂蚁 蜘蛛 螃蟹 鳄鱼 螳螂 蚯蚓 蜈蚣 马陆 蝎子 壁虱 跳蚤 蚕蛹 毛虫 蝾螈 菜花蛇 蝮蛇 毒蛇 眼镜蛇 响尾蛇 鬣蜥 蛇王
        """),
        "lifeless": words("""
            魔法 魔力 咒语 诅咒 预言 神谕 结界 护符 封印 幻影 陶俑 女神像 御守 咒文字 符咒 阵法 巫术 祈福 前兆 预兆 预言书 神话集 传说集 奇谭集
        """),
    },
    interjections=words("啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，"),
    pronouns={"n": ("", "它")},
    pronounless=("person", "creature"),
    object_pronouns=SentenceObjectPronouns(words={"n": ("",)}),
    speech=SentenceSpeech(subject="我"),
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
    calendar=SentenceCalendar(
        date="Y年M月D日",
        clock="h点mm分",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("是"),
        ),
    ),
    frames=(
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
                SentencePart("verb"),
                SentencePart("destination", modifiable=True),
            ),
            10,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", modifiable=True),
            ),
            5,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
                SentencePart("destination", modifiable=True),
            ),
            4,
            fields=("go", "arrive"),
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
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
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
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="很"),
            ),
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
                SentencePart("destination", modifiable=True),
            ),
            6,
            mood="question",
            tag="吗",
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("quantity"),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("quantity"),
                SentencePart("verb"),
            ),
            5,
        ),
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
