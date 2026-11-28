"""
Guia del viajero para las paginas de ruta de EE. UU. (28-nov-2026).
Regla: solo datos verificados en fuentes oficiales (consultadas el 28-nov-2026); nada inventado por ruta.
Cada pagina combina los bloques que le aplican segun operador, trenes, duracion, frontera y zonas horarias.
Donde las paginas oficiales se contradicen (bultos personales, trenes que admiten mascotas, cambios de tarifa)
no se da una cifra fija: se pide confirmar al reservar.

Fuentes (sin enlace: no se enlaza a operadores en el contenido de glosx):
- amtrak.com: passenger-identification, at-the-station/boarding, carry-on-baggage, pets, roomettes,
  planning-booking/planning-booking-tips/amtrak-travel-preparation (wifi, comida propia), acela-train,
  personal-safety y amtrak-police-department (27311, 1-800-331-0008), refund-and-cancellation-policy,
  children-discounts, crossing-the-us-canadian-border, stations/was (puertas 3 min antes).
- gobrightline.com: know-before-you-go/baggage, terms-of-service (mascotas).
- canada.ca: eTA, llegada por tierra.
Idiomas: es y en (el resto se agrega con el mismo esquema).
"""
import html

CHECKED = {'es': '28 de noviembre de 2026', 'en': '28 November 2026'}
LONG = {'Silver Meteor', 'Floridian', 'Crescent', 'Lake Shore Limited', 'Cardinal', 'California Zephyr', 'Southwest Chief',
        'Texas Eagle', 'City of New Orleans', 'Coast Starlight', 'Empire Builder', 'Sunset Limited', 'Auto Train'}
TZ = {**{s: 'ET' for s in 'NY NJ PA MA RI CT DE MD DC VA NC SC GA FL ME VT MI IN OH QC'.split()},
      **{s: 'CT' for s in 'IL WI MO MN TX OK LA TN AL MS KS AR IA NE'.split()},
      **{s: 'MT' for s in 'CO NM UT AZ'.split()}, 'CA': 'PT'}
TZN = {'es': {'ET': 'hora del Este', 'CT': 'hora del Centro', 'MT': 'hora de la Montaña', 'PT': 'hora del Pacífico'},
       'en': {'ET': 'Eastern Time', 'CT': 'Central Time', 'MT': 'Mountain Time', 'PT': 'Pacific Time'}}

T = {
 'es': dict(
   h='Guía para tu viaje', lead='Lo que conviene saber según cómo viajes, con datos de las fuentes oficiales.',
   p1t='Si es tu primera vez (o te pone nervioso)', p2t='Si ya viajas seguido', p3t='Si todavía dudas',
   arrive='Llega a la estación unos 30 minutos antes; 60 si vas a despachar equipaje o necesitas ayuda.',
   board='La vía o la puerta de embarque se anuncia en las pantallas unos 15 minutos antes de la salida. En algunas estaciones la puerta cierra entre 3 y 10 minutos antes.',
   was='En Washington Union Station la puerta de embarque cierra 3 minutos antes de la salida.',
   scan='A bordo, el revisor escanea el billete: puedes llevarlo en el móvil.',
   late='Si el tren llega con retraso a tu estación, puede quedarse menos tiempo del que marca el horario: estate atento al anuncio.',
   bl_arrive='En Brightline, si despachas equipaje en Orlando tienes que entregarlo al menos 30 minutos antes de la salida.',
   exp_fast='El tren directo más rápido tarda {dur}; hay {n} al día en este sentido, el primero a las {f}.',
   exp_one='Hay un solo tren directo al día, a las {f}: si lo pierdes, el siguiente sale al otro día.',
   acela='Acela tiene enchufe y puertos USB en cada asiento.',
   quiet='En los Northeast Regional hay un Quiet Car: no se permiten llamadas y la luz es más baja.',
   tz='Los horarios están en la hora local de cada estación: {a} usa la {za} y {b}, la {zb}.',
   doubt1='Los precios suelen subir a medida que se acerca la fecha: reservar con antelación suele salir más barato.',
   doubt2='Si no cancelas antes de la salida y no viajas, el billete se pierde. Las condiciones de cambio y reembolso dependen de la tarifa: revísalas antes de pagar.',
   doubt_many='Con {n} trenes al día, si cambian tus planes tienes alternativas el mismo día.',
   cht='Antes de viajar: lo que tienes que revisar',
   id='Documento: a los mayores de 18 años se les puede pedir un documento oficial con foto (pasaporte, licencia de conducir u otro). Es obligatorio si compras el billete a bordo o despachas equipaje, y tiene que estar vigente.',
   id_bl='Documento: lleva un documento oficial con foto vigente.',
   border='Cruzas a Canadá: lleva el pasaporte original y vigente (no sirven copias). Hay control de aduana y migración de los dos países.',
   eta='Si vienes de un país que pide eTA para volar a Canadá, en general no la necesitas para entrar en tren, pero sí el pasaporte. Si tu país necesita visa para Canadá, la visa sigue siendo obligatoria.',
   border_early='Si no eres ciudadano de EE. UU. ni de Canadá, llega con más de una hora de anticipación por los trámites de migración.',
   bag='Equipaje de mano en Amtrak: hasta 2 maletas de 50 libras (unos 23 kg) y 28 × 22 × 14 pulgadas (71 × 56 × 36 cm) cada una, más artículos personales que entren bajo el asiento. Confirma cuántos artículos personales admite tu tren al reservar.',
   bag_ps='En el Pacific Surfliner la maleta de mano puede tener hasta 11 pulgadas (28 cm) de profundidad.',
   bag_bl='Brightline: las tarifas PREMIUM incluyen una maleta despachada estándar.',
   food='Comida: puedes llevar tu propia comida y bebida para tomarla en tu asiento. Lo que compres en el coche comedor o en el coche cafetería se consume ahí.',
   food_long='En un viaje largo, lleva algo más de comida por si hay retrasos.',
   kids='Niños: de 2 a 12 años pagan la mitad si viajan con un adulto (un niño por adulto) y no pueden viajar solos. Los menores de 2 viajan gratis si van en brazos.',
   pets='Mascotas: Amtrak acepta perros y gatos de hasta 20 libras (unos 9 kg) con transportín, en viajes de hasta 7 horas, con reserva y pago aparte. No todos los trenes los aceptan: confírmalo al reservar.',
   pets_long='Mascotas: Amtrak solo acepta perros y gatos en viajes de hasta 7 horas, así que en este recorrido completo no pueden viajar. Los animales de servicio sí pueden ir en todos los trenes.',
   pets_bl='Mascotas en Brightline: perros y gatos en transportín cerrado, uno por pasajero de 13 años o más; cuesta 10 dólares entre las estaciones del sur de Florida y 45 dólares si el viaje es hacia o desde Orlando. Agrégala a la reserva con anticipación.',
   wifi='Wifi gratis en la mayoría de los trenes de Amtrak.',
   sleep='Este recorrido tiene tren con coche cama ({svc}): en roomette o dormitorio las comidas habituales están incluidas y hay un encargado que prepara la cama y ayuda con el equipaje.',
   sft='Seguridad',
   sf1='Ten tu equipaje a la vista y llévalo contigo cuando te muevas por el tren.',
   sf2='Para avisar de algo sospechoso o pedir ayuda: Policía de Amtrak 1-800-331-0008, mensaje de texto al 27311, o 911. También puedes hablar con cualquier agente uniformado o con la tripulación.',
   sf3='Guarda esos números en el teléfono antes de salir.',
   cut='Costumbres y frases útiles',
   c1='En EE. UU. el peso se mide en libras, la distancia en millas y la temperatura en grados Fahrenheit.',
   c2='El revisor se llama «conductor» y suele anunciar cada parada por los altavoces.',
   phr='Frases que te pueden servir:',
   phrases=[('Which track does the train to {b} leave from?', '¿De qué vía sale el tren a {b}?'), ('Is this seat taken?', '¿Está ocupado este asiento?'),
            ('Where is the café car?', '¿Dónde está el coche cafetería?'), ('Is this the Quiet Car?', '¿Este es el vagón silencioso?'),
            ('Is this train going to {b}?', '¿Este tren va a {b}?')],
   src='Fuentes: páginas oficiales de {ops}{ca}, consultadas el {d}. Las normas pueden cambiar: confírmalas al reservar.',
   ca=' y del gobierno de Canadá',
   q_doc='¿Qué documento necesito para el tren de {a} a {b}?', q_wifi='¿Hay wifi en el tren de {a} a {b}?', q_food='¿Puedo llevar comida al tren?',
   q_pet='¿Puedo viajar con mi perro o mi gato?', q_miss='¿Qué pasa si pierdo el tren?', q_sleep='¿Hay coche cama de {a} a {b}?',
   q_pass='¿Necesito pasaporte para el tren de {a} a {b}?',
   a_wifi='Amtrak ofrece wifi gratis en la mayoría de sus trenes.', a_wifi_bl='Revisa los servicios a bordo de Brightline al reservar.',
   a_miss='Si no cancelas antes de la salida y no viajas, el billete se pierde. Si sabes que no llegas, cámbialo o cancélalo antes de la hora de salida; lo que se devuelve depende de la tarifa.',
 ),
 'en': dict(
   h='Your trip guide', lead='What is worth knowing for the way you travel, from official sources.',
   p1t='First time (or a nervous traveler)', p2t='Frequent traveler', p3t='Still deciding',
   arrive='Get to the station about 30 minutes early; 60 if you are checking bags or need assistance.',
   board='The track or boarding gate shows on the departure screens about 15 minutes before departure. At some stations the gate closes 3 to 10 minutes before.',
   was='At Washington Union Station the boarding gate closes 3 minutes before departure.',
   scan='On board, the conductor scans your ticket: you can keep it on your phone.',
   late='If the train reaches your station late, it may stop for less time than the timetable shows: listen for the announcement.',
   bl_arrive='On Brightline, checked bags in Orlando must be dropped at least 30 minutes before departure.',
   exp_fast='The fastest direct train takes {dur}; there are {n} a day in this direction, the first at {f}.',
   exp_one='There is one direct train a day, at {f}: if you miss it, the next one leaves the following day.',
   acela='Acela has a power outlet and USB ports at every seat.',
   quiet='Northeast Regional trains have a Quiet Car: no phone calls and lower lighting.',
   tz='Times are in each station\'s local time: {a} is on {za} and {b} on {zb}.',
   doubt1='Fares usually rise as the date gets closer, so booking ahead tends to cost less.',
   doubt2='If you don\'t cancel before departure and don\'t travel, the ticket is forfeited. Change and refund rules depend on the fare: check them before you pay.',
   doubt_many='With {n} trains a day, you have other options on the same day if your plans change.',
   cht='Before you travel: what to check',
   id='ID: passengers 18 and over may be asked for a valid government-issued photo ID (passport, driver\'s license or similar). It is required if you buy a ticket on board or check bags, and it must not be expired.',
   id_bl='ID: carry a valid government-issued photo ID.',
   border='You cross into Canada: carry your original, valid passport (copies are not accepted). Both countries carry out customs and immigration checks.',
   eta='If your country needs an eTA to fly to Canada, you generally don\'t need one to arrive by train, but you do need your passport. If your country needs a visa for Canada, the visa is still required.',
   border_early='If you are not a US or Canadian citizen, arrive more than an hour early for immigration processing.',
   bag='Amtrak carry-on: up to 2 bags of 50 lbs and 28 × 22 × 14 inches each, plus personal items that fit under the seat. Check how many personal items your train allows when you book.',
   bag_ps='On the Pacific Surfliner, carry-on bags can be up to 11 inches deep.',
   bag_bl='Brightline: PREMIUM fares include one standard checked bag.',
   food='Food: you can bring your own food and drinks to have at your seat. Anything bought in the dining or café car is eaten there.',
   food_long='On a long trip, pack some extra food in case of delays.',
   kids='Children: ages 2 to 12 pay half when traveling with an adult (one child per adult) and cannot travel alone. Under 2s ride free on a lap.',
   pets='Pets: Amtrak takes dogs and cats up to 20 lbs including the carrier, on trips of up to 7 hours, with a reservation and a fee. Not every train allows them: confirm when you book.',
   pets_long='Pets: Amtrak only takes dogs and cats on trips of up to 7 hours, so they cannot travel on this full route. Service animals are welcome on all trains.',
   pets_bl='Pets on Brightline: dogs and cats in a closed carrier, one per passenger aged 13 or over; $10 between South Florida stations and $45 to or from Orlando. Add the pet to your booking in advance.',
   wifi='Free Wi-Fi on most Amtrak trains.',
   sleep='This route has a train with sleeping cars ({svc}): in a roomette or bedroom, regular meals are included and an attendant makes up the bed and helps with luggage.',
   sft='Safety',
   sf1='Keep your bags in sight and take them with you when you move around the train.',
   sf2='To report something suspicious or ask for help: Amtrak Police 1-800-331-0008, text 27311, or 911. You can also speak to any uniformed officer or crew member.',
   sf3='Save those numbers on your phone before you leave.',
   cut='Good to know',
   c1='In the US, weight is in pounds, distance in miles and temperature in degrees Fahrenheit.',
   c2='The conductor usually announces each stop over the speakers.',
   phr='', phrases=[],
   src='Sources: official {ops} pages{ca}, checked on {d}. Rules can change: confirm them when you book.',
   ca=' and the Government of Canada',
   q_doc='What ID do I need for the train from {a} to {b}?', q_wifi='Is there Wi-Fi on the train from {a} to {b}?', q_food='Can I bring food on the train?',
   q_pet='Can I travel with my dog or cat?', q_miss='What happens if I miss the train?', q_sleep='Is there a sleeper from {a} to {b}?',
   q_pass='Do I need a passport for the train from {a} to {b}?',
   a_wifi='Amtrak offers free Wi-Fi on most of its trains.', a_wifi_bl='Check Brightline\'s onboard services when you book.',
   a_miss='If you don\'t cancel before departure and don\'t travel, the ticket is forfeited. If you know you won\'t make it, change or cancel before departure time; what you get back depends on the fare.',
 ),
}

from us_traveler_i18n import T as _T6, CHECKED as _C6, TZN as _Z6  # noqa: E402  fr, de, it, pt, ja, zh
T.update(_T6); CHECKED.update(_C6); TZN.update(_Z6)

CSS = ('<style>.tg{margin:28px 0}.tg-lead{color:#55565f;margin:-4px 0 14px}.tg-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:0 0 8px}'
       '.tg-card{border:1px solid #e6e1da;border-radius:14px;padding:14px 16px;background:#fff}.tg-card h3{font-size:16px;margin:0 0 8px}'
       '.tg-card ul,.tg ul{margin:0;padding-left:18px}.tg-card li,.tg li{margin:0 0 6px;line-height:1.5}'
       '.tg ul.tg-phr{padding-left:0;display:grid;gap:8px;margin:8px 0 14px}.tg-phr li{list-style:none;margin:0;padding:10px 14px;background:#f6f3ef;border-radius:10px}.tg-phr b{display:block;font-weight:600}.tg-phr span{color:#55565f;font-size:15px}.tg-src{font-size:13px;color:#55565f}</style>')


def guide(r, f, l):
    """Devuelve (html, faqs) de la guia para la ruta r (datos de us-routes.json) y los valores ya formateados f."""
    if l not in T: return '', []
    t = T[l]; e = html.escape
    bl = r['operator'] == 'Brightline'
    svc = set(r['services'])
    long_trains = sorted(svc & LONG)
    border = 'montreal' in (r['ca'], r['cb'])
    one = f['w'] == 1
    longtrip = r['fastest_min'] >= 8 * 60
    fmt = lambda k, **x: t[k].format(**{**f, **x})
    # perfiles
    p1 = [t['arrive'], t['board']] if not bl else [t['bl_arrive']]
    if r['ca'] == 'washington' and not bl: p1.append(t['was'])
    if not bl: p1 += [t['scan'], t['late']]
    p2 = [fmt('exp_one') if one else fmt('exp_fast')]
    if 'Acela' in svc: p2.append(t['acela'])
    if 'Northeast Regional' in svc: p2.append(t['quiet'])
    za, zb = TZ.get(r['state_a']), TZ.get(r['state_b'])
    if za and zb and za != zb: p2.append(fmt('tz', za=TZN[l][za], zb=TZN[l][zb]))
    p3 = [t['doubt1'], t['doubt2']]
    if f['w'] >= 4: p3.append(fmt('doubt_many'))
    cards = ''.join(f'<div class="tg-card"><h3>{e(h)}</h3><ul>{"".join(f"<li>{e(x)}</li>" for x in xs)}</ul></div>'
                    for h, xs in ((t['p1t'], p1), (t['p2t'], p2), (t['p3t'], p3)))
    # antes de viajar
    ck = [t['id_bl'] if bl else t['id']]
    if border: ck += [t['border'], t['eta'], t['border_early']]
    if bl: ck.append(t['bag_bl'])
    else:
        ck.append(t['bag'])
        if 'Pacific Surfliner' in svc: ck.append(t['bag_ps'])
    if not bl: ck.append(t['wifi'])
    ck.append(t['food'] + (' ' + t['food_long'] if longtrip else ''))
    if long_trains and longtrip: ck.append(fmt('sleep', svc=', '.join(long_trains)))
    if not bl: ck.append(t['kids'])
    pet = t['pets_bl'] if bl else (t['pets_long'] if r['fastest_min'] > 7 * 60 else t['pets'])
    ck.append(pet)
    # seguridad y costumbres
    sf = [t['sf1']] + ([] if bl else [t['sf2'], t['sf3']])
    cu = [t['c1'], t['c2']]
    phr = ''
    if t['phrases']:
        phr = f'<p><strong>{e(t["phr"])}</strong></p><ul class="tg-phr">' + ''.join(
            f'<li><b lang="en">{e(a.format(b=r["to"]))}</b><span>{e(b.format(b=f["b"]))}</span></li>' for a, b in t['phrases'] if 'Quiet' not in a or 'Northeast Regional' in svc) + '</ul>'
    ops = 'Brightline' if bl else 'Amtrak'
    src = t['src'].format(ops=ops, ca=t['ca'] if border else '', d=CHECKED[l])
    out = (f'{CSS}<section class="tg" id="guia-viajero"><h2>{e(t["h"])}</h2><p class="tg-lead">{e(t["lead"])}</p><div class="tg-cards">{cards}</div>'
           f'<h2>{e(t["cht"])}</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in ck)}</ul>'
           f'<h2>{e(t["sft"])}</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in sf)}</ul>'
           f'<h2>{e(t["cut"])}</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in cu)}</ul>{phr}'
           f'<p class="tg-src">{e(src)}</p></section>')
    # preguntas reales (van tambien al JSON-LD)
    faqs = [(fmt('q_doc'), (t['id_bl'] if bl else t['id']) + (' ' + t['border'] if border else ''))]
    if border: faqs.append((fmt('q_pass'), t['border'] + ' ' + t['eta']))
    faqs.append((fmt('q_wifi'), t['a_wifi_bl'] if bl else t['a_wifi']))
    faqs.append((t['q_food'], t['food'] + (' ' + t['food_long'] if longtrip else '')))
    if long_trains and longtrip: faqs.append((fmt('q_sleep'), fmt('sleep', svc=', '.join(long_trains))))
    faqs.append((t['q_pet'], pet))
    if not bl: faqs.append((t['q_miss'], t['a_miss']))
    return out, faqs
