import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/phone/data/types.dart';
import 'package:randino/src/types.dart';

/// Every country a number can be for, in the order of `wordLanguages`: the
/// country each word language is spoken in first.
final List<PhoneCountry> phoneCountries = List<PhoneCountry>.unmodifiable(PhoneCountry.values);

/// Every type a number can be.
final List<PhoneType> phoneTypes = List<PhoneType>.unmodifiable(PhoneType.values);

// US geographic area codes, all of them long-standing ones of the fifty states
// and DC — never one of Canada's or the Caribbean's, though NANP shares the
// format with both. A shortlist rather than all of them: a code assigned last
// year, or one overlaid on a city, is a code a reader has never seen.
final List<String> _usAreas = words('''
  201 202 203 205 206 207 208 209 210 212 213 214 215 216 217 219 224 229 231 234
  239 248 252 253 254 267 269 276 281 301 302 303 304 305 307 309 310 312 313 314
  315 316 317 321 323 330 336 347 352 360 361 386 401 402 404 405 406 407 408 409
  410 412 413 414 415 419 425 434 440 469 470 478 480 484 501 502 503 504 505 508
  509 510 512 513 515 516 517 518 520 530 540 541 559 561 562 570 571 585 586 601
  602 603 605 607 608 609 610 612 614 615 616 617 618 619 626 630 631 646 650 651
  661 678 701 702 703 704 706 707 708 713 714 716 717 718 719 720 724 727 732 734
  740 754 757 760 770 772 773 775 781 785 786 801 802 803 804 805 806 808 810 813
  814 815 816 817 818 828 830 831 832 843 845 847 850 856 858 860 863 864 901 903
  904 906 907 908 909 910 912 913 914 915 916 917 918 919 920 925 936 937 940 941
  949 951 954 956 971 972 973 978 979 980 989
''');

// Korea's two-digit area codes, which with Seoul's `2` are all seventeen it has.
// An exchange is three digits or four, and both are in use.
final List<String> _krAreas = words('31 32 33 41 42 43 44 51 52 53 54 55 61 62 63 64');

// A Japanese fixed number is ten digits with its `0`, so Tokyo and Osaka's
// one-digit codes take a four-digit exchange and the cities with two take three.
final List<String> _jpAreas = words('11 22 25 43 44 45 48 52 54 75 78 82 86 92 96 98');

// China's mobile blocks for subscribers' phones, leaving out the ones for data
// cards (`145`, `147`), satellite phones and resold lines.
final List<String> _cnMobile = words('''
  130 131 132 133 134 135 136 137 138 139 150 151 152 153 155 156 157 158 159 166
  173 175 176 177 178 180 181 182 183 184 185 186 187 188 189 191 193 195 196 197
  198 199
''');

// The four municipalities and the provincial capitals with a two-digit code,
// then the larger cities with three. Every one of them dials eight digits.
final List<String> _cnAreasShort = words('10 20 21 22 23 24 25 27 28 29');

final List<String> _cnAreas = words('''
  311 351 371 431 451 510 512 531 532 551 571 574 591 592 731 755 757 769 771 791
  851 871 898 931
''');

// Vietnam's mobile prefixes since the 2018 move to ten digits, for the five
// operators that hold them.
final List<String> _vnMobile = words('''
  32 33 34 35 36 37 38 39 56 58 59 70 76 77 78 79 81 82 83 84 85 86 88 89 90 91 92
  93 94 96 97 98 99
''');

// Ten provinces' three-digit codes, beside Hanoi's `24` and Ho Chi Minh City's `28`.
final List<String> _vnAreas = words('220 222 225 234 236 251 254 258 274 292');

// Spain's provincial prefixes. Madrid and Barcelona are `91` and `93` with any
// third digit; `90` is a shared-cost or freephone service, never a place.
final List<String> _esAreas = words('''
  920 921 922 923 924 925 926 927 928 941 942 943 944 945 946 947 948 949 950 951
  952 953 954 955 956 957 958 959 960 961 962 963 964 965 966 967 968 969 971 972
  973 974 975 976 977 978 979 980 981 982 983 984 985 986 987 988
''');

final List<String> _itMobile = words('''
  320 324 327 328 329 330 331 333 334 335 336 337 338 339 340 342 345 346 347 348
  349 351 360 366 368 380 388 389 391 392 393
''');

// Rome and Milan dial eight digits after their code, the other cities seven. The
// `0` stays when the number is dialled from abroad, so it is part of the code.
final List<String> _itAreas = words('010 011 041 045 049 051 055 070 080 081 091 095');

// Germany's mobile blocks. The `15x` blocks and `176` dial eight digits, the
// rest seven; `164`, `168` and `169` are pagers and left out.
final List<String> _deMobileLong = words('151 152 157 159 176');

final List<String> _deMobile = words('160 162 163 170 171 172 173 174 175 177 178 179');

// Berlin, Hamburg, Frankfurt and Munich dial eight digits after a two-digit code.
// A city with a three-digit code dials seven, or eight on a newer line.
final List<String> _deAreasShort = words('30 40 69 89');

final List<String> _deAreas = words('201 211 221 231 341 351 421 511 711 911');

// Russia's `9xx` blocks, which are its mobile numbers, less the two lent to
// Abkhazia and South Ossetia and the three for satellite and data services.
final List<String> _ruMobile = words('''
  900 901 902 903 904 905 906 907 908 909 910 911 912 913 914 915 916 917 918 919
  920 921 922 923 924 925 926 927 928 930 931 932 933 934 935 936 937 938 939 941
  942 943 944 945 946 947 948 949 950 951 952 953 955 956 957 958 959 960 961 962
  963 964 965 966 967 968 969 972 973 974 975 976 977 978 979 980 981 982 983 984
  985 986 987 988 989 990 991 992 993 994 995 996 997 998 999
''');

// Moscow's two codes, Saint Petersburg's, and the largest cities after them.
final List<String> _ruAreas = words('342 343 351 381 383 391 473 495 499 812 831 843 846 861 863');

final PhoneShape _usShape = PhoneShape(
  prefixes: _usAreas,
  groups: const <String>['Nxx', 'xxxx'],
  avoid: words('211 311 411 511 611 711 811 911 555'),
);

final PhoneShape _usFiction = PhoneShape(prefixes: _usAreas, groups: const <String>['555', '01xx']);

/// How each country numbers its phones and how it writes them, at the level of
/// its numbering plan: which prefixes are mobile, which are a city, how many
/// digits follow. Internal.
///
/// Nothing finer, because whether one number is in service is not something a
/// plan says — so a drawn number can be somebody's, and nothing here can tell
/// which. Ported from the JavaScript package's `phone/data/index.ts`.
final Map<PhoneCountry, PhoneCountryData> phoneData = <PhoneCountry, PhoneCountryData>{
  PhoneCountry.us: PhoneCountryData(
    callingCode: '1',
    trunk: '',
    national: '(#) #-#',
    international: '#-#-#',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[_usShape],
      PhoneType.landline: <PhoneShape>[_usShape],
    },
    // NANPA keeps `555-0100` to `555-0199` out of service in every area code,
    // for films and television, and writes them the same for both types.
    fiction: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[_usFiction],
      PhoneType.landline: <PhoneShape>[_usFiction],
    },
  ),
  PhoneCountry.kr: PhoneCountryData(
    callingCode: '82',
    trunk: '0',
    national: 'T#-#-#',
    international: '#-#-#',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: const <PhoneShape>[
        PhoneShape(prefixes: <String>['10'], groups: <String>['Nxxx', 'xxxx']),
      ],
      PhoneType.landline: <PhoneShape>[
        const PhoneShape(prefixes: <String>['2'], groups: <String>['Nxxx', 'xxxx']),
        const PhoneShape(prefixes: <String>['2'], groups: <String>['Nxx', 'xxxx']),
        PhoneShape(prefixes: _krAreas, groups: const <String>['Nxxx', 'xxxx']),
        PhoneShape(prefixes: _krAreas, groups: const <String>['Nxx', 'xxxx']),
      ],
    },
  ),
  PhoneCountry.jp: PhoneCountryData(
    callingCode: '81',
    trunk: '0',
    national: 'T#-#-#',
    international: '#-#-#',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: words('70 80 90'), groups: const <String>['nxxx', 'xxxx']),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: words('3 6'), groups: const <String>['Nxxx', 'xxxx']),
        PhoneShape(prefixes: _jpAreas, groups: const <String>['Nxx', 'xxxx']),
      ],
    },
  ),
  PhoneCountry.cn: PhoneCountryData(
    callingCode: '86',
    trunk: '0',
    national: 'T# # #',
    international: '# # #',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: _cnMobile, groups: const <String>['xxxx', 'xxxx'], trunk: ''),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: _cnAreasShort, groups: const <String>['Nxxx', 'xxxx']),
        PhoneShape(prefixes: _cnAreas, groups: const <String>['Nxxx', 'xxxx']),
      ],
    },
  ),
  PhoneCountry.vn: PhoneCountryData(
    callingCode: '84',
    trunk: '0',
    national: 'T# # #',
    international: '# # #',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: _vnMobile, groups: const <String>['xxx', 'xxxx']),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: words('24 28'), groups: const <String>['Nxxx', 'xxxx']),
        PhoneShape(prefixes: _vnAreas, groups: const <String>['Nxx', 'xxxx']),
      ],
    },
  ),
  PhoneCountry.es: PhoneCountryData(
    callingCode: '34',
    trunk: '',
    national: '# # # #',
    international: '# # # #',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        const PhoneShape(prefixes: <String>['6'], lead: 'xx', groups: <String>['xx', 'xx', 'xx']),
        PhoneShape(
          prefixes: words('71 72 73 74'),
          lead: 'x',
          groups: const <String>['xx', 'xx', 'xx'],
        ),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: words('91 93'), lead: 'x', groups: const <String>['xx', 'xx', 'xx']),
        PhoneShape(prefixes: _esAreas, groups: const <String>['xx', 'xx', 'xx']),
      ],
    },
  ),
  PhoneCountry.it: PhoneCountryData(
    callingCode: '39',
    trunk: '',
    national: '# # #',
    international: '# # #',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: _itMobile, groups: const <String>['xxx', 'xxxx']),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: words('02 06'), groups: const <String>['Nxxx', 'xxxx']),
        PhoneShape(prefixes: _itAreas, groups: const <String>['Nxx', 'xxxx']),
      ],
    },
  ),
  PhoneCountry.de: PhoneCountryData(
    callingCode: '49',
    trunk: '0',
    national: 'T# #',
    international: '# #',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: _deMobileLong, groups: const <String>['xxxxxxxx']),
        PhoneShape(prefixes: _deMobile, groups: const <String>['xxxxxxx']),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: _deAreasShort, groups: const <String>['Nxxxxxxx']),
        PhoneShape(prefixes: _deAreas, groups: const <String>['Nxxxxxx']),
        PhoneShape(prefixes: _deAreas, groups: const <String>['Nxxxxxxx']),
      ],
    },
    // The Bundesnetzagentur's drama numbers: a thousand lines in each of five
    // cities, and a hundred numbers each that Telekom and Telefónica keep out of
    // service. Its gazette notice 148/2021 lists them.
    fiction: const <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: <String>['171'], groups: <String>['39200xx']),
        PhoneShape(prefixes: <String>['176'], groups: <String>['040690xx']),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: <String>['30'], groups: <String>['23125xxx']),
        PhoneShape(prefixes: <String>['40'], groups: <String>['66969xxx']),
        PhoneShape(prefixes: <String>['69'], groups: <String>['90009xxx']),
        PhoneShape(prefixes: <String>['89'], groups: <String>['99998xxx']),
        PhoneShape(prefixes: <String>['221'], groups: <String>['4710xxx']),
      ],
    },
  ),
  PhoneCountry.ru: PhoneCountryData(
    callingCode: '7',
    trunk: '8',
    national: 'T (#) #-#-#',
    international: '# #-#-#',
    plans: <PhoneType, List<PhoneShape>>{
      PhoneType.mobile: <PhoneShape>[
        PhoneShape(prefixes: _ruMobile, groups: const <String>['xxx', 'xx', 'xx']),
      ],
      PhoneType.landline: <PhoneShape>[
        PhoneShape(prefixes: _ruAreas, groups: const <String>['Nxx', 'xx', 'xx']),
      ],
    },
  ),
};
