// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/types.dart';

// Conventional romanization of the surnames below. Anything missing (including a
// syllable passed through `startsWith`) falls back to Revised Romanization.
/// Conventional romanization of the Korean surnames in the pool.
final Map<String, String> koSurnameRoman = romanMap(r'''
  김:Kim 이:Lee 박:Park 최:Choi 정:Jung 강:Kang 조:Cho 윤:Yoon 장:Jang 임:Lim
  한:Han 오:Oh 서:Seo 신:Shin 권:Kwon 황:Hwang 안:Ahn 송:Song 류:Ryu 전:Jeon
  홍:Hong 고:Ko 문:Moon 양:Yang 손:Son 배:Bae 백:Baek 허:Heo 유:Yoo 남:Nam 심:Shim
  노:Noh 하:Ha 곽:Kwak 성:Sung 차:Cha 주:Joo 우:Woo 구:Koo 나:Na 민:Min 진:Jin
  지:Ji 엄:Um 채:Chae 원:Won 천:Chun 방:Bang 공:Kong 현:Hyun 함:Ham 변:Byun
  염:Yeom 여:Yeo 추:Chu 도:Do 소:So 석:Seok 선:Sun 마:Ma 표:Pyo 태:Tae 명:Myung
  기:Ki 반:Ban 왕:Wang 금:Geum 옥:Ok 육:Yook 인:In 맹:Maeng 제:Je 모:Mo 탁:Tak
  국:Kook
''');

/// The Korean name dataset.
final NameLanguageData ko = NameLanguageData(
  order: NameOrder.familyFirst,
  joiner: '',
  hasMiddle: false,
  roman: RomanMode.hangul,
  lengthSpec: NameLengthSpec(
    given: LengthRange(2, 2),
    last: LengthRange(1, 1),
    middle: LengthRange(0, 0),
  ),
  // Weighted to reality: two-syllable given names dominate, one- and
  // three-syllable ones are the exception.
  givenLenWeights: {1: 4, 2: 92, 3: 4},
  // Share of the population carrying each surname (2015 census), in tenths of a
  // percent. Drawn evenly, 김 would lead one name in seventy-five instead of one
  // in five, which is the single loudest way the output stops reading Korean. The
  // tail below 변 is left out and keeps `LAST_WEIGHT_DEFAULT`.
  lastWeights: weightMap(r'''
    김:215 이:147 박:84 최:47 정:43 강:24 조:21 윤:21 장:20 임:17 오:14 한:14 신:13
    서:13 권:13 황:13 안:12 송:12 전:11 홍:11 유:10 고:9 문:9 양:8 손:8 배:8 백:7
    허:7 남:5 심:5 노:4 하:4 곽:4 성:4 차:4 주:4 우:4 구:4 진:3 지:3 엄:3 원:2 천:2
    방:2 공:2 현:2 함:2 변:2 채:2 민:2 나:2 류:2
  '''),
  last: pool(r'''
    김 이 박 최 정 강 조 윤 장 임 한 오 서 신 권 황 안 송 류 전 홍 고 문 양 손 배 백
    허 유 남 심 노 하 곽 성 차 주 우 구 나 민 진 지 엄 채 원 천 방 공 현 함 변 염 여
    추 도 소 석 선 마 표 태 명 기 반 왕 금 옥 육 인 맹 제 모 탁 국
  '''),
  givenMale: pool(r'''
    민준 서준 도윤 예준 시우 하준 주원 지호 지후 준우 준서 건우 현우 우진 선우 서진
    연우 유준 정우 승우 승현 시윤 지훈 진우 지환 수현 시현 동현 예성 재윤 은우 유찬
    이준 시온 재원 한결 태윤 승민 준혁 성민 지안 강민 재훈 민성 규민 도현 민재 재민
    성현 우성 태현 지성 준호 현준 형준 성준 정민 상현 진호 성호 종민 태호 재현 상우
    준영 동욱 정훈 영호 창민 대현 기현 승준 민수 영수 상민 경민 동주 승호 원준 호준
    세훈 지완 태민 정현 민혁 준수 상준 세준 이안 시원 재하 성우 동민 우빈 태우 진혁
    준현 성찬 예찬 은찬 도훈 시후 현수 정호 민호 종현 재준 우현 승재 태경 성재 규현
    동혁 상혁 인우 도영 하진 은성 재영 광수 종석 인호 승기 우재 지웅 다온 하람 준 현
    훈 빈 찬 진 결 온 솔 강 산 담 별 건 태준 도준 민우 재우 지운 성훈 시훈 은호 서호
    정후 도경 시환 재환 태영 상훈 병철 영철 성수 종수 재석 병수 동석 영진 상호 진성
    남준 형우 경훈 동훈 민규 승규 명수 광민 대호 기훈 우석 재호 준석 현석 영민 로운
    리안 유건 은결 진영 성용 종원 정욱 동건 근우 두호 호진 경수 상수 민태 태주 태하
    민석 이재 재성 재인 강훈 인규 남규 정남 순재 영우 우영 민건 인권 대겸 수호 준오
    강인 기찬 찬우 철민 철수 철규 광진 성광 가온 겨울 규빈 근호 기범 나윤 남우 노아
    다움 대윤 도하 두현 라온 로건 만호 명진 무진 문수 미르 바울 범수 별하 병호 보성
    봉수 산하 상엽 새벽 서강 석원 선호 성길 세빈 소한 수완 순호 슬찬 승윤 시목 신우
    아진 여울 연호 예강 온유 요한 우담 원석 유하 윤결
  '''),
  givenFemale: pool(r'''
    서연 서윤 지우 하은 하윤 민서 지유 윤서 채원 수아 지아 지안 다은 은서 예은 수빈
    소율 예린 지원 아린 서아 예원 유진 시은 하린 예진 지민 수연 유나 나윤 서영 은지
    지현 채은 서현 유주 지율 소은 나은 하영 다인 시아 연우 지수 가은 소연 세아 은채
    채영 다연 유빈 하늘 예서 소윤 서하 유하 다현 은하 아연 세은 채아 하연 나연 정연
    수현 예나 서인 지혜 아름 슬기 보라 유리 하나 다솜 영희 미영 은영 정희 지영 현정
    은주 미경 수진 혜진 경미 선영 소영 은정 미선 예지 승희 현주 은경 유정 소미 아윤
    서율 도연 세연 지선 은수 채린 다희 시연 예솔 나현 주하 서희 민지 수민 지은 혜원
    다빈 유은 하진 소희 예빈 태연 나래 미주 솔 별 봄 온 결 린 슬 담 진 윤 이서 서은
    지윤 예윤 하율 시율 다율 채윤 아라 시하 은유 서우 라온 아율 지효 세희 유선 소현
    미현 은혜 영숙 미숙 미란 혜경 혜영 혜선 수경 은미 정미 나영 다영 소정 예림 유림
    아영 소혜 가연 도희 서정 유미 진아 선희 경아 은아 지연 소진 예슬 하빈 서빈 채연
    소민 주연 연아 민아 민주 연지 소유 수희 희수 희연 연희 승아 나라 가현 수지 나리
    수미 정아 채민 라희 종서 현아 현서 연주 동은 은숙 명숙 명서 명선 성연 이현 미연
    미희 가람 가온 겨울 나비 나울 노을 다랑 다올 도담 도아 라윤 로하 마루 미르 미소
    바다 바람 별하 보름 봄솔 사랑 새롬 새봄 서담 소담 소라 솔비 송이 수리 슬아 시내
    아리 여울 오름 온새 우람 윤슬 은별 이든 이슬 자람 조은 초록 하람 한별 해솔
  '''),
  firstMale: pool(r'''
    민 서 준 도 예 시 하 지 현 우 건 선 유 정 승 태 재 성 동 진 상 영 수 주 강 규 인
    경 한 세 원 찬 은 광 종 창 기 병 대 호 남 형 근 명 이 철
  '''),
  // Syllables that spell a common noun in second position are deliberately left
  // out, because the pools are combined blindly: 인 would build 하인, 주 would
  // build 소주, 민 would build 예민.
  restMale: pool(r'''
    준 우 훈 호 윤 혁 원 재 민 현 수 진 석 철 규 빈 성 한 찬 열 영 헌 겸 익 록 담 결
    완 경 환 후 식 용 일 태 하
  '''),
  firstFemale: pool(r'''
    서 지 하 민 윤 채 수 예 다 은 소 유 시 아 나 가 정 미 주 세 혜 리 보 승 연 도 한
    라 이 경 선 영 진 현 희 명
  '''),
  restFemale: pool(r'''
    연 윤 우 은 서 유 아 원 율 린 빈 진 하 영 지 희 나 슬 미 경 정 담 별 혜 효 림 라
    현
  '''),
);
