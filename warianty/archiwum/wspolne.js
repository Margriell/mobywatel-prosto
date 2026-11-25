/* =====================================================================
   mObywatel Prosto — część wspólna wariantów ekranu Start (runda 2).
   Zwykły skrypt (bez modułów i bez fetch), więc działa po dwukliku
   w pliku i na GitHub Pages. Każdy wariant (b1.js, b2.js, b3.js)
   dopisuje się do window.WARIANTY, a ten plik wkleja go do ekranu.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Ikony: Lucide (licencja MIT), wklejone jako SVG ---------- */
  var IKONY = {
    dom: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    dokument: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    lista: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    rozmowa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    skrzynka: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    ustawienia: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    list: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    portfel: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    auto: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    pinezka: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    dowod: '<path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/>',
    siatka: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    mikrofon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    wyslij: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    dalej: '<path d="m9 18 6-6-6-6"/>',
    iskry: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'
  };
  function ikona(nazwa, klasa) {
    return '<svg class="ikona' + (klasa ? ' ' + klasa : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + IKONY[nazwa] + '</svg>';
  }

  /* Neutralny znak (zamiast godła i logo mObywatela) */
  function znak(tlo, kreska) {
    return '<svg class="znak" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="9" fill="' + tlo + '"/><path d="M9 16.5l4.5 4.5L23 11" stroke="' + kreska + '" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- Dane fikcyjne: Halina ---------- */
  var DANE = {
    imie: 'Halina',
    wolacz: 'Halino',
    inicjal: 'H',
    pilne: {
      etykieta: 'Nowe pismo',
      tekst: 'Urząd Miasta przysłał pismo o podatku od nieruchomości.',
      przycisk: 'Przeczytaj pismo',
      cel: 'Skrzynkę z tym pismem',
      ikona: 'list'
    },
    sprawy: [
      { nazwa: 'Zgubione dokumenty', opis: 'Zastrzeż dowód i PESEL', ikona: 'portfel', cel: 'sprawę „Zgubione dokumenty”' },
      { nazwa: 'Mój samochód', opis: 'OC i badanie techniczne', ikona: 'auto', cel: 'sprawę „Mój samochód”' },
      { nazwa: 'Meldunek', opis: 'Zamelduj się pod nowym adresem', ikona: 'pinezka', cel: 'sprawę „Zameldowanie”' },
      { nazwa: 'Pokaż mDowód', opis: 'Dowód osobisty w telefonie', ikona: 'dowod', cel: 'Twój mDowód' },
      { nazwa: 'Skrzynka', opis: 'Pisma i potwierdzenia', ikona: 'skrzynka', cel: 'Skrzynkę z wiadomościami' },
      { nazwa: 'Wszystkie sprawy', opis: 'Pełna lista spraw', ikona: 'siatka', cel: 'listę wszystkich spraw' }
    ],
    podpowiedzi: ['Zginął mi dowód', 'Do kiedy mam OC?', 'Jak się zameldować?'],
    poleEtykieta: 'Napisz lub powiedz, co chcesz załatwić',
    mikrofonOpis: 'W gotowej aplikacji powiesz to głosem. Jeśli przeglądarka tego nie umie, przycisk wyjaśni, że trzeba pisać.'
  };

  /* ---------- Wspólne kawałki HTML ---------- */
  function pasekDolny() {
    var zakladki = [
      ['Start', 'dom', ''], ['Dokumenty', 'dokument', 'zakładkę Dokumenty'], ['Sprawy', 'lista', 'zakładkę Sprawy'],
      ['Asystent', 'rozmowa', 'zakładkę Asystent'], ['Skrzynka', 'skrzynka', 'zakładkę Skrzynka']
    ];
    return '<nav class="pasek-dolny" aria-label="Menu główne"><ul>' + zakladki.map(function (z, i) {
      var atrybuty = i === 0 ? ' aria-current="page" data-akcja="gora"' : ' data-cel="' + z[2] + '"';
      return '<li><button type="button"' + atrybuty + '><span class="pasek-ikona">' + ikona(z[1]) + '</span><span class="pasek-podpis">' + z[0] + '</span></button></li>';
    }).join('') + '</ul></nav>';
  }
  var OKNO = '<dialog class="okno" aria-labelledby="okno-tytul" aria-describedby="okno-tekst">' +
    '<h2 id="okno-tytul">To jest podgląd wyglądu</h2><p id="okno-tekst"></p>' +
    '<button type="button" class="okno-zamknij">Zamknij</button></dialog>';

  /* ---------- Wspólny CSS (wewnątrz każdego ekranu) ---------- */
  var BAZA_CSS = [
    ':host{all:initial;display:block;font-family:"Atkinson Hyperlegible",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;',
    'font-size:1rem;line-height:1.5;color:#1A1F27;',
    '--granat:#123A6B;--granat-2:#1D4F8C;--czerwien:#B42318;--czerwien-tlo:#FDECEA;--szary:#4A5563;--fokus:#1A1A1A}',
    '*,*::before,*::after{box-sizing:border-box}',
    'h1,h2,h3,p{margin:0}ul{list-style:none;margin:0;padding:0}',
    'button,input{font:inherit;color:inherit;margin:0}',
    'button{cursor:pointer;min-height:48px;min-width:48px}',
    ':focus-visible{outline:3px solid var(--fokus);outline-offset:3px}',
    '.ikona{width:1.5rem;height:1.5rem;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.znak{width:2rem;height:2rem;flex:none}',
    '.telefon{min-height:var(--wysokosc-ekranu,100dvh);display:flex;flex-direction:column;background:var(--tlo,#fff)}',
    'main{flex:1}',
    /* Dolny pasek: zawsze 1 rząd, podpisy stałe 16 px (nie rosną z rozmiarem tekstu) */
    '.pasek-dolny{position:sticky;bottom:0;z-index:3;background:var(--pasek-tlo,#fff);container-type:inline-size}',
    '.pasek-dolny ul{display:flex;gap:8px;padding:4px 6px}',
    '.pasek-dolny li{flex:1 1 auto;min-width:48px}',
    '.pasek-dolny button{position:relative;width:100%;min-height:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'gap:2px;padding:4px 0;background:none;border:0;color:var(--pasek-kolor,var(--szary));font-size:16px;line-height:20px;white-space:nowrap}',
    '.pasek-dolny .ikona{width:24px;height:24px}',
    '.pasek-ikona{display:grid;place-items:center;height:30px;padding:0 10px;border-radius:999px}',
    '.pasek-dolny button[aria-current="page"]{color:var(--granat);font-weight:700}',
    /* Bardzo wąski ekran (np. 320 px): lekko ściśnięte litery, żeby 5 podpisów 16 px zmieściło się w 1 rzędzie z odstępem 8 px */
    '@container (max-width:360px){.pasek-dolny ul{padding:4px 0}.pasek-dolny button{letter-spacing:-.05em}.pasek-ikona{padding:0 4px}}',
    /* Okno „to tylko podgląd” — nie znika samo */
    '.okno{width:min(22rem,calc(100vw - 2rem));max-height:calc(100dvh - 2rem);overflow-y:auto;border:3px solid var(--granat);',
    'border-radius:var(--okno-zaokraglenie,16px);padding:1.25rem;color:#1A1F27;font-family:inherit;font-size:1rem;line-height:1.5}',
    '.okno::backdrop{background:rgba(10,20,35,.55)}',
    '.okno h2{font-size:1.25rem;line-height:1.3;color:var(--granat);margin-bottom:.5rem}.okno p{margin-bottom:1rem}',
    '.okno-zamknij{width:100%;min-height:56px;background:var(--granat);color:#fff;border:2px solid var(--granat);border-radius:var(--przycisk-zaokraglenie,12px);font-weight:700}',
    '@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}'
  ].join('\n');

  /* ---------- Rozmiar tekstu: JEDNA zmienna --tekst ---------- */
  var ROZMIARY = { 'standardowy': '112.5%', 'duzy': '137.5%', 'bardzo-duzy': '162.5%' };
  function ustawRozmiar(nazwa) {
    if (!ROZMIARY[nazwa]) nazwa = 'duzy'; /* Halina: domyślnie Duży tekst */
    document.documentElement.style.setProperty('--tekst', ROZMIARY[nazwa]);
    var radio = document.querySelector('input[name="rozmiar"][value="' + nazwa + '"]');
    if (radio) radio.checked = true;
    return nazwa;
  }
  function rozmiarZAdresu() {
    try { return new URLSearchParams(location.search).get('tekst'); } catch (e) { return null; }
  }
  function podlaczPrzelacznik() {
    var radia = document.querySelectorAll('input[name="rozmiar"]');
    Array.prototype.forEach.call(radia, function (radio) {
      radio.addEventListener('change', function () {
        ustawRozmiar(radio.value);
        try { var u = new URL(location.href); u.searchParams.set('tekst', radio.value); history.replaceState(null, '', u); } catch (e) {}
      });
    });
  }

  /* ---------- Wklejenie wariantu do ekranu ---------- */
  function zamontuj(host, klucz) {
    var wariant = (window.WARIANTY || {})[klucz];
    if (!wariant) { host.textContent = 'Nie udało się wczytać wariantu ' + klucz + '.'; return; }
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    root.innerHTML = '<style>' + BAZA_CSS + '\n' + wariant.css + '</style>' +
      wariant.html(DANE, ikona, znak) + OKNO;

    var okno = root.querySelector('.okno');
    var oknoTekst = root.querySelector('#okno-tekst');
    function pokaz(opis) {
      oknoTekst.textContent = opis;
      if (okno.showModal) okno.showModal(); else okno.setAttribute('open', '');
    }
    root.querySelector('.okno-zamknij').addEventListener('click', function () {
      if (okno.close) okno.close(); else okno.removeAttribute('open');
    });
    root.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-cel], [data-opis], [data-akcja]');
      if (!el) return;
      if (el.getAttribute('data-akcja') === 'gora') { host.scrollTop = 0; window.scrollTo(0, 0); return; }
      pokaz(el.getAttribute('data-opis') ||
        ('Ten plik pokazuje tylko wygląd ekranu Start. W gotowej aplikacji ten przycisk otworzy: ' + el.getAttribute('data-cel') + '.'));
    });
    root.addEventListener('submit', function (e) {
      e.preventDefault();
      pokaz('W gotowej aplikacji asystent rozpozna Twoją sprawę. Potem poprowadzi Cię krok po kroku.');
    });
  }

  window.WARIANTY = window.WARIANTY || {};
  window.Prototyp = {
    zamontuj: zamontuj, ustawRozmiar: ustawRozmiar, rozmiarZAdresu: rozmiarZAdresu,
    podlaczPrzelacznik: podlaczPrzelacznik, pasekDolny: pasekDolny, DANE: DANE
  };
})();
