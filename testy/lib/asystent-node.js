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
  const uwagi = kartyUwagi(osoba, wyniki);
  return { osoba, dokumenty: docs, wyniki, wiadomosci, nowe, uwaga: uwagi[0] || null, uwagi, liczbaNowych: nowe.length, pismo: o.pismo || null };
}
/* Uproszczone karty „Wymaga Twojej uwagi” (jak uwagiOsoby() w app.js, stan początkowy i po sprawach) */
function kartyUwagi(osoba, w) {
  const l = [];
  for (const typ of (osoba.uwagi || []).concat(['wizyta-dowod'])) {
    if (typ === 'podatek') l.push(w.oplaty && w.oplaty.podatek && w.oplaty.podatek.zaplacono >= osoba.platnosci.podatek.kwota ?
      { styl: 'ok', etykieta: 'Podatek opłacony', opis: '', href: '#/skrzynka' } : { styl: 'nowe', ikona: 'list', etykieta: 'Nowe pismo', opis: 'Urząd Miasta: podatek od nieruchomości', href: '#/skrzynka/podatek' });
    if (typ === 'oc') l.push({ styl: 'pilne', ikona: 'uwaga', etykieta: 'Kończy się OC', opis: 'OC samochodu kończy się za 12 dni', href: '#/sprawa/samochod' });
    if (typ === 'urodzenie' && !w.dziecko) l.push({ styl: 'pilne', ikona: 'rodzina', etykieta: 'Zgłoś urodzenie dziecka', opis: 'Zostało 15 dni na zgłoszenie.', href: '#/sprawa/urodzenie' });
    if (typ === 'urodzenie' && w.dziecko && !w.swiadczenie800) l.push({ styl: 'nowe', ikona: 'rodzina', etykieta: 'Złóż wniosek o 800 plus', opis: '', href: '#/sprawa/800plus' });
    if (typ === 'zameldowanie') l.push(w.zameldowanie ? { styl: 'ok', etykieta: 'Wniosek o zameldowanie wysłany', opis: '', href: '#/skrzynka' } :
      { styl: 'nowe', ikona: 'dom', etykieta: 'Dokończ zameldowanie', opis: 'Nowy adres jest już wpisany.', href: '#/sprawa/zameldowanie' });
    if (typ === 'wizyta-dowod' && w.wniosekDowod) l.push({ styl: 'nowe', ikona: 'kalendarz', etykieta: 'Wizyta w urzędzie', opis: w.wniosekDowod.wizyta, href: '#/skrzynka/' + w.wniosekDowod.wiadomosc });
  }
  return l;
}
/* Czy adres przycisku prowadzi do istniejącego ekranu (te same trasy co w app.js) */
const TRASY = [/^\/osoba$/, /^\/dopasuj$/, /^\/poznaj$/, /^\/dokumenty$/, /^\/dokument\/([\w-]+)$/, /^\/zarzadzaj(\/(kolejnosc|usun|uklad|dodaj))?$/, /^\/uslugi$/,
  /^\/uslugi\/([\w-]+)$/, /^\/asystent$/, /^\/kod-qr$/, /^\/wiecej$/, /^\/wyglad$/, /^\/skrzynka$/, /^\/skrzynka\/([\w-]+)$/, /^\/sprawa\/([\w-]+)(?:\/([\w-]+))?$/];
/* Sprawy w prototypie i ich ekrany dodatkowe (bez numeru kroku) */
const SPRAWY = { zgubione: ['znaleziony'], samochod: [], zameldowanie: [], podatek: [], mandat: [], stluczka: ['112', 'policja'], szkoda: [], 'wniosek-dowod': [],
  'cofnij-pesel': [], 'kupno-auta': ['pcc'], urodzenie: [], '800plus': [], 'karta-rodziny': [], cert: [], odpis: [] };
function adresDobry(sb, osobaId, href) {
  if (/^(tel|sms):/.test(href)) return true;
  if (!/^#\//.test(href)) return false;
  const sciezka = href.slice(1).split('?')[0];
  if (!TRASY.some((t) => t.test(sciezka))) return false;
  const o = sb.DANE.osoby[osobaId];
  let m;
  if ((m = sciezka.match(/^\/dokument\/([\w-]+)$/))) return o.dokumenty.some((d) => d.id === m[1]);
  if ((m = sciezka.match(/^\/skrzynka\/([\w-]+)$/))) return o.wiadomosci.some((w) => w.id === m[1]) || /-\d{10,}/.test(m[1]);
  if ((m = sciezka.match(/^\/uslugi\/([\w-]+)$/))) return sb.DANE.kategorie.some((k) => k.id === m[1]);
  if ((m = sciezka.match(/^\/sprawa\/([\w-]+)(?:\/([\w-]+))?$/))) return !!SPRAWY[m[1]] && (!m[2] || /^krok-\d+$/.test(m[2]) || SPRAWY[m[1]].indexOf(m[2]) >= 0);
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

module.exports = { zaladuj, kontekst, adresDobry, ocenOdpowiedz, SPRAWY };
