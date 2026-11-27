/* CZĘŚĆ 2 — nawigacja i stan.
   „Wstecz” w aplikacji i wstecz/dalej przeglądarki na każdym kroku, odświeżenie w środku sprawy i rozmowy,
   wejście z adresu w środek sprawy, nieistniejące adresy i parametry, zmiana ustawień w trakcie,
   dwie karty, zablokowana pamięć przeglądarki, okno prywatne, ponowne przejście spraw,
   usunięcie wszystkich dokumentów, bardzo szybkie i wielokrotne kliknięcia. */
'use strict';
const { otworz, trasa, czekajNaTrase, tekstGlowny, oknoOtwarte, stan, KLUCZ } = require('../lib/aplikacja');
const { idzDo, klikJs, zaznacz, wyslijFormularz, ustawPole, zapytaj } = require('../lib/ekrany');
const { czekaj } = require('../lib/przegladarka');
const wstrzyknij = require('../lib/w-stronie');

const NAZWA = 'Część 2 — nawigacja i stan';

/* Ekran ma drogę do Dokumentów: dolny pasek, link do Dokumentów albo „Wstecz” */
async function drogaDoDokumentow(s) {
  return s.js(() => {
    const nav = document.getElementById('nawigacja');
    if (nav && !nav.hidden) return 'dolny pasek';
    if ([...document.querySelectorAll('a[href="#/dokumenty"]')].some((a) => a.getBoundingClientRect().height > 0)) return 'przycisk do Dokumentów';
    if (document.querySelector('.wstecz')) return '„Wstecz”';
    if (location.hash === '#/osoba') return 'wybór osoby';
    return '';
  });
}
async function wiadomosciWSkrzynce(s, osoba) { const st = await stan(s); return ((st && st.wyniki && st.wyniki[osoba]) || {}).wiadomosci || []; }
async function liczbaTy(s) { return s.js(`document.querySelectorAll('.wiad.ty').length`); }

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    const W = (przypadek, ok, szczegoly, waga) => { ctx.wynik(NAZWA, przypadek, ok, szczegoly, waga); ctx.ekran(); };
    const sprobuj = async (przypadek, f, waga) => {
      try { const r = await f(); if (r !== undefined) W(przypadek, !r.blad, r.blad || r.ok, r.waga || waga); }
      catch (e) { W(przypadek, false, 'błąd testu: ' + e.message, waga || 'poważny'); }
      ctx.konsola(s, przypadek);
    };

    /* ---------- 2.1 „Wstecz” w aplikacji oraz wstecz/dalej przeglądarki na każdym kroku ---------- */
    const kroki = {
      A: { osoba: 'tomasz', start: '/sprawa/zgubione', dalej: [
        async () => { await zaznacz(s, 'zginelo', 'dowod'); await wyslijFormularz(s); },
        async () => { await wyslijFormularz(s); }], ekrany: [/zgubione$/, /krok-2$/, /krok-3$/] },
      B: { osoba: 'tomasz', start: '/sprawa/samochod', dalej: [async () => { await klikJs(s, 'a[href="#/sprawa/samochod/krok-2"]'); }], ekrany: [/samochod$/, /samochod\/krok-2$/] },
      C: { osoba: 'ola', start: '/sprawa/zameldowanie', dalej: [
        async () => { await wyslijFormularz(s); },
        async () => { await zaznacz(s, 'od', 'dzis'); await wyslijFormularz(s); },
        async () => { await zaznacz(s, 'podstawa', 'wynajem'); await wyslijFormularz(s); }], ekrany: [/zameldowanie$/, /krok-2$/, /krok-3$/, /krok-4$/] }
    };
    for (const [nazwa, k] of Object.entries(kroki)) {
      for (let n = 1; n < k.ekrany.length; n++) {
        await sprobuj('Sprawa ' + nazwa + ', krok ' + (n + 1) + ': „Wstecz” w aplikacji, potem dalej i wstecz w przeglądarce', async () => {
          await otworz(s, ctx.baza, { osoba: k.osoba, trasa: '/dokumenty' });
          await idzDo(s, '#' + k.start);
          for (let i = 0; i < n; i++) await k.dalej[i]();
          await czekajNaTrase(s, k.ekrany[n]);
          await klikJs(s, '.wstecz');
          const h1 = await czekajNaTrase(s, k.ekrany[n - 1]).catch(() => null);
          if (!h1) return { blad: '„Wstecz” nie wraca do kroku ' + n + ' (jest ' + await trasa(s) + ')' };
          /* Odpowiedzi z kroku zostają */
          if (nazwa === 'A' && n === 1 && !await s.js(`!!document.querySelector('input[value="dowod"]:checked')`)) return { blad: 'po „Wstecz” zniknęło zaznaczenie „Dowód osobisty”' };
          await s.historia(1);
          const h2 = await czekajNaTrase(s, k.ekrany[n]).catch(() => null);
          if (!h2) return { blad: '„Dalej” przeglądarki nie wraca do kroku ' + (n + 1) + ' (jest ' + await trasa(s) + ')' };
          await s.historia(-1);
          const h3 = await czekajNaTrase(s, k.ekrany[n - 1]).catch(() => null);
          if (!h3) return { blad: '„Wstecz” przeglądarki nie wraca do kroku ' + n };
          return { ok: 'krok ' + (n + 1) + ' ↔ krok ' + n + ' w obie strony, odpowiedzi zostają' };
        });
      }
    }
    /* Ekran Gotowe: „Wstecz” prowadzi do Dokumentów; wstecz przeglądarki nie wysyła drugi raz */
    await sprobuj('Sprawa A, Gotowe: „Wstecz” w aplikacji prowadzi do Dokumentów', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await zaznacz(s, 'zginelo', 'dowod'); await wyslijFormularz(s); await wyslijFormularz(s);
      await klikJs(s, '[data-akcja="potwierdz"]'); await klikJs(s, '[data-akcja="potwierdz-wyslij"]');
      await czekajNaTrase(s, /krok-4$/);
      await klikJs(s, '.wstecz');
      const h = await czekajNaTrase(s, /dokumenty$/).catch(() => null);
      return h ? { ok: 'Gotowe → Wstecz → Dokumenty' } : { blad: 'jest ' + await trasa(s) };
    });
    await sprobuj('Sprawa A, Gotowe: wstecz przeglądarki — nie da się wysłać drugi raz, ekran ma sens', async () => {
      await s.historia(-1);
      const h = await trasa(s);
      await s.historia(-1);
      const h2 = await trasa(s);
      const t = await tekstGlowny(s);
      const n = (await wiadomosciWSkrzynce(s, 'tomasz')).length;
      const potw = await s.js(`!!document.querySelector('[data-akcja="potwierdz"]')`);
      return { ok: 'wstecz: ' + h + ' → ' + h2 + ' („' + t.slice(0, 90) + '”); wiadomości: ' + n + (potw ? '; jest przycisk „Potwierdzam”' : ''), blad: n !== 1 ? 'w Skrzynce ' + n + ' potwierdzeń' : (/krok-3/.test(h2) && potw ? 'po cofnięciu widać ponownie „Potwierdzam i wysyłam” zakończonej sprawy' : '') };
    }, 'drobny');

    /* ---------- 2.2 Odświeżenie w środku sprawy i rozmowy ---------- */
    await sprobuj('Odświeżenie na kroku 3 sprawy A (wybrany dowód) — odpowiedzi zostają', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await zaznacz(s, 'zginelo', 'dowod'); await wyslijFormularz(s); await wyslijFormularz(s);
      await czekajNaTrase(s, /krok-3$/);
      const przed = await tekstGlowny(s);
      await s.przeladuj(); await s.js(wstrzyknij);
      const po = await tekstGlowny(s);
      const ok = po.indexOf('Unieważnimy dowód osobisty') >= 0;
      return ok ? { ok: 'po odświeżeniu nadal „Unieważnimy dowód osobisty”' } : { blad: 'po odświeżeniu podsumowanie się zmieniło: przed „' + przed.slice(0, 140) + '”, po „' + po.slice(0, 140) + '”', waga: 'poważny' };
    });
    await sprobuj('Odświeżenie na kroku 2 sprawy C (wpisany nowy adres) — adres zostaje', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zameldowanie' });
      await ustawPole(s, 'm-ulica', 'ul. Polna 12'); await ustawPole(s, 'm-kod', '21-100'); await ustawPole(s, 'm-miejscowosc', 'Lublin');
      await wyslijFormularz(s); await czekajNaTrase(s, /krok-2$/);
      await s.przeladuj(); await s.js(wstrzyknij);
      await zaznacz(s, 'od', 'dzis'); await wyslijFormularz(s);
      await zaznacz(s, 'podstawa', 'wynajem'); await wyslijFormularz(s);
      const t = await tekstGlowny(s);
      return t.indexOf('ul. Polna 12') >= 0 ? { ok: 'adres zachowany po odświeżeniu' } : { blad: 'po odświeżeniu adres zginął: „' + t.slice(0, 160) + '”' };
    });
    await sprobuj('Odświeżenie na ekranie Gotowe — nadal widać, co zrobiono', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/samochod/krok-2' });
      await wyslijFormularz(s); await czekajNaTrase(s, /krok-3$/);
      const przed = await tekstGlowny(s);
      await s.przeladuj(); await s.js(wstrzyknij);
      const po = await tekstGlowny(s);
      return po === przed ? { ok: 'ten sam ekran Gotowe' } : { blad: 'przed: „' + przed.slice(0, 120) + '” po: „' + po.slice(0, 120) + '”', waga: 'drobny' };
    });
    await sprobuj('Odświeżenie w środku rozmowy z asystentem — rozmowa zostaje', async () => {
      await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/asystent' });
      await zapytaj(s, 'Wytłumacz mi pismo'); await zapytaj(s, 'Zginął mi portfel');
      const przed = await liczbaTy(s);
      await s.przeladuj(); await s.js(wstrzyknij);
      const po = await liczbaTy(s);
      return po === przed ? { ok: 'rozmowa zachowana (' + po + ' pytania)' } : { blad: 'po odświeżeniu rozmowa zniknęła (było ' + przed + ' pytań, jest ' + po + ')' };
    });

    /* ---------- 2.3 Wejście z adresu w środek sprawy, dziwne adresy i parametry ---------- */
    const adresy = [
      ['tomasz', '/sprawa/zgubione/krok-2', 'sens'], ['tomasz', '/sprawa/zgubione/krok-3', 'bez-wysylki'], ['tomasz', '/sprawa/zgubione/krok-4', 'nie-gotowe'],
      ['tomasz', '/sprawa/zgubione/krok-9', 'nie-gotowe'], ['tomasz', '/sprawa/zgubione/krok-0', 'sens'], ['tomasz', '/sprawa/samochod/krok-2', 'sens'], ['tomasz', '/sprawa/samochod/krok-3', 'nie-gotowe'],
      ['ola', '/sprawa/zameldowanie/krok-2', 'sens'], ['ola', '/sprawa/zameldowanie/krok-3', 'sens'], ['tomasz', '/sprawa/zameldowanie/krok-3', 'sens'], ['tomasz', '/sprawa/zameldowanie/krok-4', 'bez-wysylki'], ['ola', '/sprawa/zameldowanie/krok-5', 'nie-gotowe'],
      ['halina', '/sprawa/samochod/krok-2', 'sens'], ['halina', '/sprawa/samochod/krok-3', 'nie-gotowe'],
      ['tomasz', '/cokolwiek', 'sens'], ['tomasz', '/', 'sens'], ['tomasz', '', 'sens'], ['tomasz', '//', 'sens'], ['tomasz', '/dokument/xyz', 'sens'], ['tomasz', '/dokument/kdr', 'sens'], ['tomasz', '/uslugi/xyz', 'sens'],
      ['tomasz', '/skrzynka/xyz', 'sens'], ['tomasz', '/sprawa/inna', 'sens'], ['tomasz', '/asystent/rozmowa?pytanie=zgubiłem dowód', 'sens'], ['tomasz', '/asystent/rozmowa?pytanie=<img src=x onerror=alert(1)>', 'sens'],
      ['tomasz', '/DOKUMENTY', 'sens'], ['tomasz', '/dokumenty/', 'sens'], ['tomasz', '/dokumenty?x=1', 'sens'], ['tomasz', '/zarzadzaj/xyz', 'sens'], ['tomasz', '/sprawa/zgubione/krok-2?tylko=pesel&zginelo=<b>x</b>', 'sens'],
      [null, '/sprawa/zgubione/krok-3', 'osoba'], [null, '/dokumenty', 'osoba'], [null, '/wiecej', 'osoba']
    ];
    for (const [osoba, adres, oczek] of adresy) {
      await sprobuj('Wejście z adresu #' + adres + (osoba ? ' (' + osoba + ')' : ' (bez wybranej osoby)'), async () => {
        await otworz(s, ctx.baza, osoba ? { osoba, trasa: adres } : { stan: null, trasa: adres });
        await czekaj(150);
        const h = await trasa(s), t = await tekstGlowny(s), droga = await drogaDoDokumentow(s);
        const zdarzenia = s.zdarzenia.splice(0);
        if (zdarzenia.length) return { blad: 'wykonał się kod z adresu: ' + zdarzenia.join(', '), waga: 'krytyczny' };
        if (!t) return { blad: 'pusty ekran (' + h + ')' };
        if (!droga) return { blad: 'brak drogi do Dokumentów (' + h + ')' };
        if (oczek === 'nie-gotowe' && /Sprawa jest załatwiona|Przypomnienie ustawione|Wysłaliśmy wniosek|unieważniony|zastrzeżony\./.test(t) && !/Nie /.test(t.slice(0, 30))) return { blad: 'ekran „Gotowe” bez wysłania sprawy: „' + t.slice(0, 120) + '”', waga: 'poważny' };
        if (oczek === 'bez-wysylki' && await s.js(`!!document.querySelector('[data-akcja="potwierdz"]')`)) return { blad: 'od razu „Potwierdzam i wysyłam” bez wcześniejszych kroków: „' + t.slice(0, 140) + '”', waga: 'poważny' };
        if (oczek === 'osoba' && h !== '#/osoba') return { blad: 'bez osoby oczekiwano wyboru osoby, jest ' + h };
        return { ok: h + ' — „' + t.slice(0, 80) + '” (' + droga + ')' };
      });
    }
    const parametry = [
      ['osoba=nieznana', 'tomasz'], ['osoba=HALINA', 'tomasz'], ['osoba=', 'tomasz'], ['osoba=ola&osoba=halina', 'ola'], ['reset=1', null], ['reset=1&osoba=ola', 'ola'], ['reset=0', 'tomasz'], ['reset=1', null, '/sprawa/zgubione/krok-2']
    ];
    for (const [p, oczekOsoba, adres] of parametry) {
      await sprobuj('Parametr ?' + p + (adres ? ' na #' + adres : ''), async () => {
        await otworz(s, ctx.baza, { osoba: 'tomasz', parametry: p, trasa: adres || '/dokumenty' });
        await czekaj(150);
        const st = await stan(s), h = await trasa(s), t = await tekstGlowny(s), url = await s.js('location.href');
        const os = st ? st.osoba : null;
        if (!t) return { blad: 'pusty ekran' };
        if ((os || null) !== oczekOsoba) return { blad: 'osoba: ' + os + ' (oczekiwano ' + oczekOsoba + ')' };
        if (p.indexOf('reset=1') >= 0) {
          if (/reset=1/.test(url)) return { blad: 'po resecie w adresie zostało ?reset=1 — odświeżenie znów skasuje wszystko (' + url + ')', waga: 'drobny' };
          await s.js('window.__znacznik = 1');
          const wstecz = await s.historia(-1);
          await czekaj(300);
          let ten = false, url2 = '';
          try { ten = await s.js('window.__znacznik === 1'); url2 = await s.js('location.href'); } catch (e) { /* inna strona się wczytuje */ }
          if (wstecz && ten && /reset=1/.test(url2)) return { blad: 'reset dokłada wpis w historii: wstecz wraca do adresu z ?reset=1 (' + url2.replace(ctx.baza, '') + '), a odświeżenie tam znów kasuje wszystko', waga: 'drobny' };
          return { ok: 'reset: ' + h + ', adres bez ?reset=1' };
        }
        return { ok: 'osoba: ' + os + ', ekran: ' + h };
      });
    }

    /* ---------- 2.4 Zmiana osoby, motywu, tekstu i trybu prostego w środku sprawy i rozmowy ---------- */
    await sprobuj('Zmiana motywu, tekstu i trybu prostego w środku sprawy A — odpowiedzi zostają', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await zaznacz(s, 'zginelo', 'dowod'); await zaznacz(s, 'zginelo', 'karty'); await wyslijFormularz(s);
      await czekajNaTrase(s, /krok-2$/);
      await idzDo(s, '#/wyglad');
      await zaznacz(s, 'motyw', 'kontrast'); await zaznacz(s, 'tekst', 'bardzo-duzy'); await klikJs(s, '[data-klucz="prosty"]');
      await s.historia(-1);
      await czekajNaTrase(s, /krok-2$/);
      const t = await tekstGlowny(s);
      const motyw = await s.js('document.documentElement.dataset.motyw + "/" + document.documentElement.dataset.tekst + "/" + document.documentElement.dataset.prosty');
      return t.indexOf('Unieważnimy dowód osobisty') >= 0 && t.indexOf('828 828 828') >= 0 && motyw === 'kontrast/bardzo-duzy/tak' ? { ok: 'krok 2 z odpowiedziami, nowy wygląd ' + motyw } : { blad: 'po zmianie: ' + motyw + ' „' + t.slice(0, 120) + '”' };
    });
    await sprobuj('Zmiana wyglądu w środku rozmowy — rozmowa zostaje', async () => {
      await otworz(s, ctx.baza, { osoba: 'ola', trasa: '/asystent' });
      await zapytaj(s, 'Gdzie głosuję?'); await zapytaj(s, 'Zginął mi portfel');
      await idzDo(s, '#/wyglad'); await zaznacz(s, 'motyw', 'jasny'); await zaznacz(s, 'tekst', 'duzy');
      await idzDo(s, '#/asystent');
      const n = await liczbaTy(s);
      return n === 2 ? { ok: 'rozmowa zachowana' } : { blad: 'w rozmowie ' + n + ' pytań zamiast 2' };
    });
    await sprobuj('Zmiana osoby w środku sprawy — nowa osoba zaczyna od czystej sprawy i rozmowy', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await zaznacz(s, 'zginelo', 'prawko'); await wyslijFormularz(s);
      await idzDo(s, '#/asystent'); await zapytaj(s, 'Ile mam punktów karnych?');
      await idzDo(s, '#/osoba'); await klikJs(s, '[data-osoba="ola"]');
      await idzDo(s, '#/sprawa/zgubione/krok-2');
      const t = await tekstGlowny(s);
      await idzDo(s, '#/asystent');
      const n = await liczbaTy(s);
      return t.indexOf('prawa jazdy') < 0 && n === 0 ? { ok: 'u Oli czysta sprawa i pusta rozmowa' } : { blad: 'zostały dane Tomasza: „' + t.slice(0, 120) + '”, pytań w rozmowie: ' + n };
    });

    /* ---------- 2.5 Dwie karty przeglądarki naraz ---------- */
    await sprobuj('Dwie karty: zmiana osoby w jednej karcie widać w drugiej, a sprawa z drugiej nie nadpisuje wyboru', async () => {
      const s2 = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await s2.idz(ctx.baza + 'index.html#/dokumenty'); await s2.js(wstrzyknij);
      await idzDo(s2, '#/osoba'); await klikJs(s2, '[data-osoba="ola"]'); await idzDo(s2, '#/dokumenty');
      await czekaj(300);
      /* Karta 1 dostała zmianę: jest u Oli, z informacją o zmianie osoby w innej karcie */
      const k1 = await s.js(`(() => { const h = document.querySelector('#tresc h1'); const k = document.querySelector('.komunikat-ok'); return (h ? h.textContent : '') + ' | ' + (k ? k.textContent : ''); })()`);
      /* Karta 1 załatwia sprawę (już jako Ola): zastrzega PESEL; karta 2 widzi skutek bez odświeżania */
      await idzDo(s, '#/sprawa/zgubione/krok-2?tylko=pesel'); await wyslijFormularz(s);
      await klikJs(s, '[data-akcja="potwierdz"]'); await klikJs(s, '[data-akcja="potwierdz-wyslij"]');
      await czekaj(300);
      await idzDo(s2, '#/asystent'); await zapytaj(s2, 'czy mój PESEL jest zastrzeżony');
      const odp = await s2.js(`[...document.querySelectorAll('.wiad.asystent')].pop().textContent`);
      await s2.przeladuj();
      const os2 = await s2.js(`document.querySelector('#tresc h1') ? document.querySelector('#tresc h1').textContent : ''`);
      const bl = s2.bledyKonsoli.splice(0);
      await s2.zamknij();
      let blad = '';
      if (!/Olu/.test(k1) || !/W innej karcie wybrano osobę: Ola/.test(k1)) blad = 'karta 1 nie przeszła na Olę: „' + k1 + '”';
      else if (odp.indexOf('Tak, Twój PESEL jest zastrzeżony') < 0) blad = 'karta 2 nie widzi zastrzeżenia z karty 1: „' + odp.slice(0, 80) + '”';
      else if (!/Olu/.test(os2)) blad = 'karta 2 po odświeżeniu pokazuje „' + os2 + '”';
      if (bl.length) blad = 'błędy: ' + bl.join(', ');
      return { ok: 'karta 1: „' + k1 + '”; karta 2: „' + odp.slice(0, 60) + '”, po odświeżeniu „' + os2 + '”', blad: blad, waga: 'poważny' };
    });

    /* ---------- 2.6 Zablokowana pamięć przeglądarki (localStorage i sessionStorage) ---------- */
    await sprobuj('Zablokowana pamięć przeglądarki: wybór osoby, sprawa A do końca, zmiana wyglądu', async () => {
      const s3 = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
      await s3.wyslij('Page.addScriptToEvaluateOnNewDocument', { source: `for (const n of ['localStorage', 'sessionStorage']) Object.defineProperty(window, n, { get() { throw new DOMException('Zablokowane przez test', 'SecurityError'); } });` });
      await s3.idz(ctx.baza + 'index.html'); await s3.js(wstrzyknij);
      const h0 = await trasa(s3);
      await klikJs(s3, '[data-osoba="tomasz"]'); await idzDo(s3, '#/dokumenty');
      await idzDo(s3, '#/sprawa/zgubione'); await zaznacz(s3, 'zginelo', 'dowod'); await wyslijFormularz(s3); await wyslijFormularz(s3);
      await klikJs(s3, '[data-akcja="potwierdz"]'); await klikJs(s3, '[data-akcja="potwierdz-wyslij"]');
      const g = await tekstGlowny(s3);
      await idzDo(s3, '#/wyglad'); await zaznacz(s3, 'motyw', 'ciemny');
      const m = await s3.js('document.documentElement.dataset.motyw');
      await idzDo(s3, '#/dokumenty');
      const st = await s3.js(`document.querySelector('.karta[data-id="dowod"] .karta-status').textContent`);
      const bl = s3.bledyKonsoli.splice(0);
      await s3.zamknij();
      const ok = h0 === '#/osoba' && /unieważniony/.test(g) && m === 'ciemny' && /Unieważniony/.test(st) && !bl.length;
      return ok ? { ok: 'start: wybór osoby; Gotowe: „' + g.slice(0, 60) + '”; motyw ciemny; mDowód „Unieważniony”; bez błędów' } : { blad: 'start ' + h0 + ', Gotowe „' + g.slice(0, 60) + '”, motyw ' + m + ', status ' + st + ', błędy: ' + bl.join(' / '), waga: 'krytyczny' };
    });
    /* ---------- 2.7 Okno prywatne (osobny profil bez zapisanych danych) ---------- */
    await sprobuj('Okno prywatne: aplikacja zaczyna od wyboru osoby i działa', async () => {
      const s4 = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844, prywatna: true });
      await s4.idz(ctx.baza + 'index.html'); await s4.js(wstrzyknij);
      const h0 = await trasa(s4);
      await klikJs(s4, '[data-osoba="halina"]'); await idzDo(s4, '#/poznaj'); await klikJs(s4, '[data-akcja="zaczynam"]');
      const h1 = await trasa(s4);
      const podp = await s4.js(`!document.getElementById('podpowiedzi-paska').hidden`);
      const bl = s4.bledyKonsoli.splice(0);
      await s4.zamknij();
      return h0 === '#/osoba' && h1 === '#/dokumenty' && podp && !bl.length ? { ok: 'wybór osoby → Dokumenty z gotowymi pytaniami' } : { blad: h0 + ' → ' + h1 + ', podpowiedzi: ' + podp + ', błędy: ' + bl.join(' / ') };
    });

    /* ---------- 2.8 Ponowne przejście spraw ---------- */
    const poA = { tomasz: { wiadomosci: [], pesel: '20.11.2026', dowodUniewazniony: true } };
    await sprobuj('Drugie zastrzeżenie już zastrzeżonego PESEL-u', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', wyniki: poA, trasa: '/uslugi' });
      await s.klikTekst('Zastrzeż PESEL');
      const t = await tekstGlowny(s);
      const potw = await s.js(`!!document.querySelector('form.krok-formularz, [data-akcja="potwierdz"]')`);
      return /PESEL jest już zastrzeżony/.test(t) && !potw ? { ok: '„Twój PESEL jest już zastrzeżony.” i nic do wysłania' } : { blad: 'można zastrzec drugi raz: „' + t.slice(0, 140) + '”' };
    });
    await sprobuj('Zgłoszenie utraty już unieważnionego dowodu', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', wyniki: { tomasz: { wiadomosci: [], dowodUniewazniony: true } }, trasa: '/dokument/dowod' });
      await s.klikTekst('Zgłoś utratę dowodu');
      await wyslijFormularz(s);
      const t = await tekstGlowny(s);
      const info = /dowód (osobisty )?jest już unieważniony/i.test(t);
      return { ok: '„' + t.slice(0, 160) + '”', blad: info ? '' : 'krok 2 nie mówi, że dowód jest już unieważniony — zgłoszenie dowodu po cichu znika: „' + t.slice(0, 160) + '”', waga: 'poważny' };
    });
    await sprobuj('Drugie przypomnienie o OC', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/samochod/krok-2' });
      await wyslijFormularz(s);
      await idzDo(s, '#/dokumenty'); await klikJs(s, 'a.uwaga');
      const t1 = await tekstGlowny(s);
      await s.klikTekst('Zmień przypomnienie'); await zaznacz(s, 'sposob', 'sms'); await wyslijFormularz(s);
      const t2 = await tekstGlowny(s);
      const n = (await wiadomosciWSkrzynce(s, 'tomasz')).length;
      return /Przypomnienie ustawione/.test(t1) && /Przypomnienie ustawione/.test(t2) ? { ok: 'krok 1 pokazuje ustawione przypomnienie i „Zmień przypomnienie”; po zmianie ' + n + ' wiadomości w Skrzynce' } : { blad: '„' + t1.slice(0, 100) + '” / „' + t2.slice(0, 100) + '”' };
    });
    await sprobuj('Drugie zameldowanie (Ola po wysłanym wniosku)', async () => {
      await otworz(s, ctx.baza, { osoba: 'ola', wyniki: { ola: { wiadomosci: [], zameldowanie: { adres: 'ul. Klonowa 8 m. 5, 80-180 Gdańsk', od: '27.11.2026', podstawa: 'wynajem', data: '27.11.2026' } } }, trasa: '/uslugi' });
      await s.klikTekst('Zameldowanie na pobyt stały');
      const t = await tekstGlowny(s);
      await idzDo(s, '#/asystent'); await zapytaj(s, 'chcę się zameldować');
      const odp = await s.js(`[...document.querySelectorAll('.wiad.asystent')].pop().innerText`);
      const info = /wysła/i.test(t);
      return { ok: 'Usługi: „' + t.slice(0, 120) + '”; asystent: „' + odp.replace(/\s+/g, ' ').slice(0, 80) + '”', blad: info ? '' : 'Usługi otwierają pusty formularz bez informacji, że wniosek już wysłano (asystent o tym mówi) — niespójne', waga: 'drobny' };
    });

    /* ---------- 2.9 Usunięcie wszystkich dokumentów ---------- */
    for (const osoba of ['tomasz', 'halina']) {
      await sprobuj('Usunięte wszystkie dokumenty (' + osoba + '): Dokumenty, asystent, sprawa A', async () => {
        await otworz(s, ctx.baza, { osoba, trasa: '/zarzadzaj/usun' });
        for (let i = 0; i < 3; i++) { await klikJs(s, '[data-akcja="usun"]'); await klikJs(s, '[data-akcja="usun-potwierdz"]'); }
        await idzDo(s, '#/dokumenty');
        const t = await tekstGlowny(s);
        await idzDo(s, '#/asystent');
        await zapytaj(s, 'pokaż dowód');
        const o1 = await s.js(`[...document.querySelectorAll('.wiad.asystent')].pop().innerText`);
        await zapytaj(s, 'Jakie mam dokumenty?');
        const o2 = await s.js(`[...document.querySelectorAll('.wiad.asystent')].pop().innerText`);
        await idzDo(s, '#/sprawa/zgubione');
        const a1 = await tekstGlowny(s);
        await zaznacz(s, 'zginelo', 'karty'); await wyslijFormularz(s); await wyslijFormularz(s);
        await klikJs(s, '[data-akcja="potwierdz"]'); await klikJs(s, '[data-akcja="potwierdz-wyslij"]');
        const g = await tekstGlowny(s);
        await idzDo(s, '#/zarzadzaj/kolejnosc');
        const k = await tekstGlowny(s);
        await idzDo(s, '#/dopasuj');
        const pd = await tekstGlowny(s);
        const bl = s.bledyKonsoli.splice(0);
        const problemy = [];
        if (!/Nie masz dokumentów/.test(t)) problemy.push('Dokumenty: „' + t.slice(0, 60) + '”');
        if (!/Nie masz mDowodu/.test(o1)) problemy.push('pokaż dowód: „' + o1.slice(0, 60) + '”');
        if (!/Gotowe|zastrzeżony/.test(g)) problemy.push('sprawa A: „' + g.slice(0, 60) + '”');
        if (bl.length) problemy.push('błędy: ' + bl.join(' / '));
        const uwaga = osoba === 'tomasz' ? ' (karta „Kończy się OC” zostaje, choć Moje pojazdy usunięte)' : '';
        return { ok: 'Dokumenty: „' + t.slice(0, 50) + '”; asystent: „' + o1.replace(/\s+/g, ' ').slice(0, 50) + '” / „' + o2.replace(/\s+/g, ' ').slice(0, 50) + '”; sprawa A krok 1: „' + a1.slice(80, 160) + '”' + uwaga, blad: problemy.join('; ') };
      });
    }
    await sprobuj('„Jakie mam dokumenty?” bez dokumentów — odpowiedź pasuje do pytania', async () => {
      await otworz(s, ctx.baza, { osoba: 'ola', kolejnosc: { ola: [] }, trasa: '/asystent' });
      await zapytaj(s, 'Jakie mam dokumenty?');
      const o = await s.js(`[...document.querySelectorAll('.wiad.asystent')].pop().innerText.replace(/\\s+/g, ' ')`);
      return { ok: '„' + o.slice(0, 90) + '”', blad: /Nie masz (żadnych )?dokumentów/.test(o) ? '' : 'na pytanie o wszystkie dokumenty odpowiada tylko o mDowodzie: „' + o.slice(0, 90) + '”', waga: 'drobny' };
    });

    /* ---------- 2.10 Bardzo szybkie i wielokrotne kliknięcia ---------- */
    await sprobuj('Podwójne kliknięcie „Potwierdzam i wysyłam” i „Potwierdź” — sprawa wysłana raz', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await zaznacz(s, 'zginelo', 'dowod'); await wyslijFormularz(s); await wyslijFormularz(s);
      await s.klik('[data-akcja="potwierdz"]', { ile: 2, czekaj: 150 });
      await s.klikTekst('Potwierdź (w prototypie wystarczy kliknąć)', { ile: 2, czekaj: 300 });
      const h = await trasa(s), n = (await wiadomosciWSkrzynce(s, 'tomasz')).length;
      return n === 1 && /krok-4$/.test(h) ? { ok: '1 potwierdzenie, ekran Gotowe' } : { blad: n + ' potwierdzeń w Skrzynce, ekran ' + h, waga: n > 1 ? 'poważny' : 'poważny' };
    });
    await sprobuj('Kliknięcie „Potwierdź” dwa razy w tej samej chwili (kod strony) — sprawa wysłana raz', async () => {
      await otworz(s, ctx.baza, { osoba: 'ola', trasa: '/sprawa/zameldowanie' });
      await wyslijFormularz(s); await zaznacz(s, 'od', 'dzis'); await wyslijFormularz(s); await zaznacz(s, 'podstawa', 'wynajem'); await wyslijFormularz(s);
      await klikJs(s, '[data-akcja="potwierdz"]');
      await s.js(`(() => { const b = document.querySelector('[data-akcja="potwierdz-wyslij"]'); b.click(); b.click(); b.click(); return true; })()`);
      await czekaj(200);
      const n = (await wiadomosciWSkrzynce(s, 'ola')).length, bl = s.bledyKonsoli.splice(0);
      return n === 1 && !bl.length ? { ok: '1 wniosek' } : { blad: n + ' wniosków w Skrzynce' + (bl.length ? '; błędy: ' + bl.join(' / ') : '') };
    });
    await sprobuj('Podwójne kliknięcie „Ustaw przypomnienie” — jedno przypomnienie, bez błędów', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/samochod/krok-2' });
      await s.klikTekst('Ustaw przypomnienie', { ile: 2, czekaj: 300 });
      const n = (await wiadomosciWSkrzynce(s, 'tomasz')).length, bl = s.bledyKonsoli.splice(0), h = await trasa(s);
      return n === 1 && !bl.length ? { ok: '1 przypomnienie, ' + h } : { blad: n + ' wiadomości w Skrzynce' + (bl.length ? '; błędy w konsoli: ' + bl.join(' / ') : '') + ', ekran ' + h };
    });
    await sprobuj('Podwójne kliknięcie gotowego pytania — jedno pytanie w rozmowie', async () => {
      await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/dokumenty' });
      await s.klik('#pole-asystenta'); await czekaj(200);
      await s.klikTekst('Wytłumacz mi pismo', { ile: 2, czekaj: 300 });
      const n = await liczbaTy(s);
      return n === 1 ? { ok: '1 pytanie' } : { blad: n + ' takie same pytania w rozmowie' };
    });
    await sprobuj('Potrójne kliknięcie podpowiedzi w rozmowie — jedno pytanie', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/asystent' });
      await s.klikTekst('Ile mam punktów karnych?', { ile: 3, czekaj: 300 });
      const n = await liczbaTy(s);
      return n === 1 ? { ok: '1 pytanie' } : { blad: n + ' takie same pytania' };
    });
    await sprobuj('Podwójne kliknięcie przełącznika — zmienia się raz', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/wyglad' });
      await s.klik('[data-klucz="prosty"]', { ile: 2, czekaj: 150 });
      const p = await s.js('document.documentElement.dataset.prosty');
      return p === 'tak' ? { ok: 'tryb prosty włączony (jedno przełączenie)' } : { blad: 'po podwójnym kliknięciu tryb prosty: ' + p + ' (przełączył się dwa razy)' };
    }, 'drobny');
    await sprobuj('Podwójne kliknięcie „W dół” w Kolejności — jedno przesunięcie', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/zarzadzaj/kolejnosc' });
      await s.klik('[data-akcja="przesun"][data-id="dowod"][data-kierunek="1"]', { ile: 2, czekaj: 150 });
      const k = await s.js(`[...document.querySelectorAll('.kolejnosc-wiersz .tytul-wiersza')].map((e) => e.textContent).join(' / ')`);
      return /^1\. mPrawo jazdy \/ 2\. mDowód/.test(k) ? { ok: k } : { blad: 'po podwójnym kliknięciu: ' + k };
    }, 'drobny');
    await sprobuj('Enter dwa razy w polu asystenta (w trwającej rozmowie) — drugi Enter nie włącza mikrofonu', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/asystent' });
      await zapytaj(s, 'Dzień dobry');
      await s.klik('#pole-asystenta'); await s.pisz('ile mam punktów');
      await s.klawisz('Enter', { czekaj: 10 }); await s.klawisz('Enter', { czekaj: 400 });
      const mowa = await s.js(`!document.getElementById('status-mowy').hidden || !!document.querySelector('dialog[open]')`);
      const okno = await oknoOtwarte(s);
      return !mowa ? { ok: 'pusty Enter nic nie robi' } : { blad: 'pusty Enter uruchomił „Powiedz”: ' + (okno || 'Słucham…') };
    });
    await sprobuj('Podwójne kliknięcie „Wyślij” — drugie kliknięcie nie włącza mikrofonu', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/asystent' });
      await s.klik('#pole-asystenta'); await s.pisz('ile mam punktów');
      await s.klik('#przycisk-mow', { ile: 2, czekaj: 400 });
      const mowa = await s.js(`!document.getElementById('status-mowy').hidden || !!document.querySelector('dialog[open]')`);
      const n = await liczbaTy(s);
      return !mowa && n === 1 ? { ok: '1 pytanie, mikrofon wyłączony' } : { blad: 'pytań: ' + n + (mowa ? ', drugie kliknięcie włączyło „Powiedz”: ' + (await oknoOtwarte(s) || 'Słucham…') : '') };
    });
    await sprobuj('„Powiedz” — zawsze jasny komunikat (nigdy cisza)', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/asystent' });
      await s.klik('#przycisk-mow');
      let komunikat = null;
      for (let i = 0; i < 70 && !komunikat; i++) { await czekaj(100); komunikat = await oknoOtwarte(s); }
      const status = await s.js(`document.getElementById('status-mowy').textContent`);
      return komunikat ? { ok: 'komunikat: „' + komunikat.slice(0, 90) + '”' } : { blad: 'po 7 s brak komunikatu (status: „' + status + '”)' };
    });
    await sprobuj('Podwójne kliknięcie „Powiedz” — jeden start, komunikat zamiast ciszy', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/asystent' });
      await s.klik('#przycisk-mow', { ile: 2, czekaj: 50 });
      let komunikat = null;
      for (let i = 0; i < 70 && !komunikat; i++) { await czekaj(100); komunikat = await oknoOtwarte(s); }
      const status = await s.js(`document.getElementById('status-mowy').hidden ? '' : document.getElementById('status-mowy').textContent`);
      return komunikat || status ? { ok: komunikat ? 'komunikat: „' + komunikat.slice(0, 80) + '”' : 'słucha: „' + status + '”' } : { blad: 'po podwójnym kliknięciu nic się nie dzieje (włączył się i od razu wyłączył)' };
    }, 'drobny');
    await sprobuj('Szybkie klikanie dolnego paska i „Wstecz” — bez błędów', async () => {
      await otworz(s, ctx.baza, { osoba: 'ola', trasa: '/dokumenty' });
      for (const z of ['Usługi', 'Asystent', 'Kod QR', 'Więcej', 'Dokumenty', 'Usługi', 'Więcej']) await s.klikTekst(z, { zakres: '#nawigacja', czekaj: 15 });
      await czekaj(200);
      const h = await trasa(s), bl = s.bledyKonsoli.splice(0);
      return h === '#/wiecej' && !bl.length ? { ok: 'ostatnia zakładka: Więcej' } : { blad: h + ' ' + bl.join(' / ') };
    });
    await sprobuj('Podwójne kliknięcie „Dalej” w kroku 1 sprawy A — jeden krok dalej', async () => {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zgubione' });
      await zaznacz(s, 'zginelo', 'dowod');
      await s.klikTekst('Dalej', { ile: 2, czekaj: 300 });
      const h = await trasa(s);
      return /krok-2$/.test(h) ? { ok: 'krok 2' } : { blad: 'jest ' + h };
    });
    await s.zamknij();
  }
};
