#!/usr/bin/env node
/**
 * Artículos del blog escritos en japonés para el viajero japonés (solo /ja/), nacidos de las consultas reales de
 * Search Console (país Japón, nov-2026): あずさ 東京→松本, サンダーバード 大阪→敦賀, くろしお 大阪→和歌山.
 * Cada uno enlaza las rutas que están en pos. 9-12 para empujarlas.
 *
 * Datos: tiempos = páginas de ruta (Klook, oct-2026). Hechos verificados:
 *  - あずさ/かいじ:普通車は2019年3月16日から全車指定席、座席未指定券あり (JR東日本, trafficnews.jp/post/81862)
 *  - サンダーバード: 2024年3月16日の北陸新幹線敦賀開業で大阪〜敦賀に。敦賀駅は在来線1階・乗換改札2階・新幹線3階 (watch.impress.co.jp 1555061)
 *  - くろしお: 2023年3月18日から大阪駅（うめきた地下ホーム）に停車 (trafficnews.jp/post/124955)
 * Sin precios ni frecuencias: cambian y no se pueden sostener.
 *
 * Shell (cabecera, estilos, pie) = ja/blog-tren-arraigo-pueblos.html, como generate-blog-blogueros.js.
 * Uso: node scripts/generate-blog-japon-ja.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SHELL = 'ja/blog-tren-arraigo-pueblos.html';
const DATE = '2026-11-08';
const PHOTO = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const R = (slug, txt) => `<a href="/rutas/${slug}/ja/">${txt}</a>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');

const POSTS = [
  {
    slug: 'blog-tokkyu-azusa-matsumoto.html', hero: 21077158, tag: '特急ガイド', read: 5,
    title: '特急あずさで松本へ：新宿・東京からの乗り方と所要時間',
    desc: '新宿から松本まで特急あずさで最短約2時間29分、東京駅からは約2時間55分、乗り換えなし。全車指定席のしくみ、座席未指定券、名古屋・長野からの「しなの」との違いをまとめました。',
    kw: '特急あずさ,松本,新宿から松本,東京から松本,座席未指定券,しなの',
    lead: '松本城と北アルプスの玄関口、松本。東京方面からなら、中央線の<strong>特急「あずさ」</strong>1本で乗り換えなしで着きます。このガイドでは、出発駅ごとの所要時間、全車指定席になってからの座席のしくみ、名古屋・長野から向かう場合の選び方を順に整理します。',
    sections: [
      ['出発駅で変わる所要時間', `<p>最速の列車で比べると、<strong>新宿駅からは約2時間29分</strong>、<strong>東京駅からは約2時間55分</strong>です（いずれも直通）。東京駅発の列車は本数が限られるため、都内から向かう場合は新宿駅発を基準に考えると計画が立てやすくなります。</p>
<ul>
  <li>${R('shinjuku-matsumoto', '新宿 → 松本')}：「あずさ」で最短約2時間29分</li>
  <li>${R('tokyo-matsumoto', '東京 → 松本')}：「あずさ」で最短約2時間55分</li>
</ul>`],
      ['全車指定席と「座席未指定券」', `<p>「あずさ」と「かいじ」の普通車は、2019年3月16日のダイヤ改正から<strong>全車指定席</strong>になり、自由席はありません。席を決めずに乗りたい場合は<strong>座席未指定券</strong>を使い、空いている席に座ります。座席の上のランプが赤く点灯している席が空席の目安です。ただし、確実に座れるわけではないので、週末や連休は指定席を早めに押さえるのが安心です。</p>`],
      ['名古屋・長野から向かう場合は「しなの」', `<p>中京・北信方面からは、中央本線（篠ノ井線）の<strong>特急「しなの」</strong>が便利です。どちらも乗り換えなしの直通です。</p>
<ul>
  <li>${R('nagoya-matsumoto', '名古屋 → 松本')}：「しなの」で最短約2時間3分</li>
  <li>${R('nagano-matsumoto', '長野 → 松本')}：「しなの」で最短約50分</li>
</ul>
<p>東京から長野まで北陸新幹線で行き、松本まで「しなの」に乗り継ぐ組み立ても考えられますが、乗り換えが1回増えます。乗り換えなしで行けるのが「あずさ」のいちばんの利点です。</p>`],
      ['出発前のチェックポイント', `<ul>
  <li>松本駅から松本城までは徒歩圏です。荷物が多い日は駅のコインロッカーを利用すると身軽に歩けます。</li>
  <li>上高地・白馬方面へ足をのばす場合は、松本での乗り継ぎ時間に余裕を持たせてください。</li>
  <li>時刻と空席は日によって変わります。出発日の最新の時刻は各ルートページから確認できます。</li>
</ul>`]
    ],
    faq: [
      ['新宿から松本まで特急あずさで何分かかりますか？', '最速の列車で約2時間29分です。乗り換えなしの直通です。'],
      ['東京駅から松本まで乗り換えなしで行けますか？', 'はい。東京駅発の特急あずさで約2時間55分、乗り換えなしで着きます。ただし東京駅発の本数は限られます。'],
      ['特急あずさに自由席はありますか？', 'ありません。2019年3月16日から普通車は全車指定席で、席を決めずに乗る場合は座席未指定券を使います。'],
      ['名古屋から松本へはどの列車が速いですか？', '特急しなので最短約2時間3分、乗り換えなしです。']
    ],
    links: [['shinjuku-matsumoto', '新宿 → 松本'], ['tokyo-matsumoto', '東京 → 松本'], ['nagoya-matsumoto', '名古屋 → 松本'], ['nagano-matsumoto', '長野 → 松本']]
  },
  {
    slug: 'blog-thunderbird-tsuruga-norikae.html', hero: 23345456, tag: '乗り換えガイド', read: 5,
    title: '大阪から北陸へ：サンダーバードと敦賀乗り換えガイド',
    desc: '北陸新幹線の敦賀開業（2024年3月16日）で、サンダーバードは大阪〜敦賀間に。大阪から敦賀まで最短約1時間16分、敦賀駅での新幹線への乗り換え方、金沢までの所要時間を解説します。',
    kw: 'サンダーバード,敦賀,乗り換え,北陸新幹線,大阪から金沢,つるぎ',
    lead: '2024年3月16日に北陸新幹線が敦賀まで延び、関西から北陸への行き方が変わりました。<strong>特急「サンダーバード」</strong>は大阪〜敦賀間の運転になり、金沢方面へは<strong>敦賀駅で新幹線に乗り換え</strong>ます。はじめての乗り換えでも迷わないように、流れと所要時間をまとめました。',
    sections: [
      ['大阪・京都から敦賀まで', `<p>サンダーバードは乗り換えなしで敦賀に着きます。</p>
<ul>
  <li>${R('osaka-tsuruga', '大阪 → 敦賀')}：「サンダーバード」で最短約1時間16分</li>
  <li>${R('kyoto-tsuruga', '京都 → 敦賀')}：「サンダーバード」で最短約52分</li>
</ul>`],
      ['敦賀駅での乗り換えのしかた', `<p>敦賀駅は、在来線の特急が着くホームの上に新幹線のホームがある構造です。</p>
<ul>
  <li><strong>1階</strong>：サンダーバードが到着</li>
  <li><strong>2階</strong>：乗換改札（ここで新幹線用のきっぷを通します）</li>
  <li><strong>3階</strong>：北陸新幹線のホーム</li>
</ul>
<p>同じホームでの乗り換え（対面乗り換え）ではないため、エスカレーターでの移動があります。大きな荷物がある場合は、乗り継ぎ時間に少し余裕のある組み合わせを選ぶと落ち着いて移動できます。</p>`],
      ['敦賀から金沢へは新幹線', `<p>敦賀からは北陸新幹線の「つるぎ」「かがやき」で金沢へ向かいます。</p>
<ul>
  <li>${R('kanazawa-tsuruga', '金沢 ⇄ 敦賀')}：新幹線「つるぎ」で最短約39分</li>
</ul>
<p>大阪から金沢までの所要時間は、サンダーバードと新幹線の乗車時間に、敦賀での乗り換え時間を足して考えます。</p>`],
      ['出発前のチェックポイント', `<ul>
  <li>サンダーバードと新幹線は、乗り継ぎを前提に一緒に予約しておくと乗り換えがスムーズです。</li>
  <li>敦賀は港町で、駅周辺にも見どころがあります。急がない旅なら途中下車も選択肢です。</li>
  <li>時刻と空席は日によって変わります。出発日の最新の時刻は各ルートページから確認できます。</li>
</ul>`]
    ],
    faq: [
      ['サンダーバードは今も金沢まで行きますか？', 'いいえ。2024年3月16日の北陸新幹線敦賀開業以降、サンダーバードは大阪〜敦賀間の運転です。金沢方面へは敦賀で新幹線に乗り換えます。'],
      ['大阪から敦賀までサンダーバードで何分ですか？', '最速の列車で約1時間16分、乗り換えなしです。京都からは約52分です。'],
      ['敦賀駅の乗り換えは同じホームですか？', 'いいえ。サンダーバードは1階に着き、2階の乗換改札を通って3階の新幹線ホームへ上がります。'],
      ['敦賀から金沢まで新幹線で何分ですか？', '新幹線「つるぎ」で最短約39分です。']
    ],
    links: [['osaka-tsuruga', '大阪 → 敦賀'], ['kyoto-tsuruga', '京都 → 敦賀'], ['kanazawa-tsuruga', '金沢 → 敦賀']]
  },
  {
    slug: 'blog-tokkyu-kuroshio-nanki.html', hero: 32882810, tag: '特急ガイド', read: 5,
    title: '特急くろしおで南紀へ：大阪から和歌山・紀伊田辺・白浜',
    desc: '特急くろしおは2023年3月18日から大阪駅（うめきた地下ホーム）に停車。大阪から和歌山まで最短約1時間2分、紀伊田辺約2時間16分、白浜約2時間28分。京都からの所要時間と乗り方をまとめました。',
    kw: '特急くろしお,大阪から和歌山,白浜,紀伊田辺,熊野古道,うめきた',
    lead: '和歌山城、熊野古道の入口・紀伊田辺、海と温泉の白浜。紀伊半島の西側をめぐる旅の足が<strong>特急「くろしお」</strong>です。2023年3月18日からは<strong>大阪駅</strong>にも停車するようになり、梅田から乗り換えなしで南紀へ向かえるようになりました。',
    sections: [
      ['大阪駅のどこから乗る？', `<p>くろしおが停車するのは、大阪駅の<strong>うめきた地下ホーム</strong>です。以前は大阪駅を通過していましたが、2023年3月18日のダイヤ改正で停車するようになりました。地上のホームとは場所が離れているので、乗り場までの移動時間を見込んでおくと安心です。</p>`],
      ['行き先ごとの所要時間', `<p>どの行き先も乗り換えなしの直通です（最速の列車の目安）。</p>
<ul>
  <li>${R('osaka-wakayama', '大阪 → 和歌山')}：最短約1時間2分（和歌山城の城下町）</li>
  <li>${R('osaka-kii-tanabe', '大阪 → 紀伊田辺')}：最短約2時間16分（熊野古道の玄関口）</li>
  <li>${R('osaka-shirahama', '大阪 → 白浜')}：最短約2時間28分（海辺の温泉地）</li>
</ul>`],
      ['京都から乗る場合', `<p>くろしおには京都駅から出る列車もあり、乗り換えなしで和歌山まで行けます。</p>
<ul>
  <li>${R('kyoto-wakayama', '京都 → 和歌山')}：最短約1時間36分</li>
</ul>`],
      ['出発前のチェックポイント', `<ul>
  <li>熊野古道を歩く場合は、紀伊田辺からのバスの時刻と合わせて列車を選んでください。</li>
  <li>白浜は週末や夏休みに混み合います。指定席は早めに押さえると安心です。</li>
  <li>時刻と空席は日によって変わります。出発日の最新の時刻は各ルートページから確認できます。</li>
</ul>`]
    ],
    faq: [
      ['特急くろしおは大阪駅に停まりますか？', 'はい。2023年3月18日から、大阪駅のうめきた地下ホームに停車します。'],
      ['大阪から和歌山までくろしおで何分ですか？', '最速の列車で約1時間2分、乗り換えなしです。'],
      ['大阪から白浜まで乗り換えなしで行けますか？', 'はい。特急くろしおで最短約2時間28分、乗り換えなしで着きます。'],
      ['熊野古道へはどの駅が近いですか？', '紀伊田辺駅が熊野古道（中辺路）の玄関口です。大阪からくろしおで最短約2時間16分です。']
    ],
    links: [['osaka-wakayama', '大阪 → 和歌山'], ['osaka-kii-tanabe', '大阪 → 紀伊田辺'], ['osaka-shirahama', '大阪 → 白浜'], ['kyoto-wakayama', '京都 → 和歌山']]
  }
];

const url = p => `https://glosx.app/ja/${p.slug}`;

function body(p) {
  const secs = p.sections.map(([h, html]) => `    <h2>${h}</h2>\n    ${html}`).join('\n\n');
  const faq = p.faq.map(([q, a]) => `    <h3>${q}</h3>\n    <p>${a}</p>`).join('\n');
  const chips = p.links.map(([s, t]) => R(s, t)).join(' · ');
  return `<body>
  <nav>
    ${require('./apply-logo').MARKUP('/')}
    <div class="nav-right">
      <a href="/ja/blog.html" class="nav-back">← ブログ</a>
    </div>
  </nav>

  <div class="blog-hero" style="background-image:url('${PHOTO(p.hero, 1400)}')">
    <div class="hero-content">
      <span class="badge">${p.tag}</span>
      <h1>${p.title}</h1>
      <p class="meta">WoW Train · 2026年11月 · 読了目安${p.read}分</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${p.lead}
    </p>

${secs}

    <h2>よくある質問</h2>
${faq}

    <p>この記事で紹介したルート：${chips}</p>

    <hr/>

    <div class="cta">
      <h3>時刻を確認して予約する</h3>
      <p>各ルートページで、出発日の最新の時刻と運賃を確認できます。</p>
      <a href="/rutas/${p.links[0][0]}/ja/" class="cta-btn">${p.links[0][1]} の時刻を見る</a>
    </div>
  </main>

  `;
}

function build(p) {
  const shell = fs.readFileSync(path.join(ROOT, SHELL), 'utf8');
  const lines = shell.split('\n');
  const li = n => lines.findIndex(x => x.includes(n));
  const headTop = lines.slice(0, 5).join('\n');
  const afterMeta = lines.slice(li('<link rel="icon"'), li('<body>')).join('\n')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const hero = PHOTO(p.hero, 1400);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://glosx.app/ja/' },
      { '@type': 'ListItem', position: 2, name: 'ブログ', item: 'https://glosx.app/ja/blog.html' },
      { '@type': 'ListItem', position: 3, name: p.title, item: url(p) }] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, image: hero,
      author: { '@type': 'Organization', name: 'WoW Train' }, publisher: { '@type': 'Organization', name: 'GLOSX', alternateName: 'WoW Train' },
      datePublished: DATE, dateModified: DATE, inLanguage: 'ja', mainEntityOfPage: url(p) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => (
      { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) }
  ].map(o => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const metas = `  <title>${esc(p.title)} — WoW Train</title>
  <meta name="description" content="${esc(p.desc)}" />
  <meta name="keywords" content="${esc(p.kw)}" />
  <link rel="canonical" href="${url(p)}" />
  <link rel="alternate" hreflang="ja" href="${url(p)}" />
  <link rel="alternate" hreflang="en" href="https://glosx.app/${p.slug}" />
  <link rel="alternate" hreflang="x-default" href="https://glosx.app/${p.slug}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(p.title)}" />
  <meta property="og:description" content="${esc(p.desc)}" />
  <meta property="og:url" content="${url(p)}" />
  <meta property="og:image" content="${hero}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.title)}" />
  <meta name="twitter:description" content="${esc(p.desc)}" />
  <meta name="twitter:image" content="${hero}" />
${ld}
`;
  const footer = shell.slice(shell.indexOf('<footer>'));
  const out = headTop + '\n' + metas + '\n  ' + afterMeta.trim() + '\n' + body(p) + footer;
  fs.writeFileSync(path.join(ROOT, 'ja', p.slug), out);
  console.log('Generado ja/' + p.slug);
}

// tarjetas al principio de ja/blog.html (justo después de <main ...>), sin duplicar
function cards() {
  const f = path.join(ROOT, 'ja/blog.html');
  let s = fs.readFileSync(f, 'utf8');
  const add = POSTS.filter(p => !s.includes(`href="/ja/${p.slug}"`)).map(p => `
    <a href="/ja/${p.slug}" class="post">
      <img class="post-img" src="${PHOTO(p.hero, 640).replace(/&/g, '&amp;')}" alt="${esc(p.title)}" loading="lazy" width="640" height="400" />
      <div class="post-body">
        <span class="post-tag">${p.tag}</span>
        <div class="post-title">${p.title}</div>
        <div class="post-desc">${p.desc}</div>
        <div class="post-meta">2026年11月 · ${p.read}分で読めます</div>
      </div>
    </a>
`).join('');
  if (!add) return;
  s = s.replace(/(<main class="blog-grid">\n)/, `$1${add}\n`);
  fs.writeFileSync(f, s);
  console.log('Tarjetas en ja/blog.html');
}

// sitemap: una entrada por artículo (solo ja)
function sitemap() {
  const f = path.join(ROOT, 'sitemap.xml');
  let s = fs.readFileSync(f, 'utf8');
  const add = POSTS.filter(p => !s.includes(`<loc>${url(p)}</loc>`))
    .map(p => `  <url>\n    <loc>${url(p)}</loc>\n    <lastmod>${DATE}</lastmod>\n  </url>\n`).join('');
  if (!add) return;
  s = s.replace('</urlset>', add + '</urlset>');
  fs.writeFileSync(f, s);
  console.log('Sitemap actualizado');
}

POSTS.forEach(build);
cards();
sitemap();
module.exports = { POSTS };
