"""The ko sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import conjugate, words
from randino.sentence.data._types import (
    ModifierGroup,
    PredicateTense,
    SentenceCalendar,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceNumeral,
    SentencePart,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

# Every Korean past form is one stem and one ending: `달렸` closes on `ㅆ`, and so
# does every other past stem, so the endings attach to all of them alike.
_PAST = {
    "statement": "다",
    "question": "니|나|는가",
    "exclamation": "구나|네|군",
    "casual": "어",
    "casualQuestion": "어|지",
    "polite": "어요",
    "politeQuestion": "어요|죠",
    "formal": "습니다",
    "formalQuestion": "습니까",
}

KO = SentenceLanguageData(
    space=" ",
    capitalize=False,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("일어난다 일어선다 깨어난다 눈뜬다"),
            forms={
                "question": words(
                    "일어나니|일어나나|일어나는가 일어서니|일어서나|일어서는가 깨어나니|깨어나나|깨어나는가 눈뜨니|눈뜨나|눈뜨는가"
                ),
                "exclamation": words("""
                    일어나는구나|일어나네|일어나는군 일어서는구나|일어서네|일어서는군 깨어나는구나|깨어나네|깨어나는군 눈뜨는구나|눈뜨네|눈뜨는군
                """),
                "casual": words("일어나 일어서 깨어나 눈떠"),
                "casualQuestion": words(
                    "일어나|일어나지 일어서|일어서지 깨어나|깨어나지 눈떠|눈뜨지"
                ),
                "polite": words("일어나요 일어서요 깨어나요 눈떠요"),
                "politeQuestion": words(
                    "일어나요|일어나죠 일어서요|일어서죠 깨어나요|깨어나죠 눈떠요|눈뜨죠"
                ),
                "formal": words("일어납니다 일어섭니다 깨어납니다 눈뜹니다"),
                "formalQuestion": words("일어납니까 일어섭니까 깨어납니까 눈뜹니까"),
                "linking": words(
                    "일어나서|일어나고 일어서서|일어서고 깨어나서|깨어나고 눈떠서|눈뜨고"
                ),
            },
            past=conjugate("일어났 일어섰 깨어났 눈떴", _PAST),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("간다 향한다 올라간다 내려간다"),
            forms={
                "question": words(
                    "가니|가나|가는가 향하니|향하나|향하는가 올라가니|올라가나|올라가는가 내려가니|내려가나|내려가는가"
                ),
                "exclamation": words(
                    "가는구나|가네|가는군 향하는구나|향하네|향하는군 올라가는구나|올라가네|올라가는군 내려가는구나|내려가네|내려가는군"
                ),
                "casual": words("가 향해 올라가 내려가"),
                "casualQuestion": words("가|가지 향해|향하지 올라가|올라가지 내려가|내려가지"),
                "polite": words("가요 향해요 올라가요 내려가요"),
                "politeQuestion": words(
                    "가요|가죠 향해요|향하죠 올라가요|올라가죠 내려가요|내려가죠"
                ),
                "formal": words("갑니다 향합니다 올라갑니다 내려갑니다"),
                "formalQuestion": words("갑니까 향합니까 올라갑니까 내려갑니까"),
                "linking": words("가서|가고 향해서|향하고 올라가서|올라가고 내려가서|내려가고"),
            },
            past=conjugate("갔 향했 올라갔 내려갔", _PAST),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            requires="destination",
            words=words("달려간다"),
            forms={
                "question": words("달려가니|달려가나|달려가는가"),
                "exclamation": words("달려가는구나|달려가네|달려가는군"),
                "casual": words("달려가"),
                "casualQuestion": words("달려가|달려가지"),
                "polite": words("달려가요"),
                "politeQuestion": words("달려가요|달려가죠"),
                "formal": words("달려갑니다"),
                "formalQuestion": words("달려갑니까"),
                "linking": words("달려가서|달려가고"),
            },
            past=conjugate("달려갔", _PAST),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("떠난다 나선다 출발한다 길을떠난다"),
            forms={
                "question": words(
                    "떠나니|떠나나|떠나는가 나서니|나서나|나서는가 출발하니|출발하나|출발하는가 길을떠나니|길을떠나나|길을떠나는가"
                ),
                "exclamation": words("""
                    떠나는구나|떠나네|떠나는군 나서는구나|나서네|나서는군 출발하는구나|출발하네|출발하는군 길을떠나는구나|길을떠나네|길을떠나는군
                """),
                "casual": words("떠나 나서 출발해 길을떠나"),
                "casualQuestion": words(
                    "떠나|떠나지 나서|나서지 출발해|출발하지 길을떠나|길을떠나지"
                ),
                "polite": words("떠나요 나서요 출발해요 길을떠나요"),
                "politeQuestion": words(
                    "떠나요|떠나죠 나서요|나서죠 출발해요|출발하죠 길을떠나요|길을떠나죠"
                ),
                "formal": words("떠납니다 나섭니다 출발합니다 길을떠납니다"),
                "formalQuestion": words("떠납니까 나섭니까 출발합니까 길을떠납니까"),
                "linking": words(
                    "떠나서|떠나고 나서서|나서고 출발해서|출발하고 길을떠나서|길을떠나고"
                ),
            },
            past=conjugate("떠났 나섰 출발했 길을떠났", _PAST),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("들어온다 닿는다 이른다 다다른다 들어선다"),
            forms={
                "question": words("""
                    들어오니|들어오나|들어오는가 닿니|닿나|닿는가 이르니|이르나|이르는가 다다르니|다다르나|다다르는가 들어서니|들어서나|들어서는가
                """),
                "exclamation": words("""
                    들어오는구나|들어오네|들어오는군 닿는구나|닿네|닿는군 이르는구나|이르네|이르는군 다다르는구나|다다르네|다다르는군 들어서는구나|들어서네|들어서는군
                """),
                "casual": words("들어와 닿아 이르러 다다라 들어서"),
                "casualQuestion": words(
                    "들어와|들어오지 닿아|닿지 이르러|이르지 다다라|다다르지 들어서|들어서지"
                ),
                "polite": words("들어와요 닿아요 이르러요 다다라요 들어서요"),
                "politeQuestion": words(
                    "들어와요|들어오죠 닿아요|닿죠 이르러요|이르죠 다다라요|다다르죠 들어서요|들어서죠"
                ),
                "formal": words("들어옵니다 닿습니다 이릅니다 다다릅니다 들어섭니다"),
                "formalQuestion": words("들어옵니까 닿습니까 이릅니까 다다릅니까 들어섭니까"),
                "linking": words(
                    "들어와서|들어오고 닿아서|닿고 이르러서|이르고 다다라서|다다르고 들어서서|들어서고"
                ),
            },
            past=conjugate("들어왔 닿았 이르렀 다다랐 들어섰", _PAST),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("돌아온다 도착한다 돌아간다 귀가한다"),
            forms={
                "question": words(
                    "돌아오니|돌아오나|돌아오는가 도착하니|도착하나|도착하는가 돌아가니|돌아가나|돌아가는가 귀가하니|귀가하나|귀가하는가"
                ),
                "exclamation": words("""
                    돌아오는구나|돌아오네|돌아오는군 도착하는구나|도착하네|도착하는군 돌아가는구나|돌아가네|돌아가는군 귀가하는구나|귀가하네|귀가하는군
                """),
                "casual": words("돌아와 도착해 돌아가 귀가해"),
                "casualQuestion": words(
                    "돌아와|돌아오지 도착해|도착하지 돌아가|돌아가지 귀가해|귀가하지"
                ),
                "polite": words("돌아와요 도착해요 돌아가요 귀가해요"),
                "politeQuestion": words(
                    "돌아와요|돌아오죠 도착해요|도착하죠 돌아가요|돌아가죠 귀가해요|귀가하죠"
                ),
                "formal": words("돌아옵니다 도착합니다 돌아갑니다 귀가합니다"),
                "formalQuestion": words("돌아옵니까 도착합니까 돌아갑니까 귀가합니까"),
                "linking": words(
                    "돌아와서|돌아오고 도착해서|도착하고 돌아가서|돌아가고 귀가해서|귀가하고"
                ),
            },
            past=conjugate("돌아왔 도착했 돌아갔 귀가했", _PAST),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words(
                "달린다 걷는다 뛴다 기어간다 지나간다 어슬렁댄다 뛰어다닌다 거닌다 산책한다"
            ),
            forms={
                "question": words("""
                    달리니|달리나|달리는가 걷니|걷나|걷는가 뛰니|뛰나|뛰는가 기어가니|기어가나|기어가는가 지나가니|지나가나|지나가는가
                    어슬렁대니|어슬렁대나|어슬렁대는가 뛰어다니니|뛰어다니나|뛰어다니는가 거니니|거니나|거니는가 산책하니|산책하나|산책하는가
                """),
                "exclamation": words("""
                    달리는구나|달리네|달리는군 걷는구나|걷네|걷는군 뛰는구나|뛰네|뛰는군 기어가는구나|기어가네|기어가는군 지나가는구나|지나가네|지나가는군
                    어슬렁대는구나|어슬렁대네|어슬렁대는군 뛰어다니는구나|뛰어다니네|뛰어다니는군 거니는구나|거니네|거니는군 산책하는구나|산책하네|산책하는군
                """),
                "casual": words("달려 걸어 뛰어 기어가 지나가 어슬렁대 뛰어다녀 거닐어 산책해"),
                "casualQuestion": words("""
                    달려|달리지 걸어|걷지 뛰어|뛰지 기어가|기어가지 지나가|지나가지 어슬렁대|어슬렁대지 뛰어다녀|뛰어다니지 거닐어|거닐지 산책해|산책하지
                """),
                "polite": words(
                    "달려요 걸어요 뛰어요 기어가요 지나가요 어슬렁대요 뛰어다녀요 거닐어요 산책해요"
                ),
                "politeQuestion": words("""
                    달려요|달리죠 걸어요|걷죠 뛰어요|뛰죠 기어가요|기어가죠 지나가요|지나가죠 어슬렁대요|어슬렁대죠 뛰어다녀요|뛰어다니죠 거닐어요|거닐죠
                    산책해요|산책하죠
                """),
                "formal": words(
                    "달립니다 걷습니다 뜁니다 기어갑니다 지나갑니다 어슬렁댑니다 뛰어다닙니다 거닙니다 산책합니다"
                ),
                "formalQuestion": words(
                    "달립니까 걷습니까 뜁니까 기어갑니까 지나갑니까 어슬렁댑니까 뛰어다닙니까 거닙니까 산책합니까"
                ),
                "linking": words(
                    "달리고 걷고 뛰고 기어가고 지나가고 어슬렁대고 뛰어다니고 거닐고 산책하고"
                ),
            },
            past=conjugate("달렸 걸었 뛰었 기어갔 지나갔 어슬렁댔 뛰어다녔 거닐었 산책했", _PAST),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("헤엄친다"),
            forms={
                "question": words("헤엄치니|헤엄치나|헤엄치는가"),
                "exclamation": words("헤엄치는구나|헤엄치네|헤엄치는군"),
                "casual": words("헤엄쳐"),
                "casualQuestion": words("헤엄쳐|헤엄치지"),
                "polite": words("헤엄쳐요"),
                "politeQuestion": words("헤엄쳐요|헤엄치죠"),
                "formal": words("헤엄칩니다"),
                "formalQuestion": words("헤엄칩니까"),
                "linking": words("헤엄치고"),
            },
            past=conjugate("헤엄쳤", _PAST),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("서성인다"),
            forms={
                "question": words("서성이니|서성이나|서성이는가"),
                "exclamation": words("서성이는구나|서성이네|서성이는군"),
                "casual": words("서성여"),
                "casualQuestion": words("서성여|서성이지"),
                "polite": words("서성여요"),
                "politeQuestion": words("서성여요|서성이죠"),
                "formal": words("서성입니다"),
                "formalQuestion": words("서성입니까"),
                "linking": words("서성이고"),
            },
            past=conjugate("서성였", _PAST),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("날아오른다"),
            forms={
                "question": words("날아오르니|날아오르나|날아오르는가"),
                "exclamation": words("날아오르는구나|날아오르네|날아오르는군"),
                "casual": words("날아올라"),
                "casualQuestion": words("날아올라|날아오르지"),
                "polite": words("날아올라요"),
                "politeQuestion": words("날아올라요|날아오르죠"),
                "formal": words("날아오릅니다"),
                "formalQuestion": words("날아오릅니까"),
                "linking": words("날아오르고"),
            },
            past=conjugate("날아올랐", _PAST),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words(
                "기다린다 두리번거린다 숨는다 뒤척인다 머뭇거린다 기웃거린다 멈춘다 멈춰선다"
            ),
            forms={
                "question": words("""
                    기다리니|기다리나|기다리는가 두리번거리니|두리번거리나|두리번거리는가 숨니|숨나|숨는가 뒤척이니|뒤척이나|뒤척이는가
                    머뭇거리니|머뭇거리나|머뭇거리는가 기웃거리니|기웃거리나|기웃거리는가 멈추니|멈추나|멈추는가 멈춰서니|멈춰서나|멈춰서는가
                """),
                "exclamation": words("""
                    기다리는구나|기다리네|기다리는군 두리번거리는구나|두리번거리네|두리번거리는군 숨는구나|숨네|숨는군 뒤척이는구나|뒤척이네|뒤척이는군
                    머뭇거리는구나|머뭇거리네|머뭇거리는군 기웃거리는구나|기웃거리네|기웃거리는군 멈추는구나|멈추네|멈추는군 멈춰서는구나|멈춰서네|멈춰서는군
                """),
                "casual": words("기다려 두리번거려 숨어 뒤척여 머뭇거려 기웃거려 멈춰 멈춰서"),
                "casualQuestion": words("""
                    기다려|기다리지 두리번거려|두리번거리지 숨어|숨지 뒤척여|뒤척이지 머뭇거려|머뭇거리지 기웃거려|기웃거리지 멈춰|멈추지 멈춰서|멈춰서지
                """),
                "polite": words(
                    "기다려요 두리번거려요 숨어요 뒤척여요 머뭇거려요 기웃거려요 멈춰요 멈춰서요"
                ),
                "politeQuestion": words("""
                    기다려요|기다리죠 두리번거려요|두리번거리죠 숨어요|숨죠 뒤척여요|뒤척이죠 머뭇거려요|머뭇거리죠 기웃거려요|기웃거리죠 멈춰요|멈추죠
                    멈춰서요|멈춰서죠
                """),
                "formal": words(
                    "기다립니다 두리번거립니다 숨습니다 뒤척입니다 머뭇거립니다 기웃거립니다 멈춥니다 멈춰섭니다"
                ),
                "formalQuestion": words(
                    "기다립니까 두리번거립니까 숨습니까 뒤척입니까 머뭇거립니까 기웃거립니까 멈춥니까 멈춰섭니까"
                ),
                "linking": words(
                    "기다리고 두리번거리고 숨고 뒤척이고 머뭇거리고 기웃거리고 멈추고 멈춰서고"
                ),
            },
            past=conjugate("기다렸 두리번거렸 숨었 뒤척였 머뭇거렸 기웃거렸 멈췄 멈춰섰", _PAST),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("쉰다 앉는다 눕는다 웅크린다 드러눕는다"),
            forms={
                "question": words(
                    "쉬니|쉬나|쉬는가 앉니|앉나|앉는가 눕니|눕나|눕는가 웅크리니|웅크리나|웅크리는가 드러눕니|드러눕나|드러눕는가"
                ),
                "exclamation": words("""
                    쉬는구나|쉬네|쉬는군 앉는구나|앉네|앉는군 눕는구나|눕네|눕는군 웅크리는구나|웅크리네|웅크리는군 드러눕는구나|드러눕네|드러눕는군
                """),
                "casual": words("쉬어 앉아 누워 웅크려 드러누워"),
                "casualQuestion": words(
                    "쉬어|쉬지 앉아|앉지 누워|눕지 웅크려|웅크리지 드러누워|드러눕지"
                ),
                "polite": words("쉬어요 앉아요 누워요 웅크려요 드러누워요"),
                "politeQuestion": words(
                    "쉬어요|쉬죠 앉아요|앉죠 누워요|눕죠 웅크려요|웅크리죠 드러누워요|드러눕죠"
                ),
                "formal": words("쉽니다 앉습니다 눕습니다 웅크립니다 드러눕습니다"),
                "formalQuestion": words("쉽니까 앉습니까 눕습니까 웅크립니까 드러눕습니까"),
                "linking": words("쉬고 앉아서|앉고 누워서|눕고 웅크리고 드러누워서|드러눕고"),
            },
            past=conjugate("쉬었 앉았 누웠 웅크렸 드러누웠", _PAST),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("잠잔다 잠든다 존다 꾸벅인다"),
            forms={
                "question": words(
                    "잠자니|잠자나|잠자는가 잠드니|잠드나|잠드는가 조니|조나|조는가 꾸벅이니|꾸벅이나|꾸벅이는가"
                ),
                "exclamation": words(
                    "잠자는구나|잠자네|잠자는군 잠드는구나|잠드네|잠드는군 조는구나|조네|조는군 꾸벅이는구나|꾸벅이네|꾸벅이는군"
                ),
                "casual": words("잠자 잠들어 졸아 꾸벅여"),
                "casualQuestion": words("잠자|잠자지 잠들어|잠들지 졸아|졸지 꾸벅여|꾸벅이지"),
                "polite": words("잠자요 잠들어요 졸아요 꾸벅여요"),
                "politeQuestion": words(
                    "잠자요|잠자죠 잠들어요|잠들죠 졸아요|졸죠 꾸벅여요|꾸벅이죠"
                ),
                "formal": words("잠잡니다 잠듭니다 좁니다 꾸벅입니다"),
                "formalQuestion": words("잠잡니까 잠듭니까 좁니까 꾸벅입니까"),
                "linking": words("잠자고 잠들고 졸고 꾸벅이고"),
            },
            past=conjugate("잠잤 잠들었 졸았 꾸벅였", _PAST),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words(
                "웃는다 운다 하품한다 한숨짓는다 미소짓는다 콧노래한다 중얼거린다 소리친다"
            ),
            forms={
                "question": words("""
                    웃니|웃나|웃는가 우니|우나|우는가 하품하니|하품하나|하품하는가 한숨짓니|한숨짓나|한숨짓는가 미소짓니|미소짓나|미소짓는가
                    콧노래하니|콧노래하나|콧노래하는가 중얼거리니|중얼거리나|중얼거리는가 소리치니|소리치나|소리치는가
                """),
                "exclamation": words("""
                    웃는구나|웃네|웃는군 우는구나|우네|우는군 하품하는구나|하품하네|하품하는군 한숨짓는구나|한숨짓네|한숨짓는군 미소짓는구나|미소짓네|미소짓는군
                    콧노래하는구나|콧노래하네|콧노래하는군 중얼거리는구나|중얼거리네|중얼거리는군 소리치는구나|소리치네|소리치는군
                """),
                "casual": words("웃어 울어 하품해 한숨지어 미소지어 콧노래해 중얼거려 소리쳐"),
                "casualQuestion": words("""
                    웃어|웃지 울어|울지 하품해|하품하지 한숨지어|한숨짓지 미소지어|미소짓지 콧노래해|콧노래하지 중얼거려|중얼거리지 소리쳐|소리치지
                """),
                "polite": words(
                    "웃어요 울어요 하품해요 한숨지어요 미소지어요 콧노래해요 중얼거려요 소리쳐요"
                ),
                "politeQuestion": words("""
                    웃어요|웃죠 울어요|울죠 하품해요|하품하죠 한숨지어요|한숨짓죠 미소지어요|미소짓죠 콧노래해요|콧노래하죠 중얼거려요|중얼거리죠 소리쳐요|소리치죠
                """),
                "formal": words(
                    "웃습니다 웁니다 하품합니다 한숨짓습니다 미소짓습니다 콧노래합니다 중얼거립니다 소리칩니다"
                ),
                "formalQuestion": words(
                    "웃습니까 웁니까 하품합니까 한숨짓습니까 미소짓습니까 콧노래합니까 중얼거립니까 소리칩니까"
                ),
                "linking": words(
                    "웃고 울고 하품하고 한숨짓고 미소짓고 콧노래하고 중얼거리고 소리치고"
                ),
            },
            past=conjugate("웃었 울었 하품했 한숨지었 미소지었 콧노래했 중얼거렸 소리쳤", _PAST),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("춤춘다 노래한다 뒹군다 뛰논다 장난친다 뛰어오른다 폴짝거린다 구른다"),
            forms={
                "question": words("""
                    춤추니|춤추나|춤추는가 노래하니|노래하나|노래하는가 뒹구니|뒹구나|뒹구는가 뛰노니|뛰노나|뛰노는가 장난치니|장난치나|장난치는가
                    뛰어오르니|뛰어오르나|뛰어오르는가 폴짝거리니|폴짝거리나|폴짝거리는가 구르니|구르나|구르는가
                """),
                "exclamation": words("""
                    춤추는구나|춤추네|춤추는군 노래하는구나|노래하네|노래하는군 뒹구는구나|뒹구네|뒹구는군 뛰노는구나|뛰노네|뛰노는군 장난치는구나|장난치네|장난치는군
                    뛰어오르는구나|뛰어오르네|뛰어오르는군 폴짝거리는구나|폴짝거리네|폴짝거리는군 구르는구나|구르네|구르는군
                """),
                "casual": words("춤춰 노래해 뒹굴어 뛰놀아 장난쳐 뛰어올라 폴짝거려 굴러"),
                "casualQuestion": words("""
                    춤춰|춤추지 노래해|노래하지 뒹굴어|뒹굴지 뛰놀아|뛰놀지 장난쳐|장난치지 뛰어올라|뛰어오르지 폴짝거려|폴짝거리지 굴러|구르지
                """),
                "polite": words(
                    "춤춰요 노래해요 뒹굴어요 뛰놀아요 장난쳐요 뛰어올라요 폴짝거려요 굴러요"
                ),
                "politeQuestion": words("""
                    춤춰요|춤추죠 노래해요|노래하죠 뒹굴어요|뒹굴죠 뛰놀아요|뛰놀죠 장난쳐요|장난치죠 뛰어올라요|뛰어오르죠 폴짝거려요|폴짝거리죠 굴러요|구르죠
                """),
                "formal": words(
                    "춤춥니다 노래합니다 뒹굽니다 뛰놉니다 장난칩니다 뛰어오릅니다 폴짝거립니다 구릅니다"
                ),
                "formalQuestion": words(
                    "춤춥니까 노래합니까 뒹굽니까 뛰놉니까 장난칩니까 뛰어오릅니까 폴짝거립니까 구릅니까"
                ),
                "linking": words(
                    "춤추고 노래하고 뒹굴고 뛰놀고 장난치고 뛰어오르고 폴짝거리고 구르고"
                ),
            },
            past=conjugate("춤췄 노래했 뒹굴었 뛰놀았 장난쳤 뛰어올랐 폴짝거렸 굴렀", _PAST),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("꿈꾼다 기억한다 잊는다 상상한다 헤아린다 떠올린다 그리워한다 궁금해한다"),
            forms={
                "question": words("""
                    꿈꾸니|꿈꾸나|꿈꾸는가 기억하니|기억하나|기억하는가 잊니|잊나|잊는가 상상하니|상상하나|상상하는가 헤아리니|헤아리나|헤아리는가
                    떠올리니|떠올리나|떠올리는가 그리워하니|그리워하나|그리워하는가 궁금해하니|궁금해하나|궁금해하는가
                """),
                "exclamation": words("""
                    꿈꾸는구나|꿈꾸네|꿈꾸는군 기억하는구나|기억하네|기억하는군 잊는구나|잊네|잊는군 상상하는구나|상상하네|상상하는군 헤아리는구나|헤아리네|헤아리는군
                    떠올리는구나|떠올리네|떠올리는군 그리워하는구나|그리워하네|그리워하는군 궁금해하는구나|궁금해하네|궁금해하는군
                """),
                "casual": words("꿈꿔 기억해 잊어 상상해 헤아려 떠올려 그리워해 궁금해해"),
                "casualQuestion": words("""
                    꿈꿔|꿈꾸지 기억해|기억하지 잊어|잊지 상상해|상상하지 헤아려|헤아리지 떠올려|떠올리지 그리워해|그리워하지 궁금해해|궁금해하지
                """),
                "polite": words(
                    "꿈꿔요 기억해요 잊어요 상상해요 헤아려요 떠올려요 그리워해요 궁금해해요"
                ),
                "politeQuestion": words("""
                    꿈꿔요|꿈꾸죠 기억해요|기억하죠 잊어요|잊죠 상상해요|상상하죠 헤아려요|헤아리죠 떠올려요|떠올리죠 그리워해요|그리워하죠 궁금해해요|궁금해하죠
                """),
                "formal": words(
                    "꿈꿉니다 기억합니다 잊습니다 상상합니다 헤아립니다 떠올립니다 그리워합니다 궁금해합니다"
                ),
                "formalQuestion": words(
                    "꿈꿉니까 기억합니까 잊습니까 상상합니까 헤아립니까 떠올립니까 그리워합니까 궁금해합니까"
                ),
                "linking": words(
                    "꿈꾸고 기억하고 잊고 상상하고 헤아리고 떠올리고 그리워하고 궁금해하고"
                ),
            },
            past=conjugate("꿈꿨 기억했 잊었 상상했 헤아렸 떠올렸 그리워했 궁금해했", _PAST),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            object_themes=(
                "object",
                "tool",
                "clothing",
                "product",
                "gem",
                "plant",
                "food",
                "drink",
            ),
            words=words("본다 바라본다 살핀다 들여다본다 구경한다 만진다 쓰다듬는다 지켜본다"),
            forms={
                "question": words("""
                    보니|보나|보는가 바라보니|바라보나|바라보는가 살피니|살피나|살피는가 들여다보니|들여다보나|들여다보는가 구경하니|구경하나|구경하는가
                    만지니|만지나|만지는가 쓰다듬니|쓰다듬나|쓰다듬는가 지켜보니|지켜보나|지켜보는가
                """),
                "exclamation": words("""
                    보는구나|보네|보는군 바라보는구나|바라보네|바라보는군 살피는구나|살피네|살피는군 들여다보는구나|들여다보네|들여다보는군
                    구경하는구나|구경하네|구경하는군 만지는구나|만지네|만지는군 쓰다듬는구나|쓰다듬네|쓰다듬는군 지켜보는구나|지켜보네|지켜보는군
                """),
                "casual": words("봐 바라봐 살펴 들여다봐 구경해 만져 쓰다듬어 지켜봐"),
                "casualQuestion": words("""
                    봐|보지 바라봐|바라보지 살펴|살피지 들여다봐|들여다보지 구경해|구경하지 만져|만지지 쓰다듬어|쓰다듬지 지켜봐|지켜보지
                """),
                "polite": words(
                    "봐요 바라봐요 살펴요 들여다봐요 구경해요 만져요 쓰다듬어요 지켜봐요"
                ),
                "politeQuestion": words("""
                    봐요|보죠 바라봐요|바라보죠 살펴요|살피죠 들여다봐요|들여다보죠 구경해요|구경하죠 만져요|만지죠 쓰다듬어요|쓰다듬죠 지켜봐요|지켜보죠
                """),
                "formal": words(
                    "봅니다 바라봅니다 살핍니다 들여다봅니다 구경합니다 만집니다 쓰다듬습니다 지켜봅니다"
                ),
                "formalQuestion": words(
                    "봅니까 바라봅니까 살핍니까 들여다봅니까 구경합니까 만집니까 쓰다듬습니까 지켜봅니까"
                ),
                "linking": words(
                    "보고 바라보고 살피고 들여다보고 구경하고 만지고 쓰다듬고 지켜보고"
                ),
            },
            past=conjugate("봤 바라봤 살폈 들여다봤 구경했 만졌 쓰다듬었 지켜봤", _PAST),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("찾아다닌다 헤맨다 둘러본다 살펴본다"),
            forms={
                "question": words(
                    "찾아다니니|찾아다니나|찾아다니는가 헤매니|헤매나|헤매는가 둘러보니|둘러보나|둘러보는가 살펴보니|살펴보나|살펴보는가"
                ),
                "exclamation": words("""
                    찾아다니는구나|찾아다니네|찾아다니는군 헤매는구나|헤매네|헤매는군 둘러보는구나|둘러보네|둘러보는군 살펴보는구나|살펴보네|살펴보는군
                """),
                "casual": words("찾아다녀 헤매 둘러봐 살펴봐"),
                "casualQuestion": words(
                    "찾아다녀|찾아다니지 헤매|헤매지 둘러봐|둘러보지 살펴봐|살펴보지"
                ),
                "polite": words("찾아다녀요 헤매요 둘러봐요 살펴봐요"),
                "politeQuestion": words(
                    "찾아다녀요|찾아다니죠 헤매요|헤매죠 둘러봐요|둘러보죠 살펴봐요|살펴보죠"
                ),
                "formal": words("찾아다닙니다 헤맵니다 둘러봅니다 살펴봅니다"),
                "formalQuestion": words("찾아다닙니까 헤맵니까 둘러봅니까 살펴봅니까"),
                "linking": words("찾아다니고 헤매고 둘러보고 살펴보고"),
            },
            past=conjugate("찾아다녔 헤맸 둘러봤 살펴봤", _PAST),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            object_themes=(
                "object",
                "tool",
                "clothing",
                "product",
                "gem",
                "plant",
                "food",
                "drink",
            ),
            words=words("찾는다 발견한다 줍는다 찾아낸다"),
            forms={
                "question": words(
                    "찾니|찾나|찾는가 발견하니|발견하나|발견하는가 줍니|줍나|줍는가 찾아내니|찾아내나|찾아내는가"
                ),
                "exclamation": words(
                    "찾는구나|찾네|찾는군 발견하는구나|발견하네|발견하는군 줍는구나|줍네|줍는군 찾아내는구나|찾아내네|찾아내는군"
                ),
                "casual": words("찾아 발견해 주워 찾아내"),
                "casualQuestion": words("찾아|찾지 발견해|발견하지 주워|줍지 찾아내|찾아내지"),
                "polite": words("찾아요 발견해요 주워요 찾아내요"),
                "politeQuestion": words(
                    "찾아요|찾죠 발견해요|발견하죠 주워요|줍죠 찾아내요|찾아내죠"
                ),
                "formal": words("찾습니다 발견합니다 줍습니다 찾아냅니다"),
                "formalQuestion": words("찾습니까 발견합니까 줍습니까 찾아냅니까"),
                "linking": words("찾아서|찾고 발견하고 주워서|줍고 찾아내서|찾아내고"),
            },
            past=conjugate("찾았 발견했 주웠 찾아냈", _PAST),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            object_themes=(
                "object",
                "tool",
                "clothing",
                "product",
                "gem",
                "plant",
                "food",
                "drink",
            ),
            words=words("챙긴다 고른다 집는다 얻는다 받는다 꺼낸다 움켜쥔다"),
            forms={
                "question": words("""
                    챙기니|챙기나|챙기는가 고르니|고르나|고르는가 집니|집나|집는가 얻니|얻나|얻는가 받니|받나|받는가 꺼내니|꺼내나|꺼내는가
                    움켜쥐니|움켜쥐나|움켜쥐는가
                """),
                "exclamation": words("""
                    챙기는구나|챙기네|챙기는군 고르는구나|고르네|고르는군 집는구나|집네|집는군 얻는구나|얻네|얻는군 받는구나|받네|받는군 꺼내는구나|꺼내네|꺼내는군
                    움켜쥐는구나|움켜쥐네|움켜쥐는군
                """),
                "casual": words("챙겨 골라 집어 얻어 받아 꺼내 움켜쥐어"),
                "casualQuestion": words(
                    "챙겨|챙기지 골라|고르지 집어|집지 얻어|얻지 받아|받지 꺼내|꺼내지 움켜쥐어|움켜쥐지"
                ),
                "polite": words("챙겨요 골라요 집어요 얻어요 받아요 꺼내요 움켜쥐어요"),
                "politeQuestion": words(
                    "챙겨요|챙기죠 골라요|고르죠 집어요|집죠 얻어요|얻죠 받아요|받죠 꺼내요|꺼내죠 움켜쥐어요|움켜쥐죠"
                ),
                "formal": words("챙깁니다 고릅니다 집습니다 얻습니다 받습니다 꺼냅니다 움켜쥡니다"),
                "formalQuestion": words(
                    "챙깁니까 고릅니까 집습니까 얻습니까 받습니까 꺼냅니까 움켜쥡니까"
                ),
                "linking": words(
                    "챙겨서|챙기고 골라서|고르고 집어서|집고 얻어서|얻고 받아서|받고 꺼내서|꺼내고 움켜쥐고"
                ),
            },
            past=conjugate("챙겼 골랐 집었 얻었 받았 꺼냈 움켜쥐었", _PAST),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            object_themes=(
                "object",
                "tool",
                "clothing",
                "product",
                "gem",
                "plant",
                "food",
                "drink",
            ),
            words=words("옮긴다 나른다 가져온다 들고온다 안고온다"),
            forms={
                "question": words("""
                    옮기니|옮기나|옮기는가 나르니|나르나|나르는가 가져오니|가져오나|가져오는가 들고오니|들고오나|들고오는가 안고오니|안고오나|안고오는가
                """),
                "exclamation": words("""
                    옮기는구나|옮기네|옮기는군 나르는구나|나르네|나르는군 가져오는구나|가져오네|가져오는군 들고오는구나|들고오네|들고오는군
                    안고오는구나|안고오네|안고오는군
                """),
                "casual": words("옮겨 날라 가져와 들고와 안고와"),
                "casualQuestion": words(
                    "옮겨|옮기지 날라|나르지 가져와|가져오지 들고와|들고오지 안고와|안고오지"
                ),
                "polite": words("옮겨요 날라요 가져와요 들고와요 안고와요"),
                "politeQuestion": words(
                    "옮겨요|옮기죠 날라요|나르죠 가져와요|가져오죠 들고와요|들고오죠 안고와요|안고오죠"
                ),
                "formal": words("옮깁니다 나릅니다 가져옵니다 들고옵니다 안고옵니다"),
                "formalQuestion": words("옮깁니까 나릅니까 가져옵니까 들고옵니까 안고옵니까"),
                "linking": words(
                    "옮기고 나르고 가져와서|가져오고 들고와서|들고오고 안고와서|안고오고"
                ),
            },
            past=conjugate("옮겼 날랐 가져왔 들고왔 안고왔", _PAST),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            object_themes=(
                "object",
                "tool",
                "clothing",
                "product",
                "gem",
                "plant",
                "food",
                "drink",
            ),
            words=words("감춘다 숨긴다 넣어둔다 간직한다 묻는다 챙겨둔다"),
            forms={
                "question": words("""
                    감추니|감추나|감추는가 숨기니|숨기나|숨기는가 넣어두니|넣어두나|넣어두는가 간직하니|간직하나|간직하는가 묻니|묻나|묻는가
                    챙겨두니|챙겨두나|챙겨두는가
                """),
                "exclamation": words("""
                    감추는구나|감추네|감추는군 숨기는구나|숨기네|숨기는군 넣어두는구나|넣어두네|넣어두는군 간직하는구나|간직하네|간직하는군 묻는구나|묻네|묻는군
                    챙겨두는구나|챙겨두네|챙겨두는군
                """),
                "casual": words("감춰 숨겨 넣어둬 간직해 묻어 챙겨둬"),
                "casualQuestion": words(
                    "감춰|감추지 숨겨|숨기지 넣어둬|넣어두지 간직해|간직하지 묻어|묻지 챙겨둬|챙겨두지"
                ),
                "polite": words("감춰요 숨겨요 넣어둬요 간직해요 묻어요 챙겨둬요"),
                "politeQuestion": words(
                    "감춰요|감추죠 숨겨요|숨기죠 넣어둬요|넣어두죠 간직해요|간직하죠 묻어요|묻죠 챙겨둬요|챙겨두죠"
                ),
                "formal": words("감춥니다 숨깁니다 넣어둡니다 간직합니다 묻습니다 챙겨둡니다"),
                "formalQuestion": words(
                    "감춥니까 숨깁니까 넣어둡니까 간직합니까 묻습니까 챙겨둡니까"
                ),
                "linking": words("감추고 숨기고 넣어두고 간직하고 묻고 챙겨두고"),
            },
            past=conjugate("감췄 숨겼 넣어뒀 간직했 묻었 챙겨뒀", _PAST),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            object_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("만든다 짓는다 빚는다 그린다 엮는다"),
            forms={
                "question": words(
                    "만드니|만드나|만드는가 짓니|짓나|짓는가 빚니|빚나|빚는가 그리니|그리나|그리는가 엮니|엮나|엮는가"
                ),
                "exclamation": words("""
                    만드는구나|만드네|만드는군 짓는구나|짓네|짓는군 빚는구나|빚네|빚는군 그리는구나|그리네|그리는군 엮는구나|엮네|엮는군
                """),
                "casual": words("만들어 지어 빚어 그려 엮어"),
                "casualQuestion": words("만들어|만들지 지어|짓지 빚어|빚지 그려|그리지 엮어|엮지"),
                "polite": words("만들어요 지어요 빚어요 그려요 엮어요"),
                "politeQuestion": words(
                    "만들어요|만들죠 지어요|짓죠 빚어요|빚죠 그려요|그리죠 엮어요|엮죠"
                ),
                "formal": words("만듭니다 짓습니다 빚습니다 그립니다 엮습니다"),
                "formalQuestion": words("만듭니까 짓습니까 빚습니까 그립니까 엮습니까"),
                "linking": words("만들고 짓고 빚고 그리고 엮고"),
            },
            past=conjugate("만들었 지었 빚었 그렸 엮었", _PAST),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            object_themes=("object", "tool", "vehicle"),
            words=words("조립한다 깎는다"),
            forms={
                "question": words("조립하니|조립하나|조립하는가 깎니|깎나|깎는가"),
                "exclamation": words("조립하는구나|조립하네|조립하는군 깎는구나|깎네|깎는군"),
                "casual": words("조립해 깎아"),
                "casualQuestion": words("조립해|조립하지 깎아|깎지"),
                "polite": words("조립해요 깎아요"),
                "politeQuestion": words("조립해요|조립하죠 깎아요|깎죠"),
                "formal": words("조립합니다 깎습니다"),
                "formalQuestion": words("조립합니까 깎습니까"),
                "linking": words("조립하고 깎고"),
            },
            past=conjugate("조립했 깎았", _PAST),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            object_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("고친다 닦는다 손질한다 다듬는다 정리한다 매만진다 수리한다"),
            forms={
                "question": words("""
                    고치니|고치나|고치는가 닦니|닦나|닦는가 손질하니|손질하나|손질하는가 다듬니|다듬나|다듬는가 정리하니|정리하나|정리하는가
                    매만지니|매만지나|매만지는가 수리하니|수리하나|수리하는가
                """),
                "exclamation": words("""
                    고치는구나|고치네|고치는군 닦는구나|닦네|닦는군 손질하는구나|손질하네|손질하는군 다듬는구나|다듬네|다듬는군 정리하는구나|정리하네|정리하는군
                    매만지는구나|매만지네|매만지는군 수리하는구나|수리하네|수리하는군
                """),
                "casual": words("고쳐 닦아 손질해 다듬어 정리해 매만져 수리해"),
                "casualQuestion": words(
                    "고쳐|고치지 닦아|닦지 손질해|손질하지 다듬어|다듬지 정리해|정리하지 매만져|매만지지 수리해|수리하지"
                ),
                "polite": words("고쳐요 닦아요 손질해요 다듬어요 정리해요 매만져요 수리해요"),
                "politeQuestion": words(
                    "고쳐요|고치죠 닦아요|닦죠 손질해요|손질하죠 다듬어요|다듬죠 정리해요|정리하죠 매만져요|매만지죠 수리해요|수리하죠"
                ),
                "formal": words(
                    "고칩니다 닦습니다 손질합니다 다듬습니다 정리합니다 매만집니다 수리합니다"
                ),
                "formalQuestion": words(
                    "고칩니까 닦습니까 손질합니까 다듬습니까 정리합니까 매만집니까 수리합니까"
                ),
                "linking": words("고치고 닦고 손질하고 다듬고 정리하고 매만지고 수리하고"),
            },
            past=conjugate("고쳤 닦았 손질했 다듬었 정리했 매만졌 수리했", _PAST),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            object_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("판다 넘긴다 건넨다 내놓는다"),
            forms={
                "question": words(
                    "파니|파나|파는가 넘기니|넘기나|넘기는가 건네니|건네나|건네는가 내놓니|내놓나|내놓는가"
                ),
                "exclamation": words(
                    "파는구나|파네|파는군 넘기는구나|넘기네|넘기는군 건네는구나|건네네|건네는군 내놓는구나|내놓네|내놓는군"
                ),
                "casual": words("팔아 넘겨 건네 내놓아"),
                "casualQuestion": words("팔아|팔지 넘겨|넘기지 건네|건네지 내놓아|내놓지"),
                "polite": words("팔아요 넘겨요 건네요 내놓아요"),
                "politeQuestion": words("팔아요|팔죠 넘겨요|넘기죠 건네요|건네죠 내놓아요|내놓죠"),
                "formal": words("팝니다 넘깁니다 건넵니다 내놓습니다"),
                "formalQuestion": words("팝니까 넘깁니까 건넵니까 내놓습니까"),
                "linking": words("팔고 넘기고 건네고 내놓고"),
            },
            past=conjugate("팔았 넘겼 건넸 내놓았", _PAST),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            object_themes=(
                "object",
                "tool",
                "clothing",
                "product",
                "gem",
                "vehicle",
                "food",
                "drink",
            ),
            words=words("산다 사온다 구한다 장만한다 사들인다"),
            forms={
                "question": words("""
                    사니|사나|사는가 사오니|사오나|사오는가 구하니|구하나|구하는가 장만하니|장만하나|장만하는가 사들이니|사들이나|사들이는가
                """),
                "exclamation": words("""
                    사는구나|사네|사는군 사오는구나|사오네|사오는군 구하는구나|구하네|구하는군 장만하는구나|장만하네|장만하는군 사들이는구나|사들이네|사들이는군
                """),
                "casual": words("사 사와 구해 장만해 사들여"),
                "casualQuestion": words(
                    "사|사지 사와|사오지 구해|구하지 장만해|장만하지 사들여|사들이지"
                ),
                "polite": words("사요 사와요 구해요 장만해요 사들여요"),
                "politeQuestion": words(
                    "사요|사죠 사와요|사오죠 구해요|구하죠 장만해요|장만하죠 사들여요|사들이죠"
                ),
                "formal": words("삽니다 사옵니다 구합니다 장만합니다 사들입니다"),
                "formalQuestion": words("삽니까 사옵니까 구합니까 장만합니까 사들입니까"),
                "linking": words(
                    "사서|사고 사와서|사오고 구해서|구하고 장만해서|장만하고 사들여서|사들이고"
                ),
            },
            past=conjugate("샀 사왔 구했 장만했 사들였", _PAST),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("굽는다 데운다 끓인다 요리한다 썬다 담는다"),
            forms={
                "question": words("""
                    굽니|굽나|굽는가 데우니|데우나|데우는가 끓이니|끓이나|끓이는가 요리하니|요리하나|요리하는가 써니|써나|써는가 담니|담나|담는가
                """),
                "exclamation": words("""
                    굽는구나|굽네|굽는군 데우는구나|데우네|데우는군 끓이는구나|끓이네|끓이는군 요리하는구나|요리하네|요리하는군 써는구나|써네|써는군
                    담는구나|담네|담는군
                """),
                "casual": words("구워 데워 끓여 요리해 썰어 담아"),
                "casualQuestion": words(
                    "구워|굽지 데워|데우지 끓여|끓이지 요리해|요리하지 썰어|썰지 담아|담지"
                ),
                "polite": words("구워요 데워요 끓여요 요리해요 썰어요 담아요"),
                "politeQuestion": words(
                    "구워요|굽죠 데워요|데우죠 끓여요|끓이죠 요리해요|요리하죠 썰어요|썰죠 담아요|담죠"
                ),
                "formal": words("굽습니다 데웁니다 끓입니다 요리합니다 썹니다 담습니다"),
                "formalQuestion": words("굽습니까 데웁니까 끓입니까 요리합니까 썹니까 담습니까"),
                "linking": words(
                    "구워서|굽고 데워서|데우고 끓여서|끓이고 요리해서|요리하고 썰어서|썰고 담아서|담고"
                ),
            },
            past=conjugate("구웠 데웠 끓였 요리했 썰었 담았", _PAST),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("먹는다 씹는다 삼킨다 맛본다 베어먹는다 먹어치운다"),
            forms={
                "question": words("""
                    먹니|먹나|먹는가 씹니|씹나|씹는가 삼키니|삼키나|삼키는가 맛보니|맛보나|맛보는가 베어먹니|베어먹나|베어먹는가 먹어치우니|먹어치우나|먹어치우는가
                """),
                "exclamation": words("""
                    먹는구나|먹네|먹는군 씹는구나|씹네|씹는군 삼키는구나|삼키네|삼키는군 맛보는구나|맛보네|맛보는군 베어먹는구나|베어먹네|베어먹는군
                    먹어치우는구나|먹어치우네|먹어치우는군
                """),
                "casual": words("먹어 씹어 삼켜 맛봐 베어먹어 먹어치워"),
                "casualQuestion": words(
                    "먹어|먹지 씹어|씹지 삼켜|삼키지 맛봐|맛보지 베어먹어|베어먹지 먹어치워|먹어치우지"
                ),
                "polite": words("먹어요 씹어요 삼켜요 맛봐요 베어먹어요 먹어치워요"),
                "politeQuestion": words(
                    "먹어요|먹죠 씹어요|씹죠 삼켜요|삼키죠 맛봐요|맛보죠 베어먹어요|베어먹죠 먹어치워요|먹어치우죠"
                ),
                "formal": words("먹습니다 씹습니다 삼킵니다 맛봅니다 베어먹습니다 먹어치웁니다"),
                "formalQuestion": words(
                    "먹습니까 씹습니까 삼킵니까 맛봅니까 베어먹습니까 먹어치웁니까"
                ),
                "linking": words("먹고 씹고 삼키고 맛보고 베어먹고 먹어치우고"),
            },
            past=conjugate("먹었 씹었 삼켰 맛봤 베어먹었 먹어치웠", _PAST),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("마신다 들이킨다 홀짝인다 음미한다"),
            forms={
                "question": words(
                    "마시니|마시나|마시는가 들이키니|들이키나|들이키는가 홀짝이니|홀짝이나|홀짝이는가 음미하니|음미하나|음미하는가"
                ),
                "exclamation": words("""
                    마시는구나|마시네|마시는군 들이키는구나|들이키네|들이키는군 홀짝이는구나|홀짝이네|홀짝이는군 음미하는구나|음미하네|음미하는군
                """),
                "casual": words("마셔 들이켜 홀짝여 음미해"),
                "casualQuestion": words(
                    "마셔|마시지 들이켜|들이키지 홀짝여|홀짝이지 음미해|음미하지"
                ),
                "polite": words("마셔요 들이켜요 홀짝여요 음미해요"),
                "politeQuestion": words(
                    "마셔요|마시죠 들이켜요|들이키죠 홀짝여요|홀짝이죠 음미해요|음미하죠"
                ),
                "formal": words("마십니다 들이킵니다 홀짝입니다 음미합니다"),
                "formalQuestion": words("마십니까 들이킵니까 홀짝입니까 음미합니까"),
                "linking": words("마시고 들이키고 홀짝이고 음미하고"),
            },
            past=conjugate("마셨 들이켰 홀짝였 음미했", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words(
                "조용해진다 어두워진다 밝아온다 고요해진다 붐빈다 물든다 환해진다 잠잠해진다"
            ),
            forms={
                "question": words("""
                    조용해지니|조용해지나|조용해지는가 어두워지니|어두워지나|어두워지는가 밝아오니|밝아오나|밝아오는가 고요해지니|고요해지나|고요해지는가
                    붐비니|붐비나|붐비는가 물드니|물드나|물드는가 환해지니|환해지나|환해지는가 잠잠해지니|잠잠해지나|잠잠해지는가
                """),
                "exclamation": words("""
                    조용해지는구나|조용해지네|조용해지는군 어두워지는구나|어두워지네|어두워지는군 밝아오는구나|밝아오네|밝아오는군 고요해지는구나|고요해지네|고요해지는군
                    붐비는구나|붐비네|붐비는군 물드는구나|물드네|물드는군 환해지는구나|환해지네|환해지는군 잠잠해지는구나|잠잠해지네|잠잠해지는군
                """),
                "casual": words("조용해져 어두워져 밝아와 고요해져 붐벼 물들어 환해져 잠잠해져"),
                "casualQuestion": words("""
                    조용해져|조용해지지 어두워져|어두워지지 밝아와|밝아오지 고요해져|고요해지지 붐벼|붐비지 물들어|물들지 환해져|환해지지 잠잠해져|잠잠해지지
                """),
                "polite": words(
                    "조용해져요 어두워져요 밝아와요 고요해져요 붐벼요 물들어요 환해져요 잠잠해져요"
                ),
                "politeQuestion": words("""
                    조용해져요|조용해지죠 어두워져요|어두워지죠 밝아와요|밝아오죠 고요해져요|고요해지죠 붐벼요|붐비죠 물들어요|물들죠 환해져요|환해지죠
                    잠잠해져요|잠잠해지죠
                """),
                "formal": words(
                    "조용해집니다 어두워집니다 밝아옵니다 고요해집니다 붐빕니다 물듭니다 환해집니다 잠잠해집니다"
                ),
                "formalQuestion": words(
                    "조용해집니까 어두워집니까 밝아옵니까 고요해집니까 붐빕니까 물듭니까 환해집니까 잠잠해집니까"
                ),
                "linking": words(
                    "조용해지고 어두워지고 밝아오고 고요해지고 붐비고 물들고 환해지고 잠잠해지고"
                ),
            },
            past=conjugate("조용해졌 어두워졌 밝아왔 고요해졌 붐볐 물들었 환해졌 잠잠해졌", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("흐른다 시작된다 끝난다 이어진다 지나간다"),
            forms={
                "question": words("""
                    흐르니|흐르나|흐르는가 시작되니|시작되나|시작되는가 끝나니|끝나나|끝나는가 이어지니|이어지나|이어지는가 지나가니|지나가나|지나가는가
                """),
                "exclamation": words("""
                    흐르는구나|흐르네|흐르는군 시작되는구나|시작되네|시작되는군 끝나는구나|끝나네|끝나는군 이어지는구나|이어지네|이어지는군
                    지나가는구나|지나가네|지나가는군
                """),
                "casual": words("흘러 시작돼 끝나 이어져 지나가"),
                "casualQuestion": words(
                    "흘러|흐르지 시작돼|시작되지 끝나|끝나지 이어져|이어지지 지나가|지나가지"
                ),
                "polite": words("흘러요 시작돼요 끝나요 이어져요 지나가요"),
                "politeQuestion": words(
                    "흘러요|흐르죠 시작돼요|시작되죠 끝나요|끝나죠 이어져요|이어지죠 지나가요|지나가죠"
                ),
                "formal": words("흐릅니다 시작됩니다 끝납니다 이어집니다 지나갑니다"),
                "formalQuestion": words("흐릅니까 시작됩니까 끝납니까 이어집니까 지나갑니까"),
                "linking": words("흐르고 시작되고 끝나고 이어지고 지나가고"),
            },
            past=conjugate("흘렀 시작됐 끝났 이어졌 지나갔", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            subject_themes=("time", "weather"),
            words=words("빛난다 저문다 깊어진다"),
            forms={
                "question": words(
                    "빛나니|빛나나|빛나는가 저무니|저무나|저무는가 깊어지니|깊어지나|깊어지는가"
                ),
                "exclamation": words(
                    "빛나는구나|빛나네|빛나는군 저무는구나|저무네|저무는군 깊어지는구나|깊어지네|깊어지는군"
                ),
                "casual": words("빛나 저물어 깊어져"),
                "casualQuestion": words("빛나|빛나지 저물어|저물지 깊어져|깊어지지"),
                "polite": words("빛나요 저물어요 깊어져요"),
                "politeQuestion": words("빛나요|빛나죠 저물어요|저물죠 깊어져요|깊어지죠"),
                "formal": words("빛납니다 저뭅니다 깊어집니다"),
                "formalQuestion": words("빛납니까 저뭅니까 깊어집니까"),
                "linking": words("빛나고 저물고 깊어지고"),
            },
            past=conjugate("빛났 저물었 깊어졌", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            subject_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("흔들린다 반짝인다 떨어진다 굴러간다 기울어진다 낡아간다"),
            forms={
                "question": words("""
                    흔들리니|흔들리나|흔들리는가 반짝이니|반짝이나|반짝이는가 떨어지니|떨어지나|떨어지는가 굴러가니|굴러가나|굴러가는가
                    기울어지니|기울어지나|기울어지는가 낡아가니|낡아가나|낡아가는가
                """),
                "exclamation": words("""
                    흔들리는구나|흔들리네|흔들리는군 반짝이는구나|반짝이네|반짝이는군 떨어지는구나|떨어지네|떨어지는군 굴러가는구나|굴러가네|굴러가는군
                    기울어지는구나|기울어지네|기울어지는군 낡아가는구나|낡아가네|낡아가는군
                """),
                "casual": words("흔들려 반짝여 떨어져 굴러가 기울어져 낡아가"),
                "casualQuestion": words(
                    "흔들려|흔들리지 반짝여|반짝이지 떨어져|떨어지지 굴러가|굴러가지 기울어져|기울어지지 낡아가|낡아가지"
                ),
                "polite": words("흔들려요 반짝여요 떨어져요 굴러가요 기울어져요 낡아가요"),
                "politeQuestion": words(
                    "흔들려요|흔들리죠 반짝여요|반짝이죠 떨어져요|떨어지죠 굴러가요|굴러가죠 기울어져요|기울어지죠 낡아가요|낡아가죠"
                ),
                "formal": words(
                    "흔들립니다 반짝입니다 떨어집니다 굴러갑니다 기울어집니다 낡아갑니다"
                ),
                "formalQuestion": words(
                    "흔들립니까 반짝입니까 떨어집니까 굴러갑니까 기울어집니까 낡아갑니까"
                ),
                "linking": words("흔들리고 반짝이고 떨어지고 굴러가고 기울어지고 낡아가고"),
            },
            past=conjugate("흔들렸 반짝였 떨어졌 굴러갔 기울어졌 낡아갔", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("thing",),
            subject_themes=("music",),
            words=words("울린다 흐른다 퍼진다 잦아든다 이어진다"),
            forms={
                "question": words("""
                    울리니|울리나|울리는가 흐르니|흐르나|흐르는가 퍼지니|퍼지나|퍼지는가 잦아드니|잦아드나|잦아드는가 이어지니|이어지나|이어지는가
                """),
                "exclamation": words("""
                    울리는구나|울리네|울리는군 흐르는구나|흐르네|흐르는군 퍼지는구나|퍼지네|퍼지는군 잦아드는구나|잦아드네|잦아드는군 이어지는구나|이어지네|이어지는군
                """),
                "casual": words("울려 흘러 퍼져 잦아들어 이어져"),
                "casualQuestion": words(
                    "울려|울리지 흘러|흐르지 퍼져|퍼지지 잦아들어|잦아들지 이어져|이어지지"
                ),
                "polite": words("울려요 흘러요 퍼져요 잦아들어요 이어져요"),
                "politeQuestion": words(
                    "울려요|울리죠 흘러요|흐르죠 퍼져요|퍼지죠 잦아들어요|잦아들죠 이어져요|이어지죠"
                ),
                "formal": words("울립니다 흐릅니다 퍼집니다 잦아듭니다 이어집니다"),
                "formalQuestion": words("울립니까 흐릅니까 퍼집니까 잦아듭니까 이어집니까"),
                "linking": words("울리고 흐르고 퍼지고 잦아들고 이어지고"),
            },
            past=conjugate("울렸 흘렀 퍼졌 잦아들었 이어졌", _PAST),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("달린다 멈춘다 지나간다 돌아온다 출발한다 미끄러진다"),
            forms={
                "question": words("""
                    달리니|달리나|달리는가 멈추니|멈추나|멈추는가 지나가니|지나가나|지나가는가 돌아오니|돌아오나|돌아오는가 출발하니|출발하나|출발하는가
                    미끄러지니|미끄러지나|미끄러지는가
                """),
                "exclamation": words("""
                    달리는구나|달리네|달리는군 멈추는구나|멈추네|멈추는군 지나가는구나|지나가네|지나가는군 돌아오는구나|돌아오네|돌아오는군
                    출발하는구나|출발하네|출발하는군 미끄러지는구나|미끄러지네|미끄러지는군
                """),
                "casual": words("달려 멈춰 지나가 돌아와 출발해 미끄러져"),
                "casualQuestion": words(
                    "달려|달리지 멈춰|멈추지 지나가|지나가지 돌아와|돌아오지 출발해|출발하지 미끄러져|미끄러지지"
                ),
                "polite": words("달려요 멈춰요 지나가요 돌아와요 출발해요 미끄러져요"),
                "politeQuestion": words(
                    "달려요|달리죠 멈춰요|멈추죠 지나가요|지나가죠 돌아와요|돌아오죠 출발해요|출발하죠 미끄러져요|미끄러지죠"
                ),
                "formal": words("달립니다 멈춥니다 지나갑니다 돌아옵니다 출발합니다 미끄러집니다"),
                "formalQuestion": words(
                    "달립니까 멈춥니까 지나갑니까 돌아옵니까 출발합니까 미끄러집니까"
                ),
                "linking": words("달리고 멈추고 지나가고 돌아오고 출발하고 미끄러지고"),
            },
            past=conjugate("달렸 멈췄 지나갔 돌아왔 출발했 미끄러졌", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("번진다 사라진다 남는다 스며든다 되풀이된다 짙어진다"),
            forms={
                "question": words("""
                    번지니|번지나|번지는가 사라지니|사라지나|사라지는가 남니|남나|남는가 스며드니|스며드나|스며드는가 되풀이되니|되풀이되나|되풀이되는가
                    짙어지니|짙어지나|짙어지는가
                """),
                "exclamation": words("""
                    번지는구나|번지네|번지는군 사라지는구나|사라지네|사라지는군 남는구나|남네|남는군 스며드는구나|스며드네|스며드는군
                    되풀이되는구나|되풀이되네|되풀이되는군 짙어지는구나|짙어지네|짙어지는군
                """),
                "casual": words("번져 사라져 남아 스며들어 되풀이돼 짙어져"),
                "casualQuestion": words(
                    "번져|번지지 사라져|사라지지 남아|남지 스며들어|스며들지 되풀이돼|되풀이되지 짙어져|짙어지지"
                ),
                "polite": words("번져요 사라져요 남아요 스며들어요 되풀이돼요 짙어져요"),
                "politeQuestion": words(
                    "번져요|번지죠 사라져요|사라지죠 남아요|남죠 스며들어요|스며들죠 되풀이돼요|되풀이되죠 짙어져요|짙어지죠"
                ),
                "formal": words("번집니다 사라집니다 남습니다 스며듭니다 되풀이됩니다 짙어집니다"),
                "formalQuestion": words(
                    "번집니까 사라집니까 남습니까 스며듭니까 되풀이됩니까 짙어집니까"
                ),
                "linking": words("번지고 사라지고 남고 스며들고 되풀이되고 짙어지고"),
            },
            past=conjugate("번졌 사라졌 남았 스며들었 되풀이됐 짙어졌", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("자란다 시든다 피어난다 흔들린다 뿌리내린다"),
            forms={
                "question": words("""
                    자라니|자라나|자라는가 시드니|시드나|시드는가 피어나니|피어나나|피어나는가 흔들리니|흔들리나|흔들리는가 뿌리내리니|뿌리내리나|뿌리내리는가
                """),
                "exclamation": words("""
                    자라는구나|자라네|자라는군 시드는구나|시드네|시드는군 피어나는구나|피어나네|피어나는군 흔들리는구나|흔들리네|흔들리는군
                    뿌리내리는구나|뿌리내리네|뿌리내리는군
                """),
                "casual": words("자라 시들어 피어나 흔들려 뿌리내려"),
                "casualQuestion": words(
                    "자라|자라지 시들어|시들지 피어나|피어나지 흔들려|흔들리지 뿌리내려|뿌리내리지"
                ),
                "polite": words("자라요 시들어요 피어나요 흔들려요 뿌리내려요"),
                "politeQuestion": words(
                    "자라요|자라죠 시들어요|시들죠 피어나요|피어나죠 흔들려요|흔들리죠 뿌리내려요|뿌리내리죠"
                ),
                "formal": words("자랍니다 시듭니다 피어납니다 흔들립니다 뿌리내립니다"),
                "formalQuestion": words("자랍니까 시듭니까 피어납니까 흔들립니까 뿌리내립니까"),
                "linking": words("자라고 시들고 피어나고 흔들리고 뿌리내리고"),
            },
            past=conjugate("자랐 시들었 피어났 흔들렸 뿌리내렸", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("떨린다 움직인다 저린다 굳는다"),
            forms={
                "question": words(
                    "떨리니|떨리나|떨리는가 움직이니|움직이나|움직이는가 저리니|저리나|저리는가 굳니|굳나|굳는가"
                ),
                "exclamation": words(
                    "떨리는구나|떨리네|떨리는군 움직이는구나|움직이네|움직이는군 저리는구나|저리네|저리는군 굳는구나|굳네|굳는군"
                ),
                "casual": words("떨려 움직여 저려 굳어"),
                "casualQuestion": words("떨려|떨리지 움직여|움직이지 저려|저리지 굳어|굳지"),
                "polite": words("떨려요 움직여요 저려요 굳어요"),
                "politeQuestion": words(
                    "떨려요|떨리죠 움직여요|움직이죠 저려요|저리죠 굳어요|굳죠"
                ),
                "formal": words("떨립니다 움직입니다 저립니다 굳습니다"),
                "formalQuestion": words("떨립니까 움직입니까 저립니까 굳습니까"),
                "linking": words("떨리고 움직이고 저리고 굳고"),
            },
            past=conjugate("떨렸 움직였 저렸 굳었", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("식는다 끓는다 상한다 남는다"),
            forms={
                "question": words(
                    "식니|식나|식는가 끓니|끓나|끓는가 상하니|상하나|상하는가 남니|남나|남는가"
                ),
                "exclamation": words(
                    "식는구나|식네|식는군 끓는구나|끓네|끓는군 상하는구나|상하네|상하는군 남는구나|남네|남는군"
                ),
                "casual": words("식어 끓어 상해 남아"),
                "casualQuestion": words("식어|식지 끓어|끓지 상해|상하지 남아|남지"),
                "polite": words("식어요 끓어요 상해요 남아요"),
                "politeQuestion": words("식어요|식죠 끓어요|끓죠 상해요|상하죠 남아요|남죠"),
                "formal": words("식습니다 끓습니다 상합니다 남습니다"),
                "formalQuestion": words("식습니까 끓습니까 상합니까 남습니까"),
                "linking": words("식고 끓고 상하고 남고"),
            },
            past=conjugate("식었 끓었 상했 남았", _PAST),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            subject_themes=("food",),
            words=words("익는다 녹는다"),
            forms={
                "question": words("익니|익나|익는가 녹니|녹나|녹는가"),
                "exclamation": words("익는구나|익네|익는군 녹는구나|녹네|녹는군"),
                "casual": words("익어 녹아"),
                "casualQuestion": words("익어|익지 녹아|녹지"),
                "polite": words("익어요 녹아요"),
                "politeQuestion": words("익어요|익죠 녹아요|녹죠"),
                "formal": words("익습니다 녹습니다"),
                "formalQuestion": words("익습니까 녹습니까"),
                "linking": words("익고 녹고"),
            },
            past=conjugate("익었 녹았", _PAST),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words(
                "크다 작다 빠르다 느리다 조용하다 시끄럽다 용감하다 게으르다 부지런하다 사납다 순하다 영리하다"
            ),
            forms={
                "question": words("""
                    크니|큰가 작으니|작은가 빠르니|빠른가 느리니|느린가 조용하니|조용한가 시끄러우니|시끄러운가 용감하니|용감한가 게으르니|게으른가
                    부지런하니|부지런한가 사나우니|사나운가 순하니|순한가 영리하니|영리한가
                """),
                "exclamation": words("""
                    크구나|크네|크군 작구나|작네|작군 빠르구나|빠르네|빠르군 느리구나|느리네|느리군 조용하구나|조용하네|조용하군 시끄럽구나|시끄럽네|시끄럽군
                    용감하구나|용감하네|용감하군 게으르구나|게으르네|게으르군 부지런하구나|부지런하네|부지런하군 사납구나|사납네|사납군 순하구나|순하네|순하군
                    영리하구나|영리하네|영리하군
                """),
                "casual": words(
                    "커 작아 빨라 느려 조용해 시끄러워 용감해 게을러 부지런해 사나워 순해 영리해"
                ),
                "casualQuestion": words("""
                    커|크지 작아|작지 빨라|빠르지 느려|느리지 조용해|조용하지 시끄러워|시끄럽지 용감해|용감하지 게을러|게으르지 부지런해|부지런하지 사나워|사납지
                    순해|순하지 영리해|영리하지
                """),
                "polite": words(
                    "커요 작아요 빨라요 느려요 조용해요 시끄러워요 용감해요 게을러요 부지런해요 사나워요 순해요 영리해요"
                ),
                "politeQuestion": words("""
                    커요|크죠 작아요|작죠 빨라요|빠르죠 느려요|느리죠 조용해요|조용하죠 시끄러워요|시끄럽죠 용감해요|용감하죠 게을러요|게으르죠
                    부지런해요|부지런하죠 사나워요|사납죠 순해요|순하죠 영리해요|영리하죠
                """),
                "formal": words("""
                    큽니다 작습니다 빠릅니다 느립니다 조용합니다 시끄럽습니다 용감합니다 게으릅니다 부지런합니다 사납습니다 순합니다 영리합니다
                """),
                "formalQuestion": words("""
                    큽니까 작습니까 빠릅니까 느립니까 조용합니까 시끄럽습니까 용감합니까 게으릅니까 부지런합니까 사납습니까 순합니까 영리합니까
                """),
            },
            past=conjugate(
                "컸 작았 빨랐 느렸 조용했 시끄러웠 용감했 게을렀 부지런했 사나웠 순했 영리했", _PAST
            ),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("배고프다 허기지다"),
            forms={
                "question": words("배고프니|배고픈가 허기지니|허기진가"),
                "exclamation": words("배고프구나|배고프네|배고프군 허기지구나|허기지네|허기지군"),
                "casual": words("배고파 허기져"),
                "casualQuestion": words("배고파|배고프지 허기져|허기지지"),
                "polite": words("배고파요 허기져요"),
                "politeQuestion": words("배고파요|배고프죠 허기져요|허기지죠"),
                "formal": words("배고픕니다 허기집니다"),
                "formalQuestion": words("배고픕니까 허기집니까"),
            },
            past=conjugate("배고팠 허기졌", _PAST),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("배부르다 든든하다"),
            forms={
                "question": words("배부르니|배부른가 든든하니|든든한가"),
                "exclamation": words("배부르구나|배부르네|배부르군 든든하구나|든든하네|든든하군"),
                "casual": words("배불러 든든해"),
                "casualQuestion": words("배불러|배부르지 든든해|든든하지"),
                "polite": words("배불러요 든든해요"),
                "politeQuestion": words("배불러요|배부르죠 든든해요|든든하죠"),
                "formal": words("배부릅니다 든든합니다"),
                "formalQuestion": words("배부릅니까 든든합니까"),
            },
            past=conjugate("배불렀 든든했", _PAST),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("피곤하다 졸리다 나른하다 고단하다"),
            forms={
                "question": words(
                    "피곤하니|피곤한가 졸리니|졸린가 나른하니|나른한가 고단하니|고단한가"
                ),
                "exclamation": words(
                    "피곤하구나|피곤하네|피곤하군 졸리구나|졸리네|졸리군 나른하구나|나른하네|나른하군 고단하구나|고단하네|고단하군"
                ),
                "casual": words("피곤해 졸려 나른해 고단해"),
                "casualQuestion": words(
                    "피곤해|피곤하지 졸려|졸리지 나른해|나른하지 고단해|고단하지"
                ),
                "polite": words("피곤해요 졸려요 나른해요 고단해요"),
                "politeQuestion": words(
                    "피곤해요|피곤하죠 졸려요|졸리죠 나른해요|나른하죠 고단해요|고단하죠"
                ),
                "formal": words("피곤합니다 졸립니다 나른합니다 고단합니다"),
                "formalQuestion": words("피곤합니까 졸립니까 나른합니까 고단합니까"),
            },
            past=conjugate("피곤했 졸렸 나른했 고단했", _PAST),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("상쾌하다 개운하다 활기차다"),
            forms={
                "question": words("상쾌하니|상쾌한가 개운하니|개운한가 활기차니|활기찬가"),
                "exclamation": words(
                    "상쾌하구나|상쾌하네|상쾌하군 개운하구나|개운하네|개운하군 활기차구나|활기차네|활기차군"
                ),
                "casual": words("상쾌해 개운해 활기차"),
                "casualQuestion": words("상쾌해|상쾌하지 개운해|개운하지 활기차|활기차지"),
                "polite": words("상쾌해요 개운해요 활기차요"),
                "politeQuestion": words("상쾌해요|상쾌하죠 개운해요|개운하죠 활기차요|활기차죠"),
                "formal": words("상쾌합니다 개운합니다 활기찹니다"),
                "formalQuestion": words("상쾌합니까 개운합니까 활기찹니까"),
            },
            past=conjugate("상쾌했 개운했 활기찼", _PAST),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("기쁘다 즐겁다 편안하다 만족스럽다 행복하다 뿌듯하다"),
            forms={
                "question": words(
                    "기쁘니|기쁜가 즐겁니|즐거운가 편안하니|편안한가 만족스럽니|만족스러운가 행복하니|행복한가 뿌듯하니|뿌듯한가"
                ),
                "exclamation": words("""
                    기쁘구나|기쁘네|기쁘군 즐겁구나|즐겁네|즐겁군 편안하구나|편안하네|편안하군 만족스럽구나|만족스럽네|만족스럽군 행복하구나|행복하네|행복하군
                    뿌듯하구나|뿌듯하네|뿌듯하군
                """),
                "casual": words("기뻐 즐거워 편안해 만족스러워 행복해 뿌듯해"),
                "casualQuestion": words(
                    "기뻐|기쁘지 즐거워|즐겁지 편안해|편안하지 만족스러워|만족스럽지 행복해|행복하지 뿌듯해|뿌듯하지"
                ),
                "polite": words("기뻐요 즐거워요 편안해요 만족스러워요 행복해요 뿌듯해요"),
                "politeQuestion": words(
                    "기뻐요|기쁘죠 즐거워요|즐겁죠 편안해요|편안하죠 만족스러워요|만족스럽죠 행복해요|행복하죠 뿌듯해요|뿌듯하죠"
                ),
                "formal": words(
                    "기쁩니다 즐겁습니다 편안합니다 만족스럽습니다 행복합니다 뿌듯합니다"
                ),
                "formalQuestion": words(
                    "기쁩니까 즐겁습니까 편안합니까 만족스럽습니까 행복합니까 뿌듯합니까"
                ),
            },
            past=conjugate("기뻤 즐거웠 편안했 만족스러웠 행복했 뿌듯했", _PAST),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("심심하다 궁금하다 초조하다 답답하다"),
            forms={
                "question": words(
                    "심심하니|심심한가 궁금하니|궁금한가 초조하니|초조한가 답답하니|답답한가"
                ),
                "exclamation": words(
                    "심심하구나|심심하네|심심하군 궁금하구나|궁금하네|궁금하군 초조하구나|초조하네|초조하군 답답하구나|답답하네|답답하군"
                ),
                "casual": words("심심해 궁금해 초조해 답답해"),
                "casualQuestion": words(
                    "심심해|심심하지 궁금해|궁금하지 초조해|초조하지 답답해|답답하지"
                ),
                "polite": words("심심해요 궁금해요 초조해요 답답해요"),
                "politeQuestion": words(
                    "심심해요|심심하죠 궁금해요|궁금하죠 초조해요|초조하죠 답답해요|답답하죠"
                ),
                "formal": words("심심합니다 궁금합니다 초조합니다 답답합니다"),
                "formalQuestion": words("심심합니까 궁금합니까 초조합니까 답답합니까"),
            },
            past=conjugate("심심했 궁금했 초조했 답답했", _PAST),
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
            words=words("아름답다 낯설다 새롭다 흔하다 드물다"),
            forms={
                "question": words(
                    "아름다우니|아름다운가 낯서니|낯선가 새로우니|새로운가 흔하니|흔한가 드무니|드문가"
                ),
                "exclamation": words("""
                    아름답구나|아름답네|아름답군 낯설구나|낯서네|낯설군 새롭구나|새롭네|새롭군 흔하구나|흔하네|흔하군 드물구나|드무네|드물군
                """),
                "casual": words("아름다워 낯설어 새로워 흔해 드물어"),
                "casualQuestion": words(
                    "아름다워|아름답지 낯설어|낯설지 새로워|새롭지 흔해|흔하지 드물어|드물지"
                ),
                "polite": words("아름다워요 낯설어요 새로워요 흔해요 드물어요"),
                "politeQuestion": words(
                    "아름다워요|아름답죠 낯설어요|낯설죠 새로워요|새롭죠 흔해요|흔하죠 드물어요|드물죠"
                ),
                "formal": words("아름답습니다 낯섭니다 새롭습니다 흔합니다 드뭅니다"),
                "formalQuestion": words("아름답습니까 낯섭니까 새롭습니까 흔합니까 드뭅니까"),
            },
            past=conjugate("아름다웠 낯설었 새로웠 흔했 드물었", _PAST),
        ),
        StateGroup(
            subject=("place",),
            words=words("넓다 좁다 고요하다 깊다 어둡다 밝다 아득하다 가파르다"),
            forms={
                "question": words("""
                    넓으니|넓은가 좁으니|좁은가 고요하니|고요한가 깊으니|깊은가 어두우니|어두운가 밝으니|밝은가 아득하니|아득한가 가파르니|가파른가
                """),
                "exclamation": words("""
                    넓구나|넓네|넓군 좁구나|좁네|좁군 고요하구나|고요하네|고요하군 깊구나|깊네|깊군 어둡구나|어둡네|어둡군 밝구나|밝네|밝군
                    아득하구나|아득하네|아득하군 가파르구나|가파르네|가파르군
                """),
                "casual": words("넓어 좁아 고요해 깊어 어두워 밝아 아득해 가팔라"),
                "casualQuestion": words(
                    "넓어|넓지 좁아|좁지 고요해|고요하지 깊어|깊지 어두워|어둡지 밝아|밝지 아득해|아득하지 가팔라|가파르지"
                ),
                "polite": words("넓어요 좁아요 고요해요 깊어요 어두워요 밝아요 아득해요 가팔라요"),
                "politeQuestion": words("""
                    넓어요|넓죠 좁아요|좁죠 고요해요|고요하죠 깊어요|깊죠 어두워요|어둡죠 밝아요|밝죠 아득해요|아득하죠 가팔라요|가파르죠
                """),
                "formal": words(
                    "넓습니다 좁습니다 고요합니다 깊습니다 어둡습니다 밝습니다 아득합니다 가파릅니다"
                ),
                "formalQuestion": words(
                    "넓습니까 좁습니까 고요합니까 깊습니까 어둡습니까 밝습니까 아득합니까 가파릅니까"
                ),
            },
            past=conjugate("넓었 좁았 고요했 깊었 어두웠 밝았 아득했 가팔랐", _PAST),
        ),
        StateGroup(
            subject=("event",),
            words=words("길다 짧다 요란하다 고요하다 갑작스럽다"),
            forms={
                "question": words(
                    "기니|긴가 짧니|짧은가 요란하니|요란한가 고요하니|고요한가 갑작스럽니|갑작스러운가"
                ),
                "exclamation": words("""
                    길구나|기네|길군 짧구나|짧네|짧군 요란하구나|요란하네|요란하군 고요하구나|고요하네|고요하군 갑작스럽구나|갑작스럽네|갑작스럽군
                """),
                "casual": words("길어 짧아 요란해 고요해 갑작스러워"),
                "casualQuestion": words(
                    "길어|길지 짧아|짧지 요란해|요란하지 고요해|고요하지 갑작스러워|갑작스럽지"
                ),
                "polite": words("길어요 짧아요 요란해요 고요해요 갑작스러워요"),
                "politeQuestion": words(
                    "길어요|길죠 짧아요|짧죠 요란해요|요란하죠 고요해요|고요하죠 갑작스러워요|갑작스럽죠"
                ),
                "formal": words("깁니다 짧습니다 요란합니다 고요합니다 갑작스럽습니다"),
                "formalQuestion": words("깁니까 짧습니까 요란합니까 고요합니까 갑작스럽습니까"),
            },
            past=conjugate("길었 짧았 요란했 고요했 갑작스러웠", _PAST),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            subject_themes=("object", "tool", "clothing", "product", "gem", "vehicle"),
            words=words("단단하다 가볍다 무겁다 매끈하다 투명하다 튼튼하다 반들반들하다"),
            forms={
                "question": words("""
                    단단하니|단단한가 가벼우니|가벼운가 무거우니|무거운가 매끈하니|매끈한가 투명하니|투명한가 튼튼하니|튼튼한가 반들반들하니|반들반들한가
                """),
                "exclamation": words("""
                    단단하구나|단단하네|단단하군 가볍구나|가볍네|가볍군 무겁구나|무겁네|무겁군 매끈하구나|매끈하네|매끈하군 투명하구나|투명하네|투명하군
                    튼튼하구나|튼튼하네|튼튼하군 반들반들하구나|반들반들하네|반들반들하군
                """),
                "casual": words("단단해 가벼워 무거워 매끈해 투명해 튼튼해 반들반들해"),
                "casualQuestion": words("""
                    단단해|단단하지 가벼워|가볍지 무거워|무겁지 매끈해|매끈하지 투명해|투명하지 튼튼해|튼튼하지 반들반들해|반들반들하지
                """),
                "polite": words(
                    "단단해요 가벼워요 무거워요 매끈해요 투명해요 튼튼해요 반들반들해요"
                ),
                "politeQuestion": words("""
                    단단해요|단단하죠 가벼워요|가볍죠 무거워요|무겁죠 매끈해요|매끈하죠 투명해요|투명하죠 튼튼해요|튼튼하죠 반들반들해요|반들반들하죠
                """),
                "formal": words(
                    "단단합니다 가볍습니다 무겁습니다 매끈합니다 투명합니다 튼튼합니다 반들반들합니다"
                ),
                "formalQuestion": words(
                    "단단합니까 가볍습니까 무겁습니까 매끈합니까 투명합니까 튼튼합니까 반들반들합니까"
                ),
            },
            past=conjugate("단단했 가벼웠 무거웠 매끈했 투명했 튼튼했 반들반들했", _PAST),
        ),
        StateGroup(
            subject=("thing",),
            subject_themes=("music",),
            words=words("잔잔하다 경쾌하다 구슬프다 감미롭다 흥겹다"),
            forms={
                "question": words(
                    "잔잔하니|잔잔한가 경쾌하니|경쾌한가 구슬프니|구슬픈가 감미롭니|감미로운가 흥겹니|흥겨운가"
                ),
                "exclamation": words("""
                    잔잔하구나|잔잔하네|잔잔하군 경쾌하구나|경쾌하네|경쾌하군 구슬프구나|구슬프네|구슬프군 감미롭구나|감미롭네|감미롭군 흥겹구나|흥겹네|흥겹군
                """),
                "casual": words("잔잔해 경쾌해 구슬퍼 감미로워 흥겨워"),
                "casualQuestion": words(
                    "잔잔해|잔잔하지 경쾌해|경쾌하지 구슬퍼|구슬프지 감미로워|감미롭지 흥겨워|흥겹지"
                ),
                "polite": words("잔잔해요 경쾌해요 구슬퍼요 감미로워요 흥겨워요"),
                "politeQuestion": words(
                    "잔잔해요|잔잔하죠 경쾌해요|경쾌하죠 구슬퍼요|구슬프죠 감미로워요|감미롭죠 흥겨워요|흥겹죠"
                ),
                "formal": words("잔잔합니다 경쾌합니다 구슬픕니다 감미롭습니다 흥겹습니다"),
                "formalQuestion": words("잔잔합니까 경쾌합니까 구슬픕니까 감미롭습니까 흥겹습니까"),
            },
            past=conjugate("잔잔했 경쾌했 구슬펐 감미로웠 흥겨웠", _PAST),
        ),
        StateGroup(
            subject=("edible",),
            words=words("달다 시다 뜨겁다 차갑다"),
            forms={
                "question": words("다니|단가 시니|신가 뜨거우니|뜨거운가 차가우니|차가운가"),
                "exclamation": words(
                    "달구나|다네|달군 시구나|시네|시군 뜨겁구나|뜨겁네|뜨겁군 차갑구나|차갑네|차갑군"
                ),
                "casual": words("달아 셔 뜨거워 차가워"),
                "casualQuestion": words("달아|달지 셔|시지 뜨거워|뜨겁지 차가워|차갑지"),
                "polite": words("달아요 셔요 뜨거워요 차가워요"),
                "politeQuestion": words("달아요|달죠 셔요|시죠 뜨거워요|뜨겁죠 차가워요|차갑죠"),
                "formal": words("답니다 십니다 뜨겁습니다 차갑습니다"),
                "formalQuestion": words("답니까 십니까 뜨겁습니까 차갑습니까"),
            },
            past=conjugate("달았 셨 뜨거웠 차가웠", _PAST),
        ),
        StateGroup(
            subject=("edible",),
            subject_themes=("food",),
            words=words("짜다 맵다 고소하다 담백하다"),
            forms={
                "question": words("짜니|짠가 매우니|매운가 고소하니|고소한가 담백하니|담백한가"),
                "exclamation": words(
                    "짜구나|짜네|짜군 맵구나|맵네|맵군 고소하구나|고소하네|고소하군 담백하구나|담백하네|담백하군"
                ),
                "casual": words("짜 매워 고소해 담백해"),
                "casualQuestion": words("짜|짜지 매워|맵지 고소해|고소하지 담백해|담백하지"),
                "polite": words("짜요 매워요 고소해요 담백해요"),
                "politeQuestion": words(
                    "짜요|짜죠 매워요|맵죠 고소해요|고소하죠 담백해요|담백하죠"
                ),
                "formal": words("짭니다 맵습니다 고소합니다 담백합니다"),
                "formalQuestion": words("짭니까 맵습니까 고소합니까 담백합니까"),
            },
            past=conjugate("짰 매웠 고소했 담백했", _PAST),
        ),
        StateGroup(
            subject=("idea",),
            words=words("분명하다 흐릿하다 영원하다 덧없다"),
            forms={
                "question": words(
                    "분명하니|분명한가 흐릿하니|흐릿한가 영원하니|영원한가 덧없으니|덧없는가"
                ),
                "exclamation": words(
                    "분명하구나|분명하네|분명하군 흐릿하구나|흐릿하네|흐릿하군 영원하구나|영원하네|영원하군 덧없구나|덧없네|덧없군"
                ),
                "casual": words("분명해 흐릿해 영원해 덧없어"),
                "casualQuestion": words(
                    "분명해|분명하지 흐릿해|흐릿하지 영원해|영원하지 덧없어|덧없지"
                ),
                "polite": words("분명해요 흐릿해요 영원해요 덧없어요"),
                "politeQuestion": words(
                    "분명해요|분명하죠 흐릿해요|흐릿하죠 영원해요|영원하죠 덧없어요|덧없죠"
                ),
                "formal": words("분명합니다 흐릿합니다 영원합니다 덧없습니다"),
                "formalQuestion": words("분명합니까 흐릿합니까 영원합니까 덧없습니까"),
            },
            past=conjugate("분명했 흐릿했 영원했 덧없었", _PAST),
        ),
        StateGroup(
            subject=("idea",),
            subject_themes=("concept", "tech", "finance"),
            words=words("어렵다 쉽다"),
            forms={
                "question": words("어려우니|어려운가 쉬우니|쉬운가"),
                "exclamation": words("어렵구나|어렵네|어렵군 쉽구나|쉽네|쉽군"),
                "casual": words("어려워 쉬워"),
                "casualQuestion": words("어려워|어렵지 쉬워|쉽지"),
                "polite": words("어려워요 쉬워요"),
                "politeQuestion": words("어려워요|어렵죠 쉬워요|쉽죠"),
                "formal": words("어렵습니다 쉽습니다"),
                "formalQuestion": words("어렵습니까 쉽습니까"),
            },
            past=conjugate("어려웠 쉬웠", _PAST),
        ),
        StateGroup(
            subject=("idea",),
            subject_themes=("color",),
            words=words("짙다 옅다 선명하다 화사하다 은은하다"),
            forms={
                "question": words(
                    "짙니|짙은가 옅니|옅은가 선명하니|선명한가 화사하니|화사한가 은은하니|은은한가"
                ),
                "exclamation": words("""
                    짙구나|짙네|짙군 옅구나|옅네|옅군 선명하구나|선명하네|선명하군 화사하구나|화사하네|화사하군 은은하구나|은은하네|은은하군
                """),
                "casual": words("짙어 옅어 선명해 화사해 은은해"),
                "casualQuestion": words(
                    "짙어|짙지 옅어|옅지 선명해|선명하지 화사해|화사하지 은은해|은은하지"
                ),
                "polite": words("짙어요 옅어요 선명해요 화사해요 은은해요"),
                "politeQuestion": words(
                    "짙어요|짙죠 옅어요|옅죠 선명해요|선명하죠 화사해요|화사하죠 은은해요|은은하죠"
                ),
                "formal": words("짙습니다 옅습니다 선명합니다 화사합니다 은은합니다"),
                "formalQuestion": words("짙습니까 옅습니까 선명합니까 화사합니까 은은합니까"),
            },
            past=conjugate("짙었 옅었 선명했 화사했 은은했", _PAST),
        ),
        StateGroup(
            subject=("plant",),
            words=words("푸르다 무성하다 향기롭다 시들하다"),
            forms={
                "question": words(
                    "푸르니|푸른가 무성하니|무성한가 향기로우니|향기로운가 시들하니|시들한가"
                ),
                "exclamation": words(
                    "푸르구나|푸르네|푸르군 무성하구나|무성하네|무성하군 향기롭구나|향기롭네|향기롭군 시들하구나|시들하네|시들하군"
                ),
                "casual": words("푸르러 무성해 향기로워 시들해"),
                "casualQuestion": words(
                    "푸르러|푸르지 무성해|무성하지 향기로워|향기롭지 시들해|시들하지"
                ),
                "polite": words("푸르러요 무성해요 향기로워요 시들해요"),
                "politeQuestion": words(
                    "푸르러요|푸르죠 무성해요|무성하죠 향기로워요|향기롭죠 시들해요|시들하죠"
                ),
                "formal": words("푸릅니다 무성합니다 향기롭습니다 시들합니다"),
                "formalQuestion": words("푸릅니까 무성합니까 향기롭습니까 시들합니까"),
            },
            past=conjugate("푸르렀 무성했 향기로웠 시들했", _PAST),
        ),
        StateGroup(
            subject=("body",),
            words=words("따뜻하다 차갑다 아프다 뻣뻣하다"),
            forms={
                "question": words(
                    "따뜻하니|따뜻한가 차가우니|차가운가 아프니|아픈가 뻣뻣하니|뻣뻣한가"
                ),
                "exclamation": words(
                    "따뜻하구나|따뜻하네|따뜻하군 차갑구나|차갑네|차갑군 아프구나|아프네|아프군 뻣뻣하구나|뻣뻣하네|뻣뻣하군"
                ),
                "casual": words("따뜻해 차가워 아파 뻣뻣해"),
                "casualQuestion": words(
                    "따뜻해|따뜻하지 차가워|차갑지 아파|아프지 뻣뻣해|뻣뻣하지"
                ),
                "polite": words("따뜻해요 차가워요 아파요 뻣뻣해요"),
                "politeQuestion": words(
                    "따뜻해요|따뜻하죠 차가워요|차갑죠 아파요|아프죠 뻣뻣해요|뻣뻣하죠"
                ),
                "formal": words("따뜻합니다 차갑습니다 아픕니다 뻣뻣합니다"),
                "formalQuestion": words("따뜻합니까 차갑습니까 아픕니까 뻣뻣합니까"),
            },
            past=conjugate("따뜻했 차가웠 아팠 뻣뻣했", _PAST),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                용감한 씩씩한 다정한 부지런한 게으른 수줍은 영리한 어린 늙은 작은 커다란 조용한 명랑한 느긋한 재빠른 호기심어린 명민한 씩씩한 의젓한 천진한
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("젊은 친절한 엄격한 진지한 바쁜 성실한 낯선 유쾌한"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("날쌘 사나운 순한 겁많은 통통한 조그만"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words(
                "달콤한 매콤한 따뜻한 신선한 바삭한 고소한 향긋한 뜨거운 짭짤한 말랑한 촉촉한 새콤한 먹음직한 담백한"
            ),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words(
                "달콤한 따뜻한 차가운 시원한 뜨거운 향긋한 신선한 새콤한 진한 씁쓸한 시원한"
            ),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words(
                "낡은 새로운 작은 커다란 가벼운 무거운 반짝이는 매끈한 투명한 단단한 예쁜 소중한 오래된 반듯한"
            ),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("빠른 느린 덜컹거리는 튼튼한"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words(
                "고요한 넓은 어두운 밝은 낯선 오래된 아늑한 한적한 북적이는 조용한 외딴 먼 가까운 텅빈 쓸쓸한 환한"
            ),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("푸른 무성한 향기로운 어린 시든 커다란 작은 여린 싱싱한"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("희미한 오래된 새로운 낯선 분명한 소중한 작은 엉뚱한 막연한"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("긴 짧은 조용한 화창한 흐린 요란한 갑작스러운 느긋한"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("작은 차가운 따뜻한 튼튼한 여린"),
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
            words=words("아름다운 신비한 낯선 새로운"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                조용히 천천히 빠르게 가만히 슬며시 홀로 잠시 갑자기 조심스레 힘차게 살며시 묵묵히 느긋하게 씩씩하게 훌쩍 곧장 슬쩍 사뿐히 성큼성큼 부지런히 유유히
                냉큼 차분히 은근히 대뜸 나직이 느릿느릿 재빨리 가볍게 얌전히 무심히 덤덤히 성실히 신나게 살짝 부리나케 천연덕스럽게
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                조용히 천천히 서서히 문득 다시 계속 잠시 갑자기 언제나 여전히 은은히 살며시 가만히 슬며시 조금씩 차츰 점점 어느새 고요히
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("새벽에 이른아침에 아침에 한낮에 오후에 해질녘에 초저녁에 저녁에 밤에 한밤중에"),
        any=words(
            "봄에 여름에 가을에 겨울에 주말에 휴일에 명절에 장마철에 이른봄에 늦가을에 새해에"
        ),
        past=words("어제 지난주에 오래전에 한때 그날 그때 며칠전에 지난밤에"),
        present=words("오늘 방금 이제 내일 다음주에"),
        habitual=words("요즘 가끔 매일 자주 이따금"),
    ),
    homes=words("집"),
    join=SentenceJoin(form="linking"),
    connectives={
        "additive": words("그리고 게다가 그러고는"),
        "temporal": words(
            "이윽고 곧 그러자 이내 어느새 마침내 그제야 한편 그러고나서 잠시후 얼마뒤"
        ),
        "contrastive": words("하지만 그런데 그러나 다만 오히려 그래도"),
        "causal": words("그래서 그러므로 결국 그러니"),
    },
    traits={
        "flier": words("""
            부엉이 올빼미 참새 까치 제비 독수리 매 학 백조 오리 기러기 딱따구리 앵무새 공작 나비 벌 잠자리 무당벌레 박쥐 갈매기 까마귀 비둘기 꾀꼬리 반딧불이 매미
            하루살이 풍뎅이 사슴벌레 파리 모기 나방 용 봉황 마룡 비룡 흑룡 백룡 청룡 주작 삼족오 하피 드래곤 와이번 불사조 그리핀 페가수스 천마 천사 선녀 요정 정령
            픽시 임프 가고일 발키리
        """),
        "swimmer": words("""
            고래 돌고래 상어 거북 물개 펭귄 개구리 문어 오징어 해마 불가사리 새우 잉어 연어 고등어 올챙이 악어 붕어 메기 가물치 쏘가리 송사리 미꾸라지 장어 뱀장어
            갈치 삼치 꽁치 멸치 조기 명태 대구 광어 도미 우럭 볼락 방어 참치 가오리 홍어 복어 인어 세이렌 크라켄 물귀신 나이아드
        """),
        "crawler": words("""
            거북 도마뱀 카멜레온 뱀 달팽이 개미 거미 소라 게 지렁이 지네 노래기 전갈 진드기 벼룩 누에 번데기 애벌레 도롱뇽 사마귀 악어 구렁이 살모사 독사 코브라
            방울뱀 비단뱀 이구아나
        """),
    },
    interjections=words(
        "아, 오, 와, 어머, 이런, 저런, 세상에, 아이고, 참, 어이쿠, 아이참, 어라, 우와, 이야,"
    ),
    pronouns={"n": ("", "그것")},
    pronounless=("person", "creature"),
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
    calendar=SentenceCalendar(
        date="Y년 M월 D일",
        clock="h시 mm분",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("이다"),
            forms={
                "question": words("이니|인가"),
                "exclamation": words("이구나|이네"),
                "casual": words("이야"),
                "casualQuestion": words("이야|이지"),
                "polite": words("이에요"),
                "politeQuestion": words("이에요|이죠"),
                "formal": words("입니다"),
                "formalQuestion": words("입니까"),
            },
            past=PredicateTense(
                words=words("이었다"),
                forms={
                    "question": words("이었니|이었나|이었는가"),
                    "exclamation": words("이었구나|이었네|이었군"),
                    "casual": words("이었어"),
                    "casualQuestion": words("이었어|이었지"),
                    "polite": words("이었어요"),
                    "politeQuestion": words("이었어요|이었죠"),
                    "formal": words("이었습니다"),
                    "formalQuestion": words("이었습니까"),
                },
            ),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", tail="에"),
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", tail="에"),
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="는", tail_alt="은"),
                SentencePart("date", copula="tail"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="는", tail_alt="은"),
                SentencePart("clock", copula="tail"),
            ),
            4,
        ),
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
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart(
                    "destination", tail="로", tail_alt="으로", tail_liquid="로", modifiable=True
                ),
                SentencePart("verb"),
            ),
            8,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("destination", tail="에", modifiable=True),
                SentencePart("verb"),
            ),
            8,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart(
                    "destination", tail="로", tail_alt="으로", tail_liquid="로", modifiable=True
                ),
                SentencePart("verb"),
            ),
            4,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("manner"),
                SentencePart("destination", tail="에", modifiable=True),
                SentencePart("verb"),
            ),
            3,
            fields=("arrive",),
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
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("object", tail="를", tail_alt="을", modifiable=True),
                SentencePart("verb"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("place", tail="에서", modifiable=True),
                SentencePart("manner"),
                SentencePart("object", tail="를", tail_alt="을", modifiable=True),
                SentencePart("verb"),
            ),
            3,
        ),
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
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart(
                    "destination", tail="로", tail_alt="으로", tail_liquid="로", modifiable=True
                ),
                SentencePart("verb"),
            ),
            6,
            mood="question",
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", tail="가", tail_alt="이", modifiable=True),
                SentencePart("quantity", tail="를", tail_alt="을"),
                SentencePart("verb"),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("quantity", tail="가", tail_alt="이"),
                SentencePart("verb"),
            ),
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
