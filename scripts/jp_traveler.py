#!/usr/bin/env python3
"""
Guia del viajero para las paginas de ruta de Japon (28-nov-2026). Se INSERTA en las paginas existentes
(entre <!-- traveler-guide:start --> y <!-- traveler-guide:end -->, antes de <section class="faq">) y agrega sus
preguntas al FAQPage del JSON-LD con @id "#tg-N" (idempotente: se reemplaza en cada corrida).

Solo datos verificados (consultados el 28-nov-2026), sin enlazar a operadores:
- JR Central (global.jr-central.co.jp/en/info/oversized-baggage, nozomi, accommodation): equipaje 161-250 cm en el
  Tokaido/Sanyo/Kyushu Shinkansen con asiento reservado de equipaje grande; sin reserva, 1.000 yenes; hasta 160 cm sin reserva;
  Nozomi todo reservado en Golden Week, Obon y fin de ano; trenes sin fumar.
- JR East/Central/West (normas de equipaje de mano): 2 bultos, 250 cm de suma, 2 m de largo, 30 kg.
- JR East / JR West (modales): telefono en silencio y sin llamadas.
- japanrailpass.net: Nozomi y Mizuho requieren el billete especial para titulares del JR Pass.
- JNTO: Japan Visitor Hotline 050-3816-2787, 24 h, ingles, chino y coreano.
Publico por idioma: ja = residentes en Japon (sin JR Pass ni linea de turistas); el resto = visitantes.
Uso: python3 scripts/jp_traveler.py [slug ...] [--langs es,ja,zh]
"""
import html, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TSK = {'Nozomi', 'Hikari', 'Kodama', 'Sakura', 'Mizuho', 'Tsubame'}  # Tokaido, Sanyo y Kyushu Shinkansen
NOZ = {'Nozomi', 'Mizuho'}
PRIVATE = {'Romancecar': 'Odakyu', 'SPACIA X': 'Tobu', 'Revaty Kegon': 'Tobu', 'Revaty Aizu': 'Tobu', 'Revaty Kinu': 'Tobu'}
SUF = {'en': '', 'es': 'es/', 'fr': 'fr/', 'it': 'it/', 'de': 'de/', 'pt': 'pt/', 'ja': 'ja/', 'zh': 'zh/'}


def load_info():
    s = open(os.path.join(ROOT, 'assets/js/japan.js'), encoding='utf8').read()
    raw = re.search(r"'(aomori-hachinohe,.*?)'\.split\(';'\)", s).group(1)
    info = {}
    for row in raw.split(';'):
        k, m, sk, tr = row.split(',', 3)
        info[k] = {'m': int(m), 'sk': sk == '1', 'trains': [x for x in tr.split('/') if x]}
    return info


T = {
 'es': dict(
   h='Guía para tu viaje', lead='Lo que conviene saber antes de subir, con datos de las compañías ferroviarias japonesas.',
   p1t='Si es tu primera vez en un tren japonés', p2t='Si ya viajaste por Japón', p3t='Si todavía dudas',
   first=['Los trenes salen a la hora exacta: llega al andén unos minutos antes.', 'En el andén, marcas en el suelo indican dónde para cada coche: busca el número de tu coche.',
          'Pon el teléfono en silencio y evita las llamadas dentro del vagón; si necesitas hablar, sal a la plataforma entre coches.'],
   fast='El tren directo más rápido tarda {dur} ({trains}).',
   nozfree='Los Nozomi suelen llevar coches sin reserva (1 a 3), pero en Golden Week, Obon y fin de año todos los asientos son reservados.',
   jrp='Si tienes JR Pass: el pase solo no cubre los Nozomi ni los Mizuho; necesitas además el billete especial para titulares del pase, uno por viaje.',
   jrp_priv='Este tren es de {op}, una compañía privada: el JR Pass no lo cubre.',
   doubt=['Reservar asiento te asegura ir sentado en fechas de mucha demanda.', 'Los horarios y las tarifas de tu fecha se ven al reservar.'],
   cht='Antes de viajar: lo que tienes que revisar',
   bag='Equipaje en trenes de JR: hasta 2 bultos, cada uno con una suma de lados de hasta 250 cm, 2 m de largo y 30 kg.',
   big='Maletas grandes en este Shinkansen: hasta 160 cm (suma de los tres lados) van sin reserva. De 161 a 250 cm tienes que reservar un asiento con espacio para equipaje grande; si subes sin reserva, cobran 1.000 yenes. Más de 250 cm no se admite.',
   smoke='Está prohibido fumar en todo el tren: hay salas de fumadores en algunas estaciones.',
   sft='Ayuda y seguridad',
   hot='Japan Visitor Hotline (oficina de turismo de Japón): 050-3816-2787, las 24 horas, en inglés, chino y coreano. Para urgencias de vida o muerte llama a los servicios de emergencia locales.',
   cut='Costumbres y frases útiles',
   cus=['Haz fila en las marcas del andén y deja bajar antes de subir.', 'Hablar en voz baja es lo normal en el tren.'],
   phr='Frases que te pueden servir:',
   phrases=[('この席は空いていますか？', 'Kono seki wa aite imasu ka?', '¿Está libre este asiento?'), ('{b}行きのホームはどこですか？', '{b} yuki no hōmu wa doko desu ka?', '¿De qué andén sale el tren a {b}?'),
            ('すみません', 'Sumimasen', 'Disculpe (para pasar o llamar la atención)')],
   src='Fuentes: páginas oficiales de JR Central, JR East, JR West, el sitio del JR Pass y la oficina de turismo de Japón (JNTO), consultadas el 28 de noviembre de 2026. Las normas pueden cambiar.',
   q_big='¿Necesito reservar para llevar una maleta grande en el tren de {a} a {b}?', q_jrp='¿Puedo usar el JR Pass en el tren de {a} a {b}?', q_free='¿Hay asientos sin reserva en el Nozomi?',
   q_phone='¿Puedo hablar por teléfono en el tren en Japón?', q_help='¿A quién llamo si tengo un problema durante el viaje?',
 ),
 'ja': dict(
   h='乗る前に知っておきたいこと', lead='{a}→{b}の移動で気になるポイントを、鉄道会社の公式情報をもとにまとめました。',
   p1t='はじめてこの区間に乗る方', p2t='よく利用する方', p3t='迷っている方',
   first=['発車時刻ちょうどに出発します。ホームには数分前に着いておきましょう。', 'ホームの床に号車ごとの乗車位置が表示されています。',
          '車内では携帯電話をマナーモードにし、通話はデッキで。'],
   fast='最速の直通列車で{dur}（{trains}）。',
   nozfree='のぞみは通常1〜3号車が自由席ですが、ゴールデンウィーク・お盆・年末年始は全席指定席になります。',
   jrp='', jrp_priv='',
   doubt=['混雑する時期は指定席を取っておくと確実に座れます。', 'ご乗車日の時刻と料金は予約画面で確認できます。'],
   cht='出発前のチェックリスト',
   bag='JRの手回り品：1人2個まで、3辺の合計250cm以内・長さ2m以内・重さ30kg以内。',
   big='この新幹線でのスーツケース：3辺の合計160cmまでは予約不要。161〜250cmは「特大荷物スペースつき座席」の予約が必要で、予約なしで持ち込むと1,000円かかります。250cmを超える荷物は持ち込めません。',
   smoke='車内は全面禁煙です。喫煙は駅の喫煙ルームで。',
   sft='', hot='',
   cut='', cus=[], phr='', phrases=[],
   src='出典：JR東海・JR東日本・JR西日本の公式情報（2026年11月28日確認）。規則は変わることがあります。',
   q_big='{a}から{b}の新幹線、スーツケースは予約が必要？', q_jrp='', q_free='のぞみに自由席はある？',
   q_phone='新幹線で電話してもいい？', q_help='',
 ),
 'zh': dict(
   h='出行指南', lead='第一次在日本坐火车也不用担心：以下信息整理自日本铁路公司和日本国家旅游局的官方资料。',
   p1t='第一次在日本坐火车', p2t='来过日本的回头客', p3t='还在犹豫',
   first=['列车准点发车，请提前几分钟到站台。', '站台地面标有各节车厢的上车位置，按车厢号排队即可。', '车厢内请把手机调成静音，打电话请到车厢连接处。'],
   fast='最快的直达列车需{dur}（{trains}）。',
   nozfree='希望号平时1至3号车厢为自由席（不对号入座），但黄金周、盂兰盆节和年末年初期间全车对号入座。',
   jrp='持JR Pass的话：通票本身不能乘坐希望号（Nozomi）和瑞穗号（Mizuho），每次乘车还需购买通票持有人专用的特别车票。',
   jrp_priv='这趟车由{op}运营，是私营铁路，JR Pass不能使用。',
   doubt=['旺季提前订对号座更有保障。', '具体日期的时刻和票价，预订时即可查看。'],
   cht='出发前要确认的事项',
   bag='JR列车随身行李：每人最多2件，每件三边之和不超过250厘米、长度不超过2米、重量不超过30公斤。',
   big='在这条新干线上带大行李箱：三边之和160厘米以内无需预约；161至250厘米须预订“带特大行李放置处的座位”，未预约带上车需付1000日元；超过250厘米不能带上车。',
   smoke='车内全面禁烟，可在部分车站的吸烟室吸烟。',
   sft='求助与安全',
   hot='日本国家旅游局访日游客热线：050-3816-2787，24小时服务，提供中文、英语和韩语。遇到危及生命的紧急情况，请直接拨打当地急救电话。',
   cut='习惯与实用日语', cus=['在站台标记处排队，先下后上。', '车厢里小声说话是常态。'],
   phr='可能用得上的日语：',
   phrases=[('この席は空いていますか？', 'kono seki wa aite imasu ka', '这个座位有人吗？'), ('{b}行きのホームはどこですか？', '{b} yuki no hōmu wa doko desu ka', '去{b}的火车在哪个站台？'),
            ('すみません', 'sumimasen', '不好意思（借过、叫人时用）')],
   src='资料来源：JR东海、JR东日本、JR西日本、JR Pass官网和日本国家旅游局（JNTO）官方信息，查询日期2026年11月28日。规定可能变化。',
   q_big='从{a}到{b}坐新干线，大行李箱需要预约吗？', q_jrp='从{a}到{b}可以用JR Pass吗？', q_free='希望号有自由席吗？',
   q_phone='在日本坐火车可以打电话吗？', q_help='在日本旅行遇到问题可以打什么电话？',
 ),
}
from jp_traveler_i18n import T as _T5  # noqa: E402  en, fr, it, de, pt
T.update(_T5)
_lat = lambda m: f'{m // 60} h {m % 60:02d} min' if m >= 60 else f'{m} min'
DUR = {'en': _lat, 'fr': _lat, 'it': _lat, 'de': _lat, 'pt': _lat, 'es': lambda m: f'{m // 60} h {m % 60:02d} min' if m >= 60 else f'{m} min',
       'ja': lambda m: f'{m // 60}時間{m % 60:02d}分' if m >= 60 else f'{m}分', 'zh': lambda m: f'{m // 60}小时{m % 60:02d}分钟' if m >= 60 else f'{m}分钟'}
CSS = ('<style>.tg{margin:28px 0}.tg-lead{color:#55565f;margin:-4px 0 14px}.tg-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:0 0 8px}'
       '.tg-card{border:1px solid #e6e1da;border-radius:14px;padding:14px 16px;background:#fff}.tg-card h3{font-size:16px;margin:0 0 8px}'
       '.tg-card ul,.tg ul{margin:0;padding-left:18px}.tg-card li,.tg li{margin:0 0 6px;line-height:1.5}'
       '.tg ul.tg-phr{padding-left:0;display:grid;gap:8px;margin:8px 0 14px}.tg-phr li{list-style:none;margin:0;padding:10px 14px;background:#f6f3ef;border-radius:10px}'
       '.tg-phr b{display:block;font-weight:600}.tg-phr i{display:block;font-style:normal;color:#55565f;font-size:14px}.tg-phr span{color:#55565f;font-size:15px}.tg-src{font-size:13px;color:#55565f}</style>')


TRN_JA = dict(zip('Nozomi Hikari Kodama Sakura Mizuho Tsubame Hayabusa Hayate Komachi Yamabiko Tsubasa Nasuno Toki Kagayaki Hakutaka Asama Tsurugi Hida Azusa Kaiji Shinano Thunderbird Kuroshio Kounotori Kinosaki Hashidate Yakumo Sonic Yufu Inaho Shirayuki Tsugaru Shirasagi Tokiwa Hitachi Hokuto Suzuran Kamui Ozora Tokachi Soya Haruka Odoriko Romancecar'.split(),
    'のぞみ ひかり こだま さくら みずほ つばめ はやぶさ はやて こまち やまびこ つばさ なすの とき かがやき はくたか あさま つるぎ ひだ あずさ かいじ しなの サンダーバード くろしお こうのとり きのさき はしだて やくも ソニック ゆふ いなほ しらゆき つがる しらさぎ ときわ ひたち 北斗 すずらん カムイ おおぞら とかち 宗谷 はるか 踊り子 ロマンスカー'.split()))
TRN_JA.update({'SPACIA X': 'スペーシアX', 'Revaty Kegon': 'リバティけごん', 'Revaty Aizu': 'リバティ会津', 'Revaty Kinu': 'リバティきぬ', 'Narita Express': '成田エクスプレス',
               'Yufuin no Mori': 'ゆふいんの森', 'Huis Ten Bosch': 'ハウステンボス', 'Saphir Odoriko': 'サフィール踊り子', 'Airport Rapid': '快速エアポート',
               'Nichirin Seagaia': 'にちりんシーガイア', 'Noto Kagaribi': '能登かがり火'})
TRN_ZH = {'Nozomi': '希望号', 'Hikari': '光号', 'Kodama': '回声号', 'Sakura': '樱花号', 'Mizuho': '瑞穗号', 'Hayabusa': '隼号'}


def train_names(trains, l):
    if l == 'ja': return '・'.join(TRN_JA.get(x, x) for x in trains)
    if l == 'zh': return '、'.join(f'{x}（{TRN_ZH[x]}）' if x in TRN_ZH else x for x in trains)
    return ', '.join(trains)


def build(info, a, b, l):
    t = T[l]; e = html.escape
    trains = info['trains']; ts = set(trains)
    priv = next((PRIVATE[x] for x in trains if x in PRIVATE), None)
    tsk = bool(ts & TSK)
    p1 = list(t['first'])
    p2 = [t['fast'].format(dur=DUR[l](info['m']), trains=train_names(trains, l) or '-')]
    if ts & {'Nozomi'}: p2.append(t['nozfree'])
    if t['jrp']:
        if ts & NOZ: p2.append(t['jrp'])
        elif priv: p2.append(t['jrp_priv'].format(op=priv))
    p3 = list(t['doubt'])
    cards = ''.join(f'<div class="tg-card"><h3>{e(hd)}</h3><ul>{"".join(f"<li>{e(x)}</li>" for x in xs)}</ul></div>'
                    for hd, xs in ((t['p1t'], p1), (t['p2t'], p2), (t['p3t'], p3)))
    ck = []
    if not priv: ck.append(t['bag'])
    if tsk: ck += [t['big'], t['smoke']]
    out = f'{CSS}<section class="tg" id="guia-viajero"><h2>{e(t["h"])}</h2><p class="tg-lead">{e(t["lead"].format(a=a, b=b))}</p><div class="tg-cards">{cards}</div>'
    if ck: out += f'<h2>{e(t["cht"])}</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in ck)}</ul>'
    if t['hot']: out += f'<h2>{e(t["sft"])}</h2><ul><li>{e(t["hot"])}</li></ul>'
    if t['cus']:
        out += f'<h2>{e(t["cut"])}</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in t["cus"])}</ul>'
        out += f'<p><strong>{e(t["phr"])}</strong></p><ul class="tg-phr">' + ''.join(
            f'<li><b lang="ja">{e(j.format(b=b))}</b><i>{e(r.format(b=b))}</i><span>{e(x.format(b=b))}</span></li>' for j, r, x in t['phrases']) + '</ul>'
    out += f'<p class="tg-src">{e(t["src"])}</p></section>'
    faqs = []
    if tsk: faqs.append((t['q_big'].format(a=a, b=b), t['big']))
    if t['q_jrp'] and (ts & NOZ or priv): faqs.append((t['q_jrp'].format(a=a, b=b), t['jrp'] if ts & NOZ else t['jrp_priv'].format(op=priv)))
    if 'Nozomi' in ts: faqs.append((t['q_free'], t['nozfree']))
    faqs.append((t['q_phone'], t['first'][2]))
    if t['q_help']: faqs.append((t['q_help'], t['hot']))
    return out, faqs


def inject(path, block, faqs):
    h = open(path, encoding='utf8').read()
    h = re.sub(r'<!-- traveler-guide:start -->.*?<!-- traveler-guide:end -->\n\s*', '', h, flags=re.S)
    assert '<section class="faq">' in h, path
    h = h.replace('<section class="faq">', f'<!-- traveler-guide:start -->{block}<!-- traveler-guide:end -->\n    <section class="faq">', 1)
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
    if m:
        ld = json.loads(m.group(1))
        url = re.search(r'<link rel="canonical" href="([^"]+)"', h).group(1)
        for g in ld.get('@graph', [ld]):
            if g.get('@type') == 'FAQPage':
                g['mainEntity'] = [q for q in g['mainEntity'] if not str(q.get('@id', '')).startswith(url + '#tg-')]
                g['mainEntity'] += [{'@type': 'Question', '@id': f'{url}#tg-{i}', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for i, (q, a) in enumerate(faqs)]
        h = h[:m.start(1)] + json.dumps(ld, ensure_ascii=False) + h[m.end(1):]
    open(path, 'w', encoding='utf8').write(h)


if __name__ == '__main__':
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    langs = next((x.split('=', 1)[1].split(',') for x in sys.argv[1:] if x.startswith('--langs=')), list(T))
    INFO = load_info()
    for slug in args:
        info = INFO.get(slug) or next((v for k, v in INFO.items() if k.replace('-', '') == slug.replace('-', '')), None)
        if not info: print('sin datos:', slug); continue
        for l in langs:
            p = os.path.join(ROOT, 'rutas', slug, SUF[l], 'index.html')
            h = open(p, encoding='utf8').read()
            names = [html.unescape(x).strip() for x in re.findall(r'class="klook-cta-city">([^<]+)<', h)[:2]]
            if len(names) < 2: print('sin nombres:', p); continue
            a, b = names
            block, faqs = build(info, a, b, l)
            inject(p, block, faqs)
            print(slug, l, 'ok |', a, '→', b)
