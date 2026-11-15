#!/usr/bin/env node
/**
 * Agrega el bloque "Horarios por país" al índice de rutas de de/pt/zh (los build-*-hub.js reescriben el <header> sin él).
 * Idempotente. Correr después de build-lang-hub.js o build-zh-hub.js.  Uso: node scripts/add-country-hub-chips.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const C = {
  de: { ph: 'Beliebte Startorte', pop: [['trains-from-london', 'Züge ab London'], ['trains-from-paris', 'Züge ab Paris'], ['trains-from-uk-to-europe', 'Mit dem Eurostar von Großbritannien nach Europa']], h: 'Zugfahrzeiten nach Land', sub: 'offene Fahrplandaten: erster und letzter Zug, Züge pro Tag', es: 'Spanien',
        l: [['zuege-schweiz', 'Schweiz'], ['zuege-oesterreich', 'Österreich'], ['zuege-norwegen', 'Norwegen'], ['zuege-schweden', 'Schweden'], ['zuege-finnland', 'Finnland']] },
  pt: { ph: 'Pontos de partida populares', pop: [['trains-from-london', 'Comboios a partir de Londres'], ['trains-from-paris', 'Comboios a partir de Paris'], ['trains-from-uk-to-europe', 'Do Reino Unido para a Europa de Eurostar']], h: 'Horários por país', sub: 'dados abertos: primeiro e último comboio, comboios por dia', es: 'Espanha',
        l: [['comboios-suica', 'Suíça'], ['comboios-austria', 'Áustria'], ['comboios-noruega', 'Noruega'], ['comboios-suecia', 'Suécia'], ['comboios-finlandia', 'Finlândia']] },
  zh: { ph: '热门出发地', pop: [['trains-from-london', '从伦敦出发的火车'], ['trains-from-paris', '从巴黎出发的火车'], ['trains-from-uk-to-europe', '乘欧洲之星从英国去欧洲']], h: '各国火车时刻', sub: '开放数据：首班车、末班车、每天车次', es: '西班牙',
        l: [['swiss-trains', '瑞士'], ['austria-trains', '奥地利'], ['norway-trains', '挪威'], ['sweden-trains', '瑞典'], ['finland-trains', '芬兰']] },
};
for (const [l, c] of Object.entries(C)) {
  const f = path.join(ROOT, l, 'rutas', 'index.html');
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/\n    <div class="hub" data-country-chips>[\s\S]*?<\/div>\n    <\/div>/, '');
  const chips = `<li><a href="/${l}/horarios-trenes-espana/">${c.es}</a></li>` + c.l.map(([d, n]) => `<li><a href="/${l}/${d}/">${n}</a></li>`).join('');
  const pop = `<div class="hub-group"><h2>${c.ph}</h2><ul class="hub-chips">` + c.pop.map(([d, n]) => `<li><a href="/${l}/${d}/">${n}</a></li>`).join('') + '</ul></div>\n      ';
  const block = `\n    <div class="hub" data-country-chips>\n      ${pop}<div class="hub-group"><h2>${c.h} <span>· ${c.sub}</span></h2><ul class="hub-chips">${chips}</ul></div>\n    </div>`;
  s = s.replace(/(<header>[\s\S]*?)(\n  <\/header>)/, `$1${block}$2`);
  fs.writeFileSync(f, s);
  console.log(`/${l}/rutas/: bloque de países`);
}
