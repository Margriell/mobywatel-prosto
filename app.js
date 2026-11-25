/* =====================================================================
   mObywatel Prosto — szkielet aplikacji (etap 2 z poprawkami).
   Każdy ekran ma własny adres (#/dokumenty, #/uslugi …).
   Parametry: ?osoba=halina|tomasz|ola, ?reset=1.
   Zwykły skrypt (bez modułów, bez fetch, bez iframe): działa po dwukliku
   i na GitHub Pages. Ustawienia w localStorage (w try/catch).
   ===================================================================== */
(function () {
  'use strict';

  var D = window.DANE;
  var html = document.documentElement;
  var tresc = document.getElementById('tresc');
  var nawigacja = document.getElementById('nawigacja');
  var pasek = document.getElementById('asystent-pasek');
  var poleAsystenta = document.getElementById('pole-asystenta');
  var przyciskMow = document.getElementById('przycisk-mow');
  var podpowiedziPaska = document.getElementById('podpowiedzi-paska');
  var okno = document.getElementById('okno');

  /* ---------- Ikony: Lucide (licencja MIT), wklejone jako SVG ---------- */
  var IKONY = {
    list: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    suwaki: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    uwaga: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    oko: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    dalej: '<path d="m9 18 6-6-6-6"/>',
    wstecz: '<path d="m15 18-6-6 6-6"/>',
    dol: '<path d="m6 9 6 6 6-6"/>',
    iskry: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    mikrofon: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    wyslij: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    dowod: '<path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/>',
    auto: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    dom: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    rodzina: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    serce: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    paragon: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    tarcza: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    tarczaOk: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    lupa: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    glosnik: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    stop: '<rect width="14" height="14" x="5" y="5" rx="2"/>',
    klucz: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    powtorz: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    skan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    klik: '<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>',
    klawiatura: '<path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
    portfel: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    czapka: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    uslugi: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    dokumenty: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    warstwy: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    wGore: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    wDol: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    strzalki: '<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
    kosz: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    plus: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    autobus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
    wybory: '<path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/>',
    osobaOk: '<path d="m16 11 2 2 4-4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    zegarek: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    lista: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    kartyDuze: '<rect width="18" height="11" x="3" y="10" rx="2"/><path d="M5 7h14"/><path d="M7 4h10"/>'
  };
  function ikona(nazwa, klasa) {
    return '<svg' + (klasa ? ' class="' + klasa + '"' : '') + ' viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (IKONY[nazwa] || '') + '</svg>';
  }
  /* Sylwetka auta (zamiast zdjęcia na karcie Moje pojazdy) — własny rysunek */
  var SYLWETKA_AUTA = '<svg class="sylwetka" viewBox="0 0 64 40" aria-hidden="true" focusable="false">' +
    '<path d="M3 26.5C3 24.3 4.5 22.5 6.6 22l7.9-1.9 6.6-7.3A6 6 0 0 1 25.6 11h13.2a6 6 0 0 1 4.6 2.1l6.1 7.1 7.9 1.5A4 4 0 0 1 61 25.6V29a2 2 0 0 1-2 2h-3.6a6.6 6.6 0 0 0-13 0H21.6a6.6 6.6 0 0 0-13 0H5a2 2 0 0 1-2-2z"/>' +
    '<path class="jasne" d="M20.6 20.2l5.3-5.9a3 3 0 0 1 2.2-1H31.5v6.9zM34.5 13.3h4.3a3 3 0 0 1 2.3 1.1l5 5.8H34.5z"/>' +
    '<circle cx="15.1" cy="31" r="5.2"/><circle cx="48.9" cy="31" r="5.2"/>' +
    '<circle class="jasne" cx="15.1" cy="31" r="2"/><circle class="jasne" cx="48.9" cy="31" r="2"/></svg>';

  /* Kod kreskowy: paski z cyfr numeru (wzory cyfr jak w kodzie EAN; ilustracja w prototypie) */
  var WZORY_CYFR = ['3211', '2221', '2122', '1411', '1132', '1231', '1114', '1312', '1213', '3112'];
  function kodKreskowy(kod) {
    var x = 0, paski = '';
    function dodaj(szer, czarny) {
      if (czarny) paski += '<rect x="' + x + '" y="0" width="' + szer + '" height="40"/>';
      x += szer;
    }
    [1, 1, 1].forEach(function (s, i) { dodaj(s, i % 2 === 0); });
    String(kod).split('').forEach(function (c) {
      var w = WZORY_CYFR[+c] || WZORY_CYFR[0];
      for (var i = 0; i < 4; i++) dodaj(+w.charAt(i), i % 2 === 1);
    });
    [1, 1, 1].forEach(function (s, i) { dodaj(s, i % 2 === 0); });
    return '<svg class="kod-paski" viewBox="0 0 ' + x + ' 40" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + paski + '</svg>';
  }

  /* Wzór giloszowy (jak na prawdziwych dokumentach): jasna rozeta z przeplatanych krzywych
     i ciemne fale. Cienkie, prawie przezroczyste linie — tekst na karcie zostaje w pełni czytelny
     (jasne linie są tak słabe, że nawet na ich skrzyżowaniu kontrast białego tekstu to min. 4,5:1;
     ciemne fale kontrast tylko zwiększają). */
  function ustawGilosz() {
    function krzywa(cx, cy, r0, amp, platki, faza, kroki) {
      var d = '';
      for (var i = 0; i <= kroki; i++) {
        var a = i / kroki * Math.PI * 2;
        var r = r0 + amp * Math.sin(platki * a + faza);
        d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
      }
      return '<path d="' + d + 'Z"/>';
    }
    var r = '', f = '', k, x;
    for (k = 0; k < 10; k++) r += krzywa(150, 150, 112, 22, 9, k * Math.PI * 2 / 10, 216);
    for (k = 0; k < 7; k++) r += krzywa(150, 150, 60, 12, 7, k * Math.PI * 2 / 7, 168);
    for (k = 0; k < 5; k++) {
      var d = '';
      for (x = 0; x <= 400; x += 5) d += (x ? 'L' : 'M') + x + ' ' + (32 + 16 * Math.sin(x / 400 * Math.PI * 8 + k * Math.PI * 2 / 5)).toFixed(1);
      f += '<path d="' + d + '"/>';
    }
    function adres(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'; }
    html.style.setProperty('--gilosz-rozeta', adres('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none" stroke="#fff" stroke-opacity=".075" stroke-width="1">' + r + '</svg>'));
    html.style.setProperty('--gilosz-fale', adres('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 64" preserveAspectRatio="none" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1.2">' + f + '</svg>'));
  }

  /* ---------- Pomocnicze ---------- */
  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (z) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z];
    });
  }
  /* Bez polskich znaków i małymi literami — dla wyszukiwarki (i później asystenta) */
  function normalizuj(t) {
    return String(t).toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function odmiana(n, jeden, kilka, wiele) {
    if (n === 1) return jeden;
    var r10 = n % 10, r100 = n % 100;
    return (r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14)) ? kilka : wiele;
  }
  function znajdz(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }
  function ograniczRuch() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ---------- Stan i ustawienia (localStorage w try/catch) ---------- */
  var KLUCZ = 'mobywatel-prosto';
  var DOMYSLNE = { osoba: null, tekst: 'standardowy', motyw: 'jasny', prosty: false, czytanie: false, przeczytane: {}, kolejnosc: {}, uklady: {} };
  var ROZMIARY = ['standardowy', 'duzy', 'bardzo-duzy'];
  var MOTYWY = ['jasny', 'ciemny', 'kontrast'];
  var UKLADY = ['duze', 'male', 'lista'];
  var NAZWY_UKLADOW = { duze: 'Duże karty', male: 'Małe karty', lista: 'Lista' };
  var stan = wczytaj();
  var przodPortfela = {}; /* która karta leży z przodu portfela (do końca wizyty) */

  function wczytaj() {
    var s = JSON.parse(JSON.stringify(DOMYSLNE));
    try {
      var z = JSON.parse(localStorage.getItem(KLUCZ) || 'null');
      if (z && typeof z === 'object') {
        if (D.osoby[z.osoba]) s.osoba = z.osoba;
        if (ROZMIARY.indexOf(z.tekst) >= 0) s.tekst = z.tekst;
        if (MOTYWY.indexOf(z.motyw) >= 0) s.motyw = z.motyw;
        s.prosty = !!z.prosty;
        s.czytanie = !!z.czytanie;
        if (z.przeczytane && typeof z.przeczytane === 'object') s.przeczytane = z.przeczytane;
        Object.keys(D.osoby).forEach(function (id) {
          var k = z.kolejnosc && z.kolejnosc[id];
          if (Array.isArray(k)) {
            s.kolejnosc[id] = k.filter(function (x, i) { return typeof x === 'string' && znajdz(D.osoby[id].dokumenty, x) && k.indexOf(x) === i; });
          }
          if (z.uklady && UKLADY.indexOf(z.uklady[id]) >= 0) s.uklady[id] = z.uklady[id];
        });
      }
    } catch (e) { /* bez localStorage aplikacja też działa */ }
    return s;
  }
  function zapisz() {
    try { localStorage.setItem(KLUCZ, JSON.stringify(stan)); } catch (e) { /* trudno */ }
  }
  function zastosujUstawienia() {
    html.setAttribute('data-tekst', stan.tekst);
    html.setAttribute('data-motyw', stan.motyw);
    html.setAttribute('data-prosty', stan.prosty ? 'tak' : 'nie');
    html.setAttribute('data-czytanie', stan.czytanie ? 'tak' : 'nie');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', stan.motyw === 'jasny' ? '#FFFFFF' : stan.motyw === 'ciemny' ? '#1C1F27' : '#000000');
    if (!stan.czytanie) zatrzymajCzytanie();
  }
  function wybierzOsobe(id) {
    var o = D.osoby[id];
    if (!o) return;
    stan.osoba = id;
    stan.tekst = o.ustawienia.tekst;
    stan.motyw = o.ustawienia.motyw;
    stan.prosty = o.ustawienia.prosty;
    stan.czytanie = o.ustawienia.czytanie;
    /* Każdy wybór osoby zaczyna od nowa: świeża Skrzynka, wszystkie dokumenty, układ „Duże karty” */
    stan.przeczytane[id] = {};
    delete stan.kolejnosc[id];
    delete stan.uklady[id];
    delete przodPortfela[id];
    zapisz();
    zastosujUstawienia();
  }
  function osoba() { return D.osoby[stan.osoba] || D.osoby.halina; }
  /* Dokumenty osoby w zapamiętanej kolejności (bez usuniętych) */
  function dokumentyOsoby(o) {
    var k = stan.kolejnosc[o.id];
    if (!k) return o.dokumenty.slice();
    return k.map(function (id) { return znajdz(o.dokumenty, id); }).filter(Boolean);
  }
  function ukladOsoby(o) { return stan.uklady[o.id] || 'duze'; }
  function idPrzodu(o, docs) {
    var p = przodPortfela[o.id];
    return p && znajdz(docs, p) ? p : docs[docs.length - 1].id;
  }
  function czyNowa(o, w) { return w.nowa && !(stan.przeczytane[o.id] && stan.przeczytane[o.id][w.id]); }
  function liczbaNowych(o) {
    var n = 0;
    o.wiadomosci.forEach(function (w) { if (czyNowa(o, w)) n++; });
    return n;
  }
  function opisUstawien() {
    var t = { 'standardowy': 'Standardowy tekst', 'duzy': 'Duży tekst', 'bardzo-duzy': 'Bardzo duży tekst' }[stan.tekst];
    var m = { 'jasny': 'jasny motyw', 'ciemny': 'ciemny motyw', 'kontrast': 'wysoki kontrast' }[stan.motyw];
    return t + ', ' + m + (stan.prosty ? ', tryb prosty' : '') + (stan.czytanie ? ', czytanie na głos' : '');
  }

  /* ---------- Wspólne kawałki ekranów ---------- */
  function naglowekAplikacji() {
    var n = liczbaNowych(osoba());
    var opis = 'Skrzynka, ' + (n ? n + ' ' + odmiana(n, 'nowa wiadomość', 'nowe wiadomości', 'nowych wiadomości') : 'brak nowych wiadomości');
    return '<header class="naglowek">' +
      '<div class="marka"><span class="logo" aria-hidden="true">m</span>mObywatel</div>' +
      '<div class="naglowek-akcje">' +
        '<a class="ikona-btn" href="#/wyglad" aria-label="Dostosuj wygląd i dostępność">' + ikona('suwaki') + 'Dostosuj</a>' +
        '<a class="ikona-btn" href="#/skrzynka" aria-label="' + opis + '">' + ikona('list') + 'Skrzynka' +
          (n ? '<span class="licznik" aria-hidden="true">' + n + '</span>' : '') + '</a>' +
      '</div></header>';
  }
  /* Podekrany: górny pasek z „Wstecz” i tytułem, przyklejony u góry */
  function naglowekWstecz(rodzic, tytulEkranu) {
    return '<header class="naglowek naglowek-pod">' +
      '<button type="button" class="wstecz" data-akcja="wstecz" data-rodzic="' + rodzic + '">' + ikona('wstecz') + 'Wstecz</button>' +
      '<h1 class="tytul-paska" tabindex="-1">' + tytulEkranu + '</h1></header>';
  }
  function przyciskCzytaj() {
    return '<button type="button" class="btn-czytaj tylko-czytanie" data-akcja="przeczytaj">' + ikona('glosnik') + '<span>Przeczytaj</span></button>';
  }
  /* Ekrany główne (zakładki): tytuł w treści */
  function tytul(tekst, podtytul, klasa) {
    return '<div class="tytul-strony' + (klasa ? ' ' + klasa : '') + '"><h1 tabindex="-1">' + tekst + '</h1>' + przyciskCzytaj() + '</div>' +
      (podtytul ? '<p class="podtytul">' + podtytul + '</p>' : '');
  }
  /* Podekrany: tytuł jest w górnym pasku; w treści „Przeczytaj” i podtytuł */
  function wstep(podtytul) {
    return '<div class="czytaj-wiersz">' + przyciskCzytaj() + '</div>' + (podtytul ? '<p class="podtytul">' + podtytul + '</p>' : '');
  }

  /* ---------- Karty dokumentów: jeden wspólny szablon ---------- */
  function statusKarty(d) {
    return '<span class="karta-status' + (d.alarm ? ' alarm' : '') + '">' + ikona(d.ikonaStatusu || 'ok') + d.status + '</span>';
  }
  function poleKarty(p) {
    var cechy = p[2] || '';
    var wartosc = cechy.indexOf('alarm') >= 0 ? '<span class="pole-alarm">' + ikona('uwaga') + '<span>' + p[1] + '</span></span>' : p[1];
    return '<div class="karta-pole' + (cechy.indexOf('dlugie') >= 0 ? ' dlugie' : '') + '"><dt>' + p[0] + '</dt><dd>' + wartosc + '</dd></div>';
  }
  function zdjecieKarty(o, d) {
    if (d.rodzaj === 'pojazdy') return '<div class="karta-zdjecie auto" aria-hidden="true">' + SYLWETKA_AUTA + '</div>';
    return '<div class="karta-zdjecie" aria-hidden="true">' + o.inicjaly + '</div>';
  }
  /* tryb: 'przod' (z przodu portfela), 'tyl' (karta z tyłu — przycisk), 'szczegoly',
     'podglad' i 'tyl-podglad' (podgląd w ustawieniach, bez klikania), 'mala' (układ Małe karty) */
  function kartaDokumentu(o, d, tryb) {
    var klasa = 'karta k-' + d.kolor;
    var nazwa = '<span class="karta-nazwa">' + d.nazwa + '</span>';
    if (tryb === 'tyl') {
      return '<div class="' + klasa + ' tyl" data-id="' + d.id + '">' +
        '<button type="button" class="karta-gora" data-akcja="na-przod" data-id="' + d.id + '" aria-label="Pokaż ' + d.nazwa + ' na przodzie. ' + d.status + '">' +
          nazwa + statusKarty(d) + '</button></div>';
    }
    if (tryb === 'tyl-podglad') {
      return '<div class="' + klasa + ' tyl" data-id="' + d.id + '"><div class="karta-gora">' + nazwa + statusKarty(d) + '</div></div>';
    }
    if (tryb === 'mala') {
      return '<a class="' + klasa + ' mala" href="#/dokument/' + d.id + '">' + nazwa + statusKarty(d) + '</a>';
    }
    var cialo = '<div class="karta-cialo">' + zdjecieKarty(o, d) + '<dl class="karta-pola">' + d.pola.map(poleKarty).join('') + '</dl></div>' +
      (d.kod ? '<div class="karta-kod" role="img" aria-label="Kod kreskowy, numer ' + d.kod + '">' + kodKreskowy(d.kod) + '<span aria-hidden="true">' + d.kod + '</span></div>' : '');
    var przycisk = '';
    if (tryb === 'przod') przycisk = '<a class="btn-pokaz" href="#/dokument/' + d.id + '" aria-label="Pokaż szczegóły: ' + d.nazwa + '">' + ikona('oko') + 'Pokaż szczegóły</a>';
    if (tryb === 'podglad') przycisk = '<span class="btn-pokaz">' + ikona('oko') + 'Pokaż szczegóły</span>';
    return '<div class="' + klasa + (tryb === 'szczegoly' ? ' szczegoly' : ' przod') + '" data-id="' + d.id + '">' +
      '<div class="karta-gora">' + nazwa + statusKarty(d) + '</div>' + cialo + przycisk + '</div>';
  }
  function statusWiersza(d) {
    return d.alarm ? '<span class="status-pilne">' + ikona('uwaga') + d.status + '</span>' :
      '<span class="status-ok">' + ikona(d.ikonaStatusu || 'ok') + d.status + '</span>';
  }
  function wierszDokumentu(d) {
    return '<li><a class="wiersz-listy" href="#/dokument/' + d.id + '"><span class="mini-karta k-' + d.kolor + '" aria-hidden="true"></span>' +
      '<span class="tekst"><span class="tytul-wiersza">' + d.nazwa + '</span><span class="opis">' + statusWiersza(d) + '</span></span>' +
      ikona('dalej', 'chevron') + '</a></li>';
  }
  function pustyPortfel() {
    return '<div class="pusty-stan"><p><b>Nie masz dokumentów w aplikacji.</b></p>' +
      '<p>W prototypie wrócą, gdy wybierzesz osobę jeszcze raz.</p>' +
      '<div class="przyciski-pion"><a class="btn drugi" href="#/osoba">' + ikona('rodzina') + 'Zmień osobę</a></div></div>';
  }
  /* Dokumenty w wybranym układzie. Duże karty = portfel: karty jedna za drugą, jedna z przodu w całości */
  function portfel(o) {
    var docs = dokumentyOsoby(o);
    if (!docs.length) return pustyPortfel();
    var uklad = ukladOsoby(o);
    if (uklad === 'lista') return '<ul class="lista portfel-lista">' + docs.map(wierszDokumentu).join('') + '</ul>';
    if (uklad === 'male') return '<ul class="male-karty">' + docs.map(function (d) { return '<li>' + kartaDokumentu(o, d, 'mala') + '</li>'; }).join('') + '</ul>';
    var przod = idPrzodu(o, docs);
    var stos = docs.filter(function (d) { return d.id !== przod; }).concat([znajdz(docs, przod)]);
    return '<div class="portfel" id="portfel">' + stos.map(function (d) {
      return kartaDokumentu(o, d, d.id === przod ? 'przod' : 'tyl');
    }).join('') + '</div>';
  }
  /* Dotknięcie karty z tyłu przesuwa ją na przód — płynnie (bez animacji przy „ogranicz ruch”) */
  function naPrzod(id) {
    var o = osoba();
    var stary = document.getElementById('portfel');
    if (!stary) return;
    var ruch = !ograniczRuch();
    var przed = {};
    function ruchome() { return Array.prototype.slice.call(document.querySelectorAll('#portfel .karta, [data-flip]')); }
    function klucz(el) { return el.getAttribute('data-id') || el.getAttribute('data-flip'); }
    if (ruch) ruchome().forEach(function (el) { przed[klucz(el)] = el.getBoundingClientRect().top; });
    przodPortfela[o.id] = id;
    var tymczasowy = document.createElement('div');
    tymczasowy.innerHTML = portfel(o);
    stary.parentNode.replaceChild(tymczasowy.firstChild, stary);
    var nowy = document.getElementById('portfel');
    var przodEl = nowy.querySelector('.karta.przod');
    if (ruch) {
      var lista = [];
      ruchome().forEach(function (el) {
        var dy = przed[klucz(el)] - el.getBoundingClientRect().top;
        if (Math.abs(dy) > 0.5) { el.style.transition = 'none'; el.style.transform = 'translateY(' + dy + 'px)'; lista.push(el); }
      });
      void nowy.offsetHeight;
      lista.forEach(function (el) {
        el.style.transition = 'transform .45s cubic-bezier(.2, .75, .25, 1)';
        el.style.transform = '';
        el.addEventListener('transitionend', function koniec() { el.style.transition = ''; el.removeEventListener('transitionend', koniec); });
      });
      if (przodEl) przodEl.classList.add('wjezdza');
    }
    var btn = przodEl && przodEl.querySelector('.btn-pokaz');
    if (btn) btn.focus({ preventScroll: true });
  }
  function kartaUwagi(o) {
    var u = o.uwaga;
    var srodek = '<span class="ikona-kolo">' + ikona(u.ikona) + '</span>' +
      '<span class="tekst"><span class="etykieta">' + u.etykieta + '</span><span class="opis">' + u.opis + '</span></span>';
    if (u.href) return '<a class="uwaga ' + u.styl + '" href="' + u.href + '">' + srodek + ikona('dalej', 'chevron') + '</a>';
    return '<div class="uwaga ' + u.styl + '">' + srodek + '</div>';
  }
  function wierszListy(cel, ikonaNazwa, tytulWiersza, opis, dodatek) {
    var srodek = (ikonaNazwa ? '<span class="ikona-kolo">' + ikona(ikonaNazwa) + '</span>' : '') +
      '<span class="tekst"><span class="tytul-wiersza">' + tytulWiersza + '</span>' + (opis ? '<span class="opis">' + opis + '</span>' : '') + (dodatek || '') + '</span>' +
      ikona('dalej', 'chevron');
    if (cel.charAt(0) === '#') return '<li><a class="wiersz-listy" href="' + cel + '">' + srodek + '</a></li>';
    return '<li><button type="button" class="wiersz-listy" ' + cel + '>' + srodek + '</button></li>';
  }
  function wierszUslugi(u) {
    if (u.sprawa) {
      return wierszListy('#/sprawa/' + u.sprawa, null, u.nazwa, u.opis, '<span class="etykieta-dziala">' + ikona('ok') + 'Działa w prototypie</span>');
    }
    return wierszListy('data-akcja="niedostepne" data-nazwa="' + esc(u.nazwa) + '"', null, u.nazwa, u.opis);
  }
  function przyciskiPodpowiedzi(pytania) {
    return pytania.map(function (p) {
      return '<li><button type="button" class="podpowiedz" data-akcja="zapytaj" data-pytanie="' + esc(p) + '">' + esc(p) + '</button></li>';
    }).join('');
  }
  function wszystkieUslugi() {
    var w = [];
    D.kategorie.forEach(function (k) { k.uslugi.forEach(function (u) { u.kategoria = k; w.push(u); }); });
    return w;
  }

  /* ======================= EKRANY ======================= */

  /* 1. Wybór osoby */
  function ekranOsoba() {
    var karty = D.kolejnoscOsob.map(function (id) {
      var o = D.osoby[id];
      return '<li><button type="button" class="karta-osoby" data-akcja="wybierz-osobe" data-osoba="' + id + '">' +
        '<span class="awatar" aria-hidden="true">' + o.inicjaly + '</span>' +
        '<span class="tekst"><span class="tytul-wiersza">' + o.imie + ', ' + o.wiek + '</span>' +
        '<span class="opis">' + o.opis + '</span>' +
        '<span class="opis ustawienia-osoby">' + ikona('suwaki') + o.ustawieniaOpis + '</span></span>' +
        ikona('dalej', 'chevron') + '</button></li>';
    }).join('');
    return {
      tytul: 'Wybierz osobę', uklad: 'wejscie',
      naglowek: '<header class="naglowek naglowek-wejscie"><div class="marka"><span class="logo" aria-hidden="true">m</span>mObywatel</div></header>',
      html: '<section class="sekcja">' + tytul('Wybierz osobę', 'Zobacz aplikację oczami jednej z trzech osób. Każda ma inne ustawienia.') +
        '<ul class="lista-osob">' + karty + '</ul>' +
        '<p class="informacja">' + ikona('info') + 'Prototyp konkursowy, dane fikcyjne</p></section><div class="odstep-dol"></div>'
    };
  }

  /* 2. Dopasuj do siebie — te same ustawienia co „Wygląd i dostępność” */
  function podglad() {
    var o = osoba();
    var docs = dokumentyOsoby(o);
    var stos = '';
    if (docs.length) {
      var przod = znajdz(docs, idPrzodu(o, docs));
      var reszta = docs.filter(function (d) { return d !== przod; });
      stos = '<div class="portfel">' + (reszta.length ? kartaDokumentu(o, reszta[reszta.length - 1], 'tyl-podglad') : '') +
        kartaDokumentu(o, przod, 'podglad') + '</div>';
    }
    return '<div class="podglad" inert aria-hidden="true"><p class="podglad-etykieta">Podgląd</p>' +
      '<div class="tytul-strony"><span class="podglad-h">Dzień dobry, ' + o.wolacz + '</span>' +
        '<span class="btn-czytaj tylko-czytanie">' + ikona('glosnik') + '<span>Przeczytaj</span></span></div>' + stos + '</div>';
  }
  function grupaOpcji(klucz, legenda, opcje, wybrana) {
    return '<fieldset class="ustawienie"><legend>' + legenda + '</legend><div class="opcje">' + opcje.map(function (op) {
      var tak = (wybrana !== undefined ? wybrana : stan[klucz]) === op[0];
      return '<label class="opcja' + (tak ? ' wybrana' : '') + '"><input type="radio" name="' + klucz + '" value="' + op[0] + '"' + (tak ? ' checked' : '') + '>' +
        '<span class="opcja-nazwa">' + op[1] + '</span>' + (op[2] || '') + '</label>';
    }).join('') + '</div></fieldset>';
  }
  function przelacznik(klucz, nazwa, opis, wl, wyl) {
    var on = !!stan[klucz];
    return '<button type="button" class="przelacznik" role="switch" aria-checked="' + on + '" data-akcja="przelacz" data-klucz="' + klucz + '" data-wl="' + wl + '" data-wyl="' + wyl + '">' +
      '<span class="tekst"><span class="tytul-wiersza">' + nazwa + '</span><span class="opis">' + opis + '</span></span>' +
      '<span class="przelacznik-stan"><span class="tor" aria-hidden="true"><span class="galka"></span></span><span class="slowo">' + (on ? wl : wyl) + '</span></span></button>';
  }
  function ustawieniaHtml() {
    return podglad() +
      grupaOpcji('tekst', 'Rozmiar tekstu', [
        ['standardowy', 'Standardowy', '<span class="probka" style="font-size:18px" aria-hidden="true">Aa</span>'],
        ['duzy', 'Duży', '<span class="probka" style="font-size:22px" aria-hidden="true">Aa</span>'],
        ['bardzo-duzy', 'Bardzo duży', '<span class="probka" style="font-size:26px" aria-hidden="true">Aa</span>']]) +
      grupaOpcji('motyw', 'Motyw', [
        ['jasny', 'Jasny', '<span class="probka-motywu probka-jasny" aria-hidden="true">Aa</span>'],
        ['ciemny', 'Ciemny', '<span class="probka-motywu probka-ciemny" aria-hidden="true">Aa</span>'],
        ['kontrast', 'Wysoki kontrast', '<span class="probka-motywu probka-kontrast" aria-hidden="true">Aa</span>']]) +
      '<h2 class="h2">Ułatwienia</h2>' +
      przelacznik('prosty', 'Tryb prosty', 'Mniej elementów i większe przyciski.', 'Włączony', 'Wyłączony') +
      przelacznik('czytanie', 'Czytanie na głos', 'Przycisk „Przeczytaj” przy treściach.', 'Włączone', 'Wyłączone');
  }
  function ekranDopasuj() {
    return {
      tytul: 'Dopasuj do siebie', h1: 'Jak Ci wygodnie?', uklad: 'wejscie', rodzic: '#/osoba',
      html: '<section class="sekcja">' + wstep('Ustaw wygląd aplikacji. Zmiany widać od razu.') + ustawieniaHtml() +
        '<a class="btn glowny" href="#/poznaj">Dalej' + ikona('dalej') + '</a>' +
        '<p class="dopisek">Zmienisz to w każdej chwili w Więcej → Wygląd i dostępność.</p></section><div class="odstep-dol"></div>'
    };
  }

  /* 3. Poznaj asystenta */
  function ekranPoznaj() {
    var sposoby = [['klik', 'Kliknij', 'Wybierz sprawę z listy usług.'], ['klawiatura', 'Napisz', 'Wpisz, co chcesz załatwić.'], ['mikrofon', 'Powiedz', 'Powiedz to własnymi słowami.']];
    return {
      tytul: 'Poznaj asystenta', uklad: 'wejscie', rodzic: '#/dopasuj',
      html: '<section class="sekcja">' + wstep() + '<div class="ilustracja" aria-hidden="true">' + ikona('iskry') + '</div>' +
        '<div class="akapity"><p>Możesz kliknąć, napisać albo powiedzieć, co chcesz załatwić.</p>' +
        '<p>Asystent poprowadzi Cię krok po kroku i nic nie wyśle bez Twojej zgody.</p></div>' +
        '<ul class="sposoby">' + sposoby.map(function (s) {
          return '<li><span class="ikona-kolo">' + ikona(s[0]) + '</span><span class="tekst"><b>' + s[1] + '</b><span class="opis">' + s[2] + '</span></span></li>';
        }).join('') + '</ul>' +
        '<div class="przyciski-pion"><button type="button" class="btn glowny" data-akcja="zaczynam">Zaczynam</button>' +
        '<button type="button" class="btn drugi" data-akcja="pomin">Pomiń</button></div></section><div class="odstep-dol"></div>'
    };
  }

  /* 4. Dokumenty (ekran startowy) */
  function ekranDokumenty() {
    var o = osoba();
    return {
      tytul: 'Dokumenty', uklad: 'glowny', zakladka: 'dokumenty', pasekAsystenta: 'z-podpowiedziami',
      html: '<section class="sekcja"><div class="tytul-strony tytul-powitanie"><h1 tabindex="-1">Dzień dobry, ' + o.wolacz + '</h1>' +
          '<div class="tytul-akcje">' + przyciskCzytaj() +
          '<a class="btn-zarzadzaj" href="#/zarzadzaj" aria-label="Zarządzaj dokumentami">' + ikona('warstwy') + 'Zarządzaj</a></div></div>' +
        '<h2 class="ukryte">Twoje dokumenty</h2>' + portfel(o) + '</section>' +
        '<section class="sekcja" data-flip="uwaga"><h2>Wymaga Twojej uwagi</h2>' + kartaUwagi(o) + '</section><div class="odstep-dol"></div>'
    };
  }

  /* 5. Szczegóły dokumentu (jak w mObywatelu): podgląd karty, Dane, ostatnia aktualizacja, akcje */
  function wierszDanych(p) {
    var w = p[2] === 'alarm' ? '<span class="status-pilne">' + ikona('uwaga') + '<span>' + p[1] + '</span></span>' : p[1];
    return '<div><dt>' + p[0] + '</dt><dd>' + w + '</dd></div>';
  }
  function wierszAkcji(a) {
    var srodek = '<span class="ikona-kolo">' + ikona(a.ikona) + '</span><span class="tekst"><span class="tytul-wiersza">' + a.tekst + '</span></span>' + ikona('dalej', 'chevron');
    if (a.href) return '<li><a class="wiersz-listy" href="' + a.href + '">' + srodek + '</a></li>';
    if (a.usun) return '<li><button type="button" class="wiersz-listy usun" data-akcja="usun" data-id="' + a.usun + '">' + srodek + '</button></li>';
    return '<li><button type="button" class="wiersz-listy" data-akcja="niedostepne" data-nazwa="' + esc(a.niedostepne) + '">' + srodek + '</button></li>';
  }
  function ekranDokument(id) {
    var o = osoba();
    var d = znajdz(dokumentyOsoby(o), id);
    if (!d) return ekranBrakDokumentu();
    var a = D.akcje[d.rodzaj] || {};
    var usun = { tekst: 'Usuń dokument', ikona: 'kosz', usun: d.id };
    var akcje = (a.akcje || []).concat(a.skroty ? [] : [usun]);
    return {
      tytul: d.nazwa, uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/dokumenty',
      html: '<section class="sekcja">' + wstep() + '<h2 class="ukryte">Podgląd dokumentu</h2>' + kartaDokumentu(o, d, 'szczegoly') +
        '<h2>Dane</h2><dl class="dane">' + d.dane.map(wierszDanych).join('') +
          (d.kod ? '<div><dt>Kod kreskowy</dt><dd><span class="kod-w-danych">' + kodKreskowy(d.kod) + '</span>' + d.kod + '</dd></div>' : '') + '</dl>' +
        (d.dodatkowe ? '<details class="rozwijane"><summary><span>Twoje dodatkowe dane</span>' + ikona('dol', 'strzalka-rozwin') + '</summary>' +
          '<dl class="dane">' + d.dodatkowe.map(wierszDanych).join('') + '</dl></details>' : '') +
        '<p class="aktualizacja">' + ikona('zegarek') + '<span>Ostatnia aktualizacja: ' + d.aktualizacja + '</span></p>' +
        (d.komunikat ? '<p class="komunikat-dokumentu">' + ikona('info') + '<span>' + d.komunikat + '</span></p>' : '') +
        (akcje.length ? '<h2 class="ukryte">Akcje</h2><ul class="lista akcje-dokumentu">' + akcje.map(wierszAkcji).join('') + '</ul>' : '') +
        (a.skroty ? '<h2>Pozostałe skróty</h2><ul class="lista">' + a.skroty.concat([usun]).map(wierszAkcji).join('') + '</ul>' : '') +
        '</section><div class="odstep-dol"></div>'
    };
  }
  function ekranBrakDokumentu() {
    return {
      tytul: 'Brak dokumentu', uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/dokumenty',
      html: '<section class="sekcja">' + wstep() + '<p>Tego dokumentu nie ma w aplikacji. Mógł zostać usunięty.</p>' +
        '<p>W prototypie wróci, gdy wybierzesz osobę jeszcze raz.</p>' +
        '<div class="przyciski-pion"><a class="btn glowny" href="#/dokumenty">' + ikona('dokumenty') + 'Wróć do Dokumentów</a>' +
        '<a class="btn drugi" href="#/osoba">' + ikona('rodzina') + 'Zmień osobę</a></div></section><div class="odstep-dol"></div>'
    };
  }

  /* 5a. Zarządzaj (jak w mObywatelu) */
  function ekranZarzadzaj() {
    var o = osoba();
    return {
      tytul: 'Zarządzaj dokumentami', uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/dokumenty',
      html: '<section class="sekcja">' + wstep() + '<ul class="lista">' +
        wierszListy('#/zarzadzaj/kolejnosc', 'strzalki', 'Kolejność dokumentów', 'Ustaw, który dokument jest wyżej.') +
        wierszListy('#/zarzadzaj/usun', 'kosz', 'Usuń dokument', 'Usuń dokument z aplikacji.') +
        wierszListy('#/zarzadzaj/uklad', 'uslugi', 'Wybierz układ', 'Teraz: ' + NAZWY_UKLADOW[ukladOsoby(o)] + '.') +
        wierszListy('#/zarzadzaj/dodaj', 'plus', 'Dodaj dokument', 'Zobacz dokumenty, które możesz dodać.') +
        '</ul></section><div class="odstep-dol"></div>'
    };
  }
  function listaKolejnosci(o) {
    var docs = dokumentyOsoby(o);
    var duze = ukladOsoby(o) === 'duze';
    return docs.map(function (d, i) {
      function przycisk(kier, ikonaNazwa, napis, wylaczony) {
        return '<button type="button" class="btn drugi btn-przesun" data-akcja="przesun" data-id="' + d.id + '" data-kierunek="' + kier + '"' +
          ' aria-label="' + napis + ': ' + d.nazwa + '"' + (wylaczony ? ' disabled' : '') + '>' + ikona(ikonaNazwa) + napis + '</button>';
      }
      return '<li class="kolejnosc-wiersz">' +
        '<div class="kolejnosc-dokument"><span class="mini-karta k-' + d.kolor + '" aria-hidden="true"></span>' +
          '<span class="tekst"><span class="tytul-wiersza">' + (i + 1) + '. ' + d.nazwa + '</span>' +
          (duze && i === docs.length - 1 ? '<span class="opis">Leży z przodu portfela</span>' : '') + '</span></div>' +
        '<div class="kolejnosc-przyciski">' + przycisk(-1, 'wGore', 'W górę', i === 0) + przycisk(1, 'wDol', 'W dół', i === docs.length - 1) + '</div></li>';
    }).join('');
  }
  function ekranKolejnosc() {
    var o = osoba();
    var docs = dokumentyOsoby(o);
    var opis = 'Taka kolejność jest na ekranie Dokumenty.' + (ukladOsoby(o) === 'duze' ? ' Ostatni dokument leży z przodu portfela.' : '');
    return {
      tytul: 'Kolejność dokumentów', uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/zarzadzaj',
      html: '<section class="sekcja">' + wstep(docs.length ? opis : null) +
        (docs.length ? '<p class="ogloszenie" id="ogloszenie" role="status"></p><ol class="lista-kolejnosci" id="lista-kolejnosci">' + listaKolejnosci(o) + '</ol>' +
          '<div class="przyciski-pion"><button type="button" class="btn glowny" data-akcja="wstecz" data-rodzic="#/zarzadzaj">Gotowe</button></div>' : pustyPortfel()) +
        '</section><div class="odstep-dol"></div>'
    };
  }
  function przesunDokument(id, kier) {
    var o = osoba();
    var kol = dokumentyOsoby(o).map(function (d) { return d.id; });
    var i = kol.indexOf(id), j = i + kier;
    if (i < 0 || j < 0 || j >= kol.length) return;
    kol[i] = kol[j];
    kol[j] = id;
    stan.kolejnosc[o.id] = kol;
    delete przodPortfela[o.id];
    zapisz();
    var lista = document.getElementById('lista-kolejnosci');
    if (!lista) return;
    lista.innerHTML = listaKolejnosci(o);
    var btn = lista.querySelector('[data-id="' + id + '"][data-kierunek="' + kier + '"]');
    if (!btn || btn.disabled) btn = lista.querySelector('[data-id="' + id + '"][data-kierunek="' + (-kier) + '"]');
    if (btn) btn.focus();
    var ogl = document.getElementById('ogloszenie');
    if (ogl) ogl.textContent = znajdz(o.dokumenty, id).nazwa + ' jest teraz na miejscu ' + (j + 1) + ' z ' + kol.length + '.';
  }
  function ekranUsun() {
    var o = osoba();
    var docs = dokumentyOsoby(o);
    return {
      tytul: 'Usuń dokument', uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/zarzadzaj',
      html: '<section class="sekcja">' + wstep(docs.length ? 'Wybierz dokument, który chcesz usunąć z aplikacji.' : null) +
        (docs.length ? '<ul class="lista">' + docs.map(function (d) {
          return '<li><button type="button" class="wiersz-listy" data-akcja="usun" data-id="' + d.id + '">' +
            '<span class="mini-karta k-' + d.kolor + '" aria-hidden="true"></span>' +
            '<span class="tekst"><span class="tytul-wiersza">' + d.nazwa + '</span><span class="opis">' + statusWiersza(d) + '</span></span>' +
            ikona('kosz', 'chevron ikona-usun') + '</button></li>';
        }).join('') + '</ul>' : pustyPortfel()) +
        '</section><div class="odstep-dol"></div>'
    };
  }
  function ekranUklad() {
    var o = osoba();
    return {
      tytul: 'Wybierz układ', uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/zarzadzaj',
      html: '<section class="sekcja">' + wstep('Wybierz, jak dokumenty wyglądają na ekranie Dokumenty.') +
        grupaOpcji('uklad', 'Układ dokumentów', [
          ['duze', 'Duże karty<span class="opis">Karty jedna za drugą, jak w portfelu.</span>', ikona('kartyDuze', 'ikona-opcji')],
          ['male', 'Małe karty<span class="opis">Wszystkie karty widać naraz.</span>', ikona('uslugi', 'ikona-opcji')],
          ['lista', 'Lista<span class="opis">Nazwy i statusy dokumentów.</span>', ikona('lista', 'ikona-opcji')]], ukladOsoby(o)) +
        '<button type="button" class="btn glowny" data-akcja="wstecz" data-rodzic="#/zarzadzaj">Gotowe</button></section><div class="odstep-dol"></div>'
    };
  }
  function ekranDodaj() {
    var o = osoba();
    var rodzaje = dokumentyOsoby(o).map(function (d) { return d.rodzaj; });
    return {
      tytul: 'Dodaj dokument', uklad: 'pod', zakladka: 'dokumenty', rodzic: '#/zarzadzaj',
      html: '<section class="sekcja">' + wstep('Te dokumenty możesz dodać w mObywatelu.') +
        D.doDodania.map(function (g) {
          return '<h2>' + g.nazwa + '</h2><ul class="lista">' + g.dokumenty.map(function (x) {
            var ma = x.rodzaj && rodzaje.indexOf(x.rodzaj) >= 0;
            return wierszListy('data-akcja="niedostepne" data-nazwa="' + esc(x.nazwa) + '"', null, x.nazwa, null,
              ma ? '<span class="etykieta-dziala">' + ikona('ok') + 'Masz w aplikacji</span>' : '');
          }).join('') + '</ul>';
        }).join('') + '</section><div class="odstep-dol"></div>'
    };
  }

  /* 6. Usługi */
  function ekranUslugi() {
    var najczestsze = D.najczestsze.map(function (id) {
      var u = znajdz(wszystkieUslugi(), id);
      return u ? wierszUslugi(u) : '';
    }).join('');
    var wszystkie;
    if (stan.prosty) {
      /* Tryb prosty: tylko kategorie jako duże przyciski */
      wszystkie = '<h2>Wybierz sytuację</h2><ul class="lista">' + D.kategorie.map(function (k) {
        return wierszListy('#/uslugi/' + k.id, k.ikona, k.nazwa, k.uslugi.length + ' ' + odmiana(k.uslugi.length, 'usługa', 'usługi', 'usług'));
      }).join('') + '</ul>';
    } else {
      wszystkie = '<h2 class="naglowek-sekcji">' + ikona('iskry') + 'Najczęstsze</h2><ul class="lista">' + najczestsze + '</ul>' +
        '<h2>Wszystkie usługi</h2>' + D.kategorie.map(function (k) {
          return '<section class="kategoria" aria-labelledby="kat-' + k.id + '"><h2 id="kat-' + k.id + '">' + ikona(k.ikona) + k.nazwa + '</h2>' +
            '<ul class="lista">' + k.uslugi.map(wierszUslugi).join('') + '</ul></section>';
        }).join('');
    }
    return {
      tytul: 'Usługi', uklad: 'glowny', zakladka: 'uslugi',
      html: '<section class="sekcja">' + tytul('Usługi', 'Wszystko, co możesz załatwić. Nic nie jest ukryte.') +
        '<div class="szukaj" role="search"><label class="szukaj-etykieta" for="szukaj">Szukaj usługi</label>' +
          '<label class="pole pole-szukaj">' + ikona('lupa') +
          '<input id="szukaj" type="text" inputmode="search" enterkeyhint="search" placeholder="np. PESEL" autocomplete="off"></label></div>' +
        '<div id="wyniki" aria-live="polite"></div>' +
        '<div id="lista-uslug">' + wszystkie + '</div></section><div class="odstep-dol"></div>',
      po: podlaczWyszukiwarke
    };
  }
  function ekranKategoria(id) {
    var k = znajdz(D.kategorie, id);
    if (!k) return ekranNieZnaleziono();
    return {
      tytul: k.nazwa, uklad: 'pod', zakladka: 'uslugi', rodzic: '#/uslugi',
      html: '<section class="sekcja">' + wstep() + '<ul class="lista">' + k.uslugi.map(wierszUslugi).join('') + '</ul></section><div class="odstep-dol"></div>'
    };
  }
  /* Wyszukiwarka: bez polskich znaków, po synonimach, z prostym „rdzeniem” słowa */
  var POMIJANE = ['jak', 'co', 'czy', 'mam', 'mi', 'sie', 'do', 'na', 'w', 'z', 'i', 'o', 'po', 'od', 'moj', 'moja', 'moje', 'chce', 'gdzie', 'kiedy', 'jest', 'mnie', 'to', 'ze', 'za', 'nie'];
  function pasuje(stog, slowo) {
    if (slowo.length < 3) return (' ' + stog).indexOf(' ' + slowo) >= 0;
    if (stog.indexOf(slowo) >= 0) return true;
    if (slowo.length >= 5) return stog.indexOf(slowo.slice(0, Math.max(4, slowo.length - 3))) >= 0;
    return false;
  }
  function szukajUslug(zapytanie) {
    var slowa = normalizuj(zapytanie).split(/[^a-z0-9+]+/).filter(function (s) { return s && POMIJANE.indexOf(s) < 0; });
    if (!slowa.length) return [];
    var najlepsze = 0, wyniki = [];
    wszystkieUslugi().forEach(function (u) {
      var stog = normalizuj(u.nazwa + ' ' + u.opis + ' ' + (u.slowa || '') + ' ' + u.kategoria.nazwa).replace(/[^a-z0-9+]+/g, ' ');
      var trafienia = slowa.filter(function (s) { return pasuje(stog, s); }).length;
      if (!trafienia) return;
      if (trafienia > najlepsze) { najlepsze = trafienia; wyniki = []; }
      if (trafienia === najlepsze) wyniki.push(u);
    });
    return wyniki;
  }
  function podlaczWyszukiwarke() {
    var pole = document.getElementById('szukaj');
    var wyniki = document.getElementById('wyniki');
    var lista = document.getElementById('lista-uslug');
    function pokazWyniki() {
      var q = pole.value.trim();
      if (!q) { wyniki.innerHTML = ''; lista.hidden = false; return; }
      lista.hidden = true;
      var w = szukajUslug(q);
      var naglowek = '<div class="wyniki-naglowek"><p>' + (w.length ? 'Znaleziono ' + w.length + ' ' + odmiana(w.length, 'usługę', 'usługi', 'usług') : 'Brak wyników') + '</p>' +
        '<button type="button" class="btn-tekst" data-akcja="wyczysc-szukanie">Wyczyść</button></div>';
      if (w.length) {
        wyniki.innerHTML = naglowek + '<ul class="lista">' + w.map(wierszUslugi).join('') + '</ul>';
      } else {
        wyniki.innerHTML = naglowek + '<div class="pusty-wynik"><p><b>Nie znaleźliśmy usługi „' + esc(q) + '”.</b></p>' +
          '<p>Spróbuj innego słowa albo zapytaj asystenta.</p>' +
          '<div class="przyciski-pion"><button type="button" class="btn glowny" data-akcja="zapytaj" data-pytanie="' + esc(q) + '">' + ikona('iskry') + 'Zapytaj asystenta</button>' +
          D.dzialajace.map(function (s) { return '<a class="btn drugi" href="' + s.href + '">' + ikona(s.ikona) + s.nazwa + '</a>'; }).join('') +
          '</div></div>';
      }
    }
    pole.addEventListener('input', pokazWyniki);
    pole.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); pole.blur(); } });
  }

  /* 7. Asystent (pusty stan) */
  function ekranAsystent() {
    return {
      tytul: 'Asystent', uklad: 'glowny', zakladka: 'asystent', pasekAsystenta: 'bez-podpowiedzi',
      html: '<section class="sekcja">' + tytul('Asystent') +
        '<p class="zgoda">' + ikona('tarczaOk') + 'Nic nie wyśle bez Twojej zgody</p>' +
        '<div class="pusty-stan"><div class="ilustracja" aria-hidden="true">' + ikona('iskry') + '</div>' +
          '<h2>W czym mogę pomóc?</h2><p>Napisz, powiedz albo wybierz pytanie.</p>' +
          '<ul class="podpowiedzi">' + przyciskiPodpowiedzi(D.podpowiedziAsystenta) + '</ul>' +
          '<a class="link-strzalka" href="#/uslugi">Zobacz wszystkie usługi' + ikona('dalej') + '</a>' +
        '</div></section><div class="odstep-dol"></div>'
    };
  }

  /* 8. Kod QR */
  function kafel(ikonaNazwa, nazwa, opis) {
    return '<button type="button" class="kafel" data-akcja="niedostepne" data-nazwa="' + nazwa + '"><span class="ikona-kolo">' + ikona(ikonaNazwa) + '</span>' +
      '<span class="tekst"><span class="tytul-wiersza">' + nazwa + '</span><span class="opis">' + opis + '</span></span>' + ikona('dalej', 'chevron') + '</button>';
  }
  function ekranKodQR() {
    return {
      tytul: 'Kod QR', uklad: 'glowny', zakladka: 'kod-qr',
      html: '<section class="sekcja">' + tytul('Kod QR', 'Potwierdź swoją tożsamość albo sprawdź dokument innej osoby.') +
        '<div class="kafle">' +
          kafel('qr', 'Pokaż swój kod', 'Ktoś zeskanuje go, żeby sprawdzić Twój dokument.') +
          kafel('skan', 'Zeskanuj kod', 'Sprawdź dokument innej osoby albo zaloguj się na stronie.') +
        '</div></section><div class="odstep-dol"></div>'
    };
  }

  /* 9. Więcej */
  function ekranWiecej() {
    var o = osoba();
    return {
      tytul: 'Więcej', uklad: 'glowny', zakladka: 'wiecej',
      html: '<section class="sekcja">' + tytul('Więcej') +
        '<div class="profil"><span class="awatar duzy" aria-hidden="true">' + o.inicjaly + '</span><span class="tekst"><b>' + (o.id === 'ola' ? 'Aleksandra (Ola)' : o.imie) + ' ' + o.nazwisko + '</b>' +
          '<span class="opis">' + o.opis + '</span></span></div>' +
        '<h2>Ustawienia</h2><ul class="lista">' +
          wierszListy('#/wyglad', 'suwaki', 'Wygląd i dostępność', opisUstawien()) +
          wierszListy('#/osoba', 'rodzina', 'Zmień osobę', 'Zobacz aplikację oczami innej osoby.') +
          wierszListy('#/dopasuj', 'powtorz', 'Pokaż wprowadzenie ponownie', 'Ustawienia wyglądu i krótkie przedstawienie asystenta.') +
        '</ul>' +
        '<h2>O prototypie</h2><div class="karta-info"><p class="mocne">' + ikona('info') + 'Prototyp konkursowy, dane fikcyjne.</p>' +
          '<ol class="wyrozniki">' +
            '<li><b>Dopasuj do siebie</b> — rozmiar tekstu, motyw i tryb prosty ustawisz już na pierwszym ekranie.</li>' +
            '<li><b>Widzisz wszystkie możliwości</b> — pełna lista usług z opisami i wyszukiwarką.</li>' +
            '<li><b>Asystent prowadzi</b> — rozpoznaje sprawę i przeprowadza Cię przez widoczne kroki.</li>' +
          '</ol></div></section><div class="odstep-dol"></div>'
    };
  }
  function ekranWyglad() {
    return {
      tytul: 'Wygląd i dostępność', uklad: 'pod', zakladka: null, rodzic: '#/wiecej',
      html: '<section class="sekcja">' + wstep('Zmiany widać od razu w podglądzie i w całej aplikacji.') + ustawieniaHtml() +
        '<button type="button" class="btn glowny" data-akcja="wstecz" data-rodzic="#/wiecej">Gotowe</button></section><div class="odstep-dol"></div>'
    };
  }

  /* 10. Skrzynka */
  function ekranSkrzynka() {
    var o = osoba();
    var n = liczbaNowych(o);
    return {
      tytul: 'Skrzynka', uklad: 'pod', zakladka: null, rodzic: '#/dokumenty',
      html: '<section class="sekcja">' + wstep(n ? 'Masz ' + n + ' ' + odmiana(n, 'nową wiadomość', 'nowe wiadomości', 'nowych wiadomości') + '.' : 'Nie masz nowych wiadomości.') +
        '<ul class="lista">' + o.wiadomosci.map(function (w) {
          var nowa = czyNowa(o, w);
          return '<li><a class="wiersz-listy wiadomosc' + (nowa ? ' nowa' : '') + '" href="#/skrzynka/' + w.id + '">' +
            '<span class="ikona-kolo">' + ikona('list') + '</span><span class="tekst">' +
            (nowa ? '<span class="etykieta-nowa">Nowa</span>' : '') +
            '<span class="tytul-wiersza">' + w.tytul + '</span><span class="opis">' + w.nadawca + ' · ' + (w.data === D.dzis ? 'dziś' : w.data) + '</span></span>' +
            ikona('dalej', 'chevron') + '</a></li>';
        }).join('') + '</ul></section><div class="odstep-dol"></div>'
    };
  }
  function ekranWiadomosc(id) {
    var o = osoba();
    var w = znajdz(o.wiadomosci, id);
    if (!w) return ekranNieZnaleziono();
    if (czyNowa(o, w)) {
      stan.przeczytane[o.id] = stan.przeczytane[o.id] || {};
      stan.przeczytane[o.id][w.id] = true;
      zapisz();
    }
    var akcja = '';
    if (w.akcja) {
      akcja = w.akcja.href ?
        '<a class="btn glowny" href="' + w.akcja.href + '">' + ikona(w.akcja.ikona) + w.akcja.tekst + '</a>' :
        '<button type="button" class="btn glowny" data-akcja="niedostepne" data-nazwa="' + esc(w.akcja.niedostepne) + '">' + ikona(w.akcja.ikona) + w.akcja.tekst + '</button>';
    }
    return {
      tytul: w.tytul, uklad: 'pod', zakladka: null, rodzic: '#/skrzynka',
      html: '<section class="sekcja">' + wstep() + '<p class="metryczka">' + w.nadawca + ' · ' + (w.data === D.dzis ? 'dziś' : w.data) + '</p>' +
        '<div class="pismo">' + w.tresc.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
        '<div class="przyciski-pion">' + akcja + '</div></section><div class="odstep-dol"></div>'
    };
  }

  /* Sprawy A i B oraz rozmowa z asystentem — na razie „W budowie” */
  function ekranWBudowie(nazwa, dodatek, rodzic, zakladka) {
    return {
      tytul: nazwa, uklad: 'pod', zakladka: zakladka || null, rodzic: rodzic || '#/dokumenty',
      html: '<section class="sekcja w-budowie">' + wstep() + '<div class="ilustracja" aria-hidden="true">' + ikona('klucz') + '</div>' +
        '<p>Ta część jest w budowie. Powstanie w kolejnym etapie prototypu.</p>' + (dodatek || '') +
        '<div class="przyciski-pion"><a class="btn glowny" href="#/dokumenty">' + ikona('dokumenty') + 'Wróć do Dokumentów</a>' +
        '<a class="btn drugi" href="#/uslugi">' + ikona('uslugi') + 'Zobacz wszystkie usługi</a></div></section><div class="odstep-dol"></div>'
    };
  }
  function ekranSprawa(id, parametry) {
    if (id === 'zgubione') {
      var dok = D.nazwyDokumentow[parametry.get('dokument')];
      return ekranWBudowie('Zgubione dokumenty', dok ? '<p class="wybrane"><span>Zaznaczony dokument</span><b>' + dok + '</b></p>' : '');
    }
    return ekranWBudowie('Samochód: OC i badanie techniczne');
  }
  function ekranRozmowa(id, parametry) {
    var pytanie = parametry.get('pytanie');
    var dodatek = pytanie ? '<p class="wybrane"><span>Twoje pytanie</span><b>„' + esc(pytanie) + '”</b></p>' :
      '<p class="wybrane"><span>Mówienie do asystenta</span><b>Też powstanie w kolejnym etapie.</b></p>';
    return ekranWBudowie('Rozmowa z asystentem', dodatek, '#/asystent', 'asystent');
  }
  function ekranNieZnaleziono() {
    return {
      tytul: 'Nie ma takiej strony', uklad: 'pod', rodzic: '#/dokumenty',
      html: '<section class="sekcja">' + wstep() + '<p>Ten adres nie prowadzi do żadnego ekranu.</p>' +
        '<div class="przyciski-pion"><a class="btn glowny" href="#/dokumenty">Wróć do Dokumentów</a></div></section>'
    };
  }

  /* ======================= PRZEJŚCIA MIĘDZY EKRANAMI ======================= */
  var TRASY = [
    [/^\/osoba$/, ekranOsoba],
    [/^\/dopasuj$/, ekranDopasuj],
    [/^\/poznaj$/, ekranPoznaj],
    [/^\/dokumenty$/, ekranDokumenty],
    [/^\/dokument\/([\w-]+)$/, ekranDokument],
    [/^\/zarzadzaj$/, ekranZarzadzaj],
    [/^\/zarzadzaj\/kolejnosc$/, ekranKolejnosc],
    [/^\/zarzadzaj\/usun$/, ekranUsun],
    [/^\/zarzadzaj\/uklad$/, ekranUklad],
    [/^\/zarzadzaj\/dodaj$/, ekranDodaj],
    [/^\/uslugi$/, ekranUslugi],
    [/^\/uslugi\/([\w-]+)$/, ekranKategoria],
    [/^\/asystent$/, ekranAsystent],
    [/^\/asystent\/(rozmowa)$/, ekranRozmowa],
    [/^\/kod-qr$/, ekranKodQR],
    [/^\/wiecej$/, ekranWiecej],
    [/^\/wyglad$/, ekranWyglad],
    [/^\/skrzynka$/, ekranSkrzynka],
    [/^\/skrzynka\/([\w-]+)$/, ekranWiadomosc],
    [/^\/sprawa\/(zgubione|samochod)(?:\/[\w-]+)?$/, ekranSprawa]
  ];
  function biezacyAdres() {
    var h = location.hash.replace(/^#/, '');
    var i = h.indexOf('?');
    return { sciezka: i < 0 ? h : h.slice(0, i), parametry: new URLSearchParams(i < 0 ? '' : h.slice(i + 1)) };
  }

  /* Głębokość historii — „Wstecz” cofa w aplikacji, a na pierwszym ekranie idzie do ekranu nadrzędnego */
  var glebokosc = 0, pierwszyEkran = true, otworzPodpowiedziPoWejsciu = false, komunikatPoPrzejsciu = null;
  function oznaczHistorie() {
    try {
      var s = history.state;
      if (s && typeof s.glebokosc === 'number') glebokosc = s.glebokosc;
      else {
        glebokosc = pierwszyEkran ? 0 : glebokosc + 1;
        history.replaceState({ glebokosc: glebokosc }, '');
      }
    } catch (e) { glebokosc = 0; }
    pierwszyEkran = false;
  }
  function wstecz(rodzic) {
    if (glebokosc > 0) history.back();
    else location.hash = rodzic || '#/dokumenty';
  }

  function pokaz() {
    zatrzymajCzytanie();
    zamknijPodpowiedzi();
    if (okno.open) zamknijOkno();
    var a = biezacyAdres();
    if (!stan.osoba && a.sciezka !== '/osoba') { location.replace('#/osoba'); return; }
    var ekran = null;
    for (var i = 0; i < TRASY.length && !ekran; i++) {
      var m = a.sciezka.match(TRASY[i][0]);
      if (m) ekran = TRASY[i][1](m[1], a.parametry);
    }
    if (!ekran) { location.replace('#/dokumenty'); return; }
    oznaczHistorie();

    var naglowek = ekran.naglowek || (ekran.uklad === 'glowny' ? naglowekAplikacji() : naglowekWstecz(ekran.rodzic || '#/dokumenty', ekran.h1 || ekran.tytul));
    var komunikat = komunikatPoPrzejsciu;
    komunikatPoPrzejsciu = null;
    tresc.innerHTML = naglowek + '<main id="glowna">' +
      (komunikat ? '<p class="komunikat-ok" role="status" tabindex="-1">' + ikona('ok') + '<span>' + esc(komunikat) + '</span></p>' : '') +
      ekran.html + '</main>';
    tresc.scrollTop = 0;
    window.scrollTo(0, 0);
    document.title = ekran.tytul + ' · mObywatel';

    nawigacja.hidden = ekran.uklad === 'wejscie';
    Array.prototype.forEach.call(nawigacja.querySelectorAll('a'), function (l) {
      if (l.getAttribute('data-zakladka') === ekran.zakladka) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });

    /* Przewijanie do elementu (np. po przejściu fokusu) zostawia miejsce na przyklejony pasek „Wstecz” */
    var pasekGory = tresc.querySelector('.naglowek-pod');
    if (obserwatorPaska) {
      obserwatorPaska.disconnect();
      if (pasekGory) obserwatorPaska.observe(pasekGory);
    }
    html.style.setProperty('--pasek-gora', (pasekGory ? Math.ceil(pasekGory.getBoundingClientRect().height) : 0) + 'px');

    pasek.hidden = !ekran.pasekAsystenta;
    pasek.setAttribute('data-tryb', ekran.pasekAsystenta || '');
    poleAsystenta.value = '';
    ustawPrzyciskMow();
    if (ekran.po) ekran.po();

    /* Fokus na tytule ekranu (albo na komunikacie) — czytnik ekranu ogłasza nowy ekran */
    if (!pierwszeRysowanie) {
      var cel = tresc.querySelector('.komunikat-ok') || tresc.querySelector('h1');
      if (cel) cel.focus({ preventScroll: true });
    }
    pierwszeRysowanie = false;

    /* Po „Zaczynam” od razu widać gotowe pytania pod polem asystenta */
    if (otworzPodpowiedziPoWejsciu && ekran.pasekAsystenta === 'z-podpowiedziami') otworzPodpowiedzi();
    otworzPodpowiedziPoWejsciu = false;
  }
  var pierwszeRysowanie = true;
  var obserwatorPaska = window.ResizeObserver ? new window.ResizeObserver(function (wpisy) {
    html.style.setProperty('--pasek-gora', Math.ceil(wpisy[0].target.getBoundingClientRect().height) + 'px');
  }) : null;

  /* ======================= POLE ASYSTENTA ======================= */
  function ustawPrzyciskMow() {
    var pisze = poleAsystenta.value.trim().length > 0;
    przyciskMow.innerHTML = pisze ? ikona('wyslij') + 'Wyślij' : ikona('mikrofon') + 'Powiedz';
  }
  function otworzPodpowiedzi() {
    if (pasek.getAttribute('data-tryb') !== 'z-podpowiedziami' || !podpowiedziPaska.hidden) return;
    podpowiedziPaska.querySelector('ul').innerHTML = przyciskiPodpowiedzi(D.pytania);
    podpowiedziPaska.hidden = false;
  }
  function zamknijPodpowiedzi() { podpowiedziPaska.hidden = true; }
  function zapytaj(tekst) {
    location.hash = '#/asystent/rozmowa' + (tekst ? '?pytanie=' + encodeURIComponent(tekst) : '?glos=1');
  }
  poleAsystenta.addEventListener('focus', otworzPodpowiedzi);
  poleAsystenta.addEventListener('click', otworzPodpowiedzi);
  poleAsystenta.addEventListener('input', ustawPrzyciskMow);
  pasek.addEventListener('submit', function (e) {
    e.preventDefault();
    zapytaj(poleAsystenta.value.trim());
  });
  pasek.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !podpowiedziPaska.hidden) { zamknijPodpowiedzi(); poleAsystenta.focus(); }
  });
  document.addEventListener('pointerdown', function (e) { if (!pasek.contains(e.target)) zamknijPodpowiedzi(); });
  document.addEventListener('focusin', function (e) { if (!pasek.contains(e.target)) zamknijPodpowiedzi(); });

  /* ======================= OKNA ======================= */
  function otworzOkno(tresc) {
    okno.innerHTML = tresc;
    if (typeof okno.showModal === 'function') okno.showModal();
    else okno.setAttribute('open', '');
    var pierwszy = okno.querySelector('h2');
    if (pierwszy) { pierwszy.setAttribute('tabindex', '-1'); pierwszy.focus(); }
  }
  function zamknijOkno() {
    if (typeof okno.close === 'function' && okno.open) okno.close();
    else okno.removeAttribute('open');
  }
  function oknoNiedostepne(nazwa) {
    otworzOkno('<span class="ikona-kolo" aria-hidden="true">' + ikona('klucz') + '</span>' +
      '<h2 id="okno-tytul">Niedostępne w prototypie</h2>' +
      (nazwa ? '<p class="okno-nazwa">' + esc(nazwa) + '</p>' : '') +
      '<p>Tej usługi nie ma jeszcze w prototypie. Działają:</p>' +
      '<div class="przyciski-pion">' + D.dzialajace.map(function (s) {
        return '<a class="btn drugi" href="' + s.href + '" data-akcja="zamknij-okno">' + ikona(s.ikona) + s.nazwa + '</a>';
      }).join('') +
      '<button type="button" class="btn glowny" data-akcja="zamknij-okno">Zamknij</button></div>');
  }
  function oknoInformacja(tytulOkna, tekst) {
    otworzOkno('<span class="ikona-kolo" aria-hidden="true">' + ikona('info') + '</span><h2 id="okno-tytul">' + tytulOkna + '</h2><p>' + tekst + '</p>' +
      '<div class="przyciski-pion"><button type="button" class="btn glowny" data-akcja="zamknij-okno">Zamknij</button></div>');
  }
  /* Usuń dokument — zawsze z potwierdzeniem */
  function oknoUsun(id) {
    var d = znajdz(osoba().dokumenty, id);
    if (!d) return;
    otworzOkno('<span class="ikona-kolo ikona-usun" aria-hidden="true">' + ikona('kosz') + '</span>' +
      '<h2 id="okno-tytul">Usunąć dokument „' + d.nazwa + '”?</h2>' +
      '<p>Dokument zniknie z aplikacji. W prototypie wróci, gdy wybierzesz osobę jeszcze raz.</p>' +
      '<div class="przyciski-pion"><button type="button" class="btn usun" data-akcja="usun-potwierdz" data-id="' + d.id + '">' + ikona('kosz') + 'Usuń dokument</button>' +
      '<button type="button" class="btn drugi" data-akcja="zamknij-okno">Anuluj</button></div>');
  }
  function usunDokument(id) {
    var o = osoba();
    var d = znajdz(o.dokumenty, id);
    if (!d) return;
    stan.kolejnosc[o.id] = dokumentyOsoby(o).map(function (x) { return x.id; }).filter(function (x) { return x !== id; });
    if (przodPortfela[o.id] === id) delete przodPortfela[o.id];
    zapisz();
    zamknijOkno();
    komunikatPoPrzejsciu = 'Usunięto dokument „' + d.nazwa + '”.';
    if (/^\/dokument\//.test(biezacyAdres().sciezka)) wstecz('#/dokumenty');
    else pokaz();
  }
  /* Kliknięcie w przyciemnione tło (poza oknem) zamyka okno */
  okno.addEventListener('click', function (e) {
    if (e.target !== okno) return;
    var r = okno.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) zamknijOkno();
  });

  /* ======================= CZYTANIE NA GŁOS (Web Speech API) ======================= */
  var czytanyPrzycisk = null;
  function ustawPrzyciskCzytania(btn, czyta) {
    btn.innerHTML = ikona(czyta ? 'stop' : 'glosnik') + '<span>' + (czyta ? 'Zatrzymaj' : 'Przeczytaj') + '</span>';
  }
  function zatrzymajCzytanie() {
    if (czytanyPrzycisk) { ustawPrzyciskCzytania(czytanyPrzycisk, false); czytanyPrzycisk = null; }
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* nic */ }
  }
  function tekstEkranu() {
    var glowna = document.getElementById('glowna');
    if (!glowna) return '';
    var tytulPaska = tresc.querySelector('.tytul-paska');
    var kopia = glowna.cloneNode(true);
    kopia.removeAttribute('id');
    Array.prototype.forEach.call(kopia.querySelectorAll('button, svg, input, .tylko-czytanie, .podglad, .ukryte, [aria-hidden="true"]'), function (el) { el.parentNode.removeChild(el); });
    kopia.style.cssText = 'position:absolute;left:-10000px;top:0;width:360px';
    document.body.appendChild(kopia);
    var t = (tytulPaska ? tytulPaska.textContent + '\n' : '') + kopia.innerText;
    document.body.removeChild(kopia);
    return t.split('\n').map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) { return /[.!?:…”]$/.test(l) ? l : l + '.'; }).join(' ');
  }
  function przeczytaj(btn) {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance === 'undefined') {
      oknoInformacja('Czytanie na głos', 'Ta przeglądarka nie umie czytać na głos. Spróbuj w Chrome, Edge albo Safari.');
      return;
    }
    if (czytanyPrzycisk === btn) { zatrzymajCzytanie(); return; }
    zatrzymajCzytanie();
    var u = new window.SpeechSynthesisUtterance(tekstEkranu());
    u.lang = 'pl-PL';
    u.rate = 0.95;
    var glosy = window.speechSynthesis.getVoices() || [];
    for (var i = 0; i < glosy.length; i++) if (/^pl/i.test(glosy[i].lang)) { u.voice = glosy[i]; break; }
    u.onend = u.onerror = function () { if (czytanyPrzycisk === btn) { ustawPrzyciskCzytania(btn, false); czytanyPrzycisk = null; } };
    czytanyPrzycisk = btn;
    ustawPrzyciskCzytania(btn, true);
    window.speechSynthesis.speak(u);
  }

  /* ======================= KLIKNIĘCIA ======================= */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-akcja]');
    if (!el || el.disabled) return;
    var akcja = el.getAttribute('data-akcja');
    switch (akcja) {
      case 'wstecz': wstecz(el.getAttribute('data-rodzic')); break;
      case 'wybierz-osobe':
        wybierzOsobe(el.getAttribute('data-osoba'));
        location.hash = '#/dopasuj';
        break;
      case 'zaczynam':
        otworzPodpowiedziPoWejsciu = true;
        location.hash = '#/dokumenty';
        break;
      case 'pomin': location.hash = '#/dokumenty'; break;
      case 'na-przod': naPrzod(el.getAttribute('data-id')); break;
      case 'przesun': przesunDokument(el.getAttribute('data-id'), +el.getAttribute('data-kierunek')); break;
      case 'usun': oknoUsun(el.getAttribute('data-id')); break;
      case 'usun-potwierdz': usunDokument(el.getAttribute('data-id')); break;
      case 'niedostepne': oknoNiedostepne(el.getAttribute('data-nazwa')); break;
      case 'zamknij-okno': zamknijOkno(); break;
      case 'zapytaj': zapytaj(el.getAttribute('data-pytanie')); break;
      case 'przeczytaj': przeczytaj(el); break;
      case 'wyczysc-szukanie':
        var pole = document.getElementById('szukaj');
        if (pole) { pole.value = ''; pole.dispatchEvent(new Event('input')); pole.focus(); }
        break;
      case 'przelacz':
        var klucz = el.getAttribute('data-klucz');
        stan[klucz] = !stan[klucz];
        zapisz();
        zastosujUstawienia();
        el.setAttribute('aria-checked', String(stan[klucz]));
        el.querySelector('.slowo').textContent = stan[klucz] ? el.getAttribute('data-wl') : el.getAttribute('data-wyl');
        break;
    }
  });
  /* Ustawienia i układ zmieniają się od razu (bez przerysowania ekranu) */
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.type !== 'radio' || ['tekst', 'motyw', 'uklad'].indexOf(el.name) < 0) return;
    if (el.name === 'uklad') stan.uklady[osoba().id] = el.value;
    else stan[el.name] = el.value;
    zapisz();
    zastosujUstawienia();
    Array.prototype.forEach.call(document.querySelectorAll('input[name="' + el.name + '"]'), function (r) {
      r.closest('.opcja').classList.toggle('wybrana', r.checked);
    });
  });

  /* ======================= PASEK TELEFONU: GODZINA ======================= */
  var zegar = document.getElementById('zegar');
  function ustawZegar() {
    var d = new Date();
    zegar.textContent = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  ustawZegar();
  setInterval(ustawZegar, 15000);

  /* ======================= START ======================= */
  (function start() {
    ustawGilosz();
    var parametry;
    try { parametry = new URLSearchParams(location.search); } catch (e) { parametry = null; }
    var zmieniono = false;
    if (parametry && parametry.get('reset') === '1') {
      try { localStorage.removeItem(KLUCZ); } catch (e) { /* nic */ }
      stan = wczytaj();
      stan.osoba = null;
      location.hash = '';
      zmieniono = true;
    }
    if (parametry && D.osoby[parametry.get('osoba')]) {
      wybierzOsobe(parametry.get('osoba'));
      zmieniono = true;
    }
    if (zmieniono) {
      /* Usuń parametry z adresu, żeby odświeżenie nie resetowało aplikacji */
      try { history.replaceState(null, '', location.pathname + location.hash); }
      catch (e) { location.replace(location.pathname + location.hash); return; }
    }
    zastosujUstawienia();
    if (!biezacyAdres().sciezka) {
      try { history.replaceState(null, '', '#' + (stan.osoba ? '/dokumenty' : '/osoba')); }
      catch (e) { location.replace('#' + (stan.osoba ? '/dokumenty' : '/osoba')); return; }
    }
    pokaz();
    window.addEventListener('hashchange', pokaz);
  })();
})();
