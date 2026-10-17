// Textos de las fichas de ruta en japonés. Las ciudades se sustituyen al generar.
module.exports = {
  titleTemplate: (from, to) => `${from}から${to}への列車（2026）| 時刻と安い切符`,
  descriptionTemplate: (from, to) => `${from}から${to}への列車。いちばん安い運賃、公式の時刻、運行会社の比較。自分の通貨で安全に予約できます。`,
  ogTitleTemplate: (from, to) => `${from}から${to}へ、列車の旅：2026年ガイド`,
  ogDescriptionTemplate: (from, to) => `${from} → ${to}の列車。路線、駅、運行会社、予約のしかた。`,
  twitterTitleTemplate: (from, to) => `${from}から${to}へ、列車の旅：2026年ガイド`,
  twitterDescriptionTemplate: (from, to) => `${from} → ${to}の列車。路線、駅、運行会社、予約のしかた。`,
  backText: 'すべての路線',
  badgeLabel: '路線ガイド',
  mainTitle: '{{from}}から{{to}}への列車',
  metaText: 'WoW Train · 2026年7月更新 · 読了4分',
  leadVariants: [
    '{{operator}}が{{from}}と{{to}}を約{{duration}}で結びます。{{country}}の景色を通り抜ける、乗り心地のよい列車です。',
    '{{from}}から{{to}}へ、列車なら{{operator}}でおよそ{{duration}}。飛行機に代わる、わかりやすい行き方です。',
    '{{operator}}の{{from}}–{{to}}は約{{duration}}。車を使わずに{{country}}を越える、いちばん落ち着いた方法のひとつです。'
  ],
  klookTitle: 'Omioで<span class="klook-cta-city">{{from}}</span> &rarr; <span class="klook-cta-city">{{to}}</span>を予約',
  klookSubtitle: '{{operator}} · {{duration}} · 時刻と運賃はOmioで',
  klookBtnLabel: '切符を予約',
  checkSchedulesText: '時刻を見て予約 →',
  opensNewTabText: '新しいタブで開きます。このページにはいつでも戻れます。',
  howLongTitle: '{{from}}から{{to}}の列車はどのくらい？',
  howLongVariants: [
    'いちばん速い列車で約{{duration}}。1日に何本もあります。日付の時刻表を確認してください。',
    '最速の列車でおよそ{{duration}}。出発は1日に何度もあるので、予定に合う便が見つかります。',
    '最速でも駅から駅まで約{{duration}}を見てください。遅い乗り継ぎもあります。出発日の時刻を確認してください。'
  ],
  whoRunsTitle: '{{from}}から{{to}}はどの列車？',
  whoRunsVariants: [
    'この路線は{{operator}}が走らせています。その日の出発を一度に比べると、時間と運賃のよい組み合わせが見つかります。',
    '{{operator}}が運行しています。その日の列車をまとめて探すと、希望の運賃に合う出発が選べます。',
    'この区間は{{operator}}です。その日の列車をまとめて見るのが、安い席を見つけるいちばん早い方法です。'
  ],
  priceTitle: '{{from}}から{{to}}の運賃（2026）',
  priceText: '早めの運賃は{{price}}前後から。出発日が近づくと上がります。',
  hotelSectionTitle: '泊まる場所',
  localInsightHeading: '知っておくと役立つこと',
  bestFareTitle: '安く乗るには',
  bestFareVariants: [
    [
      '<strong>早めに予約する。</strong>いちばん安い運賃から売れます。当日より、かなり安くなることがあります。',
      '<strong>ピークを外す。</strong>午前の中頃や週の中日は、空いていて安いことが多いです。',
      '<strong>一等も見てみる。</strong>多くの路線では、追加料金は小さく、席はかなり楽です。',
      '<strong>まとめて比べる。</strong>その日の出発を一度に見られます。'
    ],
    [
      '<strong>安い枠は先に押さえる。</strong>最安の区分は数が少なく、先になくなります。',
      '<strong>金曜と日曜の混雑を避ける。</strong>平日の午前中は、空いていて安いことが多いです。',
      '<strong>一等の値段も確認する。</strong>普通席との差が小さいことがあります。',
      '<strong>運行会社を一度に検索する。</strong>サイトを一つずつ見るより早いです。'
    ],
    [
      '<strong>前もって買う。</strong>出発日が近づくと、運賃は大きく上がることがあります。',
      '<strong>出発を少しずらす。</strong>混む時間の1時間前か後で、運賃がはっきり下がることがあります。',
      '<strong>長い路線では一等を候補に残す。</strong>差額は思ったより小さいことがあります。',
      '<strong>出発を並べて比べる。</strong>最初に出た便ですぐ予約しない。'
    ]
  ],
  readyText: '出発するなら、{{from}} → {{to}}の時刻と運賃を確認して席を予約。安全な支払い、モバイル切符、運行会社を一度に検索できます。',
  compareText: '鉄道会社をすべて比べたい場合はこちら。',
  moreRoutesTitle: 'ヨーロッパのほかの列車路線',
  trainSegmentTitle: '{{from}} → {{to}}',
  trainSegmentDuration: '所要時間：{{duration}}',
  trainSegmentOperator: '運行会社：{{operator}}',
  trainSegmentStation: '駅：{{station}}',
  bookTicketBtn: '時刻を見て切符を予約 →',
  hotelCardPrice: 'いまの料金を見る →',
  economicLink: '手ごろな宿を見る',
  transferLink: '{{to}}の送迎を予約 →',
  faqHeading: 'よくある質問',
  priceHeadOperator: '運行会社',
  priceHeadFrom: '運賃',
  priceHeadTime: '所要時間',
  priceHeadFreq: '本数',
  priceFreq: '1日に数本',
  priceNote: '表示は早めに買う場合のめやすです。出発日の空席は予約画面で確認してください。',
  photoAlts: ['{{to}}の景色', '{{to}}の街並み', '{{to}}の建物'],
  faqVariants: [
    [
      { q: '{{from}}から{{to}}の列車はどのくらい？', a: '最速で約{{duration}}。1日に何本も出ています。' },
      { q: '{{from}}から{{to}}の運賃は？', a: '早めの運賃は{{price}}前後から。出発日が近づくと上がるので、早い予約がいちばん安くなります。' },
      { q: '{{from}}から{{to}}はどの会社？', a: '{{operator}}が運行しています。その日の出発を一度に比べると、時間と運賃のよい組み合わせが見つかります。' },
      { q: '{{from}}から{{to}}に直通はある？', a: '{{operator}}が{{from}}と{{to}}を結びます。直通か乗り継ぎかは、出発日の時刻表で確認できます。' },
      { q: '{{from}}から{{to}}はいつ予約すると安い？', a: '最安の運賃は数週間から数か月前に出て、先に売れます。早めの予約と、平日やピーク以外が有利です。' }
    ],
    [
      { q: '{{from}}と{{to}}の所要時間は？', a: '最速で約{{duration}}。1日に複数あるので、時刻表から便を選んでください。' },
      { q: '{{from}}から{{to}}のふつうの運賃は？', a: '早めに買うと{{price}}前後から。出発が近づくと上がります。安く抑えるには早めの予約です。' },
      { q: '{{from}}と{{to}}の列車は誰が走らせている？', a: '{{operator}}です。その日の出発をまとめて見ると、時間と値段を合わせやすいです。' },
      { q: '{{from}}から{{to}}は乗り換えなしで行ける？', a: '{{operator}}が結んでいます。直通かどうかは、その日の時刻表に出ます。' },
      { q: '{{from}}から{{to}}は何日前に予約する？', a: '最安は出発の数週間から数か月前に出て、すぐなくなります。早めに、混む日を外すと有利です。' }
    ],
    [
      { q: '{{from}}から{{to}}は列車で何時間？', a: '最速で約{{duration}}。1日に何本もあるので、当日の時刻を確認してください。' },
      { q: '{{from}}から{{to}}の切符はいくら？', a: '早めに買うとおよそ{{price}}から。出発日が近づくほど上がります。' },
      { q: '{{from}}–{{to}}はどの運行会社？', a: '{{operator}}です。その日の出発を一つの画面で比べるのが、時間と運賃のよい組み合わせを見つける近道です。' },
      { q: '{{from}}と{{to}}のあいだで乗り換える？', a: '日によります。{{operator}}には直通と乗り継ぎがあります。出発日の時刻表で確認してください。' },
      { q: '{{from}}から{{to}}を安く予約するならいつ？', a: 'できるだけ早く。安い席から売れます。週末より平日のほうが安いことが多いです。' }
    ]
  ]
};
