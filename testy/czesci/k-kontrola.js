/* KONTROLA — pełna „Kontrola” ze SPECYFIKACJA.md (po każdym etapie):
   - trzy rozmiary tekstu × trzy motywy × trzy osoby, przy 390 px i 320 px, tryb prosty, powiększenie 200%,
     ramka telefonu na komputerze — na każdym ekranie: tekst min. 16 px, kontrast tekstu min. 4,5:1 (ikony 3:1),
     elementy klikalne min. 48 px, nic się nie nakłada i nie wychodzi poza ekran;
   - przy tekście Standardowym na 390 × 844 bez przewijania widać mDowód, kartę „Wymaga Twojej uwagi” i pole asystenta;
   - asystent: test zrozumienia (co najmniej 150 zdań dla trzech osób), 0 ślepych zaułków.
   Martwe kliknięcia — Część 7, działanie po dwukliku — Część 8, każda sprawa każdą drogą — Część 1. */
'use strict';
const fs = require('fs');
const path = require('path');
const { obejdz } = require('../lib/przejscie');
const { otworz, OSOBY, TEKSTY, MOTYWY } = require('../lib/aplikacja');
const { zaladuj, kontekst, ocenOdpowiedz } = require('../lib/asystent-node');

const NAZWA = 'Kontrola (pełna, ze specyfikacji)';

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const W = (p, ok, sz, waga) => ctx.wynik(NAZWA, p, ok, sz, waga);
    /* ---------- 1. Zestawy wyglądu ---------- */
    const zestawy = [];
    const osoby = Object.keys(OSOBY);
    for (const [szer, wys, opis] of [[390, 844, '390 px'], [320, 700, '320 px']]) {
      for (const osoba of osoby) for (const tekst of TEKSTY) for (const motyw of (ctx.szybko ? ['jasny'] : MOTYWY)) zestawy.push({ szer, wys, opis, osoba, tekst, motyw, prosty: false });
    }
    for (const osoba of osoby) for (const motyw of (ctx.szybko ? ['kontrast'] : MOTYWY)) zestawy.push({ szer: 390, wys: 844, opis: 'tryb prosty 390 px', osoba, tekst: 'duzy', motyw, prosty: true });
    for (const osoba of osoby) for (const tekst of (ctx.szybko ? ['bardzo-duzy'] : TEKSTY)) zestawy.push({ szer: 640, wys: 360, opis: 'powiększenie 200%', osoba, tekst, motyw: 'jasny', prosty: false });
    for (const osoba of osoby) zestawy.push({ szer: 1280, wys: 900, opis: 'komputer, ramka telefonu', osoba, tekst: { halina: 'duzy', tomasz: 'standardowy', ola: 'standardowy' }[osoba], motyw: { halina: 'jasny', tomasz: 'jasny', ola: 'ciemny' }[osoba], prosty: osoba === 'halina' });
    const RAZEM = 4;
    const strony = [];
    /* Każda karta we własnym profilu (jak okno prywatne): bez wspólnej pamięci, żeby karty nie nadpisywały sobie ustawień */
    for (let i = 0; i < RAZEM; i++) strony.push(await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844, prywatna: true }));
    let nr = 0, ekrany = 0;
    const wynikiZestawow = [];
    const praca = async (s) => {
      while (nr < zestawy.length) {
        const z = zestawy[nr++];
        const nazwa = z.opis + ': ' + z.osoba + ', ' + z.tekst + ', ' + z.motyw + (z.prosty ? ', prosty' : '');
        try {
          await s.ustawRozmiar(z.szer, z.wys);
          const w = await obejdz(s, ctx, Object.assign({ opis: nazwa }, z));
          ekrany += w.ekrany;
          wynikiZestawow.push([nazwa, w.ekrany, w.bledy]);
        } catch (e) { wynikiZestawow.push([nazwa, 0, ['błąd testu: ' + e.message]]); }
      }
    };
    await Promise.all(strony.map(praca));
    const grupy = {};
    for (const [nazwa, n, bledy] of wynikiZestawow) {
      const g = nazwa.split(':')[0];
      grupy[g] = grupy[g] || { zestawy: 0, ekrany: 0, bledy: [] };
      grupy[g].zestawy++; grupy[g].ekrany += n; grupy[g].bledy.push(...bledy.map((b) => nazwa.split(': ')[1] + ' — ' + b));
    }
    for (const [g, d] of Object.entries(grupy)) {
      W('Kontrola ' + g + ': ' + d.zestawy + ' zestawów, ' + d.ekrany + ' ekranów (tekst ≥ 16 px, kontrast ≥ 4,5:1, ikony ≥ 3:1, cele ≥ 48 px, nic się nie nakłada ani nie wychodzi poza ekran)',
        !d.bledy.length, d.bledy.length ? d.bledy.length + ' błędów: ' + d.bledy.slice(0, 8).join(' · ') : '0 błędów', 'poważny');
    }
    ctx.stat.inne['Kontrola: zestawy i ekrany'] = zestawy.length + ' zestawów, ' + ekrany + ' ekranów';

    /* ---------- 2. Bez przewijania: mDowód, karta uwagi i pole asystenta (390 × 844, tekst Standardowy) ---------- */
    const s = strony[0];
    await s.ustawRozmiar(390, 844);
    const zapasy = [];
    let zleZapasy = 0;
    for (const osoba of osoby) for (const motyw of MOTYWY) for (const prosty of [false, true]) {
      await otworz(s, ctx.baza, { osoba, tekst: 'standardowy', motyw, prosty, trasa: '/dokumenty' });
      const r = await s.js(() => { const d = document.querySelector('.karta.przod').getBoundingClientRect(), u = document.querySelector('.uwaga').getBoundingClientRect(), p = document.getElementById('asystent-pasek').getBoundingClientRect(); return { przod: d.top >= 0, zapas: Math.round(p.top - u.bottom) }; });
      zapasy.push(osoba + (prosty ? ' (prosty)' : '') + ' ' + motyw + ': ' + r.zapas + ' px');
      if (r.zapas < 0 || !r.przod) zleZapasy++;
    }
    W('Bez przewijania (390 × 844, tekst Standardowy): mDowód, karta „Wymaga Twojej uwagi” i pole asystenta — 3 osoby × 3 motywy × tryb prosty', !zleZapasy, 'zapas pod kartą uwagi: ' + zapasy.join(', '), 'poważny');
    for (const st of strony) { ctx.konsola(st, NAZWA); await st.zamknij(); }

    /* ---------- 3. Asystent: test zrozumienia (co najmniej 150 zdań × 3 osoby), 0 ślepych zaułków ---------- */
    const sb = zaladuj(ctx.katalog);
    const reg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'zdania-regresja.json'), 'utf8'));
    const nowe = require('../zdania-nowe.js').concat(require('../zdania-sprawy.js'));
    let naTemat = 0, naTematDobrze = 0, nieNaTemat = 0, nieNaTematDobrze = 0, zaulki = 0;
    const off = ['nieznane', 'obelga', 'obcy-jezyk', 'polityka', 'cudze-dane'];
    for (const o of ['halina', 'tomasz', 'ola']) {
      for (const z of reg) {
        const r = sb.ASYSTENT.rozpoznajSprawe(z.zdanie);
        const jest = z[o].indexOf('+') >= 0 ? r.sprawa + (r.druga ? '+' + r.druga.sprawa : '') : r.sprawa;
        const w = sb.ASYSTENT.odpowiedz(z.zdanie, kontekst(sb, o));
        if (ocenOdpowiedz(sb, o, w).some((p) => /zaułek/.test(p))) zaulki++;
        if (z.grupa === 'nie na temat') { nieNaTemat++; if (off.indexOf(r.sprawa) >= 0 && (w.przyciski || []).length) nieNaTematDobrze++; }
        else { naTemat++; if (jest === z[o]) naTematDobrze++; }
      }
      for (const [grupa, zdanie, oczek] of nowe) {
        const r = sb.ASYSTENT.rozpoznajSprawe(zdanie);
        const w = sb.ASYSTENT.odpowiedz(zdanie, kontekst(sb, o));
        if (ocenOdpowiedz(sb, o, w).some((p) => /zaułek/.test(p))) zaulki++;
        const dobrze = oczek.some((x) => x.indexOf('+') >= 0 ? r.sprawa + (r.druga ? '+' + r.druga.sprawa : '') === x : r.sprawa === x);
        if (oczek.every((x) => off.indexOf(x) >= 0)) { nieNaTemat++; if (dobrze && (w.przyciski || []).length) nieNaTematDobrze++; }
        else { naTemat++; if (dobrze) naTematDobrze++; }
      }
    }
    const proc = Math.round(naTematDobrze / naTemat * 1000) / 10;
    W('Asystent: ' + (reg.length + nowe.length) + ' zdań × 3 osoby — rozpoznane zdania na temat', proc >= 95, naTematDobrze + ' z ' + naTemat + ' (' + String(proc).replace('.', ',') + '%)', 'poważny');
    W('Asystent: zdania nie na temat — uprzejma odpowiedź „nie rozumiem + co umiem” (albo neutralna przy polityce, odmowa przy cudzych danych, informacja o języku)', nieNaTematDobrze === nieNaTemat, nieNaTematDobrze + ' z ' + nieNaTemat, 'poważny');
    W('Asystent: ślepe zaułki', !zaulki, zaulki + ' (każda odpowiedź ma przyciski, kartę sprawy albo pytanie)', 'krytyczny');
  }
};
