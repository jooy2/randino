"""Korean sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentenceNumeral,
    SentencePart,
    StateGroup,
    VerbGroup,
)

KO = SentenceLanguageData(
    space=" ",
    capitalize=False,
    terminators={
        "statement": ".",
        "question": "?",
        "exclamation": "!",
        "trailing": "…",
    },
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    # Plain declarative — the form a written statement takes, rather than the
    # polite 합니다체 a person would speak.
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                달린다 걷는다 뛴다 헤엄친다 날아오른다 기어간다 돌아온다 떠난다 멈춘다 쉰다
                잠잔다 웃는다 운다 노래한다 춤춘다 하품한다 숨는다 기다린다 일어선다 앉는다
                눕는다 뒹군다 서성인다 지나간다 다가온다 뒤척인다 존다 두리번거린다 어슬렁댄다
            """),
            forms={
                "question": words(
                    """
                달리니 걷니 뛰니 헤엄치니 날아오르니 기어가니 돌아오니 떠나니 멈추니 쉬니 잠자니 웃니 우니 노래하니 춤추니 하품하니 숨니
                기다리니 일어서니 앉니 눕니 뒹구니 서성이니 지나가니 다가오니 뒤척이니 조니 두리번거리니 어슬렁대니
            """
                ),
                "polite": words(
                    """
                달립니다 걷습니다 뜁니다 헤엄칩니다 날아오릅니다 기어갑니다 돌아옵니다 떠납니다 멈춥니다 쉽니다 잠잡니다 웃습니다 웁니다 노래합니다
                춤춥니다 하품합니다 숨습니다 기다립니다 일어섭니다 앉습니다 눕습니다 뒹굽니다 서성입니다 지나갑니다 다가옵니다 뒤척입니다 좁니다
                두리번거립니다 어슬렁댑니다
            """
                ),
                "politeQuestion": words(
                    """
                달립니까 걷습니까 뜁니까 헤엄칩니까 날아오릅니까 기어갑니까 돌아옵니까 떠납니까 멈춥니까 쉽니까 잠잡니까 웃습니까 웁니까 노래합니까
                춤춥니까 하품합니까 숨습니까 기다립니까 일어섭니까 앉습니까 눕습니까 뒹굽니까 서성입니까 지나갑니까 다가옵니까 뒤척입니까 좁니까
                두리번거립니까 어슬렁댑니까
            """
                ),
            },
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                먹는다 마신다 씹는다 삼킨다 맛본다 굽는다 데운다
            """),
            forms={
                "question": words("먹니 마시니 씹니 삼키니 맛보니 굽니 데우니"),
                "polite": words("먹습니다 마십니다 씹습니다 삼킵니다 맛봅니다 굽습니다 데웁니다"),
                "politeQuestion": words(
                    "먹습니까 마십니까 씹습니까 삼킵니까 맛봅니까 굽습니까 데웁니까"
                ),
            },
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                본다 바라본다 찾는다 줍는다 옮긴다 만진다 감춘다 지킨다 나른다 챙긴다 고른다
            """),
            forms={
                "question": words(
                    "보니 바라보니 찾니 줍니 옮기니 만지니 감추니 지키니 나르니 챙기니 고르니"
                ),
                "polite": words(
                    "봅니다 바라봅니다 찾습니다 줍습니다 옮깁니다 만집니다 감춥니다 지킵니다 나릅니다 챙깁니다 고릅니다"
                ),
                "politeQuestion": words(
                    "봅니까 바라봅니까 찾습니까 줍습니까 옮깁니까 만집니까 감춥니까 지킵니까 나릅니까 챙깁니까 고릅니까"
                ),
            },
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                만든다 고친다 닦는다 판다 산다 손질한다
            """),
            forms={
                "question": words("만드니 고치니 닦니 파니 사니 손질하니"),
                "polite": words("만듭니다 고칩니다 닦습니다 팝니다 삽니다 손질합니다"),
                "politeQuestion": words("만듭니까 고칩니까 닦습니까 팝니까 삽니까 손질합니까"),
            },
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                꿈꾼다 기억한다 잊는다 상상한다 헤아린다
            """),
            forms={
                "question": words("꿈꾸니 기억하니 잊니 상상하니 헤아리니"),
                "polite": words("꿈꿉니다 기억합니다 잊습니다 상상합니다 헤아립니다"),
                "politeQuestion": words("꿈꿉니까 기억합니까 잊습니까 상상합니까 헤아립니까"),
            },
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                빛난다 흐른다 저문다 밝아온다 깊어진다 조용해진다 물든다
            """),
            forms={
                "question": words("빛나니 흐르니 저무니 밝아오니 깊어지니 조용해지니 물드니"),
                "polite": words(
                    "빛납니다 흐릅니다 저뭅니다 밝아옵니다 깊어집니다 조용해집니다 물듭니다"
                ),
                "politeQuestion": words(
                    "빛납니까 흐릅니까 저뭅니까 밝아옵니까 깊어집니까 조용해집니까 물듭니까"
                ),
            },
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                흔들린다 반짝인다 떨어진다 굴러간다 기울어진다 낡아간다
            """),
            forms={
                "question": words("흔들리니 반짝이니 떨어지니 굴러가니 기울어지니 낡아가니"),
                "polite": words(
                    "흔들립니다 반짝입니다 떨어집니다 굴러갑니다 기울어집니다 낡아갑니다"
                ),
                "politeQuestion": words(
                    "흔들립니까 반짝입니까 떨어집니까 굴러갑니까 기울어집니까 낡아갑니까"
                ),
            },
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                달린다 멈춘다 지나간다 돌아온다 출발한다 미끄러진다
            """),
            forms={
                "question": words("달리니 멈추니 지나가니 돌아오니 출발하니 미끄러지니"),
                "polite": words("달립니다 멈춥니다 지나갑니다 돌아옵니다 출발합니다 미끄러집니다"),
                "politeQuestion": words(
                    "달립니까 멈춥니까 지나갑니까 돌아옵니까 출발합니까 미끄러집니까"
                ),
            },
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                번진다 사라진다 남는다 스며든다 되풀이된다 짙어진다
            """),
            forms={
                "question": words("번지니 사라지니 남니 스며드니 되풀이되니 짙어지니"),
                "polite": words("번집니다 사라집니다 남습니다 스며듭니다 되풀이됩니다 짙어집니다"),
                "politeQuestion": words(
                    "번집니까 사라집니까 남습니까 스며듭니까 되풀이됩니까 짙어집니까"
                ),
            },
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                자란다 시든다 피어난다 흔들린다 뿌리내린다
            """),
            forms={
                "question": words("자라니 시드니 피어나니 흔들리니 뿌리내리니"),
                "polite": words("자랍니다 시듭니다 피어납니다 흔들립니다 뿌리내립니다"),
                "politeQuestion": words("자랍니까 시듭니까 피어납니까 흔들립니까 뿌리내립니까"),
            },
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                떨린다 움직인다 저린다 굳는다
            """),
            forms={
                "question": words("떨리니 움직이니 저리니 굳니"),
                "polite": words("떨립니다 움직입니다 저립니다 굳습니다"),
                "politeQuestion": words("떨립니까 움직입니까 저립니까 굳습니까"),
            },
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                익는다 식는다 끓는다 녹는다 상한다 남는다
            """),
            forms={
                "question": words("익니 식니 끓니 녹니 상하니 남니"),
                "polite": words("익습니다 식습니다 끓습니다 녹습니다 상합니다 남습니다"),
                "politeQuestion": words("익습니까 식습니까 끓습니까 녹습니까 상합니까 남습니까"),
            },
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                크다 작다 빠르다 느리다 조용하다 시끄럽다 용감하다 게으르다 부지런하다 배고프다
                졸리다 사납다 순하다 영리하다
            """),
            forms={
                "question": words(
                    "크니 작니 빠르니 느리니 조용하니 시끄럽니 용감하니 게으르니 부지런하니 배고프니 졸리니 사납니 순하니 영리하니"
                ),
                "polite": words(
                    """
                큽니다 작습니다 빠릅니다 느립니다 조용합니다 시끄럽습니다 용감합니다 게으릅니다 부지런합니다 배고픕니다 졸립니다 사납습니다 순합니다
                영리합니다
            """
                ),
                "politeQuestion": words(
                    """
                큽니까 작습니까 빠릅니까 느립니까 조용합니까 시끄럽습니까 용감합니까 게으릅니까 부지런합니까 배고픕니까 졸립니까 사납습니까 순합니까
                영리합니까
            """
                ),
            },
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
                아름답다 낯설다 새롭다 흔하다 드물다
            """),
            forms={
                "question": words("아름답니 낯서니 새롭니 흔하니 드무니"),
                "polite": words("아름답습니다 낯섭니다 새롭습니다 흔합니다 드뭅니다"),
                "politeQuestion": words("아름답습니까 낯섭니까 새롭습니까 흔합니까 드뭅니까"),
            },
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                넓다 좁다 고요하다 깊다 어둡다 밝다 아득하다 가파르다
            """),
            forms={
                "question": words("넓니 좁니 고요하니 깊니 어둡니 밝니 아득하니 가파르니"),
                "polite": words(
                    "넓습니다 좁습니다 고요합니다 깊습니다 어둡습니다 밝습니다 아득합니다 가파릅니다"
                ),
                "politeQuestion": words(
                    "넓습니까 좁습니까 고요합니까 깊습니까 어둡습니까 밝습니까 아득합니까 가파릅니까"
                ),
            },
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                단단하다 가볍다 무겁다 낡았다 매끈하다 투명하다 튼튼하다
            """),
            forms={
                "question": words("단단하니 가볍니 무겁니 낡았니 매끈하니 투명하니 튼튼하니"),
                "polite": words(
                    "단단합니다 가볍습니다 무겁습니다 낡았습니다 매끈합니다 투명합니다 튼튼합니다"
                ),
                "politeQuestion": words(
                    "단단합니까 가볍습니까 무겁습니까 낡았습니까 매끈합니까 투명합니까 튼튼합니까"
                ),
            },
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                달다 짜다 맵다 시다 뜨겁다 차갑다 고소하다 담백하다
            """),
            forms={
                "question": words("다니 짜니 맵니 시니 뜨겁니 차갑니 고소하니 담백하니"),
                "polite": words(
                    "답니다 짭니다 맵습니다 십니다 뜨겁습니다 차갑습니다 고소합니다 담백합니다"
                ),
                "politeQuestion": words(
                    "답니까 짭니까 맵습니까 십니까 뜨겁습니까 차갑습니까 고소합니까 담백합니까"
                ),
            },
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                어렵다 쉽다 분명하다 흐릿하다 영원하다 덧없다
            """),
            forms={
                "question": words("어렵니 쉽니 분명하니 흐릿하니 영원하니 덧없니"),
                "polite": words("어렵습니다 쉽습니다 분명합니다 흐릿합니다 영원합니다 덧없습니다"),
                "politeQuestion": words(
                    "어렵습니까 쉽습니까 분명합니까 흐릿합니까 영원합니까 덧없습니까"
                ),
            },
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                푸르다 무성하다 향기롭다 시들하다
            """),
            forms={
                "question": words("푸르니 무성하니 향기롭니 시들하니"),
                "polite": words("푸릅니다 무성합니다 향기롭습니다 시들합니다"),
                "politeQuestion": words("푸릅니까 무성합니까 향기롭습니까 시들합니까"),
            },
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                따뜻하다 차갑다 아프다 뻣뻣하다
            """),
            forms={
                "question": words("따뜻하니 차갑니 아프니 뻣뻣하니"),
                "polite": words("따뜻합니다 차갑습니다 아픕니다 뻣뻣합니다"),
                "politeQuestion": words("따뜻합니까 차갑습니까 아픕니까 뻣뻣합니까"),
            },
        ),
    ),
    manners=words("""
        조용히 천천히 빠르게 가만히 슬며시 문득 함께 홀로 다시 계속 잠시 서서히 갑자기 언제나
        여전히 조심스레 힘차게 나란히 살며시 묵묵히 느긋하게 씩씩하게
    """),
    times=words("""
        새벽에 아침에 낮에 저녁에 밤에 한밤중에 오늘 어제 내일 봄에 여름에 가을에 겨울에 주말에
        방금 가끔 매일 해질녘에 이른봄에 늦가을에
    """),
    # What a sentence opens on when it follows another. Written whole, so a
    # language that wants a comma after its connective writes the comma.
    connectives=words("그리고 그래서 하지만 그런데 이윽고 곧 결국 그러자 한편 이내"),
    interjections=words("아, 오, 와, 어머, 이런, 저런, 세상에, 아이고, 참,"),
    # Korean leaves the subject out as readily as it writes 그것, and the empty
    # Korean counts anything, because a classifier is what makes a noun countable:
    # `가지` turns an abstraction into kinds of it. The counter is spaced off the
    # number, which is what 한글 맞춤법 prescribes as the default.
    numeral=SentenceNumeral(
        order="after",
        counters={
            "creature": "마리",
            "person": "명",
            "plant": "그루",
            "edible": "개",
            "thing": "개",
            "vehicle": "대",
            "place": "곳",
            "event": "번",
            "idea": "가지",
            "body": "개",
        },
        count=(2, 12),
        currency="원",
        amounts=(1000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000),
        group=",",
        gap="",
    ),
    # entry is how the data says so.
    pronouns={"n": ("", "그것")},
    pronounless=("person",),
    frames=(
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("object", tail="를", tail_alt="을", modifiable=True),
                SentencePart("verb"),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("place", tail="에서", modifiable=True),
                SentencePart("verb"),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="는", tail_alt="은", modifiable=True),
                SentencePart("state"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("place", tail="에서", modifiable=True),
                SentencePart("object", tail="를", tail_alt="을", modifiable=True),
                SentencePart("verb"),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("place", tail="에서", modifiable=True),
                SentencePart("verb"),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("manner"),
                SentencePart("object", tail="를", tail_alt="을", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        # Korean asks with a different ending on the same predicate, so the shapes
        # are the statement's and the question forms do the rest.
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("verb"),
            ),
            20,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("object", tail="를", tail_alt="을", modifiable=True),
                SentencePart("verb"),
            ),
            16,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="는", tail_alt="은", modifiable=True),
                SentencePart("state"),
            ),
            14,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("place", tail="에서", modifiable=True),
                SentencePart("verb"),
            ),
            12,
            mood="question",
        ),
        # A count and an amount. Money is an object of the verbs that take an idea,
        # which is the class it belongs to.
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("quantity", tail="를", tail_alt="을"),
                SentencePart("verb"),
            ),
            6,
        ),
        SentenceFrame(
            (SentencePart("quantity", tail="가", tail_alt="이"), SentencePart("verb")),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("money", tail="를", tail_alt="을"),
                SentencePart("verb"),
            ),
            5,
        ),
    ),
)
