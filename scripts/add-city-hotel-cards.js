#!/usr/bin/env node
/**
 * Tarjeta "Dónde alojarte" para rutas de Europa cuya ciudad de destino no tiene hotel curado en
 * REAL_HOTELS (generate-routes.js). Muestra los hoteles de la ciudad (sin inventar un hotel concreto):
 * foto de la ciudad + Klook (con fallback a Booking) + Booking + traslado, mismo marcado que las demás rutas.
 * Se inserta antes de la sección de preguntas. Idempotente. Uso: node scripts/add-city-hotel-cards.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = { en: '', es: 'es/', fr: 'fr/', it: 'it/', ja: 'ja/' };
const API = 'https://voxa-production-dc15.up.railway.app/affiliate';
const UI = {
  en: { h: 'Where to stay', t: c => `Hotels in ${c}`, btn: 'See current price →', bk: 'Compare on Booking.com →', tr: c => `Book private transfer in ${c} →` },
  es: { h: 'Dónde alojarte', t: c => `Hoteles en ${c}`, btn: 'Ver precio actual →', bk: 'Comparar en Booking.com →', tr: c => `Reservar traslado privado en ${c} →` },
  fr: { h: 'Où dormir', t: c => `Hôtels à ${c}`, btn: 'Voir le prix actuel →', bk: 'Comparer sur Booking.com →', tr: c => `Réserver un transfert privé à ${c} →` },
  it: { h: 'Dove dormire', t: c => `Hotel a ${c}`, btn: 'Vedi il prezzo attuale →', bk: 'Confronta su Booking.com →', tr: c => `Prenota un transfer privato a ${c} →` },
  ja: { h: 'おすすめの宿泊先', t: c => `${c}のホテル`, btn: '現在の料金を見る →', bk: 'Booking.comで比較 →', tr: c => `${c}の送迎を予約 →` }
};
const px = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=330`;
const ROUTES = {
  'lisbon-faro': { key: 'faro', photo: px(12704510), c: { en: 'Faro', es: 'Faro', fr: 'Faro', it: 'Faro', ja: 'ファロ' }, k: { en: 'Portugal', es: 'Portugal', fr: 'Portugal', it: 'Portogallo', ja: 'ポルトガル' } },
  'ljubljana-graz': { key: 'graz', photo: px(31899496), c: { en: 'Graz', es: 'Graz', fr: 'Graz', it: 'Graz', ja: 'グラーツ' }, k: { en: 'Austria', es: 'Austria', fr: 'Autriche', it: 'Austria', ja: 'オーストリア' } },
  'lyon-marseille': { key: 'marseille', photo: px(8430273), c: { en: 'Marseille', es: 'Marsella', fr: 'Marseille', it: 'Marsiglia', ja: 'マルセイユ' }, k: { en: 'France', es: 'Francia', fr: 'France', it: 'Francia', ja: 'フランス' } },
  'paris-marseille': { key: 'marseille', photo: px(31482953), c: { en: 'Marseille', es: 'Marsella', fr: 'Marseille', it: 'Marsiglia', ja: 'マルセイユ' }, k: { en: 'France', es: 'Francia', fr: 'France', it: 'Francia', ja: 'フランス' } },
  'oslo-gothenburg': { key: 'gothenburg', photo: px(33820144), c: { en: 'Gothenburg', es: 'Gotemburgo', fr: 'Göteborg', it: 'Göteborg', ja: 'ヨーテボリ' }, k: { en: 'Sweden', es: 'Suecia', fr: 'Suède', it: 'Svezia', ja: 'スウェーデン' } },
  'oslo-trondheim': { key: 'trondheim', photo: px(17241175), c: { en: 'Trondheim', es: 'Trondheim', fr: 'Trondheim', it: 'Trondheim', ja: 'トロンハイム' }, k: { en: 'Norway', es: 'Noruega', fr: 'Norvège', it: 'Norvegia', ja: 'ノルウェー' } },
  'zurich-geneva': { key: 'geneva', photo: px(14856873), c: { en: 'Geneva', es: 'Ginebra', fr: 'Genève', it: 'Ginevra', ja: 'ジュネーブ' }, k: { en: 'Switzerland', es: 'Suiza', fr: 'Suisse', it: 'Svizzera', ja: 'スイス' } }
};
let n = 0;
for (const [slug, r] of Object.entries(ROUTES)) for (const [l, sfx] of Object.entries(LANGS)) {
  const p = path.join(ROOT, 'rutas', slug, sfx, 'index.html');
  if (!fs.existsSync(p)) { console.log('falta', p); continue; }
  let h = fs.readFileSync(p, 'utf8');
  if (h.includes('class="hotel-card"')) continue;
  const u = UI[l], city = r.c[l], sep = l === 'ja' ? '、' : ', ';
  const block = `    <h2>${u.h}</h2>
    
    <div class="hotel-card">
      <div class="hotel-card-header">
        <img class="hotel-card-image" src="${r.photo}" alt="${u.t(city)}" loading="lazy">
        <div class="hotel-card-info">
          <div class="hotel-card-name">${u.t(city)}</div>
          <div class="hotel-card-location">${city}${sep}${r.k[l]}</div>
        </div>
      </div>
      <div class="hotel-card-actions">
        <a href="${API}/klook-hotel?city=${r.key}" 
           class="cta-btn" target="_blank" rel="noopener sponsored"
           onclick="trackPartnerClick('hotel_${slug}_${l}')">
          ${u.btn}
        </a>
        <br>
        <a href="${API}/booking-hotel?city=${r.key}" 
           class="economic-link" target="_blank" rel="noopener sponsored" onclick="trackPartnerClick('hotel_booking_${slug}_${l}')">
          ${u.bk}
        </a>
        <br>
        <a href="${API}/kiwitaxi"
           class="transfer-link" target="_blank" rel="noopener sponsored">
          ${u.tr(city)}
        </a>
      </div>
    </div>

`;
  const i = h.indexOf('    <section class="faq">');
  if (i < 0) { console.log('sin faq', p); continue; }
  h = h.slice(0, i) + block + h.slice(i);
  fs.writeFileSync(p, h); n++;
}
console.log('tarjetas agregadas:', n);
