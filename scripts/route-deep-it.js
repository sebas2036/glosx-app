/** Contenuti approfonditi dei percorsi (italiano). Stessi campi di route-deep-content*.js. */
module.exports = {
  ui: {
    stations: 'Stazioni: da dove parti e dove arrivi',
    times: (f, t) => `${f} – ${t}: orari e frequenza dei treni`,
    tickets: 'Biglietti e tariffe: quanto paghi davvero',
    th: ['Biglietto', 'Cosa significa', 'Livello indicativo'],
    note: 'Le tariffe sono indicative e cambiano in base a data, orario e anticipo della prenotazione. La ricerca in tempo reale mostra il prezzo esatto del tuo viaggio.',
    when: 'Il momento migliore per viaggiare',
    arrival: (t) => `Cosa fare arrivando a ${t}`,
    alt: (f, t) => `Altri modi per andare da ${f} a ${t}`,
    related: 'Percorsi correlati', moreLondon: 'Altri treni da Londra'
  },
  deep: {
    'london-liverpool': {
      stations: [
        '<strong>London Euston</strong> è il capolinea londinese della West Coast Main Line. È collegata alle linee Northern e Victoria della metropolitana, e King’s Cross St Pancras dista circa 15–20 minuti a piedi.',
        '<strong>Liverpool Lime Street</strong> si trova in pieno centro, di fronte allo St George’s Hall, con i treni Merseyrail sotto la stazione. Il lungomare e l’Albert Dock sono a circa 20–25 minuti a piedi, o a un breve tragitto in autobus o taxi.'
      ],
      times: 'I servizi più veloci impiegano circa 2 h 10 min–2 h 30 min, con partenze circa ogni ora o più frequenti durante la giornata e treni extra nelle ore di punta. Non tutti i treni fermano nelle stesse stazioni: tra le fermate intermedie più comuni ci sono Milton Keynes Central, Crewe o Runcorn e Liverpool South Parkway, e il treno con meno fermate è di solito il più rapido. Controlla sempre la partenza scelta, perché la durata varia di qualche minuto da un servizio all’altro.',
      ticketsIntro: 'Avanti West Coast gestisce i treni diretti, quindi quello che paghi dipende dal tipo di biglietto e non dalla scelta dell’operatore:',
      tickets: [
        ['Advance (anticipato)', 'Un treno preciso, di solito senza cambi', 'Il più economico. Le corse singole indicative sono spesso tra 20 e 40 £ se prenoti presto, e si esauriscono per prime.'],
        ['Off-Peak (fuori punta)', 'Qualsiasi treno fuori punta nel giorno', 'Prezzo intermedio; conveniente se eviti la punta del mattino.'],
        ['Anytime (flessibile)', 'Qualsiasi treno, a qualsiasi ora', 'Il più flessibile e il più caro; una corsa singola può superare le 100 £.']
      ],
      ticketTips: [
        'Una <strong>Railcard</strong> (16–25, 26–30, Two Together, Senior, Family &amp; Friends) toglie di solito circa un terzo sulla maggior parte delle tariffe, compresi molti biglietti Advance.',
        'Prenota appena escono le tariffe per la tua data. I biglietti Advance più economici sono limitati e salgono di prezzo man mano che il treno si riempie.',
        'Confronta la stessa partenza del mattino in giorni diversi: spostare il viaggio da un venerdì a un martedì fa spesso risparmiare più di qualsiasi altro trucco.'
      ],
      when: 'Evita i venerdì pomeriggio, le domeniche sera e i giorni di partita ad Anfield o a Goodison, quando treni e tariffe sono al massimo. Le partenze a metà mattina fuori dalle vacanze scolastiche sono di solito più economiche e tranquille. Se devi lavorare a bordo, chiedi un posto al tavolo; la linea ha prese di corrente e wifi sulla maggior parte dei treni.',
      arrivalIntro: 'Andata e ritorno sommano oltre quattro ore e mezza di treno: un’escursione in giornata è possibile ma stretta, e dormire una notte è molto più comodo. Da vedere vicino a Lime Street:',
      arrival: [
        '<strong>Albert Dock e Pier Head</strong> — i moli restaurati, le Tre Grazie sul lungomare, musei e The Beatles Story.',
        '<strong>La cattedrale anglicana e la cattedrale metropolitana</strong> — due cattedrali molto diverse, a pochi passi l’una dall’altra.',
        '<strong>Il Cavern Quarter</strong> — Mathew Street e i locali musicali legati alla storia dei Beatles.',
        '<strong>Baltic Triangle e Georgian Quarter</strong> — caffè indipendenti, street art e alcune delle strade più piacevoli della città.'
      ],
      alt: [
        '<strong>Pullman</strong> — i servizi da London Victoria impiegano circa cinque o sei ore; più economici ma molto più lenti.',
        '<strong>Auto</strong> — circa quattro o cinque ore a seconda del traffico su M1 e M6, più il parcheggio in centro.',
        '<strong>Aereo</strong> — poco pratico per questa coppia una volta aggiunti trasferimenti e controlli di sicurezza; il treno va da centro a centro.'
      ]
    },
    'london-oxford': {
      stations: [
        '<strong>London Paddington</strong> (Great Western Railway) e <strong>London Marylebone</strong> (Chiltern Railways) sono le due principali stazioni di partenza. Paddington è sulle linee Bakerloo, Circle, District, Hammersmith &amp; City ed Elizabeth.',
        '<strong>La stazione di Oxford</strong> si trova sul lato ovest del centro, a circa 10–15 minuti a piedi dai luoghi principali, con autobus e taxi frequenti all’uscita.'
      ],
      times: 'I treni GWR da Paddington sono i più veloci: circa un’ora con un servizio rapido, con più partenze all’ora. I treni Chiltern da Marylebone impiegano un po’ di più (circa un’ora e un quarto) ma fermano a High Wycombe e a Bicester Village, utile se vai all’outlet. Alcuni servizi sono treni con più fermate e più lenti; controlla quindi la durata della partenza scelta.',
      ticketsIntro: 'È un percorso breve e molto frequente, quindi la maggior parte dei viaggiatori compra biglietti Off-Peak o Anytime invece di tariffe Advance:',
      tickets: [
        ['Advance (anticipato)', 'Un treno preciso', 'Disponibilità limitata su un percorso breve; verifica se ce n’è uno per la tua data.'],
        ['Off-Peak (fuori punta)', 'Treni fuori punta nel giorno', 'La scelta abituale per le gite in giornata; buon rapporto qualità-prezzo fuori dalla punta del mattino.'],
        ['Anytime (flessibile)', 'Qualsiasi treno', 'Flessibile, ma decisamente più caro dell’Off-Peak.']
      ],
      ticketTips: [
        'Vale la pena controllare una <strong>Railcard</strong> anche per un solo viaggio, perché si applica alla maggior parte delle tariffe Off-Peak.',
        'Un biglietto di andata e ritorno in giornata può convenire più di due corse singole; confronta entrambi quando cerchi.',
        'Chiltern da Marylebone è spesso un po’ più economico di GWR da Paddington; confrontali alla stessa data.'
      ],
      when: 'Le mattine feriali verso Oxford sono piene di pendolari, e nei fine settimana d’estate e nel periodo delle lauree la città è affollata. Andare in settimana fuori dai picchi del calendario universitario dà college più tranquilli e tavoli più facili all’ora di pranzo.',
      arrivalIntro: 'Una giornata a Oxford si fa facilmente da Londra. A poca distanza a piedi dalla stazione:',
      arrival: [
        '<strong>La Bodleian Library e la Radcliffe Camera</strong> — il cuore storico dell’università; alcuni interni si visitano solo con visita guidata.',
        '<strong>Christ Church</strong> e gli altri college — gli orari cambiano durante il trimestre e gli esami, quindi verifica prima di andare.',
        '<strong>L’Ashmolean Museum</strong> — arte e archeologia, ingresso gratuito.',
        '<strong>Un giro in punt sul Cherwell o sul Tamigi</strong> — il modo classico di vedere i college dall’acqua col bel tempo.'
      ],
      alt: [
        '<strong>Pullman express</strong> — servizi come Oxford Tube e X90 partono da London Victoria e da altre fermate; più lenti del treno, di solito ben oltre un’ora e mezza.',
        '<strong>Auto</strong> — circa un’ora e mezza a seconda del traffico, con parcheggi limitati e cari in centro; meglio un park and ride.'
      ]
    },
    'london-cambridge': {
      stations: [
        '<strong>London King’s Cross</strong> (la più veloce) e <strong>London Liverpool Street</strong> sono le due principali stazioni di partenza. King’s Cross ha i servizi Great Northern e Thameslink; Liverpool Street quelli di Greater Anglia.',
        '<strong>La stazione di Cambridge</strong> è a circa 2 km dal centro. Calcola 20–25 minuti a piedi, oppure prendi un autobus, un taxi o una bici dalla stazione.'
      ],
      times: 'I treni Great Northern più veloci da King’s Cross impiegano poco meno di un’ora. I servizi Thameslink sono più lenti, con più fermate, e i treni Greater Anglia da Liverpool Street di solito impiegano circa un’ora e un quarto. Ci sono più treni all’ora durante il giorno, quindi raramente devi organizzarti attorno a una sola partenza.',
      ticketsIntro: 'Qui non c’è un “miglior” operatore; la tariffa dipende dalla stazione e dall’ora del giorno:',
      tickets: [
        ['Advance (anticipato)', 'Un treno preciso', 'A volte disponibile e il più economico; non offerto su tutti i servizi.'],
        ['Off-Peak (fuori punta)', 'Treni fuori punta nel giorno', 'Scelta tipica per le gite in giornata; evita le punte dei pendolari.'],
        ['Anytime (flessibile)', 'Qualsiasi treno', 'Flessibile e il più caro.']
      ],
      ticketTips: [
        'Confronta <strong>King’s Cross</strong> e <strong>Liverpool Street</strong> nello stesso giorno; una delle due è spesso più economica a seconda dell’ora.',
        'Una <strong>Railcard</strong> riduce di circa un terzo la maggior parte delle tariffe Off-Peak.',
        'Se alloggi vicino a Tottenham Hale o a Stansted, la linea Greater Anglia può essere più comoda che passare prima dal centro di Londra.'
      ],
      when: 'Le mattine all’andata e le sere al ritorno, nei giorni feriali, sono piene di pendolari. Cambridge è più tranquilla fuori dal trimestre e più affollata nei fine settimana d’estate e nel periodo delle lauree; prenota in anticipo le attività più popolari (punting, King’s College Chapel).',
      arrivalIntro: 'Cambridge è compatta e facile da girare a piedi o in bici. Da vedere:',
      arrival: [
        '<strong>King’s College Chapel</strong> — uno dei grandi edifici gotici d’Inghilterra; gli orari di visita cambiano durante il trimestre.',
        '<strong>The Backs e il fiume Cam</strong> — prati e ponti dietro i college, da vedere meglio in punt o a piedi.',
        '<strong>Il Fitzwilliam Museum</strong> — ingresso gratuito, con arte e antichità.',
        '<strong>La Market Square e Trinity Street</strong> — buoni posti per pranzare prima di rientrare.'
      ],
      alt: [
        '<strong>Pullman</strong> — i servizi da Londra arrivano a Cambridge in circa due ore e costano meno, ma dipendono dal traffico.',
        '<strong>Auto</strong> — circa un’ora e mezza; Cambridge ha pochi parcheggi in centro, e i park and ride in periferia sono l’opzione più semplice.'
      ]
    },
    'london-york': {
      stations: [
        '<strong>London King’s Cross</strong> è la stazione di partenza dei treni LNER. Ha collegamenti con la metropolitana (linee Piccadilly, Northern, Victoria, Circle, Metropolitan e Hammersmith &amp; City) ed è accanto a St Pancras International.',
        '<strong>La stazione di York</strong> è accanto alle mura medievali. La cattedrale (York Minster) è a circa 10–15 minuti a piedi, e The Shambles più o meno uguale. Il National Railway Museum è proprio accanto alla stazione.'
      ],
      times: 'I treni LNER più veloci impiegano circa 1 h 50 min–2 h, con in genere circa due partenze all’ora durante il giorno, quindi di solito puoi viaggiare all’ora che preferisci. Alcuni servizi sono più lenti perché fermano in più stazioni. Altri operatori open access servono York sulla East Coast Main Line, quindi confronta le partenze invece di dare per scontato un solo operatore.',
      ticketsIntro: 'Il modo più economico è quasi sempre prenotare un biglietto Advance per un treno preciso:',
      tickets: [
        ['Advance (anticipato)', 'Un treno preciso', 'Il più economico. Le corse singole indicative sono spesso tra 20 e 40 £ se prenoti presto.'],
        ['Off-Peak (fuori punta)', 'Treni fuori punta nel giorno', 'Prezzo intermedio; opzione sensata per le gite in giornata fuori dalla punta del mattino.'],
        ['Anytime (flessibile)', 'Qualsiasi treno', 'Il più flessibile e il più caro; può superare di molto le 100 £ a tratta.']
      ],
      ticketTips: [
        'Prenota appena escono le tariffe per la tua data; i biglietti Advance più economici si esauriscono e poi salgono.',
        'Una <strong>Railcard</strong> toglie normalmente circa un terzo, anche su molte tariffe Advance.',
        'Controlla le prenotazioni dei posti sui treni pieni di venerdì e domenica se viaggi con i bagagli.'
      ],
      when: 'I venerdì pomeriggio e le domeniche sera sono i più cari e affollati. Una partenza infrasettimanale fuori dalle vacanze scolastiche è di solito più economica e tranquilla. York è più affollata nei fine settimana e nella stagione dei mercatini di Natale.',
      arrivalIntro: 'York è abbastanza piccola per un’escursione in giornata da Londra, anche se una notte sul posto la rende molto più rilassata. Da vedere:',
      arrival: [
        '<strong>York Minster</strong> — una delle più grandi cattedrali gotiche del Nord Europa.',
        '<strong>The Shambles e le mura</strong> — vie medievali e un giro delle mura da fare a piedi.',
        '<strong>Il National Railway Museum</strong> — ingresso gratuito e comodo se arrivi in treno.',
        '<strong>Il Jorvik Viking Centre e le rive del fiume</strong> — adatto alle famiglie e a una passeggiata tranquilla nel pomeriggio.'
      ],
      alt: [
        '<strong>Pullman</strong> — i servizi impiegano circa cinque o sei ore; più economici ma molto più lenti del treno.',
        '<strong>Auto</strong> — circa quattro o cinque ore a seconda del traffico sulla A1(M); il parcheggio a York è limitato, meglio un park and ride.'
      ]
    },
    'london-edinburgh': {
      stations: [
        '<strong>London King’s Cross</strong> è la stazione di partenza di LNER e degli operatori open access della East Coast Main Line. Il Caledonian Sleeper parte invece da Euston.',
        '<strong>Edinburgh Waverley</strong> si trova al centro della città, sotto la Città Vecchia. Il Royal Mile e il castello sono a circa 10–15 minuti a piedi, in salita dalla stazione.'
      ],
      times: 'I treni diurni più veloci impiegano circa 4 h 20 min–4 h 30 min, con servizi di norma almeno ogni ora. A nord la linea costeggia il Mare del Nord, passa da Berwick-upon-Tweed e dal Royal Border Bridge, uno dei tratti più belli del viaggio. Per arrivare di mattina, il Caledonian Sleeper da Euston ti porta a Edimburgo nottetempo, in circa sette o otto ore, con posti a sedere e cabine.',
      ticketsIntro: 'Sia LNER sia l’operatore open access Lumo gestiscono treni diretti per Edimburgo, quindi vale la pena confrontarli alla stessa data:',
      tickets: [
        ['Advance (LNER)', 'Un treno preciso', 'La tariffa LNER più economica; le corse singole indicative partono spesso da circa 30–60 £ se prenoti con largo anticipo.'],
        ['Lumo', 'Un treno preciso', 'Operatore economico; le sue tariffe possono battere LNER in alcune date, con meno partenze e regole diverse per bagagli e posti.'],
        ['Off-Peak / Anytime', 'Biglietti flessibili', 'Molto più cari; un Anytime singolo può superare le 150 £.']
      ],
      ticketTips: [
        'Prenota appena aprono le tariffe per la tua data. Le tariffe Advance dei treni di venerdì e domenica si esauriscono per prime.',
        'Una <strong>Railcard</strong> (comprese Two Together e Senior) toglie circa un terzo su molte tariffe.',
        'Confronta la stessa partenza su LNER e Lumo; l’operatore più economico cambia a seconda della data.'
      ],
      when: 'La stagione dei festival ad agosto, l’Hogmanay e i fine settimana di rugby sono i più cari. Fuori da quei periodi, una partenza infrasettimanale al mattino è di solito la più economica. Siediti sul lato destro andando verso nord per vedere la costa vicino a Berwick.',
      arrivalIntro: 'Per una prima visita calcola almeno un fine settimana. A piedi da Waverley:',
      arrival: [
        '<strong>Il castello di Edimburgo e il Royal Mile</strong> — la spina dorsale storica della Città Vecchia.',
        '<strong>Arthur’s Seat e Holyrood Park</strong> — una breve salita con ampie viste sulla città.',
        '<strong>Calton Hill e Princes Street Gardens</strong> — belvedere facili vicino alla stazione.',
        '<strong>I musei del Royal Mile e il National Museum of Scotland</strong> — buone opzioni se piove; il National Museum ha ingresso gratuito.'
      ],
      alt: [
        '<strong>Aereo</strong> — il volo Londra–Edimburgo dura meno di circa 1 h 30 in aria, ma check-in, controlli e trasferimenti riducono il vantaggio; confronta da porta a porta.',
        '<strong>Pullman</strong> — i servizi impiegano circa nove o dieci ore; molto più economici ma molto più lenti.',
        '<strong>Auto</strong> — circa sette o otto ore senza soste, e un viaggio caro e faticoso per la maggior parte dei visitatori.'
      ]
    },
    'london-amsterdam': {
      stations: [
        '<strong>London St Pancras International</strong> è il terminal dell’Eurostar. Si trova accanto a King’s Cross e si collega a sei linee della metropolitana. I controlli di frontiera e di sicurezza si fanno prima di salire.',
        '<strong>Amsterdam Centraal</strong> è in pieno centro, a pochi passi da Damrak e dai canali principali; dalla stazione partono tram e metropolitana.'
      ],
      times: 'L’Eurostar diretto impiega circa 3 h 50 min–4 h 15 min, con fermate a Bruxelles e Rotterdam. Poiché i controlli di passaporto e di sicurezza si fanno a St Pancras, bisogna arrivare con anticipo; l’indicazione abituale di Eurostar è presentarsi circa 90 minuti prima della partenza. È uno dei viaggi Eurostar più lunghi, quindi vale la pena prenotare un posto vicino al finestrino e con presa di corrente.',
      ticketsIntro: 'Eurostar vende i biglietti più economici per un treno preciso appena si aprono le prenotazioni. I principali tipi di tariffa sono:',
      tickets: [
        ['Standard (il più economico)', 'Un treno preciso, cambi limitati', 'Le corse singole indicative partono spesso da circa 50–80 £ se prenoti con mesi di anticipo.'],
        ['Standard Premier / Plus', 'Più flessibilità ed extra', 'Prezzo intermedio; cambi consentiti, con lounge o pasti nelle categorie superiori.'],
        ['Business Premier', 'Completamente flessibile', 'Il più caro; include accesso alla lounge e cibo a bordo.']
      ],
      ticketTips: [
        'I biglietti escono in vendita con molti mesi di anticipo, e i posti più economici nei giorni di punta si esauriscono per primi.',
        'L’Eurostar include un bagaglio di due valigie grandi più il bagaglio a mano: più comodo che volare con un bagaglio da stiva.',
        'Controlla sulla pagina di prenotazione se ci sono tariffe giovani o per gruppi, che possono ridurre il prezzo su alcune partenze.'
      ],
      when: 'I venerdì sera, le domeniche pomeriggio e le vacanze scolastiche sono i più cari e affollati. Una partenza infrasettimanale al mattino, fuori dalle vacanze, è di solito più economica e tranquilla. Lascia tempo in più a St Pancras nei giorni di grande affluenza, perché la coda del controllo di frontiera può essere lunga.',
      arrivalIntro: 'Amsterdam è abbastanza piccola da spostarsi a piedi o in bici tra i luoghi principali. Da vedere partendo da Centraal:',
      arrival: [
        '<strong>La cerchia dei canali</strong> — il Grachtengordel del Seicento, a pochi passi dalla stazione.',
        '<strong>Il Rijksmuseum, il Museo Van Gogh e la Casa di Anna Frank</strong> — prenota biglietti con orario, soprattutto per la Casa di Anna Frank.',
        '<strong>Lo Jordaan</strong> — stradine, caffè e negozi indipendenti vicino ai canali occidentali.',
        '<strong>Escursioni in treno</strong> — Haarlem, Delft e Utrecht sono a meno di un’ora da Amsterdam con treni regolari.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 20 in aria dagli aeroporti di Londra, ma il tempo da porta a porta, con tragitto verso l’aeroporto, controlli e trasferimento ad Amsterdam, supera di solito nettamente quello del treno.',
        '<strong>Traghetto più treno</strong> — un traghetto notturno da Harwich a Hoek van Holland e poi un treno per Amsterdam è molto più lento, ma un’alternativa classica e più economica.',
        '<strong>Pullman</strong> — i servizi passano per il tunnel sotto la Manica o in traghetto e impiegano circa dieci ore o più.'
      ]
    },
    'london-brussels': {
      stations: [
        '<strong>London St Pancras International</strong> è il terminal dell’Eurostar, con collegamenti di metropolitana, Thameslink e rete ferroviaria nazionale. I controlli di frontiera e di sicurezza si fanno prima di salire.',
        '<strong>Bruxelles-Midi (Brussel-Zuid)</strong> è la stazione dell’Eurostar. La Grand-Place è a circa 25 minuti a piedi o a un breve tragitto in metro o tram dal centro.'
      ],
      times: 'L’Eurostar per Bruxelles impiega circa due ore, con più partenze durante la giornata. È uno dei modi più rapidi per andare tra due capitali europee, e il treno arriva nel cuore della città e non in un aeroporto lontano. Come sulle altre tratte Eurostar, arriva con anticipo per i controlli di frontiera; l’indicazione abituale di Eurostar è circa 90 minuti prima della partenza.',
      ticketsIntro: 'Eurostar usa prezzi dinamici: più prenoti presto, più la tariffa è bassa:',
      tickets: [
        ['Standard (il più economico)', 'Un treno preciso, cambi limitati', 'Le corse singole indicative partono spesso da circa 40–60 £ se prenoti con largo anticipo.'],
        ['Standard Premier / Plus', 'Più flessibilità ed extra', 'Prezzo intermedio, con cambi ed extra a seconda della categoria.'],
        ['Business Premier', 'Completamente flessibile', 'Il più caro; include accesso alla lounge e cibo.']
      ],
      ticketTips: [
        'Prenota appena escono in vendita i biglietti per la tua data; i posti più economici vanno via per primi.',
        'Confronta i biglietti per “Bruxelles (tutte le stazioni)” con quelli verso altre destinazioni belghe, a volte più convenienti.',
        'Le tariffe giovani e alcune offerte per gruppi possono ridurre il prezzo; controlla le opzioni sulla pagina di prenotazione.'
      ],
      when: 'I venerdì, le domeniche e le vacanze scolastiche sono i più affollati e cari. Le mattine infrasettimanali offrono il miglior rapporto qualità-prezzo. I fine settimana a Bruxelles sono molto popolari, quindi prenota presto le date più richieste.',
      arrivalIntro: 'Bruxelles è compatta e facile da girare a piedi. Da vedere:',
      arrival: [
        '<strong>La Grand-Place</strong> — la piazza delle corporazioni del Seicento, al centro della città vecchia.',
        '<strong>Il Palazzo Reale, il Parc de Bruxelles e il Museo Magritte</strong> — si combinano facilmente in mezza giornata.',
        '<strong>I murales di fumetti</strong> — la tradizione del fumetto della città si vede sui muri di tutto il centro.',
        '<strong>Escursioni in treno</strong> — Bruges, Gand e Anversa sono tutte a meno di un’ora da Bruxelles.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 10 in aria, ma il tragitto verso l’aeroporto e i controlli avvicinano il totale a quello del treno, e il treno arriva in centro.',
        '<strong>Pullman</strong> — i servizi via tunnel sotto la Manica o in traghetto impiegano circa sette ore o più.'
      ]
    },
    'geneva-paris': {
      stations: [
        '<strong>Genève Cornavin</strong> è la stazione principale, in centro, a circa 10–15 minuti a piedi dal lago e dalla Città Vecchia. Tram e autobus partono dall’esterno.',
        '<strong>Paris Gare de Lyon</strong> è servita dalle linee 1 e 14 della metropolitana e dalle RER A e D, quindi si raggiunge quasi tutto il centro di Parigi con al massimo un cambio.'
      ],
      times: 'Il TGV Lyria diretto impiega circa tre ore, con poche partenze al giorno e non una ogni mezz’ora, quindi conviene scegliere prima la partenza e poi cercare la tariffa. Esistono opzioni più lente con cambio a Lione o a Bellegarde, ma il treno diretto è quasi sempre la scelta migliore.',
      ticketsIntro: 'Il servizio diretto è venduto con una gamma di tariffe; le più economiche riguardano un treno preciso e si esauriscono per prime:',
      tickets: [
        ['Saver (anticipato)', 'Un treno preciso', 'Il più economico. Le corse singole indicative partono spesso da circa 30–60 € se prenoti in anticipo.'],
        ['Standard', 'Meno restrizioni', 'Prezzo intermedio, con una certa flessibilità per cambiare.'],
        ['Flexible / First', 'Completamente flessibile o prima classe', 'Il più caro; utile se i tuoi piani possono cambiare.']
      ],
      ticketTips: [
        'Prenota appena si apre la vendita per la tua data, e controlla sia TGV Lyria sia le opzioni solo SNCF.',
        'La Svizzera è fuori dall’UE, quindi porta il passaporto o la carta d’identità anche se di solito non ci sono code alla frontiera.',
        'Prenota il posto sul treno diretto; la prenotazione del posto è inclusa nel prezzo del biglietto.'
      ],
      when: 'I venerdì pomeriggio, le domeniche sera e le vacanze scolastiche sono i più affollati. Una partenza infrasettimanale al mattino è di solito la più economica e comoda. Poiché ci sono pochi treni diretti al giorno, un treno esaurito può lasciarti con una coincidenza molto più lenta.',
      arrivalIntro: 'Ginevra è un buon punto di partenza per il lago e le Alpi; Parigi è all’altro capo della linea. Da vedere a Ginevra:',
      arrival: [
        '<strong>Il Jet d’Eau e il lungolago</strong> — una passeggiata facile da Cornavin.',
        '<strong>La Città Vecchia e la cattedrale di San Pietro</strong> — vie acciottolate e una torre con vista sulla città.',
        '<strong>Il Palais des Nations e il quartiere dei musei</strong> — adatti a mezza giornata al coperto.',
        '<strong>Escursioni in treno</strong> — Losanna, Montreux e Annecy sono raggiungibili da Ginevra.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 20 in aria, ma aggiungi trasferimenti e controlli; il treno è spesso competitivo da porta a porta.',
        '<strong>Pullman</strong> — un’opzione lunga, notturna o diurna, di circa otto o nove ore, più economica del treno.',
        '<strong>Auto</strong> — circa cinque ore, più la vignetta autostradale svizzera e i pedaggi francesi.'
      ]
    },
    'paris-zurich': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> è la stazione di partenza del TGV Lyria; è collegata alle linee 1 e 14 della metropolitana e alle RER A e D.',
        '<strong>Zürich HB</strong> è la stazione centrale, a pochi passi dal lago e dalla Città Vecchia, con tram e S-Bahn sotto.'
      ],
      times: 'Il TGV Lyria diretto impiega circa quattro ore, di solito con fermata a Basilea, e parte poche volte al giorno. Non esiste un’opzione più veloce, quindi l’orario di partenza conta più del prezzo quando pianifichi una giornata di viaggio. Arrivare nel pomeriggio lascia il tempo per una serata sul lago.',
      ticketsIntro: 'Le tariffe dipendono da quanto prenoti in anticipo e da quale dei pochi treni giornalieri scegli:',
      tickets: [
        ['Saver (anticipato)', 'Un treno preciso', 'Il più economico. Le corse singole indicative partono spesso da circa 40–70 € se prenoti in anticipo.'],
        ['Standard', 'Meno restrizioni', 'Prezzo intermedio; una certa flessibilità per cambiare.'],
        ['Flexible / First', 'Completamente flessibile o prima classe', 'Il più caro; utile se i piani possono cambiare.']
      ],
      ticketTips: [
        'Prenota presto per le date di punta; i posti più economici sui pochi treni giornalieri si esauriscono per primi.',
        'La Svizzera è fuori dall’UE, quindi porta il passaporto o la carta d’identità.',
        'Confronta con un cambio a Basilea, che può costare meno ma richiede più tempo e rischia una coincidenza persa.'
      ],
      when: 'I venerdì, le domeniche e le vacanze scolastiche sono i più affollati. Le mattine infrasettimanali offrono di solito il miglior prezzo. Controlla i giorni in cui circolano il primo e l’ultimo treno diretto, perché i servizi variano.',
      arrivalIntro: 'Zurigo è una città compatta e molto piacevole a piedi, affacciata su un lago. Da vedere partendo dalla stazione:',
      arrival: [
        '<strong>L’Altstadt e la Bahnhofstrasse</strong> — la Città Vecchia e la principale via dello shopping.',
        '<strong>Il lago di Zurigo</strong> — passeggiate, battelli e punti per fare il bagno in estate.',
        '<strong>L’Uetliberg</strong> — a un breve tragitto in treno dalla stazione, con la vista migliore sulla città.',
        '<strong>Escursioni</strong> — Lucerna, Basilea e le cascate del Reno sono a circa un’ora di treno.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 20 in aria, ma con trasferimenti e controlli il treno è competitivo.',
        '<strong>Pullman</strong> — un’opzione notturna o di lunga giornata, più economica ma molto più lenta.',
        '<strong>Auto</strong> — circa sette ore, con la vignetta autostradale svizzera e i pedaggi francesi.'
      ]
    },
    'brussels-paris': {
      stations: [
        '<strong>Bruxelles-Midi (Brussel-Zuid)</strong> è la stazione internazionale. Ha collegamenti di metro e tram con il centro; la Grand-Place è a un breve tragitto o a circa 25 minuti a piedi.',
        '<strong>Paris Gare du Nord</strong> è collegata alle linee 4 e 5 della metropolitana e alle RER B e D, quindi è facile raggiungere quasi tutta Parigi.'
      ],
      times: 'L’Eurostar impiega circa 1 h 20 min–1 h 30 min e parte con frequenza durante il giorno. Le due città sono nell’area Schengen, quindi non c’è controllo dei passaporti, ma ci sono controlli del biglietto e di sicurezza prima di salire; presentarsi circa 30 minuti prima della partenza è l’indicazione abituale.',
      ticketsIntro: 'Eurostar usa prezzi dinamici, quindi chi prenota per primo ottiene i prezzi più bassi:',
      tickets: [
        ['Standard (il più economico)', 'Un treno preciso, cambi limitati', 'Le corse singole indicative partono spesso da circa 30–50 € se prenoti in anticipo.'],
        ['Standard Premier / Plus', 'Più flessibilità ed extra', 'Prezzo intermedio, a seconda della categoria.'],
        ['Business Premier', 'Completamente flessibile', 'Il più caro; include lounge e cibo.']
      ],
      ticketTips: [
        'Prenota appena si apre la vendita; i posti più economici vanno via per primi nei giorni di maggiore richiesta.',
        'Confronta con un cambio a Lille o altre opzioni regionali; il treno diretto è quasi sempre il più veloce e semplice.',
        'Le tariffe giovani e alcune per gruppi possono ridurre il prezzo; controlla le opzioni sulla pagina di prenotazione.'
      ],
      when: 'I venerdì, le domeniche e i festivi sono i più affollati. I treni di metà giornata nei giorni feriali sono di solito più tranquilli. Se prendi una coincidenza con un volo o un altro treno, lascia un margine ragionevole per i controlli di sicurezza.',
      arrivalIntro: 'Parigi non ha bisogno di presentazioni, ma qualche indicazione se arrivi a Gare du Nord:',
      arrival: [
        '<strong>Montmartre e il Sacré-Cœur</strong> — una breve passeggiata o un tragitto in metro dalla stazione.',
        '<strong>Il Canal Saint-Martin</strong> — una passeggiata piacevole, dall’aria locale, vicino a Gare du Nord.',
        '<strong>Il Louvre e la Senna</strong> — facili con la linea 4 della metropolitana o la RER B.',
        '<strong>Escursioni in treno</strong> — Versailles, Chantilly e Rouen sono tutte fattibili da Parigi.'
      ],
      alt: [
        '<strong>Pullman</strong> — i servizi impiegano circa quattro ore; più economici ma più lenti, e soggetti al traffico.',
        '<strong>Auto</strong> — circa tre ore a seconda del traffico, più pedaggi e parcheggio a Parigi.',
        '<strong>Aereo</strong> — poco pratico per questa coppia; il treno è più veloce da porta a porta.'
      ]
    },
    'brussels-bruges': {
      stations: [
        '<strong>Bruxelles Midi, Central o Nord</strong> — i treni intercity per Bruges fermano in tutte e tre le principali stazioni di Bruxelles, quindi scegli quella più vicina al tuo hotel.',
        '<strong>La stazione di Bruges</strong> è a circa 1,5 km dal Markt, a circa 20–25 minuti a piedi, con autobus e taxi all’uscita.'
      ],
      times: 'I treni intercity impiegano circa 50 minuti–un’ora e partono più o meno ogni mezz’ora durante il giorno, quindi puoi presentarti e partire senza organizzarti attorno a una sola partenza. Alcuni servizi sono treni con più fermate e più lenti; controlla la durata del treno scelto.',
      ticketsIntro: 'La rete ferroviaria nazionale belga (SNCB) ha tariffe fisse e semplici su questa linea:',
      tickets: [
        ['Biglietto singolo standard', 'Qualsiasi treno nel giorno', 'Di solito meno di 20 € a tratta.'],
        ['Andata e ritorno / gita', 'Andata e ritorno', 'Spesso più economico di due corse singole; controlla le opzioni.'],
        ['Tariffe weekend o ridotte', 'Sconti dal venerdì alla domenica', 'La SNCB offre sconti weekend su molte tratte; controllali sulla pagina di prenotazione.']
      ],
      ticketTips: [
        'Su questa tratta non si risparmia molto prenotando con mesi di anticipo; le tariffe sono per lo più fisse, quindi puoi comprare il giorno stesso.',
        'Convalida o scansiona il biglietto come indicato nell’app prima di salire.',
        'Se fai una gita in giornata, compra l’andata e ritorno e parti presto per anticipare i gruppi dei pullman.'
      ],
      when: 'Bruges è affollata d’estate e nei fine settimana, soprattutto tra tarda mattina e metà pomeriggio. Arrivare presto al mattino o restare fino a sera è il modo migliore per godersi i canali con meno gente.',
      arrivalIntro: 'Bruges è compatta e si visita meglio a piedi. Da vedere:',
      arrival: [
        '<strong>Il Markt e il Beffroi</strong> — la piazza medievale del mercato e il suo campanile del Duecento.',
        '<strong>I canali e il Beghinaggio</strong> — angoli tranquilli lontano dalle strade principali.',
        '<strong>La piazza Burg e la Basilica del Santo Sangue</strong> — l’antico centro civico.',
        '<strong>Giro in barca o a piedi lungo i canali</strong> — un modo classico per vedere la città vecchia in un’ora.'
      ],
      alt: [
        '<strong>Pullman</strong> — esistono servizi, ma impiegano più del treno.',
        '<strong>Auto</strong> — circa un’ora, ma il parcheggio a Bruges è limitato e caro; parcheggia fuori dal centro.'
      ]
    },
    'nice-monaco': {
      stations: [
        '<strong>Nice-Ville</strong> è la stazione principale, a un breve tragitto in tram o a circa 15–20 minuti a piedi dalla Promenade des Anglais.',
        '<strong>Monaco-Monte-Carlo</strong> è una stazione sotterranea; ascensori e scale mobili portano alla zona del casinò di Monte Carlo e al porto.'
      ],
      times: 'Il TER costiero impiega circa 20–25 minuti e passa spesso, di solito ogni 15–30 minuti durante il giorno, quindi puoi presentarti e partire. Lungo il percorso ferma in piccole stazioni costiere come Villefranche-sur-Mer, Beaulieu-sur-Mer ed Èze-sur-Mer, e le viste sul Mediterraneo sono tra le più belle della Costa Azzurra.',
      ticketsIntro: 'È una linea regionale con tariffe fisse e semplici, non con prezzi anticipati:',
      tickets: [
        ['Biglietto singolo', 'Qualsiasi TER nel giorno', 'Di solito pochi euro a tratta.'],
        ['Andata e ritorno', 'Andata e ritorno', 'Spesso allo stesso prezzo di due corse singole.'],
        ['Pass giornaliero / biglietto regionale', 'Viaggi locali illimitati', 'Da valutare se prevedi più fermate lungo la costa.']
      ],
      ticketTips: [
        'Non si guadagna nulla prenotando in anticipo: compra alla macchinetta o nell’app e parti.',
        'Da Nizza a Monaco, siediti sul lato destro per le migliori viste sul mare.',
        'Fermati a Villefranche-sur-Mer o a Èze al ritorno per una breve deviazione sulla costa.'
      ],
      when: 'Le mattine e le tarde ore del pomeriggio d’estate sono piene di escursionisti. Una partenza di primo mattino ti dà treni più tranquilli e passeggiate più fresche a Monaco. Lascia tempo extra nei fine settimana del Gran Premio e dei grandi eventi.',
      arrivalIntro: 'Monaco è abbastanza piccola da girarla a piedi in un giorno. Da vedere:',
      arrival: [
        '<strong>Il Palazzo del Principe e la Rocca</strong> — la città vecchia di Monaco-Ville, con vista sul porto.',
        '<strong>Il Casinò di Monte Carlo e la Place du Casino</strong> — la piazza più nota e i suoi giardini.',
        '<strong>Il Museo Oceanografico</strong> — un acquario e museo sulla scogliera sopra il mare.',
        '<strong>Port Hercule</strong> — il porto principale, un buon posto per pranzare.'
      ],
      alt: [
        '<strong>Autobus</strong> — un autobus costiero collega Nizza e Monaco, più lento del treno ma molto economico.',
        '<strong>Auto</strong> — da 30 a 45 minuti, ma traffico e parcheggio a Monaco ne fanno una scelta poco felice.',
        '<strong>A piedi o in bici</strong> — il sentiero costiero è spettacolare ma lungo, meglio tenerlo per un altro giorno.'
      ]
    },
    'munich-berlin': {
      stations: [
        '<strong>München Hauptbahnhof</strong> è la stazione principale, con S-Bahn, U-Bahn e il centro storico a pochi passi.',
        '<strong>Berlin Hauptbahnhof</strong> è una moderna stazione di vetro a nord del centro. S-Bahn e U-Bahn portano ai quartieri principali; la Porta di Brandeburgo è a circa 20 minuti a piedi.'
      ],
      times: 'Gli ICE più veloci impiegano circa quattro ore, con gli “Sprinter” più rapidi che fermano in pochissime stazioni. Di solito c’è almeno un treno all’ora durante il giorno, quindi puoi scegliere la partenza che preferisci. Gli ICE più lenti, con più fermate, aggiungono un po’ di tempo; controlla la durata del treno scelto.',
      ticketsIntro: 'Deutsche Bahn vende una gamma di tariffe per lo stesso treno, dalle tariffe economiche ai biglietti completamente flessibili:',
      tickets: [
        ['Sparpreis (economica)', 'Un treno preciso, cambi limitati', 'Il più economico. Le corse singole indicative partono spesso tra 20 e 50 € se prenoti presto.'],
        ['Flexpreis', 'Qualsiasi treno nel giorno', 'Medio-alto; la tariffa flessibile standard, che può superare di molto i 100 €.'],
        ['Super Sparpreis', 'Il più economico, condizioni rigide', 'Disponibilità limitata e prezzi più bassi; si esaurisce per primo.']
      ],
      ticketTips: [
        'Prenota appena si apre la vendita per la tua data; le tariffe Sparpreis più economiche sono limitate e salgono man mano che il treno si riempie.',
        'Una <strong>BahnCard 25 o 50</strong> si ripaga presto se fai più viaggi lunghi in Germania.',
        'Prenota un posto su un treno affollato; le prenotazioni costano poco e valgono la pena il venerdì e la domenica.'
      ],
      when: 'Le sere di venerdì, i pomeriggi di domenica e le vacanze scolastiche sono i più affollati. I treni infrasettimanali a metà mattina sono di solito più economici e tranquilli. Se vuoi silenzio, cerca la carrozza silenziosa, indicata sul treno.',
      arrivalIntro: 'Berlino è grande; usa S-Bahn e U-Bahn per spostarti tra i quartieri. Da vedere:',
      arrival: [
        '<strong>La Porta di Brandeburgo e il Reichstag</strong> — raggiungibili a piedi dalla stazione principale; prenota online la cupola del Reichstag.',
        '<strong>L’Isola dei Musei</strong> — un’isola patrimonio dell’Unesco con diversi grandi musei.',
        '<strong>La East Side Gallery e Kreuzberg</strong> — il tratto conservato del Muro e un quartiere vivace per mangiare.',
        '<strong>Charlottenburg e l’ovest</strong> — palazzo, viali e zone più tranquille.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 ora in aria, ma con trasferimenti e controlli il treno è competitivo e arriva in centro.',
        '<strong>Pullman</strong> — un’opzione notturna o di lunga giornata, spesso molto più economica ma di circa sette o nove ore.',
        '<strong>Auto</strong> — circa sei ore a seconda del traffico, più carburante e parcheggio.'
      ]
    },
    'rome-venice': {
      stations: [
        '<strong>Roma Termini</strong> è la stazione principale di Roma, con le linee A e B della metropolitana e autobus. Da qui partono i servizi Frecciarossa e Italo.',
        '<strong>Venezia Santa Lucia</strong> si affaccia sul Canal Grande. Dalla stazione si prosegue a piedi o in vaporetto (autobus d’acqua); alcuni treni fermano invece a Venezia Mestre, sulla terraferma, quindi controlla quale stazione indica il tuo biglietto.'
      ],
      times: 'I treni ad alta velocità Frecciarossa e Italo impiegano circa 3 h 45 min–4 h, con partenze circa ogni ora o più frequenti durante il giorno, e alcune opzioni regionali più lente che richiedono molto più tempo. I treni fermano normalmente a Firenze e a volte a Bologna, il che rende questa tratta ottima per spezzare il viaggio.',
      ticketsIntro: 'Frecciarossa (Trenitalia) e Italo si fanno concorrenza su questa tratta, il che mantiene ragionevoli le tariffe anticipate:',
      tickets: [
        ['Super Economy / Economy', 'Un treno preciso, cambi limitati', 'Il più economico. Le corse singole indicative partono spesso tra 30 e 50 € se prenoti in anticipo.'],
        ['Base', 'Più flessibilità per cambiare', 'Prezzo intermedio.'],
        ['Flex / Prima', 'Completamente flessibile o prima classe', 'Il più caro; utile se i piani possono cambiare.']
      ],
      ticketTips: [
        'Confronta Frecciarossa e Italo alla stessa data; l’operatore più economico cambia da un giorno all’altro.',
        'Prenota appena si apre la vendita per la tua data; le tariffe più basse vanno via per prime.',
        'La prenotazione del posto è inclusa nel prezzo del biglietto sui treni ad alta velocità; non serve comprarne una a parte.'
      ],
      when: 'I venerdì pomeriggio, le domeniche sera e le vacanze di Pasqua e d’estate sono i più affollati e cari. Le mattine infrasettimanali offrono di solito il miglior prezzo. Lascia tempo extra a Venezia, perché i vaporetti sono lenti e affollati in alta stagione.',
      arrivalIntro: 'Venezia premia chi si perde. Dalla stazione vale la pena camminare almeno per una parte del tragitto. Da vedere:',
      arrival: [
        '<strong>Il Canal Grande</strong> — prendi il vaporetto della linea 1 per una discesa lenta ed economica lungo tutto il canale.',
        '<strong>Piazza San Marco e la basilica</strong> — vai presto per evitare la folla.',
        '<strong>Rialto e il quartiere di Cannaregio</strong> — strade più tranquille, bacari locali e l’antico Ghetto ebraico.',
        '<strong>Burano e Murano</strong> — escursioni alle isole in vaporetto dalle Fondamente Nove.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 15 in aria, ma l’aeroporto Marco Polo è sulla terraferma e il trasferimento a Venezia aggiunge tempo.',
        '<strong>Treno notturno</strong> — a volte disponibile tra Roma e il nord; controlla l’orario in tempo reale.',
        '<strong>Auto</strong> — circa cinque o sei ore, ma le auto non sono ammesse nella stessa Venezia.'
      ]
    },
    'paris-lyon': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> ha le linee 1 e 14 della metropolitana e le RER A e D. Alcuni treni low cost Ouigo partono invece da altre stazioni dell’area parigina, quindi controlla la stazione di partenza del tuo biglietto.',
        '<strong>Lyon Part-Dieu</strong> è la stazione principale del quartiere degli affari, con collegamenti di metro e tram verso il centro. Alcuni treni fermano anche a <strong>Lyon Perrache</strong>, più vicina alla Presqu’île e alla confluenza dei due fiumi.'
      ],
      times: 'I TGV più veloci impiegano circa due ore, con partenze nell’arco della giornata a intervalli brevi, quindi raramente devi organizzarti attorno a un solo treno. I servizi low cost Ouigo impiegano più o meno lo stesso tempo, ma usano altre stazioni e hanno regole sui bagagli più rigide.',
      ticketsIntro: 'Su questa linea circolano sia il TGV INOUI della SNCF sia il low cost Ouigo, quindi conviene confrontarli:',
      tickets: [
        ['Ouigo (low cost)', 'Un treno preciso, regole rigide sui bagagli', 'Il più economico. Le corse singole indicative partono spesso da circa 10–25 € se prenoti presto.'],
        ['TGV INOUI Prem’s / anticipato', 'Un treno preciso', 'Prezzo intermedio; le corse singole indicative partono spesso da circa 25–60 € se prenoti in anticipo.'],
        ['TGV INOUI flessibile', 'Qualsiasi treno, con cambi', 'Il più caro; utile se i tuoi piani possono cambiare.']
      ],
      ticketTips: [
        'Confronta Ouigo e TGV INOUI lo stesso giorno; Ouigo non è sempre il più economico una volta aggiunti bagagli e posto.',
        'Una <strong>carta giovani o senior</strong> della SNCF può ridurre molte tariffe di circa il 30 %.',
        'Prenota appena si apre la vendita per la tua data; i posti più economici vanno via per primi.'
      ],
      when: 'I venerdì, le domeniche e le vacanze scolastiche sono i più affollati. In settimana a metà mattina è di solito il momento più economico e tranquillo. Lascia tempo a Gare de Lyon, grande e con più sale per i treni.',
      arrivalIntro: 'Lione è compatta e un piacere da girare a piedi. Da vedere:',
      arrival: [
        '<strong>Vieux Lyon e le traboules</strong> — la città vecchia rinascimentale e i suoi passaggi nascosti.',
        '<strong>La basilica di Fourvière</strong> — ci si sale in funicolare da Vieux Lyon, per la vista migliore sulla città.',
        '<strong>Les Halles de Lyon Paul Bocuse</strong> — il mercato coperto, ottimo per pranzare.',
        '<strong>La Presqu’île e la Croix-Rousse</strong> — vie dello shopping, piazze e l’antico quartiere dei setaioli.'
      ],
      alt: [
        '<strong>Pullman</strong> — i servizi impiegano circa cinque o sei ore e sono più economici ma molto più lenti.',
        '<strong>Auto</strong> — circa quattro ore e mezza–cinque, più pedaggi e parcheggio in città.',
        '<strong>Aereo</strong> — poco pratico per questa coppia; il treno è più veloce da porta a porta.'
      ]
    },
    'paris-bordeaux': {
      stations: [
        '<strong>Paris Montparnasse</strong> è la stazione di partenza della linea ad alta velocità atlantica, con le linee 4, 6, 12 e 13 della metropolitana.',
        '<strong>Bordeaux Saint-Jean</strong> è a circa 3 km a sud del centro. Il tram la collega alla Place de la Bourse e alla città vecchia in circa 15–20 minuti.'
      ],
      times: 'Da quando nel 2017 è stata aperta la linea ad alta velocità per Bordeaux, i TGV più veloci impiegano poco più di due ore. Le partenze sono frequenti durante il giorno, dal mattino presto alla sera, quindi un’escursione in giornata in entrambi i sensi è realistica, anche se una notte a Bordeaux è molto più rilassante.',
      ticketsIntro: 'Il TGV INOUI della SNCF e il low cost Ouigo servono Bordeaux, e i prezzi possono variare molto a seconda della data:',
      tickets: [
        ['Ouigo (low cost)', 'Un treno preciso, regole rigide sui bagagli', 'Il più economico. Le corse singole indicative partono spesso da circa 15–30 € se prenoti presto.'],
        ['TGV INOUI anticipato', 'Un treno preciso', 'Prezzo intermedio; le corse singole indicative partono spesso da circa 30–70 € se prenoti in anticipo.'],
        ['TGV INOUI flessibile', 'Qualsiasi treno, con cambi', 'Il più caro.']
      ],
      ticketTips: [
        'Prenota il prima possibile; i treni di venerdì e domenica sono i primi a esaurire le tariffe basse.',
        'Una <strong>carta giovani o senior</strong> della SNCF può ridurre molte tariffe di circa il 30 %.',
        'Confronta Ouigo e TGV INOUI lo stesso giorno.'
      ],
      when: 'I venerdì, le domeniche e le vacanze estive sono i più affollati e cari. I treni infrasettimanali a metà mattina sono di solito i più economici. Bordeaux è molto richiesta anche nelle settimane della vendemmia, quindi prenota presto l’alloggio.',
      arrivalIntro: 'Bordeaux è una città elegante e molto piacevole a piedi. Da vedere:',
      arrival: [
        '<strong>Place de la Bourse e il Miroir d’eau</strong> — la piazza settecentesca e lo specchio d’acqua sui lungofiume.',
        '<strong>La Cité du Vin</strong> — un museo dedicato al mondo del vino, sul fiume.',
        '<strong>Il quartiere dei Chartrons</strong> — antiquari, caffè e commercianti di vino.',
        '<strong>Saint-Émilion</strong> — un borgo medievale del vino, a circa 35 minuti di treno da Bordeaux.'
      ],
      alt: [
        '<strong>Pullman</strong> — i servizi impiegano circa sette ore, molto più del treno.',
        '<strong>Auto</strong> — circa cinque ore e mezza più pedaggi.',
        '<strong>Aereo</strong> — circa un’ora in aria, ma con trasferimenti e controlli il treno è competitivo.'
      ]
    },
    'paris-nice': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> è la stazione di partenza verso il sud della Francia, con le linee 1 e 14 della metropolitana e le RER A e D.',
        '<strong>Nice-Ville</strong> è la stazione principale, a un breve tragitto in tram o a circa 15–20 minuti a piedi dalla Promenade des Anglais e dalla città vecchia.'
      ],
      times: 'Il TGV diretto impiega circa 5 h 30 min–6 h, con solo pochi treni diretti al giorno, quindi conviene scegliere prima la partenza. La linea passa da Lione, Marsiglia e lungo la Costa Azzurra, il che rende pittoresca la seconda metà del viaggio. In alcune date ha circolato anche un treno notturno su questa tratta, quindi controlla l’orario in tempo reale.',
      ticketsIntro: 'Le tariffe dipendono da quanto prenoti in anticipo e da quale dei pochi treni diretti scegli:',
      tickets: [
        ['Anticipato (TGV INOUI Prem’s)', 'Un treno preciso', 'Il più economico. Le corse singole indicative partono spesso da circa 30–70 € se prenoti presto.'],
        ['TGV INOUI standard', 'Una certa flessibilità per cambiare', 'Prezzo intermedio.'],
        ['TGV INOUI flessibile / prima', 'Completamente flessibile o prima classe', 'Il più caro.']
      ],
      ticketTips: [
        'Prenota presto per l’estate; la Costa Azzurra è più affollata da giugno a settembre.',
        'Una <strong>carta giovani o senior</strong> della SNCF può ridurre molte tariffe di circa il 30 %.',
        'Confronta il treno diretto con un cambio a Lione o a Marsiglia; il diretto è quasi sempre più semplice.'
      ],
      when: 'I venerdì, le domeniche e le vacanze scolastiche sono i più cari. Luglio e agosto sono i mesi più affollati. Le partenze infrasettimanali al mattino offrono di solito il miglior prezzo.',
      arrivalIntro: 'Nizza è una città compatta; uno o due giorni sono un buon inizio. Da vedere:',
      arrival: [
        '<strong>La Promenade des Anglais</strong> — il viale sul mare lungo la baia.',
        '<strong>Vieux Nice e il mercato del Cours Saleya</strong> — vicoli, bancarelle di cibo e il mercato dei fiori.',
        '<strong>La collina del Castello</strong> — una breve salita per la vista sulla baia e sul porto.',
        '<strong>Escursioni costiere in treno</strong> — Monaco, Antibes e Cannes sono sulla stessa linea.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 30 in aria, e l’aeroporto di Nizza è a un breve tragitto in tram dal centro, quindi è competitivo nei tempi.',
        '<strong>Pullman</strong> — un’opzione notturna o di giornata molto lunga, di circa dodici ore, molto più economica.',
        '<strong>Auto</strong> — circa otto o nove ore più pedaggi.'
      ]
    },
    'paris-barcelona': {
      stations: [
        '<strong>Paris Gare de Lyon</strong> è la stazione di partenza, con le linee 1 e 14 della metropolitana e le RER A e D.',
        '<strong>Barcelona Sants</strong> è la stazione principale, con le linee L3 e L5 della metropolitana e la rete Rodalies; il centro è a un breve tragitto in metro.'
      ],
      times: 'Il treno diretto ad alta velocità impiega circa 6 h 30 min–7 h, con un piccolo numero di partenze dirette al giorno. Attraversa il sud della Francia e supera i Pirenei senza cambi, di solito con fermate come Girona e Figueres sul versante spagnolo. Poiché i treni diretti sono pochi, pianifica attorno alla partenza e non al prezzo.',
      ticketsIntro: 'I biglietti diretti sono venduti con un’unica tariffa ad alta velocità, e i più economici riguardano un treno preciso:',
      tickets: [
        ['Anticipato', 'Un treno preciso', 'Il più economico. Le corse singole indicative partono spesso da circa 35–80 € se prenoti presto.'],
        ['Standard', 'Una certa flessibilità per cambiare', 'Prezzo intermedio.'],
        ['Flessibile / prima', 'Completamente flessibile o prima classe', 'Il più caro.']
      ],
      ticketTips: [
        'Prenota presto per l’estate e i fine settimana di vacanza; i treni diretti si esauriscono.',
        'Confronta il treno diretto con un cambio a Lione, Montpellier o Perpignano, che può costare meno ma richiede più tempo.',
        'La linea attraversa il confine senza controlli nell’area Schengen, ma porta un documento d’identità.'
      ],
      when: 'I venerdì, le domeniche, le vacanze scolastiche e l’estate sono i più affollati. Le partenze infrasettimanali al mattino offrono di solito il miglior prezzo.',
      arrivalIntro: 'Barcellona è grande e vivace, con le zone migliori abbastanza vicine tra loro. Da vedere:',
      arrival: [
        '<strong>La Sagrada Família e l’Eixample di Gaudí</strong> — prenota i biglietti in anticipo; le code sono lunghe.',
        '<strong>Il Barrio Gótico e La Rambla</strong> — il centro storico; tieni a portata di mano gli oggetti di valore.',
        '<strong>Il Park Güell e il quartiere di Gràcia</strong> — un mix di Gaudí e strade da paese.',
        '<strong>La spiaggia e la Barceloneta</strong> — a un breve tragitto in metro dal centro.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 45 in aria, ma trasferimenti e controlli riducono il vantaggio sul treno.',
        '<strong>Pullman</strong> — i servizi impiegano circa quattordici ore o più.',
        '<strong>Auto</strong> — circa otto o nove ore più pedaggi.'
      ]
    },
    'basel-paris': {
      stations: [
        '<strong>Basel SBB</strong> è la stazione svizzera, con la Città Vecchia e il Reno a circa 15 minuti a piedi; i tram partono davanti alla stazione. Il lato francese, Basel SNCF, fa parte dello stesso complesso.',
        '<strong>Paris Gare de l’Est</strong> è il capolinea parigino per la Francia orientale e la Svizzera, con le linee 4, 5 e 7 della metropolitana e collegamenti RER vicini.'
      ],
      times: 'Il TGV diretto impiega circa tre ore e parte più volte al giorno sulla linea che passa da Mulhouse, quindi di solito puoi scegliere una partenza adatta a te. La Svizzera è fuori dall’UE, quindi porta il passaporto o la carta d’identità.',
      ticketsIntro: 'TGV INOUI e TGV Lyria servono Basilea, e le tariffe variano a seconda del treno e dell’anticipo:',
      tickets: [
        ['Anticipato', 'Un treno preciso', 'Il più economico. Le corse singole indicative partono spesso da circa 25–60 € se prenoti presto.'],
        ['Standard', 'Una certa flessibilità per cambiare', 'Prezzo intermedio.'],
        ['Flessibile / prima', 'Completamente flessibile o prima classe', 'Il più caro.']
      ],
      ticketTips: [
        'Prenota appena si apre la vendita per la tua data; le tariffe più economiche vanno via per prime.',
        'Una <strong>carta giovani o senior</strong> della SNCF può ridurre molte tariffe di circa il 30 %.',
        'Confronta il treno diretto con un cambio a Strasburgo o a Mulhouse; il diretto è di solito più semplice.'
      ],
      when: 'I venerdì, le domeniche e le vacanze scolastiche sono i più affollati. Le partenze infrasettimanali al mattino offrono di solito il miglior prezzo. Basilea è affollata anche durante le grandi fiere, quindi prenota presto.',
      arrivalIntro: 'Basilea è compatta e facile da vedere a piedi. Da vedere:',
      arrival: [
        '<strong>La Città Vecchia e il Münster</strong> — la cattedrale e le strade strette intorno.',
        '<strong>La passeggiata sul Reno</strong> — d’estate gli abitanti fanno il bagno nel fiume.',
        '<strong>I musei</strong> — Basilea ha una ricca offerta di musei d’arte, tra cui il Kunstmuseum.',
        '<strong>Escursioni in treno</strong> — Lucerna, Berna e Zurigo sono tutte a una o due ore.'
      ],
      alt: [
        '<strong>Aereo</strong> — esiste un volo breve, ma i trasferimenti lo rendono poco competitivo per questa coppia.',
        '<strong>Pullman</strong> — i servizi impiegano circa otto ore; più economici ma più lenti.',
        '<strong>Auto</strong> — circa cinque ore, più pedaggi e vignetta autostradale svizzera.'
      ]
    },
    'frankfurt-paris': {
      stations: [
        '<strong>Frankfurt Hauptbahnhof</strong> è un grande nodo con S-Bahn, U-Bahn e collegamenti a lunga percorrenza; il centro è a pochi passi.',
        '<strong>Paris Gare de l’Est</strong> serve la Francia orientale e la Germania, con le linee 4, 5 e 7 della metropolitana vicine.'
      ],
      times: 'Il treno diretto impiega circa quattro ore, e pochi servizi diretti ICE e TGV circolano ogni giorno passando da Saarbrücken o Strasburgo, quindi scegli prima la partenza. Esistono opzioni più lente con cambio, ma di solito sono meno comode.',
      ticketsIntro: 'Deutsche Bahn e SNCF vendono entrambe biglietti su questa linea, con tariffe economiche per un treno preciso:',
      tickets: [
        ['Saver (Sparpreis Europa / Prem’s)', 'Un treno preciso', 'Il più economico. Le corse singole indicative partono spesso da circa 30–60 € se prenoti presto.'],
        ['Standard', 'Una certa flessibilità per cambiare', 'Prezzo intermedio.'],
        ['Flessibile', 'Qualsiasi treno, con cambi', 'Il più caro.']
      ],
      ticketTips: [
        'Confronta lo stesso treno venduto da Deutsche Bahn e da SNCF; il prezzo può differire.',
        'Una <strong>BahnCard</strong> o una <strong>carta sconto SNCF</strong> può ridurre molte tariffe.',
        'Prenota un posto su un treno affollato; le prenotazioni sono incluse in molte tariffe economiche.'
      ],
      when: 'I venerdì, le domeniche e le vacanze scolastiche sono i più affollati. I treni infrasettimanali a metà mattina sono di solito i più economici.',
      arrivalIntro: 'Francoforte è una città d’affari compatta con una vivace riva del fiume. Da vedere:',
      arrival: [
        '<strong>Il Römerberg e la città vecchia</strong> — una piazza medievale ricostruita.',
        '<strong>Il Museumsufer</strong> — un tratto del fiume Meno costeggiato da musei, tra cui lo Städel.',
        '<strong>Sachsenhausen</strong> — un quartiere noto per le taverne del sidro.',
        '<strong>Escursioni in treno</strong> — Heidelberg, Magonza e Wiesbaden sono tutte a meno di un’ora.'
      ],
      alt: [
        '<strong>Aereo</strong> — circa 1 h 20 in aria, ma trasferimenti e controlli riducono il vantaggio sul treno.',
        '<strong>Pullman</strong> — i servizi impiegano circa otto o nove ore; più economici ma più lenti.',
        '<strong>Auto</strong> — circa sei ore a seconda del traffico.'
      ]
    }
  }
};
