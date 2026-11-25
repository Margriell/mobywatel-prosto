/* =====================================================================
   mObywatel dla każdego — runda 3: wspólny UKŁAD ekranu Dokumenty.
   Układ jest jeden (dokładnie według specyfikacji 2.0). Warianty wyglądu
   (wyglad-1.js, wyglad-2.js, wyglad-3.js) zmieniają tylko kolory, kształty,
   typografię i wygląd karty mDowodu — przez zmienne CSS.
   Zwykły skrypt (bez modułów, bez fetch, bez iframe): działa po dwukliku
   i na GitHub Pages.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Ikony: Lucide (licencja MIT), wklejone jako SVG ---------- */
  var IKONY = {
    skrzynka: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    dowod: '<path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/>',
    prawojazdy: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    auto: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    rodzina: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    list: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    mikrofon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    wyslij: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    dalej: '<path d="m9 18 6-6-6-6"/>',
    rozmowa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    iskry: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    uslugi: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    wiecej: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    dokumenty: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'
  };
  function ikona(nazwa, klasa) {
    return '<svg class="ikona' + (klasa ? ' ' + klasa : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + IKONY[nazwa] + '</svg>';
  }
  /* Znak aplikacji: czerwony kwadrat z zaokrąglonymi rogami i prostym białym znakiem własnego projektu (bez godła) */
  var ZNAK = '<svg class="znak" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
    '<rect x="1" y="1" width="30" height="30" rx="8" fill="#C8102E" stroke="var(--znak-obwodka, transparent)" stroke-width="2"/>' +
    '<path d="M9 16.5l4.5 4.5L23 11" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- Dane fikcyjne: Halina ---------- */
  var DANE = {
    wolacz: 'Halino', imie: 'Halina', nazwisko: 'Wiśniewska', inicjaly: 'HW',
    dowodWazny: '12.03.2031', noweWiadomosci: 1,
    dokumenty: [
      { nazwa: 'mPrawo jazdy', status: 'Ważne do 04.09.2033', ikona: 'prawojazdy', cel: 'szczegóły mPrawa jazdy' },
      { nazwa: 'Moje pojazdy', status: '1 pojazd, OC ważne', ikona: 'auto', cel: 'listę Twoich pojazdów' },
      { nazwa: 'Karta Dużej Rodziny', status: 'Ważna bezterminowo', ikona: 'rodzina', cel: 'szczegóły Karty Dużej Rodziny' }
    ],
    pytania: ['Zginął mi portfel', 'Do kiedy mam OC?', 'Jak zastrzec PESEL?'],
    mikrofonOpis: 'W gotowej aplikacji powiesz to głosem. Jeśli przeglądarka tego nie umie, przycisk wyjaśni, że trzeba pisać.'
  };

  /* ---------- Układ ekranu (ten sam we wszystkich wariantach) ---------- */
  function uklad(d) {
    var zakladki = [['Dokumenty', 'dokumenty', ''], ['Usługi', 'uslugi', 'zakładkę Usługi'], ['Asystent', 'rozmowa', 'zakładkę Asystent'],
      ['Kod QR', 'qr', 'zakładkę Kod QR'], ['Więcej', 'wiecej', 'zakładkę Więcej']];
    return '<div class="telefon">' +
      '<div class="gora">' +
        '<header class="naglowek">' +
          '<div class="marka">' + ZNAK + '<span>mObywatel</span></div>' +
          '<div class="naglowek-przyciski">' +
            '<button type="button" class="ikonowy" data-cel="panel „Wygląd i dostępność” (ten sam co w Więcej)"><span class="aa" aria-hidden="true">Aa</span><span class="ikonowy-podpis">Wygląd</span></button>' +
            '<button type="button" class="ikonowy" aria-label="Skrzynka, ' + d.noweWiadomosci + ' nowa wiadomość" data-cel="Skrzynkę z wiadomościami">' +
              '<span class="ikona-licznik">' + ikona('skrzynka') + '<span class="licznik" aria-hidden="true">' + d.noweWiadomosci + '</span></span><span class="ikonowy-podpis" aria-hidden="true">Skrzynka</span></button>' +
          '</div>' +
        '</header>' +
        '<h1>Dzień dobry, ' + d.wolacz + '</h1>' +
      '</div>' +
      '<main>' +
        '<section aria-labelledby="h-dok"><h2 id="h-dok" class="ukryte">Twoje dokumenty</h2>' +
          '<article class="mdowod" aria-labelledby="h-mdowod">' +
            '<div class="mdowod-gora"><h3 id="h-mdowod" class="mdowod-typ">mDowód</h3><span class="mdowod-chip" aria-hidden="true"></span></div>' +
            '<div class="mdowod-srodek">' +
              '<span class="mdowod-foto" aria-hidden="true">' + d.inicjaly + '</span>' +
              '<dl class="mdowod-dane">' +
                '<dt>Imię i nazwisko</dt><dd class="mdowod-imie">' + d.imie + ' ' + d.nazwisko + '</dd>' +
                '<dt class="ukryte">Status</dt><dd><span class="mdowod-status">' + ikona('ok') + '<span>Ważny do ' + d.dowodWazny + '</span></span></dd>' +
              '</dl>' +
            '</div>' +
            '<button type="button" class="mdowod-przycisk" data-cel="wszystkie dane z mDowodu">' + ikona('dowod') + '<span>Pokaż dane</span>' + ikona('dalej') + '</button>' +
          '</article>' +
          '<ul class="dokumenty">' + d.dokumenty.map(function (x) {
            return '<li><button type="button" class="wiersz" data-cel="' + x.cel + '"><span class="wiersz-ikona">' + ikona(x.ikona) + '</span>' +
              '<span class="wiersz-tekst"><span class="wiersz-nazwa">' + x.nazwa + '</span><span class="wiersz-status">' + ikona('ok') + '<span>' + x.status + '</span></span></span>' +
              ikona('dalej', 'wiersz-dalej') + '</button></li>';
          }).join('') + '</ul>' +
        '</section>' +
        '<section class="uwaga" aria-labelledby="h-uwaga"><h2 id="h-uwaga" class="sekcja-tytul">Wymaga Twojej uwagi</h2>' +
          '<button type="button" class="uwaga-karta" data-cel="Skrzynkę z pismem z Urzędu Miasta">' +
            '<span class="uwaga-ikona">' + ikona('list') + '</span>' +
            '<span class="uwaga-tekst"><span class="etykieta-nowe">Nowe</span>Pismo z Urzędu Miasta o podatku od nieruchomości</span>' + ikona('dalej', 'wiersz-dalej') +
          '</button>' +
        '</section>' +
        '<form class="asystent" aria-labelledby="h-asystent">' +
          '<label id="h-asystent" for="pole-asystenta">' + ikona('iskry') + '<span>Co chcesz załatwić?</span></label>' +
          '<input id="pole-asystenta" class="pole" type="text" autocomplete="off">' +
          '<div class="przyciski">' +
            '<button type="button" class="obrys" data-opis="' + d.mikrofonOpis + '">' + ikona('mikrofon') + '<span>Powiedz</span></button>' +
            '<button type="submit" class="pelny">' + ikona('wyslij') + '<span>Wyślij</span></button>' +
          '</div>' +
          '<p class="pytania-tytul" id="h-pytania">Na przykład:</p>' +
          '<ul class="pytania" aria-labelledby="h-pytania">' + d.pytania.map(function (p) {
            return '<li><button type="button" class="pytanie" data-cel="asystenta z pytaniem „' + p + '”">' + ikona('rozmowa') + '<span>' + p + '</span></button></li>';
          }).join('') + '</ul>' +
        '</form>' +
      '</main>' +
      '<nav class="pasek-dolny" aria-label="Menu główne"><ul>' + zakladki.map(function (z, i) {
        var atr = i === 0 ? ' aria-current="page" data-akcja="gora"' : ' data-cel="' + z[2] + '"';
        return '<li><button type="button"' + atr + '><span class="pasek-ikona">' + ikona(z[1]) + '</span><span class="pasek-podpis">' + z[0] + '</span></button></li>';
      }).join('') + '</ul></nav>' +
    '</div>' +
    '<dialog class="okno" aria-labelledby="okno-tytul" aria-describedby="okno-tekst">' +
      '<h2 id="okno-tytul">To jest podgląd wyglądu</h2><p id="okno-tekst"></p>' +
      '<button type="button" class="okno-zamknij">Zamknij</button></dialog>';
  }

  /* ---------- Wspólny CSS układu: wszystkie kolory i kształty jako zmienne ---------- */
  var UKLAD_CSS = [
    ':host{all:initial;display:block;font-family:var(--czcionka);font-size:1rem;line-height:1.5;color:var(--tekst)}',
    '*,*::before,*::after{box-sizing:border-box}',
    'h1,h2,h3,p,dl,dd,dt{margin:0}ul{list-style:none;margin:0;padding:0}',
    'button,input{font:inherit;color:inherit;margin:0}button{cursor:pointer;min-height:48px;min-width:48px}',
    ':focus-visible{outline:3px solid var(--fokus);outline-offset:3px}',
    '.ukryte{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.ikona{width:1.5rem;height:1.5rem;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.telefon{min-height:var(--wysokosc-ekranu,100dvh);display:flex;flex-direction:column;background:var(--tlo)}',
    'main{flex:1;padding:.6rem 1rem 1.5rem}',
    /* Góra: nagłówek + powitanie */
    '.gora{background:var(--gora-tlo);color:var(--gora-tekst);padding:.3rem 1rem .7rem;border-radius:var(--gora-zaokraglenie);border-bottom:var(--gora-linia,0 solid transparent);--fokus:var(--gora-fokus)}',
    '.naglowek{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}',
    '.marka{display:flex;align-items:center;gap:.5rem;font-weight:700;font-size:1.1rem;letter-spacing:var(--marka-odstep,0)}',
    '.znak{width:2rem;height:2rem;flex:none}',
    '.naglowek-przyciski{display:flex;gap:8px;margin-left:auto}',
    '.ikonowy{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:60px;min-height:52px;padding:2px 8px;',
    'background:var(--naglowek-przycisk-tlo);color:var(--gora-tekst);border:2px solid var(--naglowek-przycisk-ramka);border-radius:var(--zaokraglenie-maly);font-weight:700}',
    '.ikonowy-podpis{font-size:max(16px,.8rem);line-height:1.2}',
    '.aa{display:block;height:24px;font-size:21px;line-height:24px;font-weight:700;letter-spacing:-.02em}',
    '.ikona-licznik{display:flex;align-items:center;gap:3px;height:24px}',
    '.licznik{min-width:22px;height:22px;padding:0 5px;border-radius:999px;background:var(--licznik-tlo);color:var(--licznik-tekst);font-size:16px;line-height:22px;font-weight:700;text-align:center}',
    'h1{font-size:1.3rem;line-height:1.25;margin-top:.25rem;font-weight:var(--h1-grubosc,700);letter-spacing:var(--h1-odstep,0)}',
    /* Karta mDowodu — wygląda jak dokument */
    '.mdowod{position:relative;isolation:isolate;overflow:hidden;padding:.65rem .9rem .8rem;background:var(--dowod-tlo);color:var(--dowod-tekst);',
    'border:var(--dowod-ramka);border-top:var(--dowod-gorna-linia,var(--dowod-ramka));border-radius:var(--dowod-zaokraglenie);box-shadow:var(--dowod-cien)}',
    '.mdowod::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--dowod-wzor);pointer-events:none}',
    '.mdowod-gora{display:flex;align-items:center;justify-content:space-between;gap:4px 8px;flex-wrap:wrap}',
    '.mdowod-typ{font-size:1.2rem;line-height:1.25;font-weight:700;letter-spacing:var(--dowod-typ-odstep,0)}',
    '.mdowod-status{display:inline-flex;flex-wrap:wrap;align-items:center;gap:.3rem;font-size:max(16px,.85rem);font-weight:700;color:var(--dowod-status);',
    'background:var(--dowod-status-tlo);padding:0 .5rem;border-radius:999px}',
    '.mdowod-status .ikona{width:1.1rem;height:1.1rem}',
    '.mdowod-srodek{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem .85rem;margin:.3rem 0 .5rem}',
    '.mdowod-foto{display:grid;place-items:center;flex:none;width:3.5rem;height:4.25rem;background:var(--foto-tlo);color:var(--foto-tekst);',
    'border:2px solid var(--foto-ramka);border-radius:var(--foto-zaokraglenie);font-weight:700;font-size:1.25rem;letter-spacing:.03em}',
    '.mdowod-dane{flex:1 1 8rem;min-width:0;display:grid;line-height:1.3}',
    '.mdowod-dane dt{font-size:max(16px,.8rem);color:var(--dowod-tekst-2)}',
    '.mdowod-dane dd{font-weight:700;overflow-wrap:break-word}',
    '.mdowod-dane dd+dt{margin-top:.3rem}',
    '.mdowod-imie{font-size:1.1rem}',
    '.mdowod-chip{flex:none;width:2.1rem;height:1.6rem;border-radius:6px;background:var(--chip-tlo);border:1px solid var(--chip-ramka);display:var(--chip-widoczny,block)}',
    '.mdowod-przycisk{display:flex;align-items:center;justify-content:center;gap:.45rem;width:100%;min-height:48px;padding:.2rem 1rem;',
    'background:var(--dowod-przycisk-tlo);color:var(--dowod-przycisk-tekst);border:2px solid var(--dowod-przycisk-ramka);border-radius:var(--zaokraglenie-przycisku);font-weight:700}',
    /* Pozostałe dokumenty — pełne wiersze */
    '.dokumenty{display:grid;gap:8px;margin-top:8px}.dokumenty li{min-width:0}',
    '.wiersz{width:100%;display:flex;align-items:center;gap:.7rem;min-height:2.8rem;padding:.25rem .7rem;background:var(--powierzchnia);color:var(--tekst);',
    'border:2px solid var(--wiersz-ramka);border-radius:var(--zaokraglenie);text-align:left;box-shadow:var(--cien-maly)}',
    '.wiersz:hover{border-color:var(--akcja)}',
    '.wiersz-ikona{display:grid;place-items:center;flex:none;width:2.3rem;height:2.3rem;border-radius:var(--ikona-zaokraglenie);background:var(--ikona-tlo);color:var(--ikona-kolor)}',
    '.wiersz-tekst{flex:1;min-width:0;display:grid;line-height:1.3;overflow-wrap:break-word}',
    '.wiersz-nazwa{font-weight:700}',
    '.wiersz-status{display:flex;flex-wrap:wrap;align-items:flex-start;gap:.3rem;font-size:max(16px,.85rem);color:var(--tekst-2)}',
    '.wiersz-status .ikona{width:1.05rem;height:1.05rem;margin-top:.1rem;color:var(--sukces)}',
    '.wiersz-dalej{color:var(--tekst-2)}',
    /* Wymaga Twojej uwagi (Halina: kolor akcentu, etykieta „Nowe”, bez czerwieni) */
    '.sekcja-tytul{font-size:1.15rem;line-height:1.3;margin:.7rem 0 .3rem;color:var(--sekcja-kolor)}',
    '.uwaga-karta{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.7rem;padding:.55rem .7rem .55rem .8rem;background:var(--akcent-tlo);color:var(--tekst);',
    'border:2px solid var(--akcent);border-left-width:var(--uwaga-lewa,2px);border-radius:var(--zaokraglenie);text-align:left;line-height:1.35}',
    '.uwaga-ikona{display:grid;place-items:center;flex:none;width:2.3rem;height:2.3rem;border-radius:var(--ikona-zaokraglenie);background:var(--akcent);color:var(--akcent-tekst)}',
    '.uwaga-tekst{flex:1 1 7rem;min-width:0;overflow-wrap:break-word}',
    '.etykieta-nowe{display:inline-block;margin-right:.4rem;padding:0 .5rem;border-radius:999px;background:var(--akcent);color:var(--akcent-tekst);font-size:max(16px,.8rem);font-weight:700}',
    /* Asystent: pole, „Powiedz” i „Wyślij”, 3 pytania — jeden blok */
    '.asystent{margin-top:.7rem;padding:.65rem .7rem .7rem;background:var(--blok-tlo);border:2px solid var(--blok-ramka);border-radius:var(--zaokraglenie-duzy)}',
    '.asystent label{display:flex;align-items:center;gap:.4rem;font-weight:700;font-size:1.1rem;line-height:1.3;margin-bottom:.3rem;color:var(--sekcja-kolor)}',
    '.pole{display:block;width:100%;min-height:56px;padding:.5rem .9rem;background:var(--pole-tlo);color:var(--tekst);border:2px solid var(--pole-ramka);border-radius:var(--pole-zaokraglenie)}',
    '.przyciski{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}',
    '.przyciski button{flex:1 1 6.5rem;display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:56px;padding:.2rem .8rem;border-radius:var(--zaokraglenie-przycisku);font-weight:700}',
    '.obrys{background:transparent;color:var(--akcja-obrys);border:2px solid var(--akcja-obrys)}',
    '.pelny{background:var(--akcja);color:var(--akcja-tekst);border:2px solid var(--akcja)}',
    '.pytania-tytul{margin-top:.7rem;color:var(--tekst-2)}',
    '.pytania{display:grid;gap:8px;margin-top:.3rem}',
    '.pytanie{width:100%;display:flex;align-items:center;gap:.5rem;min-height:48px;padding:.25rem .8rem;background:var(--pytanie-tlo);color:var(--pytanie-tekst);',
    'border:2px solid var(--pytanie-ramka);border-radius:var(--pytanie-zaokraglenie);text-align:left;font-weight:var(--pytanie-grubosc,400)}',
    /* Dolny pasek: 1 rząd, podpisy stałe 16 px */
    '.pasek-dolny{position:sticky;bottom:0;z-index:3;background:var(--pasek-tlo);border-top:2px solid var(--pasek-ramka);container-type:inline-size;border-radius:var(--pasek-zaokraglenie,0)}',
    '.pasek-dolny ul{display:flex;gap:8px;padding:4px 6px}',
    '.pasek-dolny li{flex:1 1 auto;min-width:48px}',
    '.pasek-dolny button{position:relative;width:100%;min-height:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;',
    'padding:4px 0;background:none;border:0;color:var(--pasek-tekst);font-size:16px;line-height:20px;white-space:nowrap}',
    '.pasek-dolny .ikona{width:24px;height:24px}',
    '.pasek-ikona{display:grid;place-items:center;height:30px;padding:0 12px;border-radius:999px}',
    '.pasek-dolny button[aria-current="page"]{color:var(--pasek-aktywny);font-weight:700}',
    '.pasek-dolny button[aria-current="page"] .pasek-ikona{background:var(--pasek-aktywny-tlo)}',
    '.pasek-dolny button[aria-current="page"]::after{content:"";position:absolute;left:20%;right:20%;height:4px;border-radius:4px;background:var(--pasek-aktywny);',
    'top:var(--kreska-gora,auto);bottom:var(--kreska-dol,0)}',
    '@container (max-width:360px){.pasek-dolny ul{padding:4px 0}.pasek-dolny button{letter-spacing:-.04em}.pasek-ikona{padding:0 4px}}',
    /* Okno „to tylko podgląd” (nie znika samo) */
    '.okno{width:min(22rem,calc(100vw - 2rem));max-height:calc(100dvh - 2rem);overflow-y:auto;padding:1.25rem;background:var(--powierzchnia);color:var(--tekst);',
    'border:3px solid var(--akcja);border-radius:var(--zaokraglenie-duzy);font-family:var(--czcionka);font-size:1rem;line-height:1.5}',
    '.okno::backdrop{background:rgba(5,10,20,.6)}',
    '.okno h2{font-size:1.25rem;line-height:1.3;margin-bottom:.5rem}.okno p{margin-bottom:1rem}',
    '.okno-zamknij{width:100%;min-height:56px;background:var(--akcja);color:var(--akcja-tekst);border:2px solid var(--akcja);border-radius:var(--zaokraglenie-przycisku);font-weight:700}',
    '@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}'
  ].join('\n');

  /* ---------- Motyw „Wysoki kontrast” — wspólny dla wszystkich wariantów ---------- */
  var KONTRAST_CSS = [
    ':host([data-motyw="kontrast"]){',
    '--tlo:#000;--powierzchnia:#000;--tekst:#fff;--tekst-2:#fff;--sekcja-kolor:#fff;--fokus:#FFE500;',
    '--gora-tlo:#000;--gora-tekst:#fff;--gora-fokus:#FFE500;--gora-linia:2px solid #fff;--naglowek-przycisk-tlo:#000;--naglowek-przycisk-ramka:#fff;',
    '--licznik-tlo:#FFE500;--licznik-tekst:#000;--znak-obwodka:#fff;',
    '--dowod-tlo:#000;--dowod-wzor:none;--dowod-tekst:#fff;--dowod-tekst-2:#fff;--dowod-ramka:3px solid #fff;--dowod-gorna-linia:3px solid #fff;--dowod-cien:none;',
    '--dowod-status:#000;--dowod-status-tlo:#7CFF9B;--foto-tlo:#000;--foto-tekst:#fff;--foto-ramka:#fff;--chip-widoczny:none;',
    '--dowod-przycisk-tlo:#FFE500;--dowod-przycisk-tekst:#000;--dowod-przycisk-ramka:#FFE500;',
    '--wiersz-ramka:#fff;--cien-maly:none;--ikona-tlo:#000;--ikona-kolor:#fff;--sukces:#7CFF9B;',
    '--akcent:#FFE500;--akcent-tlo:#000;--akcent-tekst:#000;--akcent-mocny:#FFE500;',
    '--blok-tlo:#000;--blok-ramka:#fff;--pole-tlo:#000;--pole-ramka:#fff;',
    '--akcja:#FFE500;--akcja-tekst:#000;--akcja-obrys:#FFE500;',
    '--pytanie-tlo:#000;--pytanie-tekst:#fff;--pytanie-ramka:#fff;',
    '--pasek-tlo:#000;--pasek-ramka:#fff;--pasek-tekst:#fff;--pasek-aktywny:#FFE500;--pasek-aktywny-tlo:transparent}',
    ':host([data-motyw="kontrast"]) .pasek-dolny button[aria-current="page"] .pasek-ikona{outline:2px solid #FFE500}'
  ].join('\n');

  /* ---------- Rozmiar tekstu (JEDNA zmienna --tekst) i motyw ---------- */
  var ROZMIARY = { 'standardowy': '112.5%', 'duzy': '137.5%', 'bardzo-duzy': '162.5%' };
  var MOTYWY = { 'jasny': 1, 'ciemny': 1, 'kontrast': 1 };
  var hosty = [];
  function parametr(nazwa) { try { return new URLSearchParams(location.search).get(nazwa); } catch (e) { return null; } }
  function zapiszParametr(nazwa, wartosc) {
    try { var u = new URL(location.href); u.searchParams.set(nazwa, wartosc); history.replaceState(null, '', u); } catch (e) {}
  }
  function zaznacz(grupa, wartosc) {
    var r = document.querySelector('input[name="' + grupa + '"][value="' + wartosc + '"]');
    if (r) r.checked = true;
  }
  function ustawRozmiar(nazwa) {
    if (!ROZMIARY[nazwa]) nazwa = 'standardowy';
    document.documentElement.style.setProperty('--tekst', ROZMIARY[nazwa]);
    zaznacz('rozmiar', nazwa);
  }
  function ustawMotyw(nazwa) {
    if (!MOTYWY[nazwa]) nazwa = 'jasny';
    hosty.forEach(function (h) { h.setAttribute('data-motyw', nazwa); });
    document.documentElement.setAttribute('data-motyw', nazwa);
    zaznacz('motyw', nazwa);
  }
  function podlaczPrzelaczniki() {
    Array.prototype.forEach.call(document.querySelectorAll('input[name="rozmiar"], input[name="motyw"]'), function (radio) {
      radio.addEventListener('change', function () {
        if (radio.name === 'rozmiar') ustawRozmiar(radio.value); else ustawMotyw(radio.value);
        zapiszParametr(radio.name === 'rozmiar' ? 'tekst' : 'motyw', radio.value);
      });
    });
    ustawRozmiar(parametr('tekst'));
    ustawMotyw(parametr('motyw'));
  }

  /* ---------- Wklejenie wariantu do ekranu telefonu ---------- */
  function zamontuj(host, klucz) {
    var w = (window.WYGLADY || {})[klucz];
    if (!w) { host.textContent = 'Nie udało się wczytać wyglądu ' + klucz + '.'; return; }
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + UKLAD_CSS + '\n' + w.css + '\n' + KONTRAST_CSS + '</style>' + uklad(DANE);
    hosty.push(host);
    host.setAttribute('data-motyw', document.documentElement.getAttribute('data-motyw') || 'jasny');

    var okno = root.querySelector('.okno'), oknoTekst = root.querySelector('#okno-tekst');
    function pokaz(opis) { oknoTekst.textContent = opis; if (okno.showModal) okno.showModal(); else okno.setAttribute('open', ''); }
    root.querySelector('.okno-zamknij').addEventListener('click', function () { if (okno.close) okno.close(); else okno.removeAttribute('open'); });
    root.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-cel], [data-opis], [data-akcja]');
      if (!el) return;
      if (el.getAttribute('data-akcja') === 'gora') { host.scrollTop = 0; window.scrollTo(0, 0); return; }
      pokaz(el.getAttribute('data-opis') ||
        ('Ten plik pokazuje tylko wygląd ekranu Dokumenty. W gotowej aplikacji ten przycisk otworzy: ' + el.getAttribute('data-cel') + '.'));
    });
    root.addEventListener('submit', function (e) {
      e.preventDefault();
      pokaz('W gotowej aplikacji asystent rozpozna Twoją sprawę. Potem poprowadzi Cię krok po kroku.');
    });
  }

  window.WYGLADY = window.WYGLADY || {};
  window.Dokumenty = { zamontuj: zamontuj, podlaczPrzelaczniki: podlaczPrzelaczniki, ustawRozmiar: ustawRozmiar, ustawMotyw: ustawMotyw };
})();
