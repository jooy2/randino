"""Japanese name pools."""

from randino._internal.parse import tokens
from randino.name.data._types import NameLanguageData, NameLengthSpec

JA = NameLanguageData(
    order="family-first",
    joiner="",
    has_middle=False,
    roman="token",
    length_spec=NameLengthSpec(given=(2, 3), last=(1, 3), middle=(0, 0)),
    given_len_weights={2: 70, 3: 30},
    last=tokens("""
        佐藤:Sato 鈴木:Suzuki 高橋:Takahashi 田中:Tanaka 渡辺:Watanabe 伊藤:Ito
        山本:Yamamoto 中村:Nakamura 小林:Kobayashi 加藤:Kato 吉田:Yoshida 山田:Yamada
        佐々木:Sasaki 山口:Yamaguchi 松本:Matsumoto 井上:Inoue 木村:Kimura 林:Hayashi
        清水:Shimizu 斎藤:Saito 山崎:Yamazaki 森:Mori 池田:Ikeda 橋本:Hashimoto 阿部:Abe
        石川:Ishikawa 山下:Yamashita 中島:Nakajima 石井:Ishii 小川:Ogawa 前田:Maeda
        岡田:Okada 長谷川:Hasegawa 藤田:Fujita 後藤:Goto 近藤:Kondo 村上:Murakami
        遠藤:Endo 青木:Aoki 坂本:Sakamoto 福田:Fukuda 太田:Ota 西村:Nishimura
        中川:Nakagawa 三浦:Miura 藤井:Fujii 岡本:Okamoto 松田:Matsuda 中野:Nakano
        原田:Harada 小野:Ono 田村:Tamura 竹内:Takeuchi 金子:Kaneko 和田:Wada
        中山:Nakayama 石田:Ishida 上田:Ueda 森田:Morita 原:Hara 柴田:Shibata 酒井:Sakai
        工藤:Kudo 横山:Yokoyama 宮崎:Miyazaki 宮本:Miyamoto 内田:Uchida 高木:Takagi
        谷口:Taniguchi 安藤:Ando 丸山:Maruyama 今井:Imai 高田:Takada 藤本:Fujimoto
        河野:Kono 武田:Takeda 上野:Ueno 杉山:Sugiyama 千葉:Chiba 村田:Murata 増田:Masuda
        小山:Koyama 大塚:Otsuka 平野:Hirano 菅原:Sugawara 久保:Kubo 松井:Matsui
        木下:Kinoshita 野口:Noguchi 松尾:Matsuo 野村:Nomura 菊地:Kikuchi 佐野:Sano
        大西:Onishi 杉本:Sugimoto
    """),
    # Whole given names, romanized the way the reading is actually written, so the
    # `realism="real"` hands out names people have rather than assembled
    # kanji. The pool holds one-character names too (湊, 蓮, 樹), but
    # `given_len_weights` asks only for two and three, so `length_spec` says two and
    # three: what is declared is what comes out, not what the pool happens to hold.
    given_male=tokens("""
        陽翔:Haruto 悠真:Yuma 大翔:Hiroto 湊斗:Minato 朝陽:Asahi 蒼空:Sora 颯太:Sota
        大和:Yamato 陸斗:Rikuto 大輝:Daiki 拓海:Takumi 翔太:Shota 直樹:Naoki 和也:Kazuya
        隼人:Hayato 健太:Kenta 健太郎:Kentaro 慎太郎:Shintaro 龍太郎:Ryutaro
        悠太郎:Yutaro 龍之介:Ryunosuke 幸之助:Konosuke 健一郎:Kenichiro 宗一郎:Soichiro
        大輔:Daisuke 健一:Kenichi 浩二:Koji 雄大:Yudai 智也:Tomoya 卓也:Takuya
        直人:Naoto 竜也:Tatsuya 光宏:Mitsuhiro 康平:Kohei 翔平:Shohei 大地:Daichi
        悠斗:Yuto 大樹:Daiki 雄太:Yuta 亮太:Ryota 圭介:Keisuke 良太:Ryota 慎二:Shinji
        洋平:Yohei 将太:Shota 孝行:Takayuki 正樹:Masaki 秀明:Hideaki 克彦:Katsuhiko
        信之:Nobuyuki 義明:Yoshiaki 忠雄:Tadao 文雄:Fumio 春樹:Haruki 冬馬:Toma
        秋人:Akito 夏樹:Natsuki 湊:Minato 碧:Ao 律:Ritsu 樹:Itsuki 蓮:Ren 陽向:Hinata
        悠人:Yuto 瑛太:Eita 奏太:Kanata 惺:Sei 岳:Gaku 峻:Shun 遼:Ryo 篤志:Atsushi
        和樹:Kazuki 修平:Shuhei
    """),
    given_female=tokens("""
        陽菜:Hina 結愛:Yua 結衣:Yui 咲良:Sakura 莉子:Riko 美咲:Misaki 芽依:Mei
        心春:Koharu 陽葵:Himari 美月:Mizuki 彩花:Ayaka 優花:Yuka 香織:Kaori 直美:Naomi
        麻衣:Mai 詩織:Shiori 由紀子:Yukiko 美智子:Michiko 真理子:Mariko 恵理子:Eriko
        奈々子:Nanako 美奈子:Minako 佐和子:Sawako 加奈子:Kanako 理沙:Risa 愛美:Manami
        彩香:Ayaka 早紀:Saki 千夏:Chinatsu 友美:Tomomi 里奈:Rina 舞子:Maiko 亜矢:Aya
        綾乃:Ayano 静香:Shizuka 千秋:Chiaki 春香:Haruka 夏帆:Kaho 千尋:Chihiro
        七海:Nanami 美穂:Miho 沙織:Saori 智子:Tomoko 洋子:Yoko 京子:Kyoko 和子:Kazuko
        節子:Setsuko 幸子:Sachiko 光子:Mitsuko 敏子:Toshiko 富美:Fumi 初音:Hatsune
        小春:Koharu 花音:Kanon 詩音:Shion 心愛:Kokoa 結菜:Yuina 莉緒:Rio 澪:Mio 葵:Aoi
        凛:Rin 楓:Kaede 桜:Sakura 杏:An 環:Tamaki 咲希:Saki 悠花:Yuka 優奈:Yuna 実桜:Mio
        千代:Chiyo 文香:Fumika 瑞希:Mizuki 雅子:Masako
    """),
    first_male=tokens("""
        健:ken 翔:sho 悠:yu 直:nao 拓:taku 亮:ryo 隼:haya 大:dai 陽:yo 和:kazu 智:tomo
        貴:taka 晴:haru 湊:mina 碧:ao 律:ritsu 奏:kana 惺:sei 岳:gaku 峻:shun 遼:ryo
        篤:atsu 孝:taka 正:masa 秀:hide 克:katsu 信:nobu 義:yoshi 忠:tada 文:fumi
        春:haru 冬:fuyu
    """),
    rest_male=tokens("""
        太:ta 郎:ro 斗:to 介:suke 也:ya 樹:ki 人:to 平:hei 輝:ki 之:yuki 輔:suke 一:ichi
        二:ji 大:dai 宏:hiro 地:chi 行:yuki 明:aki 彦:hiko 雄:o 馬:ma 志:shi 己:mi 生:o
    """),
    first_female=tokens("""
        美:mi 結:yu 彩:aya 咲:saki 愛:ai 千:chi 真:ma 莉:ri 陽:hi 花:hana 楓:kae 理:ri
        早:sa 友:tomo 里:sa 舞:mai 亜:a 綾:aya 静:shizu 春:haru 夏:ka 七:nana 沙:sa
        智:tomo 洋:yo 京:kyo 和:kazu 節:setsu
    """),
    rest_female=tokens("""
        子:ko 奈:na 香:ka 音:ne 乃:no 衣:i 愛:a 咲:saki 美:mi 帆:ho 沙:sa 紀:ki 夏:natsu
        矢:ya 秋:aki 尋:hiro 海:mi 穂:ho 織:ori 代:yo 緒:o 花:ka 希:ki
    """),
)
