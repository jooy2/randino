"""Korean sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)

KO = SentenceLanguageData(
    space=" ",
    capitalize=False,
    terminator=".",
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
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                먹는다 마신다 씹는다 삼킨다 맛본다 굽는다 데운다
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                본다 바라본다 찾는다 줍는다 옮긴다 만진다 감춘다 지킨다 나른다 챙긴다 고른다
            """),
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                만든다 고친다 닦는다 판다 산다 손질한다
            """),
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                꿈꾼다 기억한다 잊는다 상상한다 헤아린다
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                빛난다 흐른다 저문다 밝아온다 깊어진다 조용해진다 물든다
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                흔들린다 반짝인다 떨어진다 굴러간다 기울어진다 낡아간다
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                달린다 멈춘다 지나간다 돌아온다 출발한다 미끄러진다
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                번진다 사라진다 남는다 스며든다 되풀이된다 짙어진다
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                자란다 시든다 피어난다 흔들린다 뿌리내린다
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                떨린다 움직인다 저린다 굳는다
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                익는다 식는다 끓는다 녹는다 상한다 남는다
            """),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                크다 작다 빠르다 느리다 조용하다 시끄럽다 용감하다 게으르다 부지런하다 배고프다
                졸리다 사납다 순하다 영리하다
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
                아름답다 낯설다 새롭다 흔하다 드물다
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                넓다 좁다 고요하다 깊다 어둡다 밝다 아득하다 가파르다
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                단단하다 가볍다 무겁다 낡았다 매끈하다 투명하다 튼튼하다
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                달다 짜다 맵다 시다 뜨겁다 차갑다 고소하다 담백하다
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                어렵다 쉽다 분명하다 흐릿하다 영원하다 덧없다
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                푸르다 무성하다 향기롭다 시들하다
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                따뜻하다 차갑다 아프다 뻣뻣하다
            """),
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
    ),
)
