#!/usr/bin/env node
/**
 * English versions of the 3 Japan train articles (scripts/generate-blog-japon-ja.js), adapted for the
 * foreign visitor, not translated word for word. Same slugs at the site root; hreflang en <-> ja.
 *
 * Facts (verified 08-nov-2026): times = our route pages (Klook data, Oct-2026);
 *  - Azusa/Kaiji: all ordinary cars reserved since 16 Mar 2019, "seat-unspecified" ticket (trafficnews.jp/post/81862)
 *  - Thunderbird: Osaka–Tsuruga since the Hokuriku Shinkansen reached Tsuruga on 16 Mar 2024; Tsuruga station:
 *    limited express on floor 1, transfer gates floor 2, Shinkansen floor 3 (watch.impress.co.jp 1555061)
 *  - Kuroshio: stops at Osaka Station (Umekita underground platforms) since 18 Mar 2023 (trafficnews.jp/post/124955)
 *  - Japan Rail Pass: Thunderbird + Hokuriku Shinkansen covered (stated by several pass sellers). Azusa/Kuroshio coverage
 *    NOT verified -> not claimed. No prices, no frequencies, no links to pass sellers or operators.
 * Usage: node scripts/generate-blog-japon-en.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SHELL = 'blog-tren-arraigo-pueblos.html';
const DATE = '2026-11-08';
const PHOTO = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const R = (slug, txt) => `<a href="/rutas/${slug}/">${txt}</a>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');

const POSTS = [
  {
    slug: 'blog-tokkyu-azusa-matsumoto.html', hero: 21077158, tag: 'Japan train guide', read: 5,
    title: 'Limited Express Azusa to Matsumoto: How to Ride It from Shinjuku and Tokyo',
    desc: 'Shinjuku to Matsumoto takes about 2h29 on the Azusa limited express, Tokyo Station about 2h55, both direct. How the all-reserved seating works, the seat-unspecified ticket, and the Shinano from Nagoya or Nagano.',
    kw: 'Azusa limited express, Shinjuku to Matsumoto, Tokyo to Matsumoto train, Matsumoto Castle, Shinano',
    lead: 'Matsumoto, with its black castle and the Northern Alps behind it, is one of the easiest side trips from Tokyo: the <strong>Azusa limited express</strong> gets you there with no change of train. This guide covers journey times by departure station, how seating works now that the train is fully reserved, and the best option if you are coming from Nagoya or Nagano instead.',
    sections: [
      ['Journey time depends on where you board', `<p>On the fastest trains, <strong>Shinjuku to Matsumoto takes about 2h29</strong> and <strong>Tokyo Station to Matsumoto about 2h55</strong>, both direct. Only a few Azusa trains start at Tokyo Station, so if you are staying in central Tokyo it is usually easier to plan around Shinjuku.</p>
<ul>
  <li>${R('shinjuku-matsumoto', 'Shinjuku → Matsumoto')}: about 2h29 on the Azusa</li>
  <li>${R('tokyo-matsumoto', 'Tokyo → Matsumoto')}: about 2h55 on the Azusa</li>
</ul>`],
      ['Every seat is reserved, and the "seat-unspecified" ticket', `<p>Since 16 March 2019 the ordinary cars of the Azusa (and its sister train, the Kaiji) are <strong>fully reserved</strong>: there are no non-reserved cars. If you would rather not pick a seat, you can buy a <strong>seat-unspecified ticket</strong> and sit in any free seat; a red lamp above the seat shows it has not been sold. You are not guaranteed a seat that way, so on weekends and Japanese holidays it is safer to reserve one in advance.</p>`],
      ['From Nagoya or Nagano, take the Shinano', `<p>If you are travelling from central Japan, the <strong>Shinano limited express</strong> runs direct to Matsumoto:</p>
<ul>
  <li>${R('nagoya-matsumoto', 'Nagoya → Matsumoto')}: about 2h03 on the Shinano</li>
  <li>${R('nagano-matsumoto', 'Nagano → Matsumoto')}: about 50 minutes on the Shinano</li>
</ul>
<p>From Tokyo you could also take the Hokuriku Shinkansen to Nagano and change to the Shinano, but that adds a change of train. The Azusa's big advantage is that it goes all the way without one.</p>`],
      ['Before you go', `<ul>
  <li>Matsumoto Castle is within walking distance of the station; coin lockers at the station let you explore without your bags.</li>
  <li>If you are heading on to Kamikochi or Hakuba, leave some margin for the connection in Matsumoto.</li>
  <li>Times and seat availability change day to day: check the latest times for your date on each route page.</li>
</ul>`]
    ],
    faq: [
      ['How long is the Azusa from Shinjuku to Matsumoto?', 'About 2 hours 29 minutes on the fastest trains, with no change.'],
      ['Can I go from Tokyo Station to Matsumoto without changing trains?', 'Yes. Azusa trains that start at Tokyo Station reach Matsumoto in about 2 hours 55 minutes, but there are only a few of them.'],
      ['Does the Azusa have non-reserved seats?', 'No. Since 16 March 2019 all ordinary cars are reserved; if you do not want to pick a seat you can use a seat-unspecified ticket and take any free seat.'],
      ['What is the fastest train from Nagoya to Matsumoto?', 'The Shinano limited express, about 2 hours 3 minutes with no change.']
    ],
    links: [['shinjuku-matsumoto', 'Shinjuku → Matsumoto'], ['tokyo-matsumoto', 'Tokyo → Matsumoto'], ['nagoya-matsumoto', 'Nagoya → Matsumoto'], ['nagano-matsumoto', 'Nagano → Matsumoto']]
  },
  {
    slug: 'blog-thunderbird-tsuruga-norikae.html', hero: 23345456, tag: 'Japan train guide', read: 5,
    title: 'Osaka to Kanazawa by Train: The Thunderbird and the Change at Tsuruga',
    desc: 'Since 16 March 2024 the Thunderbird runs only between Osaka and Tsuruga, and you change to the Hokuriku Shinkansen for Kanazawa. Osaka to Tsuruga takes about 1h16; here is how the transfer at Tsuruga works.',
    kw: 'Thunderbird train, Osaka to Kanazawa by train, Tsuruga transfer, Hokuriku Shinkansen, Tsurugi, Japan Rail Pass',
    lead: 'If you used to take one train from Osaka or Kyoto to Kanazawa, that changed on 16 March 2024. The Hokuriku Shinkansen now reaches Tsuruga, and the <strong>Thunderbird limited express</strong> runs only between Osaka and Tsuruga. To continue to Kanazawa you <strong>change to the Shinkansen at Tsuruga</strong>. Here is how it works, step by step.',
    sections: [
      ['Osaka or Kyoto to Tsuruga', `<p>The Thunderbird takes you to Tsuruga with no change:</p>
<ul>
  <li>${R('osaka-tsuruga', 'Osaka → Tsuruga')}: about 1h16 on the Thunderbird</li>
  <li>${R('kyoto-tsuruga', 'Kyoto → Tsuruga')}: about 52 minutes on the Thunderbird</li>
</ul>`],
      ['How the change at Tsuruga works', `<p>At Tsuruga the Shinkansen platforms sit above the platforms for the limited express:</p>
<ul>
  <li><strong>Floor 1</strong>: the Thunderbird arrives</li>
  <li><strong>Floor 2</strong>: transfer gates, where you put through your Shinkansen ticket</li>
  <li><strong>Floor 3</strong>: Hokuriku Shinkansen platforms</li>
</ul>
<p>It is not a same-platform change, so you will go up by escalator. With large luggage, choose a connection with a little extra time.</p>`],
      ['Tsuruga to Kanazawa on the Shinkansen', `<p>From Tsuruga, the Hokuriku Shinkansen (Tsurugi and Kagayaki trains) continues to Kanazawa:</p>
<ul>
  <li>${R('kanazawa-tsuruga', 'Kanazawa ⇄ Tsuruga')}: about 39 minutes on the Tsurugi</li>
</ul>
<p>Your total time from Osaka to Kanazawa is the Thunderbird plus the Shinkansen plus the connection at Tsuruga.</p>`],
      ['Japan Rail Pass and booking', `<ul>
  <li>The Thunderbird and the Hokuriku Shinkansen are covered by the nationwide Japan Rail Pass; you still need a seat reservation for each train.</li>
  <li>Book both trains together as one connection, so the transfer time at Tsuruga is already worked out.</li>
  <li>Times and seat availability change day to day: check the latest times for your date on each route page.</li>
</ul>`]
    ],
    faq: [
      ['Does the Thunderbird still go to Kanazawa?', 'No. Since the Hokuriku Shinkansen reached Tsuruga on 16 March 2024, the Thunderbird runs between Osaka and Tsuruga. For Kanazawa you change to the Shinkansen at Tsuruga.'],
      ['How long is the Thunderbird from Osaka to Tsuruga?', 'About 1 hour 16 minutes on the fastest trains, with no change. From Kyoto it takes about 52 minutes.'],
      ['Is the change at Tsuruga on the same platform?', 'No. The Thunderbird arrives on floor 1; you go through the transfer gates on floor 2 and up to the Shinkansen platforms on floor 3.'],
      ['Is the Thunderbird covered by the Japan Rail Pass?', 'Yes, the Thunderbird and the Hokuriku Shinkansen are covered by the nationwide Japan Rail Pass; seat reservations are made separately for each train.']
    ],
    links: [['osaka-tsuruga', 'Osaka → Tsuruga'], ['kyoto-tsuruga', 'Kyoto → Tsuruga'], ['kanazawa-tsuruga', 'Kanazawa → Tsuruga']]
  },
  {
    slug: 'blog-tokkyu-kuroshio-nanki.html', hero: 32882810, tag: 'Japan train guide', read: 5,
    title: 'Kuroshio Limited Express: Osaka to Wakayama, Kii-Tanabe and Shirahama',
    desc: 'The Kuroshio stops at Osaka Station (Umekita underground platforms) since 18 March 2023. Osaka to Wakayama about 1h02, Kii-Tanabe about 2h16, Shirahama about 2h28, all direct. Times from Kyoto and tips for the Kumano Kodo.',
    kw: 'Kuroshio limited express, Osaka to Shirahama train, Osaka to Wakayama, Kii-Tanabe, Kumano Kodo, Umekita',
    lead: 'Wakayama Castle, Kii-Tanabe at the start of the Kumano Kodo pilgrimage trails, and the beaches and hot springs of Shirahama: the <strong>Kuroshio limited express</strong> links them all to Osaka and Kyoto along the west coast of the Kii Peninsula. Since 18 March 2023 it also stops at <strong>Osaka Station</strong>, so you can board in Umeda with no change.',
    sections: [
      ['Where to board at Osaka Station', `<p>The Kuroshio uses the <strong>Umekita underground platforms</strong> at Osaka Station. It used to pass through without stopping; it has stopped there since the timetable change of 18 March 2023. These platforms are some distance from the main above-ground platforms, so allow a few extra minutes to reach them.</p>`],
      ['Journey times by destination', `<p>All of these are direct (fastest trains):</p>
<ul>
  <li>${R('osaka-wakayama', 'Osaka → Wakayama')}: about 1h02 (castle town)</li>
  <li>${R('osaka-kii-tanabe', 'Osaka → Kii-Tanabe')}: about 2h16 (gateway to the Kumano Kodo)</li>
  <li>${R('osaka-shirahama', 'Osaka → Shirahama')}: about 2h28 (seaside hot-spring resort)</li>
</ul>`],
      ['From Kyoto', `<p>Some Kuroshio trains start at Kyoto Station, so you can reach Wakayama without changing:</p>
<ul>
  <li>${R('kyoto-wakayama', 'Kyoto → Wakayama')}: about 1h36</li>
</ul>`],
      ['Before you go', `<ul>
  <li>Walking the Kumano Kodo? Pick your train so it connects with the bus from Kii-Tanabe.</li>
  <li>Shirahama gets busy at weekends and in the summer holidays; reserve seats early.</li>
  <li>Times and seat availability change day to day: check the latest times for your date on each route page.</li>
</ul>`]
    ],
    faq: [
      ['Does the Kuroshio stop at Osaka Station?', 'Yes. Since 18 March 2023 it stops at the Umekita underground platforms of Osaka Station.'],
      ['How long is the Kuroshio from Osaka to Wakayama?', 'About 1 hour 2 minutes on the fastest trains, with no change.'],
      ['Can I go from Osaka to Shirahama without changing trains?', 'Yes. The Kuroshio reaches Shirahama in about 2 hours 28 minutes, direct.'],
      ['Which station is closest to the Kumano Kodo?', 'Kii-Tanabe, the gateway to the Nakahechi route, about 2 hours 16 minutes from Osaka on the Kuroshio.']
    ],
    links: [['osaka-wakayama', 'Osaka → Wakayama'], ['osaka-kii-tanabe', 'Osaka → Kii-Tanabe'], ['osaka-shirahama', 'Osaka → Shirahama'], ['kyoto-wakayama', 'Kyoto → Wakayama']]
  }
];

const url = p => `https://glosx.app/${p.slug}`;
const urlJa = p => `https://glosx.app/ja/${p.slug}`;

function body(p) {
  const secs = p.sections.map(([h, html]) => `    <h2>${h}</h2>\n    ${html}`).join('\n\n');
  const faq = p.faq.map(([q, a]) => `    <h3>${q}</h3>\n    <p>${a}</p>`).join('\n');
  const chips = p.links.map(([s, t]) => R(s, t)).join(' · ');
  return `<body>
  <nav>
    ${require('./apply-logo').MARKUP('/')}
    <div class="nav-right">
      <a href="/blog.html" class="nav-back">← Blog</a>
    </div>
  </nav>

  <div class="blog-hero" style="background-image:url('${PHOTO(p.hero, 1400)}')">
    <div class="hero-content">
      <span class="badge">${p.tag}</span>
      <h1>${p.title}</h1>
      <p class="meta">By WoW Train · November 2026 · ${p.read} min read</p>
    </div>
  </div>

  <main>
    <p class="lead">
      ${p.lead}
    </p>

${secs}

    <h2>Frequently asked questions</h2>
${faq}

    <p>Routes in this guide: ${chips}</p>

    <hr/>

    <div class="cta">
      <h3>Check times and book</h3>
      <p>Each route page shows the latest times and fares for your travel date.</p>
      <a href="/rutas/${p.links[0][0]}/" class="cta-btn">See ${p.links[0][1]} times</a>
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://glosx.app/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://glosx.app/blog.html' },
      { '@type': 'ListItem', position: 3, name: p.title, item: url(p) }] },
    { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, image: hero,
      author: { '@type': 'Organization', name: 'WoW Train' }, publisher: { '@type': 'Organization', name: 'GLOSX', alternateName: 'WoW Train' },
      datePublished: DATE, dateModified: DATE, inLanguage: 'en', mainEntityOfPage: url(p) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => (
      { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) }
  ].map(o => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const metas = `  <title>${esc(p.title)} — WoW Train</title>
  <meta name="description" content="${esc(p.desc)}" />
  <meta name="keywords" content="${esc(p.kw)}" />
  <link rel="canonical" href="${url(p)}" />
  <link rel="alternate" hreflang="en" href="${url(p)}" />
  <link rel="alternate" hreflang="ja" href="${urlJa(p)}" />
  <link rel="alternate" hreflang="x-default" href="${url(p)}" />
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
  fs.writeFileSync(path.join(ROOT, p.slug), out);
  console.log('Generated ' + p.slug);
}

// cards at the top of blog.html (right after <main ...>), no duplicates
function cards() {
  const f = path.join(ROOT, 'blog.html');
  let s = fs.readFileSync(f, 'utf8');
  const add = POSTS.filter(p => !s.includes(`href="/${p.slug}"`)).map(p => `
    <a href="/${p.slug}" class="post">
      <img class="post-img" src="${PHOTO(p.hero, 640).replace(/&/g, '&amp;')}" alt="${esc(p.title)}" loading="lazy" width="640" height="400" />
      <div class="post-body">
        <span class="post-tag">${p.tag}</span>
        <div class="post-title">${p.title}</div>
        <div class="post-desc">${p.desc}</div>
        <div class="post-meta">November 2026 · ${p.read} min read</div>
      </div>
    </a>
`).join('');
  if (!add) return;
  s = s.replace(/(<main class="blog-grid">\n)/, `$1${add}\n`);
  fs.writeFileSync(f, s);
  console.log('Cards added to blog.html');
}

function sitemap() {
  const f = path.join(ROOT, 'sitemap.xml');
  let s = fs.readFileSync(f, 'utf8');
  const add = POSTS.filter(p => !s.includes(`<loc>${url(p)}</loc>`))
    .map(p => `  <url>\n    <loc>${url(p)}</loc>\n    <lastmod>${DATE}</lastmod>\n  </url>\n`).join('');
  if (!add) return;
  s = s.replace('</urlset>', add + '</urlset>');
  fs.writeFileSync(f, s);
  console.log('Sitemap updated');
}

POSTS.forEach(build);
cards();
sitemap();
module.exports = { POSTS };
