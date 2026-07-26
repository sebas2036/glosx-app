const fs = require('fs');
const path = require('path');

// Route data configuration
const routes = [
  { slug: 'amsterdam-berlin', from: 'Amsterdam', to: 'Berlin', country: 'Netherlands-Germany', duration: '6h 30m', operator: 'DB ICE', price: '€29-45', badge: 'Route guide · Netherlands-Germany' },
  { slug: 'amsterdam-brussels', from: 'Amsterdam', to: 'Brussels', country: 'Netherlands-Belgium', duration: '2h 00m', operator: 'Thalys', price: '€25-35', badge: 'Route guide · Netherlands-Belgium' },
  { slug: 'barcelona-girona', from: 'Barcelona', to: 'Girona', country: 'Spain', duration: '1h 30m', operator: 'Renfe', price: '€10-15', badge: 'Route guide · Spain' },
  { slug: 'barcelona-lyon', from: 'Barcelona', to: 'Lyon', country: 'Spain-France', duration: '4h 30m', operator: 'TGV', price: '€35-55', badge: 'Route guide · Spain-France' },
  { slug: 'barcelona-valencia', from: 'Barcelona', to: 'Valencia', country: 'Spain', duration: '3h 00m', operator: 'Renfe AVE', price: '€20-35', badge: 'Route guide · Spain' },
  { slug: 'basel-lauterbrunnen', from: 'Basel', to: 'Lauterbrunnen', country: 'Switzerland', duration: '2h 30m', operator: 'SBB', price: '€35-50', badge: 'Route guide · Switzerland' },
  { slug: 'basel-paris', from: 'Basel', to: 'Paris', country: 'Switzerland-France', duration: '3h 00m', operator: 'TGV Lyria', price: '€40-60', badge: 'Route guide · Switzerland-France' },
  { slug: 'berlin-hamburg', from: 'Berlin', to: 'Hamburg', country: 'Germany', duration: '1h 45m', operator: 'DB ICE', price: '€25-40', badge: 'Route guide · Germany' },
  { slug: 'berlin-prague', from: 'Berlin', to: 'Prague', country: 'Germany-Czech', duration: '4h 30m', operator: 'DB ČD', price: '€30-50', badge: 'Route guide · Germany-Czech' },
  { slug: 'bordeaux-lourdes', from: 'Bordeaux', to: 'Lourdes', country: 'France', duration: '2h 30m', operator: 'SNCF Intercités', price: '€20-35', badge: 'Route guide · France' },
  { slug: 'brno-vienna', from: 'Brno', to: 'Vienna', country: 'Czech-Austria', duration: '1h 45m', operator: 'ÖBB', price: '€15-25', badge: 'Route guide · Czech-Austria' },
  { slug: 'brussels-bruges', from: 'Brussels', to: 'Bruges', country: 'Belgium', duration: '0h 50m', operator: 'SNCB', price: '€10-15', badge: 'Route guide · Belgium' },
  { slug: 'brussels-paris', from: 'Brussels', to: 'Paris', country: 'Belgium-France', duration: '1h 30m', operator: 'Thalys', price: '€35-55', badge: 'Route guide · Belgium-France' },
  { slug: 'budapest-ljubljana', from: 'Budapest', to: 'Ljubljana', country: 'Hungary-Slovenia', duration: '6h 00m', operator: 'MÁV', price: '€30-50', badge: 'Route guide · Hungary-Slovenia' },
  { slug: 'copenhagen-stockholm', from: 'Copenhagen', to: 'Stockholm', country: 'Denmark-Sweden', duration: '5h 00m', operator: 'SJ', price: '€40-60', badge: 'Route guide · Denmark-Sweden' },
  { slug: 'dortmund-munich', from: 'Dortmund', to: 'Munich', country: 'Germany', duration: '5h 30m', operator: 'DB ICE', price: '€35-55', badge: 'Route guide · Germany' },
  { slug: 'florence-pisa', from: 'Florence', to: 'Pisa', country: 'Italy', duration: '1h 00m', operator: 'Trenitalia', price: '€10-15', badge: 'Route guide · Italy' },
  { slug: 'florence-siena', from: 'Florence', to: 'Siena', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€10-15', badge: 'Route guide · Italy' },
  { slug: 'florence-venice', from: 'Florence', to: 'Venice', country: 'Italy', duration: '2h 00m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'frankfurt-cologne', from: 'Frankfurt', to: 'Cologne', country: 'Germany', duration: '1h 15m', operator: 'DB ICE', price: '€25-40', badge: 'Route guide · Germany' },
  { slug: 'frankfurt-munich', from: 'Frankfurt', to: 'Munich', country: 'Germany', duration: '3h 30m', operator: 'DB ICE', price: '€30-50', badge: 'Route guide · Germany' },
  { slug: 'frankfurt-paris', from: 'Frankfurt', to: 'Paris', country: 'Germany-France', duration: '4h 00m', operator: 'TGV', price: '€40-60', badge: 'Route guide · Germany-France' },
  { slug: 'geneva-paris', from: 'Geneva', to: 'Paris', country: 'Switzerland-France', duration: '3h 00m', operator: 'TGV Lyria', price: '€40-60', badge: 'Route guide · Switzerland-France' },
  { slug: 'geneva-zermatt', from: 'Geneva', to: 'Zermatt', country: 'Switzerland', duration: '3h 30m', operator: 'SBB', price: '€45-65', badge: 'Route guide · Switzerland' },
  { slug: 'girona-figueres', from: 'Girona', to: 'Figueres', country: 'Spain', duration: '0h 30m', operator: 'Renfe', price: '€5-10', badge: 'Route guide · Spain' },
  { slug: 'interlaken-lauterbrunnen', from: 'Interlaken', to: 'Lauterbrunnen', country: 'Switzerland', duration: '0h 20m', operator: 'BOB', price: '€10-15', badge: 'Route guide · Switzerland' },
  { slug: 'lisbon-porto', from: 'Lisbon', to: 'Porto', country: 'Portugal', duration: '2h 30m', operator: 'CP', price: '€15-25', badge: 'Route guide · Portugal' },
  { slug: 'london-amsterdam', from: 'London', to: 'Amsterdam', country: 'UK-Netherlands', duration: '4h 00m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · UK-Netherlands' },
  { slug: 'london-brussels', from: 'London', to: 'Brussels', country: 'UK-Belgium', duration: '2h 00m', operator: 'Eurostar', price: '€40-70', badge: 'Route guide · UK-Belgium' },
  { slug: 'london-cambridge', from: 'London', to: 'Cambridge', country: 'UK', duration: '0h 50m', operator: 'Thameslink', price: '€15-25', badge: 'Route guide · UK' },
  { slug: 'london-edinburgh', from: 'London', to: 'Edinburgh', country: 'UK', duration: '4h 30m', operator: 'LNER', price: '€30-60', badge: 'Route guide · UK' },
  { slug: 'london-liverpool', from: 'London', to: 'Liverpool', country: 'UK', duration: '2h 15m', operator: 'Avanti', price: '€20-40', badge: 'Route guide · UK' },
  { slug: 'london-manchester', from: 'London', to: 'Manchester', country: 'UK', duration: '2h 00m', operator: 'Avanti', price: '€20-40', badge: 'Route guide · UK' },
  { slug: 'london-oxford', from: 'London', to: 'Oxford', country: 'UK', duration: '1h 00m', operator: 'GWR', price: '€15-25', badge: 'Route guide · UK' },
  { slug: 'london-paris', from: 'London', to: 'Paris', country: 'UK-France', duration: '2h 30m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · UK-France' },
  { slug: 'london-york', from: 'London', to: 'York', country: 'UK', duration: '2h 00m', operator: 'LNER', price: '€20-40', badge: 'Route guide · UK' },
  { slug: 'lyon-turin', from: 'Lyon', to: 'Turin', country: 'France-Italy', duration: '4h 00m', operator: 'TGV', price: '€35-55', badge: 'Route guide · France-Italy' },
  { slug: 'madrid-barcelona', from: 'Madrid', to: 'Barcelona', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain' },
  { slug: 'madrid-malaga', from: 'Madrid', to: 'Malaga', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain' },
  { slug: 'madrid-seville', from: 'Madrid', to: 'Seville', country: 'Spain', duration: '2h 30m', operator: 'Renfe AVE', price: '€25-45', badge: 'Route guide · Spain' },
  { slug: 'madrid-valencia', from: 'Madrid', to: 'Valencia', country: 'Spain', duration: '1h 40m', operator: 'Renfe AVE', price: '€20-35', badge: 'Route guide · Spain' },
  { slug: 'madrid-zaragoza', from: 'Madrid', to: 'Zaragoza', country: 'Spain', duration: '1h 30m', operator: 'Renfe AVE', price: '€15-25', badge: 'Route guide · Spain' },
  { slug: 'marseille-miramas', from: 'Marseille', to: 'Miramas', country: 'France', duration: '0h 45m', operator: 'SNCF TER', price: '€10-15', badge: 'Route guide · France' },
  { slug: 'milan-florence', from: 'Milan', to: 'Florence', country: 'Italy', duration: '1h 45m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'milan-rome', from: 'Milan', to: 'Rome', country: 'Italy', duration: '3h 00m', operator: 'Trenitalia', price: '€30-50', badge: 'Route guide · Italy' },
  { slug: 'milan-zurich', from: 'Milan', to: 'Zurich', country: 'Italy-Switzerland', duration: '3h 30m', operator: 'SBB', price: '€35-55', badge: 'Route guide · Italy-Switzerland' },
  { slug: 'montreux-interlaken', from: 'Montreux', to: 'Interlaken', country: 'Switzerland', duration: '2h 00m', operator: 'SBB', price: '€25-40', badge: 'Route guide · Switzerland' },
  { slug: 'munich-berlin', from: 'Munich', to: 'Berlin', country: 'Germany', duration: '4h 00m', operator: 'DB ICE', price: '€35-55', badge: 'Route guide · Germany' },
  { slug: 'munich-prague', from: 'Munich', to: 'Prague', country: 'Germany-Czech', duration: '4h 00m', operator: 'DB ČD', price: '€30-50', badge: 'Route guide · Germany-Czech' },
  { slug: 'munich-venice', from: 'Munich', to: 'Venice', country: 'Germany-Italy', duration: '6h 00m', operator: 'ÖBB', price: '€40-60', badge: 'Route guide · Germany-Italy' },
  { slug: 'munich-vienna', from: 'Munich', to: 'Vienna', country: 'Germany-Austria', duration: '4h 30m', operator: 'Railjet', price: '€35-55', badge: 'Route guide · Germany-Austria' },
  { slug: 'naples-salerno', from: 'Naples', to: 'Salerno', country: 'Italy', duration: '0h 40m', operator: 'Trenitalia', price: '€5-10', badge: 'Route guide · Italy' },
  { slug: 'naples-sorrento', from: 'Naples', to: 'Sorrento', country: 'Italy', duration: '1h 00m', operator: 'Circumvesuviana', price: '€5-10', badge: 'Route guide · Italy' },
  { slug: 'nice-monaco', from: 'Nice', to: 'Monaco', country: 'France', duration: '0h 20m', operator: 'SNCF TER', price: '€5-10', badge: 'Route guide · France' },
  { slug: 'oslo-bergen', from: 'Oslo', to: 'Bergen', country: 'Norway', duration: '7h 00m', operator: 'Vy', price: '€50-80', badge: 'Route guide · Norway' },
  { slug: 'paris-amsterdam', from: 'Paris', to: 'Amsterdam', country: 'France-Netherlands', duration: '3h 30m', operator: 'Thalys', price: '€35-55', badge: 'Route guide · France-Netherlands' },
  { slug: 'paris-barcelona', from: 'Paris', to: 'Barcelona', country: 'France-Spain', duration: '6h 30m', operator: 'TGV', price: '€50-80', badge: 'Route guide · France-Spain' },
  { slug: 'paris-berlin', from: 'Paris', to: 'Berlin', country: 'France-Germany', duration: '8h 00m', operator: 'TGV', price: '€60-90', badge: 'Route guide · France-Germany' },
  { slug: 'paris-bordeaux', from: 'Paris', to: 'Bordeaux', country: 'France', duration: '2h 00m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France' },
  { slug: 'paris-bruges', from: 'Paris', to: 'Bruges', country: 'France-Belgium', duration: '2h 30m', operator: 'TGV', price: '€35-55', badge: 'Route guide · France-Belgium' },
  { slug: 'paris-london', from: 'Paris', to: 'London', country: 'France-UK', duration: '2h 30m', operator: 'Eurostar', price: '€50-80', badge: 'Route guide · France-UK' },
  { slug: 'paris-lourdes', from: 'Paris', to: 'Lourdes', country: 'France', duration: '6h 30m', operator: 'SNCF Intercités', price: '€30-50', badge: 'Route guide · France' },
  { slug: 'paris-lucerne', from: 'Paris', to: 'Lucerne', country: 'France-Switzerland', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · France-Switzerland' },
  { slug: 'paris-lyon', from: 'Paris', to: 'Lyon', country: 'France', duration: '2h 00m', operator: 'TGV', price: '€30-50', badge: 'Route guide · France' },
  { slug: 'paris-milan', from: 'Paris', to: 'Milan', country: 'France-Italy', duration: '7h 00m', operator: 'TGV', price: '€60-90', badge: 'Route guide · France-Italy' },
  { slug: 'paris-nice', from: 'Paris', to: 'Nice', country: 'France', duration: '5h 30m', operator: 'TGV', price: '€40-65', badge: 'Route guide · France' },
  { slug: 'paris-rome', from: 'Paris', to: 'Rome', country: 'France-Italy', duration: '11h 00m', operator: 'TGV', price: '€80-120', badge: 'Route guide · France-Italy' },
  { slug: 'paris-toulouse', from: 'Paris', to: 'Toulouse', country: 'France', duration: '4h 20m', operator: 'SNCF TGV', price: '€25-40', badge: 'Route guide · France' },
  { slug: 'paris-venice', from: 'Paris', to: 'Venice', country: 'France-Italy', duration: '8h 00m', operator: 'TGV', price: '€70-100', badge: 'Route guide · France-Italy' },
  { slug: 'paris-zurich', from: 'Paris', to: 'Zurich', country: 'France-Switzerland', duration: '4h 30m', operator: 'TGV Lyria', price: '€50-75', badge: 'Route guide · France-Switzerland' },
  { slug: 'prague-brno', from: 'Prague', to: 'Brno', country: 'Czech', duration: '2h 30m', operator: 'ČD', price: '€15-25', badge: 'Route guide · Czech' },
  { slug: 'prague-budapest', from: 'Prague', to: 'Budapest', country: 'Czech-Hungary', duration: '4h 30m', operator: 'ČD', price: '€25-40', badge: 'Route guide · Czech-Hungary' },
  { slug: 'prague-vienna', from: 'Prague', to: 'Vienna', country: 'Czech-Austria', duration: '4h 00m', operator: 'Railjet', price: '€25-40', badge: 'Route guide · Czech-Austria' },
  { slug: 'rome-florence', from: 'Rome', to: 'Florence', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'rome-naples', from: 'Rome', to: 'Naples', country: 'Italy', duration: '1h 10m', operator: 'Trenitalia', price: '€15-25', badge: 'Route guide · Italy' },
  { slug: 'rome-venice', from: 'Rome', to: 'Venice', country: 'Italy', duration: '4h 00m', operator: 'Trenitalia', price: '€30-50', badge: 'Route guide · Italy' },
  { slug: 'stockholm-oslo', from: 'Stockholm', to: 'Oslo', country: 'Sweden-Norway', duration: '6h 00m', operator: 'SJ', price: '€40-60', badge: 'Route guide · Sweden-Norway' },
  { slug: 'toulouse-lourdes', from: 'Toulouse', to: 'Lourdes', country: 'France', duration: '2h 00m', operator: 'SNCF Intercités', price: '€15-25', badge: 'Route guide · France' },
  { slug: 'turin-milan', from: 'Turin', to: 'Milan', country: 'Italy', duration: '1h 30m', operator: 'Trenitalia', price: '€15-25', badge: 'Route guide · Italy' },
  { slug: 'venice-milan', from: 'Venice', to: 'Milan', country: 'Italy', duration: '2h 30m', operator: 'Trenitalia', price: '€20-35', badge: 'Route guide · Italy' },
  { slug: 'vienna-budapest', from: 'Vienna', to: 'Budapest', country: 'Austria-Hungary', duration: '2h 30m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria-Hungary' },
  { slug: 'vienna-krems', from: 'Vienna', to: 'Krems', country: 'Austria', duration: '1h 00m', operator: 'ÖBB', price: '€10-15', badge: 'Route guide · Austria' },
  { slug: 'vienna-prague', from: 'Vienna', to: 'Prague', country: 'Austria-Czech', duration: '4h 00m', operator: 'Railjet', price: '€25-40', badge: 'Route guide · Austria-Czech' },
  { slug: 'vienna-salzburg', from: 'Vienna', to: 'Salzburg', country: 'Austria', duration: '2h 30m', operator: 'Railjet', price: '€20-35', badge: 'Route guide · Austria' },
  { slug: 'zaragoza-barcelona', from: 'Zaragoza', to: 'Barcelona', country: 'Spain', duration: '1h 30m', operator: 'Renfe AVE', price: '€15-25', badge: 'Route guide · Spain' },
  { slug: 'zurich-lucerne', from: 'Zurich', to: 'Lucerne', country: 'Switzerland', duration: '0h 50m', operator: 'SBB', price: '€15-25', badge: 'Route guide · Switzerland' },
  { slug: 'zurich-milan', from: 'Zurich', to: 'Milan', country: 'Switzerland-Italy', duration: '3h 30m', operator: 'SBB', price: '€35-55', badge: 'Route guide · Switzerland-Italy' }
];

// Hoteles reales curados por ciudad de destino (mismos criterios que CURATED_HOTELS
// en assets/js/main.js: hoteles reales existentes, no genericos/ficticios).
const REAL_HOTELS = {
  amsterdam: { name: "De L'Europe Amsterdam", loc: "Amsterdam, Netherlands", image: "https://www.deleurope.com/wp-content/uploads/2024/02/homepage-hero-1.webp" },
  barcelona: { name: "Hotel Casa Fuster", loc: "Barcelona, Spain", image: "https://static-resources-elementor.mirai.com/wp-content/uploads/sites/343/casa-fuster_header-historia_section.jpg" },
  bergen: { name: "Hotel Norge by Scandic", loc: "Bergen, Norway", image: "https://www.scandichotels.com/globalassets/hotels/norway/bergen/scandic-norge/scandic-norge-exterior.jpg" },
  berlin: { name: "Hotel Adlon Kempinski", loc: "Berlin, Germany", image: "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/7/2/3/5/2625327-1-eng-GB/885bd49e79c3-89887320_4K.jpg" },
  bordeaux: { name: "InterContinental Bordeaux – Le Grand Hôtel", loc: "Bordeaux, France", image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Fa%C3%A7ade_Grand_H%C3%B4tel_de_Bordeaux.jpg" },
  brno: { name: "Grandhotel Brno", loc: "Brno, Czech Republic", image: "https://grandhotelbrno.cz/wp-content/uploads/bitmap-15.jpg" },
  bruges: { name: "Hotel Heritage", loc: "Bruges, Belgium", image: "https://www.hotel-heritage.com/wp-content/uploads/elementor/thumbs/289A0021-res7vp7qbz0q15g3rbg8tyy91gvwawbd8f3n5fvlnu.jpg" },
  brussels: { name: "Hotel Amigo", loc: "Brussels, Belgium", image: "https://www.roccofortehotels.com/media/caro2u4r/3b-rfh-hotel-amigo-blaton-suite-j1113_rfa_230-th-nov-19-lr.jpg" },
  budapest: { name: "Four Seasons Hotel Gresham Palace", loc: "Budapest, Hungary", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gresham_Palace_-_Stierch_01.jpg/250px-Gresham_Palace_-_Stierch_01.jpg" },
  cambridge: { name: "The Varsity Hotel & Spa", loc: "Cambridge, United Kingdom", image: "https://www.thevarsityhotel.co.uk/wp-content/uploads/2023/05/Varsity-Hotel-Exterior.jpg" },
  cologne: { name: "Excelsior Hotel Ernst am Dom", loc: "Cologne, Germany", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/8a/f4/2769ee5759ee0ccbc46ddba428c8aa267f5245551d00699bdde306970fa8.jpeg" },
  edinburgh: { name: "The Balmoral", loc: "Edinburgh, United Kingdom", image: "https://www.roccofortehotels.com/media/d54dutp2/2-rfh-the-balmoral-facade-0474-jg-sep-18.jpg" },
  figueres: { name: "Hotel Empordà", loc: "Figueres, Spain", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/19/c1/c1332927fb38208c45a7d20689b523813cf9ee9542530d8559dbc5912cda.jpeg" },
  florence: { name: "Helvetia & Bristol Firenze", loc: "Florence, Italy", image: "https://x3jh6o6w.cdn.imgeng.in/assets/uploads/Starhotels-Collezione/Helvetia_Bristol/GALLERY/helvetia-bristol-fi-facciata1.jpg?imgeng=/w_1200/h_630/m_cropbox" },
  girona: { name: "Hotel Peninsular", loc: "Girona, Spain", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/78/af/d0bb670163cca63359cc85c6da098a5779c27c3547402d3118965311a49b.jpeg" },
  hamburg: { name: "Hotel Atlantic Kempinski Hamburg", loc: "Hamburg, Germany", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/5c/c5/0722e0bfde503c4d712760adf4ee25a3f20628a73e6660371bdd2feac2be.jpeg" },
  interlaken: { name: "Grand Hotel Beau-Rivage", loc: "Interlaken, Switzerland", image: "https://i0.wp.com/www.grandbeaurivage.ch/wp-content/uploads/2026/03/terrasse.jpg?resize=1300%2C975&ssl=1" },
  krems: { name: "Steigenberger Hotel & Spa Krems", loc: "Krems, Austria", image: "https://www.steigenberger.com/-/media/steigenberger/hotels/austria/krems/steigenberger-hotel-spa-krems-exterior.jpg" },
  lauterbrunnen: { name: "Braunbär Hotel & Spa", loc: "Wengen, Lauterbrunnen valley, Switzerland", image: "https://cdn.prod.website-files.com/65b186476e59e33563a59cdf/65c53f1bae14910723ebbfa5_65bcd2b113e6815013ee49f0_hotel-braunbaer-wengen.webp" },
  liverpool: { name: "30 James Street", loc: "Liverpool, United Kingdom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Albion_House%2C_Liverpool_4.jpg/330px-Albion_House%2C_Liverpool_4.jpg" },
  ljubljana: { name: "Grand Hotel Union", loc: "Ljubljana, Slovenia", image: "https://media.booking-channel.com/api/hotels/2281/images/109.jpeg" },
  london: { name: "The Savoy", loc: "London, United Kingdom", image: "https://cdn.prod.website-files.com/68f4d1c2a6858f0bfbded01c/6905fd1604f6b402518f81d0_Savoy-SEO-Image.jpg" },
  lourdes: { name: "Hôtel Roissy", loc: "Lourdes, France", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/1b/35/904b7435487e16addcf95a1bac9ae9d4e512a058735be3628ceddb6f3808.jpeg" },
  lucerne: { name: "Hotel Schweizerhof Luzern", loc: "Lucerne, Switzerland", image: "https://www.schweizerhof-luzern.ch/bilder/seo/_800xAUTO_crop_center-center_none/socialMediaFallbackImage.jpg" },
  lyon: { name: "Villa Florentine", loc: "Lyon, France", image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Villa_Florentine_%40_Lyon_%2836389389615%29.jpg" },
  malaga: { name: "Gran Hotel Miramar", loc: "Malaga, Spain", image: "https://www.granhotelmiramarmalaga.com/wp-content/blogs.dir/1833/files/home/malaga-new.jpg" },
  manchester: { name: "The Midland Hotel", loc: "Manchester, United Kingdom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Midland_Hotel_west%2C_Manchester.jpg/330px-Midland_Hotel_west%2C_Manchester.jpg" },
  milan: { name: "Hotel Principe di Savoia", loc: "Milan, Italy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/3693MilanoHotelPrincipeSavoia.JPG/330px-3693MilanoHotelPrincipeSavoia.JPG" },
  miramas: { name: "ibis Styles Miramas - Provence", loc: "Miramas, France", image: "https://www.ahstatic.com/photos/c0d8_ho_00_p_1024x768.jpg" },
  monaco: { name: "Hôtel de Paris Monte-Carlo", loc: "Monaco", image: "https://asset.montecarlosbm.com/styles/hero_image_desktop/s3/media/orphea/hotel-de-paris-monte-carlo-facade-de-jour-2024-013_1.jpg.jpeg" },
  munich: { name: "Hotel Bayerischer Hof", loc: "Munich, Germany", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hotel_Bayerischer_Hof_0437.jpg/330px-Hotel_Bayerischer_Hof_0437.jpg" },
  naples: { name: "Grand Hotel Vesuvio", loc: "Naples, Italy", image: "https://d1vp8nomjxwyf1.cloudfront.net/wp-content/uploads/sites/165/2016/07/01100414/gallery_35-620x700.jpg" },
  nice: { name: "Hôtel Negresco", loc: "Nice, France", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nice_H%C3%B4tel_Negresco_Ext%C3%A9rieur_07.jpg/330px-Nice_H%C3%B4tel_Negresco_Ext%C3%A9rieur_07.jpg" },
  oslo: { name: "The Thief", loc: "Oslo, Norway", image: "https://thethief.com/wp-content/uploads/2023/01/thethief-exterior-01.jpg" },
  oxford: { name: "Old Bank Hotel", loc: "Oxford, United Kingdom", image: "https://www.oldbankhotel.co.uk/wp-content/uploads/2023/10/0009-2018-Old-Bank-Hotel-Oxford-High-Res-Old-Bank-Hotel-Quod-Facade-Web-Hero.jpg" },
  paris: { name: "Ritz Paris", loc: "Paris, France", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/H%C3%B4tel_Ritz.jpg/330px-H%C3%B4tel_Ritz.jpg" },
  pisa: { name: "Hotel Pisa Tower", loc: "Pisa, Italy", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/a5/fd/ae188e72b48d5360d4999fbd4b9070ec56590963d18a91196daca91fcb95.jpeg" },
  porto: { name: "The Yeatman", loc: "Porto, Portugal", image: "https://www.the-yeatman-hotel.com/wp-content/uploads/2023/03/the-yeatman-exterior.jpg" },
  prague: { name: "Hotel Paris Prague", loc: "Prague, Czech Republic", image: "https://www.hotel-paris.cz/files-sbbasic/ba_parisprague_cz/hotel-paris-prague-02.jpg?w=1200&h=627" },
  rome: { name: "Hotel Hassler Roma", loc: "Rome, Italy", image: "https://www.hotelhasslerroma.com/wp-content/uploads/2025/08/fec52ec67f951787b17109931fbf07f7a69f716b.webp" },
  salerno: { name: "Hotel Plaza", loc: "Salerno, Italy", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/65/77/702e7322aeb415a8ce6155f06a2c511da6d0bc1a9cd348bf0f9722598cd5.jpeg" },
  salzburg: { name: "Hotel Goldener Hirsch", loc: "Salzburg, Austria", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Hotel_Goldener_Hirsch_Salzburg.jpg/250px-Hotel_Goldener_Hirsch_Salzburg.jpg" },
  seville: { name: "Hotel Alfonso XIII", loc: "Seville, Spain", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Hotel_Alfonso_XIII%2C_Sevilla%2C_Espa%C3%B1a%2C_2015-12-06%2C_DD_80.JPG/330px-Hotel_Alfonso_XIII%2C_Sevilla%2C_Espa%C3%B1a%2C_2015-12-06%2C_DD_80.JPG" },
  siena: { name: "Grand Hotel Continental Siena", loc: "Siena, Italy", image: "https://images.pexels.com/photos/38127108/pexels-photo-38127108.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  sorrento: { name: "Grand Hotel Excelsior Vittoria", loc: "Sorrento, Italy", image: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Excelsior_Vittoria_hotel%2C_Sorrento.jpg" },
  stockholm: { name: "Grand Hôtel Stockholm", loc: "Stockholm, Sweden", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Grand_Hotel_June_2018_01.jpg/330px-Grand_Hotel_June_2018_01.jpg" },
  toulouse: { name: "Hôtel d'Orsay", loc: "Toulouse, France", image: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/partner-images/5f/e6/0389a4600856b2b9f3d1eb3c02d842aff368c5c17be9d60f8d6c0d77ac02.jpeg" },
  turin: { name: "Turin Palace Hotel", loc: "Turin, Italy", image: "https://www.turinpalacehotel.com/wp-content/uploads/2025/02/dscf2986-hdr.jpg" },
  valencia: { name: "Hotel Boutique Balandret", loc: "Valencia, Spain", image: "https://balandret.com/wp-content/uploads/2022/03/Hotel-en-Playa-Valencia.jpg" },
  venice: { name: "Hotel Danieli", loc: "Venice, Italy", image: "https://www.danielihotelinvenice.com/pub/media/72/lux72ex.123582_md.jpg" },
  vienna: { name: "Hotel Sacher Wien", loc: "Vienna, Austria", image: "https://www.sacher.com/en/wp-content/uploads/sites/4/fly-images/10561/hotel-sacher-architektur-wien-80-scaled-1920x9999.jpg.webp" },
  york: { name: "The Grand, York", loc: "York, United Kingdom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Grand_Hotel_%26_Spa%2C_York.jpg/330px-The_Grand_Hotel_%26_Spa%2C_York.jpg" },
  zaragoza: { name: "Hotel Reina Petronila", loc: "Zaragoza, Spain", image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Zaragoza_-_Complejo_Aragonia_-_Hotel_Reina_Petronila_1.jpg" },
  zermatt: { name: "Mont Cervin Palace", loc: "Zermatt, Switzerland", image: "https://www.montcervinpalace.ch/wp-content/uploads/2023/11/winter_mcp-exterior-6-1.jpg" },
  zurich: { name: "Baur au Lac", loc: "Zurich, Switzerland", image: "https://www.bauraulac.ch/upload/rm/ba/ll/bal-lakeside-corner-suite-lounge-area-4.jpg" },
};

// Foto hero real por ciudad de destino (Pexels), evita la misma foto generica en las 174 paginas.
const HERO_PHOTOS = {
  amsterdam: 'https://images.pexels.com/photos/4237160/pexels-photo-4237160.jpeg?auto=compress&cs=tinysrgb&w=1600',
  barcelona: 'https://images.pexels.com/photos/16984552/pexels-photo-16984552.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bergen: 'https://images.pexels.com/photos/6291547/pexels-photo-6291547.jpeg?auto=compress&cs=tinysrgb&w=1600',
  berlin: 'https://images.pexels.com/photos/37120347/pexels-photo-37120347.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bordeaux: 'https://images.pexels.com/photos/32769595/pexels-photo-32769595.jpeg?auto=compress&cs=tinysrgb&w=1600',
  brno: 'https://images.pexels.com/photos/30356381/pexels-photo-30356381.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bruges: 'https://images.pexels.com/photos/5612487/pexels-photo-5612487.jpeg?auto=compress&cs=tinysrgb&w=1600',
  brussels: 'https://images.pexels.com/photos/8290868/pexels-photo-8290868.jpeg?auto=compress&cs=tinysrgb&w=1600',
  budapest: 'https://images.pexels.com/photos/18815996/pexels-photo-18815996.jpeg?auto=compress&cs=tinysrgb&w=1600',
  cambridge: 'https://images.pexels.com/photos/36149240/pexels-photo-36149240.jpeg?auto=compress&cs=tinysrgb&w=1600',
  cologne: 'https://images.pexels.com/photos/31104284/pexels-photo-31104284.jpeg?auto=compress&cs=tinysrgb&w=1600',
  edinburgh: 'https://images.pexels.com/photos/35769512/pexels-photo-35769512.jpeg?auto=compress&cs=tinysrgb&w=1600',
  figueres: 'https://images.pexels.com/photos/33784499/pexels-photo-33784499.jpeg?auto=compress&cs=tinysrgb&w=1600',
  florence: 'https://images.pexels.com/photos/5412528/pexels-photo-5412528.jpeg?auto=compress&cs=tinysrgb&w=1600',
  girona: 'https://images.pexels.com/photos/30166261/pexels-photo-30166261.jpeg?auto=compress&cs=tinysrgb&w=1600',
  hamburg: 'https://images.pexels.com/photos/21815283/pexels-photo-21815283.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interlaken: 'https://images.pexels.com/photos/37995173/pexels-photo-37995173.jpeg?auto=compress&cs=tinysrgb&w=1600',
  krems: 'https://images.pexels.com/photos/32674846/pexels-photo-32674846.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lauterbrunnen: 'https://images.pexels.com/photos/5210151/pexels-photo-5210151.jpeg?auto=compress&cs=tinysrgb&w=1600',
  liverpool: 'https://images.pexels.com/photos/24553792/pexels-photo-24553792.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ljubljana: 'https://images.pexels.com/photos/5565328/pexels-photo-5565328.jpeg?auto=compress&cs=tinysrgb&w=1600',
  london: 'https://images.pexels.com/photos/30029654/pexels-photo-30029654.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lourdes: 'https://images.pexels.com/photos/32848378/pexels-photo-32848378.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lucerne: 'https://images.pexels.com/photos/18429608/pexels-photo-18429608.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lyon: 'https://images.pexels.com/photos/8430273/pexels-photo-8430273.jpeg?auto=compress&cs=tinysrgb&w=1600',
  malaga: 'https://images.pexels.com/photos/17701823/pexels-photo-17701823.jpeg?auto=compress&cs=tinysrgb&w=1600',
  manchester: 'https://images.pexels.com/photos/34760027/pexels-photo-34760027.jpeg?auto=compress&cs=tinysrgb&w=1600',
  milan: 'https://images.pexels.com/photos/15939547/pexels-photo-15939547.jpeg?auto=compress&cs=tinysrgb&w=1600',
  miramas: 'https://images.pexels.com/photos/17683122/pexels-photo-17683122.jpeg?auto=compress&cs=tinysrgb&w=1600',
  monaco: 'https://images.pexels.com/photos/11956743/pexels-photo-11956743.jpeg?auto=compress&cs=tinysrgb&w=1600',
  munich: 'https://images.pexels.com/photos/13762982/pexels-photo-13762982.jpeg?auto=compress&cs=tinysrgb&w=1600',
  naples: 'https://images.pexels.com/photos/9718900/pexels-photo-9718900.jpeg?auto=compress&cs=tinysrgb&w=1600',
  nice: 'https://images.pexels.com/photos/28602943/pexels-photo-28602943.jpeg?auto=compress&cs=tinysrgb&w=1600',
  oslo: 'https://images.pexels.com/photos/20202718/pexels-photo-20202718.jpeg?auto=compress&cs=tinysrgb&w=1600',
  oxford: 'https://images.pexels.com/photos/29889925/pexels-photo-29889925.jpeg?auto=compress&cs=tinysrgb&w=1600',
  paris: 'https://images.pexels.com/photos/31482953/pexels-photo-31482953.jpeg?auto=compress&cs=tinysrgb&w=1600',
  pisa: 'https://images.pexels.com/photos/10733379/pexels-photo-10733379.jpeg?auto=compress&cs=tinysrgb&w=1600',
  porto: 'https://images.pexels.com/photos/10959393/pexels-photo-10959393.jpeg?auto=compress&cs=tinysrgb&w=1600',
  prague: 'https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg?auto=compress&cs=tinysrgb&w=1600',
  rome: 'https://images.pexels.com/photos/27541217/pexels-photo-27541217.jpeg?auto=compress&cs=tinysrgb&w=1600',
  salerno: 'https://images.pexels.com/photos/35873188/pexels-photo-35873188.jpeg?auto=compress&cs=tinysrgb&w=1600',
  salzburg: 'https://images.pexels.com/photos/37861319/pexels-photo-37861319.jpeg?auto=compress&cs=tinysrgb&w=1600',
  seville: 'https://images.pexels.com/photos/13350429/pexels-photo-13350429.jpeg?auto=compress&cs=tinysrgb&w=1600',
  siena: 'https://images.pexels.com/photos/15891009/pexels-photo-15891009.jpeg?auto=compress&cs=tinysrgb&w=1600',
  sorrento: 'https://images.pexels.com/photos/10229029/pexels-photo-10229029.jpeg?auto=compress&cs=tinysrgb&w=1600',
  stockholm: 'https://images.pexels.com/photos/19391718/pexels-photo-19391718.jpeg?auto=compress&cs=tinysrgb&w=1600',
  toulouse: 'https://images.pexels.com/photos/30753285/pexels-photo-30753285.jpeg?auto=compress&cs=tinysrgb&w=1600',
  turin: 'https://images.pexels.com/photos/33040847/pexels-photo-33040847.jpeg?auto=compress&cs=tinysrgb&w=1600',
  valencia: 'https://images.pexels.com/photos/24531674/pexels-photo-24531674.jpeg?auto=compress&cs=tinysrgb&w=1600',
  venice: 'https://images.pexels.com/photos/29487687/pexels-photo-29487687.jpeg?auto=compress&cs=tinysrgb&w=1600',
  vienna: 'https://images.pexels.com/photos/16292000/pexels-photo-16292000.jpeg?auto=compress&cs=tinysrgb&w=1600',
  york: 'https://images.pexels.com/photos/37885386/pexels-photo-37885386.jpeg?auto=compress&cs=tinysrgb&w=1600',
  zaragoza: 'https://images.pexels.com/photos/10430436/pexels-photo-10430436.jpeg?auto=compress&cs=tinysrgb&w=1600',
  zermatt: 'https://images.pexels.com/photos/19244970/pexels-photo-19244970.jpeg?auto=compress&cs=tinysrgb&w=1600',
  zurich: 'https://images.pexels.com/photos/34007139/pexels-photo-34007139.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

// Traduccion de nombres de pais para el badge/lead en ES (evita dejar "France-Italy"
// sin traducir dentro de una frase en espanol). Los pares tipo "France-Italy" se
// dividen por guion y se traduce cada lado.
const COUNTRY_TR = {
  es: { Austria: 'Austria', Belgium: 'Bélgica', Czech: 'Chequia', Denmark: 'Dinamarca', France: 'Francia', Germany: 'Alemania', Hungary: 'Hungría', Italy: 'Italia', Netherlands: 'Países Bajos', Norway: 'Noruega', Portugal: 'Portugal', Slovenia: 'Eslovenia', Spain: 'España', Sweden: 'Suecia', Switzerland: 'Suiza', UK: 'Reino Unido' },
  fr: { Austria: 'Autriche', Belgium: 'Belgique', Czech: 'Tchéquie', Denmark: 'Danemark', France: 'France', Germany: 'Allemagne', Hungary: 'Hongrie', Italy: 'Italie', Netherlands: 'Pays-Bas', Norway: 'Norvège', Portugal: 'Portugal', Slovenia: 'Slovénie', Spain: 'Espagne', Sweden: 'Suède', Switzerland: 'Suisse', UK: 'Royaume-Uni' },
  it: { Austria: 'Austria', Belgium: 'Belgio', Czech: 'Cechia', Denmark: 'Danimarca', France: 'Francia', Germany: 'Germania', Hungary: 'Ungheria', Italy: 'Italia', Netherlands: 'Paesi Bassi', Norway: 'Norvegia', Portugal: 'Portogallo', Slovenia: 'Slovenia', Spain: 'Spagna', Sweden: 'Svezia', Switzerland: 'Svizzera', UK: 'Regno Unito' }
};
function translateCountry(country, lang) {
  const dict = COUNTRY_TR[lang];
  if (!dict) return country;
  return country.split('-').map(c => dict[c] || c).join('-');
}

// Sufijo de URL por idioma. EN es la raíz; el resto va en subcarpeta.
function langSuffix(lang) { return { en: '/', es: '/es/', fr: '/fr/', it: '/it/' }[lang] || '/'; }
// URL canónica (self-referencing) por idioma — cada página apunta a sí misma.
function canonicalUrl(slug, lang) { return `https://glosx.app/rutas/${slug}${langSuffix(lang)}`; }
// Selector de idioma en el nav: links a los OTROS 3 idiomas.
const LANG_LABELS = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT' };
function langSwitchLinks(slug, current) {
  return ['en', 'es', 'fr', 'it'].filter(l => l !== current)
    .map(l => `<a href="/rutas/${slug}${langSuffix(l)}" class="lang">${LANG_LABELS[l]}</a>`).join(' ');
}
// Etiquetas localizadas para el breadcrumb (Home / Rutas).
const BREADCRUMB = {
  en: { home: 'Home', routes: 'Routes' }, es: { home: 'Inicio', routes: 'Rutas' },
  fr: { home: 'Accueil', routes: 'Itinéraires' }, it: { home: 'Home', routes: 'Percorsi' }
};

// Language-specific content
const content = {
  en: {
    titleTemplate: (from, to) => `Train from ${from} to ${to} (2026) | Schedules & Cheap Tickets - WoW Train`,
    descriptionTemplate: (from, to) => `Find the cheapest train fares, official schedules, and operator comparisons for ${from} to ${to}. Book safely in your currency.`,
    ogTitleTemplate: (from, to) => `${from} to ${to} by Train: 2026 Guide`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} by train — route, stations, operators and how to book it.`,
    twitterTitleTemplate: (from, to) => `${from} to ${to} by Train: 2026 Guide`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} by train — route, stations, operators and how to book it.`,
    langSwitch: '<a href="/rutas/{{routeSlug}}/es/" class="lang">ES</a>',
    backText: 'All routes',
    badgeLabel: 'Route guide',
    mainTitle: '{{from}} to {{to}} by Train',
    metaText: 'By WoW Train · Updated July 2026 · 4 min read',
    leadText: '{{operator}} links {{from}} to {{to}} in around {{duration}}, with comfortable services running through the {{country}} countryside.',
    klookTitle: 'Book <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> on Klook',
    klookSubtitle: '{{operator}} · {{duration}} · from {{price}} · free cancellation on select fares',
    klookBtnLabel: 'Book Ticket',
    checkSchedulesText: 'Check schedules & book →',
    opensNewTabText: 'Opens in a new tab — come back here anytime.',
    howLongTitle: 'How long is the train from {{from}} to {{to}}?',
    howLongText: 'The fastest trains take around {{duration}}, with several departures a day. Check the live schedule for your date.',
    whoRunsTitle: 'Which trains run from {{from}} to {{to}}?',
    whoRunsText: 'The route is run by {{operator}}. Comparing the day\'s departures in one search finds the best time and fare.',
    priceTitle: '{{from}} to {{to}} train price (2026)',
    priceText: 'Advance fares start from around {{price}}, rising as the date approaches.',
    hotelSectionTitle: 'Where to stay',
    bestFareTitle: 'How to get the best fare',
    bestFareList: [
      '<strong>Book early.</strong> The cheapest saver fares sell out first — booking ahead can be dramatically cheaper than buying on the day.',
      '<strong>Travel off-peak.</strong> Mid-morning and mid-week departures tend to be quieter and cheaper.',
      '<strong>Consider first class</strong> — on many routes the upgrade is modest and very comfortable.',
      '<strong>Compare in one place</strong> to see every departure at a glance.'
    ],
    readyText: 'Ready to go? Check live {{from}} → {{to}} times and fares and book your seat — secure checkout, mobile tickets, every operator in one search.',
    compareText: 'Prefer to compare every rail operator?',
    moreRoutesTitle: 'More European train routes',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Duration: {{duration}}',
    trainSegmentOperator: 'Operator: {{operator}}',
    trainSegmentStation: 'Station: {{station}}',
    bookTicketBtn: 'View schedules and book ticket →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'View current price →',
    economicLink: 'View economic options',
    transferLink: 'Book private transfer in {{to}} →',
    faqHeading: 'Frequently asked questions',
    faq: [
      { q: 'How long is the train from {{from}} to {{to}}?', a: 'The fastest trains from {{from}} to {{to}} take around {{duration}}, with several departures throughout the day.' },
      { q: 'How much does the {{from}} to {{to}} train cost?', a: 'Advance fares for the {{from}} to {{to}} train start from around {{price}} and rise as the travel date approaches, so booking early usually gets the cheapest ticket.' },
      { q: 'Which train companies operate the {{from}} to {{to}} route?', a: 'The {{from}} to {{to}} route is operated by {{operator}}. Comparing the day\'s departures in one search finds the best time and fare.' },
      { q: 'Is there a direct train from {{from}} to {{to}}?', a: '{{operator}} runs services between {{from}} and {{to}} — check the live schedule for your date to see direct trains and any connections.' },
      { q: 'When is the cheapest time to book {{from}} to {{to}} train tickets?', a: 'The cheapest {{from}} to {{to}} fares are usually released a few weeks to a few months ahead and sell out first, so booking early and travelling mid-week or off-peak gets the best price.' }
    ]
  },
  es: {
    titleTemplate: (from, to) => `Tren ${from} a ${to} (2026) | Horarios y Billetes Baratos - WoW Train`,
    descriptionTemplate: (from, to) => `Encuentra las tarifas de tren más baratas, horarios oficiales y comparaciones de operadores para ${from} a ${to}. Reserva de forma segura en tu moneda.`,
    ogTitleTemplate: (from, to) => `${from} a ${to} en Tren: Guía 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} en tren — ruta, estaciones, operadores y cómo reservarlo.`,
    twitterTitleTemplate: (from, to) => `${from} a ${to} en Tren: Guía 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} en tren — ruta, estaciones, operadores y cómo reservarlo.`,
    langSwitch: '<a href="/rutas/{{routeSlug}}/" class="lang">EN</a>',
    backText: 'Todas las rutas',
    badgeLabel: 'Guía de ruta',
    mainTitle: 'Tren de {{from}} a {{to}}',
    metaText: 'Por WoW Train · Actualizado julio 2026 · 4 min de lectura',
    leadText: '{{operator}} conecta {{from}} con {{to}} en alrededor de {{duration}}, con servicios cómodos que recorren el campo de {{country}}.',
    klookTitle: 'Reserva <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> en Klook',
    klookSubtitle: '{{operator}} · {{duration}} · desde {{price}} · cancelación gratis en tarifas seleccionadas',
    klookBtnLabel: 'Reservar',
    checkSchedulesText: 'Ver horarios y reservar →',
    opensNewTabText: 'Se abre en una nueva pestaña — vuelve aquí cuando quieras.',
    howLongTitle: '¿Cuánto dura el tren de {{from}} a {{to}}?',
    howLongText: 'Los trenes más rápidos tardan alrededor de {{duration}}, con varias salidas al día. Consulta el horario en vivo para tu fecha.',
    whoRunsTitle: '¿Qué trenes van de {{from}} a {{to}}?',
    whoRunsText: 'La ruta es operada por {{operator}}. Comparando las salidas del día en una sola búsqueda encuentras el mejor horario y tarifa.',
    priceTitle: 'Precio del tren {{from}} a {{to}} (2026)',
    priceText: 'Las tarifas anticipadas comienzan desde {{price}}, aumentando a medida que se acerca la fecha.',
    hotelSectionTitle: 'Dónde alojarte',
    bestFareTitle: 'Cómo conseguir la mejor tarifa',
    bestFareList: [
      '<strong>Reserva con antelación.</strong> Las tarifas más baratas se agotan primero — reservar con anticipación puede ser mucho más barato que comprar el mismo día.',
      '<strong>Viaja fuera de horas punta.</strong> Las salidas de media mañana y mediados de semana tienden a ser más tranquilas y baratas.',
      '<strong>Considera primera clase</strong> — en muchas rutas la actualización es modesta y muy cómoda.',
      '<strong>Compara en un solo lugar</strong> para ver cada salida de un vistazo.'
    ],
    readyText: '¿Listo para ir? Consulta los horarios y tarifas en vivo de {{from}} → {{to}} y reserva tu asiento — pago seguro, billetes móviles, cada operador en una sola búsqueda.',
    compareText: '¿Prefieres comparar cada operador ferroviario?',
    moreRoutesTitle: 'Más rutas de tren europeas',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Duración: {{duration}}',
    trainSegmentOperator: 'Operador: {{operator}}',
    trainSegmentStation: 'Estación: {{station}}',
    bookTicketBtn: 'Ver horarios y reservar billete →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'Ver precio actual →',
    economicLink: 'Ver opciones económicas',
    transferLink: 'Reservar traslado privado en {{to}} →',
    faqHeading: 'Preguntas frecuentes',
    faq: [
      { q: '¿Cuánto dura el tren de {{from}} a {{to}}?', a: 'Los trenes más rápidos de {{from}} a {{to}} tardan alrededor de {{duration}}, con varias salidas a lo largo del día.' },
      { q: '¿Cuánto cuesta el tren de {{from}} a {{to}}?', a: 'Las tarifas anticipadas del tren de {{from}} a {{to}} comienzan desde {{price}} y aumentan a medida que se acerca la fecha, así que reservar con antelación suele conseguir el billete más barato.' },
      { q: '¿Qué compañías operan la ruta de {{from}} a {{to}}?', a: 'La ruta de {{from}} a {{to}} es operada por {{operator}}. Comparar las salidas del día en una sola búsqueda encuentra el mejor horario y tarifa.' },
      { q: '¿Hay tren directo de {{from}} a {{to}}?', a: '{{operator}} opera servicios entre {{from}} y {{to}} — consulta el horario en vivo para tu fecha y verás los trenes directos y las conexiones.' },
      { q: '¿Cuándo es más barato reservar los billetes de tren de {{from}} a {{to}}?', a: 'Las tarifas más baratas de {{from}} a {{to}} suelen salir con semanas o meses de antelación y se agotan primero, así que reservar temprano y viajar entre semana o fuera de horas punta consigue el mejor precio.' }
    ]
  },
  fr: {
    titleTemplate: (from, to) => `Train de ${from} à ${to} (2026) | Horaires et Billets Pas Chers - WoW Train`,
    descriptionTemplate: (from, to) => `Trouvez les tarifs de train les moins chers, les horaires officiels et une comparaison des opérateurs pour ${from} → ${to}. Réservation sécurisée dans votre monnaie.`,
    ogTitleTemplate: (from, to) => `${from} à ${to} en Train : Guide 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} en train — itinéraire, gares, opérateurs et comment réserver.`,
    twitterTitleTemplate: (from, to) => `${from} à ${to} en Train : Guide 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} en train — itinéraire, gares, opérateurs et comment réserver.`,
    backText: 'Tous les itinéraires',
    badgeLabel: 'Guide d\'itinéraire',
    mainTitle: 'Train de {{from}} à {{to}}',
    metaText: 'Par WoW Train · Mis à jour en juillet 2026 · 4 min de lecture',
    leadText: '{{operator}} relie {{from}} à {{to}} en environ {{duration}}, avec des services confortables qui traversent la campagne de {{country}}.',
    klookTitle: 'Réservez <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> sur Klook',
    klookSubtitle: '{{operator}} · {{duration}} · à partir de {{price}} · annulation gratuite sur tarifs sélectionnés',
    klookBtnLabel: 'Réserver',
    checkSchedulesText: 'Voir horaires et réserver →',
    opensNewTabText: 'S\'ouvre dans un nouvel onglet — revenez ici quand vous voulez.',
    howLongTitle: 'Combien de temps dure le train de {{from}} à {{to}} ?',
    howLongText: 'Les trains les plus rapides mettent environ {{duration}}, avec plusieurs départs par jour. Consultez les horaires en direct pour votre date.',
    whoRunsTitle: 'Quels trains circulent de {{from}} à {{to}} ?',
    whoRunsText: 'L\'itinéraire est assuré par {{operator}}. Comparer les départs de la journée en une seule recherche vous donne le meilleur horaire et tarif.',
    priceTitle: 'Prix du train {{from}} à {{to}} (2026)',
    priceText: 'Les tarifs anticipés commencent autour de {{price}} et augmentent à l\'approche de la date.',
    hotelSectionTitle: 'Où loger',
    bestFareTitle: 'Comment obtenir le meilleur tarif',
    bestFareList: [
      '<strong>Réservez tôt.</strong> Les tarifs les moins chers partent en premier — réserver à l\'avance peut être bien moins cher que le jour même.',
      '<strong>Voyagez en heures creuses.</strong> Les départs en milieu de matinée et en milieu de semaine sont souvent plus calmes et moins chers.',
      '<strong>Pensez à la première classe</strong> — sur de nombreux trajets le surclassement est modeste et très confortable.',
      '<strong>Comparez au même endroit</strong> pour voir tous les départs d\'un coup d\'œil.'
    ],
    readyText: 'Prêt à partir ? Consultez les horaires et tarifs en direct de {{from}} → {{to}} et réservez votre place — paiement sécurisé, billets mobiles, tous les opérateurs en une recherche.',
    compareText: 'Vous préférez comparer tous les opérateurs ferroviaires ?',
    moreRoutesTitle: 'Plus d\'itinéraires de train en Europe',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Durée : {{duration}}',
    trainSegmentOperator: 'Opérateur : {{operator}}',
    trainSegmentStation: 'Gare : {{station}}',
    bookTicketBtn: 'Voir horaires et réserver →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'Voir le prix actuel →',
    economicLink: 'Voir les options économiques',
    transferLink: 'Réserver un transfert privé à {{to}} →',
    faqHeading: 'Questions fréquentes',
    faq: [
      { q: 'Combien de temps dure le train de {{from}} à {{to}} ?', a: 'Les trains les plus rapides de {{from}} à {{to}} mettent environ {{duration}}, avec plusieurs départs tout au long de la journée.' },
      { q: 'Combien coûte le train de {{from}} à {{to}} ?', a: 'Les tarifs anticipés du train {{from}} → {{to}} commencent autour de {{price}} et augmentent à l\'approche de la date, donc réserver tôt permet généralement d\'obtenir le billet le moins cher.' },
      { q: 'Quelles compagnies exploitent la ligne {{from}} → {{to}} ?', a: 'La ligne {{from}} → {{to}} est exploitée par {{operator}}. Comparer les départs du jour en une seule recherche donne le meilleur horaire et tarif.' },
      { q: 'Y a-t-il un train direct de {{from}} à {{to}} ?', a: '{{operator}} assure des services entre {{from}} et {{to}} — consultez les horaires en direct pour votre date afin de voir les trains directs et les correspondances.' },
      { q: 'Quand est-il le moins cher de réserver les billets de train {{from}} → {{to}} ?', a: 'Les tarifs les moins chers de {{from}} → {{to}} sortent généralement quelques semaines à quelques mois à l\'avance et partent en premier, donc réserver tôt et voyager en milieu de semaine ou en heures creuses donne le meilleur prix.' }
    ]
  },
  it: {
    titleTemplate: (from, to) => `Treno da ${from} a ${to} (2026) | Orari e Biglietti Economici - WoW Train`,
    descriptionTemplate: (from, to) => `Trova le tariffe ferroviarie più economiche, gli orari ufficiali e il confronto tra operatori per ${from} → ${to}. Prenotazione sicura nella tua valuta.`,
    ogTitleTemplate: (from, to) => `${from} a ${to} in Treno: Guida 2026`,
    ogDescriptionTemplate: (from, to) => `${from} → ${to} in treno — percorso, stazioni, operatori e come prenotare.`,
    twitterTitleTemplate: (from, to) => `${from} a ${to} in Treno: Guida 2026`,
    twitterDescriptionTemplate: (from, to) => `${from} → ${to} in treno — percorso, stazioni, operatori e come prenotare.`,
    backText: 'Tutti i percorsi',
    badgeLabel: 'Guida al percorso',
    mainTitle: 'Treno da {{from}} a {{to}}',
    metaText: 'Di WoW Train · Aggiornato a luglio 2026 · 4 min di lettura',
    leadText: '{{operator}} collega {{from}} a {{to}} in circa {{duration}}, con servizi comodi che attraversano le campagne di {{country}}.',
    klookTitle: 'Prenota <span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span> su Klook',
    klookSubtitle: '{{operator}} · {{duration}} · da {{price}} · cancellazione gratuita su tariffe selezionate',
    klookBtnLabel: 'Prenota',
    checkSchedulesText: 'Vedi orari e prenota →',
    opensNewTabText: 'Si apre in una nuova scheda — torna qui quando vuoi.',
    howLongTitle: 'Quanto dura il treno da {{from}} a {{to}}?',
    howLongText: 'I treni più veloci impiegano circa {{duration}}, con diverse partenze al giorno. Controlla gli orari in tempo reale per la tua data.',
    whoRunsTitle: 'Quali treni collegano {{from}} a {{to}}?',
    whoRunsText: 'Il percorso è gestito da {{operator}}. Confrontare le partenze del giorno in un\'unica ricerca ti dà l\'orario e la tariffa migliori.',
    priceTitle: 'Prezzo del treno {{from}} a {{to}} (2026)',
    priceText: 'Le tariffe anticipate partono da circa {{price}} e aumentano con l\'avvicinarsi della data.',
    hotelSectionTitle: 'Dove alloggiare',
    bestFareTitle: 'Come ottenere la tariffa migliore',
    bestFareList: [
      '<strong>Prenota in anticipo.</strong> Le tariffe più economiche si esauriscono per prime — prenotare in anticipo può essere molto più conveniente che comprare in giornata.',
      '<strong>Viaggia in orari non di punta.</strong> Le partenze a metà mattina e a metà settimana tendono a essere più tranquille ed economiche.',
      '<strong>Valuta la prima classe</strong> — su molti percorsi il supplemento è modesto e molto comodo.',
      '<strong>Confronta in un unico posto</strong> per vedere ogni partenza a colpo d\'occhio.'
    ],
    readyText: 'Pronto a partire? Controlla orari e tariffe in tempo reale di {{from}} → {{to}} e prenota il tuo posto — pagamento sicuro, biglietti su mobile, ogni operatore in un\'unica ricerca.',
    compareText: 'Preferisci confrontare tutti gli operatori ferroviari?',
    moreRoutesTitle: 'Altri percorsi ferroviari in Europa',
    trainSegmentTitle: '{{from}} → {{to}}',
    trainSegmentDuration: 'Durata: {{duration}}',
    trainSegmentOperator: 'Operatore: {{operator}}',
    trainSegmentStation: 'Stazione: {{station}}',
    bookTicketBtn: 'Vedi orari e prenota biglietto →',
    hotelCardName: '{{hotelName}}',
    hotelCardLocation: '{{hotelLocation}}',
    hotelCardPrice: 'Vedi prezzo attuale →',
    economicLink: 'Vedi opzioni economiche',
    transferLink: 'Prenota un transfer privato a {{to}} →',
    faqHeading: 'Domande frequenti',
    faq: [
      { q: 'Quanto dura il treno da {{from}} a {{to}}?', a: 'I treni più veloci da {{from}} a {{to}} impiegano circa {{duration}}, con diverse partenze durante la giornata.' },
      { q: 'Quanto costa il treno da {{from}} a {{to}}?', a: 'Le tariffe anticipate del treno {{from}} → {{to}} partono da circa {{price}} e aumentano con l\'avvicinarsi della data, quindi prenotare in anticipo di solito permette di avere il biglietto più economico.' },
      { q: 'Quali compagnie operano la tratta {{from}} → {{to}}?', a: 'La tratta {{from}} → {{to}} è operata da {{operator}}. Confrontare le partenze del giorno in un\'unica ricerca dà l\'orario e la tariffa migliori.' },
      { q: 'C\'è un treno diretto da {{from}} a {{to}}?', a: '{{operator}} opera servizi tra {{from}} e {{to}} — controlla gli orari in tempo reale per la tua data per vedere i treni diretti e le coincidenze.' },
      { q: 'Quando conviene di più prenotare i biglietti del treno {{from}} → {{to}}?', a: 'Le tariffe più economiche di {{from}} → {{to}} escono di solito da qualche settimana a qualche mese prima e si esauriscono per prime, quindi prenotare in anticipo e viaggiare a metà settimana o in orari non di punta dà il prezzo migliore.' }
    ]
  }
};

// Generate train segments HTML
function generateTrainSegments(route, lang) {
  const langContent = content[lang];
  const segments = [
    {
      from: route.from,
      to: route.to,
      duration: route.duration,
      operator: route.operator,
      station: `${route.from} Station`
    }
  ];
  
  return segments.map(seg => `
    <div class="train-segment">
      <div class="train-segment-header">
        <span class="train-segment-title">${seg.from} → ${seg.to}</span>
        <span class="train-segment-duration">${langContent.trainSegmentDuration.replace('{{duration}}', seg.duration)}</span>
      </div>
      <div class="train-segment-details">
        <div class="train-segment-detail"><strong>Operator:</strong> ${seg.operator}</div>
        <div class="train-segment-detail"><strong>Station:</strong> ${seg.station}</div>
      </div>
      <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${seg.from.toLowerCase()}&to=${seg.to.toLowerCase()}" 
         class="cta-btn" target="_blank" rel="noopener sponsored"
         onclick="trackTrainline('route_${route.slug}_${lang}')">
        ${langContent.bookTicketBtn}
      </a>
    </div>
  `).join('');
}

// Generate hotel cards HTML
function generateHotelCards(route, lang) {
  const langContent = content[lang];
  const curated = REAL_HOTELS[route.to.toLowerCase()];
  const hotels = [
    curated
      ? { name: curated.name, location: curated.loc, image: curated.image }
      : {
          name: `${route.to} Grand Hotel`,
          location: `${route.to}, ${route.country}`,
          image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500'
        }
  ];
  
  return hotels.map(hotel => `
    <div class="hotel-card">
      <div class="hotel-card-header">
        <img class="hotel-card-image" src="${hotel.image}" alt="${hotel.name}" loading="lazy">
        <div class="hotel-card-info">
          <div class="hotel-card-name">${hotel.name}</div>
          <div class="hotel-card-location">${hotel.location}</div>
        </div>
      </div>
      <div class="hotel-card-actions">
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-hotel?city=${route.to.toLowerCase()}" 
           class="cta-btn" target="_blank" rel="noopener sponsored"
           onclick="trackTrainline('hotel_${route.slug}_${lang}')">
          ${langContent.hotelCardPrice}
        </a>
        <br>
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/klook-hotel?city=${route.to.toLowerCase()}" 
           class="economic-link" target="_blank" rel="noopener sponsored">
          ${langContent.economicLink}
        </a>
        <br>
        <a href="https://voxa-production-dc15.up.railway.app/affiliate/kiwitaxi"
           class="transfer-link" target="_blank" rel="noopener sponsored">
          ${langContent.transferLink.replace('{{to}}', route.to)}
        </a>
      </div>
    </div>
  `).join('');
}

// Generate price table HTML
function generatePriceTable(route, lang) {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0 8px;font-size:14px;">
      <thead><tr style="border-bottom:1px solid rgba(255,255,255,0.12);text-align:left;">
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">Operator</th>
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">From</th>
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">Journey time</th>
        <th style="padding:8px 12px;color:#a78bfa;font-weight:700;">Frequency</th>
      </tr></thead>
      <tbody>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
          <td style="padding:8px 12px;">${route.operator}</td>
          <td style="padding:8px 12px;">${route.price}</td>
          <td style="padding:8px 12px;">${route.duration}</td>
          <td style="padding:8px 12px;">Several daily</td>
        </tr>
      </tbody>
    </table>
    <p style="font-size:13px;color:#8888aa;margin-bottom:16px;">Prices are indicative advance fares. Check live availability for your exact date.</p>
  `;
}

// Generate photos HTML
function generatePhotos(route) {
  return `
    <img src="https://images.pexels.com/photos/30753243/pexels-photo-30753243.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=500" alt="Scenic view of ${route.to}" loading="lazy" />
    <img src="https://images.pexels.com/photos/30753285/pexels-photo-30753285.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=500" alt="Charming view of ${route.to}" loading="lazy" />
    <img src="https://images.pexels.com/photos/13393083/pexels-photo-13393083.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=500" alt="Historic buildings in ${route.to}" loading="lazy" />
  `;
}

// Generate related routes
function generateRelatedRoutes(route, lang) {
  const related = routes.slice(0, 4).filter(r => r.slug !== route.slug);
  const suffix = langSuffix(lang);
  return related.map(r => `
    <a href="/rutas/${r.slug}${suffix}" class="related-link">${r.from} &rarr; ${r.to}</a>
  `).join('');
}

// Reemplaza todos los tokens {{...}} de un string con los datos de la ruta.
// (usa reemplazo global, a diferencia de .replace() que solo cambia el primero)
function fillTokens(str, route, lang) {
  return str
    .replace(/\{\{from\}\}/g, route.from)
    .replace(/\{\{to\}\}/g, route.to)
    .replace(/\{\{duration\}\}/g, route.duration)
    .replace(/\{\{operator\}\}/g, route.operator)
    .replace(/\{\{price\}\}/g, route.price)
    .replace(/\{\{country\}\}/g, translateCountry(route.country, lang));
}

// FAQ visible (h3 pregunta + p respuesta, siempre en el DOM para que Google lo
// lea; sin JS ni contenido oculto). Apunta a las busquedas de cola larga.
function generateFAQ(route, lang) {
  const langContent = content[lang];
  const items = langContent.faq.map(item => `
      <div class="faq-item">
        <h3 class="faq-q">${fillTokens(item.q, route, lang)}</h3>
        <p class="faq-a">${fillTokens(item.a, route, lang)}</p>
      </div>`).join('');
  return `
    <section class="faq">
      <h2>${langContent.faqHeading}</h2>${items}
    </section>`;
}

// Datos estructurados JSON-LD: BreadcrumbList + FAQPage + Article. Le da a Google
// las preguntas para rich snippets y ayuda a entender/rankear la pagina.
function generateSchema(route, lang) {
  const langContent = content[lang];
  const url = canonicalUrl(route.slug, lang);
  const bc = BREADCRUMB[lang] || BREADCRUMB.en;
  const routeName = fillTokens(langContent.mainTitle, route, lang);
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: bc.home, item: 'https://glosx.app/' },
        { '@type': 'ListItem', position: 2, name: bc.routes, item: 'https://glosx.app/explore/' },
        { '@type': 'ListItem', position: 3, name: routeName, item: url }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: langContent.faq.map(item => ({
        '@type': 'Question',
        name: fillTokens(item.q, route, lang),
        acceptedAnswer: { '@type': 'Answer', text: fillTokens(item.a, route, lang) }
      }))
    },
    {
      '@type': 'Article',
      headline: langContent.ogTitleTemplate(route.from, route.to),
      description: langContent.descriptionTemplate(route.from, route.to),
      image: HERO_PHOTOS[route.to.toLowerCase()] || 'https://glosx.app/hero-bg.jpg',
      datePublished: '2026-07-01',
      dateModified: '2026-07-25',
      author: { '@type': 'Organization', name: 'WoW Train', url: 'https://glosx.app/' },
      publisher: { '@type': 'Organization', name: 'WoW Train', logo: { '@type': 'ImageObject', url: 'https://glosx.app/logo.png' } },
      mainEntityOfPage: url,
      inLanguage: lang
    }
  ];
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  return `<script type="application/ld+json">${json}</script>`;
}

// Replace template variables
function replaceTemplate(template, route, lang) {
  const langContent = content[lang];
  const replacements = {
    '{{lang}}': lang,
    '{{routeSlug}}': route.slug,
    '{{canonical}}': canonicalUrl(route.slug, lang),
    '{{title}}': langContent.titleTemplate(route.from, route.to),
    '{{description}}': langContent.descriptionTemplate(route.from, route.to),
    '{{ogTitle}}': langContent.ogTitleTemplate(route.from, route.to),
    '{{ogDescription}}': langContent.ogDescriptionTemplate(route.from, route.to),
    '{{twitterTitle}}': langContent.twitterTitleTemplate(route.from, route.to),
    '{{twitterDescription}}': langContent.twitterDescriptionTemplate(route.from, route.to),
    '{{langSwitch}}': langSwitchLinks(route.slug, lang),
    '{{backText}}': langContent.backText,
    '{{badge}}': `${langContent.badgeLabel} · ${translateCountry(route.country, lang)}`,
    '{{mainTitle}}': langContent.mainTitle.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{metaText}}': langContent.metaText,
    '{{leadText}}': langContent.leadText.replace('{{operator}}', route.operator).replace('{{from}}', route.from).replace('{{to}}', route.to).replace('{{duration}}', route.duration).replace('{{country}}', translateCountry(route.country, lang)),
    '{{heroImage}}': HERO_PHOTOS[route.to.toLowerCase()] || 'https://images.pexels.com/photos/30753262/pexels-photo-30753262.jpeg?auto=compress&cs=tinysrgb&w=1600',
    '{{klookTitle}}': fillTokens(langContent.klookTitle, route, lang),
    '{{klookSubtitle}}': fillTokens(langContent.klookSubtitle, route, lang),
    '{{klookBtnLabel}}': langContent.klookBtnLabel,
    '{{klookTrainUrl}}': `https://voxa-production-dc15.up.railway.app/affiliate/klook-train?from=${route.from.toLowerCase()}&to=${route.to.toLowerCase()}`,
    '{{trainSegments}}': generateTrainSegments(route, lang),
    '{{hotelSectionTitle}}': langContent.hotelSectionTitle,
    '{{hotelCards}}': generateHotelCards(route, lang),
    '{{howLongTitle}}': fillTokens(langContent.howLongTitle, route, lang),
    '{{howLongText}}': langContent.howLongText.replace('{{duration}}', route.duration),
    '{{whoRunsTitle}}': fillTokens(langContent.whoRunsTitle, route, lang),
    '{{whoRunsText}}': langContent.whoRunsText.replace('{{operator}}', route.operator),
    '{{priceTitle}}': langContent.priceTitle.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{priceText}}': langContent.priceText.replace('{{price}}', route.price),
    '{{priceTable}}': generatePriceTable(route, lang),
    '{{bestFareTitle}}': langContent.bestFareTitle,
    '{{bestFareList}}': langContent.bestFareList.map(item => `<li>${item}</li>`).join('\n      '),
    '{{readyText}}': langContent.readyText.replace('{{from}}', route.from).replace('{{to}}', route.to),
    '{{compareText}}': langContent.compareText,
    '{{checkSchedulesText}}': langContent.checkSchedulesText,
    '{{opensNewTabText}}': langContent.opensNewTabText,
    '{{photos}}': generatePhotos(route),
    '{{moreRoutesTitle}}': langContent.moreRoutesTitle,
    '{{relatedRoutes}}': generateRelatedRoutes(route, lang),
    '{{faqSection}}': generateFAQ(route, lang),
    '{{schema}}': generateSchema(route, lang)
  };
  
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  return result;
}

// Read template
const templatePath = path.join(__dirname, 'route-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Generate routes
const outputDir = path.join(__dirname, '../rutas');

const LANGS = ['en', 'es', 'fr', 'it'];
routes.forEach(route => {
  // EN va en la raíz (/rutas/slug/); el resto en subcarpeta (/rutas/slug/{lang}/)
  LANGS.forEach(lang => {
    const dir = lang === 'en' ? path.join(outputDir, route.slug) : path.join(outputDir, route.slug, lang);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), replaceTemplate(template, route, lang));
  });
  console.log(`Generated ${route.slug} (EN/ES/FR/IT)`);
});

console.log('All routes generated successfully!');
