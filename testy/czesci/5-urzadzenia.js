/* CZĘŚĆ 5 — urządzenia i wyświetlanie.
   Mały telefon 320 × 568, telefon poziomo 844 × 390, tablet 768 × 1024, komputery (1920 × 1080 i typowe laptopy),
   otwarta klawiatura ekranowa, powiększenie 200%, systemowy tryb ciemny, „ogranicz ruch”, zablokowane Google Fonts.
   (Pełna siatka rozmiarów tekstu × motywów × trybu prostego jest w „Kontroli”.) */
'use strict';
const { otworz, przygotuj } = require('../lib/aplikacja');
const { obejdz, sprawdzEkran } = require('../lib/przejscie');
const { idzDo, klikJs, ustawPole } = require('../lib/ekrany');
const { czekaj } = require('../lib/przegladarka');

const NAZWA = 'Część 5 — urządzenia i wyświetlanie';

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const W = (p, ok, sz, waga) => ctx.wynik(NAZWA, p, ok, sz, waga);
    const podsumuj = (bledy) => { const u = [...new Set(bledy.map((b) => b.replace(/\d+(\.\d+)?/g, '#')))]; return u.length + ' rodzajów błędów: ' + bledy.slice(0, 6).join(' · '); };

    /* ---------- 1. Urządzenia: wszystkie ekrany ---------- */
    const urzadzenia = [
      ['Mały telefon 320 × 568', 320, 568, true], ['Telefon poziomo 844 × 390 (bardzo niski ekran)', 844, 390, true],
      ['Tablet 768 × 1024', 768, 1024, true], ['Komputer 1920 × 1080', 1920, 1080, false],
      ['Laptop 1536 × 730 (ekran 1536 × 864, powiększenie systemu 125%)', 1536, 730, false], ['Laptop 1366 × 650', 1366, 650, false]
    ];
    const osoby = [{ osoba: 'tomasz', tekst: 'standardowy', motyw: 'jasny', prosty: false }, { osoba: 'halina', tekst: 'duzy', motyw: 'jasny', prosty: true }, { osoba: 'ola', tekst: 'bardzo-duzy', motyw: 'ciemny', prosty: false }];
    for (const [opis, szer, wys, mobile] of urzadzenia) {
      const s = await ctx.przegladarka.nowaStrona({ szer, wys, mobile });
      for (const o of (szer >= 1366 ? osoby.slice(0, 1) : osoby)) {
        const nazwa = opis + ': ' + o.osoba + ' (' + o.tekst + ', ' + o.motyw + (o.prosty ? ', tryb prosty' : '') + ') — wszystkie ekrany';
        try {
          const w = await obejdz(s, ctx, Object.assign({ opis }, o));
          W(nazwa, !w.bledy.length, w.bledy.length ? w.ekrany + ' ekranów, ' + w.bledy.length + ' błędów; ' + podsumuj(w.bledy) : w.ekrany + ' ekranów bez błędów', 'poważny');
        } catch (e) { W(nazwa, false, 'błąd testu: ' + e.message, 'poważny'); }
      }
      /* Na komputerze i tablecie aplikacja w ramce telefonu (nie rozciągnięta na cały ekran) */
      if (szer >= 496) {
        await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/dokumenty' });
        const r = await s.js(() => { const t = document.querySelector('.telefon').getBoundingClientRect(), e = document.querySelector('.ekran').getBoundingClientRect(); return { szer: Math.round(e.width), wys: Math.round(e.height), ramka: getComputedStyle(document.querySelector('.telefon')).borderRadius !== '0px', lewo: Math.round(t.left), prawo: Math.round(innerWidth - t.right), status: getComputedStyle(document.querySelector('.status')).display !== 'none' }; });
        const ok = wys > 480 ? r.szer <= 414 && r.ramka && Math.abs(r.lewo - r.prawo) <= 2 : true;
        W(opis + ': aplikacja w ramce telefonu na środku ekranu', ok, 'ekran aplikacji ' + r.szer + ' × ' + r.wys + ' px, ramka: ' + (r.ramka ? 'tak' : 'nie') + ', pasek telefonu: ' + (r.status ? 'tak' : 'nie') + (ok ? '' : ' — aplikacja rozciągnięta na całą szerokość okna'), 'poważny');
      }
      await s.zamknij();
    }

    /* ---------- 2. Otwarta klawiatura ekranowa ----------
       Strona ma interactive-widget=resizes-content: na Androidzie okno aplikacji zmniejsza się o klawiaturę.
       Tak samo robimy tu: zmniejszamy wysokość okna (bez emulacji przesuwania widoku, której przeglądarka testowa nie umie). */
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    for (const [opis, wysKl] of [['średni telefon 390 × 844, klawiatura 340 px', 504], ['mały telefon 320 × 568, klawiatura 260 px', 308]]) {
      const szer = /320/.test(opis) ? 320 : 390, wysPelna = /320/.test(opis) ? 568 : 844;
      try {
        await s.ustawRozmiar(szer, wysPelna, { mobile: false });
        await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/dokumenty' });
        await s.klik('#pole-asystenta'); await czekaj(250);
        await s.ustawRozmiar(szer, wysKl, { mobile: false }); await czekaj(250);
        await s.js(`document.activeElement.scrollIntoView({ block: 'nearest' })`); await czekaj(150);
        const r = await s.js(() => {
          const p = document.getElementById('pole-asystenta').getBoundingClientRect(), nav = document.getElementById('nawigacja').getBoundingClientRect();
          const podp = document.getElementById('podpowiedzi-paska');
          const t = document.elementFromPoint(p.left + 20, p.top + p.height / 2);
          return { gora: Math.round(p.top), dol: Math.round(p.bottom), wys: innerHeight, widac: p.top >= 0 && p.bottom <= innerHeight, naWierzchu: !!(t && (t.id === 'pole-asystenta' || t.closest('.pole'))), podpowiedzi: !podp.hidden, nav: Math.round(nav.top) };
        });
        W('Klawiatura otwarta (' + opis + '): pole asystenta widoczne i nie przykryte', r.widac && r.naWierzchu, 'pole ' + r.gora + '–' + r.dol + ' px przy ekranie ' + r.wys + ' px; ' + (r.naWierzchu ? 'na wierzchu' : 'PRZYKRYTE') + '; gotowe pytania: ' + (r.podpowiedzi ? 'widoczne' : 'schowane'), 'poważny');
        ctx.ekran();
        /* Pola formularza sprawy C */
        await s.ustawRozmiar(szer, wysPelna, { mobile: false });
        await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zameldowanie' });
        const zle = [], odstepy = [];
        for (const id of ['m-ulica', 'm-mieszkanie', 'm-kod', 'm-miejscowosc']) {
          await s.ustawRozmiar(szer, wysPelna, { mobile: false }); await czekaj(80);
          await s.klik('#' + id); await czekaj(80);
          await s.ustawRozmiar(szer, wysKl, { mobile: false }); await czekaj(150);
          await s.js(`document.activeElement.scrollIntoView({ block: 'nearest' })`); await czekaj(120);
          const v = await s.js((id) => { const e = document.getElementById(id).getBoundingClientRect(); const lab = document.querySelector('label[for="' + id + '"]').getBoundingClientRect(); const t = document.elementFromPoint(e.left + 10, e.top + e.height / 2); return { widac: e.top >= -1 && e.bottom <= innerHeight + 1, naWierzchu: t && t.id === id, etykieta: lab.bottom > 0, dol: Math.round(innerHeight - e.bottom) }; }, id);
          if (!v.widac || !v.naWierzchu) zle.push(id + (v.widac ? ' przykryte' : ' poza ekranem')); else odstepy.push(v.dol);
        }
        W('Klawiatura otwarta (' + opis + '): pola adresu w sprawie C widoczne', !zle.length, zle.length ? zle.join(', ') : 'każde pole widoczne nad klawiaturą (najmniejszy odstęp od klawiatury: ' + Math.min(...odstepy) + ' px)', 'poważny');
        ctx.ekran();
      } catch (e) { W('Klawiatura otwarta (' + opis + ')', false, 'błąd testu: ' + e.message, 'poważny'); }
    }
    await s.ustawRozmiar(390, 844, { mobile: false });

    /* ---------- 3. Powiększenie 200% (laptop 1280 × 720 → 640 × 360) ---------- */
    try {
      await s.ustawRozmiar(640, 360, { mobile: false });
      const w = await obejdz(s, ctx, { opis: 'Powiększenie 200%', osoba: 'tomasz', tekst: 'standardowy', motyw: 'jasny', prosty: false });
      W('Powiększenie 200% (640 × 360): wszystkie ekrany Tomasza', !w.bledy.length, w.bledy.length ? podsumuj(w.bledy) : w.ekrany + ' ekranów bez błędów', 'poważny');
    } catch (e) { W('Powiększenie 200%', false, 'błąd testu: ' + e.message, 'poważny'); }
    await s.ustawRozmiar(390, 844, { mobile: false });

    /* ---------- 4. Systemowy tryb ciemny: aplikacja zostaje w motywie osoby ---------- */
    try {
      await s.media([{ name: 'prefers-color-scheme', value: 'dark' }]);
      await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/dokumenty' });
      const tlo = await s.js(`getComputedStyle(document.body).backgroundColor`);
      const bledy = [];
      for (const h of ['#/dokumenty', '#/uslugi', '#/sprawa/zameldowanie', '#/wiecej', '#/asystent']) { await idzDo(s, h); const w = await sprawdzEkran(s); ctx.ekran(w.st); bledy.push(...w.bledy.map((b) => h + ': ' + b)); }
      W('Systemowy tryb ciemny: Halina zostaje w motywie jasnym, ekrany czytelne', /243, 244, 247/.test(tlo) && !bledy.length, 'tło ' + tlo + (bledy.length ? '; ' + bledy.slice(0, 4).join(' · ') : '; 5 ekranów bez błędów'), 'poważny');
      await s.media([]);
    } catch (e) { W('Systemowy tryb ciemny', false, 'błąd testu: ' + e.message, 'poważny'); }

    /* ---------- 5. „Ogranicz ruch”: żadnych animacji ---------- */
    try {
      await s.media([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/dokumenty' });
      await czekaj(2300); /* błysk startuje po 2 s */
      const blysk = await s.js(`getComputedStyle(document.querySelector('.karta.przod'), '::after').animationName`);
      await klikJs(s, '.karta.tyl button[data-id="pojazdy"]');
      const anim = await s.js(`document.getAnimations().map((a) => a.animationName || a.transitionProperty || 'animacja').join(', ')`);
      const trans = await s.js(`document.querySelector('.karta.przod').style.transition || getComputedStyle(document.querySelector('.karta.przod')).transitionDuration`);
      await s.js(`document.getElementById('pole-asystenta').focus()`); await czekaj(50);
      const podp = await s.js(`getComputedStyle(document.getElementById('podpowiedzi-paska')).animationName`);
      const ok = blysk === 'none' && !anim && podp === 'none';
      W('„Ogranicz ruch”: bez błysku, bez przesuwania kart, bez animacji podpowiedzi', ok, 'błysk: ' + blysk + '; animacje po dotknięciu karty: ' + (anim || 'brak') + '; przejście karty: ' + trans + '; podpowiedzi: ' + podp, 'poważny');
      await s.media([]);
    } catch (e) { W('„Ogranicz ruch”', false, 'błąd testu: ' + e.message, 'poważny'); }

    /* ---------- 6. Zablokowane Google Fonts: czcionka systemowa, wszystko działa ---------- */
    try {
      await s.blokuj(['*fonts.googleapis.com*', '*fonts.gstatic.com*']);
      for (const [osoba, tekst] of [['tomasz', 'standardowy'], ['halina', 'standardowy'], ['ola', 'standardowy']]) {
        await otworz(s, ctx.baza, { osoba, tekst, prosty: false, trasa: '/dokumenty' });
        const r = await s.js(() => {
          const u = document.querySelector('.uwaga').getBoundingClientRect(), p = document.getElementById('asystent-pasek').getBoundingClientRect();
          return { atkinson: document.fonts.check('16px "Atkinson Hyperlegible"') && [...document.fonts].some((f) => f.status === 'loaded' && /Atkinson/.test(f.family)), zapas: Math.round(p.top - u.bottom) };
        });
        const bledyKonsoli = s.bledyKonsoli.splice(0).filter((b) => !/fonts\.(googleapis|gstatic)\.com|ERR_BLOCKED_BY_CLIENT/.test(b));
        W('Zablokowane Google Fonts (' + osoba + '): czcionka systemowa, bez przewijania widać mDowód, kartę uwagi i pole asystenta', !r.atkinson && r.zapas >= 0 && !bledyKonsoli.length, 'Atkinson wczytany: ' + (r.atkinson ? 'tak' : 'nie') + '; zapas pod kartą uwagi: ' + r.zapas + ' px' + (bledyKonsoli.length ? '; błędy: ' + bledyKonsoli.join(' / ') : ''), 'poważny');
      }
      const w = await obejdz(s, ctx, { opis: 'Bez Google Fonts', osoba: 'tomasz', tekst: 'standardowy', motyw: 'jasny', prosty: false });
      s.bledyKonsoli.splice(0);
      W('Zablokowane Google Fonts: wszystkie ekrany Tomasza', !w.bledy.length, w.bledy.length ? podsumuj(w.bledy) : w.ekrany + ' ekranów bez błędów', 'poważny');
      await s.blokuj([]);
    } catch (e) { W('Zablokowane Google Fonts', false, 'błąd testu: ' + e.message, 'poważny'); }
    await s.zamknij();
  }
};
