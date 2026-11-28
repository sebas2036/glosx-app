"""Nombres de las ciudades de EE. UU. en los 8 idiomas (sin entrada = igual que en ingles) y ajustes por ciudad."""


def _c(ja, zh, **kw):
    return dict(ja=ja, zh=zh, **kw)


CITY = {
    'New York': _c('ニューヨーク', '纽约', es='Nueva York', pt='Nova Iorque'), 'Washington': _c('ワシントンD.C.', '华盛顿'),
    'Philadelphia': _c('フィラデルフィア', '费城', es='Filadelfia', fr='Philadelphie', it='Filadelfia', pt='Filadélfia'),
    'Boston': _c('ボストン', '波士顿'), 'Baltimore': _c('ボルチモア', '巴尔的摩'), 'Providence': _c('プロビデンス', '普罗维登斯'),
    'New Haven': _c('ニューヘイブン', '纽黑文'), 'New London': _c('ニューロンドン', '新伦敦'), 'Bridgeport': _c('ブリッジポート', '布里奇波特'),
    'Stamford': _c('スタンフォード', '斯坦福德'), 'Newark': _c('ニューアーク', '纽瓦克'), 'Trenton': _c('トレントン', '特伦顿'),
    'Wilmington': _c('ウィルミントン', '威尔明顿'), 'Alexandria': _c('アレクサンドリア', '亚历山德里亚'), 'Harrisburg': _c('ハリスバーグ', '哈里斯堡'),
    'Lancaster': _c('ランカスター', '兰开斯特'), 'Pittsburgh': _c('ピッツバーグ', '匹兹堡'), 'Albany': _c('オールバニ', '奥尔巴尼'),
    'Poughkeepsie': _c('ポキプシー', '波基普西'), 'Syracuse': _c('シラキュース', '锡拉丘兹'), 'Rochester': _c('ロチェスター', '罗切斯特'),
    'Buffalo': _c('バッファロー', '布法罗'), 'Niagara Falls': _c('ナイアガラフォールズ', '尼亚加拉瀑布城'), 'Hartford': _c('ハートフォード', '哈特福德'),
    'Springfield, Massachusetts': _c('スプリングフィールド（マサチューセッツ州）', '斯普林菲尔德（马萨诸塞州）', es='Springfield (Massachusetts)',
                                     fr='Springfield (Massachusetts)', de='Springfield (Massachusetts)', it='Springfield (Massachusetts)', pt='Springfield (Massachusetts)'),
    'Springfield, Illinois': _c('スプリングフィールド（イリノイ州）', '斯普林菲尔德（伊利诺伊州）', es='Springfield (Illinois)',
                                fr='Springfield (Illinois)', de='Springfield (Illinois)', it='Springfield (Illinois)', pt='Springfield (Illinois)'),
    'Portland, Maine': _c('ポートランド（メイン州）', '波特兰（缅因州）', es='Portland (Maine)', fr='Portland (Maine)', de='Portland (Maine)', it='Portland (Maine)', pt='Portland (Maine)'),
    'Burlington': _c('バーリントン', '伯灵顿'), 'Montreal': _c('モントリオール', '蒙特利尔', fr='Montréal', it='Montréal'),
    'Richmond': _c('リッチモンド', '里士满'), 'Norfolk': _c('ノーフォーク', '诺福克'), 'Williamsburg': _c('ウィリアムズバーグ', '威廉斯堡'),
    'Newport News': _c('ニューポートニューズ', '纽波特纽斯'), 'Charlottesville': _c('シャーロッツビル', '夏洛茨维尔'), 'Lynchburg': _c('リンチバーグ', '林奇堡'),
    'Roanoke': _c('ロアノーク', '罗阿诺克'), 'Fredericksburg': _c('フレデリックスバーグ', '弗雷德里克斯堡'), 'Raleigh': _c('ローリー', '罗利'),
    'Charlotte': _c('シャーロット', '夏洛特'), 'Greensboro': _c('グリーンズボロ', '格林斯伯勒'), 'Durham': _c('ダーラム', '达勒姆'),
    'Savannah': _c('サバンナ', '萨凡纳'), 'Charleston': _c('チャールストン', '查尔斯顿'), 'Jacksonville': _c('ジャクソンビル', '杰克逊维尔'),
    'Tampa': _c('タンパ', '坦帕'), 'Orlando': _c('オーランド', '奥兰多'), 'Miami': _c('マイアミ', '迈阿密'), 'Atlanta': _c('アトランタ', '亚特兰大'),
    'Birmingham': _c('バーミングハム', '伯明翰'), 'New Orleans': _c('ニューオーリンズ', '新奥尔良', es='Nueva Orleans', fr='La Nouvelle-Orléans', pt='Nova Orleães'),
    'Memphis': _c('メンフィス', '孟菲斯'), 'Chicago': _c('シカゴ', '芝加哥'), 'Milwaukee': _c('ミルウォーキー', '密尔沃基'),
    'St. Louis': _c('セントルイス', '圣路易斯', es='San Luis', fr='Saint-Louis'), 'Kansas City': _c('カンザスシティ', '堪萨斯城'),
    'Bloomington-Normal': _c('ブルーミントン＝ノーマル', '布卢明顿-诺默尔'), 'Champaign': _c('シャンペーン', '香槟'), 'Grand Rapids': _c('グランドラピッズ', '大急流城'),
    'Detroit': _c('デトロイト', '底特律'), 'Ann Arbor': _c('アナーバー', '安娜堡'), 'Kalamazoo': _c('カラマズー', '卡拉马祖'),
    'Indianapolis': _c('インディアナポリス', '印第安纳波利斯'), 'Cincinnati': _c('シンシナティ', '辛辛那提'),
    'St. Paul': _c('セントポール', '圣保罗', es='Saint Paul', fr='Saint Paul', it='Saint Paul', pt='Saint Paul'),
    'Dallas': _c('ダラス', '达拉斯'), 'Fort Worth': _c('フォートワース', '沃思堡'), 'San Antonio': _c('サンアントニオ', '圣安东尼奥'),
    'Austin': _c('オースティン', '奥斯汀'), 'Oklahoma City': _c('オクラホマシティ', '俄克拉何马城'), 'Denver': _c('デンバー', '丹佛'),
    'Salt Lake City': _c('ソルトレイクシティ', '盐湖城'), 'Albuquerque': _c('アルバカーキ', '阿尔伯克基'), 'Flagstaff': _c('フラッグスタッフ', '弗拉格斯塔夫'),
    'Los Angeles': _c('ロサンゼルス', '洛杉矶', es='Los Ángeles'), 'San Diego': _c('サンディエゴ', '圣迭戈'), 'Santa Ana': _c('サンタアナ', '圣安娜'),
    'Anaheim': _c('アナハイム', '阿纳海姆'), 'Fullerton': _c('フラートン', '富勒顿'), 'Oceanside': _c('オーシャンサイド', '欧申赛德'),
    'Santa Barbara': _c('サンタバーバラ', '圣巴巴拉', es='Santa Bárbara'), 'San Luis Obispo': _c('サンルイスオビスポ', '圣路易斯-奥比斯波'),
    'Ventura': _c('ベンチュラ', '文图拉'), 'Oxnard': _c('オックスナード', '奥克斯纳德'), 'San Jose': _c('サンノゼ', '圣何塞', es='San José'),
    'Sacramento': _c('サクラメント', '萨克拉门托'), 'Emeryville': _c('エメリービル', '埃默里维尔'), 'Oakland': _c('オークランド', '奥克兰'),
    'Martinez': _c('マルティネス', '马丁内斯'), 'Davis': _c('デービス', '戴维斯'), 'Fresno': _c('フレズノ', '弗雷斯诺'),
    'Bakersfield': _c('ベーカーズフィールド', '贝克斯菲尔德'), 'Stockton': _c('ストックトン', '斯托克顿'), 'Modesto': _c('モデスト', '莫德斯托'),
    'Merced': _c('マーセド', '默塞德'), 'Aventura': _c('アベンチュラ', '阿文图拉'), 'Fort Lauderdale': _c('フォートローダーデール', '劳德代尔堡'),
    'Boca Raton': _c('ボカラトン', '博卡拉顿'), 'West Palm Beach': _c('ウェストパームビーチ', '西棕榈滩'),
}
IMG = {'washington': 'washington-dc'}  # slug de ciudad -> nombre de archivo cuando difieren
OMIO = {'Portland, Maine': 'portland', 'Springfield, Illinois': 'springfield', 'Springfield, Massachusetts': 'springfield', 'Bloomington-Normal': 'bloomington'}  # termino para el backend
BORDER = {'montreal'}  # rutas que cruzan a Canada: aviso de pasaporte
