/* Asystent uruchomiony poza przeglądarką (ten sam kod: dane.js + asystent.js) — do szybkich testów zdań. */
'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');

function zaladuj(katalog) {
  const sb = { console };
  sb.window = sb;
  vm.createContext(sb);
  for (const f of ['dane.js', 'asystent.js']) vm.runInContext(fs.readFileSync(path.join(katalog, f), 'utf8'), sb, { filename: f });
  return sb;
}
/* To samo, co kontekstAsystenta() w app.js */
function kontekst(sb, osobaId, o) {
  o = o || {};
  const osoba = sb.DANE.osoby[osobaId];
  const wyniki = o.wyniki || { wiadomosci: [] };
  const wiadomosci = wyniki.wiadomosci.concat(osoba.wiadomosci);
  const docs = (o.dokumenty || osoba.dokumenty).map((d) => wyniki.dowodUniewazniony && d.rodzaj === 'dowod' ? Object.assign({}, d, { status: 'Unieważniony' }) : d);
  const nowe = wiadomosci.filter((w) => w.nowa);
  return { osoba, dokumenty: docs, wyniki, wiadomosci, nowe, uwaga: osoba.uwaga, liczbaNowych: nowe.length, pismo: o.pismo || null };
}
/* Czy adres przycisku prowadzi do istniejącego ekranu (te same trasy co w app.js) */
const TRASY = [/^\/osoba$/, /^\/dopasuj$/, /^\/poznaj$/, /^\/dokumenty$/, /^\/dokument\/([\w-]+)$/, /^\/zarzadzaj(\/(kolejnosc|usun|uklad|dodaj))?$/, /^\/uslugi$/,
  /^\/uslugi\/([\w-]+)$/, /^\/asystent$/, /^\/kod-qr$/, /^\/wiecej$/, /^\/wyglad$/, /^\/skrzynka$/, /^\/skrzynka\/([\w-]+)$/, /^\/sprawa\/(zgubione|samochod|zameldowanie)(?:\/krok-(\d))?$/];
function adresDobry(sb, osobaId, href) {
  if (/^(tel|sms):/.test(href)) return true;
  if (!/^#\//.test(href)) return false;
  const sciezka = href.slice(1).split('?')[0];
  if (!TRASY.some((t) => t.test(sciezka))) return false;
  const o = sb.DANE.osoby[osobaId];
  let m;
  if ((m = sciezka.match(/^\/dokument\/([\w-]+)$/))) return o.dokumenty.some((d) => d.id === m[1]);
  if ((m = sciezka.match(/^\/skrzynka\/([\w-]+)$/))) return o.wiadomosci.some((w) => w.id === m[1]);
  if ((m = sciezka.match(/^\/uslugi\/([\w-]+)$/))) return sb.DANE.kategorie.some((k) => k.id === m[1]);
  return true;
}
/* Sprawdza odpowiedź: przyciski (bez ślepego zaułka), adresy, długość */
function ocenOdpowiedz(sb, osobaId, w) {
  const problemy = [];
  const przyciski = (w.przyciski || []).slice();
  if (w.karta) przyciski.push(w.karta.zacznij, w.karta.sam);
  if (!przyciski.length && !w.wybor) problemy.push('ślepy zaułek (bez przycisków)');
  for (const p of przyciski) if (p.href && !adresDobry(sb, osobaId, p.href)) problemy.push('zły adres przycisku „' + p.tekst + '”: ' + p.href);
  const zdania = w.zdania || [];
  if (zdania.length > 2) problemy.push('więcej niż 2 zdania (' + zdania.length + ')');
  for (const z of zdania) { const n = z.split(/\s+/).filter(Boolean).length; if (n > 15) problemy.push('zdanie ma ' + n + ' słów: „' + z + '”'); }
  return problemy;
}

module.exports = { zaladuj, kontekst, adresDobry, ocenOdpowiedz };
