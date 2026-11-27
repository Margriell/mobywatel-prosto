/* CZĘŚĆ 3 — dane w formularzach (sprawa C i pozostałe pola).
   Puste pola, same spacje, 5000 znaków, emoji, znaki spoza alfabetu łacińskiego, tekst od prawej do lewej,
   wklejony tekst z nowymi liniami, kody pocztowe, daty. Każdy błąd: komunikat przy polu z podpowiedzią. */
'use strict';
const { otworz, trasa, tekstGlowny } = require('../lib/aplikacja');
const { ustawPole, zaznacz, wyslijFormularz, klikJs, idzDo } = require('../lib/ekrany');
const { czekaj } = require('../lib/przegladarka');

const NAZWA = 'Część 3 — dane w formularzach';
const DLUGI = 'a'.repeat(4999) + '5';
const DOBRE = { 'm-ulica': 'ul. Polna 12', 'm-mieszkanie': '', 'm-kod': '21-100', 'm-miejscowosc': 'Lublin' };

/* [pole, wartość, opis, oczekiwane: 'ok' | 'blad', waga, gdy wynik inny niż oczekiwany] */
const PRZYPADKI_ADRESU = [
  ['m-ulica', '', 'puste', 'blad'], ['m-ulica', '     ', 'same spacje', 'blad'], ['m-ulica', 'Lipowa', 'bez numeru', 'blad'],
  ['m-ulica', 'ul. Lipowa 5', 'zwykły adres', 'ok'], ['m-ulica', 'ul. Generała Władysława Sikorskiego 112A', 'długa nazwa z literą przy numerze', 'ok'],
  ['m-ulica', DLUGI, '5000 znaków', 'blad', 'poważny'], ['m-ulica', '🏠🏠 5', 'emoji zamiast nazwy', 'blad', 'poważny'], ['m-ulica', '5', 'sam numer', 'blad', 'poważny'],
  ['m-ulica', '!!! 5', 'same znaki', 'blad', 'poważny'], ['m-ulica', 'вул. Шевченка 5', 'cyrylica', 'ok', 'drobny'], ['m-ulica', 'שדרות רוטשילד 5', 'tekst od prawej do lewej', 'ok', 'drobny'],
  ['m-ulica', 'ul. Lipowa\n5', 'wklejone z nową linią', 'ok', 'drobny'], ['m-ulica', '<img src=x onerror=alert(1)> 5', 'kod HTML', 'ok|blad', 'krytyczny'],
  ['m-mieszkanie', '', 'puste (pole nieobowiązkowe)', 'ok'], ['m-mieszkanie', '5', 'numer', 'ok'], ['m-mieszkanie', '5a', 'numer z literą', 'ok'], ['m-mieszkanie', '5/2', 'z ukośnikiem', 'blad'],
  ['m-mieszkanie', 'm. 5', 'z „m.” przed numerem', 'ok|blad', 'drobny'], ['m-mieszkanie', '😀', 'emoji', 'blad'], ['m-mieszkanie', '12345', '5 cyfr', 'blad'], ['m-mieszkanie', '   ', 'same spacje', 'ok'],
  ['m-kod', '', 'pusty', 'blad'], ['m-kod', '21100', '„21100”', 'ok'], ['m-kod', '21 100', '„21 100”', 'ok', 'poważny'], ['m-kod', '21-1000', '„21-1000”', 'blad'],
  ['m-kod', 'ab-cde', '„ab-cde”', 'blad'], ['m-kod', '21–100', 'z półpauzą „21–100”', 'ok|blad', 'drobny'], ['m-kod', ' 21-100 ', 'spacje dookoła', 'ok'], ['m-kod', '2-1100', '„2-1100”', 'blad'], ['m-kod', '😀', 'emoji', 'blad'],
  ['m-miejscowosc', '', 'pusta', 'blad'], ['m-miejscowosc', 'Bielsko-Biała', 'z łącznikiem', 'ok'], ['m-miejscowosc', 'Gdańsk 2', 'z cyfrą', 'blad'],
  ['m-miejscowosc', '😀', 'emoji', 'blad', 'poważny'], ['m-miejscowosc', '!!!', 'same znaki', 'blad', 'poważny'], ['m-miejscowosc', 'Ł'.repeat(5000), '5000 znaków', 'blad', 'poważny'],
  ['m-miejscowosc', 'תל אביב', 'tekst od prawej do lewej', 'ok', 'drobny'], ['m-miejscowosc', 'Київ', 'cyrylica', 'ok', 'drobny'], ['m-miejscowosc', '   ', 'same spacje', 'blad']
];
function dzis(dni) { const d = new Date(); d.setDate(d.getDate() + (dni || 0)); return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); }
const PRZYPADKI_DATY = [
  ['', 'pusta (wybrane „Od innego dnia”)', 'blad'], ['29.02.2025', '29.02 w roku nieprzestępnym', 'blad'], ['29.02.2024', '29.02 w roku przestępnym', 'ok'], ['31.04.2026', '31 kwietnia', 'blad'],
  [dzis(1), 'jutro', 'blad'], ['01.01.2030', 'za kilka lat', 'blad'], [dzis(0), 'dziś', 'ok'], ['01.01.1850', 'bardzo stara', 'blad'],
  ['01.01.1901', 'przed urodzeniem osoby', 'blad', 'drobny'], ['ab.cd.efgh', 'litery zamiast cyfr', 'blad'], ['wczoraj', 'słowo', 'blad'], ['1.1.2020', 'bez zer', 'ok'],
  ['01/11/2025', 'z ukośnikami', 'ok'], ['2025-11-01', 'zapis rok-miesiąc-dzień', 'blad'], ['00.00.0000', 'same zera', 'blad'], ['01.11.25', 'rok dwiema cyframi', 'blad'], ['😀', 'emoji', 'blad']
];

async function bladPola(s, id) {
  return s.js((id) => {
    const b = document.getElementById('blad-' + id);
    const pole = document.getElementById(id);
    if (!b || b.hidden) return null;
    const blok = (pole && (pole.closest('.pole-formularza') || pole)) || null;
    const opis = pole ? (pole.getAttribute('aria-describedby') || '') : '';
    return { tekst: b.textContent.trim(), ikona: !!b.querySelector('svg'), przyPolu: !!(blok && blok.contains(b)), opisany: opis.split(' ').indexOf('blad-' + id) >= 0,
      niewazne: pole && pole.matches('input') ? pole.getAttribute('aria-invalid') === 'true' : true, fokus: document.activeElement === pole || (pole && pole.contains(document.activeElement)),
      ramka: pole && pole.matches('input') ? getComputedStyle(pole).borderTopColor : '' };
  }, id);
}
function ocenKomunikat(b) {
  const braki = [];
  if (!b.ikona) braki.push('bez ikony');
  if (!b.przyPolu) braki.push('nie przy polu');
  if (!b.opisany) braki.push('czytnik ekranu go nie przeczyta (brak aria-describedby)');
  if (!b.niewazne) braki.push('brak aria-invalid');
  if (!/np\.|Wpisz|Dopisz|Sprawdź|Wybierz|Zaznacz|Włącz|najwyżej|Usuń/.test(b.tekst)) braki.push('bez podpowiedzi, jak poprawić');
  return braki;
}
async function przepelnienie(s) {
  return s.js(() => {
    const t = document.getElementById('tresc');
    const zle = [...document.querySelectorAll('#glowna *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > t.getBoundingClientRect().right + 1; });
    return t.scrollWidth > t.clientWidth + 1 || zle.length ? 'wychodzi poza ekran: ' + (zle[0] ? zle[0].tagName.toLowerCase() + '.' + zle[0].className : 'treść') : '';
  });
}

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    /* ---------- Adres (krok 1 sprawy C) ---------- */
    for (const [pole, wartosc, opis, oczek, wagaZla] of PRZYPADKI_ADRESU) {
      const przyp = 'Sprawa C, ' + { 'm-ulica': 'ulica i numer', 'm-mieszkanie': 'numer mieszkania', 'm-kod': 'kod pocztowy', 'm-miejscowosc': 'miejscowość' }[pole] + ': ' + opis;
      try {
        await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zameldowanie' });
        for (const [id, w] of Object.entries(DOBRE)) if (id !== pole) await ustawPole(s, id, w);
        await ustawPole(s, pole, '');
        await s.klik('#' + pole);
        if (wartosc.indexOf('\n') >= 0) await s.js((id, w) => { const e = document.getElementById(id); e.value = w; e.dispatchEvent(new Event('input', { bubbles: true })); return true; }, pole, wartosc);
        else if (wartosc) await s.pisz(wartosc);
        await s.klikTekst('Dalej');
        await czekaj(120);
        const h = await trasa(s);
        const przyjete = /krok-2$/.test(h);
        const b = przyjete ? null : await bladPola(s, pole);
        let wynik = przyjete ? 'przyjęte' : b ? 'błąd: „' + b.tekst + '”' : 'nie przyjęte, ale bez komunikatu przy tym polu';
        let blad = '';
        if (!przyjete && !b) blad = wynik;
        if (b) { const braki = ocenKomunikat(b); if (braki.length) blad = 'komunikat „' + b.tekst + '”: ' + braki.join(', '); }
        if (!blad && oczek !== 'ok|blad' && (oczek === 'ok') !== przyjete) blad = (przyjete ? 'przyjęło' : 'odrzuciło') + ' „' + wartosc.slice(0, 40) + (wartosc.length > 40 ? '…' : '') + '” (' + wynik + ')';
        /* Przyjęte wartości: podsumowanie i Skrzynka pokazują je bezpiecznie i bez rozjeżdżania */
        if (przyjete) {
          await zaznacz(s, 'od', 'dzis'); await wyslijFormularz(s); await zaznacz(s, 'podstawa', 'wynajem'); await wyslijFormularz(s);
          const podsum = await tekstGlowny(s);
          const p1 = await przepelnienie(s);
          await klikJs(s, '[data-akcja="potwierdz"]'); await klikJs(s, '[data-akcja="potwierdz-wyslij"]');
          await idzDo(s, '#/skrzynka'); await klikJs(s, '.lista a.wiersz-listy');
          const p2 = await przepelnienie(s);
          const wstrzykniety = await s.js(`!!document.querySelector('#glowna img, #glowna script, #glowna b')`);
          const okna = s.zdarzenia.splice(0);
          if (okna.length || wstrzykniety) { blad = 'wykonał się wpisany kod HTML w Skrzynce' + (okna.length ? ' (' + okna.join(', ') + ')' : ''); }
          else if (p1 || p2) blad = blad || ((p1 ? 'podsumowanie: ' + p1 : '') + (p2 ? ' Skrzynka: ' + p2 : ''));
          wynik += '; podsumowanie: „' + podsum.slice(podsum.indexOf('Adres'), podsum.indexOf('Adres') + 70).replace(/\n/g, ' ') + '”';
        }
        ctx.wynik(NAZWA, przyp, !blad, blad || wynik, /wykonał się/.test(blad) ? 'krytyczny' : (wagaZla || 'poważny'));
        ctx.ekran();
      } catch (e) { ctx.wynik(NAZWA, przyp, false, 'błąd testu: ' + e.message, 'poważny'); }
      ctx.konsola(s, przyp);
    }
    /* ---------- Data (krok 2 sprawy C) ---------- */
    for (const [wartosc, opis, oczek, wagaZla] of PRZYPADKI_DATY) {
      const przyp = 'Sprawa C, data „od kiedy”: ' + opis + (wartosc ? ' („' + wartosc + '”)' : '');
      try {
        await otworz(s, ctx.baza, { osoba: 'ola', trasa: '/sprawa/zameldowanie' });
        await wyslijFormularz(s);
        await zaznacz(s, 'od', 'inna');
        await s.klik('#m-data');
        if (wartosc) await s.pisz(wartosc);
        await s.klikTekst('Dalej');
        await czekaj(120);
        const przyjete = /krok-3$/.test(await trasa(s));
        const b = przyjete ? null : await bladPola(s, 'm-data');
        let blad = '';
        if (!przyjete && !b) blad = 'nie przyjęte, ale bez komunikatu przy polu';
        if (b) { const braki = ocenKomunikat(b); if (braki.length) blad = 'komunikat „' + b.tekst + '”: ' + braki.join(', '); }
        if (!blad && (oczek === 'ok') !== przyjete) blad = (przyjete ? 'przyjęło' : 'odrzuciło') + ' datę „' + wartosc + '”' + (b ? ' (' + b.tekst + ')' : '');
        ctx.wynik(NAZWA, przyp, !blad, blad || (przyjete ? 'przyjęte' : 'błąd: „' + b.tekst + '”'), wagaZla || 'poważny');
        ctx.ekran();
      } catch (e) { ctx.wynik(NAZWA, przyp, false, 'błąd testu: ' + e.message, 'poważny'); }
    }
    /* ---------- Pozostałe pola formularzy (wybory) ---------- */
    const wybory = [
      ['Sprawa A, krok 1: nic nie zaznaczone', 'tomasz', '/sprawa/zgubione', null, 'zginelo'],
      ['Sprawa A, krok 2: wszystko wyłączone', 'tomasz', '/sprawa/zgubione/krok-2', async () => { await s.js(`document.querySelectorAll('[data-akcja="przelacz-dzialanie"][aria-checked="true"]').forEach((b) => b.click())`); }, 'dzialania'],
      ['Sprawa B, krok 2: żaden termin', 'tomasz', '/sprawa/samochod/krok-2', async () => { await zaznacz(s, 'terminy', 'oc', false); await zaznacz(s, 'terminy', 'badanie', false); }, 'terminy'],
      ['Sprawa C, krok 2: nic nie wybrane', 'ola', '/sprawa/zameldowanie', async () => { await wyslijFormularz(s); }, 'od'],
      ['Sprawa C, krok 3: nic nie wybrane', 'ola', '/sprawa/zameldowanie', async () => { await wyslijFormularz(s); await zaznacz(s, 'od', 'dzis'); await wyslijFormularz(s); }, 'podstawa']
    ];
    for (const [przyp, osoba, adres, przygotuj, id] of wybory) {
      try {
        await otworz(s, ctx.baza, { osoba, trasa: adres });
        if (przygotuj) await przygotuj();
        await s.klik('form.krok-formularz button[type="submit"]');
        await czekaj(120);
        const b = await bladPola(s, id);
        const braki = b ? ocenKomunikat(b) : ['brak komunikatu'];
        ctx.wynik(NAZWA, przyp, !braki.length, braki.length ? (b ? '„' + b.tekst + '”: ' : '') + braki.join(', ') : '„' + b.tekst + '” (ikona, przy polu, fokus: ' + (b.fokus ? 'tak' : 'nie') + ')', 'poważny');
        ctx.ekran();
      } catch (e) { ctx.wynik(NAZWA, przyp, false, 'błąd testu: ' + e.message, 'poważny'); }
    }
    /* ---------- Fokus i ogłoszenie przy kilku błędach naraz ---------- */
    try {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zameldowanie' });
      await s.klikTekst('Dalej');
      const st = await s.js(() => ({ fokus: document.activeElement.id, bledy: [...document.querySelectorAll('.blad-pola:not([hidden])')].map((b) => b.textContent.trim()) }));
      ctx.wynik(NAZWA, 'Sprawa C, krok 1: wszystkie pola puste — komunikat przy każdym polu, fokus na pierwszym', st.bledy.length === 3 && st.fokus === 'm-ulica', st.bledy.length + ' komunikaty, fokus na #' + st.fokus + ': ' + st.bledy.join(' / '), 'poważny');
    } catch (e) { ctx.wynik(NAZWA, 'Sprawa C, krok 1: wszystkie pola puste', false, e.message, 'poważny'); }
    /* ---------- Wyszukiwarka usług i pole asystenta ---------- */
    const dziwne = [['5000 znaków', 'a'.repeat(5000)], ['emoji', '🚗🪪💳'], ['tekst od prawej do lewej', 'שלום עולם'], ['kod HTML', '<img src=x onerror=alert(1)>'], ['same spacje', '     '], ['cyrylica', 'паспорт']];
    for (const [opis, tekst] of dziwne) {
      const przyp = 'Wyszukiwarka usług: ' + opis;
      try {
        await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/uslugi' });
        await s.klik('#szukaj'); await s.pisz(tekst); await czekaj(100);
        const p = await przepelnienie(s);
        const okna = s.zdarzenia.splice(0), wstrz = await s.js(`!!document.querySelector('#glowna img')`);
        const t = await s.js(`document.getElementById('wyniki').innerText.replace(/\\s+/g, ' ').slice(0, 80)`);
        const blad = okna.length || wstrz ? 'wykonał się kod HTML' : p;
        ctx.wynik(NAZWA, przyp, !blad, blad || (t.trim() ? '„' + t + '”' : 'pusta wyszukiwarka — pełna lista usług'), okna.length || wstrz ? 'krytyczny' : 'poważny');
        ctx.ekran();
      } catch (e) { ctx.wynik(NAZWA, przyp, false, 'błąd testu: ' + e.message, 'poważny'); }
    }
    for (const [opis, tekst] of dziwne) {
      const przyp = 'Pole asystenta: ' + opis;
      try {
        await otworz(s, ctx.baza, { osoba: 'ola', trasa: '/asystent' });
        await s.klik('#pole-asystenta'); await s.pisz(tekst);
        const t0 = Date.now();
        /* Same spacje: Enter w polu (przycisk pokazuje wtedy „Powiedz”, więc jego dotknięcie słusznie włącza mikrofon) */
        if (tekst.trim()) await s.klik('#przycisk-mow'); else await s.klawisz('Enter');
        await czekaj(150);
        const czas = Date.now() - t0;
        const p = await przepelnienie(s);
        const okna = s.zdarzenia.splice(0), wstrz = await s.js(`!!document.querySelector('#glowna img')`);
        const n = await s.js(`document.querySelectorAll('.wiad.asystent').length`);
        const mowa = await s.js(`!!document.querySelector('dialog[open]')`);
        let blad = okna.length || wstrz ? 'wykonał się kod HTML' : p;
        if (!blad && tekst.trim() && n !== 1) blad = 'brak odpowiedzi asystenta';
        if (!blad && !tekst.trim() && (n || mowa)) blad = 'same spacje: ' + (n ? 'wysłane jako pytanie' : 'włączył się mikrofon');
        ctx.wynik(NAZWA, przyp, !blad, blad || (tekst.trim() ? 'odpowiedź w ' + czas + ' ms, bez przewijania w bok' : 'nic się nie dzieje (dobrze)'), okna.length || wstrz ? 'krytyczny' : 'poważny');
        ctx.ekran();
      } catch (e) { ctx.wynik(NAZWA, przyp, false, 'błąd testu: ' + e.message, 'poważny'); }
      ctx.konsola(s, przyp);
    }
    await s.zamknij();
  }
};
