// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The Korean organization dataset.
final OrganizationLanguageData ko = OrganizationLanguageData(
  stems: words(r'''
    가람 나린 다온 마루 미리내 바름 새솔 소담 솔내 아라 여울 윤슬 이든 자람
    한결 해솔 해오름 푸른솔 늘해랑 별하 비나리 단미 도담 들꽃 물빛 산들 솔길
    은빛 초롱 하랑 한별 해든 혜윰 너울 다솔 맑은샘 봄내 새움 아름드리 은결
  '''),
  syn: OrganizationPoolSynthesis(
    pool: words(r'''
      가 다 마 바 사 아 자 하 온 솔 빛 결 람 윤 은 별 해 늘 새 슬 담 든
      루 린 봄 울 초 휘 연 채 율 겸 누 여 예 유 지
    '''),
    joiner: '',
    minSyllables: 2,
    maxSyllables: 2,
  ),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(r'테크 소프트 시스템 정보통신 네트웍스 랩스 데이터 전자'),
    OrganizationIndustry.manufacturing: words(r'정밀 기계 화학 금속 공업 소재 산업기계'),
    OrganizationIndustry.food: words(r'식품 푸드 제과 농산 수산 베이커리 유업'),
    OrganizationIndustry.retail: words(r'유통 상사 리테일 마트 무역 상회'),
    OrganizationIndustry.finance: words(r'캐피탈 투자 자산운용 인베스트먼트 파트너스 보험'),
    OrganizationIndustry.construction: words(r'건설 건축 엔지니어링 개발 종합건설 하우징'),
    OrganizationIndustry.logistics: words(r'물류 운송 해운 익스프레스 로지스틱스 택배'),
    OrganizationIndustry.media: words(r'미디어 엔터테인먼트 출판 스튜디오 커뮤니케이션즈 프로덕션'),
    OrganizationIndustry.health: words(r'제약 바이오 메디칼 헬스케어 약품 의료기'),
    OrganizationIndustry.energy: words(r'에너지 전력 솔라 가스 발전 그린에너지'),
  },
  generic: words(r'산업 그룹 홀딩스 인터내셔널 글로벌'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{stem}{industry}'],
    OrganizationType.nonprofit: <String>[
      '{stem}재단',
      '{stem}장학재단',
      '{stem}문화재단',
      '{stem}협회',
      '{stem}복지회',
      '{stem}봉사단',
      '{stem}연합회',
      '{stem}청년회',
      '{stem}보존회',
    ],
    OrganizationType.school: <String>[
      '{stem}유치원',
      '{stem}초등학교',
      '{stem}중학교',
      '{stem}고등학교',
      '{stem}여자중학교',
      '{stem}여자고등학교',
      '{stem}외국어고등학교',
      '{stem}예술고등학교',
      '{stem}대학',
      '{stem}대학교',
    ],
    OrganizationType.government: <String>[
      '{stem}시청',
      '{stem}구청',
      '{stem}군청',
      '{stem}경찰서',
      '{stem}소방서',
      '{stem}세무서',
      '{stem}동 행정복지센터',
      '{stem}지방법원',
      '{stem}교육지원청',
      '{stem}보건소',
    ],
    OrganizationType.public: <String>[
      '{stem}도시공사',
      '{stem}교통공사',
      '{stem}시설관리공단',
      '{stem}산업진흥원',
      '{stem}연구원',
      '{stem}시립도서관',
      '{stem}박물관',
      '{stem}미술관',
      '{stem}의료원',
      '{stem}종합사회복지관',
    ],
  },
  legalForms: <String>['주식회사 {name}', '{name} 주식회사', '(주){name}', '{name}(주)', '유한회사 {name}'],
);
