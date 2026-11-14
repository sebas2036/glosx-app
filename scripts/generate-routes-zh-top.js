#!/usr/bin/env node
/**
 * 30 rutas top de Japón y Europa en chino simplificado (/rutas/<slug>/zh/), fase 6 (14-nov-2026).
 * Datos: Japón = duración y trenes de japan.js (Klook, oct-2026); Europa = duración, operador y precio
 * orientativo de generate-routes.js (los mismos que muestra la página en inglés). Foto y enlace de reserva
 * se toman de la página inglesa. Agrega hreflang zh-Hans + opción 中文 a las otras versiones y al sitemap.
 * Idempotente. Uso: node scripts/generate-routes-zh-top.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// [slug, origen, destino, estaciones, frase propia, consejo propio]
const JP = [
  ['tokyo-kyoto', '东京', '京都', '东京站 → 京都站', '东海道新干线是日本最经典的线路，“希望号”每隔几分钟就有一班。', '往京都方向坐右侧靠窗的 E 座，天气好时能看到富士山。'],
  ['tokyo-osaka', '东京', '大阪', '东京站 → 新大阪站', '东海道新干线的终点是新大阪站，再坐一站 JR 京都线就到大阪站。', '三边之和 160–250 厘米的大件行李，需要预订带大件行李空间的座位。'],
  ['osaka-kyoto', '大阪', '京都', '新大阪站 → 京都站', '两座城市很近，很多游客住在一边，另一边当天往返。', '从大阪站坐 JR 新快速约 30 分钟，更便宜，也不用订座。'],
  ['kyoto-hiroshima', '京都', '广岛', '京都站 → 广岛站', '新干线从东海道线直通山阳线，不用在新大阪换车。', '去宫岛：从广岛坐 JR 山阳本线到宫岛口（约 30 分钟），再坐渡轮（约 10 分钟）。'],
  ['narita-tokyo', '成田机场', '东京', '成田机场站 → 东京站', '成田特快（N’EX）还直达品川、新宿和横滨，带着行李也不用换车。', '成田特快全车对号入座，车厢两端有放行李的区域。'],
  ['tokyo-nagoya', '东京', '名古屋', '东京站 → 名古屋站', '名古屋是去高山、白川乡和伊势的中转站。', 'JR Pass 不包含“希望号”：需另付附加费，或改乘“光号”。'],
  ['osaka-hiroshima', '大阪', '广岛', '新大阪站 → 广岛站', '山阳新干线把大阪和广岛连在一起，广岛和宫岛可以一日往返。', '和平纪念公园可以从广岛站坐路面电车前往。'],
  ['shinjuku-hakone', '新宿', '箱根', '新宿站 → 箱根汤本站', '小田急浪漫特快从新宿直达箱根汤本，是去温泉和看富士山的门户。', '箱根周游券包含小田急线和箱根当地交通，但浪漫特快需另付特急费。'],
  ['tokyo-kanazawa', '东京', '金泽', '东京站 → 金泽站', '北陆新干线大约两个半小时到金泽，兼六园和东茶屋街都在这里。', '“光辉号”全车对号入座，旺季请提前订座。'],
  ['osaka-fukuoka', '大阪', '福冈', '新大阪站 → 博多站', '山阳新干线从新大阪直达福冈的博多站，不用换车。', '福冈的新干线车站叫博多站，离市中心和机场都很近。'],
  ['hiroshima-fukuoka', '广岛', '福冈', '广岛站 → 博多站', '大约一小时就能从广岛到九州的福冈。', '继续去九州其他城市，可以在博多换乘九州新干线。'],
  ['nagoya-takayama', '名古屋', '高山', '名古屋站 → 高山站', '特急“飞驒号”沿着飞驒川的溪谷行驶，是日本风景最美的线路之一。', '想看溪谷风景，尽量选靠窗的座位。'],
  ['kansai-airport-kyoto', '关西机场', '京都', '关西机场站 → 京都站', '关空特急“遥号”（HARUKA）从关西机场直达京都，不用换车。', '车上有放行李的空间，旺季建议预订对号座。'],
  ['kansai-airport-osaka', '关西机场', '大阪', '关西机场站 → 新大阪站（途经天王寺）', '“遥号”途中停靠天王寺，再开往新大阪。', '去难波一带也可以坐南海电铁的列车（本页只介绍 JR）。'],
  ['tokyo-sendai', '东京', '仙台', '东京站 → 仙台站', '东北新干线约一个半小时到仙台，是去松岛和日本东北地区的起点。', '“隼号”全车对号入座，请提前订座。']
];
const JP_KEYS = { 'narita-tokyo': ['naritaairport', 'tokyo'], 'kansai-airport-kyoto': ['kansaiairport', 'kyoto'], 'kansai-airport-osaka': ['kansaiairport', 'osaka'] };
const EU = [
  ['london-paris', '伦敦', '巴黎', '伦敦圣潘克拉斯国际站 → 巴黎北站', '欧洲之星穿过英吉利海峡隧道，从伦敦市中心直达巴黎市中心。', '英国和法国的出入境检查都在伦敦圣潘克拉斯站出发前办理，请提前到站。'],
  ['paris-amsterdam', '巴黎', '阿姆斯特丹', '巴黎北站 → 阿姆斯特丹中央车站', '原来的大力士（Thalys）列车已并入欧洲之星，经布鲁塞尔直达阿姆斯特丹。', '这条线在申根区内，一般没有护照检查，但请随身携带证件。'],
  ['brussels-paris', '布鲁塞尔', '巴黎', '布鲁塞尔南站 → 巴黎北站', '两国首都之间大约一个半小时，一日往返也很轻松。', '布鲁塞尔的国际列车从布鲁塞尔南站（Bruxelles-Midi）出发。'],
  ['london-brussels', '伦敦', '布鲁塞尔', '伦敦圣潘克拉斯国际站 → 布鲁塞尔南站', '欧洲之星约两小时到布鲁塞尔，可以在这里换车去比利时其他城市或荷兰。', '出入境检查在伦敦圣潘克拉斯站出发前办理，请提前到站。'],
  ['paris-milan', '巴黎', '米兰', '巴黎里昂站 → 米兰（加里波第门站或中央车站，视车次而定）', '列车翻越阿尔卑斯山，经都灵进入意大利。', '法意边境山区段偶尔因施工改为换乘，订票前请确认所选车次是否直达。'],
  ['paris-zurich', '巴黎', '苏黎世', '巴黎里昂站 → 苏黎世中央车站', 'TGV Lyria 经巴塞尔直达苏黎世。', '瑞士不用欧元，可以刷银行卡，或换一些瑞士法郎。'],
  ['zurich-lucerne', '苏黎世', '琉森', '苏黎世中央车站 → 琉森站', '瑞士最受欢迎的短途线路之一，琉森站就在湖边，走几步就到老城。', '持有瑞士通票（Swiss Travel Pass）可以直接乘坐，不用另外买票。'],
  ['rome-venice', '罗马', '威尼斯', '罗马特米尼站 → 威尼斯圣卢西亚站', '高铁从罗马一路北上，经佛罗伦萨和博洛尼亚，终点就在威尼斯大运河边。', '一定要坐到威尼斯圣卢西亚站（Venezia S. Lucia），不要在梅斯特雷站（Mestre）下车。'],
  ['milan-florence', '米兰', '佛罗伦萨', '米兰中央车站 → 佛罗伦萨新圣母玛利亚站', '意大利最繁忙的高铁线路之一，从米兰到文艺复兴之城佛罗伦萨不到两小时。', '佛罗伦萨主站是新圣母玛利亚站（Firenze S.M.N.），步行就能到大教堂。'],
  ['milan-rome', '米兰', '罗马', '米兰中央车站 → 罗马特米尼站', '意大利两大城市之间每天班次很多，大约三小时直达。', '意大利国铁（Frecciarossa）和 Italo 两家都跑这条线，可以比较时间和价格。'],
  ['rome-naples', '罗马', '那不勒斯', '罗马特米尼站 → 那不勒斯中央车站', '从罗马到那不勒斯大约一小时十分，也是去庞贝和阿马尔菲海岸的起点。', '去庞贝可以在那不勒斯换乘环维苏威铁路（Circumvesuviana）。'],
  ['venice-milan', '威尼斯', '米兰', '威尼斯圣卢西亚站 → 米兰中央车站', '列车途经维罗纳和布雷西亚，可以顺路去加尔达湖。', '从威尼斯出发请在圣卢西亚站上车，梅斯特雷站在大陆一侧。'],
  ['munich-berlin', '慕尼黑', '柏林', '慕尼黑中央车站 → 柏林中央车站', 'ICE 高速列车经纽伦堡和莱比锡，大约四小时连接德国南北两大城市。', '德铁的特价票（Sparpreis）越早买越便宜，但只能乘坐指定车次。'],
  ['frankfurt-paris', '法兰克福', '巴黎', '法兰克福中央车站 → 巴黎东站', 'TGV 和 ICE 大约四小时直达巴黎东站。', '巴黎东站和巴黎北站相距只有几分钟步行路程。'],
  ['rome-florence', '罗马', '佛罗伦萨', '罗马特米尼站 → 佛罗伦萨新圣母玛利亚站', '高铁大约一个半小时，从罗马去佛罗伦萨一日游也来得及。', '部分车次停靠佛罗伦萨里弗雷迪站（Rifredi），请确认到达站。']
];

// ── datos ──
const jjs = fs.readFileSync(path.join(ROOT, 'assets/js/japan.js'), 'utf8');
const INFO = {};
jjs.match(/'(aomori-hachinohe[^']*)'\.split/)[1].split(';').forEach(row => { const p = row.split(','); const k = p[0].split('-'); const v = { m: +p[1], s: p[2] === '1', t: p[3] ? p[3].split('/') : [] }; INFO[k[0] + '-' + k[1]] = v; INFO[k[1] + '-' + k[0]] = v; });
const gsrc = fs.readFileSync(path.join(__dirname, 'generate-routes.js'), 'utf8');
function euData(slug) {
  const m = gsrc.match(new RegExp(`slug: '${slug}', from: '([^']+)', to: '([^']+)', country: '([^']+)', duration: '([^']+)', operator: '([^']+)', price: '([^']+)'`));
  if (!m) throw new Error('Sin datos de ' + slug);
  const d = m[4].match(/(\d+)h\s*(\d+)m/);
  return { m: +d[1] * 60 + +d[2], op: m[5], price: m[6].replace('-', '–') };
}
const zt = m => { const h = Math.floor(m / 60), r = m % 60; return h ? `${h}小时${r ? r + '分' : ''}` : `${m}分钟`; };
const JP_TRAIN = { Nozomi: '希望号', Hikari: '光号', Kodama: '回声号', Sakura: '樱花号', Mizuho: '瑞穗号', 'Narita Express': '成田特快', Romancecar: '浪漫特快', Kagayaki: '光辉号', Hakutaka: '白鹰号', Hida: '飞驒号', Haruka: '遥号', Yamabiko: '山彦号', Hayabusa: '隼号' };

function enPage(slug) { return fs.readFileSync(path.join(ROOT, 'rutas', slug, 'index.html'), 'utf8'); }
function build([slug, A, B, st, hl, tip], region) {
  const en = enPage(slug);
  const hero = (en.match(/url\('(https:\/\/images\.pexels\.com\/[^']+)'\)/) || [])[1] || 'https://glosx.app/hero-bg.jpg';
  let book, facts, choose, seoT, seoD, lead, partner, faq2;
  if (region === 'jp') {
    const [a, b] = JP_KEYS[slug] || slug.split('-');
    const d = INFO[a + '-' + b];
    if (!d) throw new Error('Sin INFO ' + slug);
    const trains = d.t.map(x => JP_TRAIN[x] || x);
    const kind = d.s ? '新干线' : '特急';
    book = `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${a}&to=${b}`;
    partner = 'Klook';
    seoT = `${A}到${B}火车：${kind}最快${zt(d.m)}`;
    seoD = `从${A}到${B}乘${kind}最快约${zt(d.m)}。可选车次（${trains.join('、')}）、车站、实用建议和 Klook 订票方法。`;
    lead = `从${A}到${B}的直达${kind}最快约${zt(d.m)}。${hl}`;
    facts = [`最快行程：约${zt(d.m)}`, `列车：${trains.join('、')}（${kind}）`, `车站：${st}`, '直达，不用换车。'];
    choose = `这条线路可以乘坐${trains.join('或')}。${trains.length > 1 ? `${trains[0]}最快，${trains[1]}停站更多、用时稍长。` : ''}请按出发时间和所需时长选择，并在 Klook 查看你所选日期的座位。`;
    faq2 = [`${A}到${B}要换车吗？`, `不用。${trains[0]}从${st.split(' → ')[0]}直达${st.split(' → ')[1]}。`];
  } else {
    const d = euData(slug);
    const [a, b] = slug.split('-');
    book = (en.match(/href="(https:\/\/voxa-production-dc15\.up\.railway\.app\/affiliate\/europe-train\?[^"]+)"/) || [])[1] || `https://voxa-production-dc15.up.railway.app/affiliate/europe-train?from=${a}&to=${b}`;
    partner = 'Omio';
    seoT = `${A}到${B}火车：约${zt(d.m)}（${d.op}）`;
    seoD = `从${A}到${B}乘火车约${zt(d.m)}，主要由 ${d.op} 运营。车站、参考票价、实用建议和 Omio 订票方法。`;
    lead = `从${A}到${B}乘火车约需${zt(d.m)}，主要由 ${d.op} 运营。${hl}`;
    facts = [`行程时间：约${zt(d.m)}`, `主要运营商：${d.op}`, `车站：${st}`, `参考票价：${d.price}（以所选日期的实际价格为准）`];
    choose = `大多数旅客会选择 ${d.op} 的直达车次。票价随日期和余票变化，越早订通常越便宜。在 Omio 可以比较当天的所有车次和票价。`;
    faq2 = [`${A}到${B}的火车票多少钱？`, `参考价格为 ${d.price}，实际票价取决于日期、车次和订票时间。`];
  }
  const faqs = [[`从${A}到${B}坐火车要多久？`, region === 'jp' ? `最快约${facts[0].replace('最快行程：约', '')}。不同车次用时不同，请以所订车次为准。` : `大约${facts[0].replace('行程时间：约', '')}。不同车次用时不同，请以所订车次为准。`], faq2, [`在哪里订${A}到${B}的火车票？`, `可以通过本页的链接在 ${partner} 查看时刻并订票。WoW Train 不收取额外费用。`]];
  return { slug, A, B, hero, book, partner, seoT, seoD, lead, facts, choose, tips: [tip], faqs, region };
}
const ROUTES = JP.map(r => build(r, 'jp')).concat(EU.map(r => build(r, 'eu')));

// ── render con la plantilla de rutas ──
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (slug, l) => `https://glosx.app/rutas/${slug}/${l === 'en' ? '' : l + '/'}`;
const template = fs.readFileSync(path.join(__dirname, 'route-template.html'), 'utf8');
const head = template.slice(0, template.indexOf('<main>'));
const tail = template.slice(template.indexOf('</main>') + '</main>'.length);
const LNAMES = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語', zh: '中文' };

function render(r) {
  const others = ROUTES.filter(x => x.slug !== r.slug && x.region === r.region);
  const shares = x => x.A === r.A || x.B === r.B || x.A === r.B || x.B === r.A;
  const related = others.filter(shares).concat(others.filter(x => !shares(x))).slice(0, 6)
    .map(x => `<a href="/rutas/${x.slug}/zh/" class="related-link">${esc(x.A)} &rarr; ${esc(x.B)}</a>`).join('\n        ');
  const li = a => a.map(t => `<li>${esc(t)}</li>`).join('\n      ');
  const ctaCls = r.partner === 'Klook' ? 'klook-cta' : 'klook-cta omio-cta';
  const logo = r.partner === 'Klook' ? 'klook.com' : 'omio.com';
  const main = `<main>
    <p class="lead">${esc(r.lead)}</p>

    <a href="${r.book}" class="${ctaCls}" target="_blank" rel="noopener sponsored"
       onclick="gtag('event','${r.partner.toLowerCase()}_click',{source:'cta_block',route:'${r.slug}',lang:'zh'});">
      <img class="klook-cta-logo" src="https://www.google.com/s2/favicons?sz=64&domain=${logo}" alt="${r.partner}" loading="lazy">
      <div class="klook-cta-text">
        <span class="klook-cta-title">查看 <span class="klook-cta-city">${esc(r.A)}</span> &rarr; <span class="klook-cta-city">${esc(r.B)}</span> 的时刻并在 ${r.partner} 预订</span>
        <span class="klook-cta-sub">显示所选日期的实时时刻 · 票价每天变化</span>
      </div>
      <span class="klook-cta-btn">订票 &#8599;</span>
    </a>

    <h2>基本信息</h2>
    <ul>
      ${li(r.facts)}
    </ul>

    <h2>选哪趟车</h2>
    <p>${esc(r.choose)}</p>

    <h2>出发前须知</h2>
    <ul>
      ${li(r.tips)}
    </ul>

    <section class="faq">
      <h2>常见问题</h2>${r.faqs.map(([q, a]) => `
      <div class="faq-item">
        <h3 class="faq-q">${esc(q)}</h3>
        <p class="faq-a">${esc(a)}</p>
      </div>`).join('')}
    </section>

    <hr/>
    <p>准备出发了吗？在 ${r.partner} 查看你所选日期的时刻和票价并预订座位。</p>
    <p class="tl-secondary" style="text-align:center;margin:10px 0 8px;font-size:14px;color:#55565f;">
      比较时刻和票价： <a href="${r.book}" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('route_${r.slug}_zh')">查看时刻</a>
    </p>
    <p class="tl-note" style="text-align:center;margin:0 0 8px;font-size:12px;color:#6b6b85;">在新标签页中打开</p>

    <div class="related-routes">
      <h2>${r.region === 'jp' ? '日本更多火车线路' : '欧洲更多火车线路'}</h2>
      <div class="related-grid">
        ${related}
      </div>
    </div>
  </main>`;
  const have = ['en', 'es', 'fr', 'it', 'ja'].filter(l => fs.existsSync(path.join(ROOT, 'rutas', r.slug, l === 'en' ? '' : l, 'index.html')));
  const opts = have.concat('zh').map(l => `<a class="lang-option${l === 'zh' ? ' active' : ''}" href="/rutas/${r.slug}/${l === 'en' ? '' : l + '/'}">${LNAMES[l]}</a>`).join('');
  const langSwitch = `<div class="lang-wrapper"><button type="button" class="lang-btn" aria-label="语言" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open');"><span>中文</span><span style="font-size:10px;opacity:0.6">▾</span></button><div class="lang-dropdown">${opts}</div></div>`;
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: 'https://glosx.app/zh/' },
      { '@type': 'ListItem', position: 2, name: '线路', item: 'https://glosx.app/rutas/' },
      { '@type': 'ListItem', position: 3, name: `${r.A} → ${r.B}`, item: url(r.slug, 'zh') }] },
    { '@type': 'FAQPage', mainEntity: r.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'Article', headline: r.seoT, description: r.seoD, image: r.hero, datePublished: '2026-11-14', dateModified: '2026-11-14',
      author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' },
      publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } },
      mainEntityOfPage: url(r.slug, 'zh'), inLanguage: 'zh-Hans' }];
  const map = {
    '{{lang}}': 'zh-Hans', '{{routeSlug}}': r.slug, '{{canonical}}': url(r.slug, 'zh'),
    '{{title}}': esc(r.seoT), '{{description}}': esc(r.seoD), '{{ogTitle}}': esc(r.seoT), '{{ogDescription}}': esc(r.seoD),
    '{{twitterTitle}}': esc(r.seoT), '{{twitterDescription}}': esc(r.seoD), '{{videoCss}}': '',
    '{{schema}}': `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`,
    '{{langSwitch}}': langSwitch, '{{backText}}': '全部线路', '{{homeHref}}': '/zh/', '{{routesHref}}': '/rutas/',
    '{{footerLinks}}': '<a href="/blog.html">博客</a> · <a href="/about.html">关于我们</a> · <a href="/privacy.html">隐私政策</a> · <a href="/terms.html">使用条款</a>',
    '{{badge}}': r.region === 'jp' ? '线路指南 · 日本' : '线路指南 · 欧洲', '{{mainTitle}}': esc(`${r.A} → ${r.B}`), '{{metaText}}': 'WoW Train · 2026 年 11 月更新 · 阅读约 3 分钟'
  };
  let html = head + main + tail;
  html = html.split('{{heroImage}}').join(r.hero);
  for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
  // hreflang: solo los idiomas que existen + zh-Hans
  html = html.replace(/  <link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n/g, '');
  const alts = have.map(l => `  <link rel="alternate" hreflang="${l}" href="${url(r.slug, l)}" />`).join('\n') + `\n  <link rel="alternate" hreflang="zh-Hans" href="${url(r.slug, 'zh')}" />\n  <link rel="alternate" hreflang="x-default" href="${url(r.slug, 'en')}" />\n`;
  html = html.replace(/(<link rel="canonical"[^>]*>\n)/, `$1${alts}`);
  return { html, have };
}

let touched = 0;
for (const r of ROUTES) {
  const { html, have } = render(r);
  fs.mkdirSync(path.join(ROOT, 'rutas', r.slug, 'zh'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'rutas', r.slug, 'zh', 'index.html'), html);
  // las otras versiones: hreflang zh-Hans y opción 中文 en el selector
  for (const l of have) {
    const p = path.join(ROOT, 'rutas', r.slug, l === 'en' ? '' : l, 'index.html');
    let h = fs.readFileSync(p, 'utf8'), o = h;
    if (!h.includes('hreflang="zh-Hans"')) h = h.replace(/(\n\s*<link rel="alternate" hreflang="x-default")/, `\n  <link rel="alternate" hreflang="zh-Hans" href="${url(r.slug, 'zh')}" />$1`);
    if (!h.includes(`href="/rutas/${r.slug}/zh/"`)) h = h.replace(/(<div class="lang-dropdown"[^>]*>[\s\S]*?)(<\/div>)/, `$1<a class="lang-option" href="/rutas/${r.slug}/zh/" hreflang="zh-Hans" lang="zh-Hans">中文</a>$2`);
    if (h !== o) { fs.writeFileSync(p, h); touched++; }
  }
}
console.log('Generadas', ROUTES.length, 'rutas en chino; versiones actualizadas:', touched);

// sitemap
const sm = path.join(ROOT, 'sitemap.xml');
let x = fs.readFileSync(sm, 'utf8');
const today = new Date().toISOString().slice(0, 10);
let added = 0;
for (const r of ROUTES) {
  const zhUrl = url(r.slug, 'zh');
  const alt = `<xhtml:link rel="alternate" hreflang="zh-Hans" href="${zhUrl}" />`;
  x = x.replace(/<url>[\s\S]*?<\/url>/g, b => {
    const loc = (b.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '';
    if (!loc.startsWith(`https://glosx.app/rutas/${r.slug}/`) || b.includes('hreflang="zh-Hans"')) return b;
    return b.replace(/(\s*)(<xhtml:link rel="alternate" hreflang="x-default")/, `$1${alt}$1$2`);
  });
  if (!x.includes(`<loc>${zhUrl}</loc>`)) {
    const have = ['en', 'es', 'fr', 'it', 'ja'].filter(l => fs.existsSync(path.join(ROOT, 'rutas', r.slug, l === 'en' ? '' : l, 'index.html')));
    const alts = have.map(l => `      <xhtml:link rel="alternate" hreflang="${l}" href="${url(r.slug, l)}" />`).join('\n') + `\n      ${alt}\n      <xhtml:link rel="alternate" hreflang="x-default" href="${url(r.slug, 'en')}" />`;
    x = x.replace('</urlset>', `  <url>\n    <loc>${zhUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n${alts}\n  </url>\n</urlset>`);
    added++;
  }
}
fs.writeFileSync(sm, x);
fs.writeFileSync(path.join(__dirname, 'zh-top-urls.txt'), ROUTES.map(r => url(r.slug, 'zh')).join('\n') + '\n');
console.log('Sitemap: +' + added);
