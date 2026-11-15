#!/usr/bin/env node
/**
 * Agrega el bloque "Horarios por país" al índice de rutas de de/pt/zh (los build-*-hub.js reescriben el <header> sin él).
 * Idempotente. Correr después de build-lang-hub.js o build-zh-hub.js.  Uso: node scripts/add-country-hub-chips.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const C = {
  de: { h: 'Zugfahrzeiten nach Land', sub: 'offene Fahrplandaten: erster und letzter Zug, Züge pro Tag', es: 'Spanien<small> (auf Spanisch)</small>',
        l: [['zuege-schweiz', 'Schweiz'], ['zuege-oesterreich', 'Österreich'], ['zuege-norwegen', 'Norwegen'], ['zuege-schweden', 'Schweden'], ['zuege-finnland', 'Finnland']] },
  pt: { h: 'Horários por país', sub: 'dados abertos: primeiro e último comboio, comboios por dia', es: 'Espanha<small> (em espanhol)</small>',
        l: [['comboios-suica', 'Suíça'], ['comboios-austria', 'Áustria'], ['comboios-noruega', 'Noruega'], ['comboios-suecia', 'Suécia'], ['comboios-finlandia', 'Finlândia']] },
  zh: { h: '各国火车时刻', sub: '开放数据：首班车、末班车、每天车次', es: '西班牙<small>（西班牙语）</small>',
        l: [['swiss-trains', '瑞士'], ['austria-trains', '奥地利'], ['norway-trains', '挪威'], ['sweden-trains', '瑞典'], ['finland-trains', '芬兰']] },
};
for (const [l, c] of Object.entries(C)) {
  const f = path.join(ROOT, l, 'rutas', 'index.html');
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/\n    <div class="hub" data-country-chips>[\s\S]*?<\/div>\n    <\/div>/, '');
  const chips = `<li><a href="/horarios-trenes-espana/">${c.es}</a></li>` + c.l.map(([d, n]) => `<li><a href="/${l}/${d}/">${n}</a></li>`).join('');
  const block = `\n    <div class="hub" data-country-chips>\n      <div class="hub-group"><h2>${c.h} <span>· ${c.sub}</span></h2><ul class="hub-chips">${chips}</ul></div>\n    </div>`;
  s = s.replace(/(<header>[\s\S]*?)(\n  <\/header>)/, `$1${block}$2`);
  fs.writeFileSync(f, s);
  console.log(`/${l}/rutas/: bloque de países`);
}
